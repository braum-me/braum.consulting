'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowDown,
  ArrowUpRight,
  Brain,
  Clock,
  Compass,
  Globe,
  Server,
  type LucideIcon,
} from 'lucide-react'
import type { Post } from '@/lib/posts'

const EASE         = [0.16, 1, 0.3, 1] as const
const TRACK_EASE   = [0.4, 0.0, 0.2, 1] as const

const COGNAC       = '#A87553'
const COGNAC_LINE  = 'rgba(168, 117, 83, 0.30)'

const CYCLE_MS = 6000

const MONTHS_DE = [
  'JANUAR', 'FEBRUAR', 'MÄRZ', 'APRIL', 'MAI', 'JUNI',
  'JULI',  'AUGUST',  'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DEZEMBER',
] as const

function formatDateDE(iso: string): string {
  const d = new Date(iso + 'T00:00:00')
  return `${d.getDate()}. ${MONTHS_DE[d.getMonth()]} ${d.getFullYear()}`
}

/** Tag → Service-Säule. Erste passende Treffer-Regel gewinnt. */
function serviceForPost(post: Post): { icon: LucideIcon; label: string } {
  const tags = post.tags.map(t => t.toLowerCase())
  const matches = (...needles: string[]) =>
    tags.some(t => needles.some(n => t.includes(n)))

  if (matches('ai', 'llm', 'copilot', 'automat', 'prompt')) {
    return { icon: Brain,   label: 'KI & Automation' }
  }
  if (matches('m365', 'sharepoint', 'entra', 'azure', 'cloud', 'server', 'workspace')) {
    return { icon: Server,  label: 'M365 & Cloud' }
  }
  if (matches('marke', 'seo', 'geo', 'llmo', 'sichtbar', 'website', 'positionier')) {
    return { icon: Globe,   label: 'Marke & Reichweite' }
  }
  return { icon: Compass, label: 'Strategie' }
}

interface BlogHeroProps {
  posts:         Post[]
  externalOgMap?: Record<string, string | null>
}

/**
 * /blog-Hero: Editorial-Split.
 *   Links — Headline + Lede.
 *   Rechts — kompaktes Versand-Widget: horizontale Route A → B mit
 *   bewegendem Dot, darunter eine schmale Letter-Card mit Post-Details,
 *   crossfadet im Cycle alle 6s.
 */
export default function BlogHero({ posts, externalOgMap = {} }: BlogHeroProps) {
  const items = posts.slice(0, 3)
  const reduceMotion = useReducedMotion()
  const [currentIdx, setCurrentIdx] = useState(0)
  const [paused, setPaused] = useState(false)
  const [progress, setProgress] = useState(0) // 0..1 innerhalb eines Cycles

  // Cycle-Timer + Progress-Tick. Wir nutzen einen einzigen Interval mit
  // 100ms-Tick, um beide Aufgaben (Progress + Advance) zu erledigen.
  useEffect(() => {
    if (reduceMotion || items.length <= 1) return
    if (paused) return

    const startedAt = Date.now() - progress * CYCLE_MS
    const id = setInterval(() => {
      const elapsed = Date.now() - startedAt
      const p = elapsed / CYCLE_MS
      if (p >= 1) {
        setProgress(0)
        setCurrentIdx(i => (i + 1) % items.length)
      } else {
        setProgress(p)
      }
    }, 100)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, reduceMotion, items.length, currentIdx])

  // Beim manuellen Wechsel: Progress reset
  const goTo = (i: number) => {
    setCurrentIdx(i)
    setProgress(0)
  }

  return (
    <section
      aria-label="Blog-Hero"
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
            'radial-gradient(60% 80% at 80% 80%, rgba(220, 128, 68, 0.06) 0%, transparent 70%)',
          zIndex: 1,
        }}
      />

      {/* Linke Hälfte: Editorial-Block — auf Desktop vertikal zentriert,
         damit die Headline auf gleicher Höhe wie das SVG-Visual rechts sitzt
         (beide Spalten zentrieren in lg:h-full). Mobile bleibt bottom-aligned. */}
      <div
        className="relative z-[3] flex flex-col justify-end px-6 pb-8 pt-32 md:px-12 md:pt-36 md:pb-10 lg:absolute lg:left-0 lg:top-0 lg:h-full lg:w-[50vw] lg:justify-center lg:py-24 lg:pl-20 lg:pr-8 xl:pl-40 xl:pr-12"
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
          01 · Notizen
        </motion.p>

        <h1
          className="font-display font-bold"
          style={{
            fontSize: 'clamp(36px, 4.6vw, 64px)',
            lineHeight: 1.1,
            letterSpacing: 'var(--tr-display)',
            color: 'var(--fg-default)',
            maxWidth: '560px',
          }}
        >
          <span
            className="reveal-line"
            style={{ ['--reveal-delay' as string]: '250ms' }}
          >
            Wenn etwas Schreibwürdiges passiert ist.
          </span>
        </h1>

        <motion.p
          className="mt-8 font-body"
          style={{
            fontSize: '18px',
            lineHeight: 1.6,
            color: 'var(--fg-default)',
            opacity: 0.9,
            maxWidth: '520px',
          }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
        >
          Long-Form aus laufenden Engagements und Praxisreflexionen. Kein
          Wochenrhythmus, keine Newsletter-Pflicht. Cross-Links zu
          stefanbraum.de, wo Themen sinnvoll dort besser sitzen.
        </motion.p>

        <motion.div
          className="mt-12 lg:mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <Link
            href="#blog-posts"
            data-cursor="magnetic"
            className="inline-flex items-center gap-3 font-mono uppercase transition-colors duration-220 hover:text-[color:var(--brand)]"
            style={{
              fontSize: '12px',
              letterSpacing: '0.16em',
              color: 'var(--fg-muted)',
            }}
          >
            <ArrowDown size={12} strokeWidth={1.6} />
            Neuester Post
          </Link>
        </motion.div>
      </div>

      {/* Rechte Hälfte: Versand-Widget */}
      <div
        className="relative z-[2] flex items-center justify-center px-6 pb-16 pt-4 md:px-12 lg:absolute lg:right-0 lg:top-0 lg:h-full lg:w-[50vw] lg:py-0 lg:pl-8 lg:pr-20 xl:pl-12 xl:pr-40"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
        >
          <Versand
            posts={items}
            currentIdx={currentIdx}
            reduceMotion={!!reduceMotion}
            paused={paused}
            progress={progress}
            externalOgMap={externalOgMap}
            onSelect={goTo}
          />
        </motion.div>
      </div>

      {/* Hairline-Übergang zur Post-Liste */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px"
        style={{ background: 'rgba(220, 128, 68, 0.10)' }}
      />
    </section>
  )
}

/**
 * Versand-Widget: Eyebrow mit Countdown, horizontale Route mit
 * bewegendem Dot, Letter-Card mit crossfadendem Inhalt.
 */
function Versand({
  posts,
  currentIdx,
  reduceMotion,
  paused,
  progress,
  externalOgMap,
  onSelect,
}: {
  posts:        Post[]
  currentIdx:   number
  reduceMotion: boolean
  paused:       boolean
  progress:     number
  externalOgMap: Record<string, string | null>
  onSelect:     (i: number) => void
}) {
  const stopsX = posts.length === 1
    ? [50]
    : posts.map((_, i) =>
        12 + (i * (88 - 12)) / (posts.length - 1),
      )

  const dotX = stopsX[currentIdx] ?? 50

  // Countdown in Sekunden (1..6), zeigt verbleibende Zeit bis nächste Übergabe.
  const remaining = Math.max(1, Math.ceil(CYCLE_MS / 1000 * (1 - progress)))

  return (
    <div
      style={{
        width: '420px',
        maxWidth: '100%',
      }}
    >
      {/* Eyebrow */}
      <div
        className="flex items-center justify-between"
        style={{ marginBottom: '20px', gap: '12px' }}
      >
        <span
          className="font-mono uppercase"
          style={{
            fontSize: '10px',
            letterSpacing: '0.20em',
            color: 'var(--brand)',
          }}
        >
          In Zustellung
        </span>
        <span
          className="inline-flex items-center font-mono uppercase"
          style={{
            fontSize: '9px',
            letterSpacing: '0.18em',
            color: 'var(--fg-subtle)',
            gap: '6px',
          }}
        >
          <span
            aria-hidden
            style={{
              display: 'inline-block',
              width: '6px',
              height: '6px',
              borderRadius: '999px',
              background: paused ? 'var(--fg-subtle)' : 'var(--accent)',
              boxShadow: paused
                ? 'none'
                : '0 0 8px rgba(200, 98, 42, 0.55)',
            }}
          />
          {paused
            ? 'pausiert'
            : reduceMotion
              ? 'live'
              : `nächste in ${remaining}s`}
        </span>
      </div>

      {/* Route */}
      <div
        className="relative"
        style={{
          height: '40px',
          marginBottom: '14px',
        }}
      >
        {/* Track Line */}
        <div
          aria-hidden
          className="absolute"
          style={{
            left: '8%',
            right: '8%',
            top: '50%',
            height: '1px',
            background: COGNAC_LINE,
            transform: 'translateY(-50%)',
          }}
        />
        {/* Active-Segment (von A bis zum Current-Waypoint) */}
        <motion.div
          aria-hidden
          className="absolute"
          style={{
            left: '8%',
            top: '50%',
            height: '1px',
            background: 'var(--accent)',
            boxShadow: '0 0 8px rgba(200, 98, 42, 0.4)',
            transform: 'translateY(-50%)',
            transformOrigin: 'left center',
          }}
          animate={{ width: `${dotX - 8}%` }}
          transition={{
            duration: reduceMotion ? 0 : 1.0,
            ease: TRACK_EASE,
          }}
        />

        {/* Endpunkte A und B */}
        <RouteMarker x={8} label="A" isEndpoint />
        <RouteMarker x={92} label="B" isEndpoint />

        {/* Waypoints für Posts */}
        {stopsX.map((x, i) => (
          <RouteMarker
            key={i}
            x={x}
            label={String(i + 1).padStart(2, '0')}
            active={i === currentIdx}
            onClick={() => onSelect(i)}
          />
        ))}

        {/* Bewegender Dot */}
        <motion.div
          aria-hidden
          className="absolute"
          style={{
            top: '50%',
            width: '12px',
            height: '12px',
            borderRadius: '999px',
            background: 'var(--accent)',
            boxShadow:
              '0 0 16px rgba(200, 98, 42, 0.65), 0 0 4px rgba(255, 255, 255, 0.3) inset',
            transform: 'translate(-50%, -50%)',
            zIndex: 5,
          }}
          animate={{ left: `${dotX}%` }}
          transition={{
            duration: reduceMotion ? 0 : 1.0,
            ease: TRACK_EASE,
          }}
        />
      </div>

      {/* Progress-Linie unter der Route — füllt sich von 0% auf 100% pro Cycle */}
      {!reduceMotion && posts.length > 1 && (
        <div
          aria-hidden
          className="relative"
          style={{
            height: '2px',
            marginBottom: '20px',
            borderRadius: '999px',
            background: 'rgba(168, 117, 83, 0.12)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${(paused ? progress : progress) * 100}%`,
              height: '100%',
              background: 'var(--accent)',
              opacity: paused ? 0.4 : 0.7,
              transition: paused ? 'opacity 220ms' : 'width 100ms linear',
              borderRadius: '999px',
            }}
          />
        </div>
      )}

      {/* Letter Card */}
      <div
        className="relative overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, #1F1C18 0%, #1A1814 55%, #15130F 100%)',
          border: `1px solid rgba(168, 117, 83, 0.28)`,
          borderRadius: 'var(--r-sm)',
          padding: '24px',
          minHeight: '220px',
          boxShadow:
            '0 28px 56px -16px rgba(0, 0, 0, 0.55),' +
            '0 8px 20px rgba(0, 0, 0, 0.30)',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={posts[currentIdx]?.slug ?? 'empty'}
            initial={
              reduceMotion ? { opacity: 0 } : { opacity: 0, x: 16 }
            }
            animate={
              reduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }
            }
            exit={
              reduceMotion ? { opacity: 0 } : { opacity: 0, x: -16 }
            }
            transition={{ duration: 0.45, ease: TRACK_EASE }}
          >
            <LetterContent
              post={posts[currentIdx]}
              externalOg={
                posts[currentIdx]?.kind === 'external'
                  ? externalOgMap[posts[currentIdx]!.slug] ?? null
                  : null
              }
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function RouteMarker({
  x,
  label,
  active = false,
  isEndpoint = false,
  onClick,
}: {
  x:           number
  label:       string
  active?:     boolean
  isEndpoint?: boolean
  onClick?:    () => void
}) {
  const dotInner = (
    <span
      aria-hidden
      style={{
        display: 'block',
        width: isEndpoint ? '8px' : '6px',
        height: isEndpoint ? '8px' : '6px',
        borderRadius: '999px',
        background: isEndpoint
          ? COGNAC
          : active
            ? 'var(--accent)'
            : 'var(--bg-base)',
        border: isEndpoint
          ? 'none'
          : `1.5px solid ${active ? 'var(--accent)' : COGNAC}`,
        boxShadow: active ? '0 0 10px rgba(200, 98, 42, 0.45)' : 'none',
        transition: 'all 400ms ease',
      }}
    />
  )

  const labelEl = (
    <span
      className="absolute font-mono uppercase"
      style={{
        left: '50%',
        top: '14px',
        transform: 'translateX(-50%)',
        fontSize: '8px',
        letterSpacing: '0.20em',
        color: active
          ? 'var(--accent)'
          : isEndpoint
            ? COGNAC
            : 'var(--fg-subtle)',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  )

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={`Brief ${label}`}
        data-cursor="magnetic"
        className="absolute cursor-pointer border-0 bg-transparent p-2"
        style={{
          left: `${x}%`,
          top: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 3,
        }}
      >
        <span className="relative block">
          {dotInner}
          {labelEl}
        </span>
      </button>
    )
  }

  return (
    <div
      className="absolute"
      style={{
        left: `${x}%`,
        top: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 3,
      }}
    >
      {dotInner}
      {labelEl}
    </div>
  )
}

function LetterContent({
  post,
  externalOg,
}: {
  post:       Post | undefined
  externalOg: string | null
}) {
  if (!post) return null

  const isInternal = post.kind === 'internal'
  const sourceLabel = isInternal
    ? 'Notiz · Braum Consulting'
    : 'Notiz · stefanbraum.de'
  const targetHref = isInternal
    ? `/blog/${post.slug}`
    : (post as Extract<Post, { kind: 'external' }>).url

  const ogSrc = isInternal
    ? (post as Extract<Post, { kind: 'internal' }>).ogImage ?? null
    : externalOg

  const reading = isInternal
    ? (post as Extract<Post, { kind: 'internal' }>).reading
    : null

  const { icon: ServiceIcon, label: serviceLabel } = serviceForPost(post)

  return (
    <Link
      href={targetHref}
      target={isInternal ? undefined : '_blank'}
      rel={isInternal ? undefined : 'noopener noreferrer'}
      data-cursor="magnetic"
      className="group block"
    >
      {/* Media-Banner — 16:9, native Komposition. Sowohl interne OG-Cards
          (1200×630) als auch stefanbraum.de-Visuals (1733×908) sind Landscape;
          im richtigen Verhältnis bleiben sie scharf statt im Quadrat zerquetscht. */}
      {ogSrc ? (
        <span
          aria-hidden
          className="relative block w-full overflow-hidden"
          style={{
            aspectRatio: '16 / 9',
            borderRadius: 'var(--r-sm)',
            border: '1px solid rgba(168, 117, 83, 0.22)',
            background: 'var(--bg-base)',
            marginBottom: '16px',
          }}
        >
          <Image
            src={ogSrc}
            alt=""
            fill
            sizes="(min-width: 1024px) 420px, 92vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
          <span
            aria-hidden
            className="absolute inset-x-0 bottom-0"
            style={{
              height: '38%',
              background:
                'linear-gradient(180deg, transparent 0%, rgba(10, 8, 7, 0.42) 100%)',
            }}
          />
        </span>
      ) : null}

      {/* Top-Row: Datum + Source + optional Reading-Time */}
      <div
        className="flex flex-wrap items-center"
        style={{ gap: '10px', marginBottom: '12px' }}
      >
        <span
          className="font-mono uppercase"
          style={{
            fontSize: '10px',
            letterSpacing: '0.18em',
            color: 'var(--fg-muted)',
          }}
        >
          {formatDateDE(post.date)}
        </span>
        <span
          aria-hidden
          style={{
            width: '12px',
            height: '1px',
            background: COGNAC_LINE,
          }}
        />
        <span
          className="font-mono uppercase"
          style={{
            fontSize: '10px',
            letterSpacing: '0.18em',
            color: COGNAC,
          }}
        >
          {sourceLabel}
        </span>
        {reading ? (
          <span
            className="inline-flex items-center font-mono uppercase"
            style={{
              fontSize: '9px',
              letterSpacing: '0.16em',
              color: 'var(--fg-subtle)',
              gap: '4px',
              padding: '2px 7px',
              borderRadius: 'var(--r-pill)',
              border: '1px solid rgba(168, 117, 83, 0.20)',
            }}
          >
            <Clock size={9} strokeWidth={1.8} />
            {reading} Min
          </span>
        ) : null}
      </div>

      {/* Title-Row mit Service-Icon und OG-Thumb */}
      <div
        className="flex items-start"
        style={{ gap: '14px', marginBottom: '12px' }}
      >
        {/* Service-Icon-Bubble */}
        <span
          aria-label={serviceLabel}
          title={serviceLabel}
          className="inline-flex shrink-0 items-center justify-center"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--r-sm)',
            background:
              'linear-gradient(135deg, rgba(220, 128, 68, 0.18) 0%, rgba(200, 98, 42, 0.06) 100%)',
            border: '1px solid rgba(220, 128, 68, 0.32)',
            color: 'var(--brand)',
            marginTop: '2px',
          }}
        >
          <ServiceIcon size={16} strokeWidth={1.7} />
        </span>

        {/* Title */}
        <h2
          className="flex-1 font-display font-semibold transition-colors duration-300 group-hover:text-[color:var(--brand)]"
          style={{
            fontSize: '20px',
            lineHeight: 1.28,
            letterSpacing: 'var(--tr-heading)',
            color: 'var(--fg-default)',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            margin: 0,
          }}
        >
          {post.title}
        </h2>
      </div>

      {/* Tags als Chips */}
      {post.tags.length > 0 && (
        <ul
          className="flex flex-wrap"
          style={{
            gap: '6px',
            listStyle: 'none',
            padding: 0,
            margin: 0,
            marginBottom: '14px',
          }}
        >
          {post.tags.slice(0, 3).map(t => (
            <li
              key={t}
              className="font-mono uppercase"
              style={{
                fontSize: '9px',
                letterSpacing: '0.14em',
                padding: '2px 8px',
                borderRadius: 'var(--r-pill)',
                color: 'var(--fg-muted)',
                background: 'rgba(168, 117, 83, 0.08)',
                border: '1px solid rgba(168, 117, 83, 0.18)',
              }}
            >
              {t}
            </li>
          ))}
        </ul>
      )}

      {/* Footer: Lesen-Link rechts */}
      <div className="flex items-center justify-end">
        <span
          className="inline-flex items-center gap-2 font-mono uppercase transition-colors duration-220 group-hover:text-[color:var(--brand)]"
          style={{
            fontSize: '11px',
            letterSpacing: '0.16em',
            color: 'var(--accent)',
          }}
        >
          Lesen
          {isInternal ? (
            <ArrowDown size={12} strokeWidth={1.6} />
          ) : (
            <ArrowUpRight size={12} strokeWidth={1.6} />
          )}
        </span>
      </div>
    </Link>
  )
}
