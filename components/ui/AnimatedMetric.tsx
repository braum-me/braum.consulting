'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'

/**
 * Animated Counter für Case-Metrics: parsed Numeric-Prefix aus String
 * ("€2,8 M" → 2,8 | "−47%" → 47 | "12 → 1" → 12 | "Pilot" → null),
 * animiert von 0 zum Zielwert, behält das ursprüngliche Format als
 * Suffix/Prefix bei. Strings ohne Numeric werden statisch gerendert.
 *
 * Triggert bei IntersectionObserver „enter" — also nicht beim Mount,
 * sondern wenn der Counter ins Viewport scrollt.
 */
export default function AnimatedMetric({
  value,
  duration = 1400,
  startDelay = 0,
  className,
  style,
}: {
  value:       string
  duration?:   number
  /** Wartet N ms nach Viewport-Enter, bevor der Counter losläuft.
   *  Praktisch wenn die Section eine Entrance-Animation hat. */
  startDelay?: number
  className?:  string
  style?:      React.CSSProperties
}) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState<string>(() =>
    reduced ? value : initialDisplay(value),
  )

  useEffect(() => {
    if (reduced) {
      setDisplay(value)
      return
    }
    const parsed = parseNumeric(value)
    if (!parsed) {
      setDisplay(value)
      return
    }

    const el = ref.current
    if (!el) return

    let started = false
    let delayTimer: ReturnType<typeof setTimeout> | null = null

    const runAnim = () => {
      const startTime = performance.now()
      const ease = (t: number) => 1 - Math.pow(1 - t, 3) // ease-out cubic

      const tick = (now: number) => {
        const t = Math.min(1, (now - startTime) / duration)
        const eased = ease(t)
        const v = parsed.target * eased
        setDisplay(formatWith(parsed, v))
        if (t < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }

    const startAnim = () => {
      if (started) return
      started = true
      if (startDelay > 0) {
        delayTimer = setTimeout(runAnim, startDelay)
      } else {
        runAnim()
      }
    }

    const io = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (e.isIntersecting) {
            startAnim()
            io.disconnect()
          }
        }
      },
      { threshold: 0.4 },
    )
    io.observe(el)

    return () => {
      io.disconnect()
      if (delayTimer) clearTimeout(delayTimer)
    }
  }, [value, duration, startDelay, reduced])

  return (
    <span ref={ref} className={className} style={style}>
      {display}
    </span>
  )
}

/* ── Numeric Parser ──────────────────────────────────────────────────── */

interface ParsedNumeric {
  prefix:   string
  suffix:   string
  target:   number
  decimals: number
  /** Komma- statt Punkt-Trenner im Original? */
  comma:    boolean
}

function parseNumeric(input: string): ParsedNumeric | null {
  // Match: optionalen prefix, dann Zahl (mit Komma oder Punkt), dann suffix
  // Beispiele:
  //   "€2,8 M"      → prefix="€", num="2,8", suffix=" M"
  //   "−47%"        → prefix="−", num="47",  suffix="%"
  //   "12 → 1"      → prefix="",  num="12",  suffix=" → 1"
  //   "Pilot"       → null
  const match = input.match(/^(\D*?)(\d+(?:[.,]\d+)?)(.*)$/)
  if (!match) return null

  const [, prefix, numStr, suffix] = match
  const comma = numStr.includes(',')
  const normalized = numStr.replace(',', '.')
  const target = parseFloat(normalized)
  if (Number.isNaN(target)) return null

  const dotIdx = normalized.indexOf('.')
  const decimals = dotIdx >= 0 ? normalized.length - dotIdx - 1 : 0

  return { prefix, suffix, target, decimals, comma }
}

function initialDisplay(value: string): string {
  const parsed = parseNumeric(value)
  if (!parsed) return value
  return formatWith(parsed, 0)
}

function formatWith(p: ParsedNumeric, v: number): string {
  const fixed = v.toFixed(p.decimals)
  const out = p.comma ? fixed.replace('.', ',') : fixed
  return `${p.prefix}${out}${p.suffix}`
}
