'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import Section from '@/components/ui/Section'
import Eyebrow from '@/components/ui/Eyebrow'
import ItalicAccent from '@/components/ui/ItalicAccent'
import AccentGlow from '@/components/ui/AccentGlow'
import { ServiceVisual } from '@/components/ui/ServiceVisuals'
import { SERVICES, type ServiceSlug } from '@/lib/services'

const EASE = [0.16, 1, 0.3, 1] as const

const CARD_OUTCOME: Record<ServiceSlug, string> = {
  marke:     'Nutzbarer Funnel',
  m365:      'Belastbare Cloud-Grundlage',
  ai:        'Produktiver Workflow',
  strategie: 'Tragfähige Strukturen',
}

export default function Services() {
  return (
    <Section
      className="relative py-28 md:py-36"
      background={<AccentGlow position="bottom-right" intensity="medium" />}
    >
      <motion.div
        className="max-w-[920px]"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-15%' }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <Eyebrow num="03">Leistungen</Eyebrow>
        <h2
          className="mt-6 font-display font-bold"
          style={{
            fontSize: 'clamp(40px, 5vw, 72px)',
            lineHeight: 'var(--lh-display)',
            letterSpacing: 'var(--tr-display)',
            color: 'var(--fg-default)',
          }}
        >
          Vier Felder. Eine <ItalicAccent>Hand</ItalicAccent>.
        </h2>
        <p
          className="mt-8 max-w-[560px] font-body"
          style={{
            fontSize: 'var(--t-body-lg)',
            lineHeight: 1.55,
            color: 'var(--fg-muted)',
          }}
        >
          Marke, M365, KI und Betriebsführung. Vier Schwerpunkte, die im
          inhabergeführten Mittelstand und in der Industrie in der Praxis
          ineinandergreifen. Du bekommst alle vier aus einer Person, ohne
          Schnittstelle zwischen Abteilungen.
        </p>
      </motion.div>

      <div className="mt-16 grid grid-cols-1 gap-5 md:mt-20 md:grid-cols-2 md:gap-6" data-services-grid>
        {SERVICES.map((s, i) => {
          const teaser = s.caseRefs[0]
          return (
            <motion.div
              key={s.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
            >
              <Link
                href={`/leistungen/${s.slug}`}
                data-cursor="magnetic"
                className="glass-card group relative block overflow-hidden md:min-h-[560px]"
                style={{ height: '100%' }}
              >
                {/* Visual-Stage oben */}
                <div
                  className="relative w-full overflow-hidden"
                  style={{
                    aspectRatio: '16 / 9',
                    borderBottom: '1px solid var(--border-subtle)',
                    background:
                      'radial-gradient(75% 90% at 50% 50%, rgba(146, 48, 30, 0.16) 0%, rgba(15, 14, 12, 0.6) 60%, var(--bg-base) 100%)',
                  }}
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                      backgroundImage: 'var(--noise-svg)',
                      mixBlendMode: 'overlay',
                      opacity: 0.08,
                    }}
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-60 transition-opacity duration-700 group-hover:opacity-100"
                    style={{
                      background:
                        'radial-gradient(60% 60% at 50% 100%, rgba(220, 128, 68, 0.22) 0%, transparent 70%)',
                    }}
                  />
                  <ServiceVisual slug={s.slug} />
                </div>

                {/* Card-Body — default Layer. Faded nur aus, wenn es einen
                    Case-Teaser zum Einblenden gibt (sonst bliebe die Card auf
                    Hover leer — passiert bei Services ohne caseRefs). */}
                <div className={`relative z-[3] flex flex-col p-6 transition-all duration-500 md:p-8${teaser ? ' md:group-hover:opacity-0 md:group-hover:-translate-y-2' : ''}`}>
                  <div className="flex items-center justify-between gap-3">
                    <p
                      className="font-mono uppercase"
                      style={{
                        fontSize: 'var(--t-micro)',
                        letterSpacing: 'var(--tr-eyebrow)',
                        color: 'var(--brand)',
                      }}
                    >
                      {s.num}
                    </p>
                    <ArrowUpRight
                      size={18}
                      strokeWidth={1.5}
                      className="opacity-30 transition-all duration-300 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      style={{ color: 'var(--accent)' }}
                    />
                  </div>

                  <h3
                    className="mt-3 font-display font-semibold"
                    style={{
                      fontSize: 'clamp(22px, 2vw, 28px)',
                      lineHeight: 1.15,
                      letterSpacing: 'var(--tr-heading)',
                      color: 'var(--fg-default)',
                    }}
                  >
                    {s.title}
                  </h3>
                  <p
                    className="mt-2 font-display"
                    style={{
                      fontSize: 'var(--t-body)',
                      color: 'var(--fg-muted)',
                      fontWeight: 400,
                    }}
                  >
                    {s.short}
                  </p>

                  <motion.ul
                    className="mt-5 space-y-2"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-15%' }}
                    variants={{
                      hidden: {},
                      show: { transition: { staggerChildren: 0.07, delayChildren: 0.25 } },
                    }}
                  >
                    {s.bullets.map(b => (
                      <motion.li
                        key={b}
                        className="flex items-start gap-3 font-body"
                        style={{
                          fontSize: 'var(--t-body-sm)',
                          color: 'var(--fg-default)',
                        }}
                        variants={{
                          hidden: { opacity: 0, x: -6 },
                          show:   { opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE } },
                        }}
                      >
                        <span
                          aria-hidden
                          className="mt-2 inline-block h-1 w-1 shrink-0"
                          style={{
                            background: 'var(--accent)',
                            borderRadius: 'var(--r-pill)',
                          }}
                        />
                        {b}
                      </motion.li>
                    ))}
                  </motion.ul>

                  <p
                    className="font-mono uppercase"
                    style={{
                      fontSize: '11px',
                      letterSpacing: '0.14em',
                      color: 'var(--brand)',
                      paddingTop: '14px',
                      marginTop: '18px',
                      borderTop: '1px solid rgba(220, 128, 68, 0.20)',
                    }}
                  >
                    Ergebnis · {CARD_OUTCOME[s.slug]}
                  </p>
                </div>

                {/* Hover-Reveal Case-Teaser — Desktop */}
                {teaser && (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-[4] hidden flex-col justify-end p-6 opacity-0 transition-all duration-500 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 md:flex md:p-8"
                    style={{
                      background:
                        'linear-gradient(180deg, transparent 0%, rgba(15, 14, 12, 0.55) 38%, rgba(15, 14, 12, 0.92) 60%)',
                    }}
                  >
                    <div>
                      <p
                        className="font-mono uppercase"
                        style={{
                          fontSize: 'var(--t-micro)',
                          letterSpacing: 'var(--tr-eyebrow)',
                          color: 'var(--accent)',
                        }}
                      >
                        Beispiel · {teaser.title}
                      </p>
                      <p
                        className="mt-4 font-display font-black"
                        style={{
                          fontSize: 'clamp(36px, 4vw, 56px)',
                          lineHeight: 1,
                          letterSpacing: 'var(--tr-display)',
                          color: 'var(--accent)',
                        }}
                      >
                        {teaser.metric}
                      </p>
                      <p
                        className="mt-2 font-mono uppercase"
                        style={{
                          fontSize: 'var(--t-micro)',
                          letterSpacing: 'var(--tr-eyebrow)',
                          color: 'var(--fg-muted)',
                        }}
                      >
                        {teaser.metricLabel}
                      </p>
                      <p
                        className="mt-6 inline-flex items-center gap-2 font-body"
                        style={{
                          fontSize: 'var(--t-body-sm)',
                          color: 'var(--fg-default)',
                        }}
                      >
                        Mehr über {s.title.split(' & ')[0].split(',')[0]}
                        <ArrowUpRight size={14} strokeWidth={1.5} />
                      </p>
                    </div>
                  </div>
                )}
              </Link>
            </motion.div>
          )
        })}
      </div>
    </Section>
  )
}

