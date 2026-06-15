'use client'

import Link from 'next/link'
import { type ComponentProps } from 'react'
import { trackEvent } from '@/lib/analytics'

type TrackedLinkProps = ComponentProps<typeof Link> & {
  /** Umami-Event-Name, der beim Klick gefeuert wird. */
  event: string
  /** Optionale Event-Daten. */
  eventData?: Record<string, unknown>
}

/**
 * next/link mit Umami-Tracking beim Klick. Damit Server-Components (z. B.
 * Footer) einzelne CTAs/Links instrumentieren können, ohne komplett auf
 * 'use client' umgestellt zu werden.
 */
export default function TrackedLink({
  event,
  eventData,
  onClick,
  ...props
}: TrackedLinkProps) {
  return (
    <Link
      {...props}
      onClick={e => {
        trackEvent(event, eventData)
        onClick?.(e)
      }}
    />
  )
}
