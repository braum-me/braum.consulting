'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import Link from 'next/link'
import { ArrowRight, ShieldCheck, ShieldAlert, ShieldQuestion, RotateCcw, Link2, Check } from 'lucide-react'
import TrackedLink from '@/components/layout/TrackedLink'
import { trackEvent } from '@/lib/analytics'
import { EASE, labelStyle, pillStyle, questionCard, resultCard, primaryCtaStyle } from './styles'

/* ── Optionen ──────────────────────────────────────────────────────────── */

type Size = 'klein' | 'mittel' | 'gross'
type Supply = 'ja' | 'nein' | 'unsicher'

const SIZES: { value: Size; label: string }[] = [
  { value: 'klein',  label: 'Unter 50 Mitarbeitende und unter 10 Mio. € Umsatz' },
  { value: 'mittel', label: '50–249 Mitarbeitende oder 10–50 Mio. €' },
  { value: 'gross',  label: '250+ Mitarbeitende oder über 50 Mio. €' },
]

// Sektoren nach NIS2 Anhang I (hohe Kritikalität) + Anhang II (sonstige).
const SECTOR_GROUPS: { group: string; options: string[] }[] = [
  {
    group: 'Sektoren hoher Kritikalität',
    options: [
      'Energie', 'Verkehr', 'Bankwesen / Finanzmarkt', 'Gesundheitswesen',
      'Trink- und Abwasser', 'Digitale Infrastruktur', 'IKT-Dienstleistung (B2B)',
      'Öffentliche Verwaltung', 'Weltraum',
    ],
  },
  {
    group: 'Sonstige kritische Sektoren',
    options: [
      'Verarbeitendes Gewerbe / Maschinenbau', 'Fahrzeug- und Fahrzeugteilbau',
      'Medizin-, Elektro- oder Datentechnik', 'Chemie', 'Lebensmittel',
      'Post und Kurier', 'Abfallwirtschaft', 'Digitale Dienste (Marktplatz, Suche, Social)',
      'Forschung',
    ],
  },
]

const SUPPLY: { value: Supply; label: string }[] = [
  { value: 'ja',       label: 'Ja, wir liefern oder leisten Dienste für größere Unternehmen' },
  { value: 'nein',     label: 'Nein, unsere Kunden sind privat oder klein' },
  { value: 'unsicher', label: 'Unsicher' },
]

const NO_SECTOR = 'Keiner davon / weiß nicht'

/* ── Ergebnis-Logik ────────────────────────────────────────────────────── */

type Verdict = 'direkt-wesentlich' | 'direkt-wichtig' | 'mittelbar' | 'pruefen' | 'nicht'

function evaluate(size: Size, sector: string, supply: Supply): Verdict {
  const sectorListed = sector !== '' && sector !== NO_SECTOR
  const overThreshold = size !== 'klein'

  if (overThreshold && sectorListed) {
    return size === 'gross' ? 'direkt-wesentlich' : 'direkt-wichtig'
  }
  if (supply === 'ja') return 'mittelbar'
  if (supply === 'unsicher' || (sectorListed && !overThreshold)) return 'pruefen'
  return 'nicht'
}

const RESULTS: Record<Verdict, {
  Icon: typeof ShieldCheck
  tone: 'alert' | 'warn' | 'ok'
  badge: string
  title: string
  body: string
  steps: string[]
}> = {
  'direkt-wesentlich': {
    Icon: ShieldAlert, tone: 'alert', badge: 'Direkt betroffen · wesentliche Einrichtung',
    title: 'Sehr wahrscheinlich direkt betroffen.',
    body: 'Größe über dem Schwellwert und ein gelisteter Sektor — das spricht für die Einstufung als „wesentliche Einrichtung“ mit den vollen Pflichten. Die Geschäftsführung haftet persönlich.',
    steps: [
      'Betroffenheit schriftlich dokumentieren (Größe, Sektor, Begründung).',
      'Risikomanagement und Meldewege aufsetzen — Vorfälle sind kurzfristig meldepflichtig.',
      'Lücken zur eigenen Lage aufnehmen und priorisiert schließen, statt einen Zertifizierungs-Marathon zu starten.',
    ],
  },
  'direkt-wichtig': {
    Icon: ShieldAlert, tone: 'alert', badge: 'Direkt betroffen · wichtige Einrichtung',
    title: 'Sehr wahrscheinlich direkt betroffen.',
    body: 'Größe über dem Schwellwert und ein gelisteter Sektor — das spricht für die Einstufung als „wichtige Einrichtung“. Die Pflichten gelten, die Aufsicht ist etwas weniger streng als bei wesentlichen Einrichtungen.',
    steps: [
      'Betroffenheit schriftlich dokumentieren (Größe, Sektor, Begründung).',
      'Risikomanagement und Meldewege aufsetzen.',
      'Eine bestehende ISO 27001 deckt 70–80 % der Anforderungen ab — Delta gezielt schließen.',
    ],
  },
  'mittelbar': {
    Icon: ShieldQuestion, tone: 'warn', badge: 'Mittelbar betroffen',
    title: 'Wahrscheinlich mittelbar betroffen — über die Lieferkette.',
    body: 'Du fällst vielleicht nicht direkt unters Gesetz, bist aber Zulieferer oder Dienstleister eines Betroffenen. Lieferketten-Sicherheit ist deren Pflicht — die Anforderungen kommen über Kundenverträge zu dir.',
    steps: [
      'Verträge und Lieferanten-Fragebögen der größeren Kunden prüfen — was wird bereits abgefragt?',
      'Ein belegbares Sicherheits-Mindestniveau aufbauen, bevor der erste Kunde es verlangt.',
      'Den eigenen Nachweis (Maßnahmen, Verantwortliche) sauber dokumentieren.',
    ],
  },
  'pruefen': {
    Icon: ShieldQuestion, tone: 'warn', badge: 'Genauer prüfen',
    title: 'Knapp — das gehört genauer angeschaut.',
    body: 'Deine Angaben liegen im Graubereich: ein gelisteter Sektor knapp unter dem Schwellwert, oder Unsicherheit bei der Lieferkette. Hier lohnt eine saubere Einzelfallprüfung, statt vorschnell „betrifft uns nicht“ abzuhaken.',
    steps: [
      'Größe und Umsatz exakt gegen die Schwellwerte halten — auch Konzern-Verflechtungen zählen.',
      'Lieferkette ehrlich prüfen: Wer sind die größten Kunden, in welchen Sektoren?',
      'Im Zweifel die Maßnahmen ohnehin angehen — sie sind gute Sicherheits-Hygiene.',
    ],
  },
  'nicht': {
    Icon: ShieldCheck, tone: 'ok', badge: 'Wahrscheinlich nicht direkt betroffen',
    title: 'Aktuell wahrscheinlich nicht direkt betroffen.',
    body: 'Weder Schwellwert noch klarer Lieferketten-Bezug. Trotzdem: Die NIS2-Maßnahmen sind schlicht solide Sicherheits-Hygiene — und der Status kann kippen, sobald ein größerer Kunde dazukommt.',
    steps: [
      'Status dokumentieren, damit die Einschätzung nachvollziehbar ist.',
      'Basis-Hygiene trotzdem prüfen: MFA, Backups, Notfallplan.',
      'Bei neuen Großkunden die Betroffenheit erneut bewerten.',
    ],
  },
}

const TONE_COLOR = { alert: 'var(--brand)', warn: 'var(--brand)', ok: 'var(--success-fg)' }

/* ── Komponente ────────────────────────────────────────────────────────── */

const ALL_SECTORS = [...SECTOR_GROUPS.flatMap(g => g.options), NO_SECTOR]

export default function Nis2Check() {
  const reduce = useReducedMotion()
  const [size, setSize]     = useState<Size | ''>('')
  const [sector, setSector] = useState<string>('')
  const [supply, setSupply] = useState<Supply | ''>('')
  const [copied, setCopied] = useState(false)

  const complete = size !== '' && sector !== '' && supply !== ''
  const verdict = complete ? evaluate(size as Size, sector, supply as Supply) : null
  const result = verdict ? RESULTS[verdict] : null

  // Geteilten Ergebnis-Link beim Laden übernehmen (eigene Params statt ?r=,
  // weil Sektor-Labels Leerzeichen/Umlaute tragen).
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search)
    const qSize = sp.get('groesse'), qSector = sp.get('sektor'), qSupply = sp.get('lieferkette')
    /* eslint-disable react-hooks/set-state-in-effect -- einmaliger URL-Import beim Mount */
    if (qSize && SIZES.some(s => s.value === qSize)) setSize(qSize as Size)
    if (qSector && ALL_SECTORS.includes(qSector)) setSector(qSector)
    if (qSupply && SUPPLY.some(s => s.value === qSupply)) setSupply(qSupply as Supply)
    /* eslint-enable react-hooks/set-state-in-effect */
    // eslint-disable-next-line react-hooks/exhaustive-deps -- nur beim Mount
  }, [])

  // URL synchron halten, sobald ein Ergebnis steht (extern, kein State).
  useEffect(() => {
    const url = new URL(window.location.href)
    if (complete) {
      url.searchParams.set('groesse', size)
      url.searchParams.set('sektor', sector)
      url.searchParams.set('lieferkette', supply)
    } else {
      url.searchParams.delete('groesse')
      url.searchParams.delete('sektor')
      url.searchParams.delete('lieferkette')
    }
    window.history.replaceState(null, '', url)
  }, [complete, size, sector, supply])

  function onResultShown(v: Verdict) {
    trackEvent('werkzeug_nis2_result', { verdict: v })
  }

  function reset() {
    setSize('')
    setSector('')
    setSupply('')
    setCopied(false)
  }

  function copyLink() {
    navigator.clipboard?.writeText(window.location.href).then(() => {
      setCopied(true)
      trackEvent('werkzeug_share_copied', { tool: 'nis2' })
      setTimeout(() => setCopied(false), 2500)
    }).catch(() => {})
  }

  return (
    <div className="flex flex-col" style={{ gap: 20 }}>
      {/* Frage 1 — Größe */}
      <fieldset style={questionCard}>
        <legend style={labelStyle}>01 · Wie groß ist dein Unternehmen?</legend>
        <div className="flex flex-col gap-2 md:flex-row md:flex-wrap">
          {SIZES.map(s => (
            <button key={s.value} type="button" onClick={() => setSize(s.value)} style={pillStyle(size === s.value)}>
              {s.label}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Frage 2 — Sektor */}
      <fieldset style={questionCard}>
        <legend style={labelStyle}>02 · In welchem Sektor bist du tätig?</legend>
        <select
          value={sector}
          onChange={e => setSector(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            fontSize: 'var(--t-body-sm)',
            fontFamily: 'var(--font-body)',
            background: 'var(--bg-elevated)',
            color: sector ? 'var(--fg-default)' : 'var(--fg-muted)',
            border: '1px solid var(--border-default)',
            borderRadius: 8,
            cursor: 'pointer',
          }}
        >
          <option value="">Bitte wählen …</option>
          {SECTOR_GROUPS.map(g => (
            <optgroup key={g.group} label={g.group}>
              {g.options.map(o => <option key={o} value={o}>{o}</option>)}
            </optgroup>
          ))}
          <option value={NO_SECTOR}>{NO_SECTOR}</option>
        </select>
      </fieldset>

      {/* Frage 3 — Lieferkette */}
      <fieldset style={questionCard}>
        <legend style={labelStyle}>03 · Lieferst du an größere Unternehmen?</legend>
        <div className="flex flex-col gap-2 md:flex-row md:flex-wrap">
          {SUPPLY.map(s => (
            <button key={s.value} type="button" onClick={() => setSupply(s.value)} style={pillStyle(supply === s.value)}>
              {s.label}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Ergebnis */}
      <AnimatePresence mode="wait">
        {result && verdict && (
          <motion.div
            key={verdict}
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.5, ease: EASE }}
            onAnimationStart={() => onResultShown(verdict)}
            style={resultCard}
            aria-live="polite"
          >
            <div className="flex items-center gap-3" style={{ marginBottom: 18 }}>
              <result.Icon size={22} strokeWidth={1.6} style={{ color: TONE_COLOR[result.tone] }} />
              <span
                className="font-mono uppercase"
                style={{ fontSize: 11, letterSpacing: '0.18em', color: TONE_COLOR[result.tone] }}
              >
                {result.badge}
              </span>
            </div>

            <h3
              className="font-display"
              style={{ fontSize: 'clamp(22px, 3vw, 30px)', lineHeight: 1.2, letterSpacing: '-0.02em', color: 'var(--fg-default)', margin: 0 }}
            >
              {result.title}
            </h3>

            <p className="font-body" style={{ marginTop: 14, fontSize: 15.5, lineHeight: 1.65, color: 'var(--fg-muted)' }}>
              {result.body}
            </p>

            <p className="font-mono uppercase" style={{ marginTop: 26, marginBottom: 12, fontSize: 11, letterSpacing: '0.18em', color: 'var(--fg-subtle)' }}>
              Nächste Schritte
            </p>
            <ul className="flex flex-col" style={{ gap: 10, margin: 0, padding: 0, listStyle: 'none' }}>
              {result.steps.map((s, i) => (
                <li key={i} className="flex gap-3" style={{ fontSize: 14.5, lineHeight: 1.55, color: 'var(--fg-default)' }}>
                  <span className="font-mono" style={{ color: 'var(--brand)', minWidth: 18 }}>{String(i + 1).padStart(2, '0')}</span>
                  <span className="font-body">{s}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center" style={{ marginTop: 30 }}>
              <TrackedLink
                href={`/kontakt?tool=nis2&ergebnis=${encodeURIComponent(result.badge)}`}
                event="cta_lagebild_werkzeug_nis2"
                className="group transition-transform duration-220 hover:-translate-y-0.5"
                style={primaryCtaStyle}
              >
                Im Lagebild einordnen lassen
                <ArrowRight size={16} strokeWidth={2.25} className="transition-transform duration-220 group-hover:translate-x-0.5" />
              </TrackedLink>
              <Link href="/blog/nis2-bin-ich-betroffen" className="font-body" style={{ fontSize: 14, color: 'var(--brand)', textDecoration: 'underline', textDecorationThickness: 1, textUnderlineOffset: 3 }}>
                Die Logik dahinter im Detail
              </Link>
            </div>

            <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid rgba(242, 240, 235, 0.08)' }}>
              <p className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: '0.18em', color: 'var(--fg-subtle)', marginBottom: 12 }}>
                Passt dazu
              </p>
              <div className="flex flex-wrap" style={{ gap: 10 }}>
                {(verdict === 'direkt-wesentlich' || verdict === 'direkt-wichtig' || verdict === 'mittelbar'
                  ? [
                      { href: '/werkzeuge/iso-27001-readiness', label: 'Wie weit ist mein ISMS?' },
                      { href: '/lexikon/bcm', label: 'Business Continuity im Lexikon' },
                    ]
                  : [
                      { href: '/werkzeuge/iso-27001-readiness', label: 'Wie weit ist mein ISMS?' },
                      { href: '/lexikon/nis2', label: 'NIS2 im Lexikon' },
                    ]
                ).map(r => (
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
                Orientierung, keine Rechtsberatung. Die finale Betroffenheit hängt am Einzelfall — inklusive Konzern-Verflechtungen und der konkreten Sektor-Definition.
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
