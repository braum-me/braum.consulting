'use client'

/**
 * Reading-Progress-Bar — schmale Brand-Linie am oberen Viewport,
 * füllt sich proportional zum Scroll-Fortschritt durch das angegebene
 * Article-Element.
 *
 * Tracking erfolgt rAF-basiert (kein scroll-Event-Storm), respektiert
 * prefers-reduced-motion (in dem Fall: Bar zeigt aber animiert nicht).
 *
 * Höhe 2px, fixed top, z-index unter Nav (50) aber über Content.
 */

import { useEffect, useRef, useState } from 'react'

interface ArticleReadingProgressProps {
  /** CSS-Selector des Article-Elements (default 'article.blog-article') */
  selector?: string
}

export default function ArticleReadingProgress({
  selector = 'article.blog-article',
}: ArticleReadingProgressProps) {
  const [progress, setProgress] = useState(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const article = document.querySelector<HTMLElement>(selector)
    if (!article) return

    function update() {
      if (!article) return
      const rect = article.getBoundingClientRect()
      const articleHeight = rect.height
      const viewportHeight = window.innerHeight
      // Position des Article-Top relativ zum Viewport-Top
      const scrolled = -rect.top
      // Effektive Strecke = article height - viewport (so dass progress=1
      // wenn article-bottom am viewport-bottom ist)
      const effective = Math.max(1, articleHeight - viewportHeight)
      const p = Math.max(0, Math.min(1, scrolled / effective))
      setProgress(p)
      rafRef.current = requestAnimationFrame(update)
    }

    rafRef.current = requestAnimationFrame(update)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [selector])

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        zIndex: 49,
        background: 'transparent',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          width: `${progress * 100}%`,
          height: '100%',
          background:
            'linear-gradient(90deg, rgba(220, 128, 68, 0.4) 0%, var(--accent) 50%, var(--brand) 100%)',
          boxShadow: '0 0 8px rgba(220, 128, 68, 0.45)',
          transition: 'width 80ms linear',
        }}
      />
    </div>
  )
}
