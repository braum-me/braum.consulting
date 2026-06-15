'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import {
  LayoutTemplate, TrendingUp, Cloud, FolderTree, Sparkles,
  Workflow, Compass, ShieldCheck, Palette, Wrench,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// Szenarien statt Branchen: Der Hero trägt schon die Audience
// („Mittelstand und Industrie"). Dieser Strip ergänzt das *Was* statt es zu
// doppeln — und balanciert bewusst über alle vier Felder (Marke · M365 · AI ·
// Strategie), damit das Bild „Operator über vier Felder" bleibt und nicht
// Richtung „Digitalagentur" kippt.
const SZENARIEN: Array<{ label: string; Icon: LucideIcon }> = [
  { label: 'Website-Relaunch',     Icon: LayoutTemplate }, // Marke
  { label: 'SEO & Sichtbarkeit',   Icon: TrendingUp     }, // Marke
  { label: 'M365-Migration',       Icon: Cloud          }, // M365
  { label: 'SharePoint & Intranet',Icon: FolderTree     }, // M365
  { label: 'KI-Readiness',         Icon: Sparkles       }, // AI
  { label: 'Prozess-Automation',   Icon: Workflow       }, // AI
  { label: 'Digitales Lagebild',   Icon: Compass        }, // Strategie
  { label: 'DSGVO & Security',     Icon: ShieldCheck    }, // Strategie
  { label: 'Brand & Positionierung', Icon: Palette      }, // übergreifend
  { label: 'Wartung & Betrieb',    Icon: Wrench         }, // übergreifend
]

export default function SzenarienStrip() {
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = trackRef.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const distance = el.scrollWidth / 2
    const tween = gsap.to(el, {
      x: -distance,
      duration: 60,
      ease: 'none',
      repeat: -1,
    })

    return () => {
      tween.kill()
    }
  }, [])

  const doubled = [...SZENARIEN, ...SZENARIEN]

  return (
    <section
      aria-label="Szenarien"
      className="relative overflow-hidden"
      style={{
        background: 'var(--bg-base)',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div
        ref={trackRef}
        className="flex whitespace-nowrap py-7 will-change-transform md:py-9"
        style={{ width: 'max-content', gap: 'clamp(20px, 2.4vw, 36px)', paddingLeft: 24, paddingRight: 24 }}
        aria-hidden
      >
        {doubled.map((b, i) => {
          const accent = i % 4 === 0
          return (
            <span
              key={i}
              className="inline-flex items-center font-display"
              style={{
                gap: 'clamp(8px, 1vw, 12px)',
                fontSize: 'clamp(20px, 2.4vw, 34px)',
                fontWeight: 700,
                letterSpacing: 'var(--tr-heading)',
                lineHeight: 1,
                padding: 'clamp(8px, 1vw, 12px) clamp(14px, 1.6vw, 22px)',
                color: accent ? 'var(--brand)' : 'var(--fg-muted)',
                background: accent
                  ? 'linear-gradient(145deg, rgba(220, 128, 68, 0.10), rgba(220, 128, 68, 0.03))'
                  : 'rgba(28, 27, 24, 0.50)',
                border: `1px solid ${accent ? 'rgba(220, 128, 68, 0.28)' : 'rgba(245, 245, 250, 0.08)'}`,
                borderRadius: 'var(--r-pill)',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 8px 18px rgba(0, 0, 0, 0.25)',
              }}
            >
              <span
                className="inline-flex items-center justify-center shrink-0"
                style={{
                  width: 'clamp(22px, 2.4vw, 30px)',
                  height: 'clamp(22px, 2.4vw, 30px)',
                  borderRadius: 6,
                  background: accent
                    ? 'rgba(220, 128, 68, 0.18)'
                    : 'rgba(245, 245, 250, 0.04)',
                  border: `1px solid ${accent ? 'rgba(220, 128, 68, 0.30)' : 'rgba(245, 245, 250, 0.08)'}`,
                  color: accent ? 'var(--brand)' : 'var(--fg-muted)',
                }}
              >
                <b.Icon size={14} strokeWidth={1.6} />
              </span>
              {b.label}
            </span>
          )
        })}
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-32"
        style={{
          background: 'linear-gradient(90deg, var(--bg-base), transparent)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-32"
        style={{
          background: 'linear-gradient(270deg, var(--bg-base), transparent)',
        }}
      />
    </section>
  )
}
