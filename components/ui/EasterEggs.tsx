'use client'

/**
 * Easter Eggs für die treue Audience und die Awwwards-Jury.
 *
 *   1. Konami-Code (↑↑↓↓←→←→ba)
 *      → kurze Lotse-Banner-Einblendung mit Stefan-Portrait
 *
 *   2. 5× Klick auf das Logo innerhalb von 3s
 *      → Token-Inspector-Panel (Brand-Tokens, Farben, Spacings)
 *
 *   3. DevTools-Open-Detection (window-size-Diff)
 *      → console.log ASCII-Art-Logo + Mandat-Hinweis (genau einmal)
 *
 * Mounted einmal in app/layout.tsx.
 */

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'

const KONAMI: string[] = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a',
]

const TOKENS: Array<{ name: string; value: string; sample?: string }> = [
  { name: '--bg-base',       value: '#0F0E0C', sample: '#0F0E0C' },
  { name: '--bg-elevated',   value: '#1A1816', sample: '#1A1816' },
  { name: '--fg-default',    value: '#F2F0EB', sample: '#F2F0EB' },
  { name: '--fg-muted',      value: '#9F9B92', sample: '#9F9B92' },
  { name: '--fg-subtle',     value: '#6C6862', sample: '#6C6862' },
  { name: '--brand',         value: '#DC8044', sample: '#DC8044' },
  { name: '--accent',        value: '#C8622A', sample: '#C8622A' },
  { name: '--success-fg',    value: '#6CB082', sample: '#6CB082' },
  { name: '--warning-fg',    value: '#E0B055', sample: '#E0B055' },
  { name: '--info-fg',       value: '#7CA9CC', sample: '#7CA9CC' },
  { name: 'font-display',    value: 'Akmorn Grotesque' },
  { name: 'font-body',       value: 'Geist Sans' },
  { name: 'font-mono',       value: 'Geist Mono' },
  { name: 'font-italic',     value: 'Instrument Serif Italic' },
]

const ASCII_LOGO = `

   ┌─────────────────────────────────┐
   │   B R A U M  C O N S U L T I N G │
   │   ───────────────────────────── │
   │   Operator. Digitaler Lotse.    │
   └─────────────────────────────────┘

   Du hast die Konsole geöffnet.
   Kein Hiring, aber Mandate ja:
   → info@braum.consulting

`

export default function EasterEggs() {
  const reduceMotion = useReducedMotion()

  const [konamiOpen, setKonamiOpen] = useState(false)
  const [tokensOpen, setTokensOpen] = useState(false)

  const konamiBuffer  = useRef<string[]>([])
  const logoClickTime = useRef<number[]>([])

  /* ── Konami ──────────────────────────────────────────────────────── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      konamiBuffer.current.push(e.key)
      if (konamiBuffer.current.length > KONAMI.length) {
        konamiBuffer.current.shift()
      }
      const matches = KONAMI.every((k, i) =>
        konamiBuffer.current[i]?.toLowerCase() === k.toLowerCase(),
      )
      if (matches) {
        konamiBuffer.current = []
        setKonamiOpen(true)
        setTimeout(() => setKonamiOpen(false), 2200)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  /* ── 5× Logo-Klick → Token-Inspector ─────────────────────────────── */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      const logo = target?.closest('.site-logo')
      if (!logo) return

      const now = Date.now()
      logoClickTime.current.push(now)
      // Nur letzte 3s behalten
      logoClickTime.current = logoClickTime.current.filter(t => now - t < 3000)

      if (logoClickTime.current.length >= 5) {
        logoClickTime.current = []
        setTokensOpen(true)
      }
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  /* ── DevTools-Open: einmaliger ASCII-Log ─────────────────────────── */
  useEffect(() => {
    const KEY = 'bc-devtools-logged'
    if (sessionStorage.getItem(KEY)) return

    const threshold = 160
    const widthDiff  = window.outerWidth  - window.innerWidth
    const heightDiff = window.outerHeight - window.innerHeight

    function checkOpen(): boolean {
      const wd = window.outerWidth  - window.innerWidth
      const hd = window.outerHeight - window.innerHeight
      return wd > threshold || hd > threshold
    }

    let opened = checkOpen() || widthDiff > threshold || heightDiff > threshold

    const onResize = () => {
      if (opened) return
      if (checkOpen()) {
        opened = true
        console.log(
          `%c${ASCII_LOGO}`,
          'color:#DC8044;font-family:monospace;font-size:11px;line-height:1.3;',
        )
        sessionStorage.setItem(KEY, '1')
      }
    }

    if (opened) {
      console.log(
        `%c${ASCII_LOGO}`,
        'color:#DC8044;font-family:monospace;font-size:11px;line-height:1.3;',
      )
      sessionStorage.setItem(KEY, '1')
    } else {
      window.addEventListener('resize', onResize, { passive: true })
    }

    return () => window.removeEventListener('resize', onResize)
  }, [])

  /* ── Escape schließt Token-Inspector ─────────────────────────────── */
  useEffect(() => {
    if (!tokensOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setTokensOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [tokensOpen])

  return (
    <>
      {/* Konami-Banner */}
      <AnimatePresence>
        {konamiOpen && (
          <motion.div
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 30, scale: 0.96 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.96 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none fixed left-1/2 top-1/2 z-[100] flex -translate-x-1/2 -translate-y-1/2 items-center gap-4"
            style={{
              padding: '20px 28px',
              background: 'rgba(15, 14, 12, 0.85)',
              border: '1px solid var(--accent)',
              borderRadius: 'var(--r-md)',
              backdropFilter: 'blur(14px) saturate(160%)',
              WebkitBackdropFilter: 'blur(14px) saturate(160%)',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.55), 0 0 40px rgba(220, 128, 68, 0.20)',
            }}
            aria-live="polite"
            aria-label="Easter Egg gefunden"
          >
            <div
              className="relative shrink-0 overflow-hidden"
              style={{
                width: 56,
                height: 56,
                borderRadius: '999px',
                border: '2px solid var(--brand)',
              }}
            >
              <Image
                src="/assets/portrait/stefan-cutout.webp"
                alt=""
                fill
                sizes="56px"
                className="object-cover"
                style={{ objectPosition: 'center 12%' }}
              />
            </div>
            <div className="flex flex-col">
              <span
                className="font-mono uppercase"
                style={{ fontSize: '10px', letterSpacing: '0.20em', color: 'var(--brand)' }}
              >
                Lotse aktiviert
              </span>
              <span
                className="font-display font-medium"
                style={{ fontSize: '18px', color: 'var(--fg-default)' }}
              >
                Du kennst dich aus.
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Token-Inspector */}
      <AnimatePresence>
        {tokensOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center"
            style={{ background: 'rgba(15, 14, 12, 0.78)', backdropFilter: 'blur(8px)' }}
            onClick={() => setTokensOpen(false)}
            role="dialog"
            aria-label="Brand-Tokens Inspector"
          >
            <motion.div
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-h-[80vh] w-[min(560px,90vw)] overflow-auto"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--r-md)',
                padding: '32px',
                boxShadow: '0 32px 80px rgba(0, 0, 0, 0.6)',
              }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between" style={{ marginBottom: '24px' }}>
                <span
                  className="font-mono uppercase"
                  style={{ fontSize: '11px', letterSpacing: '0.20em', color: 'var(--brand)' }}
                >
                  Token Inspector · Easter Egg
                </span>
                <button
                  type="button"
                  onClick={() => setTokensOpen(false)}
                  data-cursor="link"
                  className="font-mono uppercase transition-opacity hover:opacity-80"
                  style={{ fontSize: '10px', letterSpacing: '0.16em', color: 'var(--fg-muted)' }}
                >
                  Schliessen [Esc]
                </button>
              </div>
              <h3
                className="font-display font-bold"
                style={{ fontSize: '24px', color: 'var(--fg-default)', marginBottom: '20px' }}
              >
                Brand-Tokens
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {TOKENS.map(t => (
                  <li
                    key={t.name}
                    className="flex items-center gap-4"
                    style={{
                      padding: '10px 0',
                      borderBottom: '1px solid var(--border-subtle)',
                    }}
                  >
                    {t.sample && (
                      <span
                        className="block shrink-0"
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 4,
                          background: t.sample,
                          border: '1px solid rgba(255,255,255,0.10)',
                        }}
                      />
                    )}
                    <code
                      className="font-mono"
                      style={{ fontSize: '12px', color: 'var(--fg-default)', flex: 1 }}
                    >
                      {t.name}
                    </code>
                    <code
                      className="font-mono"
                      style={{ fontSize: '12px', color: 'var(--fg-muted)' }}
                    >
                      {t.value}
                    </code>
                  </li>
                ))}
              </ul>
              <p
                className="font-mono"
                style={{
                  marginTop: '20px',
                  fontSize: '10px',
                  color: 'var(--fg-subtle)',
                  letterSpacing: '0.04em',
                }}
              >
                Live von app/globals.css. Build-System: Tailwind 4 + native CSS-Variables.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
