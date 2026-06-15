'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { ToolPreview, slugOf } from '@/components/werkzeuge/ToolPreview'
import type { Tool } from '@/lib/tools'

const EASE = [0.16, 1, 0.3, 1] as const

/**
 * Werkzeug-Karte für den Hub (/werkzeuge). Im Ruhezustand exakt wie bisher
 * (Icon, Eyebrow, Titel, Text, „Starten"). Beim Hover/Fokus faded das Idle-Face
 * weg, ein opakes Demo-Overlay blendet ein: die passende Live-Animation läuft im
 * Hintergrund, der Titel swiped oben rein und bleibt sichtbar. Das Overlay ist
 * `pointer-events: none`, der Link bleibt klickbar; ohne Hover ist es unsichtbar.
 */
export default function ToolHubCard({ tool }: { tool: Tool }) {
  const reduce = useReducedMotion() ?? false
  const [hover, setHover] = useState(false)
  const slug = slugOf(tool.href)
  const swipe = (delay: number) => ({
    duration: reduce ? 0 : 0.42,
    ease: EASE,
    delay: hover && !reduce ? delay : 0,
  })

  return (
    <Link
      href={tool.href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      className="group relative flex flex-col overflow-hidden transition-transform duration-300 hover:-translate-y-1"
      style={{
        padding: 32,
        borderRadius: 14,
        background: 'rgba(242, 240, 235, 0.03)',
        border: '1px solid rgba(242, 240, 235, 0.10)',
        boxShadow: '0 16px 32px -8px rgba(0, 0, 0, 0.32)',
      }}
    >
      {/* Idle-Face — faded beim Hover weg, bleibt aber im Fluss (kein Shift) */}
      <div
        className="flex flex-1 flex-col"
        style={{ opacity: hover ? 0 : 1, transition: `opacity ${reduce ? 120 : 280}ms cubic-bezier(0.16, 1, 0.3, 1)` }}
      >
        <span
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 44, height: 44, borderRadius: 8,
            background: 'rgba(220, 128, 68, 0.10)', color: 'var(--brand)', marginBottom: 20,
          }}
        >
          <tool.Icon size={20} strokeWidth={1.5} />
        </span>
        <p className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: '0.20em', color: 'var(--brand)', marginBottom: 10 }}>
          {tool.num} · {tool.eyebrow} · {tool.time}
        </p>
        <h2 className="font-display" style={{ fontSize: 22, fontWeight: 600, lineHeight: 1.2, letterSpacing: '-0.022em', color: 'var(--fg-default)', margin: '0 0 12px' }}>
          {tool.title}
        </h2>
        <p className="font-body" style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--fg-muted)', margin: '0 0 24px' }}>
          {tool.text}
        </p>
        <span
          className="font-mono uppercase inline-flex items-center"
          style={{ marginTop: 'auto', gap: 8, fontSize: 12, letterSpacing: '0.06em', color: 'var(--fg-default)' }}
        >
          Starten
          <ArrowRight size={14} strokeWidth={1.75} className="transition-transform duration-220 group-hover:translate-x-0.5" />
        </span>
      </div>

      {/* Hover-Face — Live-Demo hinten, Titel swiped oben rein */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          borderRadius: 13,
          background: 'var(--bg-base)',
          opacity: hover ? 1 : 0,
          transition: `opacity ${reduce ? 120 : 320}ms cubic-bezier(0.16, 1, 0.3, 1)`,
        }}
      >
        <span aria-hidden className="absolute inset-0" style={{ background: 'radial-gradient(75% 80% at 50% 30%, rgba(146, 48, 30, 0.18) 0%, transparent 68%)' }} />
        <span aria-hidden className="absolute inset-0" style={{ background: 'radial-gradient(60% 55% at 50% 100%, rgba(220, 128, 68, 0.16) 0%, transparent 70%)' }} />

        {/* Live-Demo dahinter */}
        <ToolPreview slug={slug} active={hover} still={reduce} />

        {/* Scrim für Titel-Lesbarkeit über der Demo */}
        <span
          aria-hidden
          className="absolute left-0 right-0 top-0"
          style={{ height: 132, background: 'linear-gradient(180deg, rgba(15, 14, 12, 0.92) 0%, rgba(15, 14, 12, 0.55) 55%, transparent 100%)' }}
        />

        {/* Titel oben — swiped rein */}
        <motion.div
          className="absolute left-0 right-0 top-0 flex flex-col"
          style={{ padding: '28px 32px 0', gap: 8 }}
          initial={false}
          animate={{ opacity: hover ? 1 : 0, y: hover ? 0 : 16 }}
          transition={swipe(0.1)}
        >
          <span className="font-mono uppercase" style={{ fontSize: 10.5, letterSpacing: '0.18em', color: 'var(--brand)' }}>
            {tool.eyebrow} · {tool.time}
          </span>
          <span className="font-display" style={{ fontSize: 20, fontWeight: 600, lineHeight: 1.2, letterSpacing: '-0.022em', color: 'var(--fg-default)' }}>
            {tool.title}
          </span>
        </motion.div>

        {/* Klick-Affordance oben rechts */}
        <motion.span
          className="absolute"
          style={{ top: 28, right: 28, color: 'var(--brand)' }}
          initial={false}
          animate={{ opacity: hover ? 1 : 0, y: hover ? 0 : 16 }}
          transition={swipe(0.14)}
        >
          <ArrowUpRight size={18} strokeWidth={1.75} />
        </motion.span>
      </span>
    </Link>
  )
}
