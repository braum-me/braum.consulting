'use client'

/**
 * Parametrisierter TileCluster für die 6 Stack-Säulen auf /ueber.
 *
 * Ein gemeinsames Pattern (1 primäre, 2 satellite Glass-Tiles) wird pro
 * Säule mit unterschiedlichen lucide-Icons + Tool-Labels gefüllt.
 * Konsistente Sprache zu den ServiceVisuals und ProcessStepVisuals.
 *
 * Größe: 5:2 aspect ratio, full-width der Card, max ~360×144.
 */

import { useEffect, useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import type { LucideIcon } from 'lucide-react'

const EASE = [0.16, 1, 0.3, 1] as const

export interface StackPillarTile {
  Icon:  LucideIcon
  label: string
}

export interface StackPillarVisualProps {
  primary:   StackPillarTile
  secondary: StackPillarTile
  tertiary:  StackPillarTile
  /** Accent tint — `brand` (warm) ist default, `cool` (kühler glow) und
   *  `success` (grünstichig) variieren den Hintergrund-Glow. */
  accent?:   'brand' | 'cool' | 'success'
}

export function StackPillarVisual({
  primary,
  secondary,
  tertiary,
  accent = 'brand',
}: StackPillarVisualProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15%' })
  const reduceMotion = useReducedMotion()

  const glow =
    accent === 'cool'
      ? 'radial-gradient(80% 100% at 50% 50%, rgba(120, 160, 220, 0.16) 0%, rgba(15, 14, 12, 0.55) 60%, var(--bg-base) 100%)'
      : accent === 'success'
        ? 'radial-gradient(80% 100% at 50% 50%, rgba(40, 200, 64, 0.14) 0%, rgba(15, 14, 12, 0.55) 60%, var(--bg-base) 100%)'
        : 'radial-gradient(80% 100% at 50% 50%, rgba(220, 128, 68, 0.18) 0%, rgba(15, 14, 12, 0.55) 60%, var(--bg-base) 100%)'

  return (
    <div ref={ref}>
      <div
        className="relative w-full overflow-hidden"
        style={{
          aspectRatio: '5 / 2',
          borderRadius: 10,
          border: '1px solid var(--border-subtle)',
          background: glow,
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

        {/* Pulse-Ring background hinter primary */}
        {!reduceMotion && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute"
            style={{
              left: '50%',
              top: '50%',
              translate: '-50% -50%',
              width: 70,
              height: 70,
              borderRadius: '50%',
              border: '1px solid rgba(220, 128, 68, 0.45)',
            }}
            animate={inView ? { scale: [1, 1.6], opacity: [0.65, 0] } : undefined}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
          />
        )}

        {/* Primary Tile (center) */}
        <FloatTile
          inView={inView}
          reduceMotion={!!reduceMotion}
          delay={0.2}
          floatDelay={0}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            translate: '-50% -50%',
            zIndex: 3,
          }}
        >
          <div
            style={{
              width: 96,
              padding: '10px 12px',
              background:
                'linear-gradient(145deg, rgba(245, 245, 248, 0.18), rgba(220, 128, 68, 0.10))',
              border: '1px solid rgba(245, 245, 250, 0.22)',
              borderRadius: 10,
              backdropFilter: 'blur(20px)',
              boxShadow:
                '0 16px 36px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.24)',
            }}
          >
            <primary.Icon
              size={22}
              strokeWidth={1.5}
              style={{ color: 'var(--brand)' }}
            />
            <p
              className="font-mono uppercase"
              style={{
                marginTop: 8,
                fontSize: 8,
                letterSpacing: '0.16em',
                color: 'rgba(245, 245, 250, 0.78)',
              }}
            >
              {primary.label}
            </p>
          </div>
        </FloatTile>

        {/* Secondary Tile (top-right satellite) */}
        <FloatTile
          inView={inView}
          reduceMotion={!!reduceMotion}
          delay={0.4}
          floatDelay={0.6}
          style={{
            position: 'absolute',
            right: '6%',
            top: '12%',
            zIndex: 4,
          }}
        >
          <div
            style={{
              padding: '7px 9px',
              background: 'rgba(28, 27, 24, 0.92)',
              border: '1px solid rgba(245, 245, 250, 0.18)',
              borderRadius: 8,
              backdropFilter: 'blur(16px)',
              boxShadow: '0 12px 26px rgba(0, 0, 0, 0.45)',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <secondary.Icon
              size={12}
              strokeWidth={1.6}
              style={{ color: 'rgba(220, 128, 68, 0.85)' }}
            />
            <span
              className="font-mono uppercase"
              style={{
                fontSize: 7,
                letterSpacing: '0.14em',
                color: 'rgba(245, 245, 250, 0.78)',
              }}
            >
              {secondary.label}
            </span>
          </div>
        </FloatTile>

        {/* Tertiary Tile (bottom-left satellite) */}
        <FloatTile
          inView={inView}
          reduceMotion={!!reduceMotion}
          delay={0.55}
          floatDelay={1.1}
          style={{
            position: 'absolute',
            left: '6%',
            bottom: '12%',
            zIndex: 4,
          }}
        >
          <div
            style={{
              padding: '7px 9px',
              background: 'rgba(28, 27, 24, 0.92)',
              border: '1px solid rgba(245, 245, 250, 0.18)',
              borderRadius: 8,
              backdropFilter: 'blur(16px)',
              boxShadow: '0 12px 26px rgba(0, 0, 0, 0.45)',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <tertiary.Icon
              size={12}
              strokeWidth={1.6}
              style={{ color: 'rgba(220, 128, 68, 0.85)' }}
            />
            <span
              className="font-mono uppercase"
              style={{
                fontSize: 7,
                letterSpacing: '0.14em',
                color: 'rgba(245, 245, 250, 0.78)',
              }}
            >
              {tertiary.label}
            </span>
          </div>
        </FloatTile>

        {/* Decorative grid hint */}
        <svg
          className="pointer-events-none absolute inset-0"
          style={{ opacity: 0.08 }}
          aria-hidden
        >
          <defs>
            <pattern id="stack-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(245, 245, 250, 1)" strokeWidth="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#stack-grid)" />
        </svg>

        {/* Connection-Lines */}
        <svg
          className="pointer-events-none absolute inset-0"
          viewBox="0 0 500 200"
          preserveAspectRatio="none"
          aria-hidden
        >
          <line
            x1="80" y1="50"
            x2="250" y2="100"
            stroke="rgba(220, 128, 68, 0.20)"
            strokeWidth="0.5"
            strokeDasharray="2 3"
          />
          <line
            x1="420" y1="150"
            x2="250" y2="100"
            stroke="rgba(220, 128, 68, 0.20)"
            strokeWidth="0.5"
            strokeDasharray="2 3"
          />
        </svg>
      </div>
    </div>
  )
}

/* ── Float-Wrapper ───────────────────────────────────────────────────── */

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
      const y = Math.sin(t * 0.85) * 3
      const r = Math.sin(t * 0.6) * 0.5
      el.style.transform = `translateY(${y}px) rotate(${r}deg)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduceMotion, floatDelay])

  return (
    <motion.div
      style={style}
      initial={reduceMotion ? false : { opacity: 0, scale: 0.85, y: 12 }}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : undefined}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      <div ref={ref}>{children}</div>
    </motion.div>
  )
}
