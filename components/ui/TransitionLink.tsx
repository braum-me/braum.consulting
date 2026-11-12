'use client'

import Link, { type LinkProps } from 'next/link'
import { useRouter } from 'next/navigation'
import { type ComponentProps, type MouseEvent } from 'react'

type TransitionLinkProps = LinkProps & {
  className?: string
  children?:  React.ReactNode
} & Omit<ComponentProps<'a'>, keyof LinkProps>

/**
 * Drop-in-Replacement für next/link der `document.startViewTransition()`
 * nutzt, wenn der Browser es unterstützt. Fallback ist Next.js-Default.
 *
 * Deaktiviert bei prefers-reduced-motion, Command-Click, Modifier-Tasten,
 * und externen Links. Externe Targets nutzen normal `<a>` (kein TransitionLink).
 */
export default function TransitionLink({
  href,
  onClick,
  ...props
}: TransitionLinkProps) {
  const router = useRouter()

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    if (onClick) onClick(e)
    if (e.defaultPrevented) return

    // Native ViewTransition API verfügbar?
    if (typeof document === 'undefined' || !('startViewTransition' in document)) {
      return
    }

    // Modifier-Tasten → neuer Tab, keine Transition
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    if (e.button !== 0) return

    // Reduced-motion → keine Transition, normal navigieren
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    e.preventDefault()
    const target = typeof href === 'string' ? href : href.toString()

    ;(document as Document & {
      startViewTransition: (cb: () => void) => unknown
    }).startViewTransition(() => {
      router.push(target)
    })
  }

  return <Link href={href} onClick={handleClick} {...props} />
}
