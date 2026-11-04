'use client'

/**
 * Vier mini-Visuals für die Process-Section (Lotsenprinzip) auf der Mainpage.
 *
 *   01 Lagebild      → Radar-Sweep mit auftauchenden Reibungspunkten
 *   02 Kurs setzen   → Kompass-Needle die zum Zielpunkt schwingt
 *   03 Manövrieren   → Checkliste die step-by-step grün wird
 *   04 Übergabe      → Handover-Card (Doc-Stack + Schlüssel-Glyph)
 *
 * Größen sind bewusst kompakt (max ~240×130) — passt in die schmale
 * Timeline-Spalte der Process-Section. Respektiert prefers-reduced-motion.
 */

import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { Check, KeyRound, FileText } from 'lucide-react'

const EASE = [0.16, 1, 0.3, 1] as const

export type ProcessStepKey = 'lagebild' | 'kurs' | 'manoeuvrieren' | 'uebergabe'

export function ProcessStepVisual({ step }: { step: ProcessStepKey }) {
  switch (step) {
    case 'lagebild':      return <LagebildVisual />
    case 'kurs':          return <KursVisual />
    case 'manoeuvrieren': return <ManoeuvrierenVisual />
    case 'uebergabe':     return <UebergabeVisual />
  }
}

/* ── Shared Stage ────────────────────────────────────────────────────── */

function Stage({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        aspectRatio: '5 / 3',
        maxWidth: 260,
        borderRadius: 10,
        border: '1px solid var(--border-subtle)',
        background:
          'radial-gradient(80% 110% at 50% 50%, rgba(146, 48, 30, 0.14) 0%, rgba(15, 14, 12, 0.55) 60%, var(--bg-base) 100%)',
        boxShadow: '0 14px 32px rgba(0, 0, 0, 0.35)',
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

/* ── 01 Lagebild — Radar-Sweep ───────────────────────────────────────── */

function LagebildVisual() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15%' })
  const reduceMotion = useReducedMotion()

  // 5 Reibungspunkte
  const points = [
    { x: 78,  y: 38, delay: 0.4 },
    { x: 132, y: 52, delay: 0.8 },
    { x: 158, y: 88, delay: 1.2 },
    { x: 94,  y: 104, delay: 1.6 },
    { x: 52,  y: 76, delay: 2.0 },
  ]

  return (
    <div ref={ref}>
      <Stage>
        <svg viewBox="0 0 220 132" style={{ width: '100%', height: '100%' }}>
          <defs>
            <radialGradient id="lage-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(220, 128, 68, 0.55)" />
              <stop offset="100%" stopColor="rgba(220, 128, 68, 0)" />
            </radialGradient>
            <linearGradient id="lage-sweep" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"  stopColor="rgba(220, 128, 68, 0)" />
              <stop offset="80%" stopColor="rgba(220, 128, 68, 0.55)" />
              <stop offset="100%" stopColor="rgba(220, 128, 68, 0.85)" />
            </linearGradient>
          </defs>

          {/* Center-Glow */}
          <circle cx="110" cy="66" r="50" fill="url(#lage-glow)" opacity="0.6" />

          {/* Radar-Rings */}
          {[18, 32, 48].map((r) => (
            <circle
              key={r}
              cx="110" cy="66" r={r}
              fill="none"
              stroke="rgba(220, 128, 68, 0.18)"
              strokeWidth="0.6"
              strokeDasharray="2 3"
            />
          ))}

          {/* Cross-Hairs */}
          <line x1="60" y1="66" x2="160" y2="66" stroke="rgba(220, 128, 68, 0.14)" strokeWidth="0.5" />
          <line x1="110" y1="20" x2="110" y2="112" stroke="rgba(220, 128, 68, 0.14)" strokeWidth="0.5" />

          {/* Rotating Sweep-Arm */}
          {!reduceMotion ? (
            <motion.g
              style={{ transformOrigin: '110px 66px' }}
              animate={inView ? { rotate: 360 } : undefined}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
            >
              <line
                x1="110" y1="66" x2="158" y2="66"
                stroke="url(#lage-sweep)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M 110 66 L 158 66 A 48 48 0 0 0 152 38 Z"
                fill="url(#lage-sweep)"
                opacity="0.25"
              />
            </motion.g>
          ) : (
            <line x1="110" y1="66" x2="158" y2="66"
              stroke="rgba(220, 128, 68, 0.65)" strokeWidth="1.5" strokeLinecap="round" />
          )}

          {/* Center-Dot */}
          <circle cx="110" cy="66" r="2.2" fill="#DC8044" />

          {/* Reibungspunkte — fade-in nacheinander */}
          {points.map((p, i) => (
            <motion.g
              key={i}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={inView ? { opacity: 1, scale: 1 } : undefined}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.5, delay: p.delay, ease: EASE }}
              style={{ transformOrigin: `${p.x}px ${p.y}px` }}
            >
              <circle cx={p.x} cy={p.y} r="3.2"
                fill="rgba(15, 14, 12, 0.95)"
                stroke="#DC8044" strokeWidth="1.2"
              />
              {!reduceMotion && (
                <motion.circle
                  cx={p.x} cy={p.y} r="3.2"
                  fill="none" stroke="#DC8044" strokeWidth="0.8"
                  animate={{ r: [3.2, 9], opacity: [0.6, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: p.delay, ease: 'easeOut' }}
                />
              )}
            </motion.g>
          ))}

          {/* Eyebrow oben rechts */}
          <text x="210" y="14" textAnchor="end"
            fill="rgba(245, 245, 250, 0.45)" fontSize="6"
            fontFamily="var(--font-mono)" letterSpacing="0.22em">
            SCAN · 5
          </text>
        </svg>
      </Stage>
    </div>
  )
}

/* ── 02 Kurs setzen — Compass-Needle zum Ziel ─────────────────────────── */

function KursVisual() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15%' })
  const reduceMotion = useReducedMotion()

  return (
    <div ref={ref}>
      <Stage>
        <svg viewBox="0 0 220 132" style={{ width: '100%', height: '100%' }}>
          <defs>
            <radialGradient id="kurs-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(220, 128, 68, 0.5)" />
              <stop offset="100%" stopColor="rgba(220, 128, 68, 0)" />
            </radialGradient>
          </defs>

          {/* Background-Glow am Ziel */}
          <circle cx="178" cy="40" r="22" fill="url(#kurs-glow)" />

          {/* Compass-Ring */}
          <circle cx="60" cy="80" r="30"
            fill="none"
            stroke="rgba(220, 128, 68, 0.32)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          <circle cx="60" cy="80" r="34"
            fill="none"
            stroke="rgba(220, 128, 68, 0.16)"
            strokeWidth="0.6"
          />

          {/* Cardinal-Marks */}
          {[0, 90, 180, 270].map((deg) => {
            const rad = (deg * Math.PI) / 180
            const x = 60 + 30 * Math.cos(rad)
            const y = 80 + 30 * Math.sin(rad)
            return (
              <circle key={deg} cx={x} cy={y} r="1.5"
                fill={deg === 270 ? '#DC8044' : 'rgba(245, 245, 250, 0.5)'} />
            )
          })}

          {/* Needle — schwingt sich auf Ziel ein */}
          {!reduceMotion ? (
            <motion.g
              style={{ transformOrigin: '60px 80px' }}
              initial={{ rotate: -50 }}
              animate={inView ? { rotate: [-50, 60, 10, 40, 25] } : undefined}
              transition={{ duration: 2.4, ease: 'easeInOut', delay: 0.3 }}
            >
              <line x1="60" y1="80" x2="84" y2="80"
                stroke="#DC8044" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="60" y1="80" x2="44" y2="80"
                stroke="rgba(220, 128, 68, 0.35)" strokeWidth="1.2" strokeLinecap="round" />
              <circle cx="60" cy="80" r="2.4" fill="rgba(15, 14, 12, 0.95)" stroke="#DC8044" strokeWidth="1" />
            </motion.g>
          ) : (
            <g>
              <line x1="60" y1="80" x2="82" y2="62"
                stroke="#DC8044" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="60" cy="80" r="2.4" fill="rgba(15, 14, 12, 0.95)" stroke="#DC8044" strokeWidth="1" />
            </g>
          )}

          {/* Trajektorie zum Ziel */}
          {!reduceMotion ? (
            <motion.path
              d="M 88 76 Q 130 50, 168 40"
              fill="none"
              stroke="#DC8044"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeDasharray="2 3"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={inView ? { pathLength: 1, opacity: 0.85 } : undefined}
              transition={{ duration: 1.4, delay: 1.6, ease: 'easeInOut' }}
            />
          ) : (
            <path d="M 88 76 Q 130 50, 168 40"
              fill="none" stroke="#DC8044" strokeWidth="1.2"
              strokeLinecap="round" strokeDasharray="2 3" opacity="0.85" />
          )}

          {/* Ziel-Marker */}
          <motion.g
            initial={{ opacity: 0, scale: 0.6 }}
            animate={inView ? { opacity: 1, scale: 1 } : undefined}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.5, delay: 2.6, ease: EASE }}
            style={{ transformOrigin: '178px 40px' }}
          >
            <circle cx="178" cy="40" r="6"
              fill="rgba(15, 14, 12, 0.95)"
              stroke="#DC8044" strokeWidth="1.5"
            />
            <circle cx="178" cy="40" r="2" fill="#DC8044" />
            {!reduceMotion && (
              <motion.circle
                cx="178" cy="40" r="6"
                fill="none" stroke="#DC8044" strokeWidth="0.8"
                animate={{ r: [6, 14], opacity: [0.55, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, delay: 2.8, ease: 'easeOut' }}
              />
            )}
          </motion.g>

          {/* Labels */}
          <text x="60" y="120" textAnchor="middle"
            fill="rgba(245, 245, 250, 0.45)" fontSize="6"
            fontFamily="var(--font-mono)" letterSpacing="0.20em">
            HEUTE
          </text>
          <text x="178" y="58" textAnchor="middle"
            fill="#DC8044" fontSize="6"
            fontFamily="var(--font-mono)" letterSpacing="0.20em">
            ZIEL
          </text>
        </svg>
      </Stage>
    </div>
  )
}

/* ── 03 Manövrieren — Checkliste die durchläuft ───────────────────────── */

function ManoeuvrierenVisual() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15%' })
  const reduceMotion = useReducedMotion()

  const items = [
    { label: 'Setup',   delay: 0.4 },
    { label: 'Build',   delay: 0.9 },
    { label: 'Review',  delay: 1.4 },
    { label: 'Deploy',  delay: 1.9 },
  ]

  return (
    <div ref={ref}>
      <Stage>
        <div className="absolute inset-0 flex items-center justify-center" style={{ padding: 14 }}>
          <div
            style={{
              width: '100%',
              maxWidth: 200,
              padding: '12px 14px',
              background: 'rgba(28, 27, 24, 0.92)',
              border: '1px solid rgba(245, 245, 250, 0.14)',
              borderRadius: 8,
              backdropFilter: 'blur(10px)',
              boxShadow: '0 12px 24px rgba(0, 0, 0, 0.4)',
            }}
          >
            <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
              <p className="font-mono uppercase"
                style={{ fontSize: 6, letterSpacing: '0.20em', color: 'rgba(245, 245, 250, 0.45)' }}>
                Sprint 03
              </p>
              <motion.span
                className="font-mono"
                style={{ fontSize: 7, color: '#DC8044', letterSpacing: '0.06em' }}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : undefined}
                transition={{ delay: 2.5 }}
              >
                4 / 4
              </motion.span>
            </div>

            {items.map((it, i) => (
              <motion.div
                key={it.label}
                initial={{ opacity: 0, x: -6 }}
                animate={inView ? { opacity: 1, x: 0 } : undefined}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.4, delay: it.delay, ease: EASE }}
                className="flex items-center gap-2"
                style={{
                  padding: '5px 6px',
                  marginTop: i === 0 ? 0 : 4,
                  borderRadius: 4,
                  background: 'rgba(245, 245, 250, 0.03)',
                  border: '1px solid rgba(245, 245, 250, 0.06)',
                }}
              >
                <motion.span
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={inView ? { scale: 1, opacity: 1 } : undefined}
                  transition={reduceMotion ? { duration: 0 } : { duration: 0.3, delay: it.delay + 0.2, ease: EASE }}
                  style={{
                    width: 12, height: 12,
                    borderRadius: 3,
                    background: 'rgba(40, 200, 64, 0.18)',
                    border: '1px solid rgba(40, 200, 64, 0.55)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Check size={8} strokeWidth={2.6} style={{ color: '#28C840' }} />
                </motion.span>
                <span className="font-mono"
                  style={{ fontSize: 8, color: 'rgba(245, 245, 250, 0.78)', letterSpacing: '0.02em' }}>
                  {it.label}
                </span>
                <motion.span
                  className="font-mono"
                  style={{
                    marginLeft: 'auto',
                    fontSize: 6,
                    color: 'rgba(245, 245, 250, 0.32)',
                    letterSpacing: '0.10em',
                  }}
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : undefined}
                  transition={reduceMotion ? { duration: 0 } : { duration: 0.3, delay: it.delay + 0.3 }}
                >
                  DONE
                </motion.span>
              </motion.div>
            ))}
          </div>
        </div>
      </Stage>
    </div>
  )
}

/* ── 04 Übergabe — Doc-Stack + Key ────────────────────────────────────── */

function UebergabeVisual() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15%' })
  const reduceMotion = useReducedMotion()

  return (
    <div ref={ref}>
      <Stage>
        <svg viewBox="0 0 220 132" style={{ width: '100%', height: '100%' }}>
          <defs>
            <radialGradient id="ueber-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(220, 128, 68, 0.4)" />
              <stop offset="100%" stopColor="rgba(220, 128, 68, 0)" />
            </radialGradient>
          </defs>

          <circle cx="110" cy="66" r="44" fill="url(#ueber-glow)" />

          {/* Doc-Stack (links) — 3 Cards gestapelt */}
          {[
            { x: 36, y: 64, rot: -6, delay: 0.2 },
            { x: 44, y: 52, rot: -2, delay: 0.4 },
            { x: 52, y: 40, rot:  3, delay: 0.6 },
          ].map((d, i) => (
            <motion.g
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.5, delay: d.delay, ease: EASE }}
              style={{ transformOrigin: `${d.x + 22}px ${d.y + 28}px` }}
            >
              <g transform={`rotate(${d.rot} ${d.x + 22} ${d.y + 28})`}>
                <rect x={d.x} y={d.y} width="44" height="56" rx="3"
                  fill="rgba(28, 27, 24, 0.92)"
                  stroke="rgba(220, 128, 68, 0.40)" strokeWidth="1"
                />
                {/* Mini-Lines */}
                {[8, 16, 24, 36].map((dy, j) => (
                  <rect
                    key={j}
                    x={d.x + 6} y={d.y + dy}
                    width={dy === 36 ? 18 : (j === 2 ? 24 : 32)}
                    height="1.4"
                    fill="rgba(245, 245, 250, 0.30)"
                  />
                ))}
                {/* Doc-Icon */}
                <foreignObject x={d.x + 6} y={d.y + 42} width="10" height="10">
                  <FileText size={9} strokeWidth={1.6} style={{ color: 'rgba(220, 128, 68, 0.85)' }} />
                </foreignObject>
              </g>
            </motion.g>
          ))}

          {/* Übergabe-Arrow */}
          {!reduceMotion ? (
            <motion.path
              d="M 110 66 L 154 66"
              fill="none"
              stroke="#DC8044"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="3 3"
              initial={{ pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : undefined}
              transition={{ duration: 0.9, delay: 1.0, ease: 'easeInOut' }}
            />
          ) : (
            <path d="M 110 66 L 154 66" fill="none" stroke="#DC8044"
              strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3" />
          )}
          <motion.polygon
            points="154,62 162,66 154,70"
            fill="#DC8044"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : undefined}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.3, delay: 1.9 }}
          />

          {/* Team-Empfänger Box rechts */}
          <motion.g
            initial={{ opacity: 0, scale: 0.85 }}
            animate={inView ? { opacity: 1, scale: 1 } : undefined}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.6, delay: 2.1, ease: EASE }}
            style={{ transformOrigin: '184px 66px' }}
          >
            <rect x="170" y="44" width="40" height="44" rx="5"
              fill="rgba(15, 14, 12, 0.95)"
              stroke="rgba(220, 128, 68, 0.55)" strokeWidth="1.2"
            />
            <foreignObject x="180" y="50" width="20" height="20">
              <div className="flex items-center justify-center" style={{ width: 20, height: 20 }}>
                <KeyRound size={16} strokeWidth={1.8} style={{ color: 'var(--brand)' }} />
              </div>
            </foreignObject>
            <text x="190" y="82" textAnchor="middle"
              fill="rgba(245, 245, 250, 0.7)" fontSize="5"
              fontFamily="var(--font-mono)" letterSpacing="0.18em">
              TEAM
            </text>
          </motion.g>

          {!reduceMotion && (
            <motion.circle
              cx="190" cy="60" r="5"
              fill="none"
              stroke="#DC8044"
              strokeWidth="0.8"
              animate={{ r: [6, 18], opacity: [0.55, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: 2.4, ease: 'easeOut' }}
            />
          )}

          {/* Eyebrow */}
          <text x="210" y="14" textAnchor="end"
            fill="rgba(245, 245, 250, 0.45)" fontSize="6"
            fontFamily="var(--font-mono)" letterSpacing="0.22em">
            HANDOVER
          </text>
        </svg>
      </Stage>
    </div>
  )
}
