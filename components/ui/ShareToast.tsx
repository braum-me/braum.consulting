'use client'

/**
 * Globaler Toast-Manager via window-Event-Bus.
 *
 * Usage:
 *   import { showToast } from '@/components/ui/ShareToast'
 *   showToast('Link kopiert')
 *
 * Mount `<ShareToast />` einmal im Layout/ClientChrome.
 */

import { useEffect, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'

const EVENT_NAME = 'braum:toast'
const DURATION_MS = 2200

interface ToastMessage {
  id:   number
  text: string
}

export function showToast(text: string) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(
    new CustomEvent<ToastMessage>(EVENT_NAME, {
      detail: { id: Date.now(), text },
    }),
  )
}

export default function ShareToast() {
  const [toast, setToast] = useState<ToastMessage | null>(null)

  useEffect(() => {
    function handler(e: Event) {
      const ce = e as CustomEvent<ToastMessage>
      setToast(ce.detail)
    }
    window.addEventListener(EVENT_NAME, handler)
    return () => window.removeEventListener(EVENT_NAME, handler)
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), DURATION_MS)
    return () => clearTimeout(t)
  }, [toast])

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        pointerEvents: 'none',
      }}
    >
      {toast && (
        <div
          key={toast.id}
          className="font-mono uppercase"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 20px',
            background:
              'linear-gradient(145deg, rgba(28, 27, 24, 0.95), rgba(15, 14, 12, 0.95))',
            border: '1px solid rgba(220, 128, 68, 0.45)',
            borderRadius: 'var(--r-pill)',
            color: 'var(--fg-default)',
            fontSize: 11,
            letterSpacing: '0.18em',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 16px 36px rgba(0, 0, 0, 0.45), 0 0 24px rgba(220, 128, 68, 0.20)',
            animation: 'toast-pop 240ms cubic-bezier(0.22, 1, 0.36, 1) both',
          }}
        >
          <CheckCircle2 size={14} strokeWidth={1.8} style={{ color: 'var(--brand)' }} />
          {toast.text}
        </div>
      )}

      <style>{`
        @keyframes toast-pop {
          from { opacity: 0; transform: translateY(12px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  )
}
