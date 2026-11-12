'use client'

import { useState, type ReactNode } from 'react'
import Link from 'next/link'
import { findMatchingTerms, type GlossaryTerm } from '@/lib/cms'

/**
 * Scant einen Text-String auf Glossar-Treffer (case-insensitive,
 * word-boundary) und wrappt jedes Match in einen GlossarLink mit
 * Hover-Preview-Card.
 *
 * Verwendung:
 *   <GlossarHighlight text="Das Lotsenprinzip beschreibt..." />
 *
 * Für JSX-Inputs mit eingebetteten Elementen (z.B. ItalicAccent) bitte
 * separat per Hand wrappen — diese Component verarbeitet nur Strings.
 */
export default function GlossarHighlight({
  text,
  as: Wrapper = 'span',
}: {
  text: string
  as?: 'span' | 'p' | 'div'
}) {
  const matches = findMatchingTerms(text)

  if (matches.length === 0) {
    return <Wrapper>{text}</Wrapper>
  }

  const parts: ReactNode[] = []
  let cursor = 0

  matches.forEach((m, i) => {
    if (m.start > cursor) {
      parts.push(text.slice(cursor, m.start))
    }
    parts.push(
      <GlossarLink key={`${m.term.slug}-${i}`} term={m.term} label={m.match} />,
    )
    cursor = m.end
  })

  if (cursor < text.length) {
    parts.push(text.slice(cursor))
  }

  return <Wrapper>{parts}</Wrapper>
}

/* ── Inline-Link mit Hover-Preview ──────────────────────────────────── */

export function GlossarLink({ term, label }: { term: GlossaryTerm; label: string }) {
  const [hover, setHover] = useState(false)

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Link
        href={`/lexikon/${term.slug}`}
        className="transition-colors duration-220"
        style={{
          borderBottom: '1px dotted rgba(220, 128, 68, 0.55)',
          color: 'inherit',
          textDecoration: 'none',
        }}
        data-cursor="link"
      >
        {label}
      </Link>

      {hover && (
        <span
          role="tooltip"
          className="pointer-events-none absolute z-[80]"
          style={{
            left: '50%',
            bottom: 'calc(100% + 12px)',
            transform: 'translateX(-50%)',
            width: 'min(340px, 84vw)',
            padding: '16px 18px',
            background:
              'linear-gradient(145deg, rgba(15, 14, 12, 0.92) 0%, rgba(15, 14, 12, 0.85) 100%)',
            backdropFilter: 'blur(24px) saturate(170%)',
            WebkitBackdropFilter: 'blur(24px) saturate(170%)',
            border: '1px solid rgba(220, 128, 68, 0.22)',
            borderRadius: '8px',
            boxShadow:
              'inset 0 1px 0 rgba(255, 255, 255, 0.10), 0 24px 48px rgba(0, 0, 0, 0.6)',
            opacity: 1,
          }}
        >
          <span
            className="mb-1.5 block font-mono uppercase"
            style={{
              fontSize: '9px',
              letterSpacing: '0.18em',
              color: 'var(--brand)',
            }}
          >
            Lexikon · {labelForCategory(term.category)}
          </span>
          <span
            className="mb-2 block font-display font-semibold"
            style={{
              fontSize: '15px',
              lineHeight: 1.2,
              color: 'var(--fg-default)',
              letterSpacing: '-0.005em',
            }}
          >
            {term.term}
          </span>
          <span
            className="block font-body"
            style={{
              fontSize: '13px',
              lineHeight: 1.55,
              color: 'var(--fg-muted)',
            }}
          >
            {term.definition}
          </span>
          <span
            className="mt-3 inline-flex items-center gap-1 font-mono uppercase"
            style={{
              fontSize: '9px',
              letterSpacing: '0.16em',
              color: 'var(--brand)',
            }}
          >
            Mehr lesen →
          </span>
        </span>
      )}
    </span>
  )
}

function labelForCategory(c: GlossaryTerm['category']): string {
  switch (c) {
    case 'brand':     return 'Brand'
    case 'methodik':  return 'Methodik'
    case 'technik':   return 'Technik'
    case 'industrie': return 'Industrie'
    case 'recht':     return 'Recht & Compliance'
    default:          return ''
  }
}
