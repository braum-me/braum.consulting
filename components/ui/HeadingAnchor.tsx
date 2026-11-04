'use client'

/**
 * Heading-Anchor mit Click-to-Copy. Wrappt den Heading-Text in einen
 * `<a href="#slug">`, beim Klick wird die Permalink-URL kopiert und ein
 * Toast bestätigt es.
 *
 * Default-Navigation (scroll to anchor + history change) bleibt erhalten.
 */

import type { ReactNode } from 'react'
import { showToast } from './ShareToast'

interface HeadingAnchorProps {
  slug:     string
  children: ReactNode
}

export default function HeadingAnchor({ slug, children }: HeadingAnchorProps) {
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault()
    const el = document.getElementById(slug)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    const url = `${window.location.origin}${window.location.pathname}#${slug}`
    history.replaceState(null, '', `#${slug}`)
    void navigator.clipboard.writeText(url).then(
      () => showToast('Link kopiert'),
      () => { /* silently fail */ },
    )
  }

  return (
    <a
      href={`#${slug}`}
      onClick={handleClick}
      className="relative no-underline transition-colors duration-220 hover:text-[color:var(--brand)]"
      style={{ color: 'inherit' }}
    >
      {children}
      <span
        aria-hidden
        className="ml-2 font-mono opacity-0 transition-opacity duration-220 group-hover:opacity-100"
        style={{
          fontSize: '0.6em',
          color: 'var(--accent)',
          verticalAlign: 'middle',
        }}
      >
        #
      </span>
    </a>
  )
}
