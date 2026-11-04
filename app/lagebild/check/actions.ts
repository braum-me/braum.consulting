'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { after } from 'next/server'
import { Resend } from 'resend'

import { consume } from '@/lib/rate-limit'
import {
  createLead,
  updateLeadBriefing,
  type CreateLeadInput,
  type LagebildAnswers,
  type Saeule,
  type Anrede,
} from '@/lib/notion'
import { generateBriefing } from '@/lib/briefing'
import { STEPS } from '@/lib/lagebild-questions'

const CONTACT_EMAIL = process.env.CONTACT_TO_EMAIL ?? 'info@braum.consulting'
const SITE_URL      = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://braum.consulting'

export type LagebildState =
  | { ok: false; error: string; values?: Record<string, string> }
  | { ok: true; token: string }
  | null

const SAEULEN_VALID: readonly Saeule[] = ['marke', 'm365', 'ai', 'strategie']

/* ── Validation Helpers ──────────────────────────────────────────────── */

function require(value: string, name: string): string {
  const trimmed = value.trim()
  if (!trimmed) throw new ValidationError(`${name} fehlt.`)
  return trimmed
}

function requireMin(value: string, name: string, min: number): string {
  const trimmed = value.trim()
  if (trimmed.length < min) {
    throw new ValidationError(`${name} braucht mindestens ${min} Zeichen.`)
  }
  return trimmed
}

function isEmail(value: string): boolean {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)
}

class ValidationError extends Error { constructor(m: string) { super(m); this.name = 'ValidationError' } }

/* ── Form → LagebildAnswers Parser ───────────────────────────────────── */

function parseFormData(formData: FormData): CreateLeadInput {
  // Honeypot
  const honeypot = String(formData.get('website') ?? '').trim()
  if (honeypot.length > 0) {
    throw new ValidationError('Bot-Erkennung ausgelöst.')
  }

  const name              = require(String(formData.get('name')         ?? ''), 'Name')
  const firma             = require(String(formData.get('firma')        ?? ''), 'Firma')
  const email             = require(String(formData.get('email')        ?? ''), 'E-Mail').toLowerCase()
  const rolle             = require(String(formData.get('rolle')        ?? ''), 'Rolle')
  const branche           = require(String(formData.get('branche')      ?? ''), 'Branche')
  const maAnzahl          = require(String(formData.get('maAnzahl')     ?? ''), 'MA-Anzahl')
  const heutigeLage       = requireMin(String(formData.get('heutigeLage') ?? ''), 'Heutige Lage', 40)
  const zielbild          = requireMin(String(formData.get('zielbild')    ?? ''), 'Zielbild', 30)
  const kernfrage         = requireMin(String(formData.get('kernfrage')   ?? ''), 'Kernfrage', 15)
  const zeithorizont      = require(String(formData.get('zeithorizont')     ?? ''), 'Zeithorizont')
  const budget            = require(String(formData.get('budget')          ?? ''), 'Budget')
  const entscheidungslage = require(String(formData.get('entscheidungslage') ?? ''), 'Entscheidungslage')
  const anredeRaw         = require(String(formData.get('anrede')          ?? ''), 'Anrede')

  if (!isEmail(email)) throw new ValidationError('E-Mail-Format ungültig.')
  if (anredeRaw !== 'du' && anredeRaw !== 'sie') throw new ValidationError('Anrede ungültig.')

  const anrede = anredeRaw as Anrede

  const bisherigeVersuche = String(formData.get('bisherigeVersuche') ?? '').trim()
  const telefon           = String(formData.get('telefon') ?? '').trim() || undefined

  // Säulen — Multi-Select (Form sendet "saeulen" mehrfach)
  const saeulenRaw = formData.getAll('saeulen').map(String)
  const saeulen    = saeulenRaw.filter((s): s is Saeule => SAEULEN_VALID.includes(s as Saeule))
  if (saeulen.length === 0) throw new ValidationError('Mindestens eine Säule wählen.')

  // Conditional Tiefe-Felder — flach in form, hier zu nested struct
  const tiefe: LagebildAnswers['tiefe'] = {} as LagebildAnswers['tiefe']
  for (const saeule of saeulen) {
    const obj: Record<string, string> = {}
    for (const [key, value] of formData.entries()) {
      const prefix = `tiefe.${saeule}.`
      if (key.startsWith(prefix)) {
        const sub = key.slice(prefix.length)
        const v   = String(value).trim()
        if (v) obj[sub] = v
      }
    }
    if (Object.keys(obj).length > 0) {
      tiefe![saeule] = obj
    }
  }

  return {
    name,
    email,
    firma,
    rolle,
    anrede,
    telefon,
    branche,
    maAnzahl,
    saeulen,
    heutigeLage,
    zielbild,
    kernfrage,
    bisherigeVersuche,
    zeithorizont,
    budget,
    entscheidungslage,
    tiefe: Object.keys(tiefe!).length > 0 ? tiefe : undefined,
    source: 'pfad-a',
  }
}

/* ── Background: Briefing-Gen + E-Mail-Send ──────────────────────────── */

async function generateAndDeliverBriefing(
  leadId: string,
  token: string,
  input: CreateLeadInput,
): Promise<void> {
  const briefingUrl = `${SITE_URL}/briefing/${token}`

  try {
    const { llm } = await generateBriefing(input)
    // Markdown wird im Lead nicht persistiert — der Render liest stateless
    // aus dem Lead und ruft beim ersten Render erneut LLM auf? Nein, das
    // wäre teuer. Wir speichern das Briefing als Block-Children der Notion-Page.
    // FÜR JETZT: Wir cachen den Markdown später in einem Storage-Layer; aktuell
    // generieren wir beim Page-Render bei Bedarf. Für MVP: in Block-Children.
    await persistBriefingBlocks(leadId, llm.text)
    await updateLeadBriefing(leadId, briefingUrl, 'ready')
    await sendBriefingMail(input, briefingUrl)
  } catch (err) {
    console.error('[lagebild] briefing generation failed', err)
    try {
      await updateLeadBriefing(leadId, briefingUrl, 'failed')
    } catch (e) {
      console.error('[lagebild] failed to mark briefing failed', e)
    }
  }
}

/** Speichert das LLM-Markdown als Children der Notion-Page. */
async function persistBriefingBlocks(pageId: string, markdown: string): Promise<void> {
  const { Client } = await import('@notionhq/client')
  const auth = process.env.NOTION_TOKEN
  if (!auth) return
  const notion = new Client({ auth })

  // Notion-Blocks: wir kapseln den ganzen Markdown in einen einzigen
  // Code-Block mit Language "markdown". Das ist robust gegen Notion's
  // Block-Limits und behält die volle Markdown-Struktur für die Permalink-
  // Page, die den Text wieder ausliest und mit react-markdown rendert.
  // Code-Blocks erlauben bis ~2000 Zeichen pro rich_text; wir chunken.
  const CHUNK = 1800
  const chunks: string[] = []
  for (let i = 0; i < markdown.length; i += CHUNK) {
    chunks.push(markdown.slice(i, i + CHUNK))
  }

  await notion.blocks.children.append({
    block_id: pageId,
    children: [
      {
        object: 'block',
        type: 'code',
        code: {
          language: 'markdown',
          rich_text: chunks.map(c => ({
            type: 'text',
            text: { content: c },
          })),
        },
      },
    ] as Parameters<typeof notion.blocks.children.append>[0]['children'],
  })
}

async function sendBriefingMail(input: CreateLeadInput, briefingUrl: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('[lagebild] RESEND_API_KEY missing, mail not sent')
    return
  }
  const resend = new Resend(apiKey)

  const anrede = input.anrede === 'du' ? `Hi ${input.name.split(' ')[0]}` : `Hallo ${input.name}`
  const dirSie = input.anrede === 'du' ? 'dir' : 'Ihnen'
  const deinIhr = input.anrede === 'du' ? 'dein' : 'Ihr'

  const text = [
    anrede + ',',
    '',
    `${deinIhr.charAt(0).toUpperCase() + deinIhr.slice(1)} Lagebild-Briefing für ${input.firma} ist fertig:`,
    '',
    briefingUrl,
    '',
    `Es enthält drei Reibungspunkte, die ich aus ${input.anrede === 'du' ? 'deinen' : 'Ihren'} Antworten lese, eine Roadmap-Skizze mit drei Phasen und Aufwand-Korridoren, plus konkrete erste Schritte für die nächsten 14 Tage.`,
    '',
    `Wenn ${input.anrede === 'du' ? 'du' : 'Sie'} noch keinen Termin gebucht ${input.anrede === 'du' ? 'hast' : 'haben'}: am Ende der Briefing-Seite ist der direkte Link.`,
    '',
    'Bis bald,',
    'Stefan',
    '',
    '— braum.consulting · Operator, kein Berater',
  ].join('\n')

  const html = `
    <div style="font-family:Geist,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.55;color:#1f1e1c;max-width:560px;">
      <p>${anrede},</p>
      <p>${deinIhr.charAt(0).toUpperCase() + deinIhr.slice(1)} Lagebild-Briefing für <strong>${escapeHtml(input.firma)}</strong> ist fertig.</p>
      <p style="margin:24px 0;">
        <a href="${briefingUrl}" style="display:inline-block;background:#C8622A;color:#FBF0EA;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:500;">
          Briefing öffnen
        </a>
      </p>
      <p>Es enthält drei Reibungspunkte aus ${input.anrede === 'du' ? 'deinen' : 'Ihren'} Antworten, eine Roadmap-Skizze und konkrete erste Schritte.</p>
      <p>Wenn ${input.anrede === 'du' ? 'du' : 'Sie'} noch keinen Termin gebucht ${input.anrede === 'du' ? 'hast' : 'haben'}: am Ende der Briefing-Seite ist der Link.</p>
      <p>Bis bald,<br>Stefan</p>
      <p style="color:#6c6862;font-size:13px;margin-top:32px;border-top:1px solid #e5ddc9;padding-top:16px;">
        braum.consulting · Operator, kein Berater
      </p>
    </div>`

  try {
    await resend.emails.send({
      from: 'Braum Consulting <no-reply@braum.consulting>',
      to: [input.email],
      bcc: [CONTACT_EMAIL],
      replyTo: CONTACT_EMAIL,
      subject: `Dein Lagebild-Briefing für ${input.firma}`,
      text,
      html,
    })
  } catch (err) {
    console.error('[lagebild] resend failed', err)
  }
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;',
  }[c]!))
}

/* ── Server-Action Entry ─────────────────────────────────────────────── */

export async function submitLagebild(
  _prev: LagebildState,
  formData: FormData,
): Promise<LagebildState> {
  // Rate-Limit: 3 Submits / Stunde / IP
  const hdrs = await headers()
  const ip =
    hdrs.get('cf-connecting-ip') ??
    hdrs.get('x-real-ip') ??
    hdrs.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown'
  const rl = consume(`lagebild:${ip}`, 3, 5)
  if (!rl.allowed) {
    const minutes = Math.ceil(rl.retryAfterSeconds / 60)
    return {
      ok: false,
      error: `Zu viele Anfragen. Bitte in ${minutes} Minuten erneut versuchen, oder direkt an ${CONTACT_EMAIL} schreiben.`,
    }
  }

  let input: CreateLeadInput
  try {
    input = parseFormData(formData)
  } catch (err) {
    if (err instanceof ValidationError) {
      return { ok: false, error: err.message }
    }
    console.error('[lagebild] parse error', err)
    return { ok: false, error: 'Eingabe konnte nicht verarbeitet werden.' }
  }

  let leadId: string
  let token:  string
  try {
    const result = await createLead(input)
    leadId = result.id
    token  = result.token
  } catch (err) {
    console.error('[lagebild] notion create failed', err)
    return {
      ok: false,
      error: 'Lead konnte nicht angelegt werden. Bitte direkt an info@braum.consulting schreiben.',
    }
  }

  // Briefing-Gen + Mail nach Response, blockiert den User nicht.
  after(generateAndDeliverBriefing(leadId, token, input))

  // Redirect zur Danke-Page mit Token (für Cal-Pre-Fill + Briefing-Link)
  redirect(`/lagebild/danke?token=${encodeURIComponent(token)}`)
}

// Keep ESLint happy when STEPS is imported but not directly used here.
void STEPS
