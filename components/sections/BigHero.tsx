'use client'

/**
 * Kompakter Sub-Page-Hero im Leistungs-Hero-Pattern.
 *
 * Layout:
 *   - w-screen, paddingTop 120px, kompakte paddingBottom (48-72px)
 *   - Background-Gradient mit Brand-Tönen
 *   - Grid 2-Spalten auf Desktop (Text links, Mini-Visual rechts)
 *   - Auf Mobile gestapelt
 *   - Content über dem Fold, kein full-screen
 *
 * Verglichen mit Mainpage-Hero (100svh, dramatic):
 *   Hier kompakt, ruhiger, Sub-Page-Tonality.
 */

import { type ReactNode } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowLeft } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const EASE = [0.16, 1, 0.3, 1] as const

export interface BigHeroFact {
  label: string
  value: string
}

interface BigHeroProps {
  eyebrowNum:    string
  eyebrow:       string
  eyebrowIcon?:  LucideIcon
  title:         ReactNode
  lede?:         ReactNode
  /** Optionaler Back-Link oben links (z.B. „← Zurück zur Übersicht") */
  backLink?:     { label: string; href: string }
  /** Fakten-Liste unten links (Dauer, Format, etc.) */
  facts?:        BigHeroFact[]
  /** Mini-Visual rechts — eigene Komponente */
  visual?:       ReactNode
}

export default function BigHero({
  eyebrowNum,
  eyebrow,
  eyebrowIcon: EyebrowIcon,
  title,
  lede,
  backLink,
  facts,
  visual,
}: BigHeroProps) {
  return (
    <section
      aria-label="Hero"
      className="relative w-screen overflow-hidden"
      style={{
        marginLeft: 'calc(-50vw + 50%)',
        background: 'var(--bg-base)',
        paddingTop: '120px',
        paddingBottom: 'clamp(48px, 6vw, 72px)',
      }}
    >
      {/* Background-Gradient — sanfter Brand-Glow rechts oben, dezent links unten */}
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
        {backLink && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <Link
              href={backLink.href}
              data-cursor="link"
              className="inline-flex items-center gap-2 font-mono uppercase transition-colors duration-220 hover:text-[color:var(--brand)]"
              style={{
                fontSize: '11px',
                letterSpacing: '0.18em',
                color: 'var(--fg-muted)',
              }}
            >
              <ArrowLeft size={11} strokeWidth={1.6} />
              {backLink.label}
            </Link>
          </motion.div>
        )}

        <div
          className={
            'mt-' + (backLink ? '8' : '0') +
            ' grid grid-cols-1 gap-12 lg:items-start lg:gap-16 ' +
            (visual ? 'lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]' : '')
          }
        >
          {/* LEFT — Text */}
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
                {EyebrowIcon && <EyebrowIcon size={13} strokeWidth={1.5} />}
                {eyebrowNum} · {eyebrow}
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
              {title}
            </motion.h1>

            {lede && (
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
                {lede}
              </motion.p>
            )}

            {facts && facts.length > 0 && (
              <motion.dl
                className="mt-10 flex flex-wrap gap-x-10 gap-y-5"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6, ease: EASE }}
              >
                {facts.map(f => (
                  <div key={f.label}>
                    <dt
                      className="font-mono uppercase"
                      style={{ fontSize: '9px', letterSpacing: '0.18em', color: 'var(--fg-subtle)' }}
                    >
                      {f.label}
                    </dt>
                    <dd
                      className="mt-2 font-display font-medium"
                      style={{
                        fontSize: '15px',
                        color: 'var(--fg-default)',
                        letterSpacing: '-0.005em',
                      }}
                    >
                      {f.value}
                    </dd>
                  </div>
                ))}
              </motion.dl>
            )}
          </div>

          {/* RIGHT — Mini-Visual */}
          {visual && (
            <motion.div
              className="relative mx-auto w-full"
              style={{ maxWidth: '520px', minHeight: 'clamp(280px, 36vw, 380px)' }}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
            >
              {visual}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
