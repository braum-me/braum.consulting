'use client'

/**
 * Email-Obfuscation per JavaScript-Hydration.
 *
 * Source-Cleanliness: User und Domain kommen primär aus ENV-Variablen
 * (NEXT_PUBLIC_CONTACT_USER / NEXT_PUBLIC_CONTACT_DOMAIN) — die echte
 * Adresse steht nicht hardcoded im Repository. Bei Adress-Wechsel: nur
 * ENV-Werte anpassen, kein Code-Change.
 *
 * Schutz vor Scraping: Server-render zeigt einen Placeholder ohne User
 * oder Domain im Markup. Primitive Scraper, die das gerenderte HTML
 * statisch parsen, sehen keine E-Mail-Adresse. Erst nach Client-
 * Hydration ersetzt die Component sich selbst durch einen echten
 * mailto-Link.
 *
 * Cloudflare Email Obfuscation greift zusätzlich, falls aktiviert.
 */

import { useEffect, useState } from 'react'

interface Props {
  /** User-Teil — default: NEXT_PUBLIC_CONTACT_USER */
  user?:        string
  /** Domain-Teil — default: NEXT_PUBLIC_CONTACT_DOMAIN */
  domain?:      string
  /** Display-Label statt der Adresse (z.B. „Schreib mir") */
  label?:       string
  /** Placeholder vor der Hydration (default: „E-Mail einblenden") */
  fallback?:    string
  className?:   string
  style?:       React.CSSProperties
  /** data-cursor-Wert für den MagneticCursor */
  cursorType?:  string
  /** Wenn true: voller Adress-String als Display-Text */
  showAddress?: boolean
}

const ENV_USER   = process.env.NEXT_PUBLIC_CONTACT_USER   ?? 'info'
const ENV_DOMAIN = process.env.NEXT_PUBLIC_CONTACT_DOMAIN ?? 'braum.consulting'

export default function ObfuscatedEmail({
  user        = ENV_USER,
  domain      = ENV_DOMAIN,
  label,
  fallback    = 'E-Mail einblenden',
  className,
  style,
  cursorType,
  showAddress,
}: Props) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Pre-Hydration: nur Placeholder — kein User, keine Domain im Markup
  if (!mounted) {
    return (
      <span
        className={className}
        style={{ ...style, opacity: style?.opacity ?? 0.7 }}
        aria-label="E-Mail-Adresse wird beim Laden eingeblendet"
      >
        {fallback}
      </span>
    )
  }

  // Hydrated: echte mailto-Adresse
  const address     = `${user}@${domain}`
  const displayText = showAddress ? address : (label ?? address)

  return (
    <a
      href={`mailto:${address}`}
      className={className}
      style={style}
      {...(cursorType ? { 'data-cursor': cursorType } : {})}
    >
      {displayText}
    </a>
  )
}
