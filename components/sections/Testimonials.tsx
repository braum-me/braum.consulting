'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import { Quote } from 'lucide-react'
import Section from '@/components/ui/Section'
import Eyebrow from '@/components/ui/Eyebrow'
import AccentGlow from '@/components/ui/AccentGlow'
import { TESTIMONIALS } from '@/lib/testimonials'

const EASE = [0.16, 1, 0.3, 1] as const

/**
 * Testimonials — echte, freigegebene Kundenstimmen.
 *
 * Datengetrieben aus lib/testimonials.ts. Solange dort keine Stimmen stehen,
 * rendert die Section NICHTS (kein Platzhalter, kein Fake — Brand-Regel). Sobald
 * echte Zitate eingetragen sind, erscheint die Sektion automatisch.
 *
 * Headline bewusst OHNE ItalicAccent: Hero + CasesFeatured belegen das
 * Italic-Budget der Homepage (max 2×) bereits.
 */
export default function Testimonials() {
  if (TESTIMONIALS.length === 0) return null

  return (
    <Section
      className="relative py-28 md:py-36"
      background={<AccentGlow position="top-left" intensity="medium" />}
    >
      <motion.div
        className="max-w-[760px]"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-15%' }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        {/* Bewusst ohne num: die Section ist dormant bis befüllt. Beim ersten
            echten Eintrag hier num="06" setzen und OperatorStory→07, Werkstatt→08,
            Faq→09 nachziehen, damit die Homepage-Sequenz stimmt. */}
        <Eyebrow>Stimmen</Eyebrow>
        <h2
          className="mt-6 font-display font-bold"
          style={{
            fontSize: 'clamp(40px, 5vw, 72px)',
            lineHeight: 'var(--lh-display)',
            letterSpacing: 'var(--tr-display)',
            color: 'var(--fg-default)',
          }}
        >
          Was Mandanten sagen.
        </h2>
      </motion.div>

      <div
        className="mt-14 grid gap-6"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}
      >
        {TESTIMONIALS.map((t, i) => {
          const card = (
            <>
              <Quote
                size={24}
                strokeWidth={1.5}
                style={{ color: 'var(--brand)', marginBottom: 20 }}
              />
              <blockquote
                className="font-display"
                style={{
                  fontSize: 'clamp(18px, 1.7vw, 22px)',
                  lineHeight: 1.45,
                  letterSpacing: '-0.01em',
                  color: 'var(--fg-default)',
                  margin: 0,
                }}
              >
                {t.quote}
              </blockquote>
              <footer
                className="mt-7 flex flex-col"
                style={{ borderTop: '1px solid rgba(242, 240, 235, 0.08)', paddingTop: 18 }}
              >
                <span
                  className="font-body font-semibold"
                  style={{ fontSize: 14, color: 'var(--fg-default)' }}
                >
                  {t.author}
                </span>
                <span className="font-body" style={{ fontSize: 13, color: 'var(--fg-muted)' }}>
                  {t.role}
                </span>
              </footer>
            </>
          )

          const cardStyle: React.CSSProperties = {
            display: 'flex',
            flexDirection: 'column',
            padding: 32,
            borderRadius: 10,
            background: 'rgba(242, 240, 235, 0.03)',
            border: '1px solid rgba(242, 240, 235, 0.10)',
            boxShadow: '0 16px 32px -8px rgba(0, 0, 0, 0.32)',
            height: '100%',
          }

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.6, ease: EASE, delay: i * 0.08 }}
            >
              {t.caseSlug ? (
                <Link
                  href={`/cases/${t.caseSlug}`}
                  className="group block transition-transform duration-300 hover:-translate-y-1"
                  style={cardStyle}
                >
                  {card}
                </Link>
              ) : (
                <div style={cardStyle}>{card}</div>
              )}
            </motion.div>
          )
        })}
      </div>
    </Section>
  )
}
