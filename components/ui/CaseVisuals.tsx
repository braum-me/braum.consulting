'use client'

/**
 * Vier kinematische Case-Visuals — geteilt zwischen Mainpage
 * (CasesFeatured.tsx, kompakte Card-Größe) und CaseHero auf der
 * Detail-Page (scaled-up als Hero-Banner).
 *
 * - Stewart Consult (marke)            → Doppel-Site Browser-Frames
 * - Modern Workplace Rollout (m365)    → Hub-Spoke mit Locations + Apps
 * - Copilot-Adoption Greenfield (ai)   → Typewriter-Prompt + Champion-Ring
 * - ISMS Confluence Audit (strategie)  → 3-Stage Workflow mit Light-Pulse
 *
 * Alle Visuals respektieren prefers-reduced-motion.
 */

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import {
  Sparkles, MessageSquare, CheckCircle2, FileText, Workflow, ShieldCheck,
  Mail, Calendar, FolderOpen,
} from 'lucide-react'

const EASE = [0.16, 1, 0.3, 1] as const

/** Slugs, für die es ein animiertes Mainpage-Visual gibt. */
export const CASE_VISUAL_SLUGS = new Set([
  'stewart-consult',
])

export function CaseVisual({ slug }: { slug: string }) {
  switch (slug) {
    case 'stewart-consult':            return <StewartDoubleSiteVisual />
    default:                           return null
  }
}

/* ── 1) Stewart Consult ─────────────────────────────────────────────── */

export function StewartDoubleSiteVisual() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const reduceMotion = useReducedMotion()

  return (
    <div ref={ref} className="absolute inset-0 flex items-center justify-center" style={{ padding: '24px' }}>
      <div className="relative" style={{ width: '100%', maxWidth: '360px', height: '100%' }}>
        {/* Linker Browser — leicht nach hinten geneigt */}
        <FloatTile
          inView={inView}
          reduceMotion={!!reduceMotion}
          delay={0.2}
          floatDelay={0}
          style={{
            position: 'absolute',
            left: '0%',
            top: '15%',
            width: '60%',
            transform: 'perspective(800px) rotateY(8deg) rotateX(-2deg)',
            zIndex: 2,
          }}
        >
          <StewartBrowser variant="brand" />
        </FloatTile>

        {/* Rechter Browser — überlappt, vorne */}
        <FloatTile
          inView={inView}
          reduceMotion={!!reduceMotion}
          delay={0.4}
          floatDelay={0.8}
          style={{
            position: 'absolute',
            right: '0%',
            top: '30%',
            width: '60%',
            transform: 'perspective(800px) rotateY(-8deg) rotateX(-2deg)',
            zIndex: 3,
          }}
        >
          <StewartBrowser variant="muted" />
        </FloatTile>

        {/* Brand-Glow zwischen den Sites mit Pulse */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 56,
            height: 56,
            borderRadius: 999,
            background:
              'radial-gradient(50% 50% at 50% 50%, rgba(220, 128, 68, 0.45) 0%, transparent 70%)',
            zIndex: 4,
          }}
          animate={reduceMotion ? {} : { scale: [1, 1.25, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div
          aria-hidden
          className="absolute flex items-center justify-center"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 36,
            height: 36,
            borderRadius: 999,
            background:
              'linear-gradient(135deg, rgba(220, 128, 68, 0.85), rgba(146, 48, 30, 0.85))',
            border: '1px solid rgba(245, 245, 250, 0.30)',
            boxShadow:
              '0 8px 24px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.35)',
            zIndex: 5,
          }}
        >
          <ShieldCheck size={16} strokeWidth={1.8} style={{ color: 'white' }} />
        </div>
      </div>
    </div>
  )
}

function StewartBrowser({ variant }: { variant: 'brand' | 'muted' }) {
  const accent = variant === 'brand' ? '#DC8044' : 'rgba(140, 165, 195, 0.55)'
  return (
    <div
      style={{
        background:
          'linear-gradient(145deg, rgba(28, 27, 24, 0.95) 0%, rgba(15, 14, 12, 0.95) 100%)',
        border: '1px solid rgba(245, 245, 250, 0.14)',
        borderRadius: 8,
        overflow: 'hidden',
        backdropFilter: 'blur(14px)',
        boxShadow:
          '0 20px 50px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
      }}
    >
      <div
        className="flex items-center gap-1.5"
        style={{
          padding: '6px 8px',
          background: 'rgba(245, 245, 250, 0.04)',
          borderBottom: '1px solid rgba(245, 245, 250, 0.08)',
        }}
      >
        {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
          <span
            key={c}
            aria-hidden
            style={{ width: 6, height: 6, borderRadius: 999, background: c, opacity: 0.7 }}
          />
        ))}
        <span
          className="ml-2 flex-1 font-mono"
          style={{
            fontSize: 7,
            color: 'rgba(245, 245, 250, 0.30)',
            background: 'rgba(15, 14, 12, 0.6)',
            padding: '2px 6px',
            borderRadius: 3,
            textAlign: 'center',
            letterSpacing: '0.04em',
          }}
        >
          {variant === 'brand' ? 'consulting' : 'audit'}
        </span>
      </div>
      {/* Hero-Mockup */}
      <div style={{ padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 5 }}>
        <span style={{ height: 2, width: '32%', background: accent, borderRadius: 2 }} />
        <span style={{ height: 7, width: '88%', background: 'rgba(245, 245, 250, 0.28)', borderRadius: 2 }} />
        <span style={{ height: 7, width: '70%', background: 'rgba(245, 245, 250, 0.22)', borderRadius: 2 }} />
        <span style={{ height: 3, width: '60%', background: 'rgba(245, 245, 250, 0.12)', borderRadius: 2, marginTop: 2 }} />
        <span style={{ height: 3, width: '50%', background: 'rgba(245, 245, 250, 0.10)', borderRadius: 2 }} />
        <span
          style={{
            height: 14, width: '38%',
            background: accent, opacity: 0.85,
            borderRadius: 3, marginTop: 5,
            boxShadow: variant === 'brand' ? '0 0 12px rgba(220, 128, 68, 0.45)' : 'none',
          }}
        />
      </div>
    </div>
  )
}

/* ── 2) Modern Workplace ────────────────────────────────────────────── */

export function ModernWorkplaceVisual() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const reduceMotion = useReducedMotion()

  return (
    <div ref={ref} className="absolute inset-0 flex items-center justify-center" style={{ padding: '20px' }}>
      <svg viewBox="0 0 360 200" style={{ width: '100%', height: '100%', maxWidth: '380px' }}>
        <defs>
          <radialGradient id="mw-hub-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(220, 128, 68, 0.55)" />
            <stop offset="100%" stopColor="rgba(220, 128, 68, 0)" />
          </radialGradient>
          <linearGradient id="mw-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="rgba(220, 128, 68, 0)" />
            <stop offset="50%"  stopColor="rgba(220, 128, 68, 0.65)" />
            <stop offset="100%" stopColor="rgba(220, 128, 68, 0)" />
          </linearGradient>
        </defs>

        {/* Hub-Glow */}
        <circle cx="180" cy="90" r="55" fill="url(#mw-hub-glow)" />

        {/* Pulsing Outer Rings */}
        {!reduceMotion && [0, 0.6, 1.2].map((delay) => (
          <motion.circle
            key={delay}
            cx="180" cy="90" r="32"
            fill="none"
            stroke="rgba(220, 128, 68, 0.55)"
            strokeWidth="0.8"
            initial={{ opacity: 0, r: 32 }}
            animate={inView ? { opacity: [0.6, 0], r: [32, 70] } : undefined}
            transition={{ duration: 1.8, repeat: Infinity, delay, ease: 'easeOut' }}
          />
        ))}

        {/* Connection-Lines mit Migrate-Dash-Animation */}
        {[
          { x2: 50,  y2: 160 },
          { x2: 180, y2: 175 },
          { x2: 310, y2: 160 },
        ].map((p, i) => (
          <g key={i}>
            <line
              x1="180" y1="90" x2={p.x2} y2={p.y2}
              stroke="rgba(220, 128, 68, 0.25)" strokeWidth="1" strokeDasharray="2 3"
            />
            {!reduceMotion && (
              <motion.circle
                cx="180" cy="90" r="2.5"
                fill="rgba(220, 128, 68, 0.95)"
                initial={{ opacity: 0 }}
                animate={inView ? {
                  cx: [180, p.x2],
                  cy: [90, p.y2],
                  opacity: [0, 1, 1, 0],
                } : undefined}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: 'easeInOut',
                }}
              />
            )}
          </g>
        ))}

        {/* Hub-Knoten */}
        <g>
          <rect
            x="142" y="64" width="76" height="52" rx="8"
            fill="rgba(15, 14, 12, 0.95)"
            stroke="rgba(220, 128, 68, 0.65)" strokeWidth="1.2"
          />
          <text x="180" y="85" textAnchor="middle"
            fill="#DC8044" fontSize="14"
            fontFamily="var(--font-display)" fontWeight="700"
            letterSpacing="-0.02em">
            M365
          </text>
          <text x="180" y="102" textAnchor="middle"
            fill="rgba(245, 245, 250, 0.45)" fontSize="6"
            fontFamily="var(--font-mono)" letterSpacing="0.24em">
            CENTRAL HUB
          </text>
        </g>

        {/* M365-App-Icons rund um Hub */}
        {[
          { x: 100, y: 50, Icon: Mail },
          { x: 240, y: 38, Icon: MessageSquare },
          { x: 260, y: 50, Icon: Calendar },
          { x: 80,  y: 38, Icon: FolderOpen },
        ].map((a, i) => (
          <foreignObject key={i} x={a.x - 8} y={a.y - 8} width="16" height="16">
            <div
              style={{
                width: 16, height: 16,
                borderRadius: 4,
                background: 'rgba(15, 14, 12, 0.95)',
                border: '1px solid rgba(220, 128, 68, 0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.5)',
              }}
            >
              <a.Icon size={9} strokeWidth={1.6} style={{ color: 'rgba(220, 128, 68, 0.85)' }} />
            </div>
          </foreignObject>
        ))}

        {/* Werks-Knoten mit MA-Counter */}
        {[
          { x: 20,  y: 150, code: 'DE', count: '1.200 MA' },
          { x: 145, y: 165, code: 'PL', count:   '700 MA' },
          { x: 270, y: 150, code: 'MX', count:   '300 MA' },
        ].map((n) => (
          <g key={n.code}>
            <rect
              x={n.x} y={n.y} width="70" height="26" rx="5"
              fill="rgba(15, 14, 12, 0.92)"
              stroke="rgba(245, 245, 250, 0.18)" strokeWidth="1"
            />
            <circle cx={n.x + 8} cy={n.y + 13} r="2.5" fill="#28C840" />
            <text x={n.x + 16} y={n.y + 11} fill="rgba(245, 245, 250, 0.85)"
              fontSize="8" fontFamily="var(--font-mono)" letterSpacing="0.14em">
              {n.code}
            </text>
            <text x={n.x + 16} y={n.y + 21} fill="rgba(245, 245, 250, 0.45)"
              fontSize="6" fontFamily="var(--font-mono)" letterSpacing="0.10em">
              {n.count}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}

/* ── 3) Copilot Adoption ────────────────────────────────────────────── */

const PROMPT_LINES = [
  'Sortier meine Inbox.',
  '20 Mails · 3 P1 · 14 normal · ',
]

export function CopilotAdoptionVisual() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const reduceMotion = useReducedMotion()

  const [line1Chars, setLine1Chars] = useState(reduceMotion ? PROMPT_LINES[0].length : 0)
  const [line2Chars, setLine2Chars] = useState(reduceMotion ? PROMPT_LINES[1].length : 0)

  useEffect(() => {
    if (reduceMotion || !inView) return
    let raf = 0
    let cancelled = false

    const type = (text: string, set: (n: number) => void, onDone?: () => void) => {
      let i = 0
      const tick = () => {
        if (cancelled) return
        i++
        set(i)
        if (i < text.length) raf = window.setTimeout(tick, 38) as unknown as number
        else if (onDone) raf = window.setTimeout(onDone, 320) as unknown as number
      }
      raf = window.setTimeout(tick, 280) as unknown as number
    }

    const start = () => {
      setLine1Chars(0)
      setLine2Chars(0)
      type(PROMPT_LINES[0], setLine1Chars, () => {
        type(PROMPT_LINES[1], setLine2Chars, () => {
          // Loop nach Pause
          raf = window.setTimeout(start, 2400) as unknown as number
        })
      })
    }
    start()

    return () => {
      cancelled = true
      clearTimeout(raf as unknown as number)
    }
  }, [inView, reduceMotion])

  return (
    <div ref={ref} className="absolute inset-0 flex items-center justify-center" style={{ padding: '20px' }}>
      <div className="relative flex items-center gap-5" style={{ width: '100%', maxWidth: '360px' }}>
        {/* Prompt-Console */}
        <motion.div
          style={{
            flex: '1 1 56%',
            background:
              'linear-gradient(145deg, rgba(28, 27, 24, 0.94), rgba(15, 14, 12, 0.96))',
            border: '1px solid rgba(220, 128, 68, 0.32)',
            borderRadius: 10,
            padding: '12px 14px',
            boxShadow:
              '0 18px 44px rgba(0, 0, 0, 0.55), 0 0 36px rgba(220, 128, 68, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
        >
          <div className="flex items-center gap-1.5" style={{ marginBottom: 8 }}>
            <Sparkles size={10} strokeWidth={1.6} style={{ color: 'var(--brand)' }} />
            <span
              className="font-mono uppercase"
              style={{ fontSize: 7, letterSpacing: '0.18em', color: 'var(--fg-muted)' }}
            >
              Copilot · GPT-4o
            </span>
            <span style={{ flex: 1 }} />
            <span
              style={{
                fontSize: 6,
                color: '#28C840',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.16em',
              }}
            >
              ● EU
            </span>
          </div>

          {/* User-Prompt (typewriter) */}
          <div style={{ fontSize: 8, color: 'rgba(245, 245, 250, 0.85)', lineHeight: 1.55, fontFamily: 'var(--font-body)' }}>
            {PROMPT_LINES[0].slice(0, line1Chars)}
            {!reduceMotion && line1Chars < PROMPT_LINES[0].length && (
              <span
                style={{
                  display: 'inline-block',
                  width: 1, height: 8,
                  background: 'var(--brand)',
                  marginLeft: 1,
                  verticalAlign: 'text-bottom',
                  animation: 'cf-caret 0.7s steps(2) infinite',
                }}
              />
            )}
          </div>

          {/* Assistant-Response */}
          <div
            style={{
              marginTop: 8,
              paddingTop: 8,
              borderTop: '1px solid rgba(245, 245, 250, 0.08)',
              fontSize: 7,
              color: 'var(--brand)',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.02em',
              lineHeight: 1.6,
            }}
          >
            ↳ {PROMPT_LINES[1].slice(0, line2Chars)}
            {!reduceMotion && line1Chars >= PROMPT_LINES[0].length && line2Chars < PROMPT_LINES[1].length && (
              <span
                style={{
                  display: 'inline-block',
                  width: 1, height: 7,
                  background: 'var(--brand)',
                  marginLeft: 1,
                  verticalAlign: 'text-bottom',
                  animation: 'cf-caret 0.7s steps(2) infinite',
                }}
              />
            )}
          </div>
        </motion.div>

        {/* Champions-Ring */}
        <motion.div
          className="relative shrink-0"
          style={{ width: 124, height: 124 }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={inView ? { opacity: 1, scale: 1 } : undefined}
          transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
        >
          {/* 3 concentric Rings */}
          {[44, 56, 62].map((r, i) => (
            <svg
              key={r}
              className="pointer-events-none absolute inset-0"
              viewBox="0 0 124 124"
            >
              <circle
                cx="62" cy="62" r={r}
                fill="none"
                stroke="rgba(220, 128, 68, 0.20)"
                strokeWidth={i === 0 ? 1 : 0.6}
                strokeDasharray={i === 0 ? '3 4' : '2 6'}
              />
            </svg>
          ))}

          {/* Center */}
          <motion.div
            className="absolute flex items-center justify-center"
            style={{
              left: '50%', top: '50%',
              transform: 'translate(-50%, -50%)',
              width: 34, height: 34,
              borderRadius: 999,
              background: 'linear-gradient(135deg, var(--brand), #92301E)',
              boxShadow:
                '0 0 30px rgba(220, 128, 68, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.30)',
            }}
            animate={reduceMotion ? {} : { boxShadow: [
              '0 0 20px rgba(220, 128, 68, 0.45)',
              '0 0 38px rgba(220, 128, 68, 0.75)',
              '0 0 20px rgba(220, 128, 68, 0.45)',
            ] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <MessageSquare size={13} strokeWidth={1.8} style={{ color: 'white' }} />
          </motion.div>

          {/* 8 Champions auf zwei Ringen */}
          {[
            { deg: 0,   r: 44, active: true },
            { deg: 45,  r: 56, active: false },
            { deg: 90,  r: 44, active: true },
            { deg: 135, r: 56, active: false },
            { deg: 180, r: 44, active: true },
            { deg: 225, r: 56, active: false },
            { deg: 270, r: 44, active: true },
            { deg: 315, r: 56, active: false },
          ].map(({ deg, r, active }, i) => {
            const rad = (deg * Math.PI) / 180
            const cx = 62 + r * Math.cos(rad)
            const cy = 62 + r * Math.sin(rad)
            return (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: cx, top: cy,
                  transform: 'translate(-50%, -50%)',
                  width: active ? 13 : 9,
                  height: active ? 13 : 9,
                  borderRadius: 999,
                  background: active
                    ? 'rgba(220, 128, 68, 0.85)'
                    : 'rgba(245, 245, 250, 0.20)',
                  border: '1px solid rgba(245, 245, 250, 0.30)',
                  boxShadow: active ? '0 0 10px rgba(220, 128, 68, 0.55)' : 'none',
                }}
                animate={reduceMotion ? {} : active ? { scale: [1, 1.18, 1] } : {}}
                transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
              />
            )
          })}
        </motion.div>
      </div>

      <style jsx global>{`
        @keyframes cf-caret {
          0%, 50% { opacity: 1; }
          50.01%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}

/* ── 4) ISMS Workflow ───────────────────────────────────────────────── */

export function ISMSWorkflowVisual() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const reduceMotion = useReducedMotion()

  const stages = [
    { Icon: FileText,     label: 'Antrag',   sub: 'Confluence' },
    { Icon: Workflow,     label: 'Approval', sub: 'Jira-Flow'  },
    { Icon: CheckCircle2, label: 'Audit',    sub: 'ISO-27001'  },
  ]

  return (
    <div ref={ref} className="absolute inset-0 flex items-center justify-center" style={{ padding: '20px' }}>
      <div className="relative flex w-full max-w-[360px] items-center justify-between">
        {stages.map((s, i) => (
          <div key={s.label} className="flex items-center" style={{ flex: i < stages.length - 1 ? '1 1 auto' : '0 0 auto' }}>
            {/* Stage-Card */}
            <motion.div
              className="relative flex flex-col items-center gap-1.5"
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.55, delay: 0.2 + i * 0.18, ease: EASE }}
              style={{
                padding: '14px 12px',
                minWidth: 76,
                background:
                  i === 1
                    ? 'linear-gradient(145deg, rgba(220, 128, 68, 0.18), rgba(146, 48, 30, 0.10))'
                    : 'linear-gradient(145deg, rgba(28, 27, 24, 0.92), rgba(15, 14, 12, 0.92))',
                border: i === 1
                  ? '1px solid rgba(220, 128, 68, 0.55)'
                  : '1px solid rgba(245, 245, 250, 0.12)',
                borderRadius: 10,
                boxShadow: i === 1
                  ? '0 0 32px rgba(220, 128, 68, 0.30), 0 14px 30px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.10)'
                  : '0 10px 22px rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(12px)',
              }}
            >
              {/* Pulse-Ring um Approval-Stage */}
              {i === 1 && !reduceMotion && (
                <motion.span
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{ borderRadius: 10, border: '1px solid rgba(220, 128, 68, 0.55)' }}
                  animate={{ scale: [1, 1.18], opacity: [0.65, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                />
              )}
              <s.Icon
                size={18}
                strokeWidth={1.6}
                style={{ color: i === 1 ? 'var(--brand)' : 'rgba(245, 245, 250, 0.65)' }}
              />
              <span
                className="font-mono uppercase"
                style={{
                  fontSize: 8,
                  letterSpacing: '0.16em',
                  color: i === 1 ? 'var(--brand)' : 'rgba(245, 245, 250, 0.72)',
                }}
              >
                {s.label}
              </span>
              <span
                className="font-mono"
                style={{
                  fontSize: 6,
                  letterSpacing: '0.10em',
                  color: 'rgba(245, 245, 250, 0.40)',
                }}
              >
                {s.sub}
              </span>
            </motion.div>

            {/* Arrow zwischen Stages */}
            {i < stages.length - 1 && (
              <div className="relative flex-1" style={{ minWidth: 28, height: 2, margin: '0 6px' }}>
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(90deg, rgba(220, 128, 68, 0.10), rgba(220, 128, 68, 0.55), rgba(220, 128, 68, 0.10))',
                  }}
                />
                {/* Light-Pulse entlang der Linie */}
                {!reduceMotion && (
                  <motion.span
                    aria-hidden
                    className="absolute top-1/2"
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 999,
                      background: 'rgba(220, 128, 68, 0.95)',
                      boxShadow: '0 0 12px rgba(220, 128, 68, 0.85)',
                      transform: 'translateY(-50%)',
                    }}
                    initial={{ left: '0%', opacity: 0 }}
                    animate={inView ? { left: ['0%', '100%'], opacity: [0, 1, 0] } : undefined}
                    transition={{
                      duration: 1.6,
                      repeat: Infinity,
                      delay: 0.4 + i * 0.4,
                      ease: 'easeInOut',
                    }}
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Float-Wrapper (sin-wave) ────────────────────────────────────────── */

function FloatTile({
  children,
  style,
  delay,
  floatDelay,
  inView,
  reduceMotion,
}: {
  children:     React.ReactNode
  style:        React.CSSProperties
  delay:        number
  floatDelay:   number
  inView:       boolean
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
      const y = Math.sin(t * 0.85) * 4
      const r = Math.sin(t * 0.6) * 0.6
      el.style.transform = `${style.transform ?? ''} translateY(${y}px) rotate(${r}deg)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduceMotion, floatDelay, style.transform])

  return (
    <motion.div
      style={style}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      <div ref={ref}>{children}</div>
    </motion.div>
  )
}
