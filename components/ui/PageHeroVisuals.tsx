'use client'

/**
 * Mini-Visuals für die Sub-Page Heros (Kontakt, Lagebild, Lexikon, Methodik).
 * Pattern wie ServiceVisuals — kompakt, kinematisch, respect reduced-motion.
 */

import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import {
  Mail, Clock, MessageSquare, CheckCircle2, Compass, FileText,
  BookOpen, Layers, Target, Map,
} from 'lucide-react'

const EASE = [0.16, 1, 0.3, 1] as const

/* ── Container ─────────────────────────────────────────────────────── */

function Stage({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        aspectRatio: '5 / 4',
        borderRadius: 14,
        border: '1px solid var(--border-subtle)',
        background:
          'radial-gradient(80% 100% at 50% 50%, rgba(146, 48, 30, 0.16) 0%, rgba(15, 14, 12, 0.6) 60%, var(--bg-base) 100%)',
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.45)',
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'var(--noise-svg)',
          mixBlendMode: 'overlay',
          opacity: 0.06,
        }}
      />
      {children}
    </div>
  )
}

/* ── 1) Kontakt — Inbox-Card mit „Antwort 48h" ─────────────────────── */

export function KontaktVisual() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const reduceMotion = useReducedMotion()

  return (
    <div ref={ref} className="h-full">
      <Stage>
        <div className="absolute inset-0 flex items-center justify-center" style={{ padding: 24 }}>
          {/* Inbox-Card (Hauptelement) */}
          <motion.div
            style={{
              position: 'relative',
              width: '90%',
              maxWidth: 320,
              padding: '18px 20px',
              background:
                'linear-gradient(145deg, rgba(28, 27, 24, 0.95), rgba(15, 14, 12, 0.95))',
              border: '1px solid rgba(220, 128, 68, 0.32)',
              borderRadius: 12,
              backdropFilter: 'blur(14px)',
              boxShadow:
                '0 28px 60px rgba(0, 0, 0, 0.55), 0 0 36px rgba(220, 128, 68, 0.16)',
              zIndex: 3,
            }}
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.7, delay: 0.2, ease: EASE }}
          >
            {/* Header */}
            <div className="flex items-center gap-3" style={{ marginBottom: 14 }}>
              <span
                style={{
                  width: 32, height: 32,
                  borderRadius: 8,
                  background: 'rgba(220, 128, 68, 0.16)',
                  border: '1px solid rgba(220, 128, 68, 0.35)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Mail size={14} strokeWidth={1.6} style={{ color: 'var(--brand)' }} />
              </span>
              <div>
                <p
                  className="font-mono uppercase"
                  style={{ fontSize: 8, letterSpacing: '0.18em', color: 'rgba(245, 245, 250, 0.55)' }}
                >
                  Direkter Draht
                </p>
                <p
                  className="font-body"
                  style={{ fontSize: 12, color: 'rgba(245, 245, 250, 0.92)', marginTop: 2 }}
                >
                  Stefan Braum
                </p>
              </div>
            </div>

            {/* Lines */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ height: 4, width: '85%', background: 'rgba(245, 245, 250, 0.18)', borderRadius: 2 }} />
              <span style={{ height: 4, width: '70%', background: 'rgba(245, 245, 250, 0.14)', borderRadius: 2 }} />
              <span style={{ height: 4, width: '58%', background: 'rgba(220, 128, 68, 0.55)', borderRadius: 2 }} />
            </div>

            {/* Antwort-Indicator */}
            <motion.div
              className="flex items-center gap-2"
              style={{
                marginTop: 14,
                padding: '8px 10px',
                background: 'rgba(40, 200, 64, 0.10)',
                border: '1px solid rgba(40, 200, 64, 0.32)',
                borderRadius: 6,
              }}
              animate={reduceMotion ? {} : { borderColor: ['rgba(40, 200, 64, 0.32)', 'rgba(40, 200, 64, 0.70)', 'rgba(40, 200, 64, 0.32)'] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Clock size={10} strokeWidth={1.8} style={{ color: '#28C840' }} />
              <span
                className="font-mono uppercase"
                style={{ fontSize: 8, letterSpacing: '0.16em', color: '#28C840' }}
              >
                Antwort in 48 h
              </span>
            </motion.div>
          </motion.div>

          {/* Floating MessageSquare top-right */}
          {!reduceMotion && (
            <motion.span
              className="absolute"
              style={{ right: '12%', top: '14%', zIndex: 4 }}
              animate={{ y: [0, -6, 0], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <MessageSquare size={18} strokeWidth={1.5} style={{ color: 'var(--brand)' }} />
            </motion.span>
          )}

          {/* Floating CheckCircle bottom-left */}
          {!reduceMotion && (
            <motion.span
              className="absolute"
              style={{ left: '10%', bottom: '14%', zIndex: 4 }}
              animate={{ y: [0, -5, 0], opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 2.4, repeat: Infinity, delay: 0.6, ease: 'easeInOut' }}
            >
              <CheckCircle2 size={14} strokeWidth={1.5} style={{ color: '#28C840' }} />
            </motion.span>
          )}
        </div>
      </Stage>
    </div>
  )
}

/* ── 2) Lagebild — Compass + Scan-Punkte ───────────────────────────── */

export function LagebildVisualHero() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const reduceMotion = useReducedMotion()

  return (
    <div ref={ref} className="h-full">
      <Stage>
        <svg viewBox="0 0 240 192" style={{ width: '100%', height: '100%' }}>
          <defs>
            <radialGradient id="lh-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(220, 128, 68, 0.55)" />
              <stop offset="100%" stopColor="rgba(220, 128, 68, 0)" />
            </radialGradient>
            <linearGradient id="lh-sweep" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(220, 128, 68, 0)" />
              <stop offset="80%" stopColor="rgba(220, 128, 68, 0.55)" />
              <stop offset="100%" stopColor="rgba(220, 128, 68, 0.85)" />
            </linearGradient>
          </defs>

          {/* Background-Glow */}
          <circle cx="120" cy="96" r="76" fill="url(#lh-glow)" opacity="0.5" />

          {/* Radar-Rings */}
          {[28, 50, 72].map((r) => (
            <circle key={r} cx="120" cy="96" r={r}
              fill="none" stroke="rgba(220, 128, 68, 0.18)"
              strokeWidth="0.6" strokeDasharray="3 4" />
          ))}

          {/* Cross-hairs */}
          <line x1="44" y1="96" x2="196" y2="96"
            stroke="rgba(220, 128, 68, 0.14)" strokeWidth="0.5" />
          <line x1="120" y1="20" x2="120" y2="172"
            stroke="rgba(220, 128, 68, 0.14)" strokeWidth="0.5" />

          {/* Sweep-Arm */}
          {!reduceMotion ? (
            <motion.g
              style={{ transformOrigin: '120px 96px' }}
              animate={inView ? { rotate: 360 } : undefined}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              <line x1="120" y1="96" x2="192" y2="96"
                stroke="url(#lh-sweep)" strokeWidth="2" strokeLinecap="round" />
              <path d="M 120 96 L 192 96 A 72 72 0 0 0 184 56 Z"
                fill="url(#lh-sweep)" opacity="0.22" />
            </motion.g>
          ) : (
            <line x1="120" y1="96" x2="192" y2="96"
              stroke="rgba(220, 128, 68, 0.65)" strokeWidth="2" strokeLinecap="round" />
          )}

          {/* Center compass */}
          <circle cx="120" cy="96" r="9"
            fill="rgba(15, 14, 12, 0.95)" stroke="#DC8044" strokeWidth="1.6" />
          <foreignObject x="110" y="86" width="20" height="20">
            <div className="flex items-center justify-center" style={{ width: 20, height: 20 }}>
              <Compass size={14} strokeWidth={1.8} style={{ color: 'var(--brand)' }} />
            </div>
          </foreignObject>

          {/* Scan-Punkte */}
          {[
            { x: 78,  y: 60,  delay: 0.5 },
            { x: 158, y: 70,  delay: 0.9 },
            { x: 180, y: 120, delay: 1.3 },
            { x: 90,  y: 138, delay: 1.7 },
            { x: 60,  y: 100, delay: 2.1 },
          ].map((p, i) => (
            <motion.g
              key={i}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={inView ? { opacity: 1, scale: 1 } : undefined}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.5, delay: p.delay, ease: EASE }}
              style={{ transformOrigin: `${p.x}px ${p.y}px` }}
            >
              <circle cx={p.x} cy={p.y} r="3.6"
                fill="rgba(15, 14, 12, 0.95)" stroke="#DC8044" strokeWidth="1.3" />
              {!reduceMotion && (
                <motion.circle
                  cx={p.x} cy={p.y} r="3.6"
                  fill="none" stroke="#DC8044" strokeWidth="0.8"
                  animate={{ r: [3.6, 12], opacity: [0.65, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, delay: p.delay, ease: 'easeOut' }}
                />
              )}
            </motion.g>
          ))}

          {/* Eyebrow */}
          <text x="232" y="16" textAnchor="end"
            fill="rgba(245, 245, 250, 0.45)" fontSize="7"
            fontFamily="var(--font-mono)" letterSpacing="0.22em">
            SCAN · LIVE
          </text>
        </svg>
      </Stage>
    </div>
  )
}

/* ── 3) Lexikon — Term-Card-Stack ──────────────────────────────────── */

export function LexikonVisual() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const reduceMotion = useReducedMotion()

  const cards = [
    { term: 'Lotsenprinzip', cat: 'METHODIK',  delay: 0.2 },
    { term: 'Lagebild',      cat: 'METHODIK',  delay: 0.35 },
    { term: 'M365-Governance', cat: 'TECHNIK', delay: 0.5 },
    { term: 'TISAX',         cat: 'INDUSTRIE', delay: 0.65 },
  ]

  return (
    <div ref={ref} className="h-full">
      <Stage>
        <div className="absolute inset-0 flex flex-col items-stretch justify-center"
             style={{ padding: '22px 26px', gap: 8 }}>
          {cards.map((c, i) => (
            <motion.div
              key={c.term}
              initial={{ opacity: 0, x: -10 }}
              animate={inView ? { opacity: 1, x: 0 } : undefined}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.5, delay: c.delay, ease: EASE }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                padding: '10px 14px',
                background: i === 1
                  ? 'linear-gradient(145deg, rgba(220, 128, 68, 0.12), rgba(146, 48, 30, 0.06))'
                  : 'rgba(28, 27, 24, 0.85)',
                border: '1px solid ' + (i === 1
                  ? 'rgba(220, 128, 68, 0.45)'
                  : 'rgba(245, 245, 250, 0.10)'),
                borderRadius: 8,
                backdropFilter: 'blur(8px)',
                boxShadow: '0 10px 24px rgba(0, 0, 0, 0.30)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <BookOpen
                  size={12}
                  strokeWidth={1.5}
                  style={{ color: i === 1 ? 'var(--brand)' : 'rgba(245, 245, 250, 0.45)' }}
                />
                <span
                  className="font-display font-semibold"
                  style={{
                    fontSize: 13,
                    letterSpacing: '-0.005em',
                    color: i === 1 ? 'var(--brand)' : 'rgba(245, 245, 250, 0.85)',
                  }}
                >
                  {c.term}
                </span>
              </div>
              <span
                className="font-mono uppercase"
                style={{
                  fontSize: 7,
                  letterSpacing: '0.18em',
                  color: 'rgba(245, 245, 250, 0.45)',
                }}
              >
                {c.cat}
              </span>
            </motion.div>
          ))}

          {/* Eyebrow oben rechts */}
          <span
            className="font-mono uppercase absolute"
            style={{
              right: 14, top: 12,
              fontSize: 7, letterSpacing: '0.22em',
              color: 'rgba(245, 245, 250, 0.42)',
            }}
          >
            A – Z
          </span>
        </div>
      </Stage>
    </div>
  )
}

/* ── 4) Methodik — 4-Phasen-Bogen ──────────────────────────────────── */

export function MethodikVisual() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const reduceMotion = useReducedMotion()

  const phases = [
    { Icon: Compass,  label: 'Lagebild',     delay: 0.2 },
    { Icon: Map,      label: 'Kurs setzen',  delay: 0.4 },
    { Icon: Target,   label: 'Manövrieren',  delay: 0.6 },
    { Icon: FileText, label: 'Übergabe',     delay: 0.8 },
  ] as const

  return (
    <div ref={ref} className="h-full">
      <Stage>
        <svg viewBox="0 0 320 240" style={{ width: '100%', height: '100%' }}>
          <defs>
            <radialGradient id="mt-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(220, 128, 68, 0.35)" />
              <stop offset="100%" stopColor="rgba(220, 128, 68, 0)" />
            </radialGradient>
          </defs>

          <circle cx="160" cy="120" r="90" fill="url(#mt-glow)" opacity="0.4" />

          {/* Phasen-Bogen (arc) */}
          {!reduceMotion ? (
            <motion.path
              d="M 40 180 Q 90 80, 160 80 T 280 180"
              fill="none"
              stroke="rgba(220, 128, 68, 0.55)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="3 5"
              initial={{ pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : undefined}
              transition={{ duration: 1.6, delay: 0.3, ease: 'easeInOut' }}
            />
          ) : (
            <path d="M 40 180 Q 90 80, 160 80 T 280 180"
              fill="none" stroke="rgba(220, 128, 68, 0.55)"
              strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 5" />
          )}

          {/* Phasen-Punkte mit Icon-Boxen */}
          {[
            { x: 40,  y: 180, idx: 0 },
            { x: 110, y: 100, idx: 1 },
            { x: 210, y: 100, idx: 2 },
            { x: 280, y: 180, idx: 3 },
          ].map((p) => {
            const phase = phases[p.idx]
            return (
              <motion.g
                key={p.idx}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={inView ? { opacity: 1, scale: 1 } : undefined}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.5, delay: phase.delay, ease: EASE }}
                style={{ transformOrigin: `${p.x}px ${p.y}px` }}
              >
                <rect
                  x={p.x - 18} y={p.y - 18} width="36" height="36" rx="8"
                  fill="rgba(15, 14, 12, 0.95)"
                  stroke="rgba(220, 128, 68, 0.55)"
                  strokeWidth="1.2"
                />
                <foreignObject x={p.x - 9} y={p.y - 9} width="18" height="18">
                  <div className="flex items-center justify-center" style={{ width: 18, height: 18 }}>
                    <phase.Icon size={13} strokeWidth={1.6} style={{ color: 'var(--brand)' }} />
                  </div>
                </foreignObject>
                <text x={p.x} y={p.y + 32} textAnchor="middle"
                  fill="rgba(245, 245, 250, 0.78)"
                  fontSize="7"
                  fontFamily="var(--font-mono)"
                  letterSpacing="0.16em">
                  {String(p.idx + 1).padStart(2, '0')}
                </text>
                <text x={p.x} y={p.y + 44} textAnchor="middle"
                  fill="rgba(245, 245, 250, 0.55)"
                  fontSize="7"
                  fontFamily="var(--font-mono)">
                  {phase.label}
                </text>
              </motion.g>
            )
          })}

          {/* Eyebrow */}
          <text x="310" y="20" textAnchor="end"
            fill="rgba(245, 245, 250, 0.45)"
            fontSize="7"
            fontFamily="var(--font-mono)"
            letterSpacing="0.22em">
            4 PHASEN
          </text>
        </svg>
      </Stage>
    </div>
  )
}

void Layers
