'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Section from '@/components/ui/Section'
import Eyebrow from '@/components/ui/Eyebrow'
import ItalicAccent from '@/components/ui/ItalicAccent'
import AccentGlow from '@/components/ui/AccentGlow'
import { CaseVisual, CASE_VISUAL_SLUGS } from '@/components/ui/CaseVisuals'
import { CASES, type CaseStudy } from '@/lib/cases'

const EASE = [0.16, 1, 0.3, 1] as const

/**
 * CasesFeatured — 4 Highlight-Cards mit kinematischen Case-Visuals.
 *
 * Jedes Visual ist ein eigenes kleines Theater: Multi-Layer-Glows, Floating-
 * Frames, Pulse-Rings, Typewriter-Effekte, animierte Workflow-Pfeile. Stil
 * identisch zu den Leistungs-Heros (MarkeHero, AiHero, M365Hero, StrategieHero).
 *
 * Alle Animationen respektieren prefers-reduced-motion.
 */
export default function CasesFeatured() {
  // Alle Highlights (featured), kategorieunabhängig — aktuell die 3 Marke-Cases.
  const highlights: CaseStudy[] = CASES.filter(c => c.featured)

  return (
    <Section
      className="relative py-28 md:py-36"
      background={<AccentGlow position="top-right" intensity="medium" />}
    >
      <motion.div
        className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-15%' }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <div className="max-w-[760px]">
          <Eyebrow num="06">Aus der Praxis</Eyebrow>
          <h2
            className="mt-6 font-display font-bold"
            style={{
              fontSize: 'clamp(40px, 5vw, 72px)',
              lineHeight: 'var(--lh-display)',
              letterSpacing: 'var(--tr-display)',
              color: 'var(--fg-default)',
            }}
          >
            Engagements mit <ItalicAccent>Outcomes</ItalicAccent>.
          </h2>
          <p
            className="mt-5 font-body"
            style={{
              fontSize: 'var(--t-body-lg)',
              lineHeight: 1.45,
              color: 'var(--fg-muted)',
              maxWidth: '560px',
            }}
          >
            Ausgewählte Highlights aus der Praxis — jedes mit echtem Outcome.
            Das ganze Portfolio gibt's einen Klick weiter.
          </p>
        </div>
      </motion.div>

      <motion.ul
        className="mt-14 grid grid-cols-1 gap-6 md:mt-20 md:grid-cols-3 md:gap-8"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        {highlights.map(c => (
          <li key={c.num}>
            <CaseCard c={c} />
          </li>
        ))}
      </motion.ul>

      <motion.div
        className="mt-14 flex justify-center md:mt-20"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <Link
          href="/cases"
          data-cursor="magnetic"
          className="inline-flex items-center gap-2 px-6 py-3 font-mono uppercase transition-colors duration-220 hover:text-[color:var(--brand)]"
          style={{
            fontSize: '12px',
            letterSpacing: '0.16em',
            color: 'var(--fg-default)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--r-pill)',
          }}
        >
          Alle Cases ansehen
          <ArrowRight size={13} strokeWidth={1.6} />
        </Link>
      </motion.div>
    </Section>
  )
}

/* ── Card-Wrapper ────────────────────────────────────────────────────── */

function CaseCard({ c }: { c: CaseStudy }) {
  return (
    <Link
      href={`/cases/${c.num}`}
      data-cursor="magnetic"
      className="glass-card group relative flex h-full flex-col overflow-hidden"
    >
      {/* Visual-Stage */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          aspectRatio: '16 / 9',
          borderBottom: '1px solid var(--border-subtle)',
          background:
            'radial-gradient(75% 90% at 50% 50%, rgba(146, 48, 30, 0.18) 0%, rgba(15, 14, 12, 0.6) 60%, var(--bg-base) 100%)',
        }}
      >
        {/* Background-Grain */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'var(--noise-svg)',
            mixBlendMode: 'overlay',
            opacity: 0.08,
          }}
        />
        {/* Brand-Glow */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60 transition-opacity duration-700 group-hover:opacity-100"
          style={{
            background:
              'radial-gradient(60% 60% at 50% 100%, rgba(220, 128, 68, 0.22) 0%, transparent 70%)',
          }}
        />
        {CASE_VISUAL_SLUGS.has(c.num) ? (
          <CaseVisual slug={c.num} />
        ) : c.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={c.image}
            alt={c.title}
            className="absolute inset-0 h-full w-full"
            style={{ objectFit: 'cover' }}
          />
        ) : null}
      </div>

      {/* Card-Body */}
      <div className="relative z-[3] flex flex-1 flex-col gap-5 p-6 md:p-7">
        <div className="flex items-center justify-between gap-3">
          <span
            className="font-mono uppercase"
            style={{
              fontSize: 'var(--t-micro)',
              letterSpacing: 'var(--tr-eyebrow)',
              color: 'var(--brand)',
            }}
          >
            {c.fieldLabel}
          </span>
          <span
            className="font-mono uppercase"
            style={{
              fontSize: '10px',
              letterSpacing: 'var(--tr-eyebrow)',
              color: 'var(--fg-subtle)',
            }}
          >
            {c.sector} · {c.year}
          </span>
        </div>

        <h3
          className="font-display font-semibold transition-colors duration-300 group-hover:text-[color:var(--brand)]"
          style={{
            fontSize: 'var(--t-h4)',
            lineHeight: 1.2,
            letterSpacing: 'var(--tr-heading)',
            color: 'var(--fg-default)',
          }}
        >
          {c.title}
        </h3>

        {c.brief && (
          <p
            className="font-body"
            style={{
              fontSize: 'var(--t-body-sm)',
              lineHeight: 1.45,
              color: 'var(--fg-muted)',
            }}
          >
            {c.brief}
          </p>
        )}

        <div
          className="mt-auto flex items-end justify-between gap-4 pt-2"
          style={{ borderTop: '1px solid var(--border-subtle)' }}
        >
          <div className="pt-4">
            <p
              className="font-display font-bold"
              style={{
                fontSize: 'var(--t-h3)',
                lineHeight: 1,
                color: 'var(--accent)',
                letterSpacing: 'var(--tr-heading)',
              }}
            >
              {c.metric}
            </p>
            <p
              className="mt-1.5 font-mono uppercase"
              style={{
                fontSize: '10px',
                letterSpacing: 'var(--tr-eyebrow)',
                color: 'var(--fg-subtle)',
              }}
            >
              {c.metricLabel}
            </p>
          </div>
          <span
            className="inline-flex shrink-0 items-center gap-2 pb-1 font-body transition-colors duration-220 group-hover:text-[color:var(--brand)]"
            style={{
              fontSize: 'var(--t-body-sm)',
              color: 'var(--fg-default)',
            }}
          >
            Case lesen
            <ArrowRight
              size={14}
              strokeWidth={1.5}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </span>
        </div>
      </div>
    </Link>
  )
}


