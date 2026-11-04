'use client'

/**
 * ReadingHighlight — Wort-für-Wort Scroll-Highlight für lange Reading-Surfaces.
 *
 * Splittet den übergebenen Text in einzelne Wort-Spans, dimmt sie initial
 * auf MUTED_OPACITY und blendet sie beim Durchscrollen graduell auf 1.0 hoch.
 * Die Opacity hängt an der Wort-Y-Position relativ zu einer Reading-Zone
 * im Viewport (zwischen 78 % und 32 % Höhe).
 *
 * Glossar-Treffer werden weiterhin mit Hover-Card gerendert (GlossarLink),
 * aber sie unterliegen demselben Wort-Highlight.
 *
 * - Ein IntersectionObserver gated den Scroll-Listener: nur sichtbare Blöcke
 *   updaten ihre Wörter.
 * - requestAnimationFrame throttled die Updates.
 * - prefers-reduced-motion → alle Wörter sofort voll opak.
 */

import { useEffect, useRef, type ReactNode } from 'react'
import { findMatchingTerms } from '@/lib/cms'
import { GlossarLink } from './GlossarHighlight'

const MUTED_OPACITY = 0.32

interface Props {
  text:       string
  className?: string
}

export default function ReadingHighlight({ text, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Reduced-Motion: keine Animation, alle Wörter voll opak
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.querySelectorAll<HTMLElement>('[data-rh]').forEach(w => {
        w.style.opacity = '1'
      })
      return
    }

    const wordEls = Array.from(el.querySelectorAll<HTMLElement>('[data-rh]'))
    let raf = 0
    let visible = false

    const update = () => {
      const vh = window.innerHeight
      // Reading-Zone: zwischen 78 % (muted) und 32 % (voll) der Viewport-Höhe
      const start = vh * 0.78
      const end   = vh * 0.32
      const range = start - end

      for (const w of wordEls) {
        const r = w.getBoundingClientRect()
        const y = r.top + r.height / 2
        const t = (start - y) / range
        const tc = t < 0 ? 0 : t > 1 ? 1 : t
        w.style.opacity = String(MUTED_OPACITY + tc * (1 - MUTED_OPACITY))
      }
    }

    const onScroll = () => {
      if (!visible || raf) return
      raf = requestAnimationFrame(() => {
        update()
        raf = 0
      })
    }

    const io = new IntersectionObserver(
      entries => {
        visible = entries[0]?.isIntersecting ?? false
        if (visible) update()
      },
      { rootMargin: '120px 0px 120px 0px' },
    )
    io.observe(el)

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [text])

  const matches = findMatchingTerms(text)

  type Seg =
    | { kind: 'text';    text: string }
    | { kind: 'glossar'; text: string; slug: string; term: ReturnType<typeof findMatchingTerms>[number]['term'] }

  const segments: Seg[] = []
  let cursor = 0
  for (const m of matches) {
    if (m.start > cursor) {
      segments.push({ kind: 'text', text: text.slice(cursor, m.start) })
    }
    segments.push({ kind: 'glossar', text: m.match, slug: m.term.slug, term: m.term })
    cursor = m.end
  }
  if (cursor < text.length) {
    segments.push({ kind: 'text', text: text.slice(cursor) })
  }

  const nodes: ReactNode[] = []
  let key = 0

  for (const seg of segments) {
    if (seg.kind === 'glossar') {
      nodes.push(
        <span
          key={`g-${key++}`}
          data-rh
          style={{
            opacity:    MUTED_OPACITY,
            transition: 'opacity 360ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <GlossarLink term={seg.term} label={seg.text} />
        </span>,
      )
      continue
    }

    // Split plain text in word- + whitespace-tokens, keep whitespace as plain string nodes
    const tokens = seg.text.split(/(\s+)/)
    for (const tok of tokens) {
      if (!tok) continue
      if (/^\s+$/.test(tok)) {
        nodes.push(tok)
        continue
      }
      nodes.push(
        <span
          key={`w-${key++}`}
          data-rh
          style={{
            opacity:    MUTED_OPACITY,
            transition: 'opacity 360ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {tok}
        </span>,
      )
    }
  }

  return (
    <span ref={ref} className={className}>
      {nodes}
    </span>
  )
}
