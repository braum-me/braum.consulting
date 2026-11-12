'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import Link from 'next/link'
import { ArrowRight, ShieldCheck, ShieldAlert, ShieldQuestion, RotateCcw, Link2, Check } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'
import { useToolRun } from './useToolRun'
import { EASE, labelStyle, pillStyle, questionCard, resultCard, primaryCtaStyle } from './styles'
import { useErgebnisFokus } from './useErgebnisFokus'

/* ── Optionen ──────────────────────────────────────────────────────────── */

type Size = 'klein' | 'mittel' | 'gross' | 'unsicher'
type Supply = 'ja' | 'nein' | 'unsicher'

// Größe nach § 28 Abs. 1 und 2 BSIG: Mitarbeitende ODER (Umsatz UND Bilanzsumme),
// Abs. 4: Berechnung nach EU-KMU-Empfehlung. Zwei getrennte Fragen, damit jede
// Zahl genau einer Antwort entspricht; maßgeblich ist das höhere Kriterium.
type Mitarbeitende = 'u50' | 'm50' | 'g250' | 'unsicher'
type Finanzen = 'bis10' | 'ueber10' | 'gross' | 'unsicher'

const MITARBEITENDE: { value: Mitarbeitende; label: string }[] = [
  { value: 'u50',      label: 'Unter 50' },
  { value: 'm50',      label: '50 bis 249' },
  { value: 'g250',     label: '250 oder mehr' },
  { value: 'unsicher', label: 'Weiß ich nicht genau' },
]
const FINANZEN: { value: Finanzen; label: string }[] = [
  { value: 'bis10',    label: 'Umsatz oder Bilanzsumme höchstens 10 Mio. €' },
  { value: 'ueber10',  label: 'Umsatz und Bilanzsumme je über 10 Mio. €' },
  { value: 'gross',    label: 'Umsatz über 50 Mio. € und Bilanzsumme über 43 Mio. €' },
  { value: 'unsicher', label: 'Weiß ich nicht genau' },
]

const RANG: Record<Exclude<Size, 'unsicher'>, number> = { klein: 0, mittel: 1, gross: 2 }
const AUS_MA: Record<Mitarbeitende, Size> = { u50: 'klein', m50: 'mittel', g250: 'gross', unsicher: 'unsicher' }
const AUS_FIN: Record<Finanzen, Size> = { bis10: 'klein', ueber10: 'mittel', gross: 'gross', unsicher: 'unsicher' }

/** Größenstufe: das höhere Kriterium zählt („oder“); unklar nur, wenn das
 *  bekannte Kriterium allein nicht schon die höchste Stufe ergibt. */
function groesse(ma: Mitarbeitende, fin: Finanzen): Size {
  const a = AUS_MA[ma], b = AUS_FIN[fin]
  if (a === 'gross' || b === 'gross') return 'gross'
  if (a === 'unsicher' || b === 'unsicher') return 'unsicher'
  return RANG[a] >= RANG[b] ? a : b
}

type Kind = 'kritis' | 'qtsp' | 'vda' | 'tk' | 'a1' | 'a2' | 'verwaltung' | 'keiner' | 'unsicher'

// Einrichtungsarten nach § 28 BSIG und den Anlagen 1 und 2 (Fassung NIS-2-Umsetzungsgesetz).
const SECTOR_GROUPS: { group: string; kind: Kind; options: string[] }[] = [
  {
    group: 'Sonderfälle (unabhängig von der Größe)', kind: 'kritis',
    options: ['Betreiber einer kritischen Anlage (KRITIS)'],
  },
  {
    group: 'Sonderfälle: Vertrauensdienste und DNS', kind: 'qtsp',
    options: ['Qualifizierter Vertrauensdienst, DNS-Dienst oder TLD-Registry'],
  },
  {
    group: 'Sonderfälle: Vertrauensdienste', kind: 'vda',
    options: ['Vertrauensdiensteanbieter (nicht qualifiziert)'],
  },
  {
    group: 'Sonderfälle: Telekommunikation', kind: 'tk',
    options: ['Öffentliche Telekommunikationsnetze oder -dienste'],
  },
  {
    group: 'Anlage 1 · Sektoren mit hoher Kritikalität', kind: 'a1',
    options: [
      'Energie', 'Transport und Verkehr', 'Finanzwesen (Banken, Finanzmarktinfrastruktur)',
      'Gesundheit', 'Trinkwasser und Abwasser',
      'Digitale Infrastruktur (Rechenzentren, Cloud, CDN, Internetknoten)',
      'IT-Betrieb für andere (Managed Services, Managed Security)',
      'Weltraum (Bodeninfrastruktur)',
    ],
  },
  {
    group: 'Anlage 2 · Sonstige kritische Sektoren', kind: 'a2',
    options: [
      'Post- und Kurierdienste', 'Abfallbewirtschaftung (als Haupttätigkeit)',
      'Chemie (REACH-registrierungspflichtig)', 'Lebensmittel (Großhandel, industrielle Produktion)',
      'Medizinprodukte und In-vitro-Diagnostika', 'Elektronik, Datenverarbeitungsgeräte, Optik',
      'Elektrische Ausrüstungen', 'Maschinenbau', 'Kraftwagen und Kraftwagenteile',
      'Sonstiger Fahrzeugbau', 'Online-Marktplätze, Suchmaschinen, soziale Netzwerke',
      'Forschungseinrichtungen',
    ],
  },
  {
    group: 'Öffentliche Hand', kind: 'verwaltung',
    options: ['Öffentliche Verwaltung (Bund, Land, Kommune)'],
  },
]

const SUPPLY: { value: Supply; label: string }[] = [
  { value: 'ja',       label: 'Ja, wir liefern oder leisten Dienste für größere Unternehmen' },
  { value: 'nein',     label: 'Nein, unsere Kunden sind privat oder klein' },
  { value: 'unsicher', label: 'Unsicher' },
]

const NO_SECTOR = 'Keiner davon'
const SECTOR_UNSURE = 'Weiß ich nicht'

function kindOf(sector: string): Kind {
  if (sector === NO_SECTOR) return 'keiner'
  if (sector === SECTOR_UNSURE) return 'unsicher'
  return SECTOR_GROUPS.find(g => g.options.includes(sector))?.kind ?? 'unsicher'
}

/* ── Ergebnis-Logik (§ 28 BSIG) ────────────────────────────────────────── */

type Verdict = 'besonders-wichtig' | 'wichtig' | 'mittelbar' | 'pruefen' | 'nicht' | 'verwaltung'

function evaluate(size: Size, sector: string, supply: Supply): Verdict {
  const kind = kindOf(sector)
  if (kind === 'verwaltung') return 'verwaltung'
  // § 28 Abs. 1 Nr. 1 und 2: ohne Größenschwelle besonders wichtig
  if (kind === 'kritis' || kind === 'qtsp') return 'besonders-wichtig'
  // § 28 Abs. 2 Nr. 1: Vertrauensdiensteanbieter ohne Größenschwelle wichtig
  if (kind === 'vda') return 'wichtig'
  // § 28 Abs. 1 Nr. 3 / Abs. 2 Nr. 2: TK ab mittlerer Größe besonders wichtig, sonst wichtig
  if (kind === 'tk') return size === 'unsicher' ? 'pruefen' : size === 'klein' ? 'wichtig' : 'besonders-wichtig'
  // § 28 Abs. 1 Nr. 4 / Abs. 2 Nr. 3: Anlage 1 groß besonders wichtig, mittel wichtig
  if (kind === 'a1') {
    if (size === 'gross') return 'besonders-wichtig'
    if (size === 'mittel') return 'wichtig'
    if (size === 'unsicher') return 'pruefen'
  }
  // § 28 Abs. 2 Nr. 3: Anlage 2 ab mittlerer Größe wichtig (auch große)
  if (kind === 'a2') {
    if (size === 'gross' || size === 'mittel') return 'wichtig'
    if (size === 'unsicher') return 'pruefen'
  }
  if (kind === 'unsicher') return 'pruefen'
  // Nicht direkt erfasst: Lieferkette entscheidet über mittelbare Betroffenheit
  if (supply === 'ja') return 'mittelbar'
  if (supply === 'unsicher') return 'pruefen'
  return 'nicht'
}

/** Zusätzliche Hinweise für Sektoren mit Sonderregeln (§ 28 Abs. 5 und 6 BSIG). */
function sectorNote(sector: string): string | null {
  if (sector.startsWith('Finanzwesen')) return 'Für Finanzunternehmen unter DORA gelten viele Pflichten über DORA statt über das BSIG (§ 28 Abs. 6).'
  if (sector === 'Energie') return 'Für Energieversorger, die §§ 5c bis 5e EnWG unterliegen, gelten Teile der BSIG-Pflichten nicht (§ 28 Abs. 5).'
  if (sector.startsWith('Öffentliche Telekommunikation')) return 'Für öffentliche TK-Netze und -Dienste gelten Teile der BSIG-Pflichten nicht; Vorgaben kommen aus dem TKG (§ 28 Abs. 5).'
  if (sector.startsWith('Betreiber einer kritischen Anlage')) return 'Ob eine Anlage kritisch ist, bestimmt die KRITIS-Verordnung anhand von Schwellenwerten je Anlage.'
  return null
}

const REGISTRIERUNG = 'Beim BSI registrieren (§ 33 BSIG): Wer schon seit dem 6. Dezember 2025 betroffen ist, ist überfällig. Wer später betroffen wird, hat drei Monate.'

const RESULTS: Record<Verdict, {
  Icon: typeof ShieldCheck
  tone: 'alert' | 'warn' | 'ok'
  badge: string
  title: string
  body: string
  steps: string[]
}> = {
  'besonders-wichtig': {
    Icon: ShieldAlert, tone: 'alert', badge: 'Voraussichtlich besonders wichtige Einrichtung',
    title: 'Voraussichtlich direkt betroffen.',
    body: 'Nach deinen Angaben spricht alles für eine „besonders wichtige Einrichtung“ nach § 28 Abs. 1 BSIG. Damit gelten die vollen Pflichten und die strengere Aufsicht. Die Geschäftsleitung muss die Maßnahmen billigen und überwachen und haftet bei Pflichtverletzungen (§ 38 BSIG).',
    steps: [
      'Einstufung schriftlich festhalten (Einrichtungsart, Größe, Begründung).',
      REGISTRIERUNG,
      'Risikomanagement-Maßnahmen und Meldewege aufsetzen — erhebliche Vorfälle sind binnen 24 Stunden zu melden.',
      'Lücken zur eigenen Lage aufnehmen und priorisiert schließen, statt einen Zertifizierungs-Marathon zu starten.',
    ],
  },
  'wichtig': {
    Icon: ShieldAlert, tone: 'alert', badge: 'Voraussichtlich wichtige Einrichtung',
    title: 'Voraussichtlich direkt betroffen.',
    body: 'Nach deinen Angaben spricht alles für eine „wichtige Einrichtung“ nach § 28 Abs. 2 BSIG. Die Pflichten gelten, die Aufsicht greift vor allem anlassbezogen. Auch hier muss die Geschäftsleitung die Maßnahmen billigen und überwachen (§ 38 BSIG).',
    steps: [
      'Einstufung schriftlich festhalten (Einrichtungsart, Größe, Begründung).',
      REGISTRIERUNG,
      'Risikomanagement-Maßnahmen und Meldewege aufsetzen.',
      'Eine bestehende ISO 27001 deckt viele Maßnahmen schon ab — Registrierung, Meldepflichten und Geschäftsleitungspflichten gezielt ergänzen.',
    ],
  },
  'mittelbar': {
    Icon: ShieldQuestion, tone: 'warn', badge: 'Mittelbar betroffen',
    title: 'Wahrscheinlich mittelbar betroffen — über die Lieferkette.',
    body: 'Nach deinen Angaben fällst du nicht direkt unter § 28 BSIG, bist aber Zulieferer oder Dienstleister größerer Unternehmen. Für betroffene Kunden ist Lieferketten-Sicherheit Pflicht — die Anforderungen kommen über Verträge und Fragebögen zu dir.',
    steps: [
      'Verträge und Lieferanten-Fragebögen der größeren Kunden prüfen — was wird bereits abgefragt?',
      'Ein belegbares Sicherheits-Mindestniveau aufbauen, bevor der erste Kunde es verlangt.',
      'Den eigenen Nachweis (Maßnahmen, Verantwortliche) sauber dokumentieren.',
    ],
  },
  'pruefen': {
    Icon: ShieldQuestion, tone: 'warn', badge: 'Genauer prüfen',
    title: 'Offen — das gehört genauer angeschaut.',
    body: 'Mit deinen Angaben lässt sich die Betroffenheit nicht sicher einordnen: Größe, Einrichtungsart oder Lieferkette sind unklar. Hier lohnt eine saubere Prüfung, statt vorschnell „betrifft uns nicht“ abzuhaken.',
    steps: [
      'Mitarbeitende, Umsatz und Bilanzsumme gegen die Schwellen in § 28 BSIG halten. Partner- und verbundene Unternehmen zählen nur mit, wenn ihr bei IT-Systemen und Prozessen nicht unabhängig seid (§ 28 Abs. 4).',
      'Die eigene Tätigkeit gegen Anlage 1 und 2 des BSIG prüfen. Vernachlässigbare Nebentätigkeiten können unberücksichtigt bleiben (§ 28 Abs. 3).',
      'Lieferkette ehrlich prüfen: Wer sind die größten Kunden, in welchen Sektoren?',
    ],
  },
  'nicht': {
    Icon: ShieldCheck, tone: 'ok', badge: 'Voraussichtlich nicht direkt betroffen',
    title: 'Voraussichtlich nicht direkt betroffen.',
    body: 'Nach deinen Angaben passt weder eine Einrichtungsart mit Schwellenwert noch ein klarer Lieferketten-Bezug. Die NIS-2-Maßnahmen sind trotzdem solide Sicherheits-Hygiene — und der Status kann kippen, sobald das Unternehmen wächst oder ein größerer Kunde dazukommt.',
    steps: [
      'Status dokumentieren, damit die Einschätzung nachvollziehbar ist.',
      'Basis-Hygiene trotzdem prüfen: MFA, Backups, Notfallplan.',
      'Bei Wachstum oder neuen Großkunden die Betroffenheit erneut bewerten.',
    ],
  },
  'verwaltung': {
    Icon: ShieldQuestion, tone: 'warn', badge: 'Eigene Regeln für die Verwaltung',
    title: 'Für die öffentliche Verwaltung gelten eigene Regeln.',
    body: 'Dieser Check bildet § 28 BSIG für Unternehmen ab. Für die Bundesverwaltung gelten eigene Vorgaben im BSIG, für Länder und Kommunen das jeweilige Landesrecht. Auch die BSI-Betroffenheitsprüfung betrachtet die Verwaltung nicht.',
    steps: [
      'Die für deine Behörde geltenden Vorgaben (BSIG bzw. Landesrecht) mit der zuständigen IT-Sicherheitsstelle klären.',
      'Unabhängig davon: Risikomanagement, Meldewege und Notfallvorsorge prüfen.',
    ],
  },
}

const TONE_COLOR = { alert: 'var(--brand)', warn: 'var(--brand)', ok: 'var(--success-fg)' }

/* ── Komponente ────────────────────────────────────────────────────────── */

const ALL_SECTORS = [...SECTOR_GROUPS.flatMap(g => g.options), NO_SECTOR, SECTOR_UNSURE]

export default function Nis2Check() {
  const reduce = useReducedMotion()
  const [ma, setMa]         = useState<Mitarbeitende | ''>('')
  const [fin, setFin]       = useState<Finanzen | ''>('')
  const [sector, setSector] = useState<string>('')
  const [supply, setSupply] = useState<Supply | ''>('')
  const [copied, setCopied] = useState(false)

  const complete = ma !== '' && fin !== '' && sector !== '' && supply !== ''
  const verdict = complete ? evaluate(groesse(ma as Mitarbeitende, fin as Finanzen), sector, supply as Supply) : null
  const result = verdict ? RESULTS[verdict] : null
  const ergebnisRef = useErgebnisFokus<HTMLHeadingElement>(!!result)
  const run = useToolRun('nis2-betroffenheit')
  useEffect(() => { if (verdict) run.complete() }, [verdict, run])

  // Geteilten Ergebnis-Link beim Laden übernehmen (eigene Params statt ?r=,
  // weil Sektor-Labels Leerzeichen/Umlaute tragen).
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search)
    const qMa = sp.get('mitarbeitende'), qFin = sp.get('finanzen'), qSector = sp.get('sektor'), qSupply = sp.get('lieferkette')
    /* eslint-disable react-hooks/set-state-in-effect -- einmaliger URL-Import beim Mount */
    if (qMa && MITARBEITENDE.some(s => s.value === qMa)) setMa(qMa as Mitarbeitende)
    if (qFin && FINANZEN.some(s => s.value === qFin)) setFin(qFin as Finanzen)
    if (qSector && ALL_SECTORS.includes(qSector)) setSector(qSector)
    if (qSupply && SUPPLY.some(s => s.value === qSupply)) setSupply(qSupply as Supply)
    /* eslint-enable react-hooks/set-state-in-effect */
    // eslint-disable-next-line react-hooks/exhaustive-deps -- nur beim Mount
  }, [])

  // URL synchron halten, sobald ein Ergebnis steht (extern, kein State).
  useEffect(() => {
    const url = new URL(window.location.href)
    if (complete) {
      url.searchParams.set('mitarbeitende', ma)
      url.searchParams.set('finanzen', fin)
      url.searchParams.set('sektor', sector)
      url.searchParams.set('lieferkette', supply)
    } else {
      url.searchParams.delete('mitarbeitende')
      url.searchParams.delete('finanzen')
      url.searchParams.delete('sektor')
      url.searchParams.delete('lieferkette')
    }
    window.history.replaceState(null, '', url)
  }, [complete, ma, fin, sector, supply])

  function reset() {
    run.reset()
    setMa('')
    setFin('')
    setSector('')
    setSupply('')
    setCopied(false)
  }

  function copyLink() {
    navigator.clipboard?.writeText(window.location.href).then(() => {
      setCopied(true)
      trackEvent('werkzeug_share_copied', { tool: 'nis2-betroffenheit' })
      setTimeout(() => setCopied(false), 2500)
    }).catch(() => {})
  }

  return (
    <div className="flex flex-col" style={{ gap: 20 }}>
      {/* Frage 1 — Mitarbeitende */}
      <fieldset className="wz-frage" style={questionCard}>
        <legend style={labelStyle}>01 · Wie viele Mitarbeitende habt ihr?</legend>
        <div className="flex flex-col gap-2 md:flex-row md:flex-wrap">
          {MITARBEITENDE.map(s => (
            <button key={s.value} type="button" onClick={() => { run.start(); setMa(s.value) }} aria-pressed={ma === s.value} style={pillStyle(ma === s.value)}>
              {s.label}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Frage 2 — Umsatz und Bilanzsumme */}
      <fieldset className="wz-frage" style={questionCard}>
        <legend style={labelStyle}>02 · Wie hoch sind Jahresumsatz und Bilanzsumme?</legend>
        <div className="flex flex-col gap-2 md:flex-row md:flex-wrap">
          {FINANZEN.map(s => (
            <button key={s.value} type="button" onClick={() => { run.start(); setFin(s.value) }} aria-pressed={fin === s.value} style={pillStyle(fin === s.value)}>
              {s.label}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Frage 2 — Sektor */}
      <fieldset className="wz-frage" style={questionCard}>
        <legend style={labelStyle}>03 · Welche Tätigkeit passt am besten?</legend>
        <select
          aria-label="Sektor"
          value={sector}
          onChange={e => { run.start(); setSector(e.target.value) }}
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
          <option value={SECTOR_UNSURE}>{SECTOR_UNSURE}</option>
        </select>
      </fieldset>

      {/* Frage 3 — Lieferkette */}
      <fieldset className="wz-frage" style={questionCard}>
        <legend style={labelStyle}>04 · Lieferst du an größere Unternehmen?</legend>
        <div className="flex flex-col gap-2 md:flex-row md:flex-wrap">
          {SUPPLY.map(s => (
            <button key={s.value} type="button" onClick={() => { run.start(); setSupply(s.value) }} aria-pressed={supply === s.value} style={pillStyle(supply === s.value)}>
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

            <h2 ref={ergebnisRef} tabIndex={-1}
              className="font-display"
              style={{ fontSize: 'clamp(22px, 3vw, 30px)', lineHeight: 1.2, letterSpacing: '-0.02em', color: 'var(--fg-default)', margin: 0 }}
            >
              {result.title}
            </h2>

            <p className="font-body" style={{ marginTop: 14, fontSize: 15.5, lineHeight: 1.65, color: 'var(--fg-muted)' }}>
              {result.body}
            </p>
            {sectorNote(sector) && (
              <p className="font-body" style={{ marginTop: 10, fontSize: 14.5, lineHeight: 1.6, color: 'var(--fg-default)' }}>
                {sectorNote(sector)}
              </p>
            )}

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
              <Link
                href={`/kontakt?tool=nis2&ergebnis=${encodeURIComponent(result.badge)}`}
                data-track-placement="ergebnis"
                className="group transition-transform duration-220 hover:-translate-y-0.5"
                style={primaryCtaStyle}
              >
                Im Lagebild einordnen lassen
                <ArrowRight size={16} strokeWidth={2.25} className="transition-transform duration-220 group-hover:translate-x-0.5" />
              </Link>
              <Link href="/blog/nis2-bin-ich-betroffen" className="font-body" style={{ fontSize: 14, color: 'var(--brand)', textDecoration: 'underline', textDecorationThickness: 1, textUnderlineOffset: 3 }}>
                Die Logik dahinter im Detail
              </Link>
            </div>

            <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid rgba(242, 240, 235, 0.08)' }}>
              <p className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: '0.18em', color: 'var(--fg-subtle)', marginBottom: 12 }}>
                Passt dazu
              </p>
              <div className="flex flex-wrap" style={{ gap: 10 }}>
                {(verdict === 'besonders-wichtig' || verdict === 'wichtig' || verdict === 'mittelbar'
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
                Unverbindliche Ersteinschätzung nach § 28 BSIG auf Basis deiner Angaben, keine Rechtsberatung. Verbindlich ist nur die eigene Prüfung — eine gute zweite Meinung ist die{' '}
                <a href="https://betroffenheitspruefung-nis-2.bsi.de/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brand)', textDecoration: 'underline', textUnderlineOffset: 3 }}>NIS-2-Betroffenheitsprüfung des BSI</a>.
              </p>
              <div className="flex items-center" style={{ gap: 18 }}>
                <button
                  type="button"
                  onClick={copyLink}
                  className="font-mono uppercase inline-flex items-center"
                  style={{ gap: 8, minHeight: 32, fontSize: 11, letterSpacing: '0.12em', color: copied ? 'var(--success-fg)' : 'var(--fg-muted)', background: 'transparent', border: 'none', cursor: 'pointer' }}
                >
                  {copied ? <Check size={13} strokeWidth={1.75} /> : <Link2 size={13} strokeWidth={1.75} />}
                  {copied ? 'Link kopiert' : 'Ergebnis teilen'}
                </button>
                <button
                  type="button"
                  onClick={reset}
                  className="font-mono uppercase inline-flex items-center"
                  style={{ gap: 8, minHeight: 32, fontSize: 11, letterSpacing: '0.12em', color: 'var(--fg-muted)', background: 'transparent', border: 'none', cursor: 'pointer' }}
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
