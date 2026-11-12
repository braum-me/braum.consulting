'use client'

import { useEffect } from 'react'

/**
 * Pausiert Endlos-Animationen in Sections außerhalb des Viewports.
 *
 * Audit 2026-11: Auf der Startseite liefen 25 Endlos-Animationen (Glow-Blobs,
 * Gradients, Pulse), 18 davon außerhalb des sichtbaren Bereichs. Sie kosten
 * GPU/Compositor-Zeit, ohne dass jemand sie sieht.
 *
 * - CSS-Animationen: `data-offscreen` an der Section, CSS in globals.css setzt
 *   `animation-play-state: paused` für alle Nachfahren.
 * - WAAPI-Animationen (z. B. motion mit `repeat: Infinity`): werden über
 *   document.getAnimations() gezielt pausiert/fortgesetzt.
 *
 * Rand von 200px, damit Animationen vor dem Reinscrollen schon laufen.
 */
export default function OffscreenPause() {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return

    const isInfinite = (a: Animation) =>
      a.effect?.getTiming().iterations === Infinity && !(a instanceof CSSAnimation)

    const setState = (el: Element, visible: boolean) => {
      if (visible) el.removeAttribute('data-offscreen')
      else el.setAttribute('data-offscreen', '')
      for (const a of document.getAnimations()) {
        const t = (a.effect as KeyframeEffect | null)?.target
        if (!t || !isInfinite(a) || !el.contains(t)) continue
        if (visible) { if (a.playState === 'paused') a.play() }
        else if (a.playState === 'running') a.pause()
      }
    }

    const io = new IntersectionObserver(
      entries => entries.forEach(e => setState(e.target, e.isIntersecting)),
      { rootMargin: '200px 0px' },
    )

    const observed = new Set<Element>()
    const scan = () => {
      observed.forEach(el => {
        if (!el.isConnected) { io.unobserve(el); observed.delete(el) }
      })
      document.querySelectorAll('main section, footer').forEach(el => {
        if (observed.has(el)) return
        observed.add(el)
        io.observe(el)
      })
    }
    scan()

    // Neue Sections nach Client-Navigation (PageFade tauscht <main>) erfassen.
    // Pro Frame höchstens ein Scan, egal wie viele DOM-Mutationen anfallen.
    let queued = 0
    const mo = new MutationObserver(() => {
      if (queued) return
      queued = requestAnimationFrame(() => { queued = 0; scan() })
    })
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      io.disconnect()
      mo.disconnect()
      if (queued) cancelAnimationFrame(queued)
      observed.forEach(el => el.removeAttribute('data-offscreen'))
    }
  }, [])

  return null
}
