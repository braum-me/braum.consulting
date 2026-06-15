'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowDown } from 'lucide-react'

import portraitShirt from '@/public/assets/portrait/stefan-shirt.webp'

import Eyebrow from '@/components/ui/Eyebrow'
import ItalicAccent from '@/components/ui/ItalicAccent'
import AnimatedGradient from '@/components/ui/AnimatedGradient'
import MonogramOutline from '@/components/ui/MonogramOutline'
import HeroStatus from '@/components/home/HeroStatus'
import { trackEvent } from '@/lib/analytics'

const HeroParticles = dynamic(() => import('@/components/home/HeroParticles'), {
  ssr: false,
  loading: () => null,
})

const EASE = [0.16, 1, 0.3, 1] as const

/**
 * Headline-Varianten (siehe Brief, B ist final pick).
 * A: „Digitale Praxis. Operative Klarheit."
 * B: „Digitales Handwerk, das hält."   ← FINAL
 * C: „Substanz statt Folien."
 */
export default function Hero() {
  const reduce = useReducedMotion()

  // three.js-Hintergrund nur auf Desktop/pointer:fine mounten. HeroParticles
  // gibt auf Touch ohnehin null zurück — aber als dynamic()-Import würde der
  // schwere three-Chunk sonst trotzdem auf Mobile geladen. Dieses Gate (gleiche
  // Bedingung wie HeroParticles intern) verhindert den Fetch dort komplett.
  const [showParticles, setShowParticles] = useState(false)
  useEffect(() => {
    setShowParticles(
      window.matchMedia('(min-width: 768px) and (pointer: fine)').matches &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    )
  }, [])

  return (
    <section
      className="relative min-h-[100svh] overflow-hidden flex items-center"
      aria-label="Hero"
    >
      <AnimatedGradient variant="hero" />

      {/* Extra Brand-Glow nur Mobile — Nur im oberen Headline-Bereich,
          damit der HeroStatus weiter unten seine Standard-Atmosphäre behält
          (sonst zu viel Orange-Saturierung in der Kapazitäts-Card). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[55%] md:hidden"
        style={{
          background:
            'radial-gradient(75% 60% at 95% 15%, rgba(220, 128, 68, 0.22) 0%, transparent 65%),' +
            'radial-gradient(55% 50% at 0% 35%, rgba(200, 98, 42, 0.12) 0%, transparent 65%)',
          zIndex: 1,
        }}
      />

      {/* Großes Monogramm-Outline als Background-Artefakt.
          Mobile: kleiner + dezenter + klar rechtsbündig.
          Desktop: dominant rechts neben dem Text. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-[-40vw] top-[32%] w-[clamp(440px,80vw,640px)] opacity-[0.12] md:right-[-22vw] md:top-[28%] md:w-[clamp(900px,145vw,1900px)] md:opacity-30"
        style={{
          transform: 'translateY(-50%)',
          height: 'auto',
          aspectRatio: '2 / 1',
          color: '#F2F0EB',
          filter:
            'drop-shadow(0 0 60px rgba(200, 98, 42, 0.55)) drop-shadow(0 0 16px rgba(220, 128, 68, 0.42))',
          zIndex: 1,
        }}
        initial={reduce ? false : { scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.4, ease: EASE }}
      >
        <MonogramOutline strokeWidth={0.8} style={{ width: '100%', height: '100%' }} />
      </motion.div>

      {showParticles && <HeroParticles />}

      <div className="relative z-[5] mx-auto w-full max-w-[var(--container-wide)] px-6 pt-40 pb-16 md:px-12 md:pt-44 md:pb-24">
        <div className="max-w-[860px]">
          <Eyebrow num="01">Digitaler Lotse für Mittelstand & Industrie</Eyebrow>

          <h1
            className="mt-8 font-display font-black"
            style={{
              fontSize: 'clamp(38px, 5.6vw, 84px)',
              lineHeight: 1,
              letterSpacing: 'var(--tr-display)',
              color: 'var(--fg-default)',
            }}
          >
            <motion.span
              className="block"
              initial={reduce ? 'show' : 'hidden'}
              whileInView="show"
              viewport={{ once: true, amount: 0 }}
              variants={{
                hidden: {},
                show:   { transition: { staggerChildren: 0.07, delayChildren: 0.25 } },
              }}
            >
              {['Vom', 'digitalen', 'Nebel'].map(w => (
                <motion.span
                  key={w}
                  className="inline-block"
                  style={{ marginRight: '0.28em' }}
                  variants={{
                    hidden: { opacity: 0, y: 18 },
                    show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
                  }}
                >
                  {w}
                </motion.span>
              ))}
            </motion.span>
            <motion.span
              className="block"
              initial={reduce ? 'show' : 'hidden'}
              whileInView="show"
              viewport={{ once: true, amount: 0 }}
              variants={{
                hidden: {},
                show:   { transition: { staggerChildren: 0.07, delayChildren: 0.55 } },
              }}
            >
              <motion.span
                className="inline-block"
                style={{ marginRight: '0.28em' }}
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
                }}
              >
                zum
              </motion.span>
              <motion.span
                className="inline-block"
                style={{ marginRight: '0.28em' }}
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
                }}
              >
                klaren
              </motion.span>
              <motion.span
                className="inline-block"
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
                }}
              >
                <ItalicAccent>Kurs</ItalicAccent>.
              </motion.span>
            </motion.span>
          </h1>

          <motion.p
            className="mt-10 font-body max-w-[580px]"
            style={{
              fontSize: '17px',
              lineHeight: 1.6,
              color: 'var(--fg-muted)',
            }}
            initial={reduce ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.55, delay: 0.95, ease: EASE }}
          >
            Ich helfe Mittelstand und Industrie, digitale Vorhaben —
            Marke, moderne IT, KI und Automatisierung — so aufzubauen,
            dass sie im Alltag wirklich funktionieren.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.55, delay: 1.2, ease: EASE }}
          >
            <Link
              href="/lagebild"
              data-cursor="magnetic"
              onClick={() => trackEvent('cta_lagebild_hero')}
              className="btn-accent-pulse cta-primary inline-flex items-center gap-2 px-7 py-[14px] font-body font-semibold"
              style={{
                fontSize: '14px',
                background: 'var(--accent)',
                color: 'var(--on-accent)',
                borderRadius: 'var(--r-sm)',
              }}
            >
              Digitales Lagebild anfragen
              <ArrowRight size={16} strokeWidth={1.5} aria-hidden />
            </Link>

            <Link
              href="#lotsenprinzip"
              data-cursor="magnetic"
              onClick={() => trackEvent('cta_arbeitsweise_hero')}
              className="group/sec inline-flex items-center gap-2 px-6 py-[14px] font-body font-medium transition-colors duration-220 hover:border-[color:var(--border-strong)] hover:text-[color:var(--fg-default)]"
              style={{
                fontSize: '14px',
                color: 'var(--fg-muted)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--r-sm)',
              }}
            >
              Arbeitsweise ansehen
              <ArrowDown
                size={14}
                strokeWidth={1.5}
                aria-hidden
                className="transition-transform duration-220 group-hover/sec:translate-y-0.5"
              />
            </Link>
          </motion.div>

          {/* Trust-Chips staggered */}
          <motion.ul
            className="mt-6 mb-8 hidden flex-col items-start gap-2 md:flex md:flex-row md:flex-wrap md:items-center md:gap-3"
            aria-label="Vertrauenspunkte"
            initial={reduce ? 'show' : 'hidden'}
            whileInView="show"
            viewport={{ once: true, amount: 0 }}
            variants={{
              hidden: {},
              show:   { transition: { staggerChildren: 0.08, delayChildren: 1.35 } },
            }}
          >
            {[
              '12 Jahre IT-Praxis',
              'M365 · Azure · Automation',
              'Mittelstand & Industrie',
            ].map(chip => (
              <motion.li
                key={chip}
                className="trust-chip font-mono uppercase"
                style={{
                  fontSize: '12px',
                  letterSpacing: '0.10em',
                  color: 'var(--fg-muted)',
                  padding: '6px 12px',
                  border: '1px solid var(--border-default)',
                  borderRadius: '999px',
                  whiteSpace: 'nowrap',
                }}
                variants={{
                  hidden: { opacity: 0, y: 10, scale: 0.96 },
                  show:   { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: EASE } },
                }}
              >
                {chip}
              </motion.li>
            ))}
          </motion.ul>

          <motion.div
            className="mt-10 flex flex-col items-start gap-8"
            initial={reduce ? false : { opacity: 0, x: -14 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.6, delay: 1.55, ease: EASE }}
          >
            {/* Portrait + Name immer nebeneinander */}
            <div className="flex items-center gap-5">
              <div
                className="tilt-on-hover relative overflow-hidden shrink-0"
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: 'var(--r-md)',
                  border: '1px solid var(--border-default)',
                  boxShadow: 'var(--sh-2)',
                  background: 'var(--bg-elevated)',
                }}
              >
                <Image
                  src={portraitShirt}
                  alt="Stefan Braum"
                  fill
                  sizes="80px"
                  className="object-cover"
                  priority
                  placeholder="blur"
                  style={{ objectPosition: 'center 18%' }}
                />
              </div>
              <div>
                <p
                  className="font-body font-semibold leading-tight"
                  style={{ fontSize: '15px', color: 'var(--fg-default)' }}
                >
                  Stefan Braum
                </p>
                <p
                  className="font-mono mt-1.5"
                  style={{
                    fontSize: '11px',
                    color: 'var(--fg-subtle)',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}
                >
                  IT-Teamleiter · Operator · Lotse
                </p>
              </div>
            </div>

            {/* Mobile: HeroStatus UNTER dem Stefan-Block */}
            <div className="w-full md:hidden">
              <HeroStatus />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Desktop: Status absolut in der unteren rechten Ecke */}
      <div className="pointer-events-none absolute inset-0 z-[6] hidden md:block">
        <div className="mx-auto h-full w-full max-w-[var(--container-wide)] px-6 md:px-12">
          <div className="pointer-events-auto absolute bottom-12 right-6 md:right-12">
            <HeroStatus />
          </div>
        </div>
      </div>
    </section>
  )
}
