'use client'

/**
 * Drift-Dashboard für die Problem-Section auf der Mainpage.
 *
 * Visuelles Statement zum Headline „Diese vier Probleme sehe ich immer
 * wieder": ein dystopisches Mini-Cockpit, das den Schwebezustand zeigt —
 * 4 Symptom-Tiles, blinkende Error-Lights, gebrochene Progress-Line.
 *
 * Bewusst NICHT in Brand-Warm — leicht entsättigt mit cooleren Tönen +
 * Error-Red-Akzent, sodass es als Kontrast-Spiegel zum klaren Lotsen-Prinzip
 * (das in der Process-Section folgt) liest.
 */

import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import {
  HelpCircle, Layers, MessageSquare, FileX,
  AlertTriangle,
} from 'lucide-react'

const EASE = [0.16, 1, 0.3, 1] as const

export function ProblemDriftVisual() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15%' })
  const reduceMotion = useReducedMotion()

  const tiles = [
    { Icon: HelpCircle,    label: 'Brand',     state: 'undefined',  variant: 'warn'  as const, delay: 0.2 },
    { Icon: Layers,        label: 'Tools',     state: 'unsorted',   variant: 'mute'  as const, delay: 0.35 },
    { Icon: MessageSquare, label: 'Prompts',   state: 'no-process', variant: 'error' as const, delay: 0.5 },
    { Icon: FileX,         label: 'Übergabe',  state: 'missing',    variant: 'error' as const, delay: 0.65 },
  ]

  return (
    <div ref={ref}>
      <div
        className="relative w-full overflow-hidden"
        style={{
          aspectRatio: '16 / 5',
          maxHeight: 320,
          minHeight: 200,
          borderRadius: 14,
          border: '1px solid rgba(245, 245, 250, 0.10)',
          background:
            'radial-gradient(90% 110% at 50% 50%, rgba(180, 60, 50, 0.10) 0%, rgba(15, 14, 12, 0.85) 65%, var(--bg-base) 100%)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.45)',
        }}
      >
        {/* Noise + scanlines for dashboard feel */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'var(--noise-svg)',
            mixBlendMode: 'overlay',
            opacity: 0.10,
          }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(245, 245, 250, 0.025) 3px, rgba(245, 245, 250, 0.025) 4px)',
            opacity: 0.5,
          }}
        />

        {/* Watermark "DRIFT" Hintergrund */}
        <span
          aria-hidden
          className="pointer-events-none absolute select-none font-display font-black"
          style={{
            left: '50%',
            top: '50%',
            translate: '-50% -50%',
            fontSize: 'clamp(80px, 14vw, 180px)',
            lineHeight: 1,
            letterSpacing: '0.04em',
            color: 'transparent',
            WebkitTextStroke: '1px rgba(220, 80, 60, 0.16)',
            zIndex: 1,
          }}
        >
          DRIFT
        </span>

        {/* Top status-bar */}
        <div
          className="absolute inset-x-0 top-0 flex items-center justify-between px-4 py-2.5"
          style={{
            background: 'rgba(15, 14, 12, 0.72)',
            borderBottom: '1px solid rgba(245, 245, 250, 0.08)',
            backdropFilter: 'blur(10px)',
            zIndex: 5,
          }}
        >
          {/* Traffic Lights */}
          <div className="flex items-center gap-1.5">
            <Light color="rgba(255, 95, 86, 0.78)" pulse={!reduceMotion} delay={0} />
            <Light color="rgba(255, 95, 86, 0.78)" pulse={!reduceMotion} delay={0.4} />
            <Light color="rgba(255, 189, 46, 0.85)" pulse={!reduceMotion} delay={0.8} />
          </div>
          {/* Title */}
          <div className="flex items-center gap-2">
            <motion.span
              animate={reduceMotion ? {} : { opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <AlertTriangle size={10} strokeWidth={1.8} style={{ color: 'rgba(255, 95, 86, 0.85)' }} />
            </motion.span>
            <span
              className="font-mono uppercase"
              style={{
                fontSize: 9,
                letterSpacing: '0.22em',
                color: 'rgba(245, 245, 250, 0.55)',
              }}
            >
              Status · unclear
            </span>
          </div>
          {/* Counter */}
          <div className="flex items-center gap-1.5">
            <span
              className="font-mono uppercase"
              style={{
                fontSize: 8,
                letterSpacing: '0.18em',
                color: 'rgba(245, 245, 250, 0.35)',
              }}
            >
              Issues
            </span>
            <motion.span
              className="font-mono font-bold"
              style={{
                fontSize: 11,
                color: 'rgba(255, 95, 86, 0.88)',
                letterSpacing: '0.04em',
              }}
              animate={reduceMotion ? {} : { opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              17
            </motion.span>
          </div>
        </div>

        {/* 4 Symptom-Tiles in der Mitte */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ paddingTop: 38, paddingBottom: 28, paddingLeft: 16, paddingRight: 16, zIndex: 3 }}
        >
          <div
            className="grid w-full"
            style={{
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 'clamp(8px, 1.2vw, 16px)',
              maxWidth: 720,
            }}
          >
            {tiles.map((t, i) => (
              <DriftTile
                key={t.label}
                Icon={t.Icon}
                label={t.label}
                state={t.state}
                variant={t.variant}
                delay={t.delay}
                inView={inView}
                reduceMotion={!!reduceMotion}
                index={i}
              />
            ))}
          </div>
        </div>

        {/* Bottom — gebrochene Progress-Line */}
        <div
          className="absolute inset-x-0 bottom-0 px-4 py-2"
          style={{
            background: 'rgba(15, 14, 12, 0.72)',
            borderTop: '1px solid rgba(245, 245, 250, 0.08)',
            backdropFilter: 'blur(10px)',
            zIndex: 5,
          }}
        >
          <div className="flex items-center gap-3">
            <span
              className="font-mono uppercase"
              style={{
                fontSize: 8,
                letterSpacing: '0.18em',
                color: 'rgba(245, 245, 250, 0.35)',
              }}
            >
              Roadmap
            </span>
            <div
              className="relative flex-1"
              style={{
                height: 3,
                borderRadius: 2,
                background: 'rgba(245, 245, 250, 0.06)',
                overflow: 'hidden',
              }}
            >
              <motion.span
                className="absolute inset-y-0 left-0"
                style={{
                  width: '38%',
                  background:
                    'linear-gradient(90deg, rgba(220, 80, 60, 0.7), rgba(220, 80, 60, 0.35))',
                  borderRadius: 2,
                }}
                initial={{ width: '0%' }}
                animate={inView ? { width: '38%' } : undefined}
                transition={reduceMotion ? { duration: 0 } : { duration: 1.2, delay: 0.6, ease: 'easeOut' }}
              />
              {/* Broken-Mark — gestrichelte Continuation die ins Nichts geht */}
              <span
                aria-hidden
                className="absolute inset-y-0"
                style={{
                  left: '42%',
                  width: '20%',
                  borderTop: '1.5px dashed rgba(220, 80, 60, 0.45)',
                  top: '50%',
                  height: 0,
                }}
              />
            </div>
            <span
              className="font-mono"
              style={{
                fontSize: 9,
                color: 'rgba(255, 95, 86, 0.75)',
                letterSpacing: '0.04em',
              }}
            >
              ?? / ??
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Drift-Tile ──────────────────────────────────────────────────────── */

function DriftTile({
  Icon,
  label,
  state,
  variant,
  delay,
  inView,
  reduceMotion,
  index,
}: {
  Icon:         typeof HelpCircle
  label:        string
  state:        string
  variant:      'warn' | 'mute' | 'error'
  delay:        number
  inView:       boolean
  reduceMotion: boolean
  index:        number
}) {
  const accentColor =
    variant === 'error'
      ? 'rgba(255, 95, 86, 0.78)'
      : variant === 'warn'
        ? 'rgba(255, 189, 46, 0.78)'
        : 'rgba(245, 245, 250, 0.42)'

  const borderColor =
    variant === 'error'
      ? 'rgba(255, 95, 86, 0.35)'
      : variant === 'warn'
        ? 'rgba(255, 189, 46, 0.30)'
        : 'rgba(245, 245, 250, 0.10)'

  // Tilt-Versatz: Tiles sind leicht ungeordnet/gekippt (chaos-feel)
  const tilt = [(-1.5), (1.2), (-0.8), (2.0)][index] ?? 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, rotate: 0 }}
      animate={inView ? { opacity: 1, y: 0, rotate: tilt } : undefined}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.5, delay, ease: EASE }}
      style={{
        position: 'relative',
        padding: '10px 8px',
        background:
          'linear-gradient(145deg, rgba(28, 27, 24, 0.85), rgba(15, 14, 12, 0.92))',
        border: `1px dashed ${borderColor}`,
        borderRadius: 6,
        boxShadow: '0 10px 22px rgba(0, 0, 0, 0.40)',
        minHeight: 70,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* Status-Dot */}
      <div className="flex items-center justify-between">
        <Icon size={12} strokeWidth={1.6} style={{ color: 'rgba(245, 245, 250, 0.55)' }} />
        <motion.span
          style={{
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: accentColor,
            boxShadow: `0 0 6px ${accentColor}`,
          }}
          animate={reduceMotion ? {} : { opacity: variant === 'error' ? [1, 0.3, 1] : [0.9, 0.6, 0.9] }}
          transition={{
            duration: variant === 'error' ? 0.9 : 1.6,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: index * 0.2,
          }}
        />
      </div>

      <div>
        <p
          className="font-mono uppercase"
          style={{
            fontSize: 7,
            letterSpacing: '0.18em',
            color: 'rgba(245, 245, 250, 0.65)',
          }}
        >
          {label}
        </p>
        <p
          className="font-mono"
          style={{
            fontSize: 8,
            color: accentColor,
            letterSpacing: '0.04em',
            marginTop: 2,
          }}
        >
          {state}
        </p>
      </div>
    </motion.div>
  )
}

/* ── Traffic-Light Dot ───────────────────────────────────────────────── */

function Light({
  color,
  pulse,
  delay,
}: {
  color: string
  pulse: boolean
  delay: number
}) {
  return (
    <motion.span
      style={{
        display: 'inline-block',
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: color,
        boxShadow: `0 0 6px ${color}`,
      }}
      animate={pulse ? { opacity: [1, 0.45, 1] } : undefined}
      transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay }}
    />
  )
}
