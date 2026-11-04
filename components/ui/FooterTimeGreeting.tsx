'use client'

import { useEffect, useState } from 'react'

/**
 * Time-Aware Footer-Greeting für Frankfurt-TZ.
 * Hydration-safe: rendert auf Server null, kommt erst client-side dazu.
 *
 *   06:00 – 09:00 → „Stefan plant gerade den Tag"
 *   09:00 – 18:00 → „Stefan ist online — kurze Mail reicht"
 *   18:00 – 22:00 → „Stefan ist erreichbar bis spätabends"
 *   22:00 – 06:00 → „Stefan antwortet morgen früh"
 */
export default function FooterTimeGreeting() {
  const [snapshot, setSnapshot] = useState<{
    time:     string
    message:  string
  } | null>(null)

  useEffect(() => {
    function tick() {
      const fmt = new Intl.DateTimeFormat('de-DE', {
        hour:     '2-digit',
        minute:   '2-digit',
        timeZone: 'Europe/Berlin',
      })
      const time = fmt.format(new Date())
      const hourStr = new Intl.DateTimeFormat('de-DE', {
        hour:     '2-digit',
        timeZone: 'Europe/Berlin',
        hour12:   false,
      }).format(new Date())
      const hour = parseInt(hourStr, 10)

      let message: string
      if (hour >= 6 && hour < 9) {
        message = 'Stefan plant gerade den Tag'
      } else if (hour >= 9 && hour < 18) {
        message = 'Stefan ist online · kurze Mail reicht'
      } else if (hour >= 18 && hour < 22) {
        message = 'Stefan ist bis spätabends erreichbar'
      } else {
        message = 'Stefan antwortet morgen früh'
      }
      setSnapshot({ time, message })
    }

    tick()
    // Re-tick alle 60s
    const id = setInterval(tick, 60_000)
    return () => clearInterval(id)
  }, [])

  if (!snapshot) {
    return (
      <div
        className="inline-flex items-center gap-2 font-mono uppercase"
        style={{
          fontSize: '10px',
          letterSpacing: '0.16em',
          color: 'var(--fg-subtle)',
        }}
      >
        Frankfurt
      </div>
    )
  }

  return (
    <div
      className="flex flex-col gap-1.5"
      style={{
        fontSize: '10px',
        letterSpacing: '0.16em',
        color: 'var(--fg-subtle)',
      }}
    >
      <div className="inline-flex items-center gap-2 font-mono uppercase">
        <span
          aria-hidden
          style={{
            width: 6,
            height: 6,
            borderRadius: '999px',
            background: 'var(--success-fg)',
            boxShadow: '0 0 6px var(--success-fg)',
            display: 'inline-block',
          }}
        />
        Frankfurt · {snapshot.time}
      </div>
      <p
        className="font-mono"
        style={{
          fontSize: '10px',
          letterSpacing: '0.04em',
          color: 'var(--fg-muted)',
          textTransform: 'none',
        }}
      >
        {snapshot.message}
      </p>
    </div>
  )
}
