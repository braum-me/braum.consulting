'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Section from '@/components/ui/Section'
import Eyebrow from '@/components/ui/Eyebrow'
import ItalicAccent from '@/components/ui/ItalicAccent'
import AccentGlow from '@/components/ui/AccentGlow'
import LagebildFormSlot from '@/components/ui/LagebildFormSlot'
import { ProcessStepVisual, type ProcessStepKey } from '@/components/ui/ProcessStepVisuals'

const STEPS: Array<{
  num:    string
  title:  string
  lead:   string
  body:   string
  visual: ProcessStepKey
}> = [
  {
    num: '01',
    lead: 'Lagebild',
    title: 'Lagebild',
    body: 'Was ist da? Was blockiert? Was ist kritisch?',
    visual: 'lagebild',
  },
  {
    num: '02',
    lead: 'Kurs setzen',
    title: 'Kurs setzen',
    body: 'Prioritäten, Zielbild, Roadmap, Aufwand.',
    visual: 'kurs',
  },
  {
    num: '03',
    lead: 'Manövrieren',
    title: 'Manövrieren',
    body: 'Umsetzung mit klaren Zwischenständen.',
    visual: 'manoeuvrieren',
  },
  {
    num: '04',
    lead: 'Übergabe',
    title: 'Übergabe',
    body: 'Dokumentation, Schulung, Betriebssicherheit.',
    visual: 'uebergabe',
  },
]

const LAGEBILD_POINTS: Array<{ num: string; text: string }> = [
  { num: '01', text: 'Analyse von Website, Tools, Prozessen oder AI-Ideen' },
  { num: '02', text: 'Identifikation der größten digitalen Reibungspunkte' },
  { num: '03', text: 'Priorisierung nach Wirkung, Aufwand und Alltag' },
  { num: '04', text: 'Konkrete nächste Schritte' },
  { num: '05', text: 'Optionaler Umsetzungsplan' },
]

const NOT_ITEMS: Array<{ num: string; text: string }> = [
  { num: '01', text: 'Keine 80-Folien-Beratung' },
  { num: '02', text: 'Keine klassische Werbeagentur' },
  { num: '03', text: 'Kein reiner Freelancer für einzelne Tickets' },
  { num: '04', text: 'Kein AI-Hype ohne Prozess' },
  { num: '05', text: 'Kein Enterprise-Overkill für kleine Unternehmen' },
]

/**
 * Lotsenprinzip mit drei Spalten:
 *   - Links:  Lagebild-Karte (Einstieg) + Form-Slot
 *   - Mitte:  4-Step Vertical Timeline mit Accent-Line + Dots
 *   - Rechts: Klarheit-vorab-Karte mit dem was NICHT passiert
 *
 * Accent-Line in der Mitte scaleY-animated per GSAP ScrollTrigger.
 * ConnectionMark-Akzente an den Sidecards zeigen visuell zur Timeline.
 */
/** Pfad-Geometrie für die Lotsen-Route. Subtile S-Welle in einem
 *  60×1000 Viewbox; preserveAspectRatio='none' streckt das Ganze vertikal
 *  über die Timeline-Höhe. Pfadlänge wird einmal mit getTotalLength()
 *  gemessen und für stroke-dashoffset verwendet. */
const ROUTE_D =
  'M 30 0 ' +
  'C 30 80, 42 140, 30 220 ' +
  'C 18 300, 18 380, 30 460 ' +
  'C 42 540, 42 620, 30 700 ' +
  'C 18 780, 18 880, 30 1000'

export default function Process() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const routeRef   = useRef<SVGPathElement>(null)
  const headRef    = useRef<SVGCircleElement>(null)
  const railRef    = useRef<HTMLDivElement>(null)
  const goalRef    = useRef<HTMLSpanElement>(null)
  const [routeHeight, setRouteHeight] = useState<number | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.registerPlugin(ScrollTrigger)
      const path = routeRef.current
      const head = headRef.current
      if (!path) return

      const length = path.getTotalLength()
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(path, { strokeDashoffset: 0 })
        if (head) gsap.set(head, { opacity: 0 })
        return
      }

      // Fixe Dauer, EINMAL beim Reinscrollen — konsistent auf Mobile & Desktop.
      // (Vorher: scrub über die ganze Sektionshöhe → auf Mobile zeichnete sich
      // die Route viel zu langsam, man scrollte dran vorbei.)
      const state = { p: 0 }
      const tween = gsap.to(state, {
        p: 1,
        duration: 2.4,
        ease: 'power1.inOut',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
        },
        onUpdate: () => {
          gsap.set(path, { strokeDashoffset: length * (1 - state.p) })
          if (!head) return
          const p = state.p
          if (p <= 0.001 || p >= 0.999) {
            gsap.set(head, { opacity: 0 })
            return
          }
          const point = path.getPointAtLength(length * p)
          gsap.set(head, { attr: { cx: point.x, cy: point.y }, opacity: 1 })
        },
      })

      return () => {
        tween.kill()
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Route-Höhe exakt bis zum „Das Ziel"-Knoten messen, damit die gezeichnete
  // Linie auf jedem Breakpoint genau dort endet (Mobile nicht zu kurz, Desktop
  // nicht drüber hinaus) — unabhängig von Box-/Textumbruch-Höhe.
  useEffect(() => {
    const rail = railRef.current
    const goal = goalRef.current
    if (!rail || !goal) return
    const measure = () => {
      const railTop = rail.getBoundingClientRect().top
      const g = goal.getBoundingClientRect()
      setRouteHeight(Math.max(0, g.top + g.height / 2 - railTop))
    }
    measure()
    // Nachmessen nach dem ersten Layout (Fonts/Bilder settlen) — robuster auf Mobile.
    const raf = requestAnimationFrame(() => requestAnimationFrame(measure))
    const ro = new ResizeObserver(measure)
    ro.observe(rail)
    window.addEventListener('resize', measure)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  return (
    <Section
      id="lotsenprinzip"
      className="relative py-20 md:py-28"
      background={<AccentGlow position="spread" intensity="low" />}
    >
      <div ref={sectionRef as React.RefObject<HTMLDivElement>}>
        <div className="max-w-[760px]">
          <Eyebrow num="04">Arbeitsweise</Eyebrow>
          <h2
            className="mt-6 font-display font-bold"
            style={{
              fontSize: 'clamp(32px, 4vw, 56px)',
              lineHeight: 'var(--lh-display)',
              letterSpacing: 'var(--tr-display)',
              color: 'var(--fg-default)',
            }}
          >
            Das <ItalicAccent>Lotsenprinzip</ItalicAccent>.
          </h2>
          <p
            className="mt-6 max-w-[560px] font-body"
            style={{
              fontSize: '17px',
              lineHeight: 1.6,
              color: 'var(--fg-muted)',
            }}
          >
            Vom ersten Lagebild bis zur sauberen Übergabe. Links der
            Einstieg, in der Mitte die vier Etappen, rechts was bewusst
            außerhalb dieser Reise liegt.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-10 md:mt-20 md:grid-cols-12 md:gap-8">

          {/* ── Lagebild links (Einstieg, verbindet zu Step 01) ── */}
          <aside className="relative md:col-span-3 md:self-start">
            <ConnectionMark position="right-top" label="Verbindet mit Schritt 01" />
            <div className="glass-card relative" style={{ padding: '28px 24px' }}>
              <div className="relative z-[3]">
                <p
                  className="font-mono uppercase"
                  style={{
                    fontSize: 'var(--t-micro)',
                    letterSpacing: 'var(--tr-eyebrow)',
                    color: 'var(--brand)',
                  }}
                >
                  Dein Einstieg
                </p>
                <h3
                  className="mt-3 font-display font-bold"
                  style={{
                    fontSize: 'clamp(24px, 2.1vw, 30px)',
                    lineHeight: 1.15,
                    letterSpacing: 'var(--tr-heading)',
                    color: 'var(--fg-default)',
                  }}
                >
                  Digitales <ItalicAccent>Lagebild</ItalicAccent>.
                </h3>
                <p
                  className="mt-4 font-body"
                  style={{
                    fontSize: '14px',
                    lineHeight: 1.55,
                    color: 'var(--fg-muted)',
                  }}
                >
                  Bevor etwas gebaut wird, klären wir wo du stehst, was
                  wirklich blockiert und welcher nächste Schritt sinnvoll ist.
                </p>
                <ol
                  className="mt-5"
                  style={{ listStyle: 'none', padding: 0, margin: 0 }}
                >
                  {LAGEBILD_POINTS.map((item, i) => (
                    <li
                      key={item.num}
                      className="flex items-baseline gap-3 py-2.5"
                      style={{
                        borderTop: i === 0 ? 'none' : '1px solid var(--border-subtle)',
                      }}
                    >
                      <span
                        className="font-mono shrink-0"
                        style={{
                          fontSize: '10px',
                          letterSpacing: 'var(--tr-eyebrow)',
                          color: 'var(--brand)',
                          minWidth: '20px',
                        }}
                      >
                        {item.num}
                      </span>
                      <p
                        className="font-body"
                        style={{
                          fontSize: '13px',
                          lineHeight: 1.55,
                          color: 'var(--fg-default)',
                          opacity: 0.88,
                        }}
                      >
                        {item.text}
                      </p>
                    </li>
                  ))}
                </ol>

                <div style={{ marginTop: '20px' }}>
                  <LagebildFormSlot />
                </div>
              </div>
            </div>
          </aside>

          {/* ── Timeline Mitte ── */}
          <div className="md:col-span-6">
            <div ref={railRef} className="relative">
              {/* SVG-Route — subtile S-Welle, gezeichnet via stroke-dashoffset.
                  preserveAspectRatio='none' lässt das Viewbox vertikal mit
                  der Timeline-Höhe mitwachsen. */}
              <svg
                aria-hidden
                preserveAspectRatio="none"
                viewBox="0 0 60 1000"
                className="pointer-events-none absolute top-0 left-[-14px] w-[60px]"
                style={{ overflow: 'visible', height: routeHeight ?? '100%' }}
              >
                <defs>
                  <linearGradient id="route-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%"   stopColor="#DC8044" stopOpacity="0.95" />
                    <stop offset="50%"  stopColor="#C8622A" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#A53922" stopOpacity="0.85" />
                  </linearGradient>
                </defs>

                {/* Tick-Marks alle 50 Einheiten — wirken wie nautische
                    Chart-Markierungen entlang der Route */}
                {Array.from({ length: 19 }).map((_, i) => {
                  const y = (i + 1) * 50
                  return (
                    <line
                      key={i}
                      x1="22" y1={y}
                      x2="38" y2={y}
                      stroke="rgba(168, 117, 83, 0.16)"
                      strokeWidth="0.8"
                    />
                  )
                })}

                {/* Base-Route (dashed, dezent — die "geplante Route") */}
                <path
                  d={ROUTE_D}
                  fill="none"
                  stroke="rgba(168, 117, 83, 0.22)"
                  strokeWidth="1"
                  strokeDasharray="3 5"
                  strokeLinecap="round"
                />

                {/* Aktive Route — wird per ScrollTrigger gezeichnet */}
                <path
                  ref={routeRef}
                  d={ROUTE_D}
                  fill="none"
                  stroke="url(#route-gradient)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  style={{
                    filter: 'drop-shadow(0 0 6px rgba(220, 128, 68, 0.55))',
                  }}
                />

                {/* Head-Indicator — glühender Punkt am Ende der gezeichneten
                    Linie. Position wird per onUpdate gesetzt. */}
                <circle
                  ref={headRef}
                  cx="30" cy="0" r="3.5"
                  fill="#F0944A"
                  opacity="0"
                  style={{
                    filter:
                      'drop-shadow(0 0 8px rgba(240, 148, 74, 0.85)) drop-shadow(0 0 14px rgba(220, 128, 68, 0.6))',
                  }}
                />
              </svg>

              <ol className="space-y-12 md:space-y-16">
                {STEPS.map(s => (
                  <li key={s.num} className="relative pl-14 md:pl-16">
                    <div className="absolute left-[10px] top-1.5 inline-flex h-3 w-3 items-center justify-center">
                      <span
                        className="block h-3 w-3"
                        style={{
                          background: 'var(--bg-base)',
                          border: '1px solid var(--accent)',
                          borderRadius: 'var(--r-pill)',
                          boxShadow: '0 0 8px rgba(200, 98, 42, 0.5)',
                        }}
                      />
                    </div>

                    <div className="md:grid md:grid-cols-[1fr_300px] md:items-center md:gap-8">
                      <div>
                        <p
                          className="font-mono uppercase"
                          style={{
                            fontSize: 'var(--t-micro)',
                            letterSpacing: 'var(--tr-eyebrow)',
                            color: 'var(--brand)',
                          }}
                        >
                          {s.num} · {s.lead}
                        </p>
                        <h3
                          className="mt-3 font-display font-semibold"
                          style={{
                            fontSize: 'clamp(20px, 2vw, 26px)',
                            lineHeight: 1.2,
                            letterSpacing: 'var(--tr-heading)',
                            color: 'var(--fg-default)',
                          }}
                        >
                          {s.title}
                        </h3>
                        <p
                          className="mt-3 font-body"
                          style={{
                            fontSize: '15px',
                            lineHeight: 1.6,
                            color: 'var(--fg-muted)',
                            maxWidth: '440px',
                          }}
                        >
                          {s.body}
                        </p>
                      </div>
                      <div className="mt-6 md:mt-0" style={{ maxWidth: '300px' }}>
                        <ProcessStepVisual step={s.visual} />
                      </div>
                    </div>
                  </li>
                ))}

                {/* ── Ankunft: „Das Ziel" als sauberer Endpunkt der Route ── */}
                <li className="relative pl-14 md:pl-16">
                  <div className="absolute left-[6px] top-1.5 inline-flex h-4 w-4 items-center justify-center">
                    <span
                      ref={goalRef}
                      className="block h-4 w-4"
                      style={{
                        background: 'var(--accent)',
                        borderRadius: 'var(--r-pill)',
                        boxShadow: '0 0 16px rgba(200, 98, 42, 0.8)',
                      }}
                    />
                  </div>
                  <div
                    className="relative overflow-hidden"
                    style={{
                      padding: '24px 26px',
                      borderRadius: '14px',
                      border: '1px solid var(--accent)',
                      background:
                        'radial-gradient(130% 150% at 0% 0%, rgba(200, 98, 42, 0.16) 0%, rgba(15, 14, 12, 0.55) 55%, var(--bg-base) 100%)',
                      boxShadow: '0 0 40px -14px rgba(200, 98, 42, 0.4)',
                    }}
                  >
                    <p
                      className="font-mono uppercase"
                      style={{
                        fontSize: 'var(--t-micro)',
                        letterSpacing: 'var(--tr-eyebrow)',
                        color: 'var(--brand)',
                      }}
                    >
                      Das Ziel · Ankunft
                    </p>
                    <p
                      className="mt-4 font-display font-medium"
                      style={{
                        fontSize: 'clamp(18px, 1.9vw, 23px)',
                        lineHeight: 1.4,
                        letterSpacing: '-0.005em',
                        color: 'var(--fg-default)',
                      }}
                    >
                      Ziel ist nicht, mich dauerhaft zu brauchen. Ziel ist, dass dein
                      Team danach sicherer selbst weiterarbeitet.
                    </p>
                  </div>
                </li>
              </ol>
            </div>
          </div>

          {/* ── Klarheit-vorab rechts (verbindet zu Step 04) ── */}
          <aside className="relative md:col-span-3 md:self-end">
            <ConnectionMark position="left-bottom" label="Verbindet mit Schritt 04" />
            <div className="glass-card relative" style={{ padding: '28px 24px' }}>
              <div className="relative z-[3]">
                <p
                  className="font-mono uppercase"
                  style={{
                    fontSize: 'var(--t-micro)',
                    letterSpacing: 'var(--tr-eyebrow)',
                    color: 'var(--brand)',
                  }}
                >
                  Klarheit vorab
                </p>
                <h3
                  className="mt-3 font-display font-bold"
                  style={{
                    fontSize: 'clamp(24px, 2.1vw, 30px)',
                    lineHeight: 1.15,
                    letterSpacing: 'var(--tr-heading)',
                    color: 'var(--fg-default)',
                  }}
                >
                  Was du hier <ItalicAccent>nicht</ItalicAccent> bekommst.
                </h3>

                <ol
                  className="mt-5"
                  style={{ listStyle: 'none', padding: 0, margin: 0 }}
                >
                  {NOT_ITEMS.map((item, i) => (
                    <li
                      key={item.num}
                      className="flex items-baseline gap-3 py-2.5"
                      style={{
                        borderTop: i === 0 ? 'none' : '1px solid var(--border-subtle)',
                      }}
                    >
                      <span
                        className="font-mono shrink-0"
                        style={{
                          fontSize: '10px',
                          letterSpacing: 'var(--tr-eyebrow)',
                          color: 'var(--brand)',
                          minWidth: '20px',
                        }}
                      >
                        {item.num}
                      </span>
                      <p
                        className="font-body"
                        style={{
                          fontSize: '13px',
                          lineHeight: 1.55,
                          color: 'var(--fg-default)',
                          opacity: 0.88,
                        }}
                      >
                        {item.text}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </Section>
  )
}

/**
 * Dezenter Verbindungs-Akzent: 1-Linie + Pulse-Dot von der Sidecard
 * Richtung Timeline. Position auf Desktop sichtbar.
 */
function ConnectionMark({
  position,
  label,
}: {
  position: 'right-top' | 'left-bottom'
  label:    string
}) {
  const isRight = position === 'right-top'
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute hidden md:flex md:items-center"
      style={{
        top:    isRight ? '32px' : 'auto',
        bottom: isRight ? 'auto' : '32px',
        right:  isRight ? '-32px' : 'auto',
        left:   isRight ? 'auto' : '-32px',
        height: '12px',
        zIndex: 4,
      }}
    >
      <span
        className="block"
        style={{
          width: '32px',
          height: '1px',
          background: isRight
            ? 'linear-gradient(to right, rgba(220, 128, 68, 0.85), rgba(220, 128, 68, 0.15))'
            : 'linear-gradient(to left, rgba(220, 128, 68, 0.85), rgba(220, 128, 68, 0.15))',
        }}
      />
      <span
        className="absolute"
        style={{
          left:  isRight ? '-4px' : 'auto',
          right: isRight ? 'auto' : '-4px',
          width:  '8px',
          height: '8px',
          borderRadius: '999px',
          background: 'var(--accent)',
          boxShadow: '0 0 12px rgba(220, 128, 68, 0.6)',
        }}
      />
      <span className="sr-only">{label}</span>
    </div>
  )
}
