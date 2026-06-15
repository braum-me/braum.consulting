'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { Loader2 } from 'lucide-react'

/**
 * Client-Component, das den Briefing-Status alle X Sekunden pollt und bei
 * `ready` einen router.refresh() auslöst — die Server-Component rendert
 * dann das fertige Briefing.
 *
 * Wird auf der /briefing/[token]-Page im Pending-State eingehängt.
 *
 * Defaults:
 *   - Poll alle 4s
 *   - Max 60 Versuche (= 4 Min), danach Stop
 *   - Bei "failed" oder "unknown": Stop, kein Refresh
 */

interface Props {
  token:         string
  pollEveryMs?:  number
  maxAttempts?:  number
}

interface StatusResponse {
  status: 'pending' | 'generating' | 'ready' | 'failed' | 'unknown' | 'error'
}

export default function PendingPoller({
  token,
  pollEveryMs = 4_000,
  maxAttempts = 60,
}: Props) {
  const router = useRouter()
  const [attempts, setAttempts] = useState(0)
  const [exhausted, setExhausted] = useState(false)
  const stopRef = useRef(false)

  useEffect(() => {
    stopRef.current = false
    let cancelled = false

    async function tick(count: number) {
      if (stopRef.current || cancelled) return
      if (count >= maxAttempts) {
        setExhausted(true)
        return
      }

      try {
        const res = await fetch(`/api/briefing/status/${encodeURIComponent(token)}`, {
          cache: 'no-store',
        })
        if (cancelled) return
        const data = (await res.json()) as StatusResponse
        if (data.status === 'ready') {
          stopRef.current = true
          router.refresh()
          return
        }
        if (data.status === 'failed' || data.status === 'unknown') {
          stopRef.current = true
          router.refresh()
          return
        }
      } catch {
        /* network blip — einfach weiter pollen */
      }

      setAttempts(count + 1)
      setTimeout(() => tick(count + 1), pollEveryMs)
    }

    setTimeout(() => tick(0), pollEveryMs)

    return () => {
      cancelled = true
      stopRef.current = true
    }
  }, [token, pollEveryMs, maxAttempts, router])

  if (exhausted) {
    return (
      <div
        className="font-mono"
        style={{
          marginTop: 32,
          fontSize: 12,
          color: 'var(--fg-faint)',
          letterSpacing: '0.04em',
        }}
      >
        Polling pausiert. Lade die Seite manuell neu, wenn das Briefing fertig sein sollte.
      </div>
    )
  }

  return (
    <div
      style={{
        marginTop: 32,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 16px',
        borderRadius: 6,
        background: 'rgba(124, 169, 204, 0.06)',
        border: '1px solid rgba(124, 169, 204, 0.24)',
      }}
    >
      <motion.span
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, ease: 'linear', repeat: Infinity }}
        style={{ display: 'inline-flex', color: 'var(--info-fg)' }}
      >
        <Loader2 size={14} strokeWidth={1.75} />
      </motion.span>
      <span
        className="font-mono"
        style={{
          fontSize: 11,
          letterSpacing: '0.10em',
          textTransform: 'uppercase',
          color: 'var(--info-fg)',
        }}
      >
        Auto-Reload aktiv · Versuch {attempts + 1} / {maxAttempts}
      </span>
    </div>
  )
}
