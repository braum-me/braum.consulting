/**
 * GSAP-Helper, zentralisiert.
 *
 * Wiederverwendbare Animationen für Section-Reveals, magnetische Hover-
 * Effekte und ScrollTrigger-Registrierung. Alle Helper respektieren
 * prefers-reduced-motion und no-op'en in dem Fall.
 */
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let scrollTriggerRegistered = false

/**
 * Registriert ScrollTrigger einmalig.
 * Safe in SSR, checkt auf `window`-Verfügbarkeit.
 */
export function registerScrollTrigger(): void {
  if (typeof window === 'undefined') return
  if (scrollTriggerRegistered) return
  gsap.registerPlugin(ScrollTrigger)
  scrollTriggerRegistered = true
}

/**
 * Boolean-Helper für `prefers-reduced-motion: reduce`.
 * SSR-safe, gibt im Server immer `false` zurück.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export interface RevealUpOptions {
  delay?: number
  duration?: number
}

/**
 * Section-Reveal-Animation für Headlines/Cards.
 * opacity 0→1, y 24→0, duration 0.7s, ease power3.out,
 * scrollTrigger start 'top 80%' once true.
 */
export function revealUp(
  element: Element | null,
  opts: RevealUpOptions = {},
): gsap.core.Tween | undefined {
  if (typeof window === 'undefined') return undefined
  if (!element) return undefined

  if (prefersReducedMotion()) {
    gsap.set(element, { opacity: 1, y: 0, clearProps: 'transform' })
    return undefined
  }

  registerScrollTrigger()

  return gsap.fromTo(
    element,
    { opacity: 0, y: 24 },
    {
      opacity: 1,
      y: 0,
      duration: opts.duration ?? 0.7,
      delay: opts.delay ?? 0,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        once: true,
      },
    },
  )
}

/**
 * Bindet einen subtle mouse-following Effekt an ein Element.
 * Element rückt leicht zum Cursor, federt zurück on leave.
 *
 * NICHT parallel mit `MagneticCursor` nutzen, eines von beiden.
 *
 * @returns cleanup-Funktion zum Entfernen der Listener
 */
export function magneticHover(element: HTMLElement | null): () => void {
  const noop = () => {}
  if (typeof window === 'undefined') return noop
  if (!element) return noop
  if (prefersReducedMotion()) return noop

  const strength = 0.25
  const quickX = gsap.quickTo(element, 'x', { duration: 0.4, ease: 'power3.out' })
  const quickY = gsap.quickTo(element, 'y', { duration: 0.4, ease: 'power3.out' })

  const onMove = (event: MouseEvent) => {
    const rect = element.getBoundingClientRect()
    const relX = event.clientX - (rect.left + rect.width / 2)
    const relY = event.clientY - (rect.top + rect.height / 2)
    quickX(relX * strength)
    quickY(relY * strength)
  }

  const onLeave = () => {
    quickX(0)
    quickY(0)
  }

  element.addEventListener('mousemove', onMove)
  element.addEventListener('mouseleave', onLeave)

  return () => {
    element.removeEventListener('mousemove', onMove)
    element.removeEventListener('mouseleave', onLeave)
    gsap.set(element, { clearProps: 'transform' })
  }
}
