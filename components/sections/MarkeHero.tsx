'use client'

import { useEffect, useRef } from 'react'
import { motion, useReducedMotion, useInView } from 'motion/react'
import Link from 'next/link'
import {
  ArrowLeft, Globe, Heart, MessageCircle, Send, Sparkles,
} from 'lucide-react'
import type { Service } from '@/lib/cms'

const EASE = [0.16, 1, 0.3, 1] as const

/**
 * Cinematic Marke-Hero: animierter Laptop + floating Brand-Artefakte.
 * - Laptop-Screen baut sich auf Mount sequenziell auf (Nav → Hero → Image → Lines → CTA)
 * - Artefakte um den Laptop herum: Logo-Tile, Color-Swatches, Social-Post,
 *   Visitenkarte, Lighthouse-Score
 * - Floating-Animation (sin-wave) — respektiert prefers-reduced-motion
 */
export default function MarkeHero({ s }: { s: Service }) {
  return (
    <section
      aria-label={`Leistung ${s.title}`}
      className="relative w-screen overflow-hidden"
      style={{
        marginLeft: 'calc(-50vw + 50%)',
        background: 'var(--bg-base)',
        paddingTop: '120px',
        paddingBottom: 'clamp(48px, 6vw, 72px)',
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(55% 70% at 75% 30%, rgba(220, 128, 68, 0.18) 0%, transparent 60%),' +
            'radial-gradient(45% 55% at 20% 80%, rgba(146, 48, 30, 0.10) 0%, transparent 60%)',
          zIndex: 1,
        }}
      />

      <div className="relative z-[3] mx-auto w-full max-w-[var(--container-wide)] px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <Link
            href="/leistungen"
            data-cursor="link"
            className="inline-flex items-center gap-2 font-mono uppercase transition-colors duration-220 hover:text-[color:var(--brand)]"
            style={{
              fontSize: '11px',
              letterSpacing: '0.18em',
              color: 'var(--fg-muted)',
            }}
          >
            <ArrowLeft size={11} strokeWidth={1.6} />
            Alle Leistungen
          </Link>
        </motion.div>

        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-start lg:gap-16">
          {/* ── LEFT · Text ── */}
          <div>
            <motion.div
              className="flex flex-wrap items-baseline gap-x-6 gap-y-2"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
            >
              <span
                className="inline-flex items-center gap-2 font-mono uppercase"
                style={{
                  fontSize: '12px',
                  letterSpacing: '0.20em',
                  color: 'var(--brand)',
                  padding: '6px 14px',
                  border: '1px solid rgba(220, 128, 68, 0.30)',
                  borderRadius: 'var(--r-pill)',
                }}
              >
                <Globe size={13} strokeWidth={1.5} />
                Leistung {s.num}
              </span>
              <span
                className="font-mono"
                style={{
                  fontSize: '11px',
                  color: 'var(--fg-muted)',
                  letterSpacing: '0.04em',
                }}
              >
                {s.duration}
              </span>
            </motion.div>

            <motion.h1
              className="mt-8 font-display font-bold"
              style={{
                fontSize: 'clamp(40px, 5.4vw, 84px)',
                lineHeight: 1.02,
                letterSpacing: 'var(--tr-display)',
                color: 'var(--fg-default)',
              }}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
            >
              {s.title}
            </motion.h1>

            <motion.p
              className="mt-6 font-body"
              style={{
                fontSize: 'clamp(16px, 1.5vw, 19px)',
                lineHeight: 1.55,
                color: 'var(--fg-muted)',
                maxWidth: '560px',
              }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
            >
              {s.lead}
            </motion.p>

            <motion.div
              className="mt-10 flex flex-wrap items-end gap-x-10 gap-y-6"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.65, ease: EASE }}
            >
              <div>
                <p
                  className="font-mono uppercase"
                  style={{
                    fontSize: '10px',
                    letterSpacing: '0.20em',
                    color: 'var(--fg-muted)',
                    marginBottom: '10px',
                  }}
                >
                  Typisches Ergebnis
                </p>
                <p
                  className="font-display font-black"
                  style={{
                    fontSize: 'clamp(42px, 5.4vw, 84px)',
                    lineHeight: 0.95,
                    letterSpacing: 'var(--tr-display)',
                    color: 'var(--accent)',
                  }}
                >
                  {s.result}
                </p>
                <p
                  className="mt-2 font-mono uppercase"
                  style={{
                    fontSize: '11px',
                    letterSpacing: '0.16em',
                    color: 'var(--fg-default)',
                    opacity: 0.85,
                  }}
                >
                  {s.resultLabel}
                </p>
              </div>

              <dl className="flex flex-wrap gap-x-10 gap-y-5">
                <div>
                  <dt
                    className="font-mono uppercase"
                    style={{ fontSize: '9px', letterSpacing: '0.18em', color: 'var(--fg-subtle)' }}
                  >
                    Dauer
                  </dt>
                  <dd
                    className="mt-2 font-display font-medium"
                    style={{ fontSize: '15px', color: 'var(--fg-default)' }}
                  >
                    {s.duration}
                  </dd>
                </div>
              </dl>
            </motion.div>
          </div>

          {/* ── RIGHT · Animated Laptop + Artefakte ── */}
          <MagicLaptopStage />
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────── */

function MagicLaptopStage() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      className="relative mx-auto mt-14 w-full lg:mt-0"
      style={{ maxWidth: '720px', height: 'clamp(440px, 56vw, 600px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {/* Soft glow under laptop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(50% 35% at 50% 70%, rgba(220, 128, 68, 0.24) 0%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />

      <Laptop inView={inView} reduceMotion={!!reduceMotion} />

      {/* Floating artefacts — positionsoffset relativ zu Container */}
      <FloatArtefact
        delay={1.2}
        floatDelay={0}
        reduceMotion={!!reduceMotion}
        style={{ top: '4%', left: '-4%', zIndex: 6 }}
      >
        <LogoTile />
      </FloatArtefact>

      <FloatArtefact
        delay={1.45}
        floatDelay={0.6}
        reduceMotion={!!reduceMotion}
        style={{ top: '-2%', right: '0%', zIndex: 7 }}
      >
        <SwatchCard />
      </FloatArtefact>

      <FloatArtefact
        delay={1.7}
        floatDelay={1.2}
        reduceMotion={!!reduceMotion}
        style={{ bottom: '6%', left: '-8%', zIndex: 7 }}
      >
        <LighthouseCard />
      </FloatArtefact>

      <FloatArtefact
        delay={1.9}
        floatDelay={0.3}
        reduceMotion={!!reduceMotion}
        style={{ bottom: '0%', right: '-4%', zIndex: 7 }}
      >
        <SocialPostCard />
      </FloatArtefact>

      <FloatArtefact
        delay={2.1}
        floatDelay={0.9}
        reduceMotion={!!reduceMotion}
        style={{ top: '38%', right: '-12%', zIndex: 5 }}
      >
        <BusinessCardTile />
      </FloatArtefact>
    </motion.div>
  )
}

/* ── Laptop mit Browser-Mockup, das sich sequenziell aufbaut ── */

function Laptop({ inView, reduceMotion }: { inView: boolean; reduceMotion: boolean }) {
  return (
    <motion.div
      className="absolute inset-x-0"
      style={{ top: '8%', height: '78%' }}
      initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.94 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : undefined}
      transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
    >
      {/* Laptop-Lid (Screen-Bezel) */}
      <div
        className="relative mx-auto"
        style={{
          width: '88%',
          height: '88%',
          background: 'linear-gradient(180deg, #2A2825 0%, #1A1816 100%)',
          borderRadius: '14px 14px 4px 4px',
          padding: '16px 16px 22px',
          border: '1px solid rgba(245, 245, 250, 0.10)',
          boxShadow: '0 32px 80px rgba(0, 0, 0, 0.6), 0 12px 32px rgba(0, 0, 0, 0.4)',
        }}
      >
        {/* Screen */}
        <div
          className="relative h-full w-full overflow-hidden"
          style={{
            background: '#0F0E0C',
            borderRadius: '6px',
            border: '1px solid rgba(245, 245, 250, 0.06)',
          }}
        >
          <BrowserMockup inView={inView} reduceMotion={reduceMotion} />
        </div>

        {/* Notch */}
        <div
          aria-hidden
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            top: '4px',
            width: '60px',
            height: '6px',
            background: '#0A0907',
            borderRadius: '0 0 6px 6px',
          }}
        />
      </div>

      {/* Laptop-Base */}
      <div
        aria-hidden
        className="mx-auto"
        style={{
          width: '100%',
          height: '14px',
          marginTop: '-2px',
          background: 'linear-gradient(180deg, #1F1D1A 0%, #0E0D0B 100%)',
          borderRadius: '0 0 18px 18px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div
          className="mx-auto"
          style={{
            width: '20%',
            height: '4px',
            background: 'rgba(0, 0, 0, 0.6)',
            borderRadius: '0 0 6px 6px',
          }}
        />
      </div>
    </motion.div>
  )
}

/* ── Browser-Mockup: sequenzieller Aufbau ── */

function BrowserMockup({ inView, reduceMotion }: { inView: boolean; reduceMotion: boolean }) {
  const stagger = reduceMotion ? 0 : 0.14
  const base = reduceMotion ? 0 : 0.7

  const step = (i: number) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 8 },
    animate: inView ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 0.45, delay: base + i * stagger, ease: EASE },
  })

  return (
    <div className="relative flex h-full w-full flex-col" style={{ background: 'var(--bg-base)' }}>
      {/* Background-Glow — wie echter Hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(40% 60% at 75% 30%, rgba(220, 128, 68, 0.22) 0%, transparent 60%)',
          zIndex: 0,
        }}
      />

      {/* Großes Monogramm-Outline rechts, sehr dezent */}
      <span
        aria-hidden
        className="pointer-events-none absolute font-display font-black"
        style={{
          right: '-12%',
          top: '24%',
          fontSize: '140px',
          lineHeight: 1,
          color: 'transparent',
          WebkitTextStroke: '1px rgba(220, 128, 68, 0.30)',
          zIndex: 1,
        }}
      >
        b·
      </span>

      {/* Browser-Chrome */}
      <motion.div
        className="relative flex items-center gap-2 border-b"
        style={{
          padding: '6px 10px',
          background: '#1A1916',
          borderColor: 'rgba(245, 245, 250, 0.06)',
          flexShrink: 0,
          zIndex: 2,
        }}
        {...step(0)}
      >
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF5F57' }} />
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FEBC2E' }} />
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#28C840' }} />
        <span
          className="ml-3 font-mono"
          style={{
            fontSize: '9px',
            color: 'var(--fg-subtle)',
            background: '#0F0E0C',
            padding: '3px 10px',
            borderRadius: '4px',
            flex: 1,
            textAlign: 'center',
          }}
        >
          braum.consulting
        </span>
      </motion.div>

      {/* Nav */}
      <motion.div
        className="relative flex items-center justify-between"
        style={{ padding: '10px 14px 6px', flexShrink: 0, zIndex: 2 }}
        {...step(1)}
      >
        <span
          className="font-display font-bold"
          style={{ fontSize: '11px', color: 'var(--fg-default)', letterSpacing: '-0.01em' }}
        >
          b·
        </span>
        <div className="flex gap-3">
          {['Leistungen', 'Cases', 'Über', 'Kontakt'].map(l => (
            <span
              key={l}
              className="font-mono"
              style={{ fontSize: '6.5px', color: 'var(--fg-muted)', letterSpacing: '0.04em' }}
            >
              {l}
            </span>
          ))}
        </div>
        <span
          className="font-mono"
          style={{
            fontSize: '6.5px',
            color: 'var(--on-accent)',
            background: 'var(--accent)',
            padding: '3px 6px',
            borderRadius: '3px',
            fontWeight: 600,
          }}
        >
          Lagebild
        </span>
      </motion.div>

      {/* Eyebrow */}
      <motion.div
        className="relative"
        style={{ padding: '8px 14px 0', zIndex: 2 }}
        {...step(2)}
      >
        <span
          className="font-mono uppercase"
          style={{
            fontSize: '6.5px',
            letterSpacing: '0.18em',
            color: 'var(--brand)',
          }}
        >
          01 — Digitaler Lotse für Mittelstand &amp; Industrie
        </span>
      </motion.div>

      {/* Hero-Headline */}
      <div className="relative" style={{ padding: '4px 14px 0', zIndex: 2 }}>
        <motion.p
          className="font-display font-black"
          style={{
            fontSize: '20px',
            lineHeight: 0.98,
            color: 'var(--fg-default)',
            letterSpacing: '-0.02em',
            margin: 0,
          }}
          {...step(3)}
        >
          Vom digitalen Nebel
        </motion.p>
        <motion.p
          className="font-display font-black"
          style={{
            fontSize: '20px',
            lineHeight: 0.98,
            color: 'var(--fg-default)',
            letterSpacing: '-0.02em',
            margin: 0,
            marginTop: '1px',
          }}
          {...step(4)}
        >
          zum klaren{' '}
          <span style={{ fontFamily: 'var(--font-accent)', fontStyle: 'italic', fontWeight: 400 }}>
            Kurs
          </span>
          .
        </motion.p>
      </div>

      {/* Subline */}
      <motion.p
        className="relative font-body"
        style={{
          padding: '8px 14px 0',
          fontSize: '8px',
          lineHeight: 1.4,
          color: 'var(--fg-muted)',
          maxWidth: '70%',
          zIndex: 2,
        }}
        {...step(5)}
      >
        Websites, Tools und AI-Prozesse, die im Alltag wirklich funktionieren.
      </motion.p>

      {/* CTA-Row */}
      <motion.div
        className="relative flex items-center gap-2"
        style={{ padding: '8px 14px 0', zIndex: 2 }}
        {...step(6)}
      >
        <span
          className="font-mono"
          style={{
            background: 'var(--accent)',
            color: 'var(--on-accent)',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '7px',
            fontWeight: 600,
          }}
        >
          Lagebild anfragen →
        </span>
        <span
          className="font-mono"
          style={{
            border: '1px solid var(--border-default)',
            color: 'var(--fg-muted)',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '7px',
          }}
        >
          Arbeitsweise
        </span>
      </motion.div>

      {/* Trust-Chips */}
      <motion.div
        className="relative flex flex-wrap gap-1"
        style={{ padding: '6px 14px 0', zIndex: 2 }}
        {...step(7)}
      >
        {['12 J. IT-Praxis', 'M365 · Azure', 'Mittelstand'].map(c => (
          <span
            key={c}
            className="font-mono uppercase"
            style={{
              fontSize: '6px',
              letterSpacing: '0.10em',
              color: 'var(--fg-muted)',
              padding: '2px 5px',
              border: '1px solid var(--border-default)',
              borderRadius: '999px',
            }}
          >
            {c}
          </span>
        ))}
      </motion.div>

      {/* Portrait + Name */}
      <motion.div
        className="relative mt-auto flex items-center gap-2"
        style={{ padding: '8px 14px 12px', zIndex: 2 }}
        {...step(8)}
      >
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: '4px',
            background:
              'linear-gradient(145deg, #DC8044 0%, #92301E 100%)',
            border: '1px solid rgba(245, 245, 250, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            className="font-display font-bold"
            style={{ fontSize: 10, color: 'white' }}
          >
            SB
          </span>
        </div>
        <div>
          <p
            className="font-body font-semibold"
            style={{ fontSize: 8, color: 'var(--fg-default)', lineHeight: 1.1 }}
          >
            Stefan Braum
          </p>
          <p
            className="font-mono uppercase"
            style={{
              fontSize: 6,
              letterSpacing: '0.10em',
              color: 'var(--fg-subtle)',
              marginTop: 1,
            }}
          >
            Operator · Lotse
          </p>
        </div>

        {/* Status-Dot */}
        <span
          className="ml-auto inline-flex items-center gap-1"
          style={{
            padding: '2px 6px',
            background: 'rgba(40, 200, 64, 0.10)',
            border: '1px solid rgba(40, 200, 64, 0.30)',
            borderRadius: '999px',
          }}
        >
          <span
            aria-hidden
            style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: '#28C840',
              boxShadow: '0 0 4px #28C840',
            }}
          />
          <span
            className="font-mono uppercase"
            style={{ fontSize: 6, letterSpacing: '0.10em', color: '#28C840' }}
          >
            Slots offen
          </span>
        </span>
      </motion.div>
    </div>
  )
}

/* ── Floating-Wrapper mit Bounce-In + Sin-Wave-Float ── */

function FloatArtefact({
  children,
  style,
  delay,
  floatDelay,
  reduceMotion,
}: {
  children: React.ReactNode
  style: React.CSSProperties
  delay: number
  floatDelay: number
  reduceMotion: boolean
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
      const y = Math.sin(t * 0.85) * 6
      const r = Math.sin(t * 0.6) * 1.2
      el.style.transform = `translateY(${y}px) rotate(${r}deg)`
      raf = requestAnimationFrame(tick)
    }
    // Loop nur laufen lassen, solange das Artefakt sichtbar ist — spart CPU beim Wegscrollen.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          if (!raf) raf = requestAnimationFrame(tick)
        } else if (raf) {
          cancelAnimationFrame(raf)
          raf = 0
        }
      },
      { threshold: 0 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      if (raf) cancelAnimationFrame(raf)
    }
  }, [reduceMotion, floatDelay])

  return (
    <motion.div
      className="absolute"
      style={style}
      initial={reduceMotion ? false : { opacity: 0, scale: 0.6, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      <div ref={ref}>{children}</div>
    </motion.div>
  )
}

/* ── Artefakt-Komponenten ── */

function LogoTile() {
  return (
    <div
      style={{
        width: 96,
        height: 96,
        padding: 12,
        background:
          'linear-gradient(145deg, rgba(245, 245, 248, 0.16) 0%, rgba(220, 128, 68, 0.10) 100%)',
        border: '1px solid rgba(245, 245, 250, 0.22)',
        borderRadius: '14px',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        boxShadow:
          'inset 0 1px 0 rgba(255, 255, 255, 0.28), 0 16px 40px rgba(0, 0, 0, 0.4)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <span
        className="font-display font-bold"
        style={{ fontSize: '42px', color: 'var(--brand)', lineHeight: 1 }}
      >
        b·
      </span>
      <span
        className="font-mono uppercase"
        style={{ fontSize: '8px', letterSpacing: '0.18em', color: 'var(--fg-subtle)' }}
      >
        Logo · v1
      </span>
    </div>
  )
}

function SwatchCard() {
  const swatches = ['#0F0E0C', '#DC8044', '#C8622A', '#F2F0EB']
  return (
    <div
      style={{
        padding: 14,
        background: 'rgba(28, 27, 24, 0.92)',
        border: '1px solid rgba(245, 245, 250, 0.16)',
        borderRadius: '12px',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45)',
        minWidth: 160,
      }}
    >
      <p
        className="font-mono uppercase"
        style={{
          fontSize: '8px',
          letterSpacing: '0.18em',
          color: 'var(--fg-subtle)',
          marginBottom: 8,
        }}
      >
        Color-Tokens
      </p>
      <div className="flex gap-1.5">
        {swatches.map(s => (
          <div
            key={s}
            style={{
              width: 22,
              height: 32,
              borderRadius: 4,
              background: s,
              border: '1px solid rgba(245, 245, 250, 0.08)',
            }}
            aria-label={s}
          />
        ))}
      </div>
      <p
        className="mt-2 font-mono"
        style={{ fontSize: '8px', color: 'var(--fg-muted)', letterSpacing: '0.04em' }}
      >
        4 Tokens · dokumentiert
      </p>
    </div>
  )
}

function LighthouseCard() {
  return (
    <div
      style={{
        padding: '14px 18px',
        background:
          'linear-gradient(145deg, rgba(245, 245, 248, 0.16) 0%, rgba(40, 200, 64, 0.08) 100%)',
        border: '1px solid rgba(40, 200, 64, 0.28)',
        borderRadius: '12px',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45)',
        minWidth: 130,
      }}
    >
      <p
        className="font-mono uppercase"
        style={{
          fontSize: '8px',
          letterSpacing: '0.18em',
          color: 'var(--fg-subtle)',
          marginBottom: 6,
        }}
      >
        Lighthouse
      </p>
      <p
        className="font-display font-black"
        style={{
          fontSize: '32px',
          color: '#28C840',
          lineHeight: 1,
        }}
      >
        98
      </p>
      <p
        className="mt-1 font-mono"
        style={{ fontSize: '8px', color: 'var(--fg-muted)' }}
      >
        Performance · Mobile
      </p>
    </div>
  )
}

function SocialPostCard() {
  return (
    <div
      style={{
        padding: 12,
        background: 'rgba(15, 14, 12, 0.92)',
        border: '1px solid rgba(245, 245, 250, 0.18)',
        borderRadius: '12px',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        boxShadow: '0 18px 44px rgba(0, 0, 0, 0.5)',
        width: 180,
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: '50%',
            background:
              'linear-gradient(135deg, #DC8044 0%, #92301E 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 700,
            fontSize: 10,
            fontFamily: 'var(--font-display)',
          }}
        >
          b
        </div>
        <div>
          <p
            className="font-display font-semibold"
            style={{ fontSize: 9, color: 'var(--fg-default)', lineHeight: 1.1 }}
          >
            Braum Consulting
          </p>
          <p
            className="font-mono"
            style={{ fontSize: 7, color: 'var(--fg-subtle)' }}
          >
            · vor 2 h
          </p>
        </div>
      </div>

      {/* Body */}
      <p
        className="mt-2 font-body"
        style={{ fontSize: 9, lineHeight: 1.4, color: 'var(--fg-default)' }}
      >
        Neuer Case live: Marken-Relaunch + Lead-Funnel.{' '}
        <span style={{ color: 'var(--brand)' }}>+120 % Anfragen.</span>
      </p>

      {/* Image */}
      <div
        className="mt-2"
        style={{
          height: 56,
          background:
            'linear-gradient(135deg, rgba(220, 128, 68, 0.40) 0%, rgba(146, 48, 30, 0.30) 100%)',
          borderRadius: 6,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Sparkles
          size={14}
          strokeWidth={1.5}
          style={{
            position: 'absolute',
            bottom: 6,
            right: 6,
            color: 'rgba(255, 255, 255, 0.7)',
          }}
        />
      </div>

      {/* Footer */}
      <div className="mt-2 flex items-center gap-3">
        <span
          className="inline-flex items-center gap-1 font-mono"
          style={{ fontSize: 8, color: 'var(--fg-muted)' }}
        >
          <Heart size={8} strokeWidth={1.8} /> 124
        </span>
        <span
          className="inline-flex items-center gap-1 font-mono"
          style={{ fontSize: 8, color: 'var(--fg-muted)' }}
        >
          <MessageCircle size={8} strokeWidth={1.8} /> 18
        </span>
        <span
          className="inline-flex items-center gap-1 font-mono"
          style={{ fontSize: 8, color: 'var(--fg-muted)' }}
        >
          <Send size={8} strokeWidth={1.8} /> 9
        </span>
      </div>
    </div>
  )
}

function BusinessCardTile() {
  return (
    <div
      style={{
        width: 160,
        padding: '16px 18px',
        background: '#F2F0EB',
        borderRadius: '8px',
        boxShadow:
          '0 1px 0 rgba(255, 255, 255, 0.4) inset, 0 18px 44px rgba(0, 0, 0, 0.45)',
        border: '1px solid rgba(0, 0, 0, 0.08)',
        transform: 'rotate(-4deg)',
      }}
    >
      <p
        className="font-display font-bold"
        style={{ fontSize: 13, color: '#0F0E0C', letterSpacing: '-0.01em' }}
      >
        Stefan Braum
      </p>
      <p
        className="font-mono"
        style={{ fontSize: 8, color: '#5C5851', marginTop: 1 }}
      >
        Digitaler Lotse
      </p>
      <div
        style={{
          marginTop: 10,
          height: 1,
          background: '#DC8044',
          width: '40%',
        }}
      />
      <p
        className="mt-2 font-mono"
        style={{ fontSize: 8, color: '#0F0E0C', letterSpacing: '0.02em' }}
      >
        braum.consulting
      </p>
    </div>
  )
}
