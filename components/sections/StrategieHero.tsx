'use client'

import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import Link from 'next/link'
import {
  ArrowLeft, Compass, AlertTriangle, FileQuestion, GitBranch, Clock,
  Check, ShieldCheck, Map, Target, TrendingUp,
} from 'lucide-react'
import type { Service } from '@/lib/cms'

const EASE = [0.16, 1, 0.3, 1] as const

/**
 * Strategie-Hero: Zielbild-Map mit animiertem Pfad.
 *
 * Links: Text (Eyebrow, Headline, Lead, Result-Metric).
 * Rechts: Two-State-Stage — Status-quo-Box (chaotisch) → Zielbild-Box (geordnet),
 * dazwischen ein SVG-Pfad mit vier Entscheidungs-Knoten, der sich on-mount zeichnet.
 */
export default function StrategieHero({ s }: { s: Service }) {
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
            'radial-gradient(55% 70% at 78% 28%, rgba(220, 128, 68, 0.16) 0%, transparent 60%),' +
            'radial-gradient(45% 55% at 18% 78%, rgba(146, 48, 30, 0.10) 0%, transparent 60%)',
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

        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
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
                <Compass size={13} strokeWidth={1.5} />
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
                {s.duration} · NDA vor dem zweiten Termin
              </span>
            </motion.div>

            <motion.h1
              className="mt-8 font-display font-bold"
              style={{
                fontSize: 'clamp(34px, 4vw, 56px)',
                lineHeight: 1.05,
                letterSpacing: 'var(--tr-display)',
                color: 'var(--fg-default)',
                maxWidth: '780px',
              }}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
            >
              Die teuerste Frage entscheidet niemand{' '}
              <span
                style={{
                  fontFamily: 'var(--font-accent)',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  color: 'var(--brand)',
                }}
              >
                alleine
              </span>.
            </motion.h1>

            <motion.p
              className="mt-6 font-body"
              style={{
                fontSize: 'clamp(16px, 1.4vw, 18px)',
                lineHeight: 1.6,
                color: 'var(--fg-muted)',
                maxWidth: '560px',
              }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
            >
              IT-Roadmap auf Geschäftsführungs-Ebene. Make-or-Buy, Vendor-Selection,
              M&amp;A-IT-Due-Diligence, NIS-2 und ISO 27001. Operativ, diskret,
              im Du. Kein Berater-Theater, keine Pyramide aus Sub-Sub-Ansprechpartnern.
            </motion.p>
          </div>

          {/* ── RIGHT · Zielbild-Map mit animiertem Pfad ── */}
          <ZielbildMap />
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────── */

function ZielbildMap() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      className="relative ml-auto mt-14 w-full lg:mt-0"
      style={{ maxWidth: '560px', height: 'clamp(500px, 48vw, 580px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {/* Soft glow under stage */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(55% 50% at 55% 55%, rgba(220, 128, 68, 0.18) 0%, transparent 70%)',
          filter: 'blur(28px)',
        }}
      />

      {/* SVG-Path Layer (full-stage) */}
      <PathLayer inView={inView} reduceMotion={!!reduceMotion} />

      {/* Status-quo-Box (oben links) */}
      <StatusQuoBox inView={inView} reduceMotion={!!reduceMotion} />

      {/* Zielbild-Box (unten rechts) */}
      <ZielbildBox inView={inView} reduceMotion={!!reduceMotion} />

      {/* Knoten-Labels — kompakt vertikal in oberer Hälfte, klare Prozess-Achse */}
      <KnotenLabel
        delay={1.4}
        inView={inView}
        reduceMotion={!!reduceMotion}
        style={{ top: '22%', left: '32%' }}
        num="01"
        title="Lagebild"
        Icon={Map}
      />
      <KnotenLabel
        delay={1.65}
        inView={inView}
        reduceMotion={!!reduceMotion}
        style={{ top: '36%', left: '32%' }}
        num="02"
        title="Optionen"
        Icon={GitBranch}
      />
      <KnotenLabel
        delay={1.9}
        inView={inView}
        reduceMotion={!!reduceMotion}
        style={{ top: '50%', left: '32%' }}
        num="03"
        title="Empfehlung"
        Icon={Target}
      />
    </motion.div>
  )
}

/* ── SVG-Pfad zwischen Status-quo und Zielbild ── */

function PathLayer({ inView, reduceMotion }: { inView: boolean; reduceMotion: boolean }) {
  // Klarer Prozess-Pfad: Status-quo (oben links) → 3 Knoten zentral vertikal → Zielbild (unten rechts).
  // Schräg rein, vertikal durch die Knoten, schräg raus — sauber, prozessartig, ohne Schwünge.
  // viewBox 800 x 600 · skaliert proportional zum Container
  const pathD =
    'M 224 55 ' +    // Start: Status-quo rechte Kante (oben links · 28% width)
    'L 350 160 ' +   // Schräg runter zu Knoten 01 (center bei left 32% + 12% = 44%)
    'L 350 340 ' +   // Vertikal durch 01 → 02 → 03
    'L 544 545'      // Schräg raus zum Zielbild (rechte Hälfte · 32% width)

  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid meet"
      style={{ zIndex: 4 }}
    >
      <defs>
        <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"  stopColor="#92301E" stopOpacity="0.30" />
          <stop offset="50%" stopColor="#DC8044" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#28C840" stopOpacity="0.85" />
        </linearGradient>
        <filter id="pathGlow">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      {/* Glow-Layer hinter Pfad */}
      <motion.path
        d={pathD}
        stroke="url(#pathGradient)"
        strokeWidth={7}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#pathGlow)"
        opacity={0.30}
        initial={reduceMotion ? false : { pathLength: 0 }}
        animate={inView ? { pathLength: 1 } : undefined}
        transition={{ duration: 2.0, delay: 0.8, ease: EASE }}
      />

      {/* Haupt-Pfad — gestrichelt, klare Stufen */}
      <motion.path
        d={pathD}
        stroke="url(#pathGradient)"
        strokeWidth={2.4}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="8 8"
        initial={reduceMotion ? false : { pathLength: 0 }}
        animate={inView ? { pathLength: 1 } : undefined}
        transition={{ duration: 2.0, delay: 0.8, ease: EASE }}
      />

      {/* Animierter Wandel-Punkt entlang Pfad */}
      {!reduceMotion && inView && (
        <motion.circle
          r={5}
          fill="var(--accent)"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 2.8, delay: 2.8, repeat: Infinity, repeatDelay: 1.4 }}
        >
          <animateMotion
            dur="2.8s"
            begin="2.8s"
            repeatCount="indefinite"
            path={pathD}
          />
        </motion.circle>
      )}
    </svg>
  )
}

/* ── Status-quo-Box: chaotisches Vorher ── */

function StatusQuoBox({ inView, reduceMotion }: { inView: boolean; reduceMotion: boolean }) {
  return (
    <motion.div
      className="absolute"
      style={{
        top: '0%',
        left: '0%',
        width: '28%',
        zIndex: 6,
      }}
      initial={reduceMotion ? false : { opacity: 0, x: -20, scale: 0.92 }}
      animate={inView ? { opacity: 1, x: 0, scale: 1 } : undefined}
      transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
    >
      <div
        style={{
          padding: '16px 16px',
          background: 'rgba(28, 27, 24, 0.85)',
          border: '1px solid rgba(146, 48, 30, 0.32)',
          borderRadius: 'var(--r-sm)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        }}
      >
        <p
          className="font-mono uppercase"
          style={{
            fontSize: '9px',
            letterSpacing: '0.20em',
            color: '#92301E',
            marginBottom: '12px',
          }}
        >
          Status quo
        </p>
        <p
          className="font-display font-semibold"
          style={{ fontSize: '14px', lineHeight: 1.25, color: 'var(--fg-default)', marginBottom: '12px' }}
        >
          IT als Black-Box.
        </p>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {[
            { Icon: FileQuestion, text: 'Drei Berater, drei ERPs' },
            { Icon: AlertTriangle, text: 'NIS-2 — und jetzt?' },
            { Icon: AlertTriangle, text: 'Carve-out ohne Zahlen' },
          ].map(item => (
            <li
              key={item.text}
              className="flex items-start gap-2 py-1.5 font-mono"
              style={{ fontSize: '10px', color: 'var(--fg-muted)', lineHeight: 1.3 }}
            >
              <item.Icon size={10} strokeWidth={1.6} style={{ color: '#92301E', marginTop: '2px', flexShrink: 0 }} />
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}

/* ── Zielbild-Box: geordnetes Nachher ── */

function ZielbildBox({ inView, reduceMotion }: { inView: boolean; reduceMotion: boolean }) {
  return (
    <motion.div
      className="absolute"
      style={{
        bottom: '0%',
        right: '0%',
        width: '32%',
        zIndex: 6,
      }}
      initial={reduceMotion ? false : { opacity: 0, x: 20, scale: 0.92 }}
      animate={inView ? { opacity: 1, x: 0, scale: 1 } : undefined}
      transition={{ duration: 0.7, delay: 2.6, ease: EASE }}
    >
      <div
        style={{
          padding: '16px 18px',
          background:
            'linear-gradient(145deg, rgba(245, 245, 248, 0.10) 0%, rgba(40, 200, 64, 0.10) 100%)',
          border: '1px solid rgba(40, 200, 64, 0.30)',
          borderRadius: 'var(--r-sm)',
          backdropFilter: 'blur(20px) saturate(160%)',
          WebkitBackdropFilter: 'blur(20px) saturate(160%)',
          boxShadow:
            '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 32px rgba(40, 200, 64, 0.20), inset 0 1px 0 rgba(255, 255, 255, 0.18)',
        }}
      >
        <p
          className="font-mono uppercase"
          style={{
            fontSize: '9px',
            letterSpacing: '0.20em',
            color: '#28C840',
            marginBottom: '12px',
          }}
        >
          Zielbild
        </p>
        <p
          className="font-display font-semibold"
          style={{ fontSize: '14px', lineHeight: 1.25, color: 'var(--fg-default)', marginBottom: '12px' }}
        >
          IT-Roadmap auf GF-Ebene.
        </p>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {[
            { Icon: Check,       text: 'Make-or-Buy entschieden' },
            { Icon: ShieldCheck, text: 'NIS-2 & ISO 27001 ready' },
            { Icon: TrendingUp,  text: 'Belegschaft mitgenommen' },
            { Icon: Clock,       text: 'Direkter Draht bis Rollout' },
          ].map(item => (
            <li
              key={item.text}
              className="flex items-start gap-2 py-1.5 font-mono"
              style={{ fontSize: '10px', color: 'var(--fg-default)', lineHeight: 1.3 }}
            >
              <item.Icon size={10} strokeWidth={1.8} style={{ color: '#28C840', marginTop: '2px', flexShrink: 0 }} />
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}

/* ── Knoten-Label entlang Pfad ── */

function KnotenLabel({
  num,
  title,
  Icon,
  delay,
  inView,
  reduceMotion,
  style,
}: {
  num:    string
  title:  string
  Icon:   typeof Map
  delay:  number
  inView: boolean
  reduceMotion: boolean
  style:  React.CSSProperties
}) {
  return (
    <motion.div
      className="absolute"
      style={{ zIndex: 7, ...style }}
      initial={reduceMotion ? false : { opacity: 0, scale: 0.6 }}
      animate={inView ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: 0.5, delay, ease: EASE }}
    >
      <div
        className="flex items-center gap-2"
        style={{
          padding: '6px 12px 6px 8px',
          background: 'rgba(15, 14, 12, 0.92)',
          border: '1px solid rgba(220, 128, 68, 0.35)',
          borderRadius: 'var(--r-pill)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: '0 10px 28px rgba(0, 0, 0, 0.5), 0 0 16px rgba(220, 128, 68, 0.20)',
        }}
      >
        <span
          className="inline-flex h-6 w-6 items-center justify-center"
          style={{
            background: 'rgba(220, 128, 68, 0.18)',
            borderRadius: '50%',
            color: 'var(--brand)',
          }}
        >
          <Icon size={11} strokeWidth={1.8} />
        </span>
        <span
          className="font-mono uppercase"
          style={{ fontSize: '9px', letterSpacing: '0.18em', color: 'var(--brand)' }}
        >
          {num}
        </span>
        <span
          className="font-display font-semibold"
          style={{ fontSize: '11px', color: 'var(--fg-default)', letterSpacing: '-0.005em' }}
        >
          {title}
        </span>
      </div>
    </motion.div>
  )
}
