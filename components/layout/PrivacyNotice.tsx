'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Shield } from 'lucide-react'

const STORAGE_KEY = 'braum.privacy-notice.v1'
const OPT_OUT_KEY = 'braum.analytics-opt-out'

export default function PrivacyNotice() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      const ack = window.localStorage.getItem(STORAGE_KEY)
      if (!ack) {
        const t = window.setTimeout(() => setVisible(true), 800)
        return () => window.clearTimeout(t)
      }
    } catch {
      // localStorage geblockt (Private Mode etc.), Banner trotzdem zeigen
      setVisible(true)
    }
  }, [])

  function dismiss() {
    try {
      window.localStorage.setItem(STORAGE_KEY, new Date().toISOString())
    } catch {
      // ignore
    }
    setVisible(false)
  }

  // Esc schließt den Hinweis (Tastatur-Bedienbarkeit).
  useEffect(() => {
    if (!visible) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') dismiss()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [visible])

  function optOut() {
    try {
      window.localStorage.setItem(OPT_OUT_KEY, '1')
      window.localStorage.setItem(STORAGE_KEY, new Date().toISOString())
    } catch {
      // ignore
    }
    setVisible(false)
    // Umami-Script ist bereits geladen — Reload, damit der Opt-Out greift.
    if (typeof window !== 'undefined') window.location.reload()
  }

  if (!visible) return null

  return (
    <div
      role="region"
      aria-label="Datenschutz-Hinweis"
      className="fixed inset-x-0 bottom-0 z-[60] px-3 pb-3 md:inset-x-auto md:right-6 md:bottom-6 md:px-0 md:pb-0"
    >
      {/* Mobile: schlanke Bottom-Bar (volle Breite). Desktop: kompakte,
          rechts verankerte Trust-Karte (~360px) — verdeckt keine Fold-
          Sektion oder Haupt-CTA mehr, statt Full-width-Block. */}
      <div
        className="mx-auto flex w-full max-w-[var(--container-wide)] flex-col gap-3 px-4 py-3 md:mx-0 md:w-[360px] md:max-w-[calc(100vw-3rem)] md:gap-2.5 md:px-5 md:py-4"
        style={{
          background: 'rgba(15, 14, 12, 0.92)',
          backdropFilter: 'blur(16px) saturate(140%)',
          WebkitBackdropFilter: 'blur(16px) saturate(140%)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--r-md)',
          boxShadow: 'var(--sh-3)',
        }}
      >
        {/* Kopf: Icon + Text */}
        <div className="flex items-start gap-3">
          {/* Icon — Desktop only, Mobile zu wenig Platz */}
          <span
            aria-hidden
            className="hidden h-8 w-8 shrink-0 items-center justify-center md:inline-flex"
            style={{
              background: 'rgba(220, 128, 68, 0.12)',
              borderRadius: 'var(--r-sm)',
              color: 'var(--brand)',
            }}
          >
            <Shield size={16} strokeWidth={1.5} />
          </span>

          <div className="flex-1 min-w-0">
            {/* Mobile-Variante (eine Zeile) */}
            <p
              className="font-body md:hidden"
              style={{ fontSize: '12px', lineHeight: 1.4, color: '#C4BFB5' }}
            >
              Cookieless. Keine Werbe-Tracker.{' '}
              <Link
                href="/datenschutz"
                className="underline underline-offset-2"
                style={{ color: 'var(--brand)' }}
              >
                Details
              </Link>
            </p>

            {/* Desktop-Variante (kompakt, max. 2 Zeilen) */}
            <p
              className="hidden font-display font-semibold md:block"
              style={{ fontSize: 'var(--t-body-sm)', lineHeight: 1.25, color: '#F2F0EB' }}
            >
              Keine Werbe-Tracker. Cookieless.
            </p>
            <p
              className="mt-1 hidden font-body md:block"
              style={{ fontSize: '12px', lineHeight: 1.45, color: '#9F9B92' }}
            >
              Kein Google Analytics, keine Pixel — nur self-hosted{' '}
              <span style={{ color: '#F2F0EB' }}>Umami</span> (IP-anonym).{' '}
              <Link
                href="/datenschutz"
                className="underline underline-offset-2 transition-colors duration-200 hover:text-[#F2F0EB]"
                style={{ color: '#DC8044', textDecorationColor: 'rgba(220, 128, 68, 0.4)' }}
              >
                Datenschutz
              </Link>
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex shrink-0 items-center justify-end gap-3 md:justify-between md:gap-4">
          <button
            type="button"
            onClick={optOut}
            className="font-body underline underline-offset-2 transition-colors duration-220 hover:text-[#F2F0EB]"
            style={{
              fontSize: '11px',
              color: '#9F9B92',
              textDecorationColor: 'rgba(159, 155, 146, 0.4)',
            }}
            title="Reichweitenmessung deaktivieren — Widerspruchsrecht nach Art. 21 DSGVO"
          >
            Messung aus
          </button>
          <button
            type="button"
            onClick={dismiss}
            className="inline-flex items-center gap-2 font-body font-medium transition-transform duration-220 hover:-translate-y-px"
            style={{
              fontSize: '12px',
              padding: '8px 14px',
              background: 'var(--accent)',
              color: 'var(--on-accent)',
              borderRadius: 'var(--r-sm)',
              boxShadow: 'var(--sh-1)',
            }}
          >
            Verstanden
          </button>
        </div>
      </div>
    </div>
  )
}
