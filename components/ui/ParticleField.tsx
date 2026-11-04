'use client'

import { useEffect, useRef } from 'react'

/**
 * Dezentes Partikel-Feld auf Canvas-2D. Brownian motion + sanfte
 * Mouse-Attraction im 200px-Radius. Atmosphärisch, nicht dominant.
 *
 * Deaktiviert auf:
 *   - prefers-reduced-motion: reduce
 *   - Touch-only Devices (pointer: coarse)
 *   - Viewport-Breite < 768px
 *   - Tab inaktiv (Document Visibility API)
 *   - Canvas außerhalb Viewport (IntersectionObserver)
 *
 * Performance: 60-80 Partikel, requestAnimationFrame, devicePixelRatio,
 * mit Resize-Debounce.
 */
export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Disabling-Bedingungen
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(pointer: coarse)').matches) return
    if (window.innerWidth < 1024) return  // Desktop only, schont mobile + tablet

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    interface Particle {
      x:  number
      y:  number
      vx: number
      vy: number
      r:  number
    }

    let dpr = Math.max(window.devicePixelRatio || 1, 1)
    let width = 0
    let height = 0
    let particles: Particle[] = []
    let raf = 0
    let isRunning = true
    let isVisible = true
    let mouseX = -9999
    let mouseY = -9999

    const COUNT = 70
    const ATTRACT_RADIUS = 200
    const ATTRACT_RADIUS_SQ = ATTRACT_RADIUS * ATTRACT_RADIUS

    function resize() {
      if (!canvas || !ctx) return
      dpr = Math.max(window.devicePixelRatio || 1, 1)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.scale(dpr, dpr)
    }

    function seed() {
      particles = Array.from({ length: COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: 1 + Math.random() * 1.2,
      }))
    }

    function step() {
      if (!ctx) return
      ctx.clearRect(0, 0, width, height)

      for (const p of particles) {
        // Brownian drift
        p.vx += (Math.random() - 0.5) * 0.04
        p.vy += (Math.random() - 0.5) * 0.04

        // Mouse attraction wenn im Radius
        const dx = mouseX - p.x
        const dy = mouseY - p.y
        const distSq = dx * dx + dy * dy
        let glow = 0
        if (distSq < ATTRACT_RADIUS_SQ) {
          const force = (1 - distSq / ATTRACT_RADIUS_SQ) * 0.04
          p.vx += dx * force * 0.05
          p.vy += dy * force * 0.05
          glow = 1 - Math.sqrt(distSq) / ATTRACT_RADIUS
        }

        // Speed-Cap (langsam halten)
        const speed = Math.hypot(p.vx, p.vy)
        if (speed > 0.5) {
          p.vx = (p.vx / speed) * 0.5
          p.vy = (p.vy / speed) * 0.5
        }

        // Friction
        p.vx *= 0.985
        p.vy *= 0.985

        p.x += p.vx
        p.y += p.vy

        // Wrap edges
        if (p.x < -10) p.x = width + 10
        if (p.x > width + 10) p.x = -10
        if (p.y < -10) p.y = height + 10
        if (p.y > height + 10) p.y = -10

        // Render
        const baseAlpha = 0.16 + glow * 0.30
        const radius = p.r + glow * 1.5
        ctx.fillStyle = `rgba(220, 128, 68, ${baseAlpha})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2)
        ctx.fill()
      }

      if (isRunning && isVisible) {
        raf = requestAnimationFrame(step)
      }
    }

    function start() {
      if (!isRunning) return
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(step)
    }

    function onMouseMove(e: MouseEvent) {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    function onMouseLeave() {
      mouseX = -9999
      mouseY = -9999
    }

    function onVisibility() {
      if (document.hidden) {
        isVisible = false
        cancelAnimationFrame(raf)
      } else {
        isVisible = true
        start()
      }
    }

    // Resize-Debounce
    let resizeT: ReturnType<typeof setTimeout> | null = null
    function onResize() {
      if (resizeT) clearTimeout(resizeT)
      resizeT = setTimeout(() => {
        resize()
        seed()
      }, 200)
    }

    // Setup
    resize()
    seed()
    start()

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mouseleave', onMouseLeave, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)

    // Cleanup
    return () => {
      isRunning = false
      cancelAnimationFrame(raf)
      if (resizeT) clearTimeout(resizeT)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.7,
      }}
    />
  )
}
