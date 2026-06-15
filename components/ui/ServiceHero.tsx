'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import { ArrowLeft, Globe, Server, Brain, Compass } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import AnimatedMetric from './AnimatedMetric'
import type { Service, ServiceSlug } from '@/lib/cms'

// Icon-Resolve client-side (kann nicht über Server→Client-Props serialisiert werden)
const ICON_BY_SLUG: Record<ServiceSlug, LucideIcon> = {
  marke:     Globe,
  m365:      Server,
  ai:        Brain,
  strategie: Compass,
}

const EASE = [0.16, 1, 0.3, 1] as const

/**
 * Cinematic Service-Hero, field-tinted pro Slug (brand-internal Palette).
 * Verwendet auf /leistungen/[slug].
 */

const FIELD_TINT: Record<ServiceSlug, { primary: string; secondary: string }> = {
  m365:      { primary: 'rgba(200, 98, 42, 0.18)',  secondary: 'rgba(146, 48, 30, 0.06)' },
  marke:     { primary: 'rgba(220, 128, 68, 0.22)', secondary: 'rgba(220, 128, 68, 0.06)' },
  ai:        { primary: 'rgba(224, 168, 80, 0.20)', secondary: 'rgba(200, 130, 50, 0.06)' },
  strategie: { primary: 'rgba(180, 80, 32, 0.20)',  secondary: 'rgba(120, 50, 20, 0.06)' },
}

export default function ServiceHero({ s }: { s: Service }) {
  const tint = FIELD_TINT[s.slug]
  const Icon = ICON_BY_SLUG[s.slug] ?? Compass

  return (
    <section
      aria-label={`Leistung ${s.title}`}
      className="relative w-screen overflow-hidden"
      style={{
        marginLeft: 'calc(-50vw + 50%)',
        minHeight: '85vh',
        background: 'var(--bg-base)',
        paddingTop: '128px',
        paddingBottom: '64px',
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(60% 70% at 80% 10%, ${tint.primary} 0%, transparent 60%),
                       radial-gradient(50% 60% at 10% 90%, ${tint.secondary} 0%, transparent 60%)`,
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

        <motion.div
          className="mt-12 flex flex-wrap items-baseline gap-x-6 gap-y-2"
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
            <Icon size={13} strokeWidth={1.5} />
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
          className="mt-10 font-display font-bold"
          style={{
            fontSize: 'clamp(40px, 6vw, 92px)',
            lineHeight: 1.02,
            letterSpacing: 'var(--tr-display)',
            color: 'var(--fg-default)',
            maxWidth: '1080px',
          }}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
        >
          {s.title}
        </motion.h1>

        <motion.p
          className="mt-8 font-body"
          style={{
            fontSize: 'clamp(17px, 1.6vw, 21px)',
            lineHeight: 1.55,
            color: 'var(--fg-muted)',
            maxWidth: '720px',
          }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          {s.lead}
        </motion.p>

        <motion.div
          className="mt-20 flex flex-wrap items-end gap-x-16 gap-y-10"
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
                marginBottom: '14px',
              }}
            >
              Typisches Ergebnis
            </p>
            <AnimatedMetric
              value={s.result}
              className="font-display font-black"
              style={{
                fontSize: 'clamp(56px, 8vw, 132px)',
                lineHeight: 0.92,
                letterSpacing: 'var(--tr-display)',
                color: 'var(--accent)',
                display: 'inline-block',
              }}
            />
            <p
              className="mt-3 font-mono uppercase"
              style={{
                fontSize: '11px',
                letterSpacing: '0.18em',
                color: 'var(--fg-default)',
                opacity: 0.85,
              }}
            >
              {s.resultLabel}
            </p>
          </div>

          <dl className="flex flex-wrap gap-x-12 gap-y-6">
            <FactInline label="Dauer" value={s.duration} />
          </dl>
        </motion.div>
      </div>
    </section>
  )
}

function FactInline({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt
        className="font-mono uppercase"
        style={{ fontSize: '9px', letterSpacing: '0.18em', color: 'var(--fg-subtle)' }}
      >
        {label}
      </dt>
      <dd
        className="mt-2 font-display font-medium"
        style={{ fontSize: '15px', color: 'var(--fg-default)', letterSpacing: '-0.005em' }}
      >
        {value}
      </dd>
    </div>
  )
}
