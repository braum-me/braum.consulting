'use client'

import { useEffect, useRef } from 'react'

/** Höhe des fixen Headers plus Luft (wie Lenis-Anker-Offset). */
const HEADER_OFFSET = 96

/**
 * Sobald ein Ergebnis erscheint (sichtbar wechselt von false auf true):
 * Fokus auf die Ergebnis-Überschrift (tabIndex={-1}) und — falls nötig —
 * so scrollen, dass sie unter dem Header sichtbar ist. Mobil lag das Ergebnis
 * sonst unterhalb des Bildschirms; Tastatur- und Screenreader-Nutzer landen
 * direkt beim Ergebnis. Spätere Antwortänderungen lösen nichts erneut aus.
 */
export function useErgebnisFokus<T extends HTMLElement>(sichtbar: boolean) {
  const ref = useRef<T>(null)
  const vorher = useRef(sichtbar)

  useEffect(() => {
    const neu = sichtbar && !vorher.current
    vorher.current = sichtbar
    if (!neu) return
    // Ein Frame warten, bis das Ergebnis im DOM steht
    const id = requestAnimationFrame(() => {
      const el = ref.current
      if (!el) return
      el.focus({ preventScroll: true })
      const r = el.getBoundingClientRect()
      if (r.top < HEADER_OFFSET || r.top > window.innerHeight * 0.6) {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        window.scrollTo({ top: window.scrollY + r.top - HEADER_OFFSET, behavior: reduce ? 'auto' : 'smooth' })
      }
    })
    return () => cancelAnimationFrame(id)
  }, [sichtbar])

  return ref
}
