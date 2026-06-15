'use client'

import { motion } from 'motion/react'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import AnimatedMetric from './AnimatedMetric'
import type { CaseStudy } from '@/lib/cases'

const EASE = [0.16, 1, 0.3, 1] as const

/**
 * Cinematic Case-Hero: full-bleed, field-tinted Gradient pro Service-Slug,
 * Animated Counter auf Metric, Big-Type-Title, kompakter Fact-Grid unten.
 *
 * Ersetzt die generische PageHero für /cases/[id].
 */

/**
 * Alle Felder bleiben im Brand-Palette (warm-ink + burnt-amber). Subtile
 * Hue-Shifts pro Field: marke = pure brand, m365 = etwas cooler/rost,
 * ai = goldener, strategie = deeper/dimmer. Keine Out-of-Palette-Farben.
 */
const FIELD_TINT: Record<CaseStudy['field'], { primary: string; secondary: string }> = {
  m365:      { primary: 'rgba(200, 98, 42, 0.18)',   secondary: 'rgba(146, 48, 30, 0.06)' },
  marke:     { primary: 'rgba(220, 128, 68, 0.22)',  secondary: 'rgba(220, 128, 68, 0.06)' },
  ai:        { primary: 'rgba(224, 168, 80, 0.20)',  secondary: 'rgba(200, 130, 50, 0.06)' },
  strategie: { primary: 'rgba(180, 80, 32, 0.20)',   secondary: 'rgba(120, 50, 20, 0.06)' },
}

interface Props {
  c: CaseStudy
}

export default function CaseHero({ c }: Props) {
  const tint = FIELD_TINT[c.field] ?? FIELD_TINT.strategie

  return (
    <section
      aria-label={`Case ${c.num}`}
      className="relative w-screen overflow-hidden"
      style={{
        marginLeft: 'calc(-50vw + 50%)',
        background: 'var(--bg-base)',
        paddingTop: '128px',
        paddingBottom: '40px',
      }}
    >
      {/* Field-Tinted Gradient-Backdrop */}
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
        {/* Back-Link */}
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <Link
            href="/cases"
            data-cursor="link"
            className="inline-flex items-center gap-2 font-mono uppercase transition-colors duration-220 hover:text-[color:var(--brand)]"
            style={{
              fontSize: '11px',
              letterSpacing: '0.18em',
              color: 'var(--fg-muted)',
            }}
          >
            <ArrowLeft size={11} strokeWidth={1.6} />
            Zum Portfolio
          </Link>
        </motion.div>

        {/* Case Number Badge + Field Label */}
        <motion.div
          className="mt-12 flex flex-wrap items-baseline gap-x-6 gap-y-2"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
        >
          <span
            className="font-mono uppercase"
            style={{
              fontSize: '12px',
              letterSpacing: '0.20em',
              color: 'var(--brand)',
              padding: '6px 14px',
              border: '1px solid rgba(220, 128, 68, 0.30)',
              borderRadius: 'var(--r-pill)',
            }}
          >
            {c.anonymized ? 'Case · anonym' : 'Case'}
          </span>
          <span
            className="font-mono uppercase"
            style={{
              fontSize: '11px',
              letterSpacing: '0.18em',
              color: 'var(--fg-muted)',
            }}
          >
            {c.fieldLabel}
          </span>
          <span style={{ color: 'var(--fg-faint)' }}>·</span>
          <span
            className="font-mono"
            style={{
              fontSize: '11px',
              color: 'var(--fg-muted)',
              letterSpacing: '0.04em',
            }}
          >
            {c.year} · {c.duration}
          </span>
        </motion.div>

        {/* Big Title */}
        <motion.h1
          className="mt-10 font-display font-bold"
          style={{
            fontSize: 'clamp(40px, 6vw, 92px)',
            lineHeight: 1.02,
            letterSpacing: 'var(--tr-display)',
            color: 'var(--fg-default)',
            maxWidth: '1100px',
          }}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
        >
          {c.title}
        </motion.h1>

        {/* Lede */}
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
          {c.brief}
        </motion.p>

        {/* Live-Website-Link (nur bei öffentlichen Kunden-Cases) */}
        {c.clientUrl && (
          <motion.div
            className="mt-6"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55, ease: EASE }}
          >
            <a
              href={c.clientUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="link"
              className="inline-flex items-center gap-2 font-mono uppercase transition-colors duration-220 hover:text-[color:var(--brand)]"
              style={{
                fontSize: '11px',
                letterSpacing: '0.18em',
                color: 'var(--fg-default)',
                padding: '9px 16px',
                border: '1px solid var(--border-strong)',
                borderRadius: 'var(--r-pill)',
              }}
            >
              Website ansehen
              <ArrowUpRight size={13} strokeWidth={1.7} />
            </a>
          </motion.div>
        )}

        {/* Big Metric Cluster — Animated Counter */}
        <motion.div
          className="mt-16 flex flex-wrap items-end gap-x-16 gap-y-10"
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
              Outcome
            </p>
            <AnimatedMetric
              value={c.metric}
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
              {c.metricLabel}
            </p>
          </div>

          {/* Inline-Facts */}
          <dl className="flex flex-wrap gap-x-12 gap-y-6">
            <FactInline label="Sektor"   value={c.sector} />
            <FactInline label="Jahr"     value={c.year} />
            <FactInline label="Laufzeit" value={c.duration} />
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
        style={{
          fontSize: '9px',
          letterSpacing: '0.18em',
          color: 'var(--fg-subtle)',
        }}
      >
        {label}
      </dt>
      <dd
        className="mt-2 font-display font-medium"
        style={{
          fontSize: '15px',
          color: 'var(--fg-default)',
          letterSpacing: '-0.005em',
        }}
      >
        {value}
      </dd>
    </div>
  )
}
