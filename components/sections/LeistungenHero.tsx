'use client'

import { useEffect, useRef } from 'react'
import { motion, useReducedMotion, useInView } from 'motion/react'
import Link from 'next/link'
import { ArrowDown, Globe, Server, Brain, Compass } from 'lucide-react'
import ItalicAccent from '@/components/ui/ItalicAccent'

const EASE = [0.16, 1, 0.3, 1] as const

const FIELDS = [
  {
    num: '01',
    slug: 'marke',
    title: 'Marke',
    sub: 'Website · Reichweite',
    Icon: Globe,
    accent: '#DC8044',
  },
  {
    num: '02',
    slug: 'm365',
    title: 'IT & Cloud',
    sub: 'M365 · Workspace',
    Icon: Server,
    accent: '#3B82F6',
  },
  {
    num: '03',
    slug: 'ai',
    title: 'KI',
    sub: 'Automatisierung',
    Icon: Brain,
    accent: '#A855F7',
  },
  {
    num: '04',
    slug: 'strategie',
    title: 'Strategie',
    sub: 'Transformation',
    Icon: Compass,
    accent: '#28C840',
  },
] as const

/**
 * Hero für /leistungen — zwei Spalten, links Text, rechts „Operator-Cockpit"
 * mit zentralem b·-Glass + 4 orbitalen Service-Tiles + HeroStatus.
 * Selber Cinematic-Stil wie MarkeHero / M365Hero. Kein R3F.
 */
export default function LeistungenHero() {
  return (
    <section
      aria-label="Leistungen-Hero"
      className="relative w-screen overflow-hidden"
      style={{
        marginLeft: 'calc(-50vw + 50%)',
        background: 'var(--bg-base)',
        paddingTop: '140px',
        paddingBottom: 'clamp(40px, 5vw, 64px)',
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(55% 70% at 75% 35%, rgba(220, 128, 68, 0.16) 0%, transparent 60%),' +
            'radial-gradient(45% 55% at 20% 85%, rgba(146, 48, 30, 0.08) 0%, transparent 60%)',
          zIndex: 1,
        }}
      />

      <div className="relative z-[3] mx-auto w-full max-w-[var(--container-wide)] px-6 md:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start lg:gap-14">
          {/* ── LEFT · Text ── */}
          <div>
            <motion.p
              className="font-mono uppercase"
              style={{
                fontSize: '12px',
                letterSpacing: '0.20em',
                color: 'var(--brand)',
                marginBottom: '24px',
              }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Leistungen · Überblick
            </motion.p>

            <motion.h1
              className="font-display font-bold"
              style={{
                fontSize: 'clamp(42px, 5.8vw, 88px)',
                lineHeight: 0.98,
                letterSpacing: 'var(--tr-display)',
                color: 'var(--fg-default)',
              }}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
            >
              Vier Felder.<br />
              Eine <ItalicAccent>Hand</ItalicAccent>.
            </motion.h1>

            <motion.p
              className="mt-8 font-body"
              style={{
                fontSize: 'clamp(17px, 1.6vw, 20px)',
                lineHeight: 1.6,
                color: 'var(--fg-muted)',
                maxWidth: '520px',
              }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
            >
              Marke, Microsoft 365 oder Google Workspace, KI &amp; Automatisierung,
              digitale Strategie. Vier Schwerpunkte, die in der Praxis ineinandergreifen
              — direkt mit mir, nicht aus vier Abteilungen mit drei Schnittstellen.
            </motion.p>

            <motion.div
              className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <Link
                href="#leistungen-list"
                data-cursor="magnetic"
                className="inline-flex items-center gap-3 font-mono uppercase transition-colors duration-220 hover:text-[color:var(--brand)]"
                style={{
                  fontSize: '12px',
                  letterSpacing: '0.16em',
                  color: 'var(--fg-muted)',
                }}
              >
                <ArrowDown size={12} strokeWidth={1.6} />
                Die vier Felder im Detail
              </Link>
            </motion.div>
          </div>

          {/* ── RIGHT · Operator-Cockpit ── */}
          <CockpitStage />
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────── */

function CockpitStage() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      className="relative mx-auto w-full"
      style={{ maxWidth: '600px', height: 'clamp(440px, 52vw, 540px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {/* Soft glow under cockpit */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(50% 35% at 50% 50%, rgba(220, 128, 68, 0.24) 0%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />

      {/* Connection-Lines vom Zentrum zu jeder Tile */}
      <ConnectionLines reduceMotion={!!reduceMotion} inView={inView} />

      {/* Zentrum: b·-Marke */}
      <CenterMark inView={inView} reduceMotion={!!reduceMotion} />

      {/* 4 orbitale Service-Tiles */}
      <FloatTile
        delay={1.0}
        floatDelay={0}
        reduceMotion={!!reduceMotion}
        style={{ top: '4%', left: '-2%' }}
      >
        <FieldTile field={FIELDS[0]} />
      </FloatTile>

      <FloatTile
        delay={1.2}
        floatDelay={0.4}
        reduceMotion={!!reduceMotion}
        style={{ top: '4%', right: '-2%' }}
      >
        <FieldTile field={FIELDS[1]} />
      </FloatTile>

      <FloatTile
        delay={1.4}
        floatDelay={0.8}
        reduceMotion={!!reduceMotion}
        style={{ bottom: '14%', right: '-4%' }}
      >
        <FieldTile field={FIELDS[2]} />
      </FloatTile>

      <FloatTile
        delay={1.6}
        floatDelay={1.2}
        reduceMotion={!!reduceMotion}
        style={{ bottom: '14%', left: '-4%' }}
      >
        <FieldTile field={FIELDS[3]} />
      </FloatTile>

    </motion.div>
  )
}

/* ── Zentrum-Mark ── */

function CenterMark({ inView, reduceMotion }: { inView: boolean; reduceMotion: boolean }) {
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      initial={reduceMotion ? false : { opacity: 0, scale: 0.7 }}
      animate={inView ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
    >
      <div
        style={{
          width: 200,
          height: 200,
          borderRadius: '50%',
          background:
            'linear-gradient(145deg, rgba(245, 245, 248, 0.16) 0%, rgba(220, 128, 68, 0.16) 100%)',
          border: '1px solid rgba(245, 245, 250, 0.24)',
          backdropFilter: 'blur(28px) saturate(180%)',
          WebkitBackdropFilter: 'blur(28px) saturate(180%)',
          boxShadow:
            'inset 0 1px 0 rgba(255, 255, 255, 0.28), 0 32px 96px rgba(0, 0, 0, 0.55), 0 0 96px rgba(220, 128, 68, 0.34)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 22px 18px',
        }}
      >
        <BraumMonogram />
        <span
          className="mt-2 font-mono uppercase"
          style={{
            fontSize: 9,
            letterSpacing: '0.22em',
            color: 'var(--fg-subtle)',
          }}
        >
          Operator
        </span>
      </div>
    </motion.div>
  )
}

/* ── Connection-Lines ── */

function ConnectionLines({ inView, reduceMotion }: { inView: boolean; reduceMotion: boolean }) {
  // Vier diagonale Linien vom Zentrum (50/50) zu den 4 Ecken-Tiles.
  // Wir nutzen SVG für saubere Strokes.
  const lines = [
    { x: '10%',  y: '14%' },  // top-left
    { x: '90%',  y: '14%' },  // top-right
    { x: '90%',  y: '78%' },  // bottom-right
    { x: '10%',  y: '78%' },  // bottom-left
  ]

  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ width: '100%', height: '100%' }}
    >
      <defs>
        <linearGradient id="line-fade" x1="50%" y1="50%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#DC8044" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#DC8044" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      {lines.map((l, i) => (
        <motion.line
          key={i}
          x1="50"
          y1="50"
          x2={l.x.replace('%', '')}
          y2={l.y.replace('%', '')}
          stroke="url(#line-fade)"
          strokeWidth="0.3"
          initial={reduceMotion ? undefined : { pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 1 } : undefined}
          transition={{ duration: 0.9, delay: 0.6 + i * 0.1, ease: EASE }}
        />
      ))}
    </svg>
  )
}

/* ── Floating Wrapper ── */

function FloatTile({
  children,
  style,
  delay,
  floatDelay,
  reduceMotion,
}: {
  children:    React.ReactNode
  style:       React.CSSProperties
  delay:       number
  floatDelay:  number
  reduceMotion:boolean
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reduceMotion) return
    const el = ref.current
    if (!el) return
    let raf = 0
    const start = performance.now() + floatDelay * 1000
    const tick = (now: number) => {
      const t = (now - start) / 1000
      const y = Math.sin(t * 0.8) * 5
      const r = Math.sin(t * 0.55) * 0.8
      el.style.transform = `translateY(${y}px) rotate(${r}deg)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduceMotion, floatDelay])

  return (
    <motion.div
      className="absolute"
      style={style}
      initial={reduceMotion ? false : { opacity: 0, scale: 0.7, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      <div ref={ref}>{children}</div>
    </motion.div>
  )
}

function FieldTile({
  field,
}: {
  field: (typeof FIELDS)[number]
}) {
  return (
    <Link
      href={`/leistungen/${field.slug}`}
      data-cursor="card"
      data-cursor-label="öffnen"
      className="group block"
      style={{
        width: 152,
        padding: '14px 16px',
        background:
          'linear-gradient(145deg, rgba(245, 245, 248, 0.14) 0%, rgba(220, 128, 68, 0.06) 100%)',
        border: '1px solid rgba(245, 245, 250, 0.20)',
        borderRadius: 12,
        backdropFilter: 'blur(22px) saturate(180%)',
        WebkitBackdropFilter: 'blur(22px) saturate(180%)',
        boxShadow:
          'inset 0 1px 0 rgba(255, 255, 255, 0.24), 0 16px 40px rgba(0, 0, 0, 0.45)',
        transition: 'transform 220ms cubic-bezier(0.16, 1, 0.3, 1), border-color 220ms',
      }}
    >
      <div className="flex items-center justify-between">
        <span
          className="inline-flex items-center justify-center"
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            background: 'rgba(220, 128, 68, 0.14)',
            color: field.accent,
          }}
        >
          <field.Icon size={14} strokeWidth={1.6} />
        </span>
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 8,
            letterSpacing: '0.18em',
            color: 'var(--brand)',
          }}
        >
          {field.num}
        </span>
      </div>
      <p
        className="mt-3 font-display font-semibold"
        style={{
          fontSize: 15,
          lineHeight: 1.15,
          color: 'var(--fg-default)',
          letterSpacing: '-0.005em',
        }}
      >
        {field.title}
      </p>
      <p
        className="mt-0.5 font-mono"
        style={{
          fontSize: 9,
          color: 'var(--fg-muted)',
          letterSpacing: '0.04em',
        }}
      >
        {field.sub}
      </p>
    </Link>
  )
}

/* ── Inline-Monogramm mit zugeschnittener viewBox ── */
// Original SVG hat viewBox 0 0 1000 500 mit Icon-Pfaden im Bereich
// x ≈ 358-640, y ≈ 124-376. Hier auf das Icon zugeschnitten + ein
// bisschen Padding, damit es im Glass-Kreis groß und mittig sitzt.
function BraumMonogram() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="349 93 320 282"
      aria-label="Braum Consulting"
      role="img"
      style={{
        width: '100%',
        height: 'auto',
        color: 'var(--fg-default)',
      }}
    >
      <path
        fill="currentColor"
        d="M625.3,245.53a66.25,66.25,0,0,1-34.78,108.66c-3.74.89-6.07.39-8.79-2.39C567,336.63,549.13,327,527.35,322.63c1.55-.33,2.16-.51,2.8-.57a15.51,15.51,0,0,1,1.93,0c14.43,0,28.86.11,43.3-.07a33.08,33.08,0,0,0,31.86-25.1c4.72-17.85-9.11-37.72-27.46-39.42-2-.18-4.12-.34-6.18-.34H551a70.06,70.06,0,0,1-19.67-4.29,62,62,0,0,1-24.23-16.69c-5.55-6.12-14.5-12.68-14.87-13h8.17l50.58,0h23c15.22,0,28.24-9.12,32.59-22.7,6.78-21.2-9.37-42.33-32.33-42.33q-41,0-82.09,0V124h.59c27.45.49,54.91.2,82.36.19,33.24,0,61.73,24.11,66.38,57,3,21.29-3.27,40-18.25,55.55-1,1-2.48,1.43-3.94,2.24C622,242,623.71,243.71,625.3,245.53Z"
      />
      <path
        fill="currentColor"
        d="M571.67,376H416.3c-23.91-5.7-41.42-20.72-51.88-44.35a75.69,75.69,0,0,1-6.55-29.11h0a63,63,0,0,1,.59-11.24c.06-.43.12-.88.19-1.32s.11-.77.18-1.17.13-.79.2-1.2a1.18,1.18,0,0,0,0-.25c0-.22.09-.43.12-.64h0c0-.2.08-.41.13-.63.07-.38.15-.76.23-1.15s.14-.69.22-1c0-.14.06-.29.1-.43.09-.41.19-.82.29-1.23.16-.67.33-1.34.53-2,.11-.42.23-.84.35-1.26a74.65,74.65,0,0,1,26.92-39.47s16.06-16.2,47.22-16.2c0,0,34.75,3.07,57,33.83l-58.66,0c-3.33,0-9.38,1.41-12.56,2.42-6.11,1.93-12.79,6.13-19.77,14.84l-.27.35a45.65,45.65,0,0,0-4.31,6.88c-.09.18-.19.35-.27.53A47.24,47.24,0,0,0,392,301.55v0c.5,20.65,16.16,39.92,37.62,42.48a90.68,90.68,0,0,0,10,.6c24.62.11,49.25-.38,73.85.33C536.64,345.66,558.07,357.84,571.67,376Z"
      />
    </svg>
  )
}
