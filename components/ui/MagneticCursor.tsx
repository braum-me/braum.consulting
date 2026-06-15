'use client'

/**
 * Cursor 2.0 — State-Aware Custom Cursor.
 *
 * States (via `data-cursor` Attribut auf gehovertem Element):
 *   - default (kein Attribut, kein Anchor):  6px-Punkt, brand
 *   - magnetic:                              32px Ring, zieht zum Element-Center
 *   - link (auto-erkannt auf <a>/<button>):  22px Ring
 *   - card:                                  56px Ring + „lesen"-Label rechts
 *   - external:                              32px Ring + ↗-Glyph
 *   - drag:                                  56px Ring + ↔-Glyph
 *
 * Optional Custom-Label via `data-cursor-label="…"` Attribut.
 *
 * Disabled bei Touch-Devices und prefers-reduced-motion. rAF-throttled,
 * lerp 0.22 (etwas snappier als 0.18 für besseres Pointer-Feel).
 *
 * Einmal global in app/layout.tsx rendern. Elements taggen via data-cursor.
 */
import { useEffect, useRef, useState } from 'react'

type CursorState = 'default' | 'magnetic' | 'link' | 'card' | 'external' | 'drag'

const LERP = 0.22

interface StateConfig {
  size:  number
  label: string
  glyph: string
}

const STATE_CONFIG: Record<CursorState, StateConfig> = {
  default:  { size:  6, label: '',       glyph: ''  },
  magnetic: { size: 32, label: '',       glyph: ''  },
  link:     { size: 22, label: '',       glyph: ''  },
  card:     { size: 56, label: 'lesen',  glyph: ''  },
  external: { size: 32, label: '',       glyph: '↗' },
  drag:     { size: 56, label: '',       glyph: '↔' },
}

function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return true
  if (window.matchMedia('(hover: none)').matches) return true
  if ('ontouchstart' in window) return true
  return false
}

function isReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function MagneticCursor() {
  const [enabled, setEnabled] = useState(false)
  const cursorRef = useRef<HTMLDivElement | null>(null)
  const labelRef  = useRef<HTMLSpanElement | null>(null)

  const target  = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })

  const stateRef     = useRef<CursorState>('default')
  const magneticEl   = useRef<HTMLElement | null>(null)
  const rafId        = useRef<number | null>(null)
  const hasMoved     = useRef(false)

  useEffect(() => {
    if (isTouchDevice()) return
    if (isReducedMotion()) return
    setEnabled(true)
  }, [])

  useEffect(() => {
    if (!enabled) return
    const cursor: HTMLDivElement | null = cursorRef.current
    const label:  HTMLSpanElement | null = labelRef.current
    if (!cursor || !label) return
    const cursorEl = cursor
    const labelEl  = label

    const previousBodyCursor = document.body.style.cursor
    const previousHtmlCursor = document.documentElement.style.cursor
    document.body.style.cursor = 'none'
    document.documentElement.style.cursor = 'none'

    function detectStateFor(el: HTMLElement | null): {
      state:    CursorState
      cssLabel: string
      magnetic: HTMLElement | null
    } {
      if (!el) return { state: 'default', cssLabel: '', magnetic: null }

      // Explicit data-cursor wins
      const dcEl = el.closest<HTMLElement>('[data-cursor]')
      if (dcEl) {
        const dc = (dcEl.dataset.cursor as CursorState) || 'default'
        const customLabel = dcEl.dataset.cursorLabel ?? STATE_CONFIG[dc]?.label ?? ''
        const isMagnetic = dc === 'magnetic'
        return {
          state: dc in STATE_CONFIG ? dc : 'default',
          cssLabel: STATE_CONFIG[dc as CursorState]?.glyph
            ? STATE_CONFIG[dc as CursorState].glyph
            : customLabel,
          magnetic: isMagnetic ? dcEl : null,
        }
      }

      // External link auto-detect
      const extAnchor = el.closest<HTMLElement>('a[target="_blank"], a[rel*="external"]')
      if (extAnchor) return { state: 'external', cssLabel: '↗', magnetic: null }

      // Generic link/button auto-detect
      const linkEl = el.closest<HTMLElement>('a[href], button:not(:disabled)')
      if (linkEl) return { state: 'link', cssLabel: '', magnetic: null }

      return { state: 'default', cssLabel: '', magnetic: null }
    }

    function applyState(s: CursorState, lbl: string) {
      if (stateRef.current === s && labelEl.textContent === lbl) return
      stateRef.current = s
      cursorEl.dataset.state = s
      labelEl.textContent = lbl
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!hasMoved.current) {
        current.current.x = e.clientX
        current.current.y = e.clientY
        hasMoved.current = true
      }
      if (magneticEl.current) {
        const rect = magneticEl.current.getBoundingClientRect()
        target.current.x = rect.left + rect.width / 2
        target.current.y = rect.top + rect.height / 2
      } else {
        target.current.x = e.clientX
        target.current.y = e.clientY
      }
    }

    const onMouseOver = (e: MouseEvent) => {
      const result = detectStateFor(e.target as HTMLElement | null)
      magneticEl.current = result.magnetic
      applyState(result.state, result.cssLabel)
    }

    const onMouseOut = (e: MouseEvent) => {
      // Wenn related target außerhalb des aktuellen magnetic-Elements
      const related = e.relatedTarget as HTMLElement | null
      const result = detectStateFor(related)
      magneticEl.current = result.magnetic
      applyState(result.state, result.cssLabel)
    }

    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * LERP
      current.current.y += (target.current.y - current.current.y) * LERP

      const cfg = STATE_CONFIG[stateRef.current]
      const offset = cfg.size / 2

      cursorEl.style.transform = `translate3d(${current.current.x - offset}px, ${
        current.current.y - offset
      }px, 0)`

      rafId.current = window.requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    document.addEventListener('mouseover', onMouseOver, { passive: true })
    document.addEventListener('mouseout', onMouseOut, { passive: true })
    rafId.current = window.requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseover', onMouseOver)
      document.removeEventListener('mouseout', onMouseOut)
      if (rafId.current !== null) {
        window.cancelAnimationFrame(rafId.current)
      }
      document.body.style.cursor = previousBodyCursor
      document.documentElement.style.cursor = previousHtmlCursor
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div
      ref={cursorRef}
      aria-hidden
      data-state="default"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 6,
        height: 6,
        borderRadius: '50%',
        backgroundColor: 'var(--brand)',
        pointerEvents: 'none',
        // Immer ganz oben — über Cookie-Banner (z-60), Skip-Link (z-100),
        // Command-Palette etc. Sonst ist der Custom-Cursor dort verdeckt und
        // (weil body cursor:none) unsichtbar. pointerEvents:none → blockt nichts.
        zIndex: 2147483647,
        opacity: 0.95,
        transition:
          'width 220ms cubic-bezier(0.22, 1, 0.36, 1), height 220ms cubic-bezier(0.22, 1, 0.36, 1), background-color 220ms ease, border 220ms ease, opacity 220ms ease',
        willChange: 'transform, width, height',
        transform: 'translate3d(-100px, -100px, 0)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span
        ref={labelRef}
        style={{
          fontFamily: 'var(--font-geist-mono)',
          fontSize: '10px',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--brand)',
          mixBlendMode: 'difference',
          whiteSpace: 'nowrap',
          opacity: 0,
          transition: 'opacity 180ms ease',
        }}
      />
      <style>{`
        [data-state="magnetic"] {
          width:  32px !important;
          height: 32px !important;
          background-color: transparent !important;
          border: 1.5px solid var(--brand);
          opacity: 0.8 !important;
        }
        [data-state="link"] {
          width:  22px !important;
          height: 22px !important;
          background-color: transparent !important;
          border: 1.5px solid var(--brand);
          opacity: 0.85 !important;
        }
        [data-state="card"] {
          width:  56px !important;
          height: 56px !important;
          background-color: rgba(220, 128, 68, 0.10) !important;
          border: 1.5px solid var(--brand);
          opacity: 0.95 !important;
        }
        [data-state="card"] > span {
          opacity: 1;
          color: var(--brand);
        }
        [data-state="external"] {
          width:  32px !important;
          height: 32px !important;
          background-color: transparent !important;
          border: 1.5px solid var(--brand);
          opacity: 0.9 !important;
        }
        [data-state="external"] > span,
        [data-state="drag"] > span {
          opacity: 1;
          font-size: 14px;
          color: var(--brand);
        }
        [data-state="drag"] {
          width:  56px !important;
          height: 56px !important;
          background-color: transparent !important;
          border: 1.5px solid var(--brand);
          opacity: 0.9 !important;
        }
      `}</style>
    </div>
  )
}
