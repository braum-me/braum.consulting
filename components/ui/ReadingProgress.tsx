'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'

/**
 * Reading-Progress-Bar scoped auf ein konkretes Element (typischerweise
 * den Article-Wrapper auf /cases/[id]). Fillt von 0% bis 100% während
 * der Article-Inhalt durchgescrollt wird.
 *
 * Position: fixed top, knapp unter der globalen ScrollProgress-Linie
 * (die 2px oben). Diese ist 1px dünner und subtler, um nicht zu doppeln.
 *
 * Nimmt eine CSS-Selector-String als Prop, sucht das Element erst nach
 * Mount. Falls nicht gefunden: rendert nichts.
 */
export default function ReadingProgress({
  targetSelector,
  topOffset = 2,
}: {
  targetSelector: string
  /** px-Offset vom Viewport-Top, default 2 (unter der globalen ScrollProgress) */
  topOffset?: number
}) {
  const reduced = useReducedMotion()
  const [progress, setProgress] = useState(0)
  const [ready,    setReady]    = useState(false)
  const lastValue = useRef<number>(-1)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const target = document.querySelector<HTMLElement>(targetSelector)
    if (!target) return

    setReady(true)

    // rAF-Polling-Loop statt scroll-events: iOS-Safari unterdrückt
    // scroll-Events während Momentum-Scrolls, sodass event-driven Bars
    // erst nach Stillstand updaten. Mit rAF läuft die Bar synchron mit
    // dem Frame, auch bei schnellen Mobile-Flicks.
    let raf = 0

    const tick = () => {
      const rect  = target.getBoundingClientRect()
      const viewH = window.innerHeight
      const total = rect.height - viewH
      const next =
        total <= 0
          ? (rect.bottom < viewH ? 1 : 0)
          : Math.max(0, Math.min(1, -rect.top / total))

      if (Math.abs(next - lastValue.current) > 0.0005) {
        lastValue.current = next
        setProgress(next)
      }
      raf = window.requestAnimationFrame(tick)
    }

    raf = window.requestAnimationFrame(tick)

    return () => {
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [targetSelector])

  if (!ready) return null

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        top: `${topOffset}px`,
        left: 0,
        right: 0,
        height: '1px',
        zIndex: 59,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${progress * 100}%`,
          background: 'rgba(220, 128, 68, 0.55)',
          transition: reduced ? 'none' : 'width 80ms linear',
          willChange: 'width',
        }}
      />
    </div>
  )
}
