'use client'

import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import Link from 'next/link'
import { ArrowRight, AlertTriangle, RotateCcw } from 'lucide-react'
import TrackedLink from '@/components/layout/TrackedLink'
import { trackEvent } from '@/lib/analytics'
import { EASE, labelStyle, pillStyle, questionCard, resultCard, primaryCtaStyle } from './styles'

/* ── Eingaben ──────────────────────────────────────────────────────────── */

type Opt<T extends string> = { value: T; label: string }

type Umsatz = 'u1' | 'u5' | 'u25' | 'u100' | 'u100p'
type Dep = 'voll' | 'gross' | 'teil'
type Prep = 'geuebt' | 'ungeuebt' | 'keiner'

// Repräsentativer Jahresumsatz (Mittelwert der Größenordnung) in €.
const UMSATZ: (Opt<Umsatz> & { wert: number })[] = [
  { value: 'u1',    label: 'unter 1 Mio. €',   wert: 500_000 },
  { value: 'u5',    label: '1–5 Mio. €',       wert: 3_000_000 },
  { value: 'u25',   label: '5–25 Mio. €',      wert: 12_000_000 },
  { value: 'u100',  label: '25–100 Mio. €',    wert: 50_000_000 },
  { value: 'u100p', label: 'über 100 Mio. €',  wert: 150_000_000 },
]

// Wie viel Geschäft steht still, wenn die IT steht?
const DEP: (Opt<Dep> & { faktor: number })[] = [
  { value: 'voll',  label: 'Fast alles — ohne IT geht nichts', faktor: 0.85 },
  { value: 'gross', label: 'Das meiste',                        faktor: 0.55 },
  { value: 'teil',  label: 'Ein Teil läuft analog weiter',      faktor: 0.30 },
]

// Vorbereitung bestimmt die erwartete Ausfalldauer (Tage, Spanne).
const PREP: (Opt<Prep> & { tage: [number, number]; hinweis: string })[] = [
  { value: 'geuebt',   label: 'Backup & Notfallplan, getestet', tage: [1, 2],  hinweis: 'Geübte Wiederherstellung — der schnellste Weg zurück in den Betrieb.' },
  { value: 'ungeuebt', label: 'Backup vorhanden, ungeübt',      tage: [3, 7],  hinweis: 'Ein ungeübter Wiederanlauf dauert in der Praxis deutlich länger als gedacht.' },
  { value: 'keiner',   label: 'Kein getesteter Notfallplan',    tage: [7, 15], hinweis: 'Ohne geübten Plan wird aus einem Vorfall schnell ein wochenlanger Stillstand.' },
]

/* ── Rechnung ──────────────────────────────────────────────────────────── */

const WORK_DAYS = 220

function roundSig(n: number, sig = 2): number {
  if (n <= 0) return 0
  const d = Math.ceil(Math.log10(n))
  const m = Math.pow(10, sig - d)
  return Math.round(n * m) / m
}

const fmt = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 })
function eur(n: number): string {
  return '€ ' + fmt.format(roundSig(n, 2))
}

type Result = {
  low: number
  high: number
  revLow: number
  revHigh: number
  recLow: number
  recHigh: number
  days: [number, number]
  hinweis: string
  band: string
}

function compute(umsatz: Umsatz, dep: Dep, prep: Prep): Result {
  const u = UMSATZ.find(x => x.value === umsatz)!.wert
  const f = DEP.find(x => x.value === dep)!.faktor
  const p = PREP.find(x => x.value === prep)!
  const daily = u / WORK_DAYS

  const revLow = daily * f * p.tage[0]
  const revHigh = daily * f * p.tage[1]
  // Wiederherstellung, Forensik, Krisenkommunikation, Folgekosten — grob als
  // Anteil am Umsatz, mit Mindestbetrag (IR-Einsätze starten 5-stellig).
  const recLow = Math.max(15_000, u * 0.004)
  const recHigh = Math.max(40_000, u * 0.015)

  const low = revLow + recLow
  const high = revHigh + recHigh
  const band = high >= 1_000_000 ? 'existenzbedrohend' : high >= 250_000 ? 'erheblich' : 'spürbar'

  return { low, high, revLow, revHigh, recLow, recHigh, days: p.tage, hinweis: p.hinweis, band }
}

/* ── Komponente ────────────────────────────────────────────────────────── */

export default function CyberSchaden() {
  const reduce = useReducedMotion()
  const [umsatz, setUmsatz] = useState<Umsatz | ''>('')
  const [dep, setDep]       = useState<Dep | ''>('')
  const [prep, setPrep]     = useState<Prep | ''>('')

  const complete = umsatz !== '' && dep !== '' && prep !== ''
  const r = complete ? compute(umsatz as Umsatz, dep as Dep, prep as Prep) : null

  function pickPrep(v: Prep) {
    setPrep(v)
    if (umsatz && dep) {
      const res = compute(umsatz as Umsatz, dep as Dep, v)
      trackEvent('werkzeug_cyberschaden_result', { band: res.band })
    }
  }

  function reset() { setUmsatz(''); setDep(''); setPrep('') }

  const Q = (
    label: string,
    children: React.ReactNode,
  ) => (
    <fieldset style={questionCard}>
      <legend style={labelStyle}>{label}</legend>
      <div className="flex flex-col gap-2 md:flex-row md:flex-wrap">{children}</div>
    </fieldset>
  )

  return (
    <div className="flex flex-col" style={{ gap: 20 }}>
      {Q('01 · Wie groß ist euer Jahresumsatz (Größenordnung)?',
        UMSATZ.map(o => (
          <button key={o.value} type="button" onClick={() => setUmsatz(o.value)} style={pillStyle(umsatz === o.value)}>{o.label}</button>
        )))}
      {Q('02 · Wie viel Geschäft steht still, wenn die IT steht?',
        DEP.map(o => (
          <button key={o.value} type="button" onClick={() => setDep(o.value)} style={pillStyle(dep === o.value)}>{o.label}</button>
        )))}
      {Q('03 · Wie gut seid ihr auf den Ernstfall vorbereitet?',
        PREP.map(o => (
          <button key={o.value} type="button" onClick={() => pickPrep(o.value)} style={pillStyle(prep === o.value)}>{o.label}</button>
        )))}

      <AnimatePresence mode="wait">
        {r && (
          <motion.div
            key={`${umsatz}-${dep}-${prep}`}
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.5, ease: EASE }}
            style={resultCard}
            aria-live="polite"
          >
            <div className="flex items-center gap-3" style={{ marginBottom: 18 }}>
              <AlertTriangle size={22} strokeWidth={1.6} style={{ color: 'var(--brand)' }} />
              <span className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: '0.18em', color: 'var(--brand)' }}>
                Geschätzte Schadens-Größenordnung · {r.band}
              </span>
            </div>

            <h3 className="font-display" style={{ fontSize: 'clamp(26px, 4vw, 44px)', lineHeight: 1.05, letterSpacing: '-0.02em', color: 'var(--fg-default)', margin: 0 }}>
              {eur(r.low)} – {eur(r.high)}
            </h3>
            <p className="font-body" style={{ marginTop: 14, fontSize: 15.5, lineHeight: 1.6, color: 'var(--fg-muted)' }}>
              Grobe Größenordnung für einen ernsten IT-Ausfall (z.&nbsp;B. Ransomware) bei
              angenommenen <strong style={{ color: 'var(--fg-default)' }}>{r.days[0]}–{r.days[1]} Tagen</strong> Stillstand. {r.hinweis}
            </p>

            <div className="mt-7 grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
              <div style={{ padding: 16, borderRadius: 10, background: 'rgba(242,240,235,0.04)', border: '1px solid rgba(242,240,235,0.08)' }}>
                <p className="font-mono uppercase" style={{ fontSize: 10.5, letterSpacing: '0.16em', color: 'var(--fg-subtle)', margin: 0 }}>Umsatzausfall</p>
                <p className="font-display" style={{ fontSize: 20, fontWeight: 600, color: 'var(--fg-default)', margin: '6px 0 0' }}>{eur(r.revLow)} – {eur(r.revHigh)}</p>
              </div>
              <div style={{ padding: 16, borderRadius: 10, background: 'rgba(242,240,235,0.04)', border: '1px solid rgba(242,240,235,0.08)' }}>
                <p className="font-mono uppercase" style={{ fontSize: 10.5, letterSpacing: '0.16em', color: 'var(--fg-subtle)', margin: 0 }}>Wiederherstellung & Forensik</p>
                <p className="font-display" style={{ fontSize: 20, fontWeight: 600, color: 'var(--fg-default)', margin: '6px 0 0' }}>{eur(r.recLow)} – {eur(r.recHigh)}</p>
              </div>
            </div>

            <p className="font-body" style={{ marginTop: 20, fontSize: 14.5, lineHeight: 1.6, color: 'var(--fg-muted)' }}>
              Nicht enthalten: Vertragsstrafen, Reputationsschaden, abgewanderte Kunden und mögliche
              Bußgelder. Genau diese Summe federn ein geübter Notfallplan und eine Cyber-Versicherung ab —
              wenn das Sicherheits-Mindestniveau vorher steht.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center" style={{ marginTop: 28 }}>
              <TrackedLink href="/kontakt" event="cta_lagebild_werkzeug_cyberschaden" className="group transition-transform duration-220 hover:-translate-y-0.5" style={primaryCtaStyle}>
                Risiko im Lagebild einordnen
                <ArrowRight size={16} strokeWidth={2.25} className="transition-transform duration-220 group-hover:translate-x-0.5" />
              </TrackedLink>
              <button type="button" onClick={reset} className="font-mono uppercase inline-flex items-center" style={{ gap: 8, fontSize: 11, letterSpacing: '0.12em', color: 'var(--fg-muted)', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <RotateCcw size={13} strokeWidth={1.75} /> Neu rechnen
              </button>
            </div>

            <p className="font-body" style={{ marginTop: 20, fontSize: 12.5, lineHeight: 1.55, color: 'var(--fg-subtle)' }}>
              Grobe Modellrechnung, kein Gutachten. Tatsächliche Schäden hängen vom Einzelfall ab —
              die Größenordnung soll nur zeigen, worum es bei Vorsorge wirklich geht.
            </p>

            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
              {[
                { href: '/lexikon/ransomware', label: 'Ransomware' },
                { href: '/lexikon/bcm', label: 'Business Continuity' },
                { href: '/lexikon/cyber-versicherung', label: 'Cyber-Versicherung' },
              ].map(l => (
                <Link key={l.href} href={l.href} className="font-body" style={{ fontSize: 13, color: 'var(--brand)', textDecoration: 'underline', textDecorationThickness: 1, textUnderlineOffset: 3 }}>
                  {l.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
