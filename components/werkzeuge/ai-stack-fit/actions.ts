'use server'

import { Resend } from 'resend'
import { createToolLead } from '@/lib/notion'

const CONTACT_EMAIL = process.env.CONTACT_TO_EMAIL ?? 'info@braum.consulting'

export interface StackLeadInput {
  name: string
  company: string
  email: string
  profileSummary: string
  synergy: number
  aiReadiness: number
  cost: number
  dominantFamily: string
  topPicks: string[]
}

/**
 * AI-Stack-Fit Lead → Resend-Notification an den Operator.
 *
 * Best-effort: Schlägt der Versand fehl (kein API-Key, Resend-Fehler), bricht
 * NICHTS auf User-Seite ab — der PDF-Download ist davon unabhängig. Bewusst
 * keine Notion-Anbindung: die createLead-DB ist auf das Lagebild-Schema
 * zugeschnitten (viele Pflicht-Selects), das passt hier nicht sauber.
 */
export async function submitStackLead(input: StackLeadInput): Promise<{ ok: boolean }> {
  const email = (input.email ?? '').trim()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false }

  const picks = input.topPicks.map(p => `  • ${p}`).join('\n')

  // Strukturierter Lead in der Notion-Leads-DB (best-effort, unabhängig
  // vom Mail-Versand — fehlende NOTION_*-Env macht nur ein Log, keinen Fehler).
  void createToolLead({
    company: input.company,
    email,
    name: input.name,
    tool: 'ai-stack-fit',
    summary: [
      input.profileSummary,
      `Synergie ${input.synergy}/100 · AI-Readiness ${input.aiReadiness}/100 · Richtpreis ${input.cost.toLocaleString('de-DE')} €/Mo · ${input.dominantFamily}`,
      ...input.topPicks,
    ].join('\n'),
  }).catch(err => console.error('[ai-stack-fit lead] notion error', err))

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return { ok: false }

  try {
    const resend = new Resend(apiKey)
    const text = [
      'Neuer AI-Stack-Fit Lead',
      '',
      `Name:         ${input.name}`,
      `Unternehmen:  ${input.company}`,
      `E-Mail:       ${email}`,
      '',
      `Profil:       ${input.profileSummary}`,
      `Synergie:     ${input.synergy}/100`,
      `AI-Readiness: ${input.aiReadiness}/100`,
      `Richtpreis:   ${input.cost.toLocaleString('de-DE')} €/Mo`,
      `Dom. Familie: ${input.dominantFamily}`,
      '',
      'Top-Picks:',
      picks,
    ].join('\n')

    const { error } = await resend.emails.send({
      from: 'Braum Consulting Site <no-reply@braum.consulting>',
      to: [CONTACT_EMAIL],
      replyTo: email,
      subject: `AI-Stack-Fit Lead · ${input.company}`,
      text,
    })
    if (error) {
      console.error('[ai-stack-fit lead] resend error', error)
      return { ok: false }
    }
    return { ok: true }
  } catch (err) {
    console.error('[ai-stack-fit lead] error', err)
    return { ok: false }
  }
}
