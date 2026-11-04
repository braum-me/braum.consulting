'use client'

/**
 * Share-Bar für Blog-Posts und Cases. Vertikal-floating links auf Desktop,
 * inline am Post-Ende auf Mobile.
 *
 * Buttons: Copy-Link, LinkedIn-Share, E-Mail-Forward.
 * Klick → showToast Feedback.
 */

import { useEffect, useState } from 'react'
import { Link2, Linkedin, Mail } from 'lucide-react'
import { showToast } from './ShareToast'

interface ShareBarProps {
  /** Title für den Share-Text (LinkedIn-Post, Mail-Subject) */
  title: string
  /** Optionale Position. 'floating' = sticky vertikal links (Desktop),
   *  'inline' = horizontale Reihe (für Mobile oder am Post-Ende) */
  position?: 'floating' | 'inline'
}

export default function ShareBar({ title, position = 'floating' }: ShareBarProps) {
  const [url, setUrl] = useState('')

  useEffect(() => {
    setUrl(window.location.href)
  }, [])

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url || window.location.href)
      showToast('Link kopiert')
    } catch {
      showToast('Kopieren fehlgeschlagen')
    }
  }

  const linkedInUrl = url
    ? `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    : '#'

  const mailUrl = url
    ? `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${title}\n\n${url}`)}`
    : '#'

  const buttons = [
    {
      label: 'Link kopieren',
      Icon:  Link2,
      onClick: handleCopy,
    },
    {
      label: 'Auf LinkedIn teilen',
      Icon:  Linkedin,
      href:  linkedInUrl,
      external: true,
    },
    {
      label: 'Per Mail teilen',
      Icon:  Mail,
      href:  mailUrl,
    },
  ] as const

  if (position === 'inline') {
    return (
      <div
        aria-label="Beitrag teilen"
        className="flex items-center gap-3"
      >
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 10,
            letterSpacing: '0.18em',
            color: 'var(--fg-subtle)',
          }}
        >
          Teilen
        </span>
        {buttons.map((b) => (
          <ShareButton key={b.label} {...b} />
        ))}
      </div>
    )
  }

  // Floating (default) — sticky vertical
  return (
    <aside
      aria-label="Beitrag teilen"
      className="hidden lg:flex"
      style={{
        position: 'sticky',
        top: 200,
        flexDirection: 'column',
        gap: 10,
        alignItems: 'center',
      }}
    >
      <span
        className="font-mono uppercase"
        style={{
          writingMode: 'vertical-rl',
          fontSize: 9,
          letterSpacing: '0.22em',
          color: 'var(--fg-subtle)',
          marginBottom: 8,
          transform: 'rotate(180deg)',
        }}
      >
        Teilen
      </span>
      {buttons.map((b) => (
        <ShareButton key={b.label} {...b} />
      ))}
    </aside>
  )
}

/* ── Einzelner Share-Button ─────────────────────────────────────────── */

interface ShareButtonProps {
  label:     string
  Icon:      typeof Link2
  onClick?:  () => void
  href?:     string
  external?: boolean
}

function ShareButton({ label, Icon, onClick, href, external }: ShareButtonProps) {
  const className = 'group inline-flex items-center justify-center transition-all duration-220'
  const style: React.CSSProperties = {
    width: 36,
    height: 36,
    borderRadius: 'var(--r-sm)',
    background: 'rgba(28, 27, 24, 0.72)',
    border: '1px solid var(--border-subtle)',
    color: 'var(--fg-muted)',
    cursor: 'pointer',
  }

  const content = (
    <span
      className="inline-flex items-center justify-center transition-colors duration-220 group-hover:text-[color:var(--brand)]"
      style={{ width: '100%', height: '100%' }}
    >
      <Icon size={14} strokeWidth={1.6} />
    </span>
  )

  if (href) {
    return (
      <a
        href={href}
        aria-label={label}
        title={label}
        data-cursor="link"
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className={className}
        style={style}
      >
        {content}
      </a>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      data-cursor="link"
      className={className}
      style={style}
    >
      {content}
    </button>
  )
}
