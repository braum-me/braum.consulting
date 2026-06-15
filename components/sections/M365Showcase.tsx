'use client'

/**
 * M365-Showcase — Full-Ausbau-Pattern für /leistungen/m365.
 * Workspace-Architektur, Vorher/Nachher, Prozess, Blueprints, Use-Cases,
 * Übergang zu AI & Automatisierung.
 */

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { trackEvent } from '@/lib/analytics'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import {
  Lock, Users, FileText, Smartphone, ShieldCheck, FileCheck,
  Server, Cloud, Sparkles, ArrowRight, Building2, Factory, Briefcase,
  Mic, Monitor, Plane, Check, X,
  LogIn, Fingerprint, KeyRound, MapPin, Grid3x3, MessageSquare,
  Mail, FolderOpen, BarChart3,
} from 'lucide-react'
import ItalicAccent from '@/components/ui/ItalicAccent'
import CountUp from '@/components/ui/CountUp'
import GlossarHighlight from '@/components/ui/GlossarHighlight'

const EASE = [0.16, 1, 0.3, 1] as const

/**
 * Rendert eine Use-Case-Kennzahl belebt:
 *   "47 / 47" → beide Zahlen zählen hoch, " / " als Text dazwischen
 *   "8 / 8"   → dito
 *   reine Ganzzahl ("0") → CountUp
 *   gemischte Strings ("~ 2 Sek.") → unverändert als Text
 */
function MetricValue({ value }: { value: string }) {
  const ratio = value.match(/^(\d+)\s*\/\s*(\d+)$/)
  if (ratio) {
    return (
      <>
        <CountUp to={Number(ratio[1])} duration={1.4} />
        {' / '}
        <CountUp to={Number(ratio[2])} duration={1.4} />
      </>
    )
  }
  if (/^\d+$/.test(value.trim())) {
    return <CountUp to={Number(value.trim())} duration={1.4} />
  }
  return <>{value}</>
}

/* ── Daten ──────────────────────────────────────────────────────── */

const ARCHITECTURE_PILLARS = [
  {
    Icon: Lock,
    title: 'Identity',
    body:  'Ein Login, passwortlos per Passkey. Entra ID oder Google Identity. MFA als Pflicht, Conditional Access, SSO zu allen Drittsystemen.',
    tools: ['Entra ID · Google Identity', 'Passwortlos · Passkeys', 'Conditional Access', 'SCIM-Provisioning'],
  },
  {
    Icon: Users,
    title: 'Communication',
    body:  'E-Mail in der Cloud, Chat statt Forward-Wall, Meetings mit oder ohne Teams Rooms, externe Kollaboration ohne Sicherheitsbruch.',
    tools: ['Exchange Online · Gmail', 'Teams · Google Meet', 'Teams Rooms', 'Externe Sharing-Policies'],
  },
  {
    Icon: FileText,
    title: 'Content',
    body:  'Dokumente, die jeder findet. SharePoint als DMS oder Google Drive — versioniert, suchbar, klassifiziert.',
    tools: ['SharePoint Online', 'OneDrive · Google Drive', 'Metadaten + Suche', 'DMS-Workflows'],
  },
  {
    Icon: Smartphone,
    title: 'Devices',
    body:  'Notebook, iPhone, Tablet — egal welcher Standort. Einheitliche Compliance-Policies, automatisches Onboarding, BYOD sauber gelöst.',
    tools: ['Intune · Google MDM', 'Autopilot · Zero-Touch', 'BYOD-Strategie', 'App-Whitelisting'],
  },
  {
    Icon: ShieldCheck,
    title: 'Security',
    body:  'Defender, Datenklassifizierung, DLP, Backup. Sichtbarkeit über Angriffsflächen, automatische Reaktion auf Vorfälle.',
    tools: ['Defender für Endpoint', 'DLP-Policies', 'Datenklassifizierung', 'Backup-Strategie'],
  },
  {
    Icon: FileCheck,
    title: 'Compliance',
    body:  'DSGVO, Aufbewahrungspflichten, Audit-Trails. Saubere Doku, die jeder Auditor versteht. EU Data Boundary wo möglich.',
    tools: ['Purview · Vault', 'Retention-Policies', 'Audit-Logs', 'EU Data Boundary'],
  },
]

const PROCESS = [
  {
    num: '01',
    title: 'Audit + Inventar',
    body: 'Aktueller IT-Stand wird systematisch aufgenommen. Welche Systeme, welche Lizenzen, wo liegen die Daten, wer hat Zugriff. Schatten-IT inklusive.',
    duration: 'Woche 1-2',
  },
  {
    num: '02',
    title: 'Architektur + Blueprint',
    body: 'Ziel-Architektur designed je nach Unternehmensgröße und Branche. Identity-Modell, Lizenz-Stufen, Migrations-Pfad, Security-Layer.',
    duration: 'Woche 3-4',
  },
  {
    num: '03',
    title: 'Pilot mit Champions',
    body: 'Eine Abteilung oder ein Standort migriert zuerst. Champion-User testen, geben Feedback. Probleme werden gefixt, bevor das ganze Unternehmen umzieht.',
    duration: 'Woche 5-9',
  },
  {
    num: '04',
    title: 'Roll-out + Adoption',
    body: 'Welle für Welle wird migriert. Schulungen, Selbstlern-Material, Sprechstunde. Champions multiplizieren das Wissen in ihre Teams.',
    duration: 'Woche 10-22',
  },
]

const BLUEPRINTS = [
  {
    Icon: Briefcase,
    badge: 'Small',
    size: '10 – 50 Mitarbeitende',
    title: 'Schlanker Start.',
    body:  'Sauberes Setup für kleine Teams ohne dedizierte IT-Abteilung. Browser-first, mobil, in Wochen fertig — nicht in Monaten.',
    bullets: [
      'M365 Business Premium oder Google Workspace Business',
      'Entra / Google Identity · MFA für alle',
      'OneDrive · Google Drive als File-Layer',
      'Intune-Lite oder Google MDM',
    ],
  },
  {
    Icon: Building2,
    badge: 'Midmarket',
    size: '50 – 250 Mitarbeitende',
    title: 'Strukturiertes Wachstum.',
    body:  'Eigene IT-Abteilung, mehrere Standorte, Compliance wird ernst. Volle Plattform — sauber dokumentiert, übergeben.',
    bullets: [
      'M365 E3 oder Workspace Enterprise',
      'SharePoint als DMS · Teams Rooms',
      'Intune · Autopilot · Conditional Access',
      'Defender · DLP · Audit-Logs',
    ],
    featured: true,
  },
  {
    Icon: Factory,
    badge: 'Industry',
    size: '250 + Mitarbeitende',
    title: 'Industrie-grade Plattform.',
    body:  'Mehrere Tenants, Tochtergesellschaften, Produktionsumgebungen, OT-Integration. Zero-Trust, Purview, Defender XDR.',
    bullets: [
      'M365 E5 · Defender XDR · Purview',
      'Multi-Tenant-Governance',
      'OT-Sicherheit · Produktions-Netze',
      'EU Data Boundary · DSGVO-Vollausbau',
    ],
  },
]

const USE_CASES = [
  {
    Icon: Smartphone,
    eyebrow: 'Use-Case · Intune',
    title:   'Vom Notebook-Wildwuchs zur 1-Klick-Compliance',
    body:    'Mittelständische Industriefirma, 100 Mitarbeitende, 47 Notebooks aus drei Generationen. Vorher: keiner weiß, was wo drauf ist. Nachher: zentrales Dashboard, jedes Gerät verschlüsselt, Patches automatisch, neue Hires bekommen ihr Gerät vorkonfiguriert per Post.',
    metric:  '47 / 47',
    metricLabel: 'compliant · gesamt',
  },
  {
    Icon: Mic,
    eyebrow: 'Use-Case · Teams Rooms',
    title:   'Konferenzräume, die einfach funktionieren',
    body:    'Schluss mit „wie war noch der Code für den Beamer". Teams Rooms im Hauptkonferenzraum, BYO-Device in den kleinen Räumen. Audio sauber, Video gut, Bildschirm-Sharing per Magnet-Klick. Sogar die Geschäftsführung kommt damit klar.',
    metric:  '8 / 8',
    metricLabel: 'Räume · automatisiert',
  },
  {
    Icon: FileText,
    eyebrow: 'Use-Case · SharePoint DMS',
    title:   'Dokumente, die jeder findet',
    body:    'Vom File-Server-Chaos mit „2024_FINAL_v3_neu.docx" zur strukturierten DMS-Welt: Metadaten, Versionierung, Volltextsuche, Aufbewahrung nach Vorgabe. Vertrieb findet seine Angebote, HR findet ihre Verträge, Audit findet seinen Pfad.',
    metric:  '~ 2 Sek.',
    metricLabel: 'Dokument finden · vorher: Minuten',
  },
  {
    Icon: Plane,
    eyebrow: 'Use-Case · Mobile First',
    title:   'Arbeiten von überall — sicher',
    body:    'Außendienst auf der Baustelle, Vertrieb beim Kunden, GF im Flieger. Browser auf — alles da. MFA, Geräte-Compliance, automatische Sperrung bei Diebstahl. Schluss mit VPN-Tickets und Excel-Anhängen per Mail.',
    metric:  '0',
    metricLabel: 'VPN-Tickets · letzte 30 Tage',
  },
]

const VORHER_NACHHER = {
  before: {
    title: 'On-Prem-Wildwuchs',
    items: [
      { text: 'Exchange-Server im Keller, niemand weiß welcher Update-Stand', good: false },
      { text: 'Drei File-Server, Schatten-Kopien überall', good: false },
      { text: 'VPN zum Arbeiten von zuhause — wenn er funktioniert', good: false },
      { text: 'Zwei Domains, drei Login-Systeme, kein SSO', good: false },
      { text: 'BYOD: „mach was du willst, schick uns bitte keinen Trojaner"', good: false },
      { text: 'Audit-Vorbereitung: zwei Wochen vorher Panik', good: false },
    ],
  },
  after: {
    title: 'Cloud-Klarheit',
    items: [
      { text: 'E-Mail in M365 / Workspace, EU-Region, Backups automatisch', good: true },
      { text: 'SharePoint / Drive — versioniert, suchbar, klassifiziert', good: true },
      { text: 'Browser auf, MFA, fertig — egal welcher Standort', good: true },
      { text: 'Ein Login für alles — passwortlos per Passkey, SSO zu Drittsystemen', good: true },
      { text: 'Intune / MDM: jedes Gerät compliant, neue Hires per Autopilot', good: true },
      { text: 'Audit-Trail läuft mit, Doku ist immer aktuell', good: true },
    ],
  },
}

/* ── Default-Export ─────────────────────────────────────────────── */

export default function M365Showcase() {
  return (
    <>
      <Section1Architecture />
      <Section2BeforeAfter />
      <Section3Process />
      <Section4Blueprints />
      <Section5UseCases />
      <Section6Next />
    </>
  )
}

/* ── 01 · Workspace-Architektur ─────────────────────────────────── */

function Section1Architecture() {
  return (
    <section
      aria-label="Workspace-Architektur"
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
          01 · Workspace-Architektur
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
          Sechs Säulen, eine{' '}
          <ItalicAccent>Plattform</ItalicAccent>.
        </h2>
        <p
          className="mt-6 font-body"
          style={{
            fontSize: '17px',
            lineHeight: 1.65,
            color: 'var(--fg-muted)',
            maxWidth: '680px',
          }}
        >
          Egal ob Microsoft 365 oder Google Workspace — moderne
          Cloud-Arbeitsumgebung steht auf den selben sechs Säulen. Wir bauen
          alle sechs sauber auf, dokumentiert, übergeben.
        </p>
      </motion.div>

      <ul
        className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
        style={{ listStyle: 'none', padding: 0 }}
      >
        {ARCHITECTURE_PILLARS.map((p, i) => (
          <motion.li
            key={p.title}
            className="glass-card relative"
            style={{ padding: '28px 30px', minHeight: '280px' }}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.55, delay: i * 0.06, ease: EASE }}
          >
            <div className="relative z-[3] flex h-full flex-col">
              <div className="flex items-start justify-between">
                <span
                  className="inline-flex h-11 w-11 items-center justify-center"
                  style={{
                    background: 'rgba(220, 128, 68, 0.10)',
                    border: '1px solid rgba(220, 128, 68, 0.22)',
                    borderRadius: 'var(--r-sm)',
                    color: 'var(--brand)',
                  }}
                >
                  <p.Icon size={18} strokeWidth={1.5} />
                </span>
                <span
                  className="font-mono uppercase"
                  style={{
                    fontSize: '9px',
                    letterSpacing: '0.18em',
                    color: 'var(--fg-subtle)',
                  }}
                >
                  Säule {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <h3
                className="mt-6 font-display font-semibold"
                style={{
                  fontSize: '22px',
                  letterSpacing: 'var(--tr-heading)',
                  color: 'var(--fg-default)',
                }}
              >
                {p.title}
              </h3>
              <p
                className="mt-3 font-body"
                style={{
                  fontSize: '14px',
                  lineHeight: 1.55,
                  color: 'var(--fg-muted)',
                }}
              >
                <GlossarHighlight text={p.body} />
              </p>
              <ul
                className="mt-auto pt-5"
                style={{ listStyle: 'none', padding: '16px 0 0', margin: 0 }}
              >
                {p.tools.map(t => (
                  <li
                    key={t}
                    className="flex items-start gap-2 py-1 font-mono"
                    style={{
                      fontSize: '11px',
                      color: 'var(--fg-default)',
                      letterSpacing: '0.02em',
                    }}
                  >
                    <span
                      aria-hidden
                      style={{ color: 'var(--accent)', fontSize: 10, paddingTop: 2 }}
                    >
                      ▸
                    </span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.li>
        ))}
      </ul>

      <IdentityFlow />
    </section>
  )
}

/* ── 01b · Identity-Flow-Widget (Zero-Trust-Login, selbst-ablaufend) ─ */

const FLOW_STAGES = [
  {
    Icon: LogIn,
    label: 'Anmeldung',
    note: 'Nutzer öffnet den Browser',
  },
  {
    Icon: Fingerprint,
    label: 'Passwortlos · Passkey',
    note: 'Face / Fingerprint statt Kennwort',
    highlight: true,
  },
  {
    Icon: KeyRound,
    label: 'MFA',
    note: 'Zweiter Faktor, phishing-resistent',
  },
  {
    Icon: MapPin,
    label: 'Conditional Access',
    note: 'Gerät · Standort · Risiko geprüft',
    checks: ['Gerät compliant', 'Standort ok', 'Risiko niedrig'],
  },
  {
    Icon: Grid3x3,
    label: 'SSO',
    note: 'Ein Login öffnet alle Apps',
  },
] as const

const FLOW_APPS = [
  { Icon: Users, label: 'Teams' },
  { Icon: Mail, label: 'Outlook' },
  { Icon: FolderOpen, label: 'SharePoint' },
  { Icon: BarChart3, label: 'Salesforce' },
  { Icon: MessageSquare, label: 'Slack' },
] as const

const STAGE_MS = 1400

function IdentityFlow() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(reduce ? FLOW_STAGES.length : -1)
  const [running, setRunning] = useState(false)

  // Start, sobald sichtbar (IntersectionObserver). Bei reduced-motion: Endzustand.
  useEffect(() => {
    if (reduce) return
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setRunning(true)
        else setRunning(false)
      },
      { threshold: 0.35 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [reduce])

  // Phasen-Loop.
  useEffect(() => {
    if (reduce || !running) return
    setActive(0)
    let stage = 0
    const id = setInterval(() => {
      stage += 1
      if (stage > FLOW_STAGES.length) {
        stage = 0 // Loop: zurück auf Stufe 1
      }
      setActive(stage)
    }, STAGE_MS)
    return () => clearInterval(id)
  }, [reduce, running])

  const ssoIndex = FLOW_STAGES.length - 1
  const ssoReached = active >= ssoIndex
  const appsOn = active >= FLOW_STAGES.length // Sequenz durch → Apps leuchten
  const progress =
    active < 0 ? 0 : Math.min(active, FLOW_STAGES.length - 1) / (FLOW_STAGES.length - 1)

  return (
    <motion.div
      ref={ref}
      className="glass-card relative mt-6 overflow-hidden"
      style={{ padding: 'clamp(24px, 3.5vw, 38px)' }}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      {/* Kopfzeile */}
      <div className="relative z-[3] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className="inline-flex h-10 w-10 items-center justify-center"
            style={{
              background: 'rgba(220, 128, 68, 0.10)',
              border: '1px solid rgba(220, 128, 68, 0.22)',
              borderRadius: 'var(--r-sm)',
              color: 'var(--brand)',
            }}
          >
            <ShieldCheck size={17} strokeWidth={1.5} />
          </span>
          <div>
            <p
              className="font-display font-semibold"
              style={{ fontSize: '16px', color: 'var(--fg-default)' }}
            >
              Zero-Trust-Login, live
            </p>
            <p
              className="font-body"
              style={{ fontSize: '12.5px', color: 'var(--fg-muted)' }}
            >
              So läuft eine Anmeldung mit Entra ID oder Google Identity ab.
            </p>
          </div>
        </div>
        <span
          className="font-mono uppercase"
          style={{
            fontSize: '9px',
            letterSpacing: '0.18em',
            color: 'var(--fg-subtle)',
          }}
        >
          Identity · Passwortlos
        </span>
      </div>

      {/* Stufen-Reihe — minmax(0,1fr) hält die 5 Stufen immer im Viewport
          (kein horizontaler Overflow), Labels brechen bei < 420px um. */}
      <ol
        className="relative z-[3] mt-8 grid gap-1.5 sm:gap-3"
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          gridTemplateColumns: `repeat(${FLOW_STAGES.length}, minmax(0, 1fr))`,
        }}
      >
        {/* Connector-Schiene hinter den Punkten */}
        <li
          aria-hidden
          className="pointer-events-none absolute"
          style={{
            top: '22px',
            left: `calc(100% / ${FLOW_STAGES.length} / 2)`,
            right: `calc(100% / ${FLOW_STAGES.length} / 2)`,
            height: '2px',
            background: 'var(--border-subtle, rgba(255,255,255,0.10))',
            borderRadius: '2px',
          }}
        >
          <motion.span
            className="absolute inset-y-0 left-0"
            style={{
              display: 'block',
              borderRadius: '2px',
              background: 'linear-gradient(90deg, var(--brand), var(--accent))',
            }}
            initial={false}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: reduce ? 0 : STAGE_MS / 1000, ease: 'linear' }}
          />
        </li>

        {FLOW_STAGES.map((stage, i) => {
          const isActive = i === active
          const isDone = i < active || appsOn
          return (
            <li key={stage.label} className="flex flex-col items-center text-center">
              {/* Punkt mit Icon */}
              <motion.span
                className="relative inline-flex items-center justify-center"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '999px',
                  background: isActive
                    ? 'rgba(220, 128, 68, 0.16)'
                    : isDone
                      ? 'rgba(220, 128, 68, 0.10)'
                      : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${
                    isActive
                      ? 'var(--brand)'
                      : isDone
                        ? 'rgba(220, 128, 68, 0.35)'
                        : 'rgba(255,255,255,0.10)'
                  }`,
                  color: isActive || isDone ? 'var(--brand)' : 'var(--fg-subtle)',
                  boxShadow: isActive
                    ? '0 0 0 4px rgba(220,128,68,0.12), 0 0 22px rgba(220,128,68,0.35)'
                    : 'none',
                }}
                animate={
                  reduce || !isActive
                    ? { scale: 1 }
                    : { scale: [1, 1.08, 1] }
                }
                transition={{
                  duration: STAGE_MS / 1000,
                  repeat: isActive ? Infinity : 0,
                  ease: 'easeInOut',
                }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isDone ? (
                    <motion.span
                      key="check"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="inline-flex"
                    >
                      <Check size={19} strokeWidth={2.4} />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="icon"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="inline-flex"
                    >
                      <stage.Icon size={18} strokeWidth={1.6} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.span>

              {/* Label */}
              <span
                className="mt-3 font-body font-medium"
                style={{
                  fontSize: '12px',
                  lineHeight: 1.3,
                  color:
                    isActive || isDone ? 'var(--fg-default)' : 'var(--fg-subtle)',
                }}
              >
                {stage.label}
              </span>
              <span
                className="mt-1 font-body"
                style={{
                  fontSize: '10.5px',
                  lineHeight: 1.35,
                  color: 'var(--fg-subtle)',
                  minHeight: '28px',
                }}
              >
                {stage.note}
              </span>

              {/* Conditional-Access-Checks (nur bei aktiver Prüf-Stufe) */}
              {'checks' in stage && stage.checks && (
                <div
                  className="mt-1 flex flex-col items-center gap-0.5"
                  style={{ minHeight: '8px' }}
                >
                  <AnimatePresence>
                    {(isActive || isDone) &&
                      stage.checks.map((c, ci) => (
                        <motion.span
                          key={c}
                          className="flex items-center gap-1 font-mono"
                          style={{ fontSize: '9px', color: 'var(--accent)' }}
                          initial={{ opacity: 0, x: -4 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{
                            delay: reduce ? 0 : ci * 0.18,
                            duration: 0.25,
                          }}
                        >
                          <Check size={9} strokeWidth={3} />
                          {c}
                        </motion.span>
                      ))}
                  </AnimatePresence>
                </div>
              )}
            </li>
          )
        })}
      </ol>

      {/* App-Kacheln (SSO-Ergebnis) */}
      <div className="relative z-[3] mt-9">
        <div
          className="flex items-center gap-2 font-mono uppercase"
          style={{
            fontSize: '9px',
            letterSpacing: '0.18em',
            color: ssoReached ? 'var(--brand)' : 'var(--fg-subtle)',
            marginBottom: '12px',
            transition: 'color 0.3s',
          }}
        >
          <ArrowRight size={11} strokeWidth={2} />
          SSO öffnet alle Apps — ohne erneutes Passwort
        </div>
        <ul
          className="grid gap-2.5"
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            gridTemplateColumns: `repeat(${FLOW_APPS.length}, minmax(0, 1fr))`,
          }}
        >
          {FLOW_APPS.map((app, i) => (
            <motion.li
              key={app.label}
              className="flex flex-col items-center justify-center gap-1.5"
              style={{
                padding: '12px 6px',
                borderRadius: 'var(--r-sm)',
                border: `1px solid ${
                  appsOn ? 'rgba(220, 128, 68, 0.30)' : 'rgba(255,255,255,0.08)'
                }`,
                background: appsOn
                  ? 'rgba(220, 128, 68, 0.08)'
                  : 'rgba(255,255,255,0.02)',
                color: appsOn ? 'var(--brand)' : 'var(--fg-subtle)',
              }}
              animate={{
                opacity: appsOn ? 1 : 0.55,
                scale: appsOn ? 1 : 0.97,
                boxShadow: appsOn
                  ? '0 0 18px rgba(220,128,68,0.22)'
                  : '0 0 0 rgba(0,0,0,0)',
              }}
              transition={{
                duration: 0.35,
                delay: reduce ? 0 : (appsOn ? i * 0.07 : 0),
                ease: EASE,
              }}
            >
              <app.Icon size={18} strokeWidth={1.5} />
              <span
                className="font-body"
                style={{
                  fontSize: '10.5px',
                  color: appsOn ? 'var(--fg-default)' : 'var(--fg-subtle)',
                }}
              >
                {app.label}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}

/* ── 02 · Vorher / Nachher (Listen-Slider statt Bild) ─────────────── */

function Section2BeforeAfter() {
  return (
    <section
      aria-label="Vorher Nachher"
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
        style={{ maxWidth: '820px', marginBottom: '48px' }}
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
          02 · Vorher / Nachher
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
          Vom Server-Keller in die <ItalicAccent>Klarheit</ItalicAccent>.
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
        {/* Vorher */}
        <motion.article
          className="relative overflow-hidden"
          style={{
            padding: '32px 30px',
            background:
              'linear-gradient(140deg, rgba(60, 58, 54, 0.6) 0%, rgba(40, 38, 35, 0.4) 100%)',
            border: '1px solid rgba(146, 48, 30, 0.30)',
            borderRadius: 'var(--r-md)',
          }}
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.55, ease: EASE }}
        >
          <div className="flex items-center gap-3">
            <span
              className="inline-flex h-9 w-9 items-center justify-center"
              style={{
                background: 'rgba(146, 48, 30, 0.15)',
                border: '1px solid rgba(146, 48, 30, 0.35)',
                borderRadius: 'var(--r-sm)',
                color: '#92301E',
              }}
            >
              <Server size={16} strokeWidth={1.6} />
            </span>
            <div>
              <p
                className="font-mono uppercase"
                style={{
                  fontSize: '10px',
                  letterSpacing: '0.20em',
                  color: '#92301E',
                }}
              >
                Vorher
              </p>
              <h3
                className="font-display font-semibold"
                style={{ fontSize: '22px', color: 'var(--fg-default)' }}
              >
                {VORHER_NACHHER.before.title}
              </h3>
            </div>
          </div>
          <ul className="mt-6" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {VORHER_NACHHER.before.items.map(item => (
              <li
                key={item.text}
                className="flex items-start gap-3 border-b py-3 last:border-b-0"
                style={{ borderColor: 'var(--border-subtle)' }}
              >
                <X size={14} strokeWidth={2} style={{ color: '#92301E', flexShrink: 0, marginTop: 2 }} />
                <span
                  className="font-body"
                  style={{
                    fontSize: '14px',
                    lineHeight: 1.5,
                    color: 'var(--fg-muted)',
                  }}
                >
                  {item.text}
                </span>
              </li>
            ))}
          </ul>
        </motion.article>

        {/* Nachher */}
        <motion.article
          className="glass-card relative overflow-hidden"
          style={{
            padding: '32px 30px',
            border: '1px solid rgba(40, 200, 64, 0.30)',
          }}
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.55, ease: EASE, delay: 0.08 }}
        >
          <div className="relative z-[3]">
            <div className="flex items-center gap-3">
              <span
                className="inline-flex h-9 w-9 items-center justify-center"
                style={{
                  background: 'rgba(40, 200, 64, 0.10)',
                  border: '1px solid rgba(40, 200, 64, 0.35)',
                  borderRadius: 'var(--r-sm)',
                  color: '#28C840',
                }}
              >
                <Cloud size={16} strokeWidth={1.6} />
              </span>
              <div>
                <p
                  className="font-mono uppercase"
                  style={{
                    fontSize: '10px',
                    letterSpacing: '0.20em',
                    color: '#28C840',
                  }}
                >
                  Nachher
                </p>
                <h3
                  className="font-display font-semibold"
                  style={{ fontSize: '22px', color: 'var(--fg-default)' }}
                >
                  {VORHER_NACHHER.after.title}
                </h3>
              </div>
            </div>
            <ul className="mt-6" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {VORHER_NACHHER.after.items.map(item => (
                <li
                  key={item.text}
                  className="flex items-start gap-3 border-b py-3 last:border-b-0"
                  style={{ borderColor: 'var(--border-subtle)' }}
                >
                  <Check size={14} strokeWidth={2.4} style={{ color: '#28C840', flexShrink: 0, marginTop: 2 }} />
                  <span
                    className="font-body"
                    style={{
                      fontSize: '14px',
                      lineHeight: 1.5,
                      color: 'var(--fg-default)',
                    }}
                  >
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </motion.article>
      </div>
    </section>
  )
}

/* ── 03 · Prozess (Tabs) ──────────────────────────────────────────── */

function Section3Process() {
  const [active, setActive] = useState(0)
  const current = PROCESS[active]

  return (
    <section
      aria-label="Prozess"
      style={{
        maxWidth: 'var(--container-wide)',
        margin: '0 auto',
        padding: 'clamp(80px, 10vw, 128px) 24px',
      }}
    >
      <div style={{ marginBottom: '48px', maxWidth: '820px' }}>
        <p
          className="font-mono uppercase"
          style={{
            fontSize: '11px',
            letterSpacing: '0.20em',
            color: 'var(--brand)',
            marginBottom: '20px',
          }}
        >
          03 · So entsteht es
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
          Audit, Architektur, <ItalicAccent>Migration</ItalicAccent>.
        </h2>
        <p
          className="mt-6 font-body"
          style={{
            fontSize: '17px',
            lineHeight: 1.55,
            color: 'var(--fg-muted)',
          }}
        >
          Vom Status-Check über das Blueprint bis zum Roll-out — sauber
          getaktet, mit Champions pilotiert, ohne produktiven Standstill.
          Welle für Welle, nicht Big-Bang.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[260px_1fr] md:gap-16">
        <ul role="tablist" aria-label="Prozess-Phasen" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {PROCESS.map((p, i) => (
            <li key={p.num}>
              <button
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={`Phase ${p.num}: ${p.title}`}
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                data-cursor="link"
                className="flex w-full items-start gap-4 text-left transition-all duration-300"
                style={{
                  padding: '16px 18px',
                  background: i === active ? 'rgba(220, 128, 68, 0.08)' : 'transparent',
                  borderLeft: i === active
                    ? '2px solid var(--accent)'
                    : '2px solid transparent',
                }}
              >
                <span
                  className="font-mono"
                  style={{
                    fontSize: '11px',
                    letterSpacing: '0.18em',
                    color: i === active ? 'var(--accent)' : 'var(--fg-subtle)',
                    paddingTop: '2px',
                  }}
                >
                  {p.num}
                </span>
                <div className="flex-1">
                  <p
                    className="font-display font-medium"
                    style={{
                      fontSize: '16px',
                      color: i === active ? 'var(--fg-default)' : 'var(--fg-muted)',
                      transition: 'color 220ms',
                    }}
                  >
                    {p.title}
                  </p>
                  <p
                    className="mt-1 font-mono"
                    style={{
                      fontSize: '10px',
                      letterSpacing: '0.14em',
                      color: 'var(--fg-subtle)',
                    }}
                  >
                    {p.duration}
                  </p>
                </div>
              </button>
            </li>
          ))}
        </ul>

        <div className="glass-card relative" style={{ padding: 'clamp(28px, 3vw, 40px)', minHeight: '260px' }}>
          <div className="relative z-[3]">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.num}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                <p
                  className="font-mono uppercase"
                  style={{
                    fontSize: '10px',
                    letterSpacing: '0.20em',
                    color: 'var(--brand)',
                    marginBottom: '14px',
                  }}
                >
                  Phase {current.num} · {current.duration}
                </p>
                <h3
                  className="font-display font-semibold"
                  style={{
                    fontSize: 'clamp(24px, 2.6vw, 32px)',
                    lineHeight: 1.15,
                    letterSpacing: 'var(--tr-heading)',
                    color: 'var(--fg-default)',
                  }}
                >
                  {current.title}
                </h3>
                <p
                  className="mt-5 font-body"
                  style={{
                    fontSize: '16px',
                    lineHeight: 1.6,
                    color: 'var(--fg-muted)',
                  }}
                >
                  <GlossarHighlight text={current.body} />
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── 04 · Blueprints ─────────────────────────────────────────────── */

function Section4Blueprints() {
  return (
    <section
      aria-label="Blueprints"
      style={{
        maxWidth: 'var(--container-wide)',
        margin: '0 auto',
        padding: 'clamp(80px, 10vw, 128px) 24px',
      }}
    >
      <div className="mb-12 max-w-[820px]">
        <p
          className="font-mono uppercase"
          style={{
            fontSize: '11px',
            letterSpacing: '0.20em',
            color: 'var(--brand)',
            marginBottom: '20px',
          }}
        >
          04 · Welcher Blueprint passt?
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
          Drei Größen, drei <ItalicAccent>Setups</ItalicAccent>.
        </h2>
        <p
          className="mt-6 font-body"
          style={{
            fontSize: '17px',
            lineHeight: 1.55,
            color: 'var(--fg-muted)',
          }}
        >
          Welche Lizenz-Stufe, welche Tools, welche Architektur — kommt auf
          Unternehmensgröße, Branche und Compliance-Anforderungen an.
        </p>
      </div>

      <ul
        className="grid grid-cols-1 gap-5 md:grid-cols-3"
        style={{ listStyle: 'none', padding: 0 }}
      >
        {BLUEPRINTS.map((b, i) => (
          <motion.li
            key={b.badge}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.55, delay: i * 0.08, ease: EASE }}
            className="glass-card relative h-full"
            style={{
              padding: '28px 26px',
              minHeight: '360px',
              border: b.featured
                ? '1px solid rgba(220, 128, 68, 0.40)'
                : undefined,
            }}
          >
            <div className="relative z-[3] flex h-full flex-col">
              <div className="flex items-start justify-between gap-3">
                <span
                  className="inline-flex h-11 w-11 items-center justify-center"
                  style={{
                    background: 'rgba(220, 128, 68, 0.10)',
                    border: '1px solid rgba(220, 128, 68, 0.22)',
                    borderRadius: 'var(--r-sm)',
                    color: 'var(--brand)',
                  }}
                >
                  <b.Icon size={18} strokeWidth={1.5} />
                </span>
                {b.featured && (
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
                    Sweet-Spot
                  </span>
                )}
              </div>
              <p
                className="mt-5 font-mono uppercase"
                style={{
                  fontSize: '10px',
                  letterSpacing: '0.18em',
                  color: 'var(--brand)',
                }}
              >
                {b.badge} · {b.size}
              </p>
              <h3
                className="mt-2 font-display font-semibold"
                style={{
                  fontSize: '22px',
                  lineHeight: 1.2,
                  letterSpacing: 'var(--tr-heading)',
                  color: 'var(--fg-default)',
                }}
              >
                {b.title}
              </h3>
              <p
                className="mt-3 font-body"
                style={{
                  fontSize: '14px',
                  lineHeight: 1.55,
                  color: 'var(--fg-muted)',
                }}
              >
                {b.body}
              </p>
              <ul
                className="mt-auto pt-5"
                style={{ listStyle: 'none', padding: '20px 0 0', margin: 0 }}
              >
                {b.bullets.map(p => (
                  <li
                    key={p}
                    className="flex items-start gap-2 py-1"
                  >
                    <span
                      aria-hidden
                      style={{ color: 'var(--accent)', fontSize: 11, paddingTop: 2 }}
                    >
                      ·
                    </span>
                    <span
                      className="font-mono"
                      style={{
                        fontSize: '11px',
                        color: 'var(--fg-default)',
                        letterSpacing: '0.02em',
                      }}
                    >
                      {p}
                    </span>
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

/* ── 05 · Use-Cases ──────────────────────────────────────────────── */

function Section5UseCases() {
  return (
    <section
      aria-label="Use-Cases"
      style={{
        maxWidth: 'var(--container-wide)',
        margin: '0 auto',
        padding: 'clamp(80px, 10vw, 128px) 24px',
      }}
    >
      <div className="mb-14 max-w-[820px]">
        <p
          className="font-mono uppercase"
          style={{
            fontSize: '11px',
            letterSpacing: '0.20em',
            color: 'var(--brand)',
            marginBottom: '20px',
          }}
        >
          05 · Use-Cases im Alltag
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
          Wo es <ItalicAccent>spürbar</ItalicAccent> wird.
        </h2>
        <p
          className="mt-6 font-body"
          style={{
            fontSize: '17px',
            lineHeight: 1.55,
            color: 'var(--fg-muted)',
          }}
        >
          Theorie ist gut, gelebte Praxis besser. Vier Beispiele, wie sich
          ein moderner Workspace im Alltag anfühlt.
        </p>
      </div>

      <ul
        className="grid grid-cols-1 gap-5 md:grid-cols-2"
        style={{ listStyle: 'none', padding: 0 }}
      >
        {USE_CASES.map((u, i) => (
          <motion.li
            key={u.title}
            className="glass-card relative h-full"
            style={{ padding: '32px 30px', minHeight: '280px' }}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.55, delay: i * 0.08, ease: EASE }}
          >
            <div className="relative z-[3] flex h-full flex-col">
              <div className="flex items-start justify-between gap-4">
                <span
                  className="inline-flex h-11 w-11 items-center justify-center"
                  style={{
                    background: 'rgba(220, 128, 68, 0.10)',
                    border: '1px solid rgba(220, 128, 68, 0.22)',
                    borderRadius: 'var(--r-sm)',
                    color: 'var(--brand)',
                  }}
                >
                  <u.Icon size={18} strokeWidth={1.5} />
                </span>
                <div className="text-right">
                  <p
                    className="font-display font-black tabular-nums"
                    style={{
                      fontSize: 'clamp(28px, 2.8vw, 36px)',
                      lineHeight: 1,
                      color: 'var(--accent)',
                      letterSpacing: 'var(--tr-display)',
                    }}
                  >
                    <MetricValue value={u.metric} />
                  </p>
                  <p
                    className="mt-1 font-mono uppercase"
                    style={{
                      fontSize: '9px',
                      letterSpacing: '0.16em',
                      color: 'var(--fg-subtle)',
                    }}
                  >
                    {u.metricLabel}
                  </p>
                </div>
              </div>
              <p
                className="mt-6 font-mono uppercase"
                style={{
                  fontSize: '10px',
                  letterSpacing: '0.18em',
                  color: 'var(--brand)',
                }}
              >
                {u.eyebrow}
              </p>
              <h3
                className="mt-2 font-display font-semibold"
                style={{
                  fontSize: 'clamp(20px, 2vw, 24px)',
                  lineHeight: 1.2,
                  letterSpacing: 'var(--tr-heading)',
                  color: 'var(--fg-default)',
                }}
              >
                {u.title}
              </h3>
              <p
                className="mt-3 font-body"
                style={{
                  fontSize: '14px',
                  lineHeight: 1.6,
                  color: 'var(--fg-muted)',
                }}
              >
                <GlossarHighlight text={u.body} />
              </p>
            </div>
          </motion.li>
        ))}
      </ul>
    </section>
  )
}

/* ── 06 · Was danach kommt → AI ──────────────────────────────────── */

function Section6Next() {
  return (
    <section
      aria-label="Was danach kommt"
      className="relative overflow-hidden"
      style={{ padding: 'clamp(96px, 12vw, 160px) 24px' }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(50% 60% at 50% 30%, rgba(220, 128, 68, 0.10) 0%, transparent 65%),' +
            'radial-gradient(40% 50% at 80% 80%, rgba(146, 48, 30, 0.08) 0%, transparent 60%)',
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
          style={{ maxWidth: '860px', marginBottom: 'clamp(48px, 6vw, 72px)' }}
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
            06 · Was danach kommt
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
            Foundation steht.<br />
            Jetzt kommt <ItalicAccent>AI</ItalicAccent>.
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
            Ein sauberer Workspace ist nicht das Ziel — er ist die Voraussetzung.
            Erst auf einer ordentlichen Plattform mit Identity, Berechtigungen
            und Datenklassifizierung machen Copilot, Custom-GPTs und
            Automatisierung wirklich Sinn.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-5 md:grid-cols-3"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
        >
          {[
            {
              Icon: Cloud,
              title: 'Foundation',
              body:  'M365 / Workspace, Identity, Geräte, Security — sauber aufgesetzt.',
              tag:   '✓ Done',
              accent: '#28C840',
            },
            {
              Icon: Sparkles,
              title: 'AI-Enablement',
              body:  'Copilot ausrollen, Custom-GPTs für Fachprozesse, RAG auf eigene Daten.',
              tag:   'Empfehlung Next',
              accent: 'var(--brand)',
            },
            {
              Icon: Monitor,
              title: 'Automatisierung',
              body:  'Power Automate, n8n, Workflows die Routine-Arbeit übernehmen.',
              tag:   'wenn relevant',
              accent: 'var(--fg-subtle)',
            },
          ].map(s => (
            <article
              key={s.title}
              className="glass-card relative h-full"
              style={{ padding: '28px 26px' }}
            >
              <div className="relative z-[3]">
                <div className="flex items-start justify-between">
                  <span
                    className="inline-flex h-10 w-10 items-center justify-center"
                    style={{
                      background: 'var(--bg-overlay)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--r-sm)',
                      color: s.accent,
                    }}
                  >
                    <s.Icon size={16} strokeWidth={1.5} />
                  </span>
                  <span
                    className="font-mono uppercase"
                    style={{
                      fontSize: '9px',
                      letterSpacing: '0.18em',
                      color: s.accent,
                      padding: '4px 10px',
                      borderRadius: 'var(--r-pill)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    {s.tag}
                  </span>
                </div>
                <h3
                  className="mt-5 font-display font-semibold"
                  style={{
                    fontSize: '20px',
                    letterSpacing: 'var(--tr-heading)',
                    color: 'var(--fg-default)',
                  }}
                >
                  {s.title}
                </h3>
                <p
                  className="mt-3 font-body"
                  style={{
                    fontSize: '14px',
                    lineHeight: 1.55,
                    color: 'var(--fg-muted)',
                  }}
                >
                  {s.body}
                </p>
              </div>
            </article>
          ))}
        </motion.div>

        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.55, delay: 0.3, ease: EASE }}
        >
          <Link
            href="/leistungen/ai"
            data-cursor="magnetic"
            onClick={() => trackEvent('cta_crosslink_m365_ai')}
            className="inline-flex items-center gap-2 font-body font-semibold transition-transform duration-220 hover:-translate-y-px"
            style={{
              padding: '14px 24px',
              fontSize: '14px',
              background: 'var(--accent)',
              color: 'var(--on-accent)',
              borderRadius: 'var(--r-sm)',
              boxShadow: 'var(--sh-2)',
            }}
          >
            Weiter zu KI &amp; Automatisierung
            <ArrowRight size={16} strokeWidth={1.5} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
