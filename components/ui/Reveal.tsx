'use client'

/**
 * Leichter Client-Wrapper für Scroll-Reveals.
 *
 * Lässt sich in Server-Components als Wrapper einsetzen — die Children
 * können beliebige Server- oder Client-Children sein. Animation: fade-in
 * + leichter y-Versatz wenn das Element in den Viewport scrollt.
 *
 * Verwendung:
 *   <Reveal>...</Reveal>            // default y-shift
 *   <Reveal y={20} delay={0.2} />   // angepasst
 *   <Reveal as="li">...</Reveal>    // als anderes Tag
 *
 * Stagger-Listen: Parent mit <RevealGroup>, Kinder mit <RevealItem>.
 */

import { motion, useReducedMotion, type Variants } from 'motion/react'
import type { ReactNode } from 'react'

const EASE = [0.16, 1, 0.3, 1] as const

interface RevealProps {
  children:  ReactNode
  /** Y-Offset in pixels, default 16 */
  y?:        number
  /** Delay in seconds, default 0 */
  delay?:    number
  /** Duration in seconds, default 0.6 */
  duration?: number
  /** Once-Trigger, default true */
  once?:     boolean
  /** Viewport margin, default '-10%' */
  margin?:   string
  className?: string
  style?:    React.CSSProperties
}

export default function Reveal({
  children,
  y = 16,
  delay = 0,
  duration = 0.6,
  once = true,
  margin = '-10%',
  className,
  style,
}: RevealProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      style={style}
      initial={reduceMotion ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: margin as `-${number}%` | `${number}%` }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

/* ── Stagger-Group + Item ─────────────────────────────────────────────── */

const GROUP_VARIANTS: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
}

const ITEM_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 14 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
}

interface RevealGroupProps {
  children:        ReactNode
  className?:      string
  style?:          React.CSSProperties
  once?:           boolean
  margin?:         string
  staggerDelay?:   number
  staggerInitial?: number
}

export function RevealGroup({
  children,
  className,
  style,
  once = true,
  margin = '-10%',
  staggerDelay = 0.08,
  staggerInitial = 0.05,
}: RevealGroupProps) {
  const variants: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren:   staggerInitial,
      },
    },
  }
  return (
    <motion.div
      className={className}
      style={style}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: margin as `-${number}%` | `${number}%` }}
    >
      {children}
    </motion.div>
  )
}

interface RevealItemProps {
  children:   ReactNode
  className?: string
  style?:     React.CSSProperties
  /** Y-Offset für die Animation, default 14 */
  y?:         number
}

export function RevealItem({ children, className, style, y }: RevealItemProps) {
  const variants: Variants = y !== undefined
    ? {
        hidden: { opacity: 0, y },
        show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
      }
    : ITEM_VARIANTS
  return (
    <motion.div className={className} style={style} variants={variants}>
      {children}
    </motion.div>
  )
}

void GROUP_VARIANTS
