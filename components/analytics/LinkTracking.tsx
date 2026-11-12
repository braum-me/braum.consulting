'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { classifyLink, notePath, seenRecently, track, type Placement } from '@/lib/analytics'

const PLACEMENTS: Placement[] = ['navigation', 'footer', 'suche', 'ergebnis', 'inhalt']

/** Platzierung eines Links: explizit per `data-track-placement`, sonst aus der Umgebung. */
function placementOf(el: Element): Placement {
  const explicit = el.closest('[data-track-placement]')?.getAttribute('data-track-placement')
  if (explicit && (PLACEMENTS as string[]).includes(explicit)) return explicit as Placement
  if (el.closest('[role="dialog"]')) return 'suche'
  if (el.closest('footer')) return 'footer'
  if (el.closest('header, nav')) return 'navigation'
  return 'inhalt'
}

/**
 * Eine Stelle für alle Conversion-relevanten Link-Klicks (Kontakt, Lagebild,
 * Terminbuchung, Werkzeug-Einstiege) statt Einzel-Events in jeder Komponente.
 * Merkt außerdem die zuletzt besuchte Seite im Speicher, damit eine Anfrage
 * ihrer Herkunft zugeordnet werden kann.
 */
export default function LinkTracking() {
  const pathname = usePathname()

  useEffect(() => {
    notePath(pathname)
  }, [pathname])

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const a = (e.target as Element | null)?.closest?.('a[href]')
      if (!a) return
      const href = a.getAttribute('href') ?? ''
      try {
        for (const ev of classifyLink(href, window.location.pathname, placementOf(a), window.location.origin)) {
          if (seenRecently(`${ev.name}:${href}`)) continue
          track(ev.name, ev.data)
        }
      } catch {
        /* Tracking darf die Navigation nie stören */
      }
    }
    document.addEventListener('click', onClick, { capture: true })
    return () => document.removeEventListener('click', onClick, { capture: true })
  }, [])

  return null
}
