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
 * - Lesbarkeit (Audit 2026-11): Die gedimmte Stufe hält immer mindestens
 *   4,5:1 Kontrast zur Seitenfläche — berechnet aus der tatsächlichen
 *   Textfarbe (fg-default ≈ 0,52, fg-muted ≈ 0,82). Vorher 0,32 = 2,6:1.
 *   Am Seitenende sind alle Wörter voll sichtbar.
 */

import { useEffect, useRef, type ReactNode } from 'react'
import { findMatchingTerms } from '@/lib/cms'
import { GlossarLink } from './GlossarHighlight'

const MUTED_OPACITY = 0.32
/** Seitenfläche (--bg-base, die Seite ist dunkel-only). */
const BG_BASE: [number, number, number] = [15, 14, 12]
const MIN_CONTRAST = 4.5
const RESERVE = 0.04

function luminance([r, g, b]: number[]): number {
  const f = (v: number) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}

/** Kleinste Deckkraft, bei der die Textfarbe auf --bg-base noch ≥ 4,5:1 erreicht. */
function minReadableOpacity(cssColor: string): number {
  const m = cssColor.match(/[\d.]+/g)
  if (!m || m.length < 3) return 1
  const fg = m.slice(0, 3).map(Number)
  const lb = luminance(BG_BASE)
  for (let a = MUTED_OPACITY; a < 1; a += 0.01) {
    const mix = fg.map((c, i) => BG_BASE[i] + a * (c - BG_BASE[i]))
    const lm = luminance(mix)
    if ((Math.max(lm, lb) + 0.05) / (Math.min(lm, lb) + 0.05) >= MIN_CONTRAST) return Math.min(1, a + RESERVE)
  }
  return 1
}

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
    const floor = Math.max(MUTED_OPACITY, minReadableOpacity(getComputedStyle(el).color))
    let raf = 0
    let visible = false

    const update = () => {
      const vh = window.innerHeight
      // Reading-Zone: zwischen 78 % (muted) und 32 % (voll) der Viewport-Höhe
      const start = vh * 0.78
      const end   = vh * 0.32
      const range = start - end
      // Seitenende erreicht: nichts bleibt gedimmt
      const amEnde = window.scrollY + vh >= document.documentElement.scrollHeight - 4

      for (const w of wordEls) {
        if (amEnde) { w.style.opacity = '1'; continue }
        const r = w.getBoundingClientRect()
        const y = r.top + r.height / 2
        const t = (start - y) / range
        const tc = t < 0 ? 0 : t > 1 ? 1 : t
        w.style.opacity = String(floor + tc * (1 - floor))
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
        // auch beim Verlassen: schnell überscrollte Wörter nicht gedimmt zurücklassen
        update()
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
            // voll lesbar, bis JS den Effekt mit lesbarer Untergrenze setzt
            opacity:    1,
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
            // voll lesbar, bis JS den Effekt mit lesbarer Untergrenze setzt
            opacity:    1,
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
