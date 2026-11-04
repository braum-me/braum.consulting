'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'motion/react'

/**
 * Zählt eine Zahl beim Sichtbarwerden von `from` auf `to` hoch (easeOutCubic).
 * Glaubwürdigkeits-/Skill-Signal für Kennzahlen.
 *
 * - reduced-motion: zeigt sofort den Zielwert, keine Animation.
 * - SSR/Crawler/LLM-safe: initialer Render = `to` (der ECHTE Zielwert),
 *   identisch auf Server/Client (kein Hydration-Mismatch). Crawler und
 *   AI-Reader sehen nie "0+", sondern den realen Wert. Die Count-up-Animation
 *   (von `from` hoch) legt sich erst client-seitig im Viewport drüber.
 * - Deterministische Formatierung (kein locale-abhängiges toLocaleString).
 */
export default function CountUp({
  to,
  from = 0,
  duration = 1.6,
  decimals = 0,
  separator = '',
  prefix = '',
  suffix = '',
  className,
  style,
}: {
  to: number
  from?: number
  duration?: number
  decimals?: number
  /** Tausender-Trenner, z.B. '.' — leer = keiner */
  separator?: string
  prefix?: string
  suffix?: string
  className?: string
  style?: React.CSSProperties
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15%' })
  const reduce = useReducedMotion()
  // Initial = Zielwert: SSR-HTML enthält den echten Wert (Crawler/LLM-safe),
  // Client-Erstrender stimmt überein (kein Hydration-Mismatch).
  const [val, setVal] = useState(to)

  useEffect(() => {
    // Nicht im Viewport oder reduced-motion: Zielwert bleibt stehen.
    if (!inView || reduce) return

    let raf = 0
    let startTs = 0
    const step = (ts: number) => {
      if (!startTs) startTs = ts
      const t = Math.min(1, (ts - startTs) / (duration * 1000))
      const eased = 1 - Math.pow(1 - t, 3)
      setVal(from + (to - from) * eased)
      if (t < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [inView, reduce, to, from, duration])

  const fixed = val.toFixed(decimals)
  const display = separator
    ? fixed.replace(/\B(?=(\d{3})+(?!\d))/g, separator)
    : fixed

  return (
    <span ref={ref} className={className} style={style}>
      {prefix}{display}{suffix}
    </span>
  )
}
