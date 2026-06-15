'use client'

/**
 * Bespoke, animierte Case-Widgets pro Slug — ersetzen das generische
 * SVG-Mockup im Showcase. Pro Case ein passendes Widget.
 *
 * Bausteine:
 *  - FlowWidget          Stufen-Flow mit Lauflicht (+ optionale Gate-Knoten)
 *  - PromptWidget        Prompt → Retrieval → Antwort (Typewriter)
 *  - OrgWidget           Agent/Mensch-Org-Struktur mit Legacy-Anbindung
 *  - LearningWidget      Avatar + Untertitel + Checkliste (LMS)
 *
 * Widgets bestimmen ihre eigene (kompakte) Höhe. Brand-Tokens,
 * reduced-motion-safe.
 */

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import type { LucideIcon } from 'lucide-react'
import {
  FileText, Cloud, Mail, FileSignature, ShieldCheck, Check,
  UserPlus, CheckCheck, KeyRound, RefreshCw,
  Fingerprint, Smartphone, BadgeCheck,
  Code2, GitBranch, Rocket, FlaskConical,
  Sparkles, Library, CornerDownLeft, ScanSearch,
  Bot, UserRound, Database, ListChecks,
  Radar, Server, Monitor, Share2, BellRing,
  GraduationCap, Fish, Gauge, Activity, Zap,
} from 'lucide-react'

const EASE = [0.16, 1, 0.3, 1] as const
const LOOP = 6
const STEP = 1.05

export const CASE_WIDGET_SLUGS = new Set([
  'm365-zero-trust-identity',
  'outline-knowledge-base',
  'power-platform-coe',
])

export function CaseWidget({ slug }: { slug: string }) {
  switch (slug) {
    case 'e-signature-workflow':
      return <FlowWidget stages={[
        { Icon: FileText,      label: 'Trigger',      sub: 'Dokument' },
        { Icon: Cloud,         label: 'E-Signature',  sub: 'Plattform' },
        { Icon: Mail,          label: 'Versand',      sub: 'an Beteiligte' },
        { Icon: FileSignature, label: 'Unterschrift', sub: 'Beteiligte', draw: 'signature' },
        { Icon: ShieldCheck,   label: 'Audit-Trail',  sub: 'rechtsgültig' },
      ]} />
    case 'self-service-iam':
      return <FlowWidget stages={[
        { Icon: UserPlus,    label: 'Antrag',        sub: 'Self-Service' },
        { Icon: CheckCheck,  label: 'Approval',      sub: 'Workflow' },
        { Icon: KeyRound,    label: 'Provisioniert', sub: 'automatisch' },
        { Icon: RefreshCw,   label: 'Re-Cert',       sub: 'turnusmäßig' },
        { Icon: ShieldCheck, label: 'Audit-Trail',   sub: 'lückenlos' },
      ]} />
    case 'm365-zero-trust-identity':
      return <FlowWidget stages={[
        { Icon: Fingerprint, label: 'Identity',     sub: 'Single ID' },
        { Icon: ShieldCheck, label: 'Cond. Access', sub: 'Policy' },
        { Icon: Smartphone,  label: 'MFA',          sub: 'Verifikation' },
        { Icon: BadgeCheck,  label: 'Zugriff',      sub: 'gewährt' },
      ]} />
    case 'azure-landing-zone':
      return <FlowWidget stages={[
        { Icon: Code2,       label: 'IaC',      sub: 'Bicep · Terraform' },
        { Icon: GitBranch,   label: 'Pipeline', sub: 'GitOps' },
        { Icon: ShieldCheck, label: 'Policy',   sub: 'Guardrails' },
        { Icon: Rocket,      label: 'Deploy',   sub: 'Landing Zone' },
        { Icon: Cloud,       label: 'Azure',    sub: 'L400' },
      ]} />
    case 'power-platform-coe':
      return <FlowWidget stages={[
        { Icon: Code2,       label: 'DEV',      sub: 'Sandbox' },
        { Icon: ShieldCheck, label: 'Approval', sub: 'Genehmigung', kind: 'gate' },
        { Icon: FlaskConical,label: 'TEST',     sub: 'QA' },
        { Icon: ShieldCheck, label: 'Approval', sub: 'Genehmigung', kind: 'gate' },
        { Icon: Rocket,      label: 'PROD',     sub: 'Live' },
      ]} />
    case 'outline-knowledge-base':
      return <PromptWidget
        askLabel="Frage an die Wissensbasis"
        q="Wie läuft das Onboarding für neue Mitarbeiter?"
        a="Schritt für Schritt — direkt aus dem internen Handbuch, mit Quellen."
        MidIcon={Library}
        midLabel="interne Doku"
        sources={['Handbuch.md', 'HR-Wiki']}
      />
    case 'ki-patent-analytik':
      return <PromptWidget
        askLabel="Frage an den Patent-Pool"
        q="Wo gibt es Whitespace im Wettbewerbsumfeld?"
        a="Drei Cluster ohne Schutzrechte — priorisiert im Innovations-Report."
        MidIcon={ScanSearch}
        midLabel="Patent-Pool"
        sources={['EP-Familien', 'Wettbewerb']}
      />
    case 'custom-copilot-agents-vier-domaenen':
      return <OrgWidget />
    case 'ai-elearning-avatare':
      return <LearningWidget />
    case 'iso27001-matrix-foundation':
      return <IsoMapWidget />
    case 'managed-soc-detection':
      return <SocWidget />
    case 'security-awareness-phishing':
      return <AwarenessWidget />
    case 'cyber-risk-bcm':
      return <BcmWidget />
    default:
      return null
  }
}

/* ── Generischer Stufen-Flow (+ Gate-Knoten) ─────────────────────────── */

interface Stage {
  Icon:   LucideIcon
  label:  string
  sub:    string
  draw?:  'signature'
  kind?:  'gate'
}

function FlowWidget({ stages }: { stages: Stage[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: false, margin: '-10%' })
  const reduce = useReducedMotion()
  const run = inView && !reduce

  return (
    <div ref={ref} className="relative flex w-full items-center justify-center" style={{ padding: 'clamp(26px, 4vw, 44px) 5%' }}>
      <div className="flex w-full items-start justify-between" style={{ maxWidth: 880 }}>
        {stages.map((s, i) => {
          const t = 0.3 + i * STEP
          const gate = s.kind === 'gate'
          const size = gate ? 38 : 52
          return (
            <div key={`${s.label}-${i}`} className="flex flex-1 items-start last:flex-none">
              <motion.div
                className="relative flex flex-col items-center gap-2"
                style={{ minWidth: 56 }}
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.12, ease: EASE }}
              >
                <motion.div
                  className="relative flex items-center justify-center"
                  style={{
                    width: size, height: size,
                    marginTop: gate ? 7 : 0,
                    borderRadius: gate ? 999 : 'var(--r-md)',
                    background: 'linear-gradient(145deg, rgba(28,27,24,0.95), rgba(15,14,12,0.95))',
                    border: `1px solid ${gate ? 'rgba(220,128,68,0.4)' : 'var(--border-default)'}`,
                    boxShadow: '0 10px 24px rgba(0,0,0,0.45)',
                  }}
                  animate={run ? {
                    borderColor: ['var(--border-default)', 'rgba(220,128,68,0.6)', 'var(--border-default)'],
                    boxShadow: [
                      '0 10px 24px rgba(0,0,0,0.45)',
                      '0 0 28px rgba(220,128,68,0.45), 0 10px 24px rgba(0,0,0,0.45)',
                      '0 10px 24px rgba(0,0,0,0.45)',
                    ],
                  } : undefined}
                  transition={{ duration: 0.9, delay: t, repeat: Infinity, repeatDelay: LOOP - 0.9, ease: 'easeInOut' }}
                >
                  {s.draw === 'signature' ? (
                    <svg viewBox="0 0 52 52" className="absolute inset-0 h-full w-full">
                      <line x1="13" y1="38" x2="39" y2="38" stroke="rgba(245,245,250,0.18)" strokeWidth="1.5" />
                      <motion.path
                        d="M14 34 C 18 22, 21 22, 23 32 C 24 37, 26 38, 28 30 C 30 24, 33 25, 35 31 C 36 34, 38 33, 40 29"
                        fill="none"
                        stroke="var(--brand)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        style={{ filter: 'drop-shadow(0 0 4px rgba(220,128,68,0.6))' }}
                        initial={{ pathLength: reduce ? 1 : 0 }}
                        animate={run ? { pathLength: [0, 0, 1, 1, 0] } : { pathLength: 1 }}
                        transition={run ? {
                          duration: LOOP,
                          times: [0, t / LOOP, (t + 0.7) / LOOP, 0.93, 1],
                          repeat: Infinity, ease: 'easeInOut',
                        } : undefined}
                      />
                    </svg>
                  ) : (
                    <s.Icon size={gate ? 17 : 22} strokeWidth={1.6} style={{ color: 'var(--brand)' }} />
                  )}

                  <motion.span
                    className="absolute flex items-center justify-center"
                    style={{
                      right: -6, top: -6,
                      width: 18, height: 18,
                      borderRadius: 999,
                      background: 'var(--accent)',
                      border: '1.5px solid var(--bg-base)',
                      boxShadow: '0 0 10px rgba(200,98,42,0.6)',
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={run ? { scale: [0, 1, 1, 0], opacity: [0, 1, 1, 0] } : undefined}
                    transition={{ duration: LOOP, times: [0, (t + 0.5) / LOOP, 0.94, 1], repeat: Infinity, ease: 'easeOut' }}
                  >
                    <Check size={11} strokeWidth={3} style={{ color: '#0F0E0C' }} />
                  </motion.span>
                </motion.div>

                <span className="font-mono uppercase text-center" style={{ fontSize: 9, letterSpacing: '0.14em', color: gate ? 'var(--brand)' : 'var(--fg-default)' }}>
                  {s.label}
                </span>
                <span className="font-mono text-center" style={{ fontSize: 8, letterSpacing: '0.06em', color: 'var(--fg-subtle)' }}>
                  {s.sub}
                </span>
              </motion.div>

              {i < stages.length - 1 && (
                <div className="relative" style={{ flex: 1, height: 2, marginTop: 25, minWidth: 14 }}>
                  <div className="absolute inset-0" style={{ background: 'rgba(220,128,68,0.14)' }} />
                  {run && (
                    <motion.span
                      aria-hidden
                      className="absolute top-1/2"
                      style={{
                        width: 16, height: 4,
                        borderRadius: 999,
                        background: 'linear-gradient(90deg, transparent, var(--brand), transparent)',
                        boxShadow: '0 0 10px rgba(220,128,68,0.85)',
                        transform: 'translateY(-50%)',
                      }}
                      initial={{ left: '-10%', opacity: 0 }}
                      animate={{ left: ['-10%', '100%'], opacity: [0, 1, 1, 0] }}
                      transition={{ duration: 0.9, delay: t + 0.45, repeat: Infinity, repeatDelay: LOOP - 0.9, ease: 'easeInOut' }}
                    />
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── Prompt → Retrieval → Antwort (Wissensbasis, Patent-Pool …) ───────── */

type KbPhase = 'ask' | 'scan' | 'answer' | 'hold'

function PromptWidget({
  askLabel, q, a, MidIcon, midLabel, sources,
}: {
  askLabel: string
  q: string
  a: string
  MidIcon: LucideIcon
  midLabel: string
  sources: string[]
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: false, margin: '-10%' })
  const reduce = useReducedMotion()
  const run = inView && !reduce

  const [qn, setQn] = useState(reduce ? q.length : 0)
  const [an, setAn] = useState(reduce ? a.length : 0)
  const [phase, setPhase] = useState<KbPhase>(reduce ? 'hold' : 'ask')

  useEffect(() => {
    if (!run) return
    let cancelled = false
    const timers: ReturnType<typeof setTimeout>[] = []
    const wait = (ms: number, fn: () => void) => { timers.push(setTimeout(fn, ms)) }

    const type = (text: string, set: (n: number) => void, done?: () => void) => {
      let i = 0
      const tick = () => {
        if (cancelled) return
        i++
        set(i)
        if (i < text.length) timers.push(setTimeout(tick, 42))
        else if (done) wait(500, done)
      }
      wait(280, tick)
    }

    const cycle = () => {
      if (cancelled) return
      setQn(0); setAn(0); setPhase('ask')
      type(q, setQn, () => {
        setPhase('scan')
        wait(1200, () => {
          setPhase('answer')
          type(a, setAn, () => {
            setPhase('hold')
            wait(2400, cycle)
          })
        })
      })
    }
    cycle()
    return () => { cancelled = true; timers.forEach(clearTimeout) }
  }, [run, q, a])

  const scanning = phase === 'scan'
  const returning = phase === 'answer' || phase === 'hold'

  return (
    <div ref={ref} className="relative flex w-full items-center justify-center" style={{ padding: 'clamp(24px, 4vw, 40px) 5%' }}>
      <div className="flex w-full items-stretch justify-between gap-3" style={{ maxWidth: 820 }}>

        <div className="relative flex-1" style={consoleStyle}>
          <div className="mb-2 flex items-center gap-1.5">
            <Sparkles size={11} strokeWidth={1.7} style={{ color: 'var(--brand)' }} />
            <span className="font-mono uppercase" style={labelStyle}>{askLabel}</span>
          </div>
          <p className="font-body" style={{ fontSize: 11, lineHeight: 1.5, color: 'var(--fg-default)', minHeight: 32 }}>
            {q.slice(0, qn)}
            {run && phase === 'ask' && <Caret />}
          </p>
        </div>

        <div className="relative flex shrink-0 flex-col items-center justify-center gap-2" style={{ width: 76 }}>
          <Beam active={scanning} />
          <motion.div
            className="relative flex items-center justify-center"
            style={{
              width: 50, height: 50,
              borderRadius: 'var(--r-md)',
              background: 'linear-gradient(145deg, rgba(28,27,24,0.95), rgba(15,14,12,0.95))',
              border: '1px solid var(--border-default)',
              boxShadow: '0 10px 24px rgba(0,0,0,0.45)',
            }}
            animate={run && scanning ? {
              borderColor: ['var(--border-default)', 'rgba(220,128,68,0.65)', 'var(--border-default)'],
              boxShadow: ['0 10px 24px rgba(0,0,0,0.45)', '0 0 26px rgba(220,128,68,0.5)', '0 10px 24px rgba(0,0,0,0.45)'],
            } : undefined}
            transition={{ duration: 1.2, repeat: scanning ? Infinity : 0, ease: 'easeInOut' }}
          >
            <MidIcon size={22} strokeWidth={1.6} style={{ color: 'var(--brand)' }} />
            {run && scanning && (
              <motion.span
                aria-hidden
                className="pointer-events-none absolute left-1 right-1"
                style={{ height: 2, background: 'var(--brand)', boxShadow: '0 0 8px rgba(220,128,68,0.9)', borderRadius: 2 }}
                initial={{ top: 6 }}
                animate={{ top: [6, 42, 6] }}
                transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
          </motion.div>
          <span className="font-mono uppercase" style={{ fontSize: 8, letterSpacing: '0.12em', color: 'var(--fg-subtle)' }}>{midLabel}</span>
          <Beam active={returning} />
        </div>

        <div className="relative flex-1" style={{ ...consoleStyle, border: `1px solid ${returning ? 'rgba(220,128,68,0.4)' : 'var(--border-default)'}` }}>
          <div className="mb-2 flex items-center gap-1.5">
            <CornerDownLeft size={11} strokeWidth={1.7} style={{ color: 'var(--brand)' }} />
            <span className="font-mono uppercase" style={labelStyle}>Antwort</span>
          </div>
          <p className="font-body" style={{ fontSize: 11, lineHeight: 1.5, color: 'var(--fg-default)', minHeight: 32 }}>
            {a.slice(0, an)}
            {run && phase === 'answer' && <Caret />}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5" style={{ opacity: returning ? 1 : 0, transition: 'opacity 0.4s' }}>
            {sources.map(src => (
              <span key={src} className="font-mono" style={{ fontSize: 7.5, letterSpacing: '0.04em', color: 'var(--brand)', padding: '2px 7px', border: '1px solid rgba(220,128,68,0.35)', borderRadius: 999 }}>
                {src}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const consoleStyle: React.CSSProperties = {
  minWidth: 0,
  background: 'linear-gradient(145deg, rgba(28,27,24,0.94), rgba(15,14,12,0.96))',
  border: '1px solid var(--border-default)',
  borderRadius: 'var(--r-md)',
  padding: '12px 14px',
  boxShadow: '0 12px 28px rgba(0,0,0,0.45)',
}
const labelStyle: React.CSSProperties = { fontSize: 8, letterSpacing: '0.16em', color: 'var(--fg-muted)' }

/* ── Agent/Mensch-Org-Struktur mit Legacy-Anbindung ──────────────────── */

const ORG_CHILDREN = [
  { Icon: Bot,       label: 'Agent',  sub: 'Use-Case', legacy: true },
  { Icon: UserRound, label: 'Mensch', sub: 'Enabler' },
  { Icon: Bot,       label: 'Agent',  sub: 'Use-Case' },
  { Icon: UserRound, label: 'Mensch', sub: 'Enabler' },
] as const

function OrgWidget() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: false, margin: '-10%' })
  const reduce = useReducedMotion()
  const run = inView && !reduce

  return (
    <div ref={ref} className="relative flex w-full flex-col items-center" style={{ padding: 'clamp(22px, 3.5vw, 36px) 5%' }}>
      <div className="flex w-full flex-col items-center" style={{ maxWidth: 760 }}>
        {/* Root: Orchestrierung */}
        <OrgNode Icon={Bot} label="Orchestrierung" sub="Agent-Foundation" run={run} delay={0.1} root />

        {/* Bus */}
        <div style={{ width: 2, height: 16, background: 'rgba(220,128,68,0.25)' }} />
        <div className="relative w-full" style={{ height: 2 }}>
          <div className="absolute" style={{ left: '12%', right: '12%', height: 2, background: 'rgba(220,128,68,0.25)' }} />
        </div>

        {/* Kinder: abwechselnd Agent / Mensch */}
        <div className="flex w-full justify-between" style={{ padding: '0 6%' }}>
          {ORG_CHILDREN.map((c, i) => (
            <div key={i} className="flex flex-col items-center">
              <div style={{ width: 2, height: 14, background: 'rgba(220,128,68,0.25)' }} />
              <OrgNode Icon={c.Icon} label={c.label} sub={c.sub} run={run} delay={0.3 + i * 0.18} human={c.label === 'Mensch'} />
              {/* Legacy-Anbindung an einem Agent */}
              {'legacy' in c && c.legacy && (
                <>
                  <div className="relative" style={{ width: 2, height: 14, marginTop: 6, background: 'rgba(220,128,68,0.2)' }}>
                    {run && (
                      <motion.span
                        aria-hidden className="absolute left-1/2"
                        style={{ width: 4, height: 4, borderRadius: 999, background: 'var(--brand)', boxShadow: '0 0 8px rgba(220,128,68,0.9)', transform: 'translateX(-50%)' }}
                        initial={{ top: 0, opacity: 0 }}
                        animate={{ top: [0, 14, 0], opacity: [0, 1, 0] }}
                        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
                      />
                    )}
                  </div>
                  <div className="flex items-center gap-1.5" style={{ padding: '5px 9px', borderRadius: 999, border: '1px solid var(--border-default)', background: 'rgba(15,14,12,0.8)' }}>
                    <Database size={11} strokeWidth={1.7} style={{ color: 'var(--fg-muted)' }} />
                    <span className="font-mono uppercase" style={{ fontSize: 7.5, letterSpacing: '0.12em', color: 'var(--fg-muted)' }}>Legacy · DMS</span>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function OrgNode({ Icon, label, sub, run, delay, root, human }: {
  Icon: LucideIcon; label: string; sub: string; run: boolean; delay: number; root?: boolean; human?: boolean
}) {
  const size = root ? 54 : 46
  return (
    <motion.div
      className="flex flex-col items-center gap-1.5"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.5, delay, ease: EASE }}
    >
      <motion.div
        className="flex items-center justify-center"
        style={{
          width: size, height: size,
          borderRadius: 'var(--r-md)',
          background: human
            ? 'linear-gradient(145deg, rgba(40,40,46,0.9), rgba(20,20,24,0.95))'
            : 'linear-gradient(145deg, rgba(28,27,24,0.95), rgba(15,14,12,0.95))',
          border: `1px solid ${root ? 'rgba(220,128,68,0.55)' : human ? 'var(--border-strong)' : 'var(--border-default)'}`,
          boxShadow: '0 10px 24px rgba(0,0,0,0.45)',
        }}
        animate={run ? {
          boxShadow: [
            '0 10px 24px rgba(0,0,0,0.45)',
            `0 0 24px ${human ? 'rgba(160,170,190,0.3)' : 'rgba(220,128,68,0.45)'}, 0 10px 24px rgba(0,0,0,0.45)`,
            '0 10px 24px rgba(0,0,0,0.45)',
          ],
        } : undefined}
        transition={{ duration: 1, delay, repeat: Infinity, repeatDelay: 2.4, ease: 'easeInOut' }}
      >
        <Icon size={root ? 24 : 20} strokeWidth={1.6} style={{ color: human ? 'var(--fg-muted)' : 'var(--brand)' }} />
      </motion.div>
      <span className="font-mono uppercase" style={{ fontSize: 8.5, letterSpacing: '0.13em', color: 'var(--fg-default)' }}>{label}</span>
      <span className="font-mono" style={{ fontSize: 7.5, letterSpacing: '0.05em', color: 'var(--fg-subtle)' }}>{sub}</span>
    </motion.div>
  )
}

/* ── AI-E-Learning · Avatar + Untertitel + Checkliste (LMS) ──────────── */

const LE_CAPTION = 'Willkommen zum Modul Arbeitssicherheit.'
const LE_LANGS = ['DE', 'EN', 'FR', 'ES', 'IT', 'PL']
const LE_TASKS = ['Intro-Video', 'Quiz', 'Zertifikat']

function LearningWidget() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: false, margin: '-10%' })
  const reduce = useReducedMotion()
  const run = inView && !reduce

  const [cap, setCap] = useState(reduce ? LE_CAPTION.length : 0)
  const [lang, setLang] = useState(0)

  useEffect(() => {
    if (!run) return
    let cancelled = false
    const timers: ReturnType<typeof setTimeout>[] = []
    const type = () => {
      let i = 0
      const tick = () => {
        if (cancelled) return
        i++; setCap(i)
        if (i < LE_CAPTION.length) timers.push(setTimeout(tick, 50))
        else timers.push(setTimeout(() => { setCap(0); timers.push(setTimeout(tick, 400)) }, 2600))
      }
      timers.push(setTimeout(tick, 400))
    }
    type()
    const langTimer = setInterval(() => setLang(l => (l + 1) % LE_LANGS.length), 1500)
    return () => { cancelled = true; timers.forEach(clearTimeout); clearInterval(langTimer) }
  }, [run])

  return (
    <div ref={ref} className="relative flex w-full items-center justify-center" style={{ padding: 'clamp(22px, 3.5vw, 36px) 5%' }}>
      <div className="flex w-full items-stretch justify-center gap-4" style={{ maxWidth: 760 }}>

        {/* Video-Frame mit Avatar */}
        <div
          className="relative overflow-hidden"
          style={{
            flex: '1.3 1 0', minWidth: 0, aspectRatio: '16 / 10',
            borderRadius: 'var(--r-md)',
            background: 'radial-gradient(70% 80% at 50% 30%, rgba(220,128,68,0.14), transparent 70%), linear-gradient(145deg, rgba(28,27,24,0.95), rgba(15,14,12,0.96))',
            border: '1px solid var(--border-default)',
            boxShadow: '0 12px 28px rgba(0,0,0,0.45)',
          }}
        >
          {/* Sprach-Badge */}
          <span className="absolute font-mono uppercase" style={{ top: 8, right: 8, fontSize: 8, letterSpacing: '0.14em', color: 'var(--brand)', padding: '3px 8px', borderRadius: 999, border: '1px solid rgba(220,128,68,0.35)', background: 'rgba(15,14,12,0.7)' }}>
            {LE_LANGS[lang]} · {LE_LANGS.length} Sprachen
          </span>

          {/* Avatar */}
          <div className="absolute inset-x-0 flex justify-center" style={{ top: '24%' }}>
            <div className="relative">
              {run && [0, 0.6].map(d => (
                <motion.span
                  key={d} aria-hidden className="absolute"
                  style={{ inset: -8, borderRadius: 999, border: '1px solid rgba(220,128,68,0.4)' }}
                  animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, delay: d, ease: 'easeOut' }}
                />
              ))}
              <div className="flex items-center justify-center" style={{ width: 46, height: 46, borderRadius: 999, background: 'linear-gradient(145deg, var(--brand), #92301E)', boxShadow: '0 0 22px rgba(220,128,68,0.5)' }}>
                <UserRound size={24} strokeWidth={1.7} style={{ color: 'white' }} />
              </div>
            </div>
          </div>

          {/* Untertitel-Leiste */}
          <div className="absolute inset-x-0" style={{ bottom: 0, padding: '8px 10px', background: 'linear-gradient(0deg, rgba(15,14,12,0.95), transparent)' }}>
            <div style={{ background: 'rgba(15,14,12,0.7)', borderRadius: 4, padding: '4px 8px', minHeight: 22 }}>
              <span className="font-body" style={{ fontSize: 9.5, lineHeight: 1.4, color: 'var(--fg-default)' }}>
                {LE_CAPTION.slice(0, cap)}{run && cap < LE_CAPTION.length && <Caret />}
              </span>
            </div>
          </div>
        </div>

        {/* Checkliste (LMS) */}
        <div className="flex flex-col" style={{ flex: '1 1 0', minWidth: 0, justifyContent: 'center', gap: 8 }}>
          <div className="flex items-center gap-1.5">
            <ListChecks size={12} strokeWidth={1.7} style={{ color: 'var(--brand)' }} />
            <span className="font-mono uppercase" style={{ fontSize: 8, letterSpacing: '0.14em', color: 'var(--fg-muted)' }}>Modul-Fortschritt</span>
          </div>
          {LE_TASKS.map((task, i) => (
            <div key={task} className="flex items-center gap-2.5" style={{ padding: '6px 9px', borderRadius: 'var(--r-sm)', border: '1px solid var(--border-default)', background: 'rgba(28,27,24,0.6)' }}>
              <motion.span
                className="flex items-center justify-center shrink-0"
                style={{ width: 16, height: 16, borderRadius: 4, border: '1px solid rgba(220,128,68,0.4)' }}
                animate={run ? { background: ['transparent', 'var(--accent)', 'var(--accent)'], borderColor: ['rgba(220,128,68,0.4)', 'var(--accent)', 'var(--accent)'] } : undefined}
                transition={{ duration: 4.5, times: [0, (1 + i * 0.8) / 4.5, 1], repeat: Infinity, ease: 'easeOut' }}
              >
                <motion.span
                  initial={{ opacity: reduce ? 1 : 0 }}
                  animate={run ? { opacity: [0, 1, 1] } : undefined}
                  transition={{ duration: 4.5, times: [0, (1 + i * 0.8) / 4.5, 1], repeat: Infinity }}
                >
                  <Check size={11} strokeWidth={3} style={{ color: '#0F0E0C' }} />
                </motion.span>
              </motion.span>
              <span className="font-body" style={{ fontSize: 10, color: 'var(--fg-default)' }}>{task}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── ISO 27001 · Matrix-Zertifizierung über Standorte (Globe + Pins) ──── */

const ISO_PINS = [
  { x: 78,  y: 58,  loc: 'DE' },
  { x: 138, y: 74,  loc: 'PL' },
  { x: 92,  y: 118, loc: 'CN' },
  { x: 150, y: 110, loc: 'US' },
] as const

function IsoMapWidget() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: false, margin: '-10%' })
  const reduce = useReducedMotion()
  const run = inView && !reduce
  const [done, setDone] = useState(reduce ? ISO_PINS.length : 0)

  useEffect(() => {
    if (!run) return
    let cancelled = false
    const timers: ReturnType<typeof setTimeout>[] = []
    const cycle = () => {
      if (cancelled) return
      setDone(0)
      ISO_PINS.forEach((_, i) => timers.push(setTimeout(() => setDone(i + 1), 700 + i * 900)))
      timers.push(setTimeout(cycle, 700 + ISO_PINS.length * 900 + 2200))
    }
    cycle()
    return () => { cancelled = true; timers.forEach(clearTimeout) }
  }, [run])

  return (
    <div ref={ref} className="relative flex w-full items-center justify-center gap-5" style={{ padding: 'clamp(22px, 3.5vw, 38px) 6%' }}>
      <svg viewBox="0 0 220 180" style={{ width: '54%', maxWidth: 280, height: 'auto' }}>
        <defs>
          <radialGradient id="iso-globe" cx="42%" cy="38%" r="70%">
            <stop offset="0%" stopColor="rgba(220,128,68,0.16)" />
            <stop offset="100%" stopColor="rgba(15,14,12,0.6)" />
          </radialGradient>
        </defs>
        <circle cx="110" cy="90" r="72" fill="url(#iso-globe)" stroke="rgba(220,128,68,0.35)" strokeWidth="1" />
        {/* Längen-/Breitengrade */}
        {[18, 40, 62].map(rx => (
          <ellipse key={rx} cx="110" cy="90" rx={rx} ry="72" fill="none" stroke="rgba(245,245,250,0.10)" strokeWidth="0.8" />
        ))}
        {[-40, 0, 40].map(dy => (
          <ellipse key={dy} cx="110" cy={90 + dy} rx="72" ry={dy === 0 ? 24 : 16} fill="none" stroke="rgba(245,245,250,0.10)" strokeWidth="0.8" />
        ))}
        {/* Pins */}
        {ISO_PINS.map((p, i) => {
          const active = i < done
          return (
            <g key={p.loc}>
              {run && active && (
                <motion.circle
                  cx={p.x} cy={p.y} r="3" fill="none" stroke="rgba(220,128,68,0.7)" strokeWidth="1"
                  initial={{ r: 3, opacity: 0.7 }} animate={{ r: [3, 12], opacity: [0.7, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
                />
              )}
              <circle cx={p.x} cy={p.y} r="3.5" fill={active ? 'var(--brand)' : 'rgba(245,245,250,0.3)'}
                style={active ? { filter: 'drop-shadow(0 0 4px rgba(220,128,68,0.8))' } : undefined} />
              {active && (
                <g transform={`translate(${p.x + 4}, ${p.y - 11})`}>
                  <circle cx="5" cy="5" r="6" fill="var(--accent)" />
                  <path d="M2.5 5 L4.3 6.8 L7.5 3.2" fill="none" stroke="#0F0E0C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </g>
              )}
            </g>
          )
        })}
      </svg>

      <div className="flex flex-col gap-2" style={{ minWidth: 0 }}>
        <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: '0.16em', color: 'var(--brand)' }}>ISO 27001 · Matrix</span>
        <span className="font-display font-bold" style={{ fontSize: 'clamp(22px, 3vw, 32px)', lineHeight: 1, color: 'var(--fg-default)' }}>
          {done}/{ISO_PINS.length}
        </span>
        <span className="font-mono uppercase" style={{ fontSize: 8.5, letterSpacing: '0.12em', color: 'var(--fg-muted)' }}>Standorte zertifiziert</span>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {ISO_PINS.map((p, i) => (
            <span key={p.loc} className="font-mono uppercase" style={{
              fontSize: 8, letterSpacing: '0.1em', padding: '2px 7px', borderRadius: 999,
              border: `1px solid ${i < done ? 'rgba(220,128,68,0.5)' : 'var(--border-default)'}`,
              color: i < done ? 'var(--brand)' : 'var(--fg-subtle)',
              transition: 'all 0.4s',
            }}>{p.loc}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Managed SOC · Quellen → zentrale Prüfung → Eskalation an Mensch ──── */

const SOC_SOURCES = [
  { Icon: Cloud,      x: 48,  y: 50 },
  { Icon: Server,     x: 34,  y: 100 },
  { Icon: Monitor,    x: 52,  y: 150 },
  { Icon: Share2,     x: 332, y: 50 },
  { Icon: Mail,       x: 346, y: 100 },
  { Icon: Smartphone, x: 328, y: 150 },
] as const
const SOC_HUB = { x: 190, y: 92 }
const SOC_ANALYST = { x: 190, y: 178 }

function SocWidget() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: false, margin: '-10%' })
  const reduce = useReducedMotion()
  const run = inView && !reduce
  const [alert, setAlert] = useState(false)

  useEffect(() => {
    if (!run) return
    let cancelled = false
    const timers: ReturnType<typeof setTimeout>[] = []
    const cycle = () => {
      if (cancelled) return
      setAlert(false)
      timers.push(setTimeout(() => { setAlert(true); timers.push(setTimeout(cycle, 1800)) }, 3600))
    }
    cycle()
    return () => { cancelled = true; timers.forEach(clearTimeout) }
  }, [run])

  return (
    <div ref={ref} className="relative flex w-full items-center justify-center" style={{ padding: 'clamp(20px, 3vw, 32px) 4%' }}>
      <svg viewBox="0 0 380 210" style={{ width: '100%', maxWidth: 560, height: 'auto' }}>
        {/* Feeds Quelle → Hub */}
        {SOC_SOURCES.map((s, i) => (
          <g key={i}>
            <line x1={s.x} y1={s.y} x2={SOC_HUB.x} y2={SOC_HUB.y} stroke="rgba(220,128,68,0.16)" strokeWidth="1" strokeDasharray="2 3" />
            {run && (
              <motion.circle r="2.4" fill="rgba(220,128,68,0.95)"
                initial={{ opacity: 0 }}
                animate={{ cx: [s.x, SOC_HUB.x], cy: [s.y, SOC_HUB.y], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.32, ease: 'easeIn' }} />
            )}
          </g>
        ))}

        {/* Eskalation Hub → Analyst (nur bei Alert) */}
        <line x1={SOC_HUB.x} y1={SOC_HUB.y + 26} x2={SOC_ANALYST.x} y2={SOC_ANALYST.y - 14}
          stroke={alert ? 'rgba(220,128,68,0.7)' : 'rgba(245,245,250,0.08)'} strokeWidth="1.5" strokeDasharray="3 3" />
        {run && alert && (
          <motion.circle r="3" fill="var(--accent)"
            animate={{ cy: [SOC_HUB.y + 26, SOC_ANALYST.y - 14], opacity: [0, 1, 0] }}
            transition={{ duration: 0.9, repeat: Infinity, ease: 'easeIn' }}
            cx={SOC_HUB.x} />
        )}

        {/* Quellen-Tiles */}
        {SOC_SOURCES.map((s, i) => (
          <foreignObject key={`s${i}`} x={s.x - 15} y={s.y - 15} width="30" height="30">
            <div style={{ width: 30, height: 30, borderRadius: 7, background: 'rgba(15,14,12,0.95)', border: '1px solid rgba(245,245,250,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <s.Icon size={14} strokeWidth={1.6} style={{ color: 'rgba(220,128,68,0.85)' }} />
            </div>
          </foreignObject>
        ))}

        {/* SOC-Hub mit Status */}
        <circle cx={SOC_HUB.x} cy={SOC_HUB.y} r="30" fill="rgba(15,14,12,0.96)"
          stroke={alert ? 'var(--accent)' : 'rgba(220,128,68,0.55)'} strokeWidth="1.5" />
        <foreignObject x={SOC_HUB.x - 22} y={SOC_HUB.y - 24} width="44" height="30">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 30 }}>
            <Radar size={22} strokeWidth={1.6} style={{ color: alert ? 'var(--accent)' : 'var(--brand)' }} />
          </div>
        </foreignObject>
        <foreignObject x={SOC_HUB.x - 30} y={SOC_HUB.y + 6} width="60" height="16">
          <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 7, letterSpacing: '0.1em', color: alert ? 'var(--accent)' : '#6CB082' }}>
            {alert ? '● ALERT' : '● OK'}
          </div>
        </foreignObject>

        {/* Analyst */}
        <foreignObject x={SOC_ANALYST.x - 16} y={SOC_ANALYST.y - 14} width="32" height="32">
          <div style={{ width: 32, height: 32, borderRadius: 999, background: 'rgba(15,14,12,0.95)', border: `1px solid ${alert ? 'var(--accent)' : 'var(--border-strong)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: alert ? '0 0 14px rgba(200,98,42,0.6)' : 'none' }}>
            {alert ? <BellRing size={15} strokeWidth={1.7} style={{ color: 'var(--accent)' }} /> : <UserRound size={15} strokeWidth={1.7} style={{ color: 'var(--fg-muted)' }} />}
          </div>
        </foreignObject>
        <text x={SOC_ANALYST.x} y={SOC_ANALYST.y + 27} textAnchor="middle" fill="rgba(245,245,250,0.6)" fontSize="7" fontFamily="var(--font-mono)" letterSpacing="0.12em">ANALYST · 24/7</text>
      </svg>
    </div>
  )
}

/* ── Security-Awareness · kontinuierlicher Loop (Unendlich-Schleife) ──── */

const LEMNISCATE = 'M170,55 C120,15 40,15 40,55 C40,95 120,95 170,55 C220,15 300,15 300,55 C300,95 220,95 170,55 Z'

function AwarenessWidget() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: false, margin: '-10%' })
  const reduce = useReducedMotion()
  const run = inView && !reduce

  const nodes = [
    { Icon: GraduationCap, label: 'Schulung',  x: 40,  y: 55 },
    { Icon: Fish,          label: 'Phishing-Sim', x: 300, y: 55 },
    { Icon: Gauge,         label: 'Reifegrad', x: 170, y: 55 },
  ]

  return (
    <div ref={ref} className="relative flex w-full flex-col items-center" style={{ padding: 'clamp(20px, 3vw, 34px) 5%' }}>
      <svg viewBox="0 0 340 110" style={{ width: '100%', maxWidth: 480, height: 'auto' }}>
        <path d={LEMNISCATE} fill="none" stroke="rgba(220,128,68,0.22)" strokeWidth="2" />
        {run && (
          <circle r="4" fill="var(--brand)" style={{ filter: 'drop-shadow(0 0 5px rgba(220,128,68,0.9))' }}>
            <animateMotion dur="5s" repeatCount="indefinite" path={LEMNISCATE} />
          </circle>
        )}
        {nodes.map((n, i) => (
          <g key={n.label}>
            <motion.circle
              cx={n.x} cy={n.y} r="16" fill="rgba(15,14,12,0.96)" stroke="rgba(220,128,68,0.5)" strokeWidth="1.2"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={inView ? { opacity: 1, scale: 1 } : undefined}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.12, ease: EASE }}
              style={{ transformOrigin: `${n.x}px ${n.y}px` }}
            />
            <foreignObject x={n.x - 11} y={n.y - 11} width="22" height="22">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 22 }}>
                <n.Icon size={14} strokeWidth={1.7} style={{ color: 'var(--brand)' }} />
              </div>
            </foreignObject>
            <text x={n.x} y={n.y + 30} textAnchor="middle" fill="rgba(245,245,250,0.75)" fontSize="7.5" fontFamily="var(--font-mono)" letterSpacing="0.1em">{n.label.toUpperCase()}</text>
          </g>
        ))}
      </svg>
      <span className="mt-1 font-mono uppercase" style={{ fontSize: 8.5, letterSpacing: '0.18em', color: 'var(--fg-subtle)' }}>kontinuierliches Programm · ∞</span>
    </div>
  )
}

/* ── BCM · Resilienz-Kurve (Incident → Wiederanlauf) ─────────────────── */

const BCM_PATH = 'M20,46 L120,46 C140,46 150,118 178,118 C206,118 214,46 250,46 L340,46'

function BcmWidget() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: false, margin: '-10%' })
  const reduce = useReducedMotion()
  const run = inView && !reduce

  return (
    <div ref={ref} className="relative flex w-full flex-col items-center" style={{ padding: 'clamp(20px, 3vw, 34px) 5%' }}>
      <svg viewBox="0 0 360 150" style={{ width: '100%', maxWidth: 520, height: 'auto' }}>
        {/* Normalniveau (Ziel) */}
        <line x1="20" y1="46" x2="340" y2="46" stroke="rgba(245,245,250,0.12)" strokeWidth="1" strokeDasharray="3 4" />
        <text x="20" y="38" fill="rgba(245,245,250,0.4)" fontSize="7" fontFamily="var(--font-mono)" letterSpacing="0.1em">NORMALBETRIEB · RTO</text>

        {/* Resilienz-Kurve */}
        <motion.path
          d={BCM_PATH} fill="none" stroke="var(--brand)" strokeWidth="2.5" strokeLinecap="round"
          style={{ filter: 'drop-shadow(0 0 5px rgba(220,128,68,0.5))' }}
          initial={{ pathLength: reduce ? 1 : 0 }}
          animate={run ? { pathLength: [0, 1, 1, 0] } : { pathLength: 1 }}
          transition={run ? { duration: 5, times: [0, 0.55, 0.85, 1], repeat: Infinity, ease: 'easeInOut' } : undefined}
        />

        {/* Incident-Marker (Tiefpunkt) */}
        <motion.g
          initial={{ opacity: reduce ? 1 : 0 }}
          animate={run ? { opacity: [0, 0, 1, 1, 0] } : undefined}
          transition={run ? { duration: 5, times: [0, 0.3, 0.42, 0.85, 1], repeat: Infinity } : undefined}
        >
          <circle cx="178" cy="118" r="9" fill="rgba(200,98,42,0.18)" stroke="var(--accent)" strokeWidth="1.2" />
          <foreignObject x="170" y="110" width="16" height="16">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 16 }}>
              <Zap size={10} strokeWidth={2} style={{ color: 'var(--accent)' }} />
            </div>
          </foreignObject>
          <text x="178" y="140" textAnchor="middle" fill="var(--accent)" fontSize="7.5" fontFamily="var(--font-mono)" letterSpacing="0.1em">INCIDENT</text>
        </motion.g>

        {/* Wiederanlauf-Marker */}
        <motion.g
          initial={{ opacity: reduce ? 1 : 0 }}
          animate={run ? { opacity: [0, 0, 1, 1, 0] } : undefined}
          transition={run ? { duration: 5, times: [0, 0.78, 0.86, 0.92, 1], repeat: Infinity } : undefined}
        >
          <circle cx="250" cy="46" r="9" fill="rgba(220,128,68,0.18)" stroke="var(--brand)" strokeWidth="1.2" />
          <path d="M246 46 L249 49 L254 43" fill="none" stroke="var(--brand)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <text x="250" y="32" textAnchor="middle" fill="var(--brand)" fontSize="7.5" fontFamily="var(--font-mono)" letterSpacing="0.1em">WIEDERANLAUF</text>
        </motion.g>
      </svg>
      <div className="mt-1 flex items-center gap-2">
        <Activity size={11} strokeWidth={1.7} style={{ color: 'var(--brand)' }} />
        <span className="font-mono uppercase" style={{ fontSize: 8.5, letterSpacing: '0.16em', color: 'var(--fg-subtle)' }}>Business Continuity · Tabletop geprobt</span>
      </div>
    </div>
  )
}

/* ── Helfer ──────────────────────────────────────────────────────────── */

function Caret() {
  return (
    <span
      style={{
        display: 'inline-block', width: 1.5, height: 11,
        background: 'var(--brand)', marginLeft: 1, verticalAlign: 'text-bottom',
        animation: 'kb-caret 0.7s steps(2) infinite',
      }}
    >
      <style jsx global>{`@keyframes kb-caret { 0%,50% { opacity:1 } 50.01%,100% { opacity:0 } }`}</style>
    </span>
  )
}

function Beam({ active }: { active: boolean }) {
  return (
    <div className="relative w-full" style={{ height: 2 }}>
      <div className="absolute inset-0" style={{ background: 'rgba(220,128,68,0.14)' }} />
      {active && (
        <motion.span
          aria-hidden
          className="absolute top-1/2"
          style={{ width: 14, height: 4, borderRadius: 999, background: 'linear-gradient(90deg, transparent, var(--brand), transparent)', boxShadow: '0 0 10px rgba(220,128,68,0.85)', transform: 'translateY(-50%)' }}
          initial={{ left: '-10%', opacity: 0 }}
          animate={{ left: ['-10%', '100%'], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </div>
  )
}
