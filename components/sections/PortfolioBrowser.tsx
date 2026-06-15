'use client'

/**
 * Portfolio-Browser — flache Übersicht über alle Cases.
 *
 * Keine Kategorie-Filter mehr. Zwei flache Listen:
 *
 *   1. "Highlights"        → alle featured-Cases im großen HighlightCard-Grid.
 *   2. "Weitere Projekte"  → alle übrigen Cases als StandardStrip-Liste.
 *
 * Eine Volltext-Suche filtert beide Listen. Pro Liste ein eigener
 * „Mehr anzeigen"-Expand. Leere Listen werden nicht gerendert.
 */

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'motion/react'
import { ArrowUpRight, ChevronDown, Search, X } from 'lucide-react'
import ItalicAccent from '@/components/ui/ItalicAccent'
import { trackEvent } from '@/lib/analytics'
import { CASES, type CaseStudy } from '@/lib/cases'

const EASE = [0.16, 1, 0.3, 1] as const

/* ── Browser ────────────────────────────────────────────────────────── */

/** Default-Limit pro Liste (Highlights und Weitere), bevor „Mehr anzeigen" eingeblendet wird. */
const LIMIT = 6

export default function PortfolioBrowser() {
  const [searchQuery,    setSearchQuery]    = useState('')
  const [expandedH,      setExpandedH]      = useState(false)
  const [expandedW,      setExpandedW]      = useState(false)

  const { highlights, weitere } = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    const matchesSearch = (c: CaseStudy): boolean => {
      if (!q) return true
      const haystack = [
        c.title, c.sector, c.brief, c.fieldLabel,
        c.metricLabel, c.impact,
        ...(c.tech ?? []),
        ...(c.context ?? []),
      ]
        .filter(Boolean)
        .join(' · ')
        .toLowerCase()
      return haystack.includes(q)
    }
    const matched = CASES.filter(matchesSearch)
    return {
      highlights: matched.filter(c => c.featured),
      weitere:    matched.filter(c => !c.featured),
    }
  }, [searchQuery])

  const totalCases      = CASES.length
  const totalHighlights = CASES.filter(c => c.featured).length

  const highlightsShown = expandedH ? highlights : highlights.slice(0, LIMIT)
  const weitereShown    = expandedW ? weitere    : weitere.slice(0, LIMIT)
  const highlightsRest  = Math.max(0, highlights.length - LIMIT)
  const weitereRest     = Math.max(0, weitere.length - LIMIT)

  const noResults = highlights.length === 0 && weitere.length === 0

  return (
    <section
      id="portfolio-list"
      aria-label="Portfolio-Browser"
      className="relative"
      style={{
        background: 'var(--bg-base)',
        scrollMarginTop: 'clamp(72px, 9vh, 112px)',
      }}
    >
      {/* Stats-Strip */}
      <div
        className="mx-auto w-full max-w-[var(--container-wide)] px-6 md:px-12"
        style={{ paddingTop: 'clamp(48px, 6vw, 80px)' }}
      >
        <ul
          className="grid grid-cols-3 gap-x-6 gap-y-8"
          style={{ listStyle: 'none', padding: 0, margin: 0 }}
        >
          {[
            { metric: String(totalCases),      label: 'Cases · Mai 2026'   },
            { metric: String(totalHighlights), label: 'Highlights'         },
            { metric: '11',                    label: 'Branchen vertreten' },
          ].map(s => (
            <li key={s.label}>
              <p
                className="font-display font-black"
                style={{
                  fontSize: 'clamp(36px, 4.2vw, 60px)',
                  lineHeight: 1,
                  color: 'var(--accent)',
                  letterSpacing: 'var(--tr-display)',
                }}
              >
                {s.metric}
              </p>
              <p
                className="mt-3 font-mono uppercase"
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.18em',
                  color: 'var(--fg-muted)',
                }}
              >
                {s.label}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Sticky Such-Bar */}
      <div
        className="sticky z-[10] mx-auto w-full"
        style={{
          top: 'clamp(72px, 9vh, 112px)',
          marginTop: 'clamp(56px, 7vw, 88px)',
          marginBottom: 'clamp(40px, 5vw, 64px)',
        }}
      >
        <div className="mx-auto w-full max-w-[var(--container-wide)] px-6 md:px-12">
          <div
            className="flex flex-col gap-3"
            style={{
              padding: '12px 14px',
              background: 'rgba(15, 14, 12, 0.78)',
              backdropFilter: 'blur(14px) saturate(140%)',
              WebkitBackdropFilter: 'blur(14px) saturate(140%)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--r-md)',
              boxShadow: '0 20px 48px -20px rgba(0, 0, 0, 0.55)',
            }}
          >
            {/* Suche — full-width */}
            <div
              className="relative flex w-full items-center"
              style={{
                background: 'var(--bg-overlay)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--r-pill)',
                padding: '7px 12px 7px 34px',
                minWidth: 0,
              }}
            >
              <Search
                size={13}
                strokeWidth={1.6}
                style={{
                  position: 'absolute',
                  left: 13,
                  color: searchQuery ? 'var(--brand)' : 'var(--fg-subtle)',
                }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cases durchsuchen …"
                aria-label="Cases durchsuchen"
                className="font-mono w-full bg-transparent outline-none placeholder:opacity-50"
                style={{
                  fontSize: 12,
                  letterSpacing: '0.04em',
                  color: 'var(--fg-default)',
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Suche zurücksetzen"
                  className="ml-1 shrink-0 transition-colors duration-220 hover:text-[color:var(--brand)]"
                  style={{ color: 'var(--fg-subtle)' }}
                >
                  <X size={12} strokeWidth={1.8} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto w-full max-w-[var(--container-wide)] px-6 md:px-12">
        {noResults ? (
          /* Empty State — keine Treffer */
          <div
            className="mx-auto py-20 text-center md:py-32"
            style={{ maxWidth: 520 }}
          >
            <p
              className="font-mono uppercase"
              style={{
                fontSize: 11,
                letterSpacing: '0.20em',
                color: 'var(--brand)',
                marginBottom: 14,
              }}
            >
              Keine Treffer
            </p>
            <p
              className="font-display"
              style={{
                fontSize: 'clamp(20px, 2vw, 26px)',
                lineHeight: 1.35,
                color: 'var(--fg-default)',
                marginBottom: 14,
              }}
            >
              {searchQuery
                ? <>Nichts gefunden zu „<ItalicAccent>{searchQuery}</ItalicAccent>".</>
                : 'Keine Cases vorhanden.'}
            </p>
            <p
              className="font-body"
              style={{
                fontSize: 14,
                lineHeight: 1.5,
                color: 'var(--fg-muted)',
                marginBottom: 20,
              }}
            >
              Versuch&apos;s mit einem anderen Begriff.
            </p>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              data-cursor="link"
              className="font-mono uppercase transition-colors duration-220 hover:text-[color:var(--brand)]"
              style={{
                fontSize: 11,
                letterSpacing: '0.16em',
                color: 'var(--fg-muted)',
                padding: '8px 16px',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--r-pill)',
              }}
            >
              Suche zurücksetzen
            </button>
          </div>
        ) : (
          <div className="flex flex-col" style={{ gap: 'clamp(80px, 10vw, 128px)' }}>
            {/* Highlights */}
            {highlights.length > 0 && (
              <section aria-label="Highlights" style={{ scrollMarginTop: '120px' }}>
                <SectionHeader
                  num="01"
                  eyebrow={`Highlights · ${highlights.length}`}
                  headline={<>Die Cases, die <ItalicAccent>tiefer</ItalicAccent> gehen.</>}
                />
                <ul
                  className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
                  style={{ listStyle: 'none', padding: 0, margin: 0 }}
                >
                  {highlightsShown.map(c => (
                    <li key={c.num}>
                      <HighlightCard c={c} />
                    </li>
                  ))}
                </ul>
                {highlightsRest > 0 && (
                  <ExpandButton
                    expanded={expandedH}
                    rest={highlightsRest}
                    onClick={() => setExpandedH(v => !v)}
                  />
                )}
              </section>
            )}

            {/* Weitere Projekte */}
            {weitere.length > 0 && (
              <section aria-label="Weitere Projekte" style={{ scrollMarginTop: '120px' }}>
                <SectionHeader
                  num={highlights.length > 0 ? '02' : '01'}
                  eyebrow={`Weitere Projekte · ${weitere.length}`}
                  headline={<>Mehr aus der <ItalicAccent>Praxis</ItalicAccent>.</>}
                />
                <ul
                  className="flex flex-col gap-2"
                  style={{ listStyle: 'none', padding: 0, margin: 0 }}
                >
                  {weitereShown.map(c => (
                    <li key={c.num}>
                      <StandardStrip c={c} />
                    </li>
                  ))}
                </ul>
                {weitereRest > 0 && (
                  <ExpandButton
                    expanded={expandedW}
                    rest={weitereRest}
                    onClick={() => setExpandedW(v => !v)}
                  />
                )}
              </section>
            )}
          </div>
        )}
      </div>

      {/* Bottom-Spacer */}
      <div style={{ height: 'clamp(80px, 10vw, 128px)' }} />
    </section>
  )
}

/* ── Section-Header ─────────────────────────────────────────────────── */

function SectionHeader({
  num,
  eyebrow,
  headline,
}: {
  num:      string
  eyebrow:  string
  headline: React.ReactNode
}) {
  return (
    <div className="mb-12 md:mb-16" style={{ maxWidth: '760px' }}>
      <p
        className="font-mono uppercase"
        style={{
          fontSize: '11px',
          letterSpacing: '0.20em',
          color: 'var(--brand)',
          marginBottom: '20px',
        }}
      >
        {num} · {eyebrow}
      </p>
      <h2
        className="font-display font-bold"
        style={{
          fontSize: 'clamp(32px, 4.2vw, 56px)',
          lineHeight: 1.05,
          letterSpacing: 'var(--tr-display)',
          color: 'var(--fg-default)',
        }}
      >
        {headline}
      </h2>
    </div>
  )
}

/* ── HighlightCard (medium) ─────────────────────────────────────────── */

function HighlightCard({ c }: { c: CaseStudy }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.32, ease: EASE }}
      className="h-full"
    >
      <Link
        href={`/cases/${c.num}`}
        data-cursor="card"
        data-cursor-label="lesen"
        onClick={() => trackEvent('case_open_portfolio', { num: c.num, service: c.serviceSlug, variant: 'highlight' })}
        className="portfolio-card glass-card group relative block h-full overflow-hidden"
        style={{ padding: '20px 22px 24px' }}
      >
        {/* Accent-Line oben — wächst on hover */}
        <span
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 h-px"
          style={{
            width: '100%',
            background:
              'linear-gradient(90deg, transparent 0%, var(--accent) 50%, transparent 100%)',
            transform: 'scaleX(0)',
            transformOrigin: 'left center',
            transition: 'transform 480ms cubic-bezier(0.16, 1, 0.3, 1)',
            zIndex: 5,
          }}
        />
        {/* Hover-Glow */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              'radial-gradient(70% 60% at 50% 0%, rgba(220, 128, 68, 0.14) 0%, transparent 65%)',
          }}
        />
        <div className="relative z-[3] flex h-full flex-col">
        {/* Image */}
        {c.image && (
          <div
            className="relative mb-5 overflow-hidden"
            style={{
              aspectRatio: '16 / 10',
              borderRadius: 'var(--r-sm)',
              background:
                'radial-gradient(70% 100% at 50% 100%, rgba(220, 128, 68, 0.10) 0%, rgba(15, 14, 12, 0.5) 80%)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <Image
              src={c.image}
              alt={c.title}
              fill
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
              className="object-cover transition-transform duration-[700ms] ease-out group-hover:scale-[1.08]"
            />
            {/* Image-Vignette bei Hover */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background:
                  'linear-gradient(0deg, rgba(15, 14, 12, 0.55) 0%, transparent 50%)',
              }}
            />
          </div>
        )}

        {/* Eyebrow */}
        <p
          className="font-mono uppercase"
          style={{
            fontSize: '10px',
            letterSpacing: '0.18em',
            color: 'var(--brand)',
          }}
        >
          {c.fieldLabel}
        </p>

        {/* Title */}
        <h3
          className="mt-2 font-display font-semibold transition-colors duration-220 group-hover:text-[color:var(--brand)]"
          style={{
            fontSize: 'clamp(17px, 1.8vw, 20px)',
            lineHeight: 1.25,
            letterSpacing: 'var(--tr-heading)',
            color: 'var(--fg-default)',
          }}
        >
          {c.title}
        </h3>

        {/* Sector */}
        <p
          className="mt-2 font-body"
          style={{
            fontSize: '12px',
            lineHeight: 1.5,
            color: 'var(--fg-muted)',
          }}
        >
          {c.sector}
        </p>

        {/* Impact — die Kennzahl in einem Satz erklärt. Macht aus „2"
            oder „0 → 1" plötzlich eine verständliche Aussage. */}
        {c.impact && (
          <p
            className="mt-3 font-body"
            style={{
              fontSize: '13.5px',
              lineHeight: 1.55,
              color: 'var(--fg-default)',
              opacity: 0.86,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {c.impact}
          </p>
        )}

        {/* Metric */}
        <div
          className="mt-auto flex items-end justify-between gap-3 pt-5"
          style={{
            marginTop: 'auto',
            paddingTop: '20px',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <div>
            <p
              className="font-display font-black"
              style={{
                fontSize: 'clamp(24px, 2.6vw, 32px)',
                lineHeight: 1,
                color: 'var(--accent)',
                letterSpacing: 'var(--tr-display)',
              }}
            >
              {c.metric}
            </p>
            <p
              className="mt-1.5 font-mono uppercase"
              style={{
                fontSize: '9px',
                letterSpacing: '0.16em',
                color: 'var(--fg-muted)',
              }}
            >
              {c.metricLabel}
            </p>
          </div>

          <ArrowUpRight
            size={16}
            strokeWidth={1.6}
            className="opacity-40 transition-all duration-300 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            style={{ color: 'var(--accent)' }}
          />
        </div>
      </div>
      </Link>
    </motion.div>
  )
}

/* ── StandardStrip — kompakte Zeile mit Thumbnail ───────────────────── */

function StandardStrip({ c }: { c: CaseStudy }) {
  return (
    <Link
      href={`/cases/${c.num}`}
      data-cursor="card"
      data-cursor-label="öffnen"
      onClick={() => trackEvent('case_open_portfolio', { num: c.num, service: c.serviceSlug, variant: 'strip' })}
      className="glass-card group block"
      style={{ padding: '14px 16px' }}
    >
      <div className="relative z-[3] grid grid-cols-[112px_1fr_auto] items-center gap-4 md:grid-cols-[160px_1fr_auto_auto] md:gap-6">
        {/* Thumbnail — 16:10 wie HighlightCard, klein gehalten */}
        <div
          className="relative shrink-0 overflow-hidden"
          style={{
            aspectRatio: '16 / 10',
            borderRadius: 'var(--r-sm)',
            border: '1px solid var(--border-subtle)',
            background:
              'radial-gradient(70% 100% at 50% 100%, rgba(220, 128, 68, 0.08) 0%, rgba(15, 14, 12, 0.5) 80%)',
          }}
        >
          {c.image && (
            <Image
              src={c.image}
              alt={c.title}
              fill
              sizes="(min-width: 768px) 160px, 112px"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          )}
        </div>

        {/* Title + Sector + Impact */}
        <div className="min-w-0">
          <p
            className="font-display font-medium transition-colors duration-220 group-hover:text-[color:var(--brand)]"
            style={{
              fontSize: '15px',
              lineHeight: 1.3,
              color: 'var(--fg-default)',
              letterSpacing: '-0.005em',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {c.title}
          </p>
          <p
            className="mt-1 truncate font-mono"
            style={{
              fontSize: '11px',
              color: 'var(--fg-muted)',
              letterSpacing: '0.02em',
            }}
          >
            {c.sector}
          </p>
          {c.impact && (
            <p
              className="mt-2 font-body"
              style={{
                fontSize: '12.5px',
                lineHeight: 1.5,
                color: 'var(--fg-default)',
                opacity: 0.78,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {c.impact}
            </p>
          )}
        </div>

        {/* Metric (Desktop) */}
        <div className="hidden text-right md:block">
          <p
            className="font-display font-bold"
            style={{
              fontSize: '20px',
              lineHeight: 1,
              color: 'var(--accent)',
              letterSpacing: 'var(--tr-display)',
            }}
          >
            {c.metric}
          </p>
          <p
            className="mt-1 font-mono uppercase"
            style={{
              fontSize: '9px',
              letterSpacing: '0.16em',
              color: 'var(--fg-muted)',
              whiteSpace: 'nowrap',
            }}
          >
            {c.metricLabel}
          </p>
        </div>

        {/* Pfeil */}
        <ArrowUpRight
          size={16}
          strokeWidth={1.6}
          className="shrink-0 opacity-40 transition-all duration-300 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          style={{ color: 'var(--accent)' }}
        />
      </div>
    </Link>
  )
}

/* ── Expand-Button („Mehr anzeigen / Weniger") ──────────────────────── */

function ExpandButton({
  expanded,
  rest,
  onClick,
}: {
  expanded: boolean
  rest:     number
  onClick:  () => void
}) {
  return (
    <div className="mt-6 flex justify-center md:mt-8">
      <button
        type="button"
        onClick={onClick}
        data-cursor="link"
        className="inline-flex items-center gap-2 transition-all duration-220"
        style={{
          fontSize: '12px',
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          padding: '11px 22px',
          borderRadius: 'var(--r-pill)',
          background: 'var(--bg-overlay)',
          border: '1px solid var(--border-subtle)',
          color: 'var(--fg-default)',
        }}
      >
        <ChevronDown
          size={13}
          strokeWidth={1.6}
          style={{
            transform: expanded ? 'rotate(180deg)' : 'none',
            transition: 'transform 220ms',
            color: 'var(--brand)',
          }}
        />
        {expanded ? 'Weniger zeigen' : `Mehr anzeigen · ${rest} weitere`}
      </button>
    </div>
  )
}
