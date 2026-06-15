'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import Link from 'next/link'
import { ArrowRight, Timer, RotateCcw, Link2, Check } from 'lucide-react'
import TrackedLink from '@/components/layout/TrackedLink'
import { trackEvent } from '@/lib/analytics'
import { EASE, labelStyle, pillStyle, questionCard, resultCard, primaryCtaStyle } from './styles'

/* ── Automatisierungsgrad ──────────────────────────────────────────────── */

const GRADE = [
  { value: 50, label: 'Teilweise (~50 %)' },
  { value: 70, label: 'Größtenteils (~70 %)' },
  { value: 90, label: 'Fast vollständig (~90 %)' },
]

const WORKDAY_HOURS = 8
const WEEKS_PER_YEAR = 46 // Arbeitswochen abzüglich Urlaub/Feiertage — bewusst konservativ

function parsePositive(v: string, max: number): number {
  const n = Number(v.replace(',', '.'))
  if (!Number.isFinite(n) || n <= 0) return 0
  return Math.min(n, max)
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  fontSize: 'var(--t-body)',
  fontFamily: 'var(--font-body)',
  background: 'var(--bg-elevated)',
  color: 'var(--fg-default)',
  border: '1px solid var(--border-default)',
  borderRadius: 8,
}

/**
 * Automatisierungs-ROI-Rechner: Häufigkeit × Dauer × Personen × Grad
 * → gesparte Stunden und Arbeitstage pro Jahr. Bewusst Zeit statt Euro —
 * die Stundenzahl ist ehrlich, ein Stundensatz wäre geraten.
 */
export default function RoiRechner() {
  const reduce = useReducedMotion()
  const [freq, setFreq]       = useState('') // Durchläufe pro Woche
  const [minutes, setMinutes] = useState('') // Minuten pro Durchlauf
  const [people, setPeople]   = useState('') // beteiligte Personen
  const [grade, setGrade]     = useState(0)  // Automatisierungsgrad %
  const [copied, setCopied]   = useState(false)
  const [tracked, setTracked] = useState(false)

  // Geteilten Link übernehmen (?f=&m=&p=&g=)
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search)
    /* eslint-disable react-hooks/set-state-in-effect -- einmaliger URL-Import beim Mount */
    if (sp.get('f')) setFreq(sp.get('f') ?? '')
    if (sp.get('m')) setMinutes(sp.get('m') ?? '')
    if (sp.get('p')) setPeople(sp.get('p') ?? '')
    const g = Number(sp.get('g'))
    if (GRADE.some(x => x.value === g)) setGrade(g)
    /* eslint-enable react-hooks/set-state-in-effect */
    // eslint-disable-next-line react-hooks/exhaustive-deps -- nur beim Mount
  }, [])

  const f = parsePositive(freq, 500)
  const m = parsePositive(minutes, 480)
  const p = parsePositive(people, 500)
  const complete = f > 0 && m > 0 && p > 0 && grade > 0

  const result = useMemo(() => {
    if (!complete) return null
    const hoursPerYear = (f * m * p * WEEKS_PER_YEAR * (grade / 100)) / 60
    return {
      hours: Math.round(hoursPerYear),
      days: Math.round(hoursPerYear / WORKDAY_HOURS),
      perWeek: Math.round((hoursPerYear / WEEKS_PER_YEAR) * 10) / 10,
    }
  }, [complete, f, m, p, grade])

  // URL synchron halten + Ergebnis einmalig tracken
  useEffect(() => {
    const url = new URL(window.location.href)
    if (result) {
      url.searchParams.set('f', String(f)); url.searchParams.set('m', String(m))
      url.searchParams.set('p', String(p)); url.searchParams.set('g', String(grade))
    } else {
      for (const k of ['f', 'm', 'p', 'g']) url.searchParams.delete(k)
    }
    window.history.replaceState(null, '', url)
    if (result && !tracked) {
      trackEvent('werkzeug_roi_result', { hours: result.hours, days: result.days })
      // eslint-disable-next-line react-hooks/set-state-in-effect -- einmaliges Tracking-Flag
      setTracked(true)
    }
  }, [result, f, m, p, grade, tracked])

  function reset() {
    setFreq(''); setMinutes(''); setPeople(''); setGrade(0)
    setCopied(false); setTracked(false)
  }

  function copyLink() {
    navigator.clipboard?.writeText(window.location.href).then(() => {
      setCopied(true)
      trackEvent('werkzeug_share_copied', { tool: 'roi' })
      setTimeout(() => setCopied(false), 2500)
    }).catch(() => {})
  }

  return (
    <div className="flex flex-col" style={{ gap: 20 }}>
      <fieldset style={questionCard}>
        <legend style={labelStyle}>01 · Beschreibe den wiederkehrenden Ablauf</legend>
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          <label className="flex flex-col" style={{ gap: 8 }}>
            <span className="font-body" style={{ fontSize: 13.5, color: 'var(--fg-muted)' }}>Wie oft pro Woche?</span>
            <input type="text" inputMode="decimal" value={freq} onChange={e => setFreq(e.target.value)} placeholder="z. B. 20" style={inputStyle} aria-label="Durchläufe pro Woche" />
          </label>
          <label className="flex flex-col" style={{ gap: 8 }}>
            <span className="font-body" style={{ fontSize: 13.5, color: 'var(--fg-muted)' }}>Minuten pro Durchlauf?</span>
            <input type="text" inputMode="decimal" value={minutes} onChange={e => setMinutes(e.target.value)} placeholder="z. B. 15" style={inputStyle} aria-label="Minuten pro Durchlauf" />
          </label>
          <label className="flex flex-col" style={{ gap: 8 }}>
            <span className="font-body" style={{ fontSize: 13.5, color: 'var(--fg-muted)' }}>Wie viele Personen machen das?</span>
            <input type="text" inputMode="decimal" value={people} onChange={e => setPeople(e.target.value)} placeholder="z. B. 3" style={inputStyle} aria-label="Beteiligte Personen" />
          </label>
        </div>
      </fieldset>

      <fieldset style={questionCard}>
        <legend style={labelStyle}>02 · Wie viel davon ist realistisch automatisierbar?</legend>
        <div className="flex flex-col gap-2 md:flex-row md:flex-wrap">
          {GRADE.map(g => (
            <button key={g.value} type="button" onClick={() => setGrade(g.value)} style={pillStyle(grade === g.value)}>
              {g.label}
            </button>
          ))}
        </div>
      </fieldset>

      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key={`${result.hours}`}
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.5, ease: EASE }}
            style={resultCard}
            aria-live="polite"
          >
            <div className="flex items-center gap-3" style={{ marginBottom: 18 }}>
              <Timer size={22} strokeWidth={1.6} style={{ color: 'var(--brand)' }} />
              <span className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: '0.18em', color: 'var(--brand)' }}>
                Einspar-Potenzial · konservativ gerechnet
              </span>
            </div>

            <h3 className="font-display" style={{ fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1.1, letterSpacing: '-0.02em', color: 'var(--fg-default)', margin: 0 }}>
              ~{result.hours.toLocaleString('de-DE')} Stunden pro Jahr
            </h3>

            <p className="font-body" style={{ marginTop: 14, fontSize: 15.5, lineHeight: 1.65, color: 'var(--fg-muted)' }}>
              Das entspricht rund <strong style={{ color: 'var(--fg-default)' }}>{result.days.toLocaleString('de-DE')} Arbeitstagen</strong> —
              oder {result.perWeek.toLocaleString('de-DE')} Stunden pro Woche, die dein Team für Wertschöpfung statt
              Routine hätte. Gerechnet mit {WEEKS_PER_YEAR} Arbeitswochen und dem gewählten Automatisierungsgrad.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center" style={{ marginTop: 30 }}>
              <TrackedLink
                href={`/kontakt?tool=roi&ergebnis=${encodeURIComponent(`~${result.hours} h/Jahr`)}`}
                event="cta_lagebild_werkzeug_roi"
                className="group transition-transform duration-220 hover:-translate-y-0.5"
                style={primaryCtaStyle}
              >
                Prozess im Lagebild anschauen
                <ArrowRight size={16} strokeWidth={2.25} className="transition-transform duration-220 group-hover:translate-x-0.5" />
              </TrackedLink>
              <Link href="/leistungen/ai" className="font-body" style={{ fontSize: 14, color: 'var(--brand)', textDecoration: 'underline', textDecorationThickness: 1, textUnderlineOffset: 3 }}>
                Wie ich Automatisierung umsetze
              </Link>
            </div>

            <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid rgba(242, 240, 235, 0.08)' }}>
              <p className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: '0.18em', color: 'var(--fg-subtle)', marginBottom: 12 }}>
                Passt dazu
              </p>
              <div className="flex flex-wrap" style={{ gap: 10 }}>
                {[
                  { href: '/lexikon/workflow-automatisierung', label: 'Workflow-Automatisierung im Lexikon' },
                  { href: '/werkzeuge/ki-readiness', label: 'Ist mein Betrieb bereit für KI?' },
                ].map(r => (
                  <Link key={r.href} href={r.href} className="group inline-flex items-center font-body" style={{ gap: 8, fontSize: 13.5, padding: '9px 14px', borderRadius: 'var(--r-pill)', color: 'var(--fg-default)', background: 'rgba(242, 240, 235, 0.05)', border: '1px solid rgba(242, 240, 235, 0.14)' }}>
                    {r.label}
                    <ArrowRight size={13} strokeWidth={1.75} style={{ color: 'var(--brand)' }} className="transition-transform duration-220 group-hover:translate-x-0.5" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center" style={{ marginTop: 22, justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
              <p className="font-body" style={{ fontSize: 12.5, lineHeight: 1.55, color: 'var(--fg-subtle)', margin: 0, flex: 1, minWidth: 220 }}>
                Überschlag, kein Versprechen. Ob sich die Automatisierung wirklich lohnt, hängt am Bau-Aufwand — den klärt ein kurzer Blick auf den Prozess.
              </p>
              <div className="flex items-center" style={{ gap: 18 }}>
                <button type="button" onClick={copyLink} className="font-mono uppercase inline-flex items-center" style={{ gap: 8, fontSize: 11, letterSpacing: '0.12em', color: copied ? 'var(--success-fg)' : 'var(--fg-muted)', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                  {copied ? <Check size={13} strokeWidth={1.75} /> : <Link2 size={13} strokeWidth={1.75} />}
                  {copied ? 'Link kopiert' : 'Ergebnis teilen'}
                </button>
                <button type="button" onClick={reset} className="font-mono uppercase inline-flex items-center" style={{ gap: 8, fontSize: 11, letterSpacing: '0.12em', color: 'var(--fg-muted)', background: 'transparent', border: 'none', cursor: 'pointer' }}>
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
