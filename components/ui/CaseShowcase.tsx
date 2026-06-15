'use client'

/**
 * CaseShowcase — großflächiges Device-Showcase für den Visual-Banner
 * auf /cases/[id]. Ersetzt das vorher kleine 7-Spalten-Mockup.
 *
 * - Maus-Parallax-Tilt (3D-Perspektive), spring-gedämpft
 * - mehrschichtiger Brand-Glow, der dem Cursor folgt
 * - Chrome-Leiste + field-spezifische Status-Chips (füllen den Raum, Leben)
 * - Reflexion unter dem Panel
 * - respektiert prefers-reduced-motion (dann statisch, leicht gekippt)
 */

import { useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'motion/react'
import CaseMockup from './CaseMockup'
import { CaseWidget, CASE_WIDGET_SLUGS } from './CaseWidgets'
import type { CaseStudy } from '@/lib/cases'

const EASE = [0.16, 1, 0.3, 1] as const

const FIELD_META: Record<
  CaseStudy['field'],
  { url: string; chipTop: string; chipBottom: string }
> = {
  marke:     { url: 'kunde-website.de', chipTop: '● Live',         chipBottom: 'Lighthouse 90+' },
  m365:      { url: 'admin.cloud',      chipTop: '● Tenant aktiv', chipBottom: '0 Downtime' },
  ai:        { url: 'copilot.studio',   chipTop: '● EU-Region',    chipBottom: 'DSGVO ✓' },
  strategie: { url: 'audit.console',    chipTop: '● Audit-ready',  chipBottom: 'Risk-Score' },
}

export default function CaseShowcase({ c }: { c: CaseStudy }) {
  const reduce = useReducedMotion()
  const meta = FIELD_META[c.field] ?? FIELD_META.marke
  const quote = c.outcome[0] ?? c.impact

  // Live-Domain aus clientUrl ableiten (z.B. „wolfswerk.net"), sonst Fallback.
  let domain = meta.url
  if (c.clientUrl) {
    try {
      domain = new URL(c.clientUrl).hostname.replace(/^www\./, '')
    } catch {
      domain = meta.url
    }
  }
  // Drei Darstellungs-Modi:
  //  'site'   → echter Website-Screenshot im Browser-Frame (Hero-Projekte)
  //  'thumb'  → redaktionelles Thumbnail, ohne Browser-Mockup (Marke-Cases)
  //  'mockup' → generisches SVG-Mockup (anonymisierte Cases ohne Bild)
  const mode: 'site' | 'thumb' | 'mockup' = c.siteShot
    ? 'site'
    : c.field === 'marke' && c.image
      ? 'thumb'
      : 'mockup'

  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)

  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 140, damping: 18 })
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), { stiffness: 140, damping: 18 })
  const glowX = useTransform(mx, [-0.5, 0.5], ['38%', '62%'])
  const glowY = useTransform(my, [-0.5, 0.5], ['30%', '60%'])
  const glowBg = useTransform(
    [glowX, glowY],
    ([x, y]: string[]) => `radial-gradient(46% 60% at ${x} ${y}, rgba(220, 128, 68, 0.28) 0%, transparent 70%)`,
  )

  function onMove(e: React.MouseEvent) {
    if (reduce) return
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  function onLeave() {
    mx.set(0)
    my.set(0)
  }

  return (
    <section
      className="relative w-screen overflow-hidden"
      style={{
        marginLeft: 'calc(-50vw + 50%)',
        background:
          'radial-gradient(60% 60% at 12% 0%, rgba(200, 98, 42, 0.16) 0%, transparent 60%),' +
          'radial-gradient(50% 70% at 92% 100%, rgba(146, 48, 30, 0.20) 0%, transparent 60%),' +
          'linear-gradient(180deg, #1C1B18 0%, #0F0E0C 100%)',
        borderTop: '1px solid var(--border-default)',
        borderBottom: '1px solid var(--border-default)',
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: 'var(--noise-svg)', mixBlendMode: 'overlay', opacity: 0.06 }}
      />

      <div className="relative z-[2] mx-auto w-full max-w-[var(--container-wide)] px-6 pt-10 pb-16 md:px-12 md:pt-14 md:pb-20">
        {/* Quote oben — prominenter Aufmacher */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15%' }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ maxWidth: 820 }}
        >
          <p className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: '0.18em', color: 'var(--brand)' }}>
            {c.fieldLabel}
          </p>
          <p
            className="mt-5 font-display"
            style={{
              fontSize: 'clamp(24px, 3vw, 40px)',
              lineHeight: 1.25,
              letterSpacing: 'var(--tr-heading)',
              color: 'var(--fg-default)',
              fontStyle: 'italic',
              fontFamily: 'var(--font-accent)',
              fontWeight: 400,
            }}
          >
            „{quote}"
          </p>
        </motion.div>

        {/* Showcase — großes, gekipptes Device-Mockup */}
        <motion.div
          ref={ref}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          className="relative mt-8"
          style={{ perspective: 1200 }}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.85, ease: EASE }}
        >
          {/* Ambient-Glow, folgt dem Cursor */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -inset-12"
            style={{
              background: glowBg,
              filter: 'blur(8px)',
              zIndex: 0,
            }}
          />

          {/* Panel */}
          <motion.div
            className="relative mx-auto"
            style={{
              maxWidth: 1080,
              rotateX: reduce ? 3 : rotX,
              rotateY: reduce ? -3 : rotY,
              transformStyle: 'preserve-3d',
              borderRadius: 'var(--r-lg)',
              border: '1px solid var(--border-strong)',
              background: 'var(--bg-base)',
              boxShadow: '0 40px 90px rgba(0, 0, 0, 0.6), 0 0 48px rgba(200, 98, 42, 0.14)',
              overflow: 'hidden',
            }}
          >
            {/* Chrome-Leiste — nur bei echtem Website-Screenshot */}
            {mode === 'site' && (
            <div
              className="flex items-center gap-2"
              style={{
                padding: '11px 16px',
                background: 'rgba(245, 245, 250, 0.04)',
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              {['#FF5F57', '#FEBC2E', '#28C840'].map(col => (
                <span key={col} style={{ width: 11, height: 11, borderRadius: 999, background: col, opacity: 0.8 }} />
              ))}
              {c.clientUrl ? (
                <a
                  href={c.clientUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="link"
                  className="ml-4 flex-1 inline-flex items-center justify-center gap-1.5 font-mono transition-colors duration-220 hover:text-[color:var(--brand)]"
                  style={{
                    fontSize: 12,
                    color: 'var(--fg-muted)',
                    background: 'var(--bg-base)',
                    padding: '5px 14px',
                    borderRadius: 6,
                    letterSpacing: '0.04em',
                    maxWidth: 360,
                    margin: '0 auto',
                  }}
                >
                  {domain}
                  <ArrowUpRight size={12} strokeWidth={1.8} />
                </a>
              ) : (
                <span
                  className="ml-4 flex-1 font-mono"
                  style={{
                    fontSize: 12,
                    color: 'var(--fg-subtle)',
                    background: 'var(--bg-base)',
                    padding: '5px 14px',
                    borderRadius: 6,
                    textAlign: 'center',
                    letterSpacing: '0.04em',
                    maxWidth: 360,
                    margin: '0 auto',
                  }}
                >
                  {domain}
                </span>
              )}
              <span style={{ flex: 1 }} />
            </div>
            )}

            {/* Visual je nach Modus:
                site/thumb → echtes Bild in natürlichem Seitenverhältnis (nie beschnitten),
                mockup     → generisches SVG-Mockup im 16:9-Rahmen. */}
            {mode === 'mockup' ? (
              CASE_WIDGET_SLUGS.has(c.num) ? (
                <div className="relative" style={{ background: 'var(--bg-base)' }}>
                  <CaseWidget slug={c.num} />
                </div>
              ) : (
                <div className="relative" style={{ aspectRatio: '16 / 9', background: 'var(--bg-base)' }}>
                  <CaseMockup field={c.field} className="absolute inset-0 h-full w-full" />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{ boxShadow: 'inset 0 0 80px rgba(0,0,0,0.4)' }}
                  />
                </div>
              )
            ) : (
              <div className="relative" style={{ background: 'var(--bg-base)', lineHeight: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={(mode === 'site' ? c.siteShot : c.image) as string}
                  alt={mode === 'site' ? `${c.title} — Website` : c.title}
                  style={{ display: 'block', width: '100%', height: 'auto' }}
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{ boxShadow: 'inset 0 0 80px rgba(0,0,0,0.4)' }}
                />
              </div>
            )}
          </motion.div>

          {/* Schwebende Status-Chips — nur beim echten Website-Screenshot */}
          {mode === 'site' && (
            <>
              {c.clientUrl ? (
                <Chip className="absolute -top-3 right-6 md:right-10" delay={0.3} accent href={c.clientUrl}>
                  Live ansehen <ArrowUpRight size={11} strokeWidth={1.8} />
                </Chip>
              ) : (
                <Chip className="absolute -top-3 right-6 md:right-10" delay={0.3}>{meta.chipTop}</Chip>
              )}
              <Chip className="absolute -bottom-3 left-6 md:left-10" delay={0.45} accent>{meta.chipBottom}</Chip>
            </>
          )}

          {/* Reflexion */}
          <div
            aria-hidden
            className="pointer-events-none mx-auto"
            style={{
              maxWidth: 1080,
              height: 90,
              marginTop: 6,
              background: 'linear-gradient(180deg, rgba(220,128,68,0.08), transparent 80%)',
              filter: 'blur(6px)',
              opacity: 0.7,
              transform: 'scaleY(-1)',
              maskImage: 'linear-gradient(180deg, rgba(0,0,0,0.5), transparent)',
            }}
          />
        </motion.div>
      </div>
    </section>
  )
}

function Chip({
  children,
  className,
  delay = 0,
  accent = false,
  href,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  accent?: boolean
  href?: string
}) {
  const Tag = href ? motion.a : motion.span
  return (
    <Tag
      {...(href ? { href, target: '_blank', rel: 'noopener noreferrer', 'data-cursor': 'link' } : {})}
      className={`font-mono uppercase inline-flex items-center gap-1.5 ${href ? 'transition-colors duration-220 hover:text-[color:var(--fg-default)]' : ''} ${className ?? ''}`}
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.5, delay, ease: EASE }}
      style={{
        zIndex: 5,
        fontSize: 10,
        letterSpacing: '0.16em',
        color: accent ? 'var(--brand)' : 'var(--fg-default)',
        padding: '7px 13px',
        background: 'rgba(15, 14, 12, 0.82)',
        border: `1px solid ${accent ? 'rgba(220,128,68,0.4)' : 'var(--border-strong)'}`,
        borderRadius: 'var(--r-pill)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
      }}
    >
      {children}
    </Tag>
  )
}
