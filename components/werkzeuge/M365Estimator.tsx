'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import Link from 'next/link'
import { ArrowRight, Gauge, RotateCcw, Link2, Check } from 'lucide-react'
import TrackedLink from '@/components/layout/TrackedLink'
import { trackEvent } from '@/lib/analytics'
import { EASE, labelStyle, pillStyle, questionCard, resultCard, primaryCtaStyle } from './styles'

/* ── Fragen & Gewichte ─────────────────────────────────────────────────── */

type Option = { value: string; label: string; weight: number; driver?: string }
type Question = { key: string; label: string; options: Option[] }

const QUESTIONS: Question[] = [
  {
    key: 'ausgangslage',
    label: '01 · Wie sieht deine heutige Umgebung aus?',
    options: [
      { value: 'sauber',    label: 'Aufgeräumt und dokumentiert', weight: 0 },
      { value: 'gewachsen', label: 'Über die Jahre gewachsen, teils unklar', weight: 2, driver: 'Gewachsene Altlast — viel Zeit geht in die Bestandsaufnahme.' },
      { value: 'wildwuchs', label: 'Wildwuchs mit viel Schatten-IT', weight: 4, driver: 'Schatten-IT und undokumentierte Altlast treiben den Aufwand stark.' },
    ],
  },
  {
    key: 'nutzer',
    label: '02 · Wie viele Nutzer ziehen um?',
    options: [
      { value: 's',  label: 'Unter 25', weight: 0 },
      { value: 'm',  label: '25–100', weight: 1 },
      { value: 'l',  label: '100–250', weight: 2, driver: 'Viele Postfächer und Daten verlängern die Migrationsphase.' },
      { value: 'xl', label: 'Über 250', weight: 3, driver: 'Hohe Nutzerzahl — Migration in Wellen, mehr Koordination.' },
    ],
  },
  {
    key: 'identitaet',
    label: '03 · Wie ist eure Identität heute organisiert?',
    options: [
      { value: 'cloud', label: 'Schon in Entra ID / Cloud', weight: 0 },
      { value: 'ad1',   label: 'Ein lokales Active Directory', weight: 1 },
      { value: 'adn',   label: 'Mehrere lokale ADs / Standorte', weight: 3, driver: 'Mehrere Verzeichnisse zu konsolidieren ist der am meisten unterschätzte Posten.' },
    ],
  },
  {
    key: 'compliance',
    label: '04 · Welche Compliance-Anforderungen gelten?',
    options: [
      { value: 'keine',     label: 'Keine besonderen', weight: 0 },
      { value: 'dsgvo',     label: 'DSGVO-sensibel (Personaldaten etc.)', weight: 1 },
      { value: 'reguliert', label: 'Reguliert (NIS2, ISO 27001, TISAX)', weight: 3, driver: 'Regulatorik bestimmt die Architektur — von Anfang an mitzudenken spart teures Nachrüsten.' },
    ],
  },
  {
    key: 'ziel',
    label: '05 · Was ist das Ziel?',
    options: [
      { value: 'lift',  label: 'Schnell umziehen (Lift-and-Shift)', weight: 0 },
      { value: 'modern', label: 'Auf dem Weg modernisieren', weight: 2, driver: 'Modernisieren kostet im Projekt mehr — spart aber danach.' },
    ],
  },
]

/* ── Bänder ────────────────────────────────────────────────────────────── */

type Band = { name: string; weeks: string; note: string }

function band(score: number): Band {
  if (score <= 3)  return { name: 'Schlank',       weeks: 'ca. 4–8 Wochen',   note: 'Überschaubare Umgebung, klarer Schnitt. Hier ist der Umzug eher Routine als Projekt.' }
  if (score <= 7)  return { name: 'Überschaubar',  weeks: 'ca. 8–14 Wochen',  note: 'Solide Mittelklasse. Mit sauberer Vorbereitung gut planbar, ohne große Überraschungen.' }
  if (score <= 11) return { name: 'Komplex',       weeks: 'ca. 14–20 Wochen', note: 'Mehrere Treiber kommen zusammen. Phasenplan und Co-Existence halten den Betrieb störungsfrei.' }
  return { name: 'Sehr komplex', weeks: 'ca. 20+ Wochen, mehrphasig', note: 'Hier ist die Migration ein echtes Programm. Erst Lagebild, dann ein Schnitt in Wellen — nicht in einem Rutsch.' }
}

/* ── Komponente ────────────────────────────────────────────────────────── */

export default function M365Estimator() {
  const reduce = useReducedMotion()
  const [answers, setAnswers] = useState<Record<string, Option>>({})
  const [copied, setCopied] = useState(false)

  const complete = QUESTIONS.every(q => answers[q.key])
  const score = Object.values(answers).reduce((sum, o) => sum + o.weight, 0)
  const result = complete ? band(score) : null
  const drivers = Object.values(answers).map(o => o.driver).filter(Boolean) as string[]

  // Geteilten Ergebnis-Link (?r=key.value,…) beim Laden übernehmen.
  useEffect(() => {
    const r = new URLSearchParams(window.location.search).get('r')
    if (!r) return
    const next: Record<string, Option> = {}
    for (const pair of r.split(',')) {
      const dot = pair.indexOf('.')
      const q = QUESTIONS.find(x => x.key === pair.slice(0, dot))
      const o = q?.options.find(x => x.value === pair.slice(dot + 1))
      if (q && o) next[q.key] = o
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- einmaliger URL-Import beim Mount
    if (Object.keys(next).length === QUESTIONS.length) setAnswers(next)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- nur beim Mount
  }, [])

  function syncUrl(next: Record<string, Option> | null) {
    const url = new URL(window.location.href)
    if (next) url.searchParams.set('r', QUESTIONS.map(q => `${q.key}.${next[q.key].value}`).join(','))
    else url.searchParams.delete('r')
    window.history.replaceState(null, '', url)
  }

  function pick(qKey: string, opt: Option) {
    setAnswers(prev => {
      const next = { ...prev, [qKey]: opt }
      if (QUESTIONS.every(q => next[q.key])) {
        const s = Object.values(next).reduce((sum, o) => sum + o.weight, 0)
        trackEvent('werkzeug_m365_result', { band: band(s).name, score: s })
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
      trackEvent('werkzeug_share_copied', { tool: 'm365' })
      setTimeout(() => setCopied(false), 2500)
    }).catch(() => {})
  }

  return (
    <div className="flex flex-col" style={{ gap: 20 }}>
      {QUESTIONS.map(q => (
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
        {result && (
          <motion.div
            key={result.name}
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
                Komplexität · {result.name}
              </span>
            </div>

            <h3 className="font-display" style={{ fontSize: 'clamp(24px, 3.4vw, 36px)', lineHeight: 1.15, letterSpacing: '-0.02em', color: 'var(--fg-default)', margin: 0 }}>
              {result.weeks}
            </h3>

            <p className="font-body" style={{ marginTop: 14, fontSize: 15.5, lineHeight: 1.65, color: 'var(--fg-muted)' }}>
              {result.note}
            </p>

            {drivers.length > 0 && (
              <>
                <p className="font-mono uppercase" style={{ marginTop: 26, marginBottom: 12, fontSize: 11, letterSpacing: '0.18em', color: 'var(--fg-subtle)' }}>
                  Was bei dir den Aufwand hochzieht
                </p>
                <ul className="flex flex-col" style={{ gap: 10, margin: 0, padding: 0, listStyle: 'none' }}>
                  {drivers.map((d, i) => (
                    <li key={i} className="flex gap-3" style={{ fontSize: 14.5, lineHeight: 1.55, color: 'var(--fg-default)' }}>
                      <span aria-hidden style={{ color: 'var(--brand)' }}>→</span>
                      <span className="font-body">{d}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center" style={{ marginTop: 30 }}>
              <TrackedLink
                href={`/kontakt?tool=m365&ergebnis=${encodeURIComponent(result.name)}`}
                event="cta_lagebild_werkzeug_m365"
                className="group transition-transform duration-220 hover:-translate-y-0.5"
                style={primaryCtaStyle}
              >
                Festpreis im Lagebild klären
                <ArrowRight size={16} strokeWidth={2.25} className="transition-transform duration-220 group-hover:translate-x-0.5" />
              </TrackedLink>
              <Link href="/blog/m365-migration-kosten" className="font-body" style={{ fontSize: 14, color: 'var(--brand)', textDecoration: 'underline', textDecorationThickness: 1, textUnderlineOffset: 3 }}>
                Die fünf Kostentreiber im Detail
              </Link>
            </div>

            <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid rgba(242, 240, 235, 0.08)' }}>
              <p className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: '0.18em', color: 'var(--fg-subtle)', marginBottom: 12 }}>
                Passt dazu
              </p>
              <div className="flex flex-wrap" style={{ gap: 10 }}>
                {[
                  { href: '/werkzeuge/microsoft-365-oder-google-workspace', label: 'M365 oder Google Workspace?' },
                  { href: '/lexikon/cloud-migration', label: 'Cloud-Migration im Lexikon' },
                ].map(r => (
                  <Link
                    key={r.href}
                    href={r.href}
                    className="group inline-flex items-center font-body"
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

            <div className="flex items-center" style={{ marginTop: 22, justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
              <p className="font-body" style={{ fontSize: 12.5, lineHeight: 1.55, color: 'var(--fg-subtle)', margin: 0, flex: 1, minWidth: 220 }}>
                Grobe Orientierung, kein Angebot. Den Festpreis mache ich nach einem Lagebild fest — dann trägst du nicht mein Schätzrisiko.
              </p>
              <div className="flex items-center" style={{ gap: 18 }}>
                <button
                  type="button"
                  onClick={copyLink}
                  className="font-mono uppercase inline-flex items-center"
                  style={{ gap: 8, fontSize: 11, letterSpacing: '0.12em', color: copied ? 'var(--success-fg)' : 'var(--fg-muted)', background: 'transparent', border: 'none', cursor: 'pointer' }}
                >
                  {copied ? <Check size={13} strokeWidth={1.75} /> : <Link2 size={13} strokeWidth={1.75} />}
                  {copied ? 'Link kopiert' : 'Ergebnis teilen'}
                </button>
                <button
                  type="button"
                  onClick={reset}
                  className="font-mono uppercase inline-flex items-center"
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
