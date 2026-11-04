'use client'

/**
 * Strategie-Showcase — Full-Ausbau für /leistungen/strategie.
 *
 *   1 · Entscheidungsfelder     — 6 Domänen-Cards (Make-or-Buy, Vendor, M&A, Change, Security, Second-Opinion)
 *   2 · Stakeholder-Matrix      — GF / IT-Leitung / Belegschaft (Braucht / Bekommt)
 *   3 · Compliance-Tabs         — NIS-2 vs ISO 27001 vs TISAX
 *   4 · Reifegrad-Radar         — Spider-Chart Heute vs. Ziel (Assessment-Beweis)
 *   5 · Change-Stages           — Timeline (Awareness → Decision → Pilot → Rollout → Verankerung)
 *   6 · NDA-Promise + FAQ inline
 */

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react'
import {
  ShieldCheck, GitBranch, FileSignature, Users, Briefcase,
  Crown, Cog, HardHat,
  Eye, ScrollText, FlaskConical, Rocket, Anchor, Check, Lock,
  Building2, ServerCog,
} from 'lucide-react'
import ItalicAccent from '@/components/ui/ItalicAccent'
import GlossarHighlight from '@/components/ui/GlossarHighlight'
import CountUp from '@/components/ui/CountUp'

const EASE = [0.16, 1, 0.3, 1] as const

/* ── 1 · Entscheidungsfelder ──────────────────────────────────────── */

const ENTSCHEIDUNGSFELDER = [
  {
    Icon: GitBranch,
    title: 'Make-or-Buy',
    body:  'Eigene Entwicklung oder Standard-Software? Cloud oder On-Prem? Wir bewerten Kosten, Lock-in, TCO und Time-to-Value gegen die operative Realität in deinem Haus.',
    tags: ['ERP', 'CRM', 'DMS', 'Custom-Apps'],
  },
  {
    Icon: Briefcase,
    title: 'Vendor-Selection',
    body:  'RFP, Shortlist, POC. Drei Berater empfehlen drei verschiedene ERPs. Wir machen den Anbietervergleich, der dein Geschäftsmodell wirklich kennt.',
    tags: ['SAP', 'MS Dynamics', 'Odoo', 'Salesforce'],
  },
  {
    Icon: ShieldCheck,
    title: 'Informationssicherheit',
    body:  'NIS-2-Betroffenheit prüfen, ISO 27001 strukturiert aufsetzen, TISAX für Automotive. ISMS, das im Alltag hält — nicht nur fürs Audit.',
    tags: ['NIS-2', 'ISO 27001', 'TISAX', 'BSI-Grundschutz'],
    featured: true,
  },
  {
    Icon: Users,
    title: 'Change-Management',
    body:  'Belegschaft mitnehmen ohne Workshop-Theater. Multiplikatoren statt Top-Down-Rollout. Kommunikationsplan, der Widerstand früh erkennt.',
    tags: ['Adoption', 'Multiplikatoren', 'Pilot-Wellen'],
  },
  {
    Icon: Building2,
    title: 'M&A-IT-Due-Diligence',
    body:  'Du übernimmst ein Unternehmen oder denkst über einen Carve-out nach. IT-Risiko, technische Schulden, Lizenz-Lage, Security-Posture — schriftlich in 3 Wochen.',
    tags: ['Risk-Score', 'Lizenz-Audit', 'Security-Posture'],
  },
  {
    Icon: Eye,
    title: 'Second-Opinion',
    body:  'Du hast schon ein Beratungshaus. Wir prüfen Empfehlungen und Engagement-Verlauf, bestätigen oder stellen Alternativen daneben — schriftlich in 14 Tagen.',
    tags: ['Review', '14-Tage-Brief', 'Diskret'],
  },
]

/* ── 2 · Stakeholder-Matrix ──────────────────────────────────────── */

const STAKEHOLDER = [
  {
    Icon: Crown,
    role: 'Geschäftsführung',
    needs: [
      'Verständliche Empfehlung ohne IT-Buzzwords',
      'Investitions-Klarheit auf Budget-Horizont',
      'Risiko-Einschätzung in Du-Form',
    ],
    gets: [
      'Schriftliche Einschätzung in 14 Tagen',
      'Make-or-Buy-Empfehlung mit Zahlen',
      'Risk-Score für Aufsichtsrat / Beirat',
    ],
  },
  {
    Icon: Cog,
    role: 'IT-Leitung',
    needs: [
      'Sparring auf Augenhöhe, nicht Audit',
      'Validierung der eigenen Roadmap',
      'Konkrete Vendor- oder Tool-Bewertung',
    ],
    gets: [
      'Roadmap-Review mit Architektur-Blick',
      'POC-Begleitung bei Tool-Auswahl',
      'Direkter Draht ohne Ticket-Pyramide',
    ],
    featured: true,
  },
  {
    Icon: HardHat,
    role: 'Belegschaft',
    needs: [
      'Verständliche Kommunikation zum Wechsel',
      'Realistische Schulung statt PDF-Konvolut',
      'Ansprechpartner bei Frust mit dem Neuen',
    ],
    gets: [
      'Multiplikatoren-Modell mit klaren Rollen',
      'Pilot-Wellen statt Big-Bang-Rollout',
      'Feedback-Loops in Wochen, nicht Quartalen',
    ],
  },
]

/* ── 3 · Compliance-Tabs ─────────────────────────────────────────── */

const COMPLIANCE = [
  {
    key: 'nis2',
    label: 'NIS-2',
    full:  'NIS-2-Richtlinie · EU 2022/2555',
    Icon:  ShieldCheck,
    betroffen: 'Wesentliche und wichtige Einrichtungen mit > 50 MA oder > 10 Mio € Umsatz in 18 Sektoren — von Energie und Transport bis Lebensmittel und Verarbeitendes Gewerbe.',
    pflicht: 'Risikomanagement, Vorfalls-Meldungen binnen 24 / 72 / 30 Tagen, Lieferketten-Security, Awareness-Training, persönliche Haftung der Geschäftsführung.',
    erstesProjekt: [
      'Betroffenheitsanalyse: gilt NIS-2 überhaupt?',
      'Gap-Assessment gegen aktuellen Stand',
      'Maßnahmenplan + Roadmap mit Priorisierung',
      'Meldewege-Setup an BSI / nationale Stelle',
    ],
    aufwand: '8 – 16 Wochen für Erst-Implementierung',
    color: '#DC8044',
  },
  {
    key: 'iso27001',
    label: 'ISO 27001',
    full:  'ISO/IEC 27001 · Informations-Sicherheit',
    Icon:  Lock,
    betroffen: 'Freiwillig, aber häufig Pflicht in B2B-Lieferantenketten — Pharma, Finanzdienstleistung, kritische Infrastruktur, zunehmend auch Automotive-Zulieferer.',
    pflicht: 'ISMS-Aufbau, dokumentierte Prozesse für Risiko-Management, Asset-Inventar, Zugriffsverwaltung, Incident-Response, jährliches internes Audit.',
    erstesProjekt: [
      'Scope-Definition: was wird zertifiziert?',
      'Risk-Assessment + Statement of Applicability',
      'Policy-Set + Awareness-Programm',
      'Internal Audit + Management-Review',
    ],
    aufwand: '6 – 12 Monate bis Zertifizierungs-Reife',
    color: '#DC8044',
  },
  {
    key: 'tisax',
    label: 'TISAX',
    full:  'TISAX · Automotive-Standard',
    Icon:  ServerCog,
    betroffen: 'Zulieferer der Automobilindustrie — von OEM gefordert für Daten-Austausch (Konstruktion, Prototypen, vertrauliche Spezifikationen).',
    pflicht: 'VDA-ISA-Katalog (basiert auf ISO 27001 + Automotive-Spezifika), Assessment-Level 1 / 2 / 3 je nach Datenkritikalität, externe Prüfung durch Audit-Provider.',
    erstesProjekt: [
      'Assessment-Level klären (mit OEM-Anforderung)',
      'VDA-ISA-Selbstbewertung',
      'Gap-Beseitigung + Doku',
      'Externes Audit durch zugelassenen Prüfer',
    ],
    aufwand: '4 – 9 Monate, je nach Level',
    color: '#DC8044',
  },
]

/* ── 4 · Reifegrad-Radar ─────────────────────────────────────────── */

// TODO: Werte mit Stefan kalibrieren — plausible Platzhalter (0–100)
const RADAR_AXES = [
  { label: 'Identity & Access',     heute: 45, ziel: 88 },
  { label: 'Daten & DMS',           heute: 38, ziel: 80 },
  { label: 'Security & Compliance', heute: 30, ziel: 85 },
  { label: 'Prozesse & Automation', heute: 42, ziel: 82 },
  { label: 'AI-Readiness',          heute: 28, ziel: 75 },
  { label: 'Governance',            heute: 44, ziel: 82 },
]

// Gesamt-Reifegrad (Durchschnitt, gerundet) — TODO: mit Stefan kalibrieren
const RADAR_GESAMT_HEUTE = 38
const RADAR_GESAMT_ZIEL  = 82

/* ── 5 · Change-Stages ───────────────────────────────────────────── */

const CHANGE_STAGES = [
  {
    Icon: Eye,
    phase: 'Awareness',
    title: 'Bewusstsein schaffen',
    body: 'Was ändert sich, warum, ab wann. GF-Kommunikation + erste Town-Halls. Widerstand früh sichtbar machen, nicht weg-moderieren.',
    points: ['Stakeholder-Map', 'Kommunikations-Kaskade', 'Erste FAQ-Sammlung'],
    state: 'foundation' as const,
  },
  {
    Icon: ScrollText,
    phase: 'Decision',
    title: 'Entscheidung sichtbar machen',
    body: 'Optionen offen legen, Empfehlung begründen, GF entscheidet schriftlich. Keine „still beschlossene Sache", die später als Buschtrommel auftaucht.',
    points: ['Optionen-Doku', 'GF-Entscheid schriftlich', 'Roadmap-Pin'],
    state: 'foundation' as const,
  },
  {
    Icon: FlaskConical,
    phase: 'Pilot',
    title: 'Im Kleinen testen',
    body: 'Eine Abteilung, ein Team, ein Standort. Real arbeiten, real scheitern, real lernen. Feedback in Wochen-Loops, nicht im Quartals-Review.',
    points: ['Pilot-Scope definieren', 'Multiplikatoren aufbauen', 'Wochen-Retros'],
    state: 'now' as const,
  },
  {
    Icon: Rocket,
    phase: 'Rollout',
    title: 'In Wellen ausrollen',
    body: 'Welle für Welle, nicht Big-Bang. Lernen aus dem Pilot, Schulungen passend zur Welle, GF-Sponsorship sichtbar bei jedem Schritt.',
    points: ['Wellen-Plan', 'Schulungs-Modul pro Rolle', 'GF-Sichtbarkeit'],
    state: 'later' as const,
  },
  {
    Icon: Anchor,
    phase: 'Verankerung',
    title: 'Neuer Standard',
    body: 'Prozesse dokumentiert, Verantwortung übergeben, KPIs etabliert. Operativ verankert, nicht „Projekt abgeschlossen, Zettel weg".',
    points: ['Prozess-Doku live', 'Ownership übergeben', 'KPI-Tracking'],
    state: 'later' as const,
  },
]

/* ── Komponenten ──────────────────────────────────────────────────── */

export default function StrategieShowcase() {
  return (
    <>
      <Section1Entscheidungsfelder />
      <Section2Stakeholder />
      <Section3Compliance />
      <Section4Radar />
      <Section5ChangeStages />
      <Section6NdaPromise />
    </>
  )
}

/* ─────────────────────────────────────────────────────────────────── */

function Section1Entscheidungsfelder() {
  return (
    <section
      aria-label="Entscheidungsfelder"
      style={{
        maxWidth: 'var(--container-wide)',
        margin: '0 auto',
        padding: 'clamp(80px, 10vw, 128px) 24px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-15%' }}
        transition={{ duration: 0.7, ease: EASE }}
        style={{ maxWidth: '900px' }}
      >
        <p
          className="font-mono uppercase"
          style={{
            fontSize: '11px',
            letterSpacing: '0.20em',
            color: 'var(--brand)',
            marginBottom: '20px',
          }}
        >
          01 · Wo Strategie wirklich greift
        </p>
        <h2
          className="font-display font-bold"
          style={{
            fontSize: 'clamp(36px, 4.8vw, 64px)',
            lineHeight: 1.05,
            letterSpacing: 'var(--tr-display)',
            color: 'var(--fg-default)',
          }}
        >
          Sechs <ItalicAccent>Felder</ItalicAccent>, in denen Falsch-Entscheidungen teuer werden.
        </h2>
        <p
          className="mt-6 font-body"
          style={{
            fontSize: '17px',
            lineHeight: 1.65,
            color: 'var(--fg-muted)',
            maxWidth: '720px',
          }}
        >
          Du musst nicht alles brauchen. Aber für jedes dieser Felder gibt es einen
          Moment, an dem ein zweiter Kopf den Unterschied macht — bevor du dich
          auf einen Pfad festgelegt hast, der schwer rückgängig zu machen ist.
        </p>
      </motion.div>

      <ul
        className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
        style={{ listStyle: 'none', padding: 0 }}
      >
        {ENTSCHEIDUNGSFELDER.map((f, i) => (
          <motion.li
            key={f.title}
            className="glass-card relative h-full"
            style={{
              padding: '28px 28px 24px',
              minHeight: '300px',
              border: f.featured
                ? '1px solid rgba(220, 128, 68, 0.40)'
                : undefined,
            }}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.55, delay: i * 0.06, ease: EASE }}
          >
            <div className="relative z-[3] flex h-full flex-col">
              <div className="flex items-start justify-between gap-3">
                <span
                  className="inline-flex h-10 w-10 items-center justify-center"
                  style={{
                    background: 'rgba(220, 128, 68, 0.10)',
                    border: '1px solid rgba(220, 128, 68, 0.22)',
                    borderRadius: 'var(--r-sm)',
                    color: 'var(--brand)',
                  }}
                >
                  <f.Icon size={16} strokeWidth={1.5} />
                </span>
                {f.featured && (
                  <span
                    className="font-mono uppercase"
                    style={{
                      fontSize: '9px',
                      letterSpacing: '0.18em',
                      color: 'var(--accent)',
                      padding: '4px 10px',
                      background: 'rgba(220, 128, 68, 0.10)',
                      border: '1px solid rgba(220, 128, 68, 0.30)',
                      borderRadius: 'var(--r-pill)',
                    }}
                  >
                    Brennt 2026
                  </span>
                )}
              </div>

              <h3
                className="mt-6 font-display font-semibold"
                style={{
                  fontSize: '20px',
                  lineHeight: 1.2,
                  letterSpacing: 'var(--tr-heading)',
                  color: 'var(--fg-default)',
                }}
              >
                {f.title}
              </h3>

              <p
                className="mt-3 font-body"
                style={{
                  fontSize: '14px',
                  lineHeight: 1.6,
                  color: 'var(--fg-muted)',
                  flexGrow: 1,
                }}
              >
                <GlossarHighlight text={f.body} />
              </p>

              <ul
                className="mt-5 flex flex-wrap gap-1.5"
                style={{ listStyle: 'none', padding: 0 }}
              >
                {f.tags.map(t => (
                  <li
                    key={t}
                    className="font-mono uppercase"
                    style={{
                      fontSize: '9px',
                      letterSpacing: '0.16em',
                      padding: '4px 10px',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--r-pill)',
                      color: 'var(--fg-muted)',
                    }}
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </motion.li>
        ))}
      </ul>
    </section>
  )
}

/* ── 2 · Stakeholder-Matrix ──────────────────────────────────────── */

function Section2Stakeholder() {
  return (
    <section
      aria-label="Stakeholder-Matrix"
      style={{
        maxWidth: 'var(--container-wide)',
        margin: '0 auto',
        padding: 'clamp(80px, 10vw, 128px) 24px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-15%' }}
        transition={{ duration: 0.7, ease: EASE }}
        style={{ maxWidth: '900px' }}
      >
        <p
          className="font-mono uppercase"
          style={{
            fontSize: '11px',
            letterSpacing: '0.20em',
            color: 'var(--brand)',
            marginBottom: '20px',
          }}
        >
          02 · Wen ich abhole
        </p>
        <h2
          className="font-display font-bold"
          style={{
            fontSize: 'clamp(36px, 4.8vw, 64px)',
            lineHeight: 1.05,
            letterSpacing: 'var(--tr-display)',
            color: 'var(--fg-default)',
          }}
        >
          Drei <ItalicAccent>Ebenen</ItalicAccent>, drei Sprachen, eine Empfehlung.
        </h2>
        <p
          className="mt-6 font-body"
          style={{
            fontSize: '17px',
            lineHeight: 1.65,
            color: 'var(--fg-muted)',
            maxWidth: '660px',
          }}
        >
          Geschäftsführung will Klarheit. IT-Leitung will Sparring. Belegschaft
          will Mitnahme. Eine Strategie-Empfehlung, die nur eine Ebene bedient,
          scheitert im Alltag. Hier ist, was jeder bekommt.
        </p>
      </motion.div>

      <ul
        className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-3"
        style={{ listStyle: 'none', padding: 0 }}
      >
        {STAKEHOLDER.map((s, i) => (
          <motion.li
            key={s.role}
            className="glass-card relative h-full"
            style={{
              padding: '32px 30px',
              minHeight: '420px',
              border: s.featured
                ? '1px solid rgba(220, 128, 68, 0.40)'
                : undefined,
            }}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.55, delay: i * 0.08, ease: EASE }}
          >
            <div className="relative z-[3] flex h-full flex-col">
              <div className="flex items-center gap-4">
                <span
                  className="inline-flex h-12 w-12 items-center justify-center"
                  style={{
                    background: 'rgba(220, 128, 68, 0.12)',
                    border: '1px solid rgba(220, 128, 68, 0.28)',
                    borderRadius: 'var(--r-sm)',
                    color: 'var(--brand)',
                  }}
                >
                  <s.Icon size={20} strokeWidth={1.5} />
                </span>
                <h3
                  className="font-display font-semibold"
                  style={{
                    fontSize: '22px',
                    lineHeight: 1.2,
                    letterSpacing: 'var(--tr-heading)',
                    color: 'var(--fg-default)',
                  }}
                >
                  {s.role}
                </h3>
              </div>

              <div className="mt-7">
                <p
                  className="font-mono uppercase"
                  style={{
                    fontSize: '10px',
                    letterSpacing: '0.18em',
                    color: 'var(--fg-subtle)',
                    marginBottom: '10px',
                  }}
                >
                  Braucht
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {s.needs.map(n => (
                    <li
                      key={n}
                      className="flex items-start gap-2 py-1.5 font-body"
                      style={{ fontSize: '13px', lineHeight: 1.5, color: 'var(--fg-muted)' }}
                    >
                      <span
                        aria-hidden
                        className="mt-2 inline-block h-1 w-1 shrink-0"
                        style={{ background: 'var(--fg-subtle)', borderRadius: '50%' }}
                      />
                      {n}
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className="mt-6 pt-5"
                style={{ borderTop: '1px solid var(--border-subtle)' }}
              >
                <p
                  className="font-mono uppercase"
                  style={{
                    fontSize: '10px',
                    letterSpacing: '0.18em',
                    color: 'var(--brand)',
                    marginBottom: '10px',
                  }}
                >
                  Bekommt
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {s.gets.map(g => (
                    <li
                      key={g}
                      className="flex items-start gap-2 py-1.5 font-body"
                      style={{ fontSize: '13px', lineHeight: 1.5, color: 'var(--fg-default)' }}
                    >
                      <Check
                        size={12}
                        strokeWidth={2}
                        style={{ color: 'var(--accent)', marginTop: '4px', flexShrink: 0 }}
                      />
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.li>
        ))}
      </ul>
    </section>
  )
}

/* ── 3 · Compliance-Tabs ─────────────────────────────────────────── */

function Section3Compliance() {
  const [active, setActive] = useState(0)
  const current = COMPLIANCE[active]

  return (
    <section
      aria-label="Compliance-Vergleich"
      style={{
        maxWidth: 'var(--container-wide)',
        margin: '0 auto',
        padding: 'clamp(80px, 10vw, 128px) 24px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-15%' }}
        transition={{ duration: 0.7, ease: EASE }}
        style={{ maxWidth: '900px', marginBottom: '40px' }}
      >
        <p
          className="font-mono uppercase"
          style={{
            fontSize: '11px',
            letterSpacing: '0.20em',
            color: 'var(--brand)',
            marginBottom: '20px',
          }}
        >
          03 · Compliance ohne Panik
        </p>
        <h2
          className="font-display font-bold"
          style={{
            fontSize: 'clamp(36px, 4.8vw, 64px)',
            lineHeight: 1.05,
            letterSpacing: 'var(--tr-display)',
            color: 'var(--fg-default)',
          }}
        >
          NIS-2, ISO 27001, TISAX — was <ItalicAccent>wirklich</ItalicAccent> auf dich zukommt.
        </h2>
        <p
          className="mt-6 font-body"
          style={{
            fontSize: '17px',
            lineHeight: 1.65,
            color: 'var(--fg-muted)',
            maxWidth: '700px',
          }}
        >
          Drei Frameworks, drei Anlässe, drei Roadmaps. Hier ist die ehrliche Variante —
          ohne Berater-Angstmache, ohne Excel-Pflicht-Katalog. Wechsle die Tabs, um die
          Unterschiede zu sehen.
        </p>
      </motion.div>

      {/* Tabs */}
      <div role="tablist" aria-label="Compliance-Frameworks" className="mb-8 flex flex-wrap gap-2">
        {COMPLIANCE.map((c, i) => (
          <button
            key={c.key}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-label={`Framework ${c.label}`}
            onClick={() => setActive(i)}
            data-cursor="link"
            className="font-mono uppercase transition-all duration-220"
            style={{
              fontSize: '12px',
              letterSpacing: '0.18em',
              padding: '10px 18px',
              borderRadius: 'var(--r-pill)',
              border: i === active
                ? '1px solid rgba(220, 128, 68, 0.40)'
                : '1px solid var(--border-subtle)',
              background: i === active
                ? 'rgba(220, 128, 68, 0.10)'
                : 'transparent',
              color: i === active ? 'var(--brand)' : 'var(--fg-muted)',
              cursor: 'pointer',
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Detail */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.key}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="glass-card relative"
          style={{ padding: 'clamp(28px, 3vw, 44px)' }}
        >
          <div className="relative z-[3]">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="flex items-center gap-4">
                <span
                  className="inline-flex h-12 w-12 items-center justify-center"
                  style={{
                    background: 'rgba(220, 128, 68, 0.12)',
                    border: '1px solid rgba(220, 128, 68, 0.28)',
                    borderRadius: 'var(--r-sm)',
                    color: 'var(--brand)',
                  }}
                >
                  <current.Icon size={20} strokeWidth={1.5} />
                </span>
                <div>
                  <p
                    className="font-mono uppercase"
                    style={{
                      fontSize: '10px',
                      letterSpacing: '0.20em',
                      color: 'var(--brand)',
                      marginBottom: '4px',
                    }}
                  >
                    Framework {String(active + 1).padStart(2, '0')}
                  </p>
                  <h3
                    className="font-display font-bold"
                    style={{
                      fontSize: 'clamp(22px, 2.4vw, 32px)',
                      lineHeight: 1.15,
                      letterSpacing: 'var(--tr-heading)',
                      color: 'var(--fg-default)',
                    }}
                  >
                    {current.full}
                  </h3>
                </div>
              </div>
              <span
                className="font-mono uppercase shrink-0"
                style={{
                  fontSize: '9px',
                  letterSpacing: '0.18em',
                  padding: '6px 14px',
                  borderRadius: 'var(--r-pill)',
                  color: 'var(--brand)',
                  background: 'rgba(220, 128, 68, 0.10)',
                  border: '1px solid rgba(220, 128, 68, 0.28)',
                }}
              >
                Aufwand · {current.aufwand}
              </span>
            </div>

            {/* Body Grid */}
            <div className="mt-10 grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2">
              <div>
                <p
                  className="font-mono uppercase"
                  style={{
                    fontSize: '10px',
                    letterSpacing: '0.18em',
                    color: 'var(--fg-subtle)',
                    marginBottom: '12px',
                  }}
                >
                  Wer ist betroffen?
                </p>
                <p
                  className="font-body"
                  style={{
                    fontSize: '15px',
                    lineHeight: 1.65,
                    color: 'var(--fg-default)',
                  }}
                >
                  <GlossarHighlight text={current.betroffen} />
                </p>
              </div>
              <div>
                <p
                  className="font-mono uppercase"
                  style={{
                    fontSize: '10px',
                    letterSpacing: '0.18em',
                    color: 'var(--fg-subtle)',
                    marginBottom: '12px',
                  }}
                >
                  Was ist Pflicht?
                </p>
                <p
                  className="font-body"
                  style={{
                    fontSize: '15px',
                    lineHeight: 1.65,
                    color: 'var(--fg-default)',
                  }}
                >
                  <GlossarHighlight text={current.pflicht} />
                </p>
              </div>
            </div>

            {/* Erstes Projekt */}
            <div
              className="mt-10 pt-8"
              style={{ borderTop: '1px solid var(--border-subtle)' }}
            >
              <p
                className="font-mono uppercase"
                style={{
                  fontSize: '10px',
                  letterSpacing: '0.18em',
                  color: 'var(--brand)',
                  marginBottom: '16px',
                }}
              >
                Erstes Projekt · in dieser Reihenfolge
              </p>
              <ol
                className="grid grid-cols-1 gap-4 md:grid-cols-2"
                style={{ listStyle: 'none', padding: 0, margin: 0 }}
              >
                {current.erstesProjekt.map((step, i) => (
                  <li
                    key={step}
                    className="flex items-start gap-3 py-2"
                  >
                    <span
                      className="font-mono shrink-0"
                      style={{
                        fontSize: '11px',
                        color: 'var(--accent)',
                        letterSpacing: '0.04em',
                        fontWeight: 600,
                        paddingTop: '2px',
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      className="font-body"
                      style={{
                        fontSize: '14px',
                        lineHeight: 1.55,
                        color: 'var(--fg-default)',
                      }}
                    >
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  )
}

/* ── 4 · Reifegrad-Radar — SVG Spider-Chart, Heute vs. Ziel ───────── */

function Section4Radar() {
  const reduceMotion = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15%' })
  const play = reduceMotion ? true : inView

  // Geometrie
  const SIZE = 480
  const CX = SIZE / 2
  const CY = SIZE / 2
  const R = 176 // max-Radius (= 100 %)
  const N = RADAR_AXES.length
  const RINGS = [0.25, 0.5, 0.75, 1]

  // Winkel: i/N * 2π, Start oben (-90°)
  const angle = (i: number) => (i / N) * Math.PI * 2 - Math.PI / 2

  // Punkt auf Achse i bei Wert 0–100 (→ Radius 0–R)
  const pt = (i: number, value: number) => {
    const a = angle(i)
    const r = (value / 100) * R
    return { x: CX + Math.cos(a) * r, y: CY + Math.sin(a) * r }
  }

  // Polygon-Pfad aus den Achs-Werten
  const polygon = (key: 'heute' | 'ziel') =>
    RADAR_AXES
      .map((ax, i) => {
        const p = pt(i, ax[key])
        return `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`
      })
      .join(' ') + ' Z'

  // Label-Anker außerhalb des Rings
  const labelPos = (i: number) => {
    const a = angle(i)
    const lr = R + 28
    const x = CX + Math.cos(a) * lr
    const y = CY + Math.sin(a) * lr
    const cos = Math.cos(a)
    const anchor: 'start' | 'middle' | 'end' =
      Math.abs(cos) < 0.3 ? 'middle' : cos > 0 ? 'start' : 'end'
    return { x, y, anchor }
  }

  return (
    <section
      aria-label="Reifegrad-Radar"
      style={{
        maxWidth: 'var(--container-wide)',
        margin: '0 auto',
        padding: 'clamp(80px, 10vw, 128px) 24px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-15%' }}
        transition={{ duration: 0.7, ease: EASE }}
        style={{ maxWidth: '900px' }}
      >
        <p
          className="font-mono uppercase"
          style={{
            fontSize: '11px',
            letterSpacing: '0.20em',
            color: 'var(--brand)',
            marginBottom: '20px',
          }}
        >
          04 · Reifegrad sichtbar machen
        </p>
        <h2
          className="font-display font-bold"
          style={{
            fontSize: 'clamp(36px, 4.8vw, 64px)',
            lineHeight: 1.05,
            letterSpacing: 'var(--tr-display)',
            color: 'var(--fg-default)',
          }}
        >
          Wo du <ItalicAccent>heute</ItalicAccent> stehst — und wohin das Engagement dich bringt.
        </h2>
        <p
          className="mt-6 font-body"
          style={{
            fontSize: '17px',
            lineHeight: 1.65,
            color: 'var(--fg-muted)',
            maxWidth: '720px',
          }}
        >
          Jedes Assessment beginnt mit einer ehrlichen Standortbestimmung über sechs
          Dimensionen. Das innere Profil ist der typische Mittelstand zum Start, das
          äußere das Ziel nach der Begleitung. Keine Schulnoten — eine Landkarte, die
          zeigt, wo Aufwand zuerst Wirkung erzeugt.
        </p>
      </motion.div>

      <div
        ref={ref}
        className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center lg:gap-16"
      >
        {/* Radar-SVG */}
        <div style={{ maxWidth: '560px', width: '100%', margin: '0 auto' }}>
          <svg
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            width="100%"
            role="img"
            aria-label="Reifegrad-Radar über sechs Dimensionen: heutiger Stand gegen Ziel nach dem Engagement"
            style={{ overflow: 'visible' }}
          >
            {/* Grid-Ringe */}
            {RINGS.map((ring, ri) => {
              const path =
                RADAR_AXES.map((_, i) => {
                  const p = pt(i, ring * 100)
                  return `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`
                }).join(' ') + ' Z'
              return (
                <motion.path
                  key={ring}
                  d={path}
                  fill="none"
                  stroke="var(--border-subtle)"
                  strokeWidth={1}
                  initial={{ opacity: 0 }}
                  animate={play ? { opacity: ring === 1 ? 0.5 : 0.28 } : { opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + ri * 0.08, ease: EASE }}
                />
              )
            })}

            {/* Achsen-Speichen */}
            {RADAR_AXES.map((_, i) => {
              const p = pt(i, 100)
              return (
                <motion.line
                  key={i}
                  x1={CX}
                  y1={CY}
                  x2={p.x}
                  y2={p.y}
                  stroke="var(--border-subtle)"
                  strokeWidth={1}
                  initial={{ opacity: 0 }}
                  animate={play ? { opacity: 0.3 } : { opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.04, ease: EASE }}
                />
              )
            })}

            {/* Polygon — Heute (gedämpft) */}
            <motion.path
              d={polygon('heute')}
              fill="rgba(120, 116, 110, 0.12)"
              stroke="var(--fg-subtle)"
              strokeWidth={1.5}
              strokeLinejoin="round"
              style={{ transformOrigin: `${CX}px ${CY}px` }}
              initial={{ scale: reduceMotion ? 1 : 0, opacity: reduceMotion ? 1 : 0 }}
              animate={play ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
              transition={{ duration: 0.9, delay: 0.45, ease: EASE }}
            />

            {/* Polygon — Ziel (Brand, Glow) */}
            <motion.path
              d={polygon('ziel')}
              fill="rgba(220, 128, 68, 0.14)"
              stroke="var(--brand)"
              strokeWidth={2}
              strokeLinejoin="round"
              style={{
                transformOrigin: `${CX}px ${CY}px`,
                filter: 'drop-shadow(0 0 12px rgba(220, 128, 68, 0.45))',
              }}
              initial={{ scale: reduceMotion ? 1 : 0, opacity: reduceMotion ? 1 : 0 }}
              animate={play ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: EASE }}
            />

            {/* Ziel-Punkte */}
            {RADAR_AXES.map((ax, i) => {
              const p = pt(i, ax.ziel)
              return (
                <motion.circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r={3.5}
                  fill="var(--brand)"
                  initial={{ opacity: 0 }}
                  animate={play ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.4, delay: 1.0 + i * 0.05, ease: EASE }}
                />
              )
            })}

            {/* Achsen-Labels */}
            {RADAR_AXES.map((ax, i) => {
              const lp = labelPos(i)
              return (
                <motion.text
                  key={ax.label}
                  x={lp.x}
                  y={lp.y}
                  textAnchor={lp.anchor}
                  dominantBaseline="middle"
                  className="font-mono"
                  style={{
                    fontSize: '11px',
                    letterSpacing: '0.04em',
                    fill: 'var(--fg-muted)',
                  }}
                  initial={{ opacity: 0 }}
                  animate={play ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.05, ease: EASE }}
                >
                  {ax.label}
                </motion.text>
              )
            })}
          </svg>
        </div>

        {/* Legende + Gesamt-Score */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15%' }}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          className="glass-card relative"
          style={{ padding: 'clamp(28px, 3vw, 36px)' }}
        >
          <div className="relative z-[3]">
            <p
              className="font-mono uppercase"
              style={{
                fontSize: '10px',
                letterSpacing: '0.18em',
                color: 'var(--fg-subtle)',
                marginBottom: '20px',
              }}
            >
              Reifegrad gesamt
            </p>

            <div className="flex items-baseline gap-3">
              <span
                className="font-display font-bold"
                style={{ fontSize: '28px', color: 'var(--fg-subtle)', lineHeight: 1 }}
              >
                <CountUp to={RADAR_GESAMT_HEUTE} suffix=" %" />
              </span>
              <span aria-hidden style={{ color: 'var(--fg-subtle)', fontSize: '18px' }}>
                →
              </span>
              <span
                className="font-display font-bold"
                style={{
                  fontSize: 'clamp(40px, 5vw, 56px)',
                  color: 'var(--brand)',
                  lineHeight: 1,
                }}
              >
                <CountUp to={RADAR_GESAMT_ZIEL} suffix=" %" duration={1.8} />
              </span>
            </div>
            <p
              className="mt-3 font-body"
              style={{ fontSize: '13px', lineHeight: 1.5, color: 'var(--fg-muted)' }}
            >
              Durchschnitt über alle sechs Dimensionen — vom typischen Start bis zum
              Ziel nach dem Engagement.
            </p>

            {/* Legende */}
            <ul
              className="mt-8"
              style={{
                listStyle: 'none',
                padding: '24px 0 0',
                margin: 0,
                borderTop: '1px solid var(--border-subtle)',
              }}
            >
              <li className="flex items-center gap-3 py-2">
                <span
                  aria-hidden
                  className="inline-block shrink-0"
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: '3px',
                    background: 'rgba(120, 116, 110, 0.20)',
                    border: '1.5px solid var(--fg-subtle)',
                  }}
                />
                <span className="font-body" style={{ fontSize: '14px', color: 'var(--fg-muted)' }}>
                  Heute · typischer Mittelstand
                </span>
              </li>
              <li className="flex items-center gap-3 py-2">
                <span
                  aria-hidden
                  className="inline-block shrink-0"
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: '3px',
                    background: 'rgba(220, 128, 68, 0.22)',
                    border: '1.5px solid var(--brand)',
                    boxShadow: '0 0 10px rgba(220, 128, 68, 0.45)',
                  }}
                />
                <span className="font-body" style={{ fontSize: '14px', color: 'var(--fg-default)' }}>
                  Nach dem Engagement · Ziel
                </span>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Section5ChangeStages() {
  return (
    <section
      aria-label="Change-Stages"
      className="relative overflow-hidden"
      style={{
        padding: 'clamp(96px, 12vw, 160px) 24px',
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(50% 60% at 50% 30%, rgba(220, 128, 68, 0.08) 0%, transparent 65%),' +
            'radial-gradient(40% 50% at 80% 80%, rgba(146, 48, 30, 0.06) 0%, transparent 60%)',
          zIndex: 0,
        }}
      />

      <div
        className="relative mx-auto"
        style={{ maxWidth: 'var(--container-wide)', zIndex: 1 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15%' }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ maxWidth: '860px', marginBottom: 'clamp(56px, 7vw, 88px)' }}
        >
          <p
            className="font-mono uppercase"
            style={{
              fontSize: '11px',
              letterSpacing: '0.20em',
              color: 'var(--brand)',
              marginBottom: '24px',
            }}
          >
            05 · Change ohne Workshop-Theater
          </p>
          <h2
            className="font-display font-bold"
            style={{
              fontSize: 'clamp(40px, 5.4vw, 84px)',
              lineHeight: 0.98,
              letterSpacing: 'var(--tr-display)',
              color: 'var(--fg-default)',
            }}
          >
            Belegschaft <ItalicAccent>mitnehmen</ItalicAccent>,<br />
            nicht abholen lassen.
          </h2>
          <p
            className="mt-8 font-body"
            style={{
              fontSize: '18px',
              lineHeight: 1.6,
              color: 'var(--fg-muted)',
              maxWidth: '680px',
            }}
          >
            Jede Tool- oder Prozess-Umstellung läuft besser oder schlechter
            an genau diesen fünf Punkten. Ich kenne sie aus 12 Jahren
            Industrie-IT — und löse sie operativ, nicht im Berater-Deck.
          </p>
        </motion.div>

        {/* Stages-Timeline */}
        <div className="relative">
          {/* Vertikale Connection-Line */}
          <div
            aria-hidden
            className="pointer-events-none absolute hidden md:block"
            style={{
              left: '23px',
              top: '32px',
              bottom: '40px',
              width: '2px',
              background:
                'linear-gradient(180deg, var(--brand) 0%, rgba(220, 128, 68, 0.50) 25%, rgba(220, 128, 68, 0.30) 50%, var(--border-subtle) 80%)',
              opacity: 0.6,
            }}
          />

          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {CHANGE_STAGES.map((s, i) => (
              <ChangeStage key={s.phase} stage={s} index={i} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function ChangeStage({
  stage,
  index,
}: {
  stage: typeof CHANGE_STAGES[number]
  index: number
}) {
  const isFoundation = stage.state === 'foundation'
  const isNow = stage.state === 'now'
  const accentColor = isFoundation ? '#DC8044' : isNow ? 'var(--accent)' : 'var(--fg-subtle)'
  const dotShadow = isNow ? '0 0 18px rgba(220, 128, 68, 0.65)' : 'none'

  return (
    <motion.li
      className="relative md:pl-20"
      style={{ marginBottom: index === CHANGE_STAGES.length - 1 ? 0 : 'clamp(24px, 2.6vw, 36px)' }}
      initial={{ opacity: 0, x: 24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-12%' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: EASE }}
    >
      {/* Status-Dot */}
      <div
        aria-hidden
        className="absolute hidden md:flex items-center justify-center"
        style={{
          left: '8px',
          top: '32px',
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'var(--bg-base)',
          border: `2px solid ${accentColor}`,
          boxShadow: dotShadow,
        }}
      >
        {isNow ? (
          <span
            className="animate-pulse"
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: 'var(--accent)',
            }}
          />
        ) : (
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: accentColor,
              opacity: isFoundation ? 0.9 : 0.5,
            }}
          />
        )}
      </div>

      <article
        className="glass-card relative"
        style={{
          padding: 'clamp(24px, 2.4vw, 36px)',
          border: isNow ? '1px solid rgba(220, 128, 68, 0.35)' : undefined,
          background: isNow
            ? 'linear-gradient(145deg, rgba(220, 128, 68, 0.05), rgba(220, 128, 68, 0.02))'
            : undefined,
        }}
      >
        <div className="relative z-[3]">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <span
                className="inline-flex items-center justify-center"
                style={{
                  width: 48,
                  height: 48,
                  background: 'rgba(220, 128, 68, 0.10)',
                  border: '1px solid rgba(220, 128, 68, 0.24)',
                  borderRadius: 'var(--r-sm)',
                  color: accentColor,
                }}
              >
                <stage.Icon size={22} strokeWidth={1.5} />
              </span>
              <div>
                <p
                  className="font-mono uppercase"
                  style={{
                    fontSize: '10px',
                    letterSpacing: '0.20em',
                    color: accentColor,
                    marginBottom: '4px',
                  }}
                >
                  Stage {String(index + 1).padStart(2, '0')} · {stage.phase}
                </p>
                <h3
                  className="font-display font-semibold"
                  style={{
                    fontSize: 'clamp(22px, 2.4vw, 30px)',
                    lineHeight: 1.15,
                    letterSpacing: 'var(--tr-heading)',
                    color: 'var(--fg-default)',
                  }}
                >
                  {stage.title}
                </h3>
              </div>
            </div>
          </div>

          <p
            className="mt-6 font-body"
            style={{
              fontSize: '16px',
              lineHeight: 1.6,
              color: 'var(--fg-muted)',
              maxWidth: '720px',
            }}
          >
            {stage.body}
          </p>

          <ul
            className="mt-6 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-3"
            style={{ listStyle: 'none', padding: 0, margin: 0 }}
          >
            {stage.points.map(p => (
              <li
                key={p}
                className="flex items-start gap-2.5 py-1.5 font-mono"
                style={{
                  fontSize: '12px',
                  color: 'var(--fg-default)',
                  letterSpacing: '0.02em',
                  borderBottom: '1px solid var(--border-subtle)',
                }}
              >
                <span
                  aria-hidden
                  style={{ color: accentColor, fontSize: 10, paddingTop: 4 }}
                >
                  ▸
                </span>
                <span style={{ paddingTop: 1 }}>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </article>
    </motion.li>
  )
}

/* ── 6 · NDA-Promise — quiet closing ─────────────────────────────── */

function Section6NdaPromise() {
  return (
    <section
      aria-label="Diskretion"
      style={{
        maxWidth: 'var(--container-wide)',
        margin: '0 auto',
        padding: 'clamp(80px, 10vw, 128px) 24px',
      }}
    >
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-20">
        {/* Left · Promise */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15%' }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <p
            className="font-mono uppercase"
            style={{
              fontSize: '11px',
              letterSpacing: '0.20em',
              color: 'var(--brand)',
              marginBottom: '20px',
            }}
          >
            06 · Diskretion ist Voreinstellung
          </p>
          <h2
            className="font-display font-bold"
            style={{
              fontSize: 'clamp(36px, 4.8vw, 64px)',
              lineHeight: 1.02,
              letterSpacing: 'var(--tr-display)',
              color: 'var(--fg-default)',
            }}
          >
            NDA vor dem zweiten Termin.{' '}
            <ItalicAccent>Immer.</ItalicAccent>
          </h2>
          <p
            className="mt-6 font-body"
            style={{
              fontSize: '18px',
              lineHeight: 1.65,
              color: 'var(--fg-muted)',
              maxWidth: '620px',
            }}
          >
            Mandaten-Liste gibt es nicht öffentlich. Engagement wird auf
            Website und LinkedIn nur erwähnt, wenn du es schriftlich freigibst.
            Referenzen nur auf direkte Anfrage und nach Rückfrage beim Mandanten.
          </p>

          <ul
            className="mt-10 flex flex-wrap gap-x-8 gap-y-3"
            style={{ listStyle: 'none', padding: 0 }}
          >
            {[
              { Icon: Lock, label: 'NDA-Template auf Anfrage' },
              { Icon: FileSignature, label: 'Eigene NDA akzeptiert' },
              { Icon: ShieldCheck, label: 'Datenräume DSGVO-konform' },
            ].map(item => (
              <li
                key={item.label}
                className="flex items-center gap-2 font-mono"
                style={{ fontSize: '12px', color: 'var(--fg-default)' }}
              >
                <item.Icon size={14} strokeWidth={1.6} style={{ color: 'var(--brand)' }} />
                {item.label}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Right · Signed NDA Card */}
        <motion.div
          initial={{ opacity: 0, y: 16, rotate: -1 }}
          whileInView={{ opacity: 1, y: 0, rotate: -2 }}
          viewport={{ once: true, margin: '-20%' }}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          style={{
            width: 'min(380px, 100%)',
            padding: '26px 30px',
            background: '#F2F0EB',
            borderRadius: '8px',
            boxShadow:
              '0 1px 0 rgba(255, 255, 255, 0.4) inset, 0 24px 60px rgba(0, 0, 0, 0.55)',
            border: '1px solid rgba(0, 0, 0, 0.08)',
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p
                className="font-mono uppercase"
                style={{
                  fontSize: '9px',
                  letterSpacing: '0.20em',
                  color: '#92301E',
                  marginBottom: '6px',
                }}
              >
                Confidential
              </p>
              <p
                className="font-display font-bold"
                style={{
                  fontSize: '20px',
                  color: '#0F0E0C',
                  letterSpacing: '-0.01em',
                  lineHeight: 1.2,
                }}
              >
                Non-Disclosure Agreement
              </p>
              <p
                className="mt-2 font-mono"
                style={{ fontSize: '10px', color: '#5C5851' }}
              >
                zwischen Mandant und Stefan Braum
              </p>
            </div>
            <FileSignature size={32} strokeWidth={1.4} style={{ color: '#DC8044', flexShrink: 0 }} />
          </div>

          <div
            style={{
              marginTop: '24px',
              paddingTop: '18px',
              borderTop: '1px solid rgba(0, 0, 0, 0.10)',
            }}
          >
            <div className="flex items-end justify-between gap-4">
              <div>
                <p
                  className="font-mono uppercase"
                  style={{ fontSize: '8px', letterSpacing: '0.16em', color: '#5C5851', marginBottom: '4px' }}
                >
                  Stefan Braum
                </p>
                <SignatureDraw />
              </div>
              <p
                className="font-mono"
                style={{ fontSize: '9px', color: '#5C5851' }}
              >
                vor dem 2. Termin
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ── Signatur · SVG inline, jeder Buchstabe wird nacheinander mit
       stroke-dashoffset nachgezeichnet, dann gefüllt ─────────────────── */

function SignatureDraw() {
  const reduceMotion = useReducedMotion()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inView = useInView(wrapperRef, { once: true, margin: '-15%' })
  const [svg, setSvg] = useState<string>('')
  const animatedRef = useRef(false)

  useEffect(() => {
    fetch('/assets/signature/sbraum.svg')
      .then(r => r.text())
      .then(setSvg)
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!svg || !wrapperRef.current) return
    const wrapper = wrapperRef.current
    const paths = wrapper.querySelectorAll<SVGPathElement>('path')
    if (!paths.length) return

    // 1) INITIAL state ohne Transition — Stift dick, fill UNSICHTBAR
    //    Mit dicker Stroke deckt der "Stift" den Buchstaben fast komplett ab,
    //    fill kommt überlappend dazu → wirkt wie durchschreiben statt outline+füllen.
    paths.forEach(path => {
      const length = path.getTotalLength()
      path.style.transition = 'none'
      path.style.fill = reduceMotion ? '#0F0E0C' : 'transparent'
      path.style.stroke = '#0F0E0C'
      path.style.strokeWidth = reduceMotion ? '0' : '2.4'
      path.style.strokeLinecap = 'round'
      path.style.strokeLinejoin = 'round'
      path.style.strokeDasharray = String(length)
      path.style.strokeDashoffset = reduceMotion ? '0' : String(length)
    })

    if (reduceMotion || !inView || animatedRef.current) return
    animatedRef.current = true

    // 2) Force reflow, damit Browser den initial state registriert
    void wrapper.offsetHeight

    // 3) Transitions setzen, dann im nächsten Frame finalen State triggern
    const STROKE_DURATION = 0.55    // schneller Schreibstrich
    const FILL_DURATION   = 0.25    // fill blendet überlappend ein
    const STAGGER         = 0.30    // kurzer Versatz zwischen Buchstaben

    paths.forEach((path, i) => {
      const strokeDelay = 0.2 + i * STAGGER
      // Fill startet im LETZTEN DRITTEL des Stifts → überlappt mit Stroke
      const fillDelay   = strokeDelay + STROKE_DURATION * 0.55
      const widthDelay  = strokeDelay + STROKE_DURATION + 0.05
      path.style.transition =
        `stroke-dashoffset ${STROKE_DURATION}s ease-out ${strokeDelay}s, ` +
        `fill ${FILL_DURATION}s ease-out ${fillDelay}s, ` +
        `stroke-width 0.18s ease-out ${widthDelay}s`
    })

    requestAnimationFrame(() => {
      paths.forEach(path => {
        path.style.strokeDashoffset = '0'
        path.style.fill = '#0F0E0C'
        path.style.strokeWidth = '0'
      })
    })
  }, [svg, inView, reduceMotion])

  return (
    <div
      ref={wrapperRef}
      style={{
        width: '200px',
        height: '70px',
      }}
      aria-label="Signatur Stefan Braum"
      dangerouslySetInnerHTML={{
        __html: svg
          .replace(/width="[^"]*"/, 'width="100%"')
          .replace(/height="[^"]*"/, 'height="100%"'),
      }}
    />
  )
}
