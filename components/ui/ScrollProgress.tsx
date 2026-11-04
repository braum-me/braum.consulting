'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'

/**
 * Fixed Scroll-Progress-Bar oben am Viewport-Edge.
 *
 * Implementierung als rAF-Polling-Loop statt scroll-event-driven: iOS-Safari
 * feuert während Momentum-Scrolls KEINE scroll-Events am window, die Events
 * kommen erst nach Stillstand. Mit rAF lesen wir scrollY pro Frame und
 * bekommen so eine wirklich synchrone Bar — auch bei schnellem Flick auf
 * mobile.
 *
 * Cost: ein scrollY-Read + 1 setState (nur bei Wertänderung) pro Frame.
 * Browser pausiert rAF wenn Tab nicht sichtbar — kein Battery-Drain.
 */
export default function ScrollProgress() {
  const reduced = useReducedMotion()
  const [progress, setProgress] = useState(0)
  const lastValue = useRef<number>(-1)

  useEffect(() => {
    if (typeof window === 'undefined') return

    let raf = 0

    const tick = () => {
      const y    = window.scrollY
      const docH = document.documentElement.scrollHeight - window.innerHeight
      const next = docH > 0 ? Math.min(1, y / docH) : 0

      // Nur setState wenn sich der Wert messbar geändert hat — verhindert
      // unnötige Re-Renders bei Stillstand.
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
  }, [])

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        zIndex: 60, // über Nav (50), unter Cursor (50) — Nav-Edge bleibt sichtbar
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${progress * 100}%`,
          background:
            'linear-gradient(90deg, rgba(220, 128, 68, 0.4) 0%, var(--accent) 60%, var(--brand) 100%)',
          boxShadow: '0 0 12px rgba(220, 128, 68, 0.6)',
          transformOrigin: 'left center',
          transition: reduced ? 'none' : 'width 80ms linear',
          willChange: 'width',
        }}
      />
    </div>
  )
}
