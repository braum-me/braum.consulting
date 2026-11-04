'use client'

import { useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'
import Section from '@/components/ui/Section'
import Eyebrow from '@/components/ui/Eyebrow'
import AccentGlow from '@/components/ui/AccentGlow'
import { ToolPreview, slugOf, stageBase } from '@/components/werkzeuge/ToolPreview'
import { TOOLS, type Tool } from '@/lib/tools'

const EASE = [0.16, 1, 0.3, 1] as const

/* ── Karte ──────────────────────────────────────────────────────────────── */

function ToolCard({ tool, reduce }: { tool: Tool; reduce: boolean }) {
  const [hover, setHover] = useState(false)
  const slug = slugOf(tool.href)
  return (
    <Link
      href={tool.href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      className="group relative block overflow-hidden"
      style={{
        scrollSnapAlign: 'start',
        flex: '0 0 auto',
        width: 'min(82vw, 320px)',
        borderRadius: 10,
        background: 'rgba(242, 240, 235, 0.03)',
        border: '1px solid rgba(242, 240, 235, 0.10)',
      }}
    >
      {/* Live-Demo-Stage */}
      <div style={stageBase}>
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 transition-opacity duration-500"
          style={{ background: 'radial-gradient(60% 60% at 50% 100%, rgba(220, 128, 68, 0.20) 0%, transparent 70%)', opacity: hover ? 1 : 0.5 }}
        />
        <ToolPreview slug={slug} active={hover} still={reduce} />
      </div>

      {/* Body */}
      <div className="flex flex-col" style={{ padding: '18px 20px 20px' }}>
        <div className="flex items-center justify-between" style={{ gap: 10 }}>
          <span className="inline-flex items-center justify-center" style={{ width: 34, height: 34, borderRadius: 8, flexShrink: 0, background: 'rgba(220, 128, 68, 0.10)', color: 'var(--brand)' }}>
            <tool.Icon size={16} strokeWidth={1.5} />
          </span>
          <span className="font-mono uppercase" style={{ flex: 1, fontSize: 10, letterSpacing: '0.16em', color: 'var(--brand)' }}>
            {tool.eyebrow} · {tool.time}
          </span>
          <ArrowUpRight size={16} strokeWidth={1.75} className="transition-transform duration-220 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" style={{ color: 'var(--fg-muted)', flexShrink: 0 }} />
        </div>
        <span className="block font-display" style={{ marginTop: 13, fontSize: 16.5, fontWeight: 600, lineHeight: 1.25, color: 'var(--fg-default)' }}>
          {tool.title}
        </span>
        <span className="block font-body" style={{ marginTop: 7, fontSize: 13, lineHeight: 1.5, color: 'var(--fg-muted)' }}>
          {tool.text}
        </span>
      </div>
    </Link>
  )
}

/* ── Section ────────────────────────────────────────────────────────────── */

export default function WerkzeugeTeaser() {
  const reduce = useReducedMotion() ?? false
  const scroller = useRef<HTMLDivElement>(null)

  function scrollByCards(dir: 1 | -1) {
    const el = scroller.current
    if (!el) return
    const card = el.querySelector<HTMLElement>('[data-tool-card]')
    const step = card ? card.offsetWidth + 16 : el.clientWidth * 0.8
    el.scrollBy({ left: dir * step * 1.5, behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <Section
      className="relative py-28 md:py-36"
      background={<AccentGlow position="bottom-right" intensity="low" />}
    >
      <div className="flex items-end justify-between" style={{ gap: 24, flexWrap: 'wrap' }}>
        <motion.div
          className="max-w-[640px]"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15%' }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <Eyebrow num="05">Werkzeuge</Eyebrow>
          <h2
            className="mt-6 font-display font-bold"
            style={{ fontSize: 'clamp(34px, 4.4vw, 60px)', lineHeight: 'var(--lh-display)', letterSpacing: 'var(--tr-display)', color: 'var(--fg-default)' }}
          >
            Erst mal selbst sortieren.
          </h2>
          <p
            className="mt-5 font-body"
            style={{ fontSize: 'var(--t-body-lg)', lineHeight: 1.5, color: 'var(--fg-muted)', maxWidth: 560 }}
          >
            Zwölf kleine Selbst-Checks für den Einstieg — Betroffenheit, Aufwand, Reifegrad.
            Fahr mit der Maus drüber und sieh, was rauskommt. In zwei Minuten, ohne Anmeldung.
          </p>
        </motion.div>

        {/* Carousel-Steuerung — Desktop */}
        <div className="hidden items-center md:flex" style={{ gap: 10 }}>
          <CarouselButton dir={-1} onClick={() => scrollByCards(-1)} label="Zurück" />
          <CarouselButton dir={1} onClick={() => scrollByCards(1)} label="Weiter" />
        </div>
      </div>

      {/* Karussell */}
      <div
        ref={scroller}
        className="mt-12 flex no-scrollbar"
        style={{
          gap: 16,
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollPadding: '0 24px',
          paddingBottom: 4,
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {TOOLS.map((t, i) => (
          <motion.div
            key={t.href}
            data-tool-card
            style={{ flex: '0 0 auto', display: 'flex' }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-5%' }}
            transition={{ duration: 0.5, ease: EASE, delay: Math.min(i, 6) * 0.05 }}
          >
            <ToolCard tool={t} reduce={reduce} />
          </motion.div>
        ))}
        {/* End-Cap → Hub */}
        <Link
          href="/werkzeuge"
          className="group flex flex-col items-center justify-center text-center"
          style={{ flex: '0 0 auto', width: 'min(60vw, 200px)', scrollSnapAlign: 'start', borderRadius: 10, border: '1px dashed rgba(242,240,235,0.16)', gap: 12, padding: 24 }}
        >
          <span className="inline-flex items-center justify-center" style={{ width: 44, height: 44, borderRadius: 'var(--r-pill)', background: 'rgba(220,128,68,0.10)', color: 'var(--brand)' }}>
            <ArrowRight size={20} strokeWidth={1.75} className="transition-transform duration-220 group-hover:translate-x-0.5" />
          </span>
          <span className="font-display font-semibold" style={{ fontSize: 15, color: 'var(--fg-default)' }}>
            Alle zwölf ansehen
          </span>
        </Link>
      </div>

      <div className="mt-10">
        <Link
          href="/werkzeuge"
          className="group inline-flex items-center font-mono uppercase"
          style={{ gap: 8, fontSize: 12, letterSpacing: '0.08em', color: 'var(--fg-default)' }}
        >
          Alle Werkzeuge
          <ArrowRight size={14} strokeWidth={1.75} className="transition-transform duration-220 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </Section>
  )
}

function CarouselButton({ dir, onClick, label }: { dir: 1 | -1; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="inline-flex items-center justify-center transition-colors duration-220"
      style={{ width: 42, height: 42, borderRadius: 'var(--r-pill)', background: 'rgba(242,240,235,0.04)', border: '1px solid rgba(242,240,235,0.14)', color: 'var(--fg-default)', cursor: 'pointer' }}
    >
      {dir === -1 ? <ChevronLeft size={18} strokeWidth={1.75} /> : <ChevronRight size={18} strokeWidth={1.75} />}
    </button>
  )
}
