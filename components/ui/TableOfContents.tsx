'use client'

/**
 * Sticky Table of Contents — links, mit Scroll-Spy für aktiven Heading.
 *
 * Sammelt zur Mount-Zeit alle `<h2>` und `<h3>` Elemente innerhalb des
 * angegebenen Selectors (default: `article`). Vergibt IDs falls fehlen.
 * Click auf Item → smooth scroll. IntersectionObserver beobachtet die
 * Headings und markiert das im Viewport sichtbare als „active".
 *
 * Auf Mobile: collapsible "Inhalt" pill oben.
 * Auf Desktop: sticky in der linken Spalte.
 */

import { useEffect, useState, useRef } from 'react'
import { ChevronRight, List, ChevronDown } from 'lucide-react'

interface TocItem {
  id:    string
  text:  string
  level: 2 | 3
}

interface TableOfContentsProps {
  /** CSS-Selector des Container-Elements das durchsucht wird. Default: 'article' */
  containerSelector?: string
  /** Maximale Heading-Level. Default: 3 */
  maxLevel?: 2 | 3
  /** Label oben über der Liste. Default: 'Inhalt' */
  label?: string
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[äöüß]/g, c => ({ ä: 'ae', ö: 'oe', ü: 'ue', ß: 'ss' }[c] ?? c))
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

export default function TableOfContents({
  containerSelector = 'article',
  maxLevel = 3,
  label = 'Inhalt',
}: TableOfContentsProps) {
  const [items, setItems] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const container = document.querySelector(containerSelector)
    if (!container) return

    const headings = Array.from(
      container.querySelectorAll(maxLevel === 3 ? 'h2, h3' : 'h2'),
    ) as HTMLHeadingElement[]

    const collected: TocItem[] = headings.map((h) => {
      let id = h.id
      if (!id) {
        id = slugify(h.textContent ?? '')
        h.id = id
      }
      // Scroll-margin damit Sticky-Nav den Heading nicht überdeckt
      h.style.scrollMarginTop = '96px'
      return {
        id,
        text: h.textContent ?? '',
        level: (h.tagName === 'H2' ? 2 : 3) as 2 | 3,
      }
    })

    setItems(collected)
    if (collected.length > 0) setActiveId(collected[0].id)

    // Scroll-Spy via IntersectionObserver
    observerRef.current?.disconnect()
    const observer = new IntersectionObserver(
      (entries) => {
        // Nimm den ersten sichtbaren Heading, sonst behalte aktuellen
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      {
        rootMargin: '-80px 0px -60% 0px',
        threshold: [0, 1.0],
      },
    )
    headings.forEach((h) => observer.observe(h))
    observerRef.current = observer

    return () => observer.disconnect()
  }, [containerSelector, maxLevel])

  if (items.length === 0) return null

  return (
    <>
      {/* Mobile: collapsible pill top */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          className="flex w-full items-center justify-between gap-3 font-mono uppercase transition-colors duration-220"
          style={{
            fontSize: 11,
            letterSpacing: '0.18em',
            color: 'var(--fg-default)',
            padding: '12px 16px',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--r-sm)',
          }}
        >
          <span className="inline-flex items-center gap-2">
            <List size={13} strokeWidth={1.6} style={{ color: 'var(--brand)' }} />
            {label} · {items.length}
          </span>
          <ChevronDown
            size={14}
            strokeWidth={1.6}
            style={{
              color: 'var(--fg-muted)',
              transform: mobileOpen ? 'rotate(180deg)' : 'none',
              transition: 'transform 220ms',
            }}
          />
        </button>
        {mobileOpen && (
          <ul
            className="mt-2 space-y-1 overflow-hidden"
            style={{
              padding: '12px 16px',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--r-sm)',
            }}
          >
            {items.map((it) => (
              <TocLink
                key={it.id}
                item={it}
                isActive={it.id === activeId}
                onClick={() => {
                  setMobileOpen(false)
                  setActiveId(it.id)
                }}
              />
            ))}
          </ul>
        )}
      </div>

      {/* Desktop: sticky aside */}
      <aside
        aria-label={label}
        className="hidden lg:block"
        style={{
          position: 'sticky',
          top: 96,
          maxHeight: 'calc(100vh - 128px)',
          overflowY: 'auto',
        }}
      >
        <p
          className="font-mono uppercase"
          style={{
            fontSize: 10,
            letterSpacing: '0.20em',
            color: 'var(--fg-subtle)',
            marginBottom: 16,
            paddingBottom: 10,
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          {label}
        </p>
        <ul className="space-y-1" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {items.map((it) => (
            <TocLink
              key={it.id}
              item={it}
              isActive={it.id === activeId}
              onClick={() => setActiveId(it.id)}
            />
          ))}
        </ul>
      </aside>
    </>
  )
}

/* ── Einzelnes TOC-Item ────────────────────────────────────────────── */

function TocLink({
  item,
  isActive,
  onClick,
}: {
  item:     TocItem
  isActive: boolean
  onClick:  () => void
}) {
  return (
    <li>
      <a
        href={`#${item.id}`}
        onClick={(e) => {
          e.preventDefault()
          const el = document.getElementById(item.id)
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' })
            history.replaceState(null, '', `#${item.id}`)
          }
          onClick()
        }}
        className="group relative flex items-center gap-2 font-body transition-colors duration-220"
        style={{
          fontSize: item.level === 2 ? 13 : 12,
          lineHeight: 1.4,
          padding: '7px 10px',
          paddingLeft: item.level === 3 ? 22 : 10,
          color: isActive ? 'var(--brand)' : 'var(--fg-muted)',
          borderLeft: '2px solid ' + (isActive ? 'var(--brand)' : 'transparent'),
          fontWeight: isActive ? 500 : 400,
        }}
      >
        {item.level === 3 && (
          <ChevronRight
            size={9}
            strokeWidth={1.8}
            style={{
              color: isActive ? 'var(--brand)' : 'var(--fg-faint)',
              flexShrink: 0,
            }}
          />
        )}
        <span
          className="transition-colors duration-220 group-hover:text-[color:var(--fg-default)]"
          style={{ color: 'inherit' }}
        >
          {item.text}
        </span>
      </a>
    </li>
  )
}
