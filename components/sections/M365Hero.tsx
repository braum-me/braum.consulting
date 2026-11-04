'use client'

import { useEffect, useRef } from 'react'
import { motion, useReducedMotion, useInView } from 'motion/react'
import Link from 'next/link'
import {
  ArrowLeft, Server, Lock, Users, FileText, Mail, Smartphone,
  Globe, ShieldCheck, Mic, Video, Wifi,
} from 'lucide-react'
import ItalicAccent from '@/components/ui/ItalicAccent'
import type { Service } from '@/lib/cms'

const EASE = [0.16, 1, 0.3, 1] as const

/**
 * Cinematic M365-Hero: zentrales Workspace-Cockpit + floating Cloud-Artefakte.
 * - Cockpit (Glass-Card-Mitte) zeigt einheitliches Login + Status-Indikatoren
 * - Drumherum schweben: Teams-Call, SharePoint, Outlook, Intune-Device,
 *   Defender-Badge, World-Map
 * - Floating-Sinus + Bounce-In auf Mount — respektiert prefers-reduced-motion
 */
export default function M365Hero({ s }: { s: Service }) {
  return (
    <section
      aria-label={`Leistung ${s.title}`}
      className="relative w-screen overflow-hidden"
      style={{
        marginLeft: 'calc(-50vw + 50%)',
        background: 'var(--bg-base)',
        paddingTop: '120px',
        paddingBottom: 'clamp(48px, 6vw, 72px)',
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(55% 70% at 75% 30%, rgba(200, 98, 42, 0.18) 0%, transparent 60%),' +
            'radial-gradient(45% 55% at 20% 80%, rgba(100, 60, 200, 0.08) 0%, transparent 60%),' +
            'radial-gradient(40% 50% at 60% 90%, rgba(40, 200, 64, 0.06) 0%, transparent 55%)',
          zIndex: 1,
        }}
      />

      <div className="relative z-[3] mx-auto w-full max-w-[var(--container-wide)] px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <Link
            href="/leistungen"
            data-cursor="link"
            className="inline-flex items-center gap-2 font-mono uppercase transition-colors duration-220 hover:text-[color:var(--brand)]"
            style={{
              fontSize: '11px',
              letterSpacing: '0.18em',
              color: 'var(--fg-muted)',
            }}
          >
            <ArrowLeft size={11} strokeWidth={1.6} />
            Alle Leistungen
          </Link>
        </motion.div>

        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.95fr)] lg:items-start lg:gap-12">
          {/* ── LEFT · Text ── */}
          <div>
            <motion.div
              className="flex flex-wrap items-baseline gap-x-6 gap-y-2"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
            >
              <span
                className="inline-flex items-center gap-2 font-mono uppercase"
                style={{
                  fontSize: '12px',
                  letterSpacing: '0.20em',
                  color: 'var(--brand)',
                  padding: '6px 14px',
                  border: '1px solid rgba(220, 128, 68, 0.30)',
                  borderRadius: 'var(--r-pill)',
                }}
              >
                <Server size={13} strokeWidth={1.5} />
                Leistung {s.num}
              </span>
              <span
                className="font-mono"
                style={{
                  fontSize: '11px',
                  color: 'var(--fg-muted)',
                  letterSpacing: '0.04em',
                }}
              >
                {s.duration}
              </span>
            </motion.div>

            <motion.h1
              className="mt-8 font-display font-bold"
              style={{
                fontSize: 'clamp(34px, 4.6vw, 68px)',
                lineHeight: 1.02,
                letterSpacing: 'var(--tr-display)',
                color: 'var(--fg-default)',
              }}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
            >
              Moderne<br />
              IT &amp; <ItalicAccent>Cloud</ItalicAccent>.
            </motion.h1>

            <motion.p
              className="mt-6 font-body"
              style={{
                fontSize: 'clamp(16px, 1.5vw, 19px)',
                lineHeight: 1.55,
                color: 'var(--fg-muted)',
                maxWidth: '560px',
              }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
            >
              {s.lead}
            </motion.p>

            <motion.div
              className="mt-10 flex flex-wrap items-end gap-x-10 gap-y-6"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.65, ease: EASE }}
            >
              <div>
                <p
                  className="font-mono uppercase"
                  style={{
                    fontSize: '10px',
                    letterSpacing: '0.20em',
                    color: 'var(--fg-muted)',
                    marginBottom: '10px',
                  }}
                >
                  Typisches Ergebnis
                </p>
                <p
                  className="font-display font-black"
                  style={{
                    fontSize: 'clamp(42px, 5.4vw, 84px)',
                    lineHeight: 0.95,
                    letterSpacing: 'var(--tr-display)',
                    color: 'var(--accent)',
                  }}
                >
                  {s.result}
                </p>
                <p
                  className="mt-2 font-mono uppercase"
                  style={{
                    fontSize: '11px',
                    letterSpacing: '0.16em',
                    color: 'var(--fg-default)',
                    opacity: 0.85,
                  }}
                >
                  {s.resultLabel}
                </p>
              </div>

              <dl className="flex flex-wrap gap-x-10 gap-y-5">
                <div>
                  <dt
                    className="font-mono uppercase"
                    style={{ fontSize: '9px', letterSpacing: '0.18em', color: 'var(--fg-subtle)' }}
                  >
                    Dauer
                  </dt>
                  <dd
                    className="mt-2 font-display font-medium"
                    style={{ fontSize: '15px', color: 'var(--fg-default)' }}
                  >
                    {s.duration}
                  </dd>
                </div>
              </dl>
            </motion.div>
          </div>

          {/* ── RIGHT · Workspace-Cockpit + floating Cloud-Artefakte ── */}
          <CockpitStage />
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────── */

function CockpitStage() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      className="relative mx-auto mt-14 w-full lg:mx-0 lg:ml-auto lg:mt-0"
      style={{ maxWidth: '560px', height: 'clamp(460px, 56vw, 600px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {/* Soft glow under cockpit */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(45% 35% at 50% 55%, rgba(200, 98, 42, 0.22) 0%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />

      {/* Zentrales Workspace-Cockpit */}
      <CockpitCard inView={inView} reduceMotion={!!reduceMotion} />

      {/* Floating Cloud-Artefakte */}
      <FloatArtefact
        delay={1.0}
        floatDelay={0}
        reduceMotion={!!reduceMotion}
        style={{ top: '0%', left: '-2%', zIndex: 6 }}
      >
        <TeamsCallCard />
      </FloatArtefact>

      <FloatArtefact
        delay={1.2}
        floatDelay={0.4}
        reduceMotion={!!reduceMotion}
        style={{ top: '-3%', right: '-6%', zIndex: 7 }}
      >
        <SharePointCard />
      </FloatArtefact>

      <FloatArtefact
        delay={1.4}
        floatDelay={0.9}
        reduceMotion={!!reduceMotion}
        style={{ top: '38%', right: '-12%', zIndex: 5 }}
      >
        <IntuneDeviceCard />
      </FloatArtefact>

      <FloatArtefact
        delay={1.6}
        floatDelay={0.2}
        reduceMotion={!!reduceMotion}
        style={{ bottom: '6%', right: '-2%', zIndex: 7 }}
      >
        <DefenderBadge />
      </FloatArtefact>

      <FloatArtefact
        delay={1.8}
        floatDelay={0.7}
        reduceMotion={!!reduceMotion}
        style={{ bottom: '0%', left: '-6%', zIndex: 6 }}
      >
        <GlobeAccessCard />
      </FloatArtefact>

      <FloatArtefact
        delay={2.0}
        floatDelay={1.1}
        reduceMotion={!!reduceMotion}
        style={{ top: '46%', left: '-14%', zIndex: 5 }}
      >
        <OutlookMailCard />
      </FloatArtefact>
    </motion.div>
  )
}

/* ── Zentrales Cockpit ── */

function CockpitCard({ inView, reduceMotion }: { inView: boolean; reduceMotion: boolean }) {
  const stagger = reduceMotion ? 0 : 0.12
  const base = reduceMotion ? 0 : 0.6

  const step = (i: number) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 8 },
    animate: inView ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 0.45, delay: base + i * stagger, ease: EASE },
  })

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ width: '76%', maxWidth: '480px' }}
      initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.94 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : undefined}
      transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
    >
      <div
        style={{
          background:
            'linear-gradient(145deg, rgba(245, 245, 248, 0.16) 0%, rgba(200, 98, 42, 0.10) 100%)',
          border: '1px solid rgba(245, 245, 250, 0.22)',
          borderRadius: 'var(--r-md)',
          padding: '24px 26px',
          backdropFilter: 'blur(28px) saturate(180%)',
          WebkitBackdropFilter: 'blur(28px) saturate(180%)',
          boxShadow:
            'inset 0 1px 0 rgba(255, 255, 255, 0.28), 0 24px 64px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Header */}
        <motion.div className="flex items-center justify-between" {...step(0)}>
          <span
            className="font-mono uppercase"
            style={{
              fontSize: '9px',
              letterSpacing: '0.20em',
              color: 'var(--fg-subtle)',
            }}
          >
            Workspace · Cockpit
          </span>
          <span
            className="inline-flex items-center gap-1.5"
            style={{
              padding: '3px 8px',
              background: 'rgba(40, 200, 64, 0.10)',
              border: '1px solid rgba(40, 200, 64, 0.30)',
              borderRadius: '999px',
            }}
          >
            <span
              aria-hidden
              style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: '#28C840',
                boxShadow: '0 0 4px #28C840',
              }}
            />
            <span
              className="font-mono uppercase"
              style={{ fontSize: 8, letterSpacing: '0.14em', color: '#28C840' }}
            >
              live
            </span>
          </span>
        </motion.div>

        {/* Identity / SSO */}
        <motion.div
          className="mt-4 flex items-center gap-3 rounded-md"
          style={{
            background: 'rgba(15, 14, 12, 0.55)',
            padding: '12px 14px',
            border: '1px solid var(--border-subtle)',
          }}
          {...step(1)}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background:
                'linear-gradient(135deg, #DC8044 0%, #92301E 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 11,
            }}
          >
            SB
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="font-body font-semibold"
              style={{ fontSize: 11, color: 'var(--fg-default)', lineHeight: 1.1 }}
            >
              Stefan Braum
            </p>
            <p
              className="font-mono"
              style={{ fontSize: 9, color: 'var(--fg-subtle)', marginTop: 1 }}
            >
              SSO · MFA aktiv · Conditional Access ✓
            </p>
          </div>
          <Lock size={12} strokeWidth={1.6} style={{ color: '#28C840' }} />
        </motion.div>

        {/* App-Grid */}
        <motion.div className="mt-4" {...step(2)}>
          <p
            className="font-mono uppercase"
            style={{
              fontSize: 8,
              letterSpacing: '0.18em',
              color: 'var(--fg-subtle)',
              marginBottom: 8,
            }}
          >
            6 Apps · 1 Login
          </p>
          <div className="grid grid-cols-6 gap-2">
            {[
              { Icon: Mail,       label: 'Mail',  tone: '#0078D4' },
              { Icon: Users,      label: 'Teams', tone: '#6264A7' },
              { Icon: FileText,   label: 'Docs',  tone: '#185ABD' },
              { Icon: Server,     label: 'Drive', tone: '#0078D4' },
              { Icon: Smartphone, label: 'MDM',   tone: '#DC8044' },
              { Icon: ShieldCheck,label: 'Sec',   tone: '#28C840' },
            ].map(a => (
              <div
                key={a.label}
                className="flex flex-col items-center gap-1"
                style={{
                  padding: '8px 4px',
                  background: 'var(--bg-overlay)',
                  borderRadius: 6,
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <a.Icon size={14} strokeWidth={1.6} style={{ color: a.tone }} />
                <span
                  className="font-mono uppercase"
                  style={{ fontSize: 7, letterSpacing: '0.10em', color: 'var(--fg-muted)' }}
                >
                  {a.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick-Status */}
        <motion.div
          className="mt-4 grid grid-cols-3 gap-2"
          {...step(3)}
        >
          {[
            { label: 'Geräte',    value: '47' },
            { label: 'Compliant', value: '100 %' },
            { label: 'Sessions',  value: '12' },
          ].map(q => (
            <div
              key={q.label}
              style={{
                padding: '10px 12px',
                background: 'rgba(15, 14, 12, 0.5)',
                borderRadius: 6,
                border: '1px solid var(--border-subtle)',
              }}
            >
              <p
                className="font-mono uppercase"
                style={{
                  fontSize: 7,
                  letterSpacing: '0.14em',
                  color: 'var(--fg-subtle)',
                }}
              >
                {q.label}
              </p>
              <p
                className="mt-1 font-display font-bold"
                style={{ fontSize: 14, color: 'var(--fg-default)', lineHeight: 1 }}
              >
                {q.value}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.div
          className="mt-4 flex items-center justify-between pt-3"
          style={{ borderTop: '1px solid var(--border-subtle)' }}
          {...step(4)}
        >
          <span
            className="font-mono uppercase"
            style={{ fontSize: 8, letterSpacing: '0.14em', color: 'var(--fg-subtle)' }}
          >
            M365 · Google Workspace
          </span>
          <span
            className="font-mono"
            style={{ fontSize: 8, color: 'var(--fg-subtle)' }}
          >
            Tenant: braum-consulting · EU
          </span>
        </motion.div>
      </div>
    </motion.div>
  )
}

/* ── Floating Wrapper ── */

function FloatArtefact({
  children,
  style,
  delay,
  floatDelay,
  reduceMotion,
}: {
  children: React.ReactNode
  style: React.CSSProperties
  delay: number
  floatDelay: number
  reduceMotion: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reduceMotion) return
    const el = ref.current
    if (!el) return
    let raf = 0
    const start = performance.now() + floatDelay * 1000
    const tick = (now: number) => {
      const t = (now - start) / 1000
      const y = Math.sin(t * 0.85) * 6
      const r = Math.sin(t * 0.55) * 1
      el.style.transform = `translateY(${y}px) rotate(${r}deg)`
      raf = requestAnimationFrame(tick)
    }
    // Loop nur laufen lassen, solange das Artefakt sichtbar ist — spart CPU beim Wegscrollen.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          if (!raf) raf = requestAnimationFrame(tick)
        } else if (raf) {
          cancelAnimationFrame(raf)
          raf = 0
        }
      },
      { threshold: 0 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      if (raf) cancelAnimationFrame(raf)
    }
  }, [reduceMotion, floatDelay])

  return (
    <motion.div
      className="absolute"
      style={style}
      initial={reduceMotion ? false : { opacity: 0, scale: 0.65, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      <div ref={ref}>{children}</div>
    </motion.div>
  )
}

/* ── Artefakt-Komponenten ── */

const glassBg =
  'linear-gradient(145deg, rgba(245, 245, 248, 0.16) 0%, rgba(220, 128, 68, 0.06) 100%)'

function TeamsCallCard() {
  return (
    <div
      style={{
        width: 170,
        padding: 12,
        background: glassBg,
        border: '1px solid rgba(245, 245, 250, 0.20)',
        borderRadius: 12,
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        boxShadow:
          'inset 0 1px 0 rgba(255, 255, 255, 0.28), 0 16px 40px rgba(0, 0, 0, 0.45)',
      }}
    >
      <div className="flex items-center gap-2">
        <Users size={11} strokeWidth={1.8} style={{ color: '#6264A7' }} />
        <span
          className="font-mono uppercase"
          style={{ fontSize: 8, letterSpacing: '0.14em', color: 'var(--fg-subtle)' }}
        >
          Teams · live
        </span>
        <span
          aria-hidden
          className="ml-auto"
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#FF3B30',
            boxShadow: '0 0 6px rgba(255, 59, 48, 0.6)',
          }}
        />
      </div>
      <div className="mt-2 flex -space-x-1.5">
        {[
          'linear-gradient(135deg,#DC8044,#92301E)',
          'linear-gradient(135deg,#3B82F6,#1E40AF)',
          'linear-gradient(135deg,#28C840,#15803D)',
          'linear-gradient(135deg,#A855F7,#6B21A8)',
        ].map((bg, i) => (
          <div
            key={i}
            style={{
              width: 22,
              height: 22,
              borderRadius: '50%',
              background: bg,
              border: '1.5px solid #0F0E0C',
            }}
          />
        ))}
      </div>
      <p
        className="mt-2 font-body"
        style={{ fontSize: 9, color: 'var(--fg-default)', lineHeight: 1.3 }}
      >
        Werkstatt-Standup
      </p>
      <div className="mt-2 flex items-center gap-3">
        <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
          <Mic size={9} strokeWidth={1.8} style={{ color: 'var(--fg-muted)' }} />
          <span className="font-mono" style={{ fontSize: 7, color: 'var(--fg-muted)' }}>4</span>
        </span>
        <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
          <Video size={9} strokeWidth={1.8} style={{ color: 'var(--fg-muted)' }} />
          <span className="font-mono" style={{ fontSize: 7, color: 'var(--fg-muted)' }}>3</span>
        </span>
        <span
          className="ml-auto font-mono"
          style={{ fontSize: 7, color: '#FF3B30' }}
        >
          ● 24:18
        </span>
      </div>
    </div>
  )
}

function SharePointCard() {
  return (
    <div
      style={{
        width: 180,
        padding: 12,
        background: 'rgba(15, 14, 12, 0.92)',
        border: '1px solid rgba(245, 245, 250, 0.18)',
        borderRadius: 12,
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        boxShadow: '0 18px 44px rgba(0, 0, 0, 0.5)',
      }}
    >
      <div className="flex items-center gap-2">
        <FileText size={11} strokeWidth={1.8} style={{ color: '#185ABD' }} />
        <span
          className="font-mono uppercase"
          style={{ fontSize: 8, letterSpacing: '0.14em', color: 'var(--fg-subtle)' }}
        >
          SharePoint · DMS
        </span>
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0 0' }}>
        {[
          { name: 'Vertrag-2026.pdf', tag: 'classified' },
          { name: 'Roadmap-Q2.docx',  tag: 'shared' },
          { name: 'Audit-Log.xlsx',   tag: 'restricted' },
        ].map(f => (
          <li
            key={f.name}
            className="flex items-center justify-between py-1.5"
            style={{ borderBottom: '1px solid var(--border-subtle)' }}
          >
            <span
              className="font-mono"
              style={{ fontSize: 8, color: 'var(--fg-default)' }}
            >
              {f.name}
            </span>
            <span
              className="font-mono uppercase"
              style={{
                fontSize: 7,
                letterSpacing: '0.10em',
                color: f.tag === 'restricted' ? '#FF3B30' : 'var(--fg-subtle)',
              }}
            >
              {f.tag}
            </span>
          </li>
        ))}
      </ul>
      <p
        className="mt-2 font-mono"
        style={{ fontSize: 7, color: 'var(--fg-muted)' }}
      >
        Versioniert · DLP · Audit-trail
      </p>
    </div>
  )
}

function IntuneDeviceCard() {
  return (
    <div
      style={{
        padding: 14,
        background:
          'linear-gradient(145deg, rgba(245, 245, 248, 0.16) 0%, rgba(40, 200, 64, 0.06) 100%)',
        border: '1px solid rgba(40, 200, 64, 0.28)',
        borderRadius: 12,
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45)',
        minWidth: 160,
      }}
    >
      <div className="flex items-center gap-2">
        <Smartphone size={11} strokeWidth={1.8} style={{ color: '#28C840' }} />
        <span
          className="font-mono uppercase"
          style={{ fontSize: 8, letterSpacing: '0.14em', color: 'var(--fg-subtle)' }}
        >
          Intune · MDM
        </span>
      </div>
      <p
        className="mt-2 font-display font-black"
        style={{ fontSize: 24, color: '#28C840', lineHeight: 1 }}
      >
        47 / 47
      </p>
      <p
        className="mt-1 font-mono uppercase"
        style={{ fontSize: 7, letterSpacing: '0.10em', color: 'var(--fg-muted)' }}
      >
        Compliant
      </p>
      <p
        className="mt-2 font-mono"
        style={{ fontSize: 7, color: 'var(--fg-subtle)' }}
      >
        Notebooks · iPhones · Tablets
      </p>
    </div>
  )
}

function DefenderBadge() {
  return (
    <div
      style={{
        padding: '12px 16px',
        background:
          'linear-gradient(145deg, rgba(245, 245, 248, 0.16) 0%, rgba(40, 100, 200, 0.10) 100%)',
        border: '1px solid rgba(40, 100, 200, 0.32)',
        borderRadius: 12,
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45)',
        minWidth: 150,
      }}
    >
      <div className="flex items-center gap-2">
        <ShieldCheck size={12} strokeWidth={1.8} style={{ color: '#3B82F6' }} />
        <span
          className="font-mono uppercase"
          style={{ fontSize: 8, letterSpacing: '0.14em', color: 'var(--fg-subtle)' }}
        >
          Defender · 24/7
        </span>
      </div>
      <p
        className="mt-2 font-display font-bold"
        style={{ fontSize: 13, color: 'var(--fg-default)', lineHeight: 1.1 }}
      >
        0 Incidents
      </p>
      <p
        className="mt-1 font-mono"
        style={{ fontSize: 7, color: 'var(--fg-subtle)' }}
      >
        letzte 30 Tage
      </p>
    </div>
  )
}

function GlobeAccessCard() {
  return (
    <div
      style={{
        padding: 12,
        background: glassBg,
        border: '1px solid rgba(245, 245, 250, 0.22)',
        borderRadius: 12,
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        boxShadow:
          'inset 0 1px 0 rgba(255, 255, 255, 0.28), 0 16px 40px rgba(0, 0, 0, 0.45)',
        width: 160,
      }}
    >
      <div className="flex items-center gap-2">
        <Globe size={11} strokeWidth={1.8} style={{ color: 'var(--brand)' }} />
        <span
          className="font-mono uppercase"
          style={{ fontSize: 8, letterSpacing: '0.14em', color: 'var(--fg-subtle)' }}
        >
          Von überall
        </span>
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0 0' }}>
        {[
          { city: 'Frankfurt', dot: '#28C840' },
          { city: 'Berlin',    dot: '#28C840' },
          { city: 'Lissabon',  dot: '#28C840' },
          { city: 'NYC',       dot: '#FFBD2E' },
        ].map(l => (
          <li
            key={l.city}
            className="flex items-center gap-2 py-0.5"
          >
            <span
              aria-hidden
              style={{
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: l.dot,
              }}
            />
            <span
              className="font-mono"
              style={{ fontSize: 8, color: 'var(--fg-default)' }}
            >
              {l.city}
            </span>
            <span
              className="ml-auto font-mono"
              style={{ fontSize: 7, color: 'var(--fg-muted)' }}
            >
              <Wifi size={7} strokeWidth={2} style={{ display: 'inline', marginRight: 3 }} />
              MFA
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function OutlookMailCard() {
  return (
    <div
      style={{
        padding: 12,
        background: 'rgba(15, 14, 12, 0.92)',
        border: '1px solid rgba(245, 245, 250, 0.18)',
        borderRadius: 12,
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45)',
        width: 170,
      }}
    >
      <div className="flex items-center gap-2">
        <Mail size={11} strokeWidth={1.8} style={{ color: '#0078D4' }} />
        <span
          className="font-mono uppercase"
          style={{ fontSize: 8, letterSpacing: '0.14em', color: 'var(--fg-subtle)' }}
        >
          Exchange Online
        </span>
        <span
          className="ml-auto font-mono"
          style={{
            fontSize: 7,
            letterSpacing: '0.08em',
            color: 'var(--brand)',
            background: 'rgba(220, 128, 68, 0.12)',
            padding: '2px 5px',
            borderRadius: 3,
          }}
        >
          3 neu
        </span>
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0 0' }}>
        {[
          { name: 'M. Schmidt', subj: 'Vertrag Q2 — Final' },
          { name: 'IT-Team',    subj: 'MDM-Rollout heute' },
          { name: 'L. Becker',  subj: 'Re: Workshop-Termin' },
        ].map(m => (
          <li
            key={m.subj}
            className="py-1"
            style={{ borderBottom: '1px solid var(--border-subtle)' }}
          >
            <p
              className="font-mono"
              style={{ fontSize: 8, color: 'var(--fg-default)', fontWeight: 600 }}
            >
              {m.name}
            </p>
            <p
              className="font-mono"
              style={{ fontSize: 7, color: 'var(--fg-muted)' }}
            >
              {m.subj}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
