'use client'

import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/cn'

interface EyebrowProps {
  num?:       string
  className?: string
  children:   React.ReactNode
  /** Static — kein In-View-Trigger. Default false. */
  static?:    boolean
}

const EASE = [0.16, 1, 0.3, 1] as const

/**
 * Eyebrow im Subpage-Niveau: Number + Mittel-Dot + Text, alles in Brand-Color,
 * fontSize 11px, letterSpacing 0.20em — gleicher Stil wie in den
 * Leistungs-Subpages (MarkeShowcase, M365Showcase usw.).
 *
 * Animation: 1px Accent-Line wächst von links rein, Text fadet zeitversetzt
 * darunter. Respektiert prefers-reduced-motion. Per `static` deaktivierbar
 * wenn die Parent-Section eigene Reveal-Logik mitbringt.
 */
export default function Eyebrow({
  num,
  className,
  children,
  static: isStatic,
}: EyebrowProps) {
  const reduceMotion = useReducedMotion()

  if (isStatic) {
    return (
      <p
        className={cn('font-mono uppercase', className)}
        style={{
          fontSize: '11px',
          letterSpacing: '0.20em',
          color: 'var(--brand)',
        }}
      >
        {num && <>{num} · </>}
        {children}
      </p>
    )
  }

  return (
    <motion.div
      className={cn('font-mono uppercase inline-flex items-center gap-2.5', className)}
      style={{
        fontSize: '11px',
        letterSpacing: '0.20em',
        color: 'var(--brand)',
        width: 'fit-content',
      }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-15%' }}
      variants={{
        hidden: {},
        show:   { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
      }}
    >
      <motion.span
        aria-hidden
        className="inline-block"
        style={{
          height: 1,
          background: 'currentColor',
          transformOrigin: 'left center',
          boxShadow: '0 0 6px rgba(220, 128, 68, 0.5)',
        }}
        variants={{
          hidden: { width: 0, opacity: 0 },
          show:   {
            width: 28,
            opacity: 1,
            transition: reduceMotion
              ? { duration: 0 }
              : { duration: 0.55, ease: EASE },
          },
        }}
      />
      <motion.span
        className="inline-block"
        variants={{
          hidden: { opacity: 0, x: -4 },
          show:   {
            opacity: 1,
            x: 0,
            transition: reduceMotion
              ? { duration: 0 }
              : { duration: 0.45, ease: EASE },
          },
        }}
      >
        {num && <>{num} · </>}
        {children}
      </motion.span>
    </motion.div>
  )
}
