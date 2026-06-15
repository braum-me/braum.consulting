'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import Link from 'next/link'
import { ArrowRight, Gauge, RotateCcw, Link2, Check } from 'lucide-react'
import TrackedLink from '@/components/layout/TrackedLink'
import { trackEvent } from '@/lib/analytics'
import { EASE, labelStyle, pillStyle, questionCard, resultCard, primaryCtaStyle } from './styles'

/* ── Konfig-Typen (serialisierbar → kann aus Server-Page übergeben werden) ── */

export type AssessOption = { value: string; label: string; weight: number; flag?: string }
export type AssessQuestion = { key: string; label: string; options: AssessOption[] }
/** Bänder aufsteigend nach `max`. Gewählt wird das erste mit score ≤ max,
 *  sonst das letzte (Fallback für hohe Scores). */
export type AssessBand = { max: number; name: string; headline: string; note: string }

export type AssessConfig = {
  questions: AssessQuestion[]
  bands: AssessBand[]
  /** Überschrift über der Flag-Liste, z.B. „Wo du noch nachlegen solltest". */
  flagLabel: string
  /** Badge-Präfix, z.B. „Reifegrad" oder „Komplexität". */
  badgePrefix: string
  cta: { href: string; event: string; label: string }
  detail?: { href: string; label: string }
  disclaimer: string
  /** Umami-Event-Name für das Ergebnis. */
  trackName: string
  /** Kurz-ID für den Kontakt-Prefill (z.B. „iso", „ki", „workspace").
   *  Wird als ?tool=…&ergebnis=… an den CTA gehängt. */
  toolId?: string
  /** Cross-Sell: passende nächste Checks/Inhalte, im Ergebnis-Panel gelistet. */
  related?: Array<{ href: string; label: string }>
}

/** Antworten ↔ URL-Param (?r=key.value,key.value) für teilbare Ergebnis-Links. */
function encodeAnswers(questions: AssessQuestion[], answers: Record<string, AssessOption>): string {
  return questions.map(q => `${q.key}.${answers[q.key].value}`).join(',')
}

function decodeAnswers(questions: AssessQuestion[], r: string): Record<string, AssessOption> | null {
  const next: Record<string, AssessOption> = {}
  for (const pair of r.split(',')) {
    const dot = pair.indexOf('.')
    if (dot < 1) return null
    const q = questions.find(x => x.key === pair.slice(0, dot))
    const o = q?.options.find(x => x.value === pair.slice(dot + 1))
    if (!q || !o) return null
    next[q.key] = o
  }
  return Object.keys(next).length === questions.length ? next : null
}

function pickBand(bands: AssessBand[], score: number): AssessBand {
  return bands.find(b => score <= b.max) ?? bands[bands.length - 1]
}

/* ── Generisches gewichtetes Assessment ───────────────────────────────────
   Höhere Gewichte = mehr Aufwand / mehr Lücken. Antworten mit `flag` werden
   im Ergebnis als Hinweise gelistet. Verwendet für ISO-Readiness,
   KI-Readiness und künftige Selbst-Checks. */

export default function Assessment({ config }: { config: AssessConfig }) {
  const reduce = useReducedMotion()
  const [answers, setAnswers] = useState<Record<string, AssessOption>>({})
  const [copied, setCopied] = useState(false)

  const complete = config.questions.every(q => answers[q.key])
  const score = Object.values(answers).reduce((s, o) => s + o.weight, 0)
  const band = complete ? pickBand(config.bands, score) : null
  const flags = Object.values(answers).map(o => o.flag).filter(Boolean) as string[]

  // Geteilten Ergebnis-Link (?r=…) beim Laden übernehmen. Bewusst im Effect
  // (nicht im useState-Initializer), damit Server- und erster Client-Render
  // identisch bleiben — kein Hydration-Mismatch.
  useEffect(() => {
    const r = new URLSearchParams(window.location.search).get('r')
    if (!r) return
    const decoded = decodeAnswers(config.questions, r)
    // eslint-disable-next-line react-hooks/set-state-in-effect -- einmaliger URL-Import beim Mount
    if (decoded) setAnswers(decoded)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- nur beim Mount
  }, [])

  function syncUrl(next: Record<string, AssessOption> | null) {
    const url = new URL(window.location.href)
    if (next) url.searchParams.set('r', encodeAnswers(config.questions, next))
    else url.searchParams.delete('r')
    window.history.replaceState(null, '', url)
  }

  function pick(qKey: string, opt: AssessOption) {
    setAnswers(prev => {
      const next = { ...prev, [qKey]: opt }
      if (config.questions.every(q => next[q.key])) {
        const s = Object.values(next).reduce((sum, o) => sum + o.weight, 0)
        trackEvent(config.trackName, { band: pickBand(config.bands, s).name, score: s })
        syncUrl(next)
      }
      return next
    })
  }

  function reset() {
    setAnswers({})
    setCopied(false)
    syncUrl(null)
  }

  function copyLink() {
    navigator.clipboard?.writeText(window.location.href).then(() => {
      setCopied(true)
      trackEvent('werkzeug_share_copied', { tool: config.toolId ?? config.trackName })
      setTimeout(() => setCopied(false), 2500)
    }).catch(() => {})
  }

  return (
    <div className="flex flex-col" style={{ gap: 20 }}>
      {config.questions.map(q => (
        <fieldset key={q.key} style={questionCard}>
          <legend style={labelStyle}>{q.label}</legend>
          <div className="flex flex-col gap-2 md:flex-row md:flex-wrap">
            {q.options.map(o => (
              <button key={o.value} type="button" onClick={() => pick(q.key, o)} style={pillStyle(answers[q.key]?.value === o.value)}>
                {o.label}
              </button>
            ))}
          </div>
        </fieldset>
      ))}

      <AnimatePresence mode="wait">
        {band && (
          <motion.div
            key={band.name}
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.5, ease: EASE }}
            style={resultCard}
            aria-live="polite"
          >
            <div className="flex items-center gap-3" style={{ marginBottom: 18 }}>
              <Gauge size={22} strokeWidth={1.6} style={{ color: 'var(--brand)' }} />
              <span className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: '0.18em', color: 'var(--brand)' }}>
                {config.badgePrefix} · {band.name}
              </span>
            </div>

            <h3 className="font-display" style={{ fontSize: 'clamp(24px, 3.4vw, 34px)', lineHeight: 1.15, letterSpacing: '-0.02em', color: 'var(--fg-default)', margin: 0 }}>
              {band.headline}
            </h3>

            <p className="font-body" style={{ marginTop: 14, fontSize: 15.5, lineHeight: 1.65, color: 'var(--fg-muted)' }}>
              {band.note}
            </p>

            {flags.length > 0 && (
              <>
                <p className="font-mono uppercase" style={{ marginTop: 26, marginBottom: 12, fontSize: 11, letterSpacing: '0.18em', color: 'var(--fg-subtle)' }}>
                  {config.flagLabel}
                </p>
                <ul className="flex flex-col" style={{ gap: 10, margin: 0, padding: 0, listStyle: 'none' }}>
                  {flags.map((f, i) => (
                    <li key={i} className="flex gap-3" style={{ fontSize: 14.5, lineHeight: 1.55, color: 'var(--fg-default)' }}>
                      <span aria-hidden style={{ color: 'var(--brand)' }}>→</span>
                      <span className="font-body">{f}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center" style={{ marginTop: 30 }}>
              <TrackedLink
                href={config.toolId ? `${config.cta.href}?tool=${config.toolId}&ergebnis=${encodeURIComponent(band.name)}` : config.cta.href}
                event={config.cta.event}
                className="group transition-transform duration-220 hover:-translate-y-0.5"
                style={primaryCtaStyle}
              >
                {config.cta.label}
                <ArrowRight size={16} strokeWidth={2.25} className="transition-transform duration-220 group-hover:translate-x-0.5" />
              </TrackedLink>
              {config.detail && (
                <Link href={config.detail.href} className="font-body" style={{ fontSize: 14, color: 'var(--brand)', textDecoration: 'underline', textDecorationThickness: 1, textUnderlineOffset: 3 }}>
                  {config.detail.label}
                </Link>
              )}
            </div>

            {config.related && config.related.length > 0 && (
              <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid rgba(242, 240, 235, 0.08)' }}>
                <p className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: '0.18em', color: 'var(--fg-subtle)', marginBottom: 12 }}>
                  Passt dazu
                </p>
                <div className="flex flex-wrap" style={{ gap: 10 }}>
                  {config.related.map(r => (
                    <Link
                      key={r.href}
                      href={r.href}
                      className="group inline-flex items-center font-body transition-colors"
                      style={{
                        gap: 8, fontSize: 13.5, padding: '9px 14px', borderRadius: 'var(--r-pill)',
                        color: 'var(--fg-default)', background: 'rgba(242, 240, 235, 0.05)',
                        border: '1px solid rgba(242, 240, 235, 0.14)',
                      }}
                    >
                      {r.label}
                      <ArrowRight size={13} strokeWidth={1.75} style={{ color: 'var(--brand)' }} className="transition-transform duration-220 group-hover:translate-x-0.5" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center" style={{ marginTop: 22, justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
              <p className="font-body" style={{ fontSize: 12.5, lineHeight: 1.55, color: 'var(--fg-subtle)', margin: 0, flex: 1, minWidth: 220 }}>
                {config.disclaimer}
              </p>
              <div className="flex items-center" style={{ gap: 18 }}>
                <button
                  type="button"
                  onClick={copyLink}
                  className="font-mono uppercase inline-flex items-center transition-colors"
                  style={{ gap: 8, fontSize: 11, letterSpacing: '0.12em', color: copied ? 'var(--success-fg)' : 'var(--fg-muted)', background: 'transparent', border: 'none', cursor: 'pointer' }}
                >
                  {copied ? <Check size={13} strokeWidth={1.75} /> : <Link2 size={13} strokeWidth={1.75} />}
                  {copied ? 'Link kopiert' : 'Ergebnis teilen'}
                </button>
                <button
                  type="button"
                  onClick={reset}
                  className="font-mono uppercase inline-flex items-center transition-colors"
                  style={{ gap: 8, fontSize: 11, letterSpacing: '0.12em', color: 'var(--fg-muted)', background: 'transparent', border: 'none', cursor: 'pointer' }}
                >
                  <RotateCcw size={13} strokeWidth={1.75} />
                  Neu starten
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
