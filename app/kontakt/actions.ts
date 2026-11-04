'use server'

import { headers } from 'next/headers'
import { Resend } from 'resend'
import { consume } from '@/lib/rate-limit'

const CONTACT_EMAIL = process.env.CONTACT_TO_EMAIL ?? 'info@braum.consulting'

export type ContactState =
  | { ok: false; error: string; values?: Record<string, string> }
  | { ok: true }
  | null

const SUBJECTS: Record<string, string> = {
  marke:     'Marke, Website & Reichweite',
  m365:      'IT & Cloud (M365 / Workspace)',
  ai:        'AI & Automatisierung',
  strategie: 'Digitale Strategie',
  other:     'Allgemeine Anfrage',
}

// Scope statt Budget: fragt die gefühlte Projektgröße ab, nicht Euro.
// Senkt die Hemmschwelle (niemand muss zuerst eine Zahl nennen) und liefert
// fürs Erstgespräch dasselbe Signal. Konkrete Budgets landen — falls
// vorhanden — frei formuliert in der Nachricht.
const SCOPES: Record<string, string> = {
  klein:   'Kleiner Eingriff (eher Tage)',
  projekt: 'Ordentliches Projekt (eher Wochen)',
  gross:   'Großer Wurf (eher Monate)',
  offen:   'Noch unklar',
}

const MEETING_TOOLS: Record<string, string> = {
  teams: 'Microsoft Teams',
  meet:  'Google Meet',
  any:   'egal / keine Präferenz',
}

const TIMELINES: Record<string, string> = {
  asap:      'so bald wie möglich',
  q1:        'in den nächsten 1–3 Monaten',
  q2:        'in 3–6 Monaten',
  later:     'noch offen / strategisch',
}

const SALUTATIONS: Record<string, string> = {
  du: 'Du-Form',
  sie: 'Sie-Form',
}

// Cloudflare Turnstile — server-seitige Token-Verifikation.
// Nur aktiv, wenn TURNSTILE_SECRET_KEY gesetzt ist. Netzfehler werden
// abgefangen und führen nicht zum Crash, sondern zu einer sauberen Meldung.
async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return true // Feature-Flag aus → Schritt überspringen

  try {
    const body = new URLSearchParams()
    body.append('secret', secret)
    body.append('response', token)
    if (ip && ip !== 'unknown') body.append('remoteip', ip)

    const res = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      },
    )
    const data = (await res.json()) as { success?: boolean }
    return data.success === true
  } catch (err) {
    console.error('[contact] turnstile verify exception', err)
    return false
  }
}

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const honeypot = String(formData.get('website') ?? '').trim()
  if (honeypot.length > 0) {
    return { ok: true }
  }

  // Rate-Limit: 5 Submissions / Stunde / IP
  const hdrs = await headers()
  const ip =
    hdrs.get('cf-connecting-ip') ??
    hdrs.get('x-real-ip') ??
    hdrs.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown'
  const rl = consume(`contact:${ip}`, 5, 5)
  if (!rl.allowed) {
    const minutes = Math.ceil(rl.retryAfterSeconds / 60)
    return {
      ok: false,
      error: `Zu viele Anfragen aus diesem Netz. Bitte in ${minutes} Minuten erneut versuchen, oder direkt an ${CONTACT_EMAIL} schreiben.`,
    }
  }

  // Bot-Schutz: Turnstile-Token verifizieren (nur wenn Secret gesetzt).
  if (process.env.TURNSTILE_SECRET_KEY) {
    const token = String(formData.get('cf-turnstile-response') ?? '').trim()
    if (!token || !(await verifyTurnstile(token, ip))) {
      return {
        ok: false,
        error: `Bot-Schutz konnte nicht bestätigt werden. Bitte die Seite neu laden und erneut versuchen, oder direkt an ${CONTACT_EMAIL} schreiben.`,
      }
    }
  }

  const salutation = String(formData.get('salutation') ?? 'du').trim()
  const name       = String(formData.get('name')       ?? '').trim()
  const company    = String(formData.get('company')    ?? '').trim()
  const email      = String(formData.get('email')      ?? '').trim()
  const phone      = String(formData.get('phone')      ?? '').trim()
  const subject    = String(formData.get('subject')    ?? '').trim()
  const scope      = String(formData.get('scope')      ?? '').trim()
  const timeline   = String(formData.get('timeline')   ?? '').trim()
  const meeting    = String(formData.get('meeting')    ?? '').trim()
  const message    = String(formData.get('message')    ?? '').trim()

  const values = { salutation, name, company, email, phone, subject, scope, timeline, meeting, message }

  if (!name || name.length < 2) {
    return { ok: false, error: 'Bitte Namen angeben.', values }
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { ok: false, error: 'Bitte eine gültige E-Mail-Adresse angeben.', values }
  }
  if (!SUBJECTS[subject]) {
    return { ok: false, error: 'Bitte ein Anliegen wählen.', values }
  }
  if (!SCOPES[scope]) {
    return { ok: false, error: 'Bitte einordnen, wie groß sich das Vorhaben anfühlt.', values }
  }
  if (!TIMELINES[timeline]) {
    return { ok: false, error: 'Bitte einen Zeitraum angeben.', values }
  }
  if (!message || message.length < 12) {
    return {
      ok: false,
      error: 'Bitte eine kurze Beschreibung (≥ 12 Zeichen) hinterlassen.',
      values,
    }
  }
  if (!SALUTATIONS[salutation]) {
    return { ok: false, error: 'Bitte Anrede wählen.', values }
  }
  // Meeting-Software ist optional; wenn gesetzt, muss der Wert bekannt sein.
  if (meeting && !MEETING_TOOLS[meeting]) {
    return { ok: false, error: 'Bitte eine gültige Meeting-Software wählen.', values }
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('[contact] RESEND_API_KEY ist nicht gesetzt')
    return {
      ok: false,
      error: 'E-Mail-Versand vorübergehend nicht verfügbar. Bitte später erneut versuchen.',
      values,
    }
  }

  const resend = new Resend(apiKey)
  const subjectLabel = SUBJECTS[subject]

  try {
    const { error } = await resend.emails.send({
      from: 'Braum Consulting Site <no-reply@braum.consulting>',
      to: [CONTACT_EMAIL],
      replyTo: email,
      subject: `[Kontakt] ${subjectLabel} · ${name}${company ? ' · ' + company : ''}`,
      text: [
        `Anrede:    ${SALUTATIONS[salutation]}`,
        `Name:      ${name}`,
        company ? `Firma:     ${company}` : null,
        `E-Mail:    ${email}`,
        phone ? `Telefon:   ${phone}` : null,
        '',
        `Anliegen:  ${subjectLabel}`,
        `Vorhaben:  ${SCOPES[scope]}`,
        `Zeitraum:  ${TIMELINES[timeline]}`,
        meeting ? `Meeting:   ${MEETING_TOOLS[meeting]}` : null,
        '',
        'Nachricht:',
        message,
      ].filter(Boolean).join('\n'),
    })

    if (error) {
      console.error('[contact] resend error', error)
      return {
        ok: false,
        error: `Versand fehlgeschlagen. Bitte direkt an ${CONTACT_EMAIL} schreiben.`,
        values,
      }
    }

    // Auto-Bestätigung an den Absender. Best-effort: ein Fehler hier darf
    // den erfolgreichen Haupt-Flow niemals umkippen.
    try {
      const firstName = name.split(/\s+/)[0] || name
      const sie = salutation === 'sie'
      const greeting = sie ? `Hallo ${name},` : `Hi ${firstName},`
      const body = sie
        ? [
            greeting,
            '',
            'vielen Dank für Ihre Nachricht — sie ist angekommen.',
            'Ich melde mich innerhalb von 48 Stunden mit einer ersten',
            'Einschätzung oder einem Terminvorschlag.',
            '',
            'Diese E-Mail ist eine automatische Eingangsbestätigung.',
            'Auf eine Antwort hierauf müssen Sie nicht warten.',
            '',
            'Viele Grüße',
            'Stefan Braum',
          ]
        : [
            greeting,
            '',
            'danke für deine Nachricht — sie ist angekommen.',
            'Ich melde mich innerhalb von 48 Stunden mit einer ersten',
            'Einschätzung oder einem Terminvorschlag.',
            '',
            'Diese E-Mail ist eine automatische Eingangsbestätigung.',
            'Auf eine Antwort hierauf musst du nicht warten.',
            '',
            'Viele Grüße',
            'Stefan Braum',
          ]

      const { error: confirmError } = await resend.emails.send({
        from: 'Stefan Braum <no-reply@braum.consulting>',
        to: [email],
        replyTo: CONTACT_EMAIL,
        subject: sie
          ? 'Ihre Anfrage ist da — ich melde mich'
          : 'Deine Anfrage ist da — ich melde mich',
        text: body.join('\n'),
      })

      if (confirmError) {
        console.error('[contact] confirmation email error', confirmError)
      }
    } catch (confirmErr) {
      console.error('[contact] confirmation email exception', confirmErr)
    }

    return { ok: true }
  } catch (err) {
    console.error('[contact] exception', err)
    return {
      ok: false,
      error: `Unerwarteter Fehler. Bitte direkt an ${CONTACT_EMAIL} schreiben.`,
      values,
    }
  }
}
