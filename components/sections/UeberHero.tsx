'use client'

import { motion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowDown } from 'lucide-react'

// Gleiches Portrait wie im Homepage-Hero (stefan-shirt.webp = Anzug+Krawatte),
// damit der Auftritt seitenübergreifend konsistent ist.
import portraitShirt from '@/public/assets/portrait/stefan-shirt.webp'
import ItalicAccent from '@/components/ui/ItalicAccent'
import AccentGlow from '@/components/ui/AccentGlow'
import MonogramOutline from '@/components/ui/MonogramOutline'
import AnimatedMetric from '@/components/ui/AnimatedMetric'

const EASE = [0.16, 1, 0.3, 1] as const

const STATS: Array<{ value: string; label: string }> = [
  { value: '12+', label: 'Jahre IT-Praxis' },
  { value: '20+', label: 'Dokumentierte Projekte' },
  { value: '20+', label: 'Mandate seit 2023' },
]

/**
 * Kinematisches Hero: großes Portrait rechts (Desktop 60vw, Mobile 60vh oben),
 * Big-Type-Identity links, Stats-Reihe unten, ScrollCue. Editorial-dark
 * Atmosphäre mit Vignetten, Monogramm-Outline, AccentGlow.
 */
export default function UeberHero() {
  return (
    <section
      aria-label="Über Stefan"
      className="relative w-screen overflow-hidden"
      style={{
        marginLeft: 'calc(-50vw + 50%)',
        minHeight: '100vh',
        background: 'var(--bg-base)',
      }}
    >
      {/* Atmospheric layers */}
      <AccentGlow position="bottom-right" intensity="medium" />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          left: '-18vw',
          top: '12%',
          width: 'clamp(800px, 105vw, 1500px)',
          aspectRatio: '2 / 1',
          color: '#F2F0EB',
          opacity: 0.16,
          filter:
            'drop-shadow(0 0 60px rgba(200, 98, 42, 0.55)) drop-shadow(0 0 16px rgba(220, 128, 68, 0.40))',
          zIndex: 1,
        }}
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 0.16, x: 0 }}
        transition={{ duration: 1.6, ease: EASE }}
      >
        <MonogramOutline strokeWidth={0.6} style={{ width: '100%', height: '100%' }} />
      </motion.div>

      {/* Portrait Cutout (Desktop) — transparenter PNG/WebP, sitzt
          neben dem Text rechts. Keine Maske, kein Fade nötig —
          Alpha-Kanal regelt die Form. */}
      <motion.div
        className="absolute z-[2] hidden lg:block"
        style={{
          width: 'clamp(420px, 40vw, 620px)',
          height: 'clamp(560px, 72vh, 760px)',
          top: '144px',
          right: 'clamp(96px, 12vw, 240px)',
        }}
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.0, delay: 0.2, ease: EASE }}
      >
        <Image
          src={portraitShirt}
          alt="Stefan Braum"
          fill
          priority
          placeholder="blur"
          sizes="(min-width: 1024px) 40vw, 620px"
          className="object-contain"
          style={{
            objectPosition: 'center bottom',
            filter: 'drop-shadow(0 30px 60px rgba(0, 0, 0, 0.5))',
          }}
        />
      </motion.div>


      {/* Text + Stats Stack — Mobile: Headline ZUERST, Portrait darunter */}
      <div
        className="relative z-[5] mx-auto w-full max-w-[var(--container-wide)] px-6 pt-32 md:px-12 lg:flex lg:min-h-screen lg:flex-col lg:justify-center lg:pt-40 lg:pb-32"
      >
        <div className="pb-20 lg:max-w-[720px]">
          <motion.p
            className="font-mono uppercase"
            style={{
              fontSize: '11px',
              letterSpacing: '0.20em',
              color: 'var(--brand)',
            }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            01 · Hinter Braum Consulting
          </motion.p>

          <h1
            className="mt-6 font-display font-black"
            style={{
              fontSize: 'clamp(44px, 5.4vw, 80px)',
              lineHeight: 0.98,
              letterSpacing: 'var(--tr-display)',
              color: 'var(--fg-default)',
            }}
          >
            <span
              className="reveal-line block whitespace-normal lg:whitespace-nowrap"
              style={{ ['--reveal-delay' as string]: '300ms' }}
            >
              Aus der <ItalicAccent>Industrie-IT</ItalicAccent>.
            </span>
            <span
              className="reveal-line block"
              style={{ ['--reveal-delay' as string]: '500ms' }}
            >
              Für dein <ItalicAccent>Haus</ItalicAccent>.
            </span>
          </h1>

          <motion.p
            className="mt-10 font-body"
            style={{
              fontSize: '18px',
              lineHeight: 1.55,
              color: 'var(--fg-muted)',
              maxWidth: '520px',
            }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.60 }}
          >
            IT-Verantwortung in der DACH-Industrie. Eigene Praxis für
            den inhabergeführten Mittelstand.
          </motion.p>

          {/* Mobile: Portrait NACH der Headline (zentriert) */}
          <motion.div
            className="mt-10 flex justify-center lg:hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
          >
            <div
              className="relative"
              style={{
                width: 'clamp(260px, 68vw, 380px)',
                height: 'clamp(340px, 90vw, 500px)',
              }}
            >
              <Image
                src={portraitShirt}
                alt="Stefan Braum"
                fill
                priority
                placeholder="blur"
                sizes="(max-width: 1023px) 68vw, 1px"
                className="object-contain"
                style={{
                  objectPosition: 'center bottom',
                  filter: 'drop-shadow(0 16px 40px rgba(0, 0, 0, 0.5))',
                }}
              />
            </div>
          </motion.div>

          {/* Stats */}
          <motion.dl
            className="mt-14 grid grid-cols-3 gap-6 md:gap-10 lg:mt-16"
            style={{
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '32px',
            }}
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1, delayChildren: 0.8 },
              },
            }}
          >
            {STATS.map((s, i) => (
              <motion.div
                key={s.value}
                variants={{
                  hidden: { opacity: 0, y: 14 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.55, ease: EASE }}
              >
                <dt>
                  <AnimatedMetric
                    value={s.value}
                    duration={2400}
                    startDelay={1300 + i * 100}
                    className="font-display font-black"
                    style={{
                      fontSize: 'clamp(36px, 4.2vw, 64px)',
                      lineHeight: 1,
                      color: 'var(--accent)',
                      letterSpacing: 'var(--tr-display)',
                      display: 'inline-block',
                    }}
                  />
                </dt>
                <dd
                  className="mt-2 font-mono uppercase"
                  style={{
                    fontSize: '10px',
                    letterSpacing: 'var(--tr-eyebrow)',
                    color: 'var(--fg-muted)',
                    lineHeight: 1.3,
                  }}
                >
                  {s.label}
                </dd>
              </motion.div>
            ))}
          </motion.dl>

          {/* Scroll cue */}
          <motion.div
            className="mt-14"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.4 }}
          >
            <Link
              href="#werdegang"
              data-cursor="magnetic"
              className="inline-flex items-center gap-3 font-mono uppercase transition-colors duration-220 hover:text-[color:var(--brand)]"
              style={{
                fontSize: '11px',
                letterSpacing: '0.18em',
                color: 'var(--fg-muted)',
              }}
            >
              <ArrowDown size={12} strokeWidth={1.6} />
              Den Weg sehen
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
