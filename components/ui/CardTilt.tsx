'use client'

import { useEffect } from 'react'

/**
 * Globaler Pointer-Listener der auf allen `.glass-card`-Elementen die
 * CSS-Vars --tilt-x / --tilt-y / --spot-x / --spot-y setzt.
 *
 *   Tilt:     max ±4° rotateX/Y basierend auf Cursor-Offset zum Center
 *   Spotlight: --spot-x/--spot-y zeigen auf Cursor-Position innerhalb der Card
 *
 * Disabled bei reduced-motion + touch-only. Ein einziger document-level
 * Listener, kein Listener-per-Card, kein Memory-Bloat.
 */
export default function CardTilt() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(pointer: coarse)').matches) return

    const TILT_MAX = 4 // degrees

    let activeCard: HTMLElement | null = null
    let rafId: number | null = null
    let pendingX = 0
    let pendingY = 0

    function commit() {
      rafId = null
      if (!activeCard) return
      const rect = activeCard.getBoundingClientRect()
      const relX = (pendingX - rect.left) / rect.width  // 0..1
      const relY = (pendingY - rect.top)  / rect.height // 0..1

      // Tilt: Auslenkung vom Center (-0.5..0.5) * 2 * TILT_MAX
      const tiltY = ((relX - 0.5) *  2) * TILT_MAX  // mouse right → tilt right
      const tiltX = ((relY - 0.5) * -2) * TILT_MAX  // mouse down → tilt back

      activeCard.style.setProperty('--tilt-x', `${tiltX}deg`)
      activeCard.style.setProperty('--tilt-y', `${tiltY}deg`)
      activeCard.style.setProperty('--spot-x', `${relX * 100}%`)
      activeCard.style.setProperty('--spot-y', `${relY * 100}%`)
    }

    function onPointerMove(e: PointerEvent) {
      const target = e.target as HTMLElement | null
      const card = target?.closest<HTMLElement>('.glass-card') ?? null

      if (card !== activeCard) {
        // Reset previous card
        if (activeCard) {
          activeCard.style.setProperty('--tilt-x', '0deg')
          activeCard.style.setProperty('--tilt-y', '0deg')
        }
        activeCard = card
      }
      if (!card) return

      pendingX = e.clientX
      pendingY = e.clientY
      if (rafId === null) {
        rafId = requestAnimationFrame(commit)
      }
    }

    function onPointerLeave() {
      if (!activeCard) return
      activeCard.style.setProperty('--tilt-x', '0deg')
      activeCard.style.setProperty('--tilt-y', '0deg')
      activeCard = null
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
        rafId = null
      }
    }

    document.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('pointerleave', onPointerLeave, { passive: true })

    return () => {
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerleave', onPointerLeave)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [])

  return null
}
