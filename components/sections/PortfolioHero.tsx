'use client'

import { motion, useReducedMotion } from 'motion/react'
import Link from 'next/link'
import { ArrowDown } from 'lucide-react'
import ItalicAccent from '@/components/ui/ItalicAccent'
import {
  groupEngagementsByState,
  getCapacity,
  getDoneDisplayCount,
  STATE_COLUMN_LABEL,
  STATE_COLOR_VAR,
  STATE_LABEL,
  type Engagement,
  type EngagementState,
} from '@/lib/engagements'

const EASE = [0.16, 1, 0.3, 1] as const

/**
 * Smooth-Scroll zur Portfolio-Liste. Eigener Handler statt nativem Hash-Jump,
 * damit der Scroll auch mit aktivem Lenis sauber animiert (Lenis synct sich
 * auf das native Scroll-Event). Fällt bei prefers-reduced-motion auf 'auto'.
 */
function scrollToPortfolioList(e: React.MouseEvent) {
  const target = document.getElementById('portfolio-list')
  if (!target) return
  e.preventDefault()
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  history.replaceState(null, '', '#portfolio-list')
}

/**
 * Spalten-Reihenfolge im Kanban (Lotsenprinzip-Bogen): Lagebild → In Arbeit
 * → Übergabe → Abgeschlossen.
 */
const COLUMN_ORDER: EngagementState[] = ['scoping', 'active', 'wrapping', 'done']

/**
 * Portfolio-Hero: Full-Bleed-Split. Links Editorial-Block mit Headline,
 * rechts ein Operations-Dashboard, das Stefans Engagements im Lotsen-
 * prinzip-Bogen visualisiert. Card-Style identisch zur „Laufende
 * Projekte"-Kachel im Mainpage-Hero (Project + Client + Status-Dot).
 */
export default function PortfolioHero() {
  const reduceMotion = useReducedMotion()

  return (
    <section
      aria-label="Portfolio-Hero"
      className="relative w-screen overflow-hidden"
      style={{
        marginLeft: 'calc(-50vw + 50%)',
        minHeight: '85vh',
        background: 'var(--bg-base)',
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 80% at 80% 90%, rgba(220, 128, 68, 0.08) 0%, transparent 70%)',
          zIndex: 1,
        }}
      />

      {/* Linke Hälfte: Editorial-Block */}
      <div
        className="relative z-[3] flex flex-col justify-center px-6 pb-12 pt-32 md:px-12 md:pt-36 lg:absolute lg:left-0 lg:top-0 lg:h-full lg:w-[50vw] lg:py-0 lg:pl-20 lg:pr-8 lg:pt-0 xl:pl-40 xl:pr-12"
      >
        <motion.p
          className="font-mono uppercase"
          style={{
            fontSize: '11px',
            letterSpacing: '0.18em',
            color: 'var(--brand)',
            marginBottom: '32px',
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          01 · Engagements
        </motion.p>

        <h1
          className="font-display font-bold"
          style={{
            fontSize: 'clamp(36px, 4.6vw, 64px)',
            lineHeight: 1.1,
            letterSpacing: 'var(--tr-display)',
            color: 'var(--fg-default)',
            maxWidth: '580px',
          }}
        >
          <span
            className="reveal-line block"
            style={{ ['--reveal-delay' as string]: '250ms' }}
          >
            Was zwischen <ItalicAccent>Lagebild</ItalicAccent>
          </span>
          <span
            className="reveal-line block"
            style={{ ['--reveal-delay' as string]: '420ms' }}
          >
            und <ItalicAccent>Übergabe</ItalicAccent> passiert.
          </span>
        </h1>

        <motion.p
          className="mt-8 font-body"
          style={{
            fontSize: '18px',
            lineHeight: 1.6,
            color: 'var(--fg-default)',
            opacity: 0.9,
            maxWidth: '480px',
          }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
        >
          Engagements, die in produktiven Strukturen enden, nicht in Folien.
        </motion.p>

        <motion.div
          className="mt-12 lg:mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <Link
            href="#portfolio-list"
            onClick={scrollToPortfolioList}
            data-cursor="magnetic"
            className="inline-flex items-center gap-3 font-mono uppercase transition-colors duration-220 hover:text-[color:var(--brand)]"
            style={{
              fontSize: '12px',
              letterSpacing: '0.16em',
              color: 'var(--fg-muted)',
            }}
          >
            <ArrowDown size={12} strokeWidth={1.6} />
            Alle Engagements ansehen
          </Link>
        </motion.div>
      </div>

      {/* Rechte Hälfte: Kanban-Dashboard */}
      <div
        className="relative z-[2] flex items-center justify-center px-6 pb-16 pt-4 md:px-12 lg:absolute lg:right-0 lg:top-0 lg:h-full lg:w-[50vw] lg:py-16 lg:pl-8 lg:pr-20 xl:pl-12 xl:pr-40"
      >
        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
        >
          <KanbanBoard reduceMotion={!!reduceMotion} />
        </motion.div>
      </div>

      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px"
        style={{ background: 'rgba(220, 128, 68, 0.10)' }}
      />
    </section>
  )
}

function KanbanBoard({ reduceMotion }: { reduceMotion: boolean }) {
  const grouped  = groupEngagementsByState()
  const capacity = getCapacity()
  const doneLbl  = getDoneDisplayCount()

  return (
    <div
      className="relative mx-auto w-full max-w-[760px]"
      style={{
        background: 'rgba(15, 14, 12, 0.6)',
        border: '1px solid rgba(220, 128, 68, 0.15)',
        borderRadius: '10px',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        boxShadow:
          'inset 0 1px 0 rgba(242, 240, 235, 0.06), 0 24px 60px -20px rgba(0, 0, 0, 0.55)',
      }}
    >
      {/* Dashboard-Header */}
      <div
        className="flex items-center justify-between"
        style={{
          height: '40px',
          padding: '0 16px',
          borderBottom: '1px solid rgba(220, 128, 68, 0.10)',
        }}
      >
        <div className="flex items-center gap-2.5">
          <PulseBullet reduceMotion={reduceMotion} size={6} color="var(--accent)" />
          <span
            className="font-mono uppercase"
            style={{
              fontSize: '10px',
              letterSpacing: '0.16em',
              color: 'var(--fg-muted)',
            }}
          >
            Engagement Board · Q2 2026
          </span>
        </div>
        <span
          className="font-mono uppercase"
          style={{
            fontSize: '10px',
            letterSpacing: '0.16em',
            color: 'var(--brand)',
          }}
        >
          {capacity.label}
        </span>
      </div>

      {/* Mobile: 2-Spalten-Grid (4 Spalten brechen in 2 Reihen um) — kein
          Horizontal-Scroll mehr, nichts läuft aus dem Viewport.
          Desktop: 4-col Grid das innerhalb des Containers schrumpft. */}
      <div className="overflow-x-clip">
        <div
          className="grid gap-[14px] p-4 [grid-template-columns:repeat(2,minmax(0,1fr))] md:p-5 md:[grid-template-columns:repeat(4,minmax(0,1fr))]"
        >
          {COLUMN_ORDER.map(state => {
            const cards = grouped[state]
            const count =
              state === 'done' ? doneLbl : String(cards.length)
            return (
              <KanbanColumn
                key={state}
                state={state}
                label={STATE_COLUMN_LABEL[state]}
                count={count}
                cards={cards}
                showMore={state === 'done'}
                reduceMotion={reduceMotion}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

function KanbanColumn({
  state,
  label,
  count,
  cards,
  showMore,
  reduceMotion,
}: {
  state:        EngagementState
  label:        string
  count:        string
  cards:        Engagement[]
  showMore:     boolean
  reduceMotion: boolean
}) {
  // Lagebild + Übergabe sind die Stefan-Touchpoints im Lotsen-Bogen
  // (Eingang + Übergabe). Werden italic in Instrument Serif + Accent-Orange
  // gerendert, damit die Mitte (In Arbeit/Abgeschlossen) als „regulärer
  // Workflow" sichtbar bleibt.
  const isStefanTouchpoint = state === 'scoping' || state === 'wrapping'

  return (
    <div
      className="flex flex-col"
      style={{ scrollSnapAlign: 'start', minWidth: 0 }}
    >
      <div
        className="flex items-baseline justify-between"
        style={{
          paddingBottom: '10px',
          marginBottom: '10px',
          borderBottom: '1px solid rgba(220, 128, 68, 0.12)',
        }}
      >
        {isStefanTouchpoint ? (
          <span
            style={{
              fontFamily: '"Instrument Serif", Georgia, serif',
              fontStyle: 'italic',
              fontSize: '15px',
              lineHeight: 1,
              letterSpacing: '-0.005em',
              color: 'var(--accent)',
            }}
          >
            {label}
          </span>
        ) : (
          <span
            className="font-mono uppercase"
            style={{
              fontSize: '10px',
              letterSpacing: '0.16em',
              color: 'var(--brand)',
            }}
          >
            {label}
          </span>
        )}
        <span
          className="font-mono"
          style={{
            fontSize: '10px',
            color: 'var(--fg-subtle)',
            letterSpacing: '0.04em',
          }}
        >
          {count}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {cards.slice(0, 3).map((c, i) => (
          <KanbanCard key={`${c.project}-${i}`} c={c} reduceMotion={reduceMotion} />
        ))}

        {showMore && <MoreLink reduceMotion={reduceMotion} />}
      </div>
    </div>
  )
}

function KanbanCard({
  c,
  reduceMotion,
}: {
  c: Engagement
  reduceMotion: boolean
}) {
  const dotColor    = c.highlight ? 'var(--accent)' : STATE_COLOR_VAR[c.state]
  const statusLabel = c.detail
    ? c.detail
    : c.highlight
    ? 'aktiv'
    : STATE_LABEL[c.state]
  const dotGlow     = c.highlight
    ? 'rgba(220, 128, 68, 0.6)'
    : c.state === 'done'
      ? 'transparent'
      : `${dotColor}`

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        padding: '10px 12px',
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(220, 128, 68, 0.08)',
        borderRadius: '6px',
      }}
    >
      <p
        className="font-display font-semibold leading-tight"
        style={{
          fontSize: '13px',
          letterSpacing: '-0.005em',
          color: 'var(--fg-default)',
          lineHeight: 1.25,
        }}
      >
        {c.project}
      </p>

      <p
        className="font-mono uppercase"
        style={{
          fontSize: '9px',
          letterSpacing: '0.14em',
          color: 'var(--fg-subtle)',
          lineHeight: 1.3,
        }}
      >
        {c.client}
      </p>

      <div className="flex items-center gap-1.5" style={{ marginTop: '2px' }}>
        {c.highlight && !reduceMotion ? (
          <PulseBullet reduceMotion={false} size={5} color="var(--accent)" />
        ) : (
          <span
            aria-hidden
            style={{
              width: '5px',
              height: '5px',
              borderRadius: '999px',
              background: dotColor,
              boxShadow:
                c.state === 'done'
                  ? 'none'
                  : `0 0 6px ${dotGlow}`,
              display: 'inline-block',
            }}
          />
        )}
        <span
          className="font-mono uppercase"
          style={{
            fontSize: '9px',
            letterSpacing: '0.14em',
            color: 'var(--fg-muted)',
          }}
        >
          {statusLabel}
        </span>
      </div>
    </div>
  )
}

function PulseBullet({
  reduceMotion,
  size = 6,
  color = 'var(--accent)',
}: {
  reduceMotion: boolean
  size?: number
  color?: string
}) {
  if (reduceMotion) {
    return (
      <span
        aria-hidden
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '999px',
          background: color,
          boxShadow: '0 0 6px rgba(220, 128, 68, 0.5)',
          display: 'inline-block',
        }}
      />
    )
  }
  return (
    <motion.span
      aria-hidden
      className="inline-block"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '999px',
        background: color,
        boxShadow: '0 0 8px rgba(220, 128, 68, 0.6)',
      }}
      animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

function MoreLink({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <Link
      href="#portfolio-list"
      onClick={scrollToPortfolioList}
      data-cursor="magnetic"
      className="mt-1 flex flex-col items-center gap-1.5 transition-colors duration-220 hover:text-[color:var(--brand)]"
      style={{
        paddingTop: '10px',
        borderTop: '1px dashed rgba(220, 128, 68, 0.15)',
        color: 'var(--fg-muted)',
      }}
    >
      {reduceMotion ? (
        <ArrowDown size={12} strokeWidth={1.6} />
      ) : (
        <motion.span
          animate={{ y: [0, 3, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.4 }}
          className="block"
        >
          <ArrowDown size={12} strokeWidth={1.6} />
        </motion.span>
      )}
      <span
        className="font-mono uppercase"
        style={{
          fontSize: '9px',
          letterSpacing: '0.16em',
        }}
      >
        + weitere
      </span>
    </Link>
  )
}
