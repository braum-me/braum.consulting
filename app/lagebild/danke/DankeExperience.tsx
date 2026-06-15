'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Compass, Mail, Clock, Check, CalendarClock } from 'lucide-react'
import ItalicAccent from '@/components/ui/ItalicAccent'

const EASE = [0.16, 1, 0.3, 1] as const
const CONFETTI_COLORS = ['#DC8044', '#C8622A', '#F0944A', '#F2F0EB', '#A53922']

/* Deterministischer PRNG (mulberry32). Ersetzt Math.random im Render →
   stabile Partikel-Positionen über Re-Renders, kein Purity-Verstoß. */
function makeRng(seed: number): () => number {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/* ── Konfetti ────────────────────────────────────────────────────────────
   Selbstgebaut (keine Dependency): Burst aus der Mitte oben, fällt + dreht +
   fadet aus. Respektiert prefers-reduced-motion → dann gar nichts. */
function Confetti() {
  const reduce = useReducedMotion()
  // Nur client-seitig nach Mount rendern — sonst Hydration-Mismatch durch
  // die zufälligen Positionen (Math.random im SSR ≠ Client).
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const pieces = useMemo(() => {
    if (reduce || !mounted) return []
    const rng = makeRng(0x5eed_c0fe)
    return Array.from({ length: 80 }, (_, i) => {
      const angle = (rng() - 0.5) * Math.PI
      const dist = 120 + rng() * 460
      const size = 6 + rng() * 9
      return {
        id: i,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        startX: 50 + (rng() - 0.5) * 26,
        dx: Math.sin(angle) * dist + (rng() - 0.5) * 120,
        dy: 140 + rng() * 560,
        size,
        round: rng() > 0.5,
        rot: (rng() - 0.5) * 720,
        dur: 1.9 + rng() * 1.5,
        delay: rng() * 0.28,
      }
    })
  }, [reduce, mounted])

  if (reduce || pieces.length === 0) return null

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      {pieces.map(p => (
        <motion.span
          key={p.id}
          initial={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
          animate={{ opacity: [1, 1, 0], x: p.dx, y: p.dy, rotate: p.rot }}
          transition={{ duration: p.dur, delay: p.delay, ease: 'easeOut', times: [0, 0.72, 1] }}
          style={{
            position: 'absolute',
            left: `${p.startX}%`,
            top: '22%',
            width: p.size,
            height: p.round ? p.size : p.size * 0.5,
            background: p.color,
            borderRadius: p.round ? '999px' : '1px',
            boxShadow: `0 0 8px ${p.color}66`,
          }}
        />
      ))}
    </div>
  )
}

/* ── Sternfeld + Sternschnuppen ──────────────────────────────────────────
   Dezente Pixel-Sterne, die sanft twinkeln, plus ein paar Sternschnuppen,
   die diagonal durchziehen. Mount-gated (Random → kein Hydration-Mismatch),
   fadet als Ganzes smooth rein. Bei reduced-motion: ruhige Sterne, keine
   Schnuppen, kein Twinkle. */
function StarField() {
  const reduce = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const stars = useMemo(() => {
    if (!mounted) return []
    const rng = makeRng(0x57a8_1e2d)
    return Array.from({ length: 48 }, (_, i) => ({
      id: i,
      x: rng() * 100,
      y: rng() * 100,
      size: 1 + rng() * 2,
      base: 0.18 + rng() * 0.5,
      delay: rng() * 4,
      dur: 2.6 + rng() * 3.4,
      accent: rng() > 0.78,
    }))
  }, [mounted])

  const shooting = useMemo(() => {
    if (!mounted || reduce) return []
    const rng = makeRng(0x5400_7195)
    return Array.from({ length: 3 }, (_, i) => ({
      id: i,
      top: 6 + rng() * 38,
      left: rng() * 55,
      len: 130 + rng() * 120,
      delay: 1.4 + i * 2.6 + rng() * 2,
      repeatDelay: 7 + rng() * 7,
    }))
  }, [mounted, reduce])

  if (!mounted) return null

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[0] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.4, ease: EASE }}
    >
      {stars.map(s => (
        <motion.span
          key={s.id}
          style={{
            position: 'absolute',
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            borderRadius: '999px',
            background: s.accent ? '#F0944A' : '#F2F0EB',
            boxShadow: s.accent ? '0 0 4px rgba(240,148,74,0.6)' : 'none',
          }}
          initial={{ opacity: s.base }}
          animate={reduce ? { opacity: s.base } : { opacity: [s.base, s.base * 0.25, s.base] }}
          transition={reduce ? undefined : { duration: s.dur, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {shooting.map(s => (
        <motion.span
          key={`sh-${s.id}`}
          style={{
            position: 'absolute',
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.len,
            height: 1.5,
            borderRadius: '999px',
            transformOrigin: 'left center',
            rotate: '27deg',
            background:
              'linear-gradient(90deg, rgba(240,148,74,0) 0%, rgba(240,148,74,0.85) 65%, #FBF0EA 100%)',
          }}
          initial={{ opacity: 0, x: -60, y: -34, scaleX: 0.2 }}
          animate={{ opacity: [0, 1, 1, 0], x: [-60, 300], y: [-34, 120], scaleX: [0.2, 1, 1, 0.5] }}
          transition={{
            duration: 1.15,
            delay: s.delay,
            repeat: Infinity,
            repeatDelay: s.repeatDelay,
            ease: 'easeOut',
            times: [0, 0.18, 0.7, 1],
          }}
        />
      ))}
    </motion.div>
  )
}

const SLOTS = [
  { day: 'Mo – Do', time: 'ab 17:00 Uhr' },
  { day: 'Freitag', time: 'ab 15:00 Uhr' },
  { day: 'Sa & So',  time: 'ganztägig' },
]

interface Props {
  dirPron: string
  dirYou: string
  anrede: string | null
  saeulenCount: number
  calUrl: string | null
}

export default function DankeExperience({ dirPron, dirYou, anrede, saeulenCount, calUrl }: Props) {
  const reduce = useReducedMotion()

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.09, delayChildren: reduce ? 0 : 0.45 } },
  }
  const item = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
  }

  return (
    <div
      className="relative w-screen overflow-hidden"
      style={{
        marginLeft: 'calc(-50vw + 50%)',
        minHeight: '100vh',
        background: 'var(--bg-base)',
        paddingTop: 'clamp(132px, 17vh, 184px)',
        paddingBottom: 128,
      }}
    >
      <StarField />
      <Confetti />

      {/* Brand-Glow oben mittig, atmet einmal auf */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-[1]"
        style={{
          height: '60%',
          background:
            'radial-gradient(60% 70% at 50% 0%, rgba(220, 128, 68, 0.22) 0%, transparent 70%)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: EASE }}
      />

      <div className="relative z-[2] mx-auto" style={{ maxWidth: 880, padding: '0 24px' }}>
        {/* ── Success-Badge ── */}
        <motion.div
          className="mx-auto flex items-center justify-center"
          style={{
            width: 84,
            height: 84,
            borderRadius: '999px',
            background: 'linear-gradient(145deg, #DC8044 0%, #C8622A 100%)',
            boxShadow: '0 0 0 8px rgba(220,128,68,0.12), 0 18px 40px -10px rgba(200,98,42,0.6)',
            marginBottom: 40,
          }}
          initial={reduce ? { opacity: 1 } : { scale: 0, rotate: -40, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 14, delay: reduce ? 0 : 0.15 }}
        >
          <Check size={40} strokeWidth={2.5} color="#FBF0EA" />
        </motion.div>

        <motion.header
          style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 64px' }}
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.span
            variants={item}
            className="font-mono"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 11,
              letterSpacing: '0.20em',
              textTransform: 'uppercase',
              color: 'var(--brand)',
              marginBottom: 24,
            }}
          >
            <Compass size={12} strokeWidth={1.5} />
            Lagebild · Übergeben
          </motion.span>

          <motion.h1
            variants={item}
            className="font-display"
            style={{
              fontSize: 'clamp(44px, 6.4vw, 72px)',
              fontWeight: 600,
              lineHeight: 1,
              letterSpacing: '-0.035em',
              color: 'var(--fg-default)',
              marginBottom: 24,
            }}
          >
            Geschafft. {dirPron} Lagebild ist <ItalicAccent>raus</ItalicAccent>.
          </motion.h1>

          <motion.p
            variants={item}
            className="font-body"
            style={{
              fontSize: 19,
              lineHeight: 1.6,
              color: 'var(--fg-muted)',
              maxWidth: 600,
              margin: '0 auto',
            }}
          >
            Das war der wichtigste Schritt. {dirPron} Briefing wird gerade
            aufbereitet — in ein bis zwei Minuten liegt die E-Mail mit dem
            direkten Link in {dirYou === 'Sie' ? 'Ihrem' : 'deinem'} Postfach.
          </motion.p>
        </motion.header>

        {/* ── Status-Cards ── */}
        <motion.div
          style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr', marginBottom: 72, maxWidth: 600, marginInline: 'auto' }}
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item}>
            <StatusCard
              icon={<Mail size={18} strokeWidth={1.5} />}
              label="E-Mail-Versand"
              value="Läuft — in ca. 2 Minuten im Postfach"
            />
          </motion.div>
          <motion.div variants={item}>
            <StatusCard
              icon={<Clock size={18} strokeWidth={1.5} />}
              label="Erstgespräch"
              value={`30 Min · ${saeulenCount > 0 ? `${saeulenCount} Säule${saeulenCount === 1 ? '' : 'n'} im Fokus` : 'Lagebild-Gespräch'}`}
            />
          </motion.div>
        </motion.div>

        {/* ── Termin ── */}
        <motion.section
          style={{ marginBottom: 80 }}
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <h2
            className="font-display"
            style={{
              fontSize: 28,
              fontWeight: 600,
              lineHeight: 1.15,
              letterSpacing: '-0.022em',
              color: 'var(--fg-default)',
              margin: '0 0 12px',
            }}
          >
            Termin direkt auswählen
          </h2>
          <p
            className="font-body"
            style={{ fontSize: 16, lineHeight: 1.55, color: 'var(--fg-muted)', margin: '0 0 32px', maxWidth: 600 }}
          >
            Briefing-Vorbereitung läuft eh — wenn {dirYou === 'Sie' ? 'Sie gleich einen Slot wählen' : 'du gleich einen Slot wählst'},
            ist die Übergabe zum Gespräch nahtlos.
          </p>
          <CalSlot calUrl={calUrl} />
        </motion.section>

        {/* ── Slot-Übersicht (neue Zeiten) ── */}
        <motion.section
          style={{
            padding: 32,
            borderRadius: 14,
            background: 'rgba(242, 240, 235, 0.03)',
            border: '1px solid rgba(242, 240, 235, 0.08)',
          }}
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <div
            className="font-mono"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 11,
              letterSpacing: '0.20em',
              textTransform: 'uppercase',
              color: 'var(--brand)',
              marginBottom: 24,
            }}
          >
            <CalendarClock size={13} strokeWidth={1.5} />
            Wann wir sprechen
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: 1,
              background: 'rgba(242, 240, 235, 0.08)',
              borderRadius: 10,
              overflow: 'hidden',
              marginBottom: 24,
            }}
          >
            {SLOTS.map(s => (
              <div key={s.day} style={{ background: 'var(--bg-base)', padding: '20px 22px' }}>
                <div
                  className="font-mono"
                  style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 8 }}
                >
                  {s.day}
                </div>
                <div className="font-display" style={{ fontSize: 20, fontWeight: 600, color: 'var(--brand)', letterSpacing: '-0.01em' }}>
                  {s.time}
                </div>
              </div>
            ))}
          </div>

          <p className="font-body" style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--fg-muted)', margin: 0 }}>
            Bewusst ruhige Zeitfenster, in denen {dirYou === 'Sie' ? 'Sie' : 'du'} die
            volle, ungeteilte Aufmerksamkeit {dirYou === 'Sie' ? 'bekommen' : 'bekommst'}.
          </p>
        </motion.section>

        <footer
          className="font-body"
          style={{
            marginTop: 72,
            paddingTop: 32,
            borderTop: '1px solid rgba(242, 240, 235, 0.06)',
            fontSize: 13,
            lineHeight: 1.65,
            color: 'var(--fg-subtle)',
          }}
        >
          Kein Termin gefunden, der passt? Schreib mir direkt an{' '}
          <a
            href="mailto:info@braum.consulting"
            style={{ color: 'var(--brand)', textDecoration: 'underline', textDecorationThickness: 1 }}
          >
            info@braum.consulting
          </a>{' '}
          mit {dirYou === 'Sie' ? 'Ihren' : 'deinen'} drei Lieblings-Zeitfenstern.
        </footer>
      </div>
    </div>
  )
}

/* ── Status-Card ─────────────────────────────────────────────────────── */
function StatusCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div
      style={{
        padding: '20px 24px',
        background: 'rgba(242, 240, 235, 0.04)',
        border: '1px solid rgba(242, 240, 235, 0.10)',
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 36,
          height: 36,
          borderRadius: 6,
          background: 'rgba(220, 128, 68, 0.10)',
          color: 'var(--brand)',
          flexShrink: 0,
        }}
      >
        {icon}
      </span>
      <div>
        <div
          className="font-mono"
          style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 4 }}
        >
          {label}
        </div>
        <div className="font-body" style={{ fontSize: 15, color: 'var(--fg-default)', fontWeight: 500 }}>
          {value}
        </div>
      </div>
    </div>
  )
}

/* ── Cal-Slot ───────────────────────────────────────────────────────── */
function CalSlot({ calUrl }: { calUrl: string | null }) {
  if (!calUrl) {
    return (
      <div
        style={{
          padding: 40,
          borderRadius: 14,
          border: '1px dashed rgba(242, 240, 235, 0.16)',
          background: 'rgba(242, 240, 235, 0.02)',
          textAlign: 'center',
        }}
      >
        <p className="font-body" style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--fg-muted)', margin: '0 0 16px' }}>
          Online-Termin-Buchung kommt in Kürze.
        </p>
        <a
          href="mailto:info@braum.consulting?subject=Lagebild-Termin"
          className="font-mono"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 24px',
            fontSize: 14,
            letterSpacing: '0.04em',
            color: '#FBF0EA',
            background: 'var(--accent, #C8622A)',
            borderRadius: 6,
            textDecoration: 'none',
            fontWeight: 500,
          }}
        >
          Termin per E-Mail
        </a>
      </div>
    )
  }

  return (
    <div
      style={{
        borderRadius: 14,
        overflow: 'hidden',
        border: '1px solid rgba(242, 240, 235, 0.10)',
        background: 'rgba(242, 240, 235, 0.02)',
        minHeight: 600,
      }}
    >
      <iframe
        src={calUrl}
        style={{ width: '100%', height: 720, border: 'none', display: 'block' }}
        title="Lagebild-Termin auswählen"
        loading="lazy"
        sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  )
}
