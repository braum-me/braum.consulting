'use client'

import { useEffect, useState } from 'react'

/**
 * Floating ⌘K-Trigger unten rechts. Klick dispatcht `bc-toggle-palette`,
 * CommandPalette hört darauf und öffnet/schließt.
 *
 * Versteckt auf Touch-Devices (kein Tastatur-Shortcut → der Button ist
 * mobil weniger relevant, und das Visual ist auf Desktop kalibriert).
 */
export default function PaletteFloatingButton() {
  const [enabled, setEnabled] = useState(false)
  const [hover, setHover]     = useState(false)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(pointer: coarse)').matches) return
    setEnabled(true)
  }, [])

  // Erst nach Verlassen des Hero-Viewports einblenden, damit der Button
  // die HeroStatus-Karte nicht überdeckt. Threshold: 70 % der Viewport-Höhe.
  useEffect(() => {
    if (!enabled) return
    const check = () => {
      const threshold = window.innerHeight * 0.7
      setRevealed(window.scrollY > threshold)
    }
    check()
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)
    return () => {
      window.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
    }
  }, [enabled])

  if (!enabled) return null

  function toggle() {
    window.dispatchEvent(new Event('bc-toggle-palette'))
  }

  // ⌘ glyph für macOS, „Ctrl" für andere
  const isMac =
    typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)
  const modKey = isMac ? '⌘' : 'Ctrl'

  return (
    <button
      type="button"
      onClick={toggle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      data-cursor="magnetic"
      aria-label="Command-Palette öffnen"
      title={`${modKey} K — Schnell-Navigation`}
      className="group fixed flex items-center gap-2 transition-all duration-300"
      aria-hidden={!revealed}
      style={{
        bottom: '32px',
        right:  '32px',
        zIndex: 55,
        padding: '10px 14px',
        background:
          'linear-gradient(145deg, rgba(245, 245, 248, 0.14) 0%, rgba(220, 220, 228, 0.05) 60%, rgba(180, 180, 195, 0.03) 100%)',
        border: hover
          ? '1px solid rgba(220, 128, 68, 0.45)'
          : '1px solid rgba(245, 245, 250, 0.18)',
        borderRadius: '999px',
        backdropFilter: 'blur(28px) saturate(170%)',
        WebkitBackdropFilter: 'blur(28px) saturate(170%)',
        boxShadow: hover
          ? 'inset 0 1px 0 rgba(255,255,255,0.28), 0 16px 36px -10px rgba(0,0,0,0.55), 0 0 32px rgba(220, 128, 68, 0.30)'
          : 'inset 0 1px 0 rgba(255,255,255,0.22), 0 12px 28px -10px rgba(0,0,0,0.50)',
        color: 'var(--fg-default)',
        cursor: 'pointer',
        opacity: revealed ? 1 : 0,
        pointerEvents: revealed ? 'auto' : 'none',
        transform: revealed
          ? hover
            ? 'translateY(-2px)'
            : 'translateY(0)'
          : 'translateY(20px)',
        transition: 'opacity 320ms ease, transform 320ms cubic-bezier(0.16, 1, 0.3, 1), border-color 220ms, box-shadow 220ms',
      }}
    >
      <kbd
        className="inline-flex items-center justify-center font-mono"
        style={{
          fontSize: '11px',
          letterSpacing: '0.04em',
          color: hover ? 'var(--accent)' : 'var(--brand)',
          padding: '2px 7px',
          border: '1px solid',
          borderColor: hover ? 'rgba(220, 128, 68, 0.55)' : 'rgba(220, 128, 68, 0.32)',
          borderRadius: '4px',
          background: 'rgba(0, 0, 0, 0.30)',
          transition: 'color 220ms, border-color 220ms',
        }}
      >
        {modKey} K
      </kbd>
      <span
        className="font-mono uppercase"
        style={{
          fontSize: '10px',
          letterSpacing: '0.18em',
          color: 'var(--fg-muted)',
        }}
      >
        Schnell-Nav
      </span>
    </button>
  )
}
