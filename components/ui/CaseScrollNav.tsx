'use client'

import { useEffect, useState } from 'react'

interface NavItem {
  id:    string
  label: string
  num:   string
}

interface Props {
  items: NavItem[]
}

/**
 * Sticky-Side-Navigation mit Scroll-Spy für die Case-Detail-Page.
 * Hebt das aktuell sichtbare Section-Item via IntersectionObserver hervor.
 * Klick scrollt smooth zur Section.
 *
 * Desktop only (≥lg). Auf Mobile wird die Nav durch das Standard-Scrolling
 * + Section-Anchors abgedeckt — keine zusätzliche UI nötig.
 */
export default function CaseScrollNav({ items }: Props) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? '')

  useEffect(() => {
    if (typeof window === 'undefined') return

    const observers: IntersectionObserver[] = []
    const visible = new Map<string, number>()

    items.forEach(item => {
      const el = document.getElementById(item.id)
      if (!el) return

      const io = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              visible.set(item.id, entry.intersectionRatio)
            } else {
              visible.delete(item.id)
            }
          })
          // Pick item with highest visibility
          let topId = ''
          let topRatio = 0
          visible.forEach((r, id) => {
            if (r > topRatio) {
              topRatio = r
              topId    = id
            }
          })
          if (topId) setActiveId(topId)
        },
        {
          rootMargin: '-30% 0px -50% 0px',
          threshold:  [0.1, 0.25, 0.5, 0.75, 1],
        },
      )
      io.observe(el)
      observers.push(io)
    })

    return () => observers.forEach(io => io.disconnect())
  }, [items])

  function handleClick(e: React.MouseEvent, id: string) {
    e.preventDefault()
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav
      aria-label="Case-Sektionen"
      className="hidden lg:block"
      style={{
        position: 'sticky',
        top: '120px',
        alignSelf: 'flex-start',
      }}
    >
      <p
        className="font-mono uppercase"
        style={{
          fontSize: '10px',
          letterSpacing: '0.20em',
          color: 'var(--fg-subtle)',
          marginBottom: '20px',
        }}
      >
        Inhalt
      </p>
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}
      >
        {items.map(item => {
          const isActive = item.id === activeId
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={e => handleClick(e, item.id)}
                data-cursor="link"
                className="group flex items-center gap-3 transition-all duration-220"
                style={{
                  padding: '8px 0',
                  borderLeft: isActive
                    ? '2px solid var(--accent)'
                    : '2px solid transparent',
                  paddingLeft: '14px',
                  marginLeft: '-16px',
                }}
              >
                <span
                  className="font-mono"
                  style={{
                    fontSize: '10px',
                    letterSpacing: '0.16em',
                    color: isActive ? 'var(--accent)' : 'var(--fg-subtle)',
                    transition: 'color 220ms',
                    minWidth: '24px',
                  }}
                >
                  {item.num}
                </span>
                <span
                  className="font-mono uppercase"
                  style={{
                    fontSize: '11px',
                    letterSpacing: '0.16em',
                    color: isActive ? 'var(--fg-default)' : 'var(--fg-muted)',
                    transition: 'color 220ms',
                  }}
                >
                  {item.label}
                </span>
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
