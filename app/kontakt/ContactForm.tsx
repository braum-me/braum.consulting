'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { useFormStatus } from 'react-dom'
import Script from 'next/script'
import { ArrowRight, Check, Globe, Server, Brain, Compass, MessageSquare } from 'lucide-react'
import { submitContact, type ContactState } from './actions'

const initialState: ContactState = null

// Cloudflare Turnstile — nur aktiv, wenn der Site-Key gesetzt ist.
// Ohne Key bleibt das Widget aus und das Formular läuft mit Honeypot + Rate-Limit.
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

type FieldErrors = Partial<{
  name: string
  email: string
  message: string
  salutation: string
  subject: string
  scope: string
}>

const SALUTATIONS = [
  { value: 'du',  label: 'Du'  },
  { value: 'sie', label: 'Sie' },
]

const SUBJECTS: Array<{
  value: string
  label: string
  hint:  string
  icon:  typeof Globe
}> = [
  { value: 'marke',     label: 'Marke & Website', hint: 'Brand, Webdesign, SEO',  icon: Globe },
  { value: 'm365',      label: 'IT & Cloud',      hint: 'M365 / Workspace',       icon: Server },
  { value: 'ai',        label: 'AI & Automatisierung', hint: 'Copilot, n8n, RAG',  icon: Brain },
  { value: 'strategie', label: 'Strategie',       hint: 'Sparring, Roadmap',      icon: Compass },
  { value: 'other',     label: 'Anderes',         hint: 'Lass uns reden',         icon: MessageSquare },
]

// Scope statt Budget: gefühlte Projektgröße statt Euro-Bracket.
// Niemand muss zuerst eine Zahl nennen — wer schon einen Rahmen hat,
// schreibt ihn in die Nachricht (Microcopy weist darauf hin).
const SCOPES = [
  { value: 'klein',   label: 'Kleiner Eingriff',     hint: 'eher Tage'    },
  { value: 'projekt', label: 'Ordentliches Projekt', hint: 'eher Wochen'  },
  { value: 'gross',   label: 'Großer Wurf',          hint: 'eher Monate'  },
  { value: 'offen',   label: 'Weiß ich noch nicht',  hint: 'auch ehrlich' },
]

const TIMELINES = [
  { value: 'asap',  label: 'sofort'        },
  { value: 'q1',    label: 'in 1 – 3 Mo.'   },
  { value: 'q2',    label: 'in 3 – 6 Mo.'   },
  { value: 'later', label: 'noch offen'    },
]

const MEETING_TOOLS = [
  { value: 'teams', label: 'Microsoft Teams' },
  { value: 'meet',  label: 'Google Meet'     },
  { value: 'any',   label: 'egal'            },
]

function SubmitButton() {
  const { pending } = useFormStatus()
  const labels = { idle: 'Nachricht senden', pending: 'Wird gesendet …' }
  return (
    <button
      type="submit"
      disabled={pending}
      className="cta-primary inline-flex items-center gap-2 px-7 py-4 font-body font-semibold disabled:cursor-not-allowed disabled:opacity-60"
      style={{
        fontSize: '15px',
        background: 'var(--accent)',
        color: 'var(--on-accent)',
        borderRadius: 'var(--r-sm)',
        boxShadow: 'var(--sh-2)',
      }}
    >
      {pending ? labels.pending : labels.idle}
      {pending ? (
        <span
          aria-hidden
          className="inline-block h-3.5 w-3.5 animate-spin rounded-full"
          style={{
            border: '2px solid rgba(255,255,255,0.25)',
            borderTopColor: 'var(--on-accent)',
          }}
        />
      ) : (
        <ArrowRight size={16} strokeWidth={1.5} />
      )}
    </button>
  )
}

const inputBase: React.CSSProperties = {
  width: '100%',
  padding: '14px 16px',
  background: 'var(--bg-elevated)',
  color: 'var(--fg-default)',
  border: '1px solid var(--border-default)',
  borderRadius: 'var(--r-sm)',
  fontSize: 'var(--t-body)',
  fontFamily: 'var(--font-body)',
  outline: 'none',
}

const labelBase: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-mono)',
  fontSize: 'var(--t-micro)',
  letterSpacing: 'var(--tr-eyebrow)',
  textTransform: 'uppercase',
  color: 'var(--fg-subtle)',
  marginBottom: '12px',
}

const errorTextStyle: React.CSSProperties = {
  marginTop: '8px',
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--t-body-sm)',
  lineHeight: 'var(--lh-body)',
  color: 'var(--error-fg)',
}

function fieldStyle(hasError: boolean): React.CSSProperties {
  return hasError
    ? { ...inputBase, border: '1px solid rgba(227, 114, 97, 0.55)' }
    : inputBase
}

function pillStyle(active: boolean): React.CSSProperties {
  return {
    padding: '10px 16px',
    fontSize: 'var(--t-body-sm)',
    fontFamily: 'var(--font-body)',
    background: active ? 'rgba(200, 98, 42, 0.14)' : 'var(--bg-elevated)',
    color: active ? 'var(--accent)' : 'var(--fg-muted)',
    border: '1px solid ' + (active ? 'rgba(200, 98, 42, 0.46)' : 'var(--border-default)'),
    borderRadius: 'var(--r-pill)',
    cursor: 'pointer',
    transition: 'all 220ms cubic-bezier(0.16, 1, 0.3, 1)',
    fontWeight: active ? 600 : 400,
  }
}

function cardStyle(active: boolean): React.CSSProperties {
  return {
    padding: '16px',
    background: active ? 'rgba(200, 98, 42, 0.10)' : 'var(--bg-elevated)',
    color: 'var(--fg-default)',
    border: '1px solid ' + (active ? 'rgba(200, 98, 42, 0.46)' : 'var(--border-default)'),
    borderRadius: 'var(--r-sm)',
    cursor: 'pointer',
    transition: 'all 220ms cubic-bezier(0.16, 1, 0.3, 1)',
    width: '100%',
    textAlign: 'left',
  }
}

export default function ContactForm({
  prefill,
}: {
  /** Optionale Vorbelegung aus URL-Kontext (z.B. nach einem Werkzeug-Check). */
  prefill?: { subject?: string; message?: string }
} = {}) {
  const [state, formAction] = useActionState(submitContact, initialState)

  const v = state && !state.ok ? state.values : undefined

  const [salutation, setSalutation] = useState(v?.salutation ?? 'du')
  const [subject,    setSubject]    = useState(v?.subject    ?? prefill?.subject ?? '')
  const [scope,      setScope]      = useState(v?.scope      ?? '')
  const [timeline,   setTimeline]   = useState(v?.timeline   ?? '')
  const [meeting,    setMeeting]    = useState(v?.meeting    ?? '')

  // Controlled — sonst resettet React 19 die Felder nach jeder Form-Action
  // (auch bei Validierungs-Abbruch) und alles Getippte ist weg.
  const [name,    setName]    = useState(v?.name    ?? '')
  const [company, setCompany] = useState(v?.company ?? '')
  const [email,   setEmail]   = useState(v?.email   ?? '')
  const [phone,   setPhone]   = useState(v?.phone   ?? '')
  const [message, setMessage] = useState(v?.message ?? prefill?.message ?? '')

  const [errors, setErrors] = useState<FieldErrors>({})
  const successRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  function clearError(field: keyof FieldErrors) {
    setErrors(prev => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  // Validierung eines einzelnen Feldes aus dem aktuellen State. Wird für die
  // Live-Prüfung onBlur und für den finalen Submit-Check genutzt.
  function validateField(field: keyof FieldErrors): string | undefined {
    switch (field) {
      case 'salutation': return salutation ? undefined : 'Bitte wähle eine Anrede.'
      case 'subject':    return subject ? undefined : 'Bitte wähle ein Anliegen.'
      case 'name':       return name.trim().length >= 2 ? undefined : 'Bitte trag deinen Namen ein.'
      case 'email':
        if (!email.trim()) return 'Bitte trag deine E-Mail-Adresse ein.'
        return EMAIL_RE.test(email.trim()) ? undefined : 'Diese E-Mail-Adresse sieht nicht gültig aus.'
      case 'message':    return message.trim().length >= 12 ? undefined : 'Ein paar Worte mehr helfen mir — mindestens 12 Zeichen.'
      case 'scope':      return scope ? undefined : 'Bitte einordnen — „Weiß ich noch nicht" zählt auch.'
      default: return undefined
    }
  }

  // Live-Validierung beim Verlassen eines Feldes.
  function handleBlur(field: keyof FieldErrors) {
    const err = validateField(field)
    setErrors(prev => {
      const next = { ...prev }
      if (err) next[field] = err
      else delete next[field]
      return next
    })
  }

  // Nach erfolgreichem Absenden zur Bestätigung hochscrollen — sonst steht die
  // „Angekommen"-Box oberhalb des Viewports.
  useEffect(() => {
    if (state?.ok) {
      successRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [state?.ok])

  // Wrappt die Server-Action: validiert clientseitig anhand der FormData
  // und bricht ohne Server-Roundtrip ab, wenn etwas fehlt.
  function handleAction(data: FormData) {
    const next: FieldErrors = {}
    for (const field of ['salutation', 'subject', 'scope', 'name', 'email', 'message'] as const) {
      const err = validateField(field)
      if (err) next[field] = err
    }

    if (Object.keys(next).length > 0) {
      setErrors(next)
      // bei Fehler zum Formular-Anfang, falls die Hinweise außerhalb des Viewports liegen
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }

    setErrors({})
    return formAction(data)
  }

  if (state?.ok) {
    return (
      <div
        ref={successRef}
        className="p-10 md:p-14"
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--r-md)',
          scrollMarginTop: '120px',
        }}
      >
        <div
          className="inline-flex h-12 w-12 items-center justify-center"
          style={{
            background: 'var(--success-bg)',
            color: 'var(--success-fg)',
            borderRadius: 'var(--r-pill)',
          }}
        >
          <Check size={20} strokeWidth={1.5} />
        </div>
        <h3
          className="mt-6 font-display font-bold"
          style={{
            fontSize: 'clamp(24px, 2.4vw, 36px)',
            lineHeight: 1.2,
            letterSpacing: 'var(--tr-heading)',
            color: 'var(--fg-default)',
          }}
        >
          Angekommen.
        </h3>
        <p
          className="mt-4 max-w-[460px] font-body"
          style={{
            fontSize: 'var(--t-body)',
            lineHeight: 'var(--lh-body)',
            color: 'var(--fg-muted)',
          }}
        >
          {salutation === 'sie'
            ? 'Ihre Anfrage ist da. Ich melde mich innerhalb von 48 Stunden mit einer ersten Einschätzung oder einem Terminvorschlag — eine Bestätigung liegt schon in Ihrem Postfach.'
            : 'Deine Anfrage ist da. Ich melde mich innerhalb von 48 Stunden mit einer ersten Einschätzung oder einem Terminvorschlag — eine Bestätigung liegt schon in deinem Postfach.'}
        </p>
      </div>
    )
  }

  return (
    <form ref={formRef} action={handleAction} className="space-y-10" noValidate style={{ scrollMarginTop: '120px' }}>
      {state && !state.ok && (
        <div
          role="alert"
          className="p-5"
          style={{
            background: 'var(--error-bg)',
            color: 'var(--error-fg)',
            border: '1px solid rgba(227, 114, 97, 0.32)',
            borderRadius: 'var(--r-sm)',
            fontSize: 'var(--t-body-sm)',
          }}
        >
          {state.error}
        </div>
      )}

      {/* Honeypot */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: '-9999px',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        }}
      >
        <label htmlFor="website-hp">Website (bitte leer lassen)</label>
        <input
          id="website-hp"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
        />
      </div>

      {/* Anrede */}
      <fieldset className="space-y-3">
        <legend style={labelBase}>Wie sollen wir uns ansprechen?</legend>
        <div className="flex gap-2">
          {SALUTATIONS.map(s => (
            <button
              key={s.value}
              type="button"
              onClick={() => { setSalutation(s.value); clearError('salutation') }}
              style={pillStyle(salutation === s.value)}
            >
              {s.label}
            </button>
          ))}
        </div>
        <input type="hidden" name="salutation" value={salutation} />
        {errors.salutation && <p role="alert" style={errorTextStyle}>{errors.salutation}</p>}
      </fieldset>

      {/* Service */}
      <fieldset className="space-y-3">
        <legend style={labelBase}>Worum geht's? *</legend>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
          {SUBJECTS.map(s => {
            const Icon = s.icon
            const active = subject === s.value
            return (
              <button
                key={s.value}
                type="button"
                onClick={() => { setSubject(s.value); clearError('subject') }}
                style={cardStyle(active)}
              >
                <div className="flex items-start gap-3">
                  <Icon
                    size={18}
                    strokeWidth={1.5}
                    style={{ color: active ? 'var(--accent)' : 'var(--brand)', marginTop: '2px' }}
                  />
                  <div>
                    <p
                      className="font-body font-semibold"
                      style={{
                        fontSize: 'var(--t-body-sm)',
                        color: 'var(--fg-default)',
                      }}
                    >
                      {s.label}
                    </p>
                    <p
                      className="mt-1 font-mono"
                      style={{
                        fontSize: '11px',
                        color: 'var(--fg-subtle)',
                        letterSpacing: '0.01em',
                      }}
                    >
                      {s.hint}
                    </p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
        <input type="hidden" name="subject" value={subject} />
        {errors.subject && <p role="alert" style={errorTextStyle}>{errors.subject}</p>}
      </fieldset>

      {/* Vorhaben-Größe (Scope statt Budget) */}
      <fieldset className="space-y-3">
        <legend style={labelBase}>Wie groß ist das Vorhaben — gefühlt? *</legend>
        <div className="flex flex-wrap gap-2">
          {SCOPES.map(s => (
            <button
              key={s.value}
              type="button"
              onClick={() => { setScope(s.value); clearError('scope') }}
              style={{ ...pillStyle(scope === s.value), textAlign: 'left' }}
            >
              <span style={{ display: 'block' }}>{s.label}</span>
              <span
                style={{
                  display: 'block',
                  marginTop: 2,
                  fontSize: 'var(--t-micro)',
                  opacity: 0.65,
                }}
              >
                {s.hint}
              </span>
            </button>
          ))}
        </div>
        <p
          className="font-body"
          style={{ fontSize: 'var(--t-body-sm)', lineHeight: 'var(--lh-body)', color: 'var(--fg-subtle)', margin: 0 }}
        >
          Falls du schon einen Budget-Rahmen im Kopf hast, schreib ihn einfach unten in
          die Nachricht — sonst klären wir das im Gespräch.
        </p>
        <input type="hidden" name="scope" value={scope} />
        {errors.scope && <p role="alert" style={errorTextStyle}>{errors.scope}</p>}
      </fieldset>

      {/* Timeline */}
      <fieldset className="space-y-3">
        <legend style={labelBase}>Wann soll's losgehen? *</legend>
        <div className="flex flex-wrap gap-2">
          {TIMELINES.map(t => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTimeline(t.value)}
              style={pillStyle(timeline === t.value)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <input type="hidden" name="timeline" value={timeline} />
      </fieldset>

      {/* Bevorzugte Meeting-Software */}
      <fieldset className="space-y-3">
        <legend style={labelBase}>Bevorzugte Meeting-Software (optional)</legend>
        <div className="flex flex-wrap gap-2">
          {MEETING_TOOLS.map(m => (
            <button
              key={m.value}
              type="button"
              onClick={() => setMeeting(meeting === m.value ? '' : m.value)}
              style={pillStyle(meeting === m.value)}
            >
              {m.label}
            </button>
          ))}
        </div>
        <input type="hidden" name="meeting" value={meeting} />
      </fieldset>

      {/* Name + Firma */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="name" style={labelBase}>
            Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            value={name}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? 'name-error' : undefined}
            onChange={e => { setName(e.target.value); clearError('name') }}
            onBlur={() => handleBlur('name')}
            style={fieldStyle(!!errors.name)}
          />
          {errors.name && <p id="name-error" role="alert" style={errorTextStyle}>{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="company" style={labelBase}>
            Firma (optional)
          </label>
          <input
            id="company"
            name="company"
            type="text"
            autoComplete="organization"
            value={company}
            onChange={e => setCompany(e.target.value)}
            style={inputBase}
          />
        </div>
      </div>

      {/* E-Mail + Telefon */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="email" style={labelBase}>
            E-Mail *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? 'email-error' : undefined}
            onChange={e => { setEmail(e.target.value); clearError('email') }}
            onBlur={() => handleBlur('email')}
            style={fieldStyle(!!errors.email)}
          />
          {errors.email && <p id="email-error" role="alert" style={errorTextStyle}>{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="phone" style={labelBase}>
            Telefon (optional)
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            style={inputBase}
          />
        </div>
      </div>

      {/* Nachricht */}
      <div>
        <label htmlFor="message" style={labelBase}>
          Worum geht's konkret? *
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          value={message}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? 'message-error' : undefined}
          onChange={e => { setMessage(e.target.value); clearError('message') }}
          onBlur={() => handleBlur('message')}
          style={{ ...fieldStyle(!!errors.message), resize: 'vertical', minHeight: '160px' }}
          placeholder={
            salutation === 'sie'
              ? 'Beschreiben Sie kurz die Situation und was Sie sich vom Erstgespräch erhoffen.'
              : 'Beschreib kurz die Situation und was du dir vom Erstgespräch erhoffst.'
          }
        />
        {errors.message && <p id="message-error" role="alert" style={errorTextStyle}>{errors.message}</p>}
      </div>

      <p
        className="font-body"
        style={{
          fontSize: 'var(--t-body-sm)',
          color: 'var(--fg-subtle)',
          lineHeight: 'var(--lh-body)',
        }}
      >
        Mit dem Absenden stimmst {salutation === 'sie' ? 'Sie' : 'du'} der Verarbeitung
        zur Bearbeitung der Anfrage zu. Details in der{' '}
        <a
          href="/datenschutz"
          className="underline decoration-[var(--border-default)] underline-offset-4 hover:text-[color:var(--fg-default)]"
        >
          Datenschutzerklärung
        </a>
        .
      </p>

      {TURNSTILE_SITE_KEY && (
        <>
          <Script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js"
            strategy="lazyOnload"
          />
          <div
            className="cf-turnstile"
            data-sitekey={TURNSTILE_SITE_KEY}
            data-theme="dark"
          />
        </>
      )}

      <SubmitButton />
    </form>
  )
}
