'use client'

/**
 * Echter Opt-out-/Opt-in-Schalter für die cookielose Umami-Reichweitenmessung.
 * Schreibt/entfernt den localStorage-Schlüssel `braum.analytics-opt-out` und
 * lädt neu, damit das Umami-Script entsprechend (nicht) geladen wird.
 *
 * Bewusst client-only gerendert (kein SSR-Status) → kein Hydration-Mismatch.
 */

import { useEffect, useState } from 'react'

const OPT_OUT_KEY = 'braum.analytics-opt-out'

export default function AnalyticsOptOut() {
  const [optedOut, setOptedOut] = useState<boolean | null>(null)

  useEffect(() => {
    try {
      setOptedOut(window.localStorage.getItem(OPT_OUT_KEY) === '1')
    } catch {
      setOptedOut(false)
    }
  }, [])

  function toggle() {
    try {
      if (optedOut) window.localStorage.removeItem(OPT_OUT_KEY)
      else window.localStorage.setItem(OPT_OUT_KEY, '1')
    } catch {
      /* private mode etc. — silent */
    }
    window.location.reload()
  }

  if (optedOut === null) return null

  return (
    <span className="mt-3 inline-flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={toggle}
        data-cursor="link"
        className="font-mono uppercase transition-colors duration-220"
        style={{
          fontSize: '12px',
          letterSpacing: '0.1em',
          color: optedOut ? 'var(--brand)' : 'var(--fg-default)',
          padding: '9px 16px',
          border: `1px solid ${optedOut ? 'var(--border-brand)' : 'var(--border-strong)'}`,
          borderRadius: 'var(--r-sm)',
          background: 'transparent',
          cursor: 'pointer',
        }}
      >
        {optedOut
          ? 'Reichweitenmessung wieder aktivieren'
          : 'Reichweitenmessung auf diesem Gerät deaktivieren'}
      </button>
      <span
        className="font-mono uppercase"
        style={{ fontSize: '11px', letterSpacing: '0.12em', color: optedOut ? 'var(--brand)' : 'var(--fg-subtle)' }}
      >
        {optedOut ? '● deaktiviert' : '○ aktiv'}
      </span>
    </span>
  )
}
