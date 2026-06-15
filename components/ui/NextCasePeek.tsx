'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import CaseMockup from '@/components/ui/CaseMockup'
import type { CaseStudy } from '@/lib/cases'

const EASE = [0.16, 1, 0.3, 1] as const

/**
 * Full-Bleed „Next Case"-Sektion am Ende der Detail-Page.
 * Hover (Desktop) zeigt das Mockup mit fade-in als peek.
 * Klick führt zum nächsten Case in der Liste (cyclical).
 */
export default function NextCasePeek({ next }: { next: CaseStudy }) {
  return (
    <section
      aria-label={`Nächster Case ${next.num}`}
      className="relative w-screen overflow-hidden"
      style={{
        marginLeft: 'calc(-50vw + 50%)',
        background: 'var(--bg-base)',
        padding: 'clamp(80px, 10vw, 128px) 0',
        borderTop: '1px solid var(--border-subtle)',
      }}
    >
      <div className="mx-auto w-full max-w-[var(--container-wide)] px-6 md:px-12">
        <Link
          href={`/cases/${next.num}`}
          data-cursor="card"
          data-cursor-label="weiter"
          className="group block"
        >
          <motion.p
            className="font-mono uppercase"
            style={{
              fontSize: '11px',
              letterSpacing: '0.20em',
              color: 'var(--brand)',
              marginBottom: '24px',
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-15%' }}
            transition={{ duration: 0.5 }}
          >
            Nächster Case · {next.num}
          </motion.p>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-center md:gap-12">
            {/* Title + Meta */}
            <motion.div
              className="md:col-span-7"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-15%' }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <h2
                className="font-display font-bold transition-colors duration-300 group-hover:text-[color:var(--accent)]"
                style={{
                  fontSize: 'clamp(26px, 3.2vw, 42px)',
                  lineHeight: 1.1,
                  letterSpacing: 'var(--tr-heading)',
                  color: 'var(--fg-default)',
                  maxWidth: '620px',
                }}
              >
                {next.title}
              </h2>

              <div
                className="mt-8 flex flex-wrap items-baseline gap-x-6 gap-y-2"
              >
                <span
                  className="font-mono uppercase"
                  style={{
                    fontSize: '11px',
                    letterSpacing: '0.18em',
                    color: 'var(--fg-muted)',
                  }}
                >
                  {next.fieldLabel}
                </span>
                <span style={{ color: 'var(--fg-faint)' }}>·</span>
                <span
                  className="font-mono"
                  style={{ fontSize: '11px', color: 'var(--fg-muted)' }}
                >
                  {next.year} · {next.duration}
                </span>
              </div>

              <span
                className="mt-10 inline-flex items-center gap-3 font-mono uppercase transition-all duration-300 group-hover:translate-x-1"
                style={{
                  fontSize: '12px',
                  letterSpacing: '0.16em',
                  color: 'var(--brand)',
                }}
              >
                Case lesen
                <ArrowRight size={14} strokeWidth={1.6} />
              </span>
            </motion.div>

            {/* Mockup Visual */}
            <motion.div
              className="md:col-span-5"
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-15%' }}
              transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
            >
              <div
                className="relative overflow-hidden transition-transform duration-500 group-hover:scale-[1.02]"
                style={{
                  aspectRatio: '16 / 9',
                  borderRadius: 'var(--r-md)',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-elevated)',
                  boxShadow: 'var(--sh-2)',
                }}
              >
                <CaseMockup
                  field={next.field}
                  className="absolute inset-0 h-full w-full"
                />
              </div>

              {/* Metric Cluster small */}
              <div
                className="mt-6 flex items-baseline gap-4"
                style={{
                  paddingTop: '16px',
                  borderTop: '1px solid var(--border-subtle)',
                }}
              >
                <p
                  className="font-display font-bold"
                  style={{
                    fontSize: 'clamp(28px, 3.2vw, 40px)',
                    lineHeight: 1,
                    color: 'var(--accent)',
                  }}
                >
                  {next.metric}
                </p>
                <p
                  className="font-mono uppercase"
                  style={{
                    fontSize: '10px',
                    letterSpacing: '0.18em',
                    color: 'var(--fg-muted)',
                  }}
                >
                  {next.metricLabel}
                </p>
              </div>
            </motion.div>
          </div>
        </Link>
      </div>
    </section>
  )
}
