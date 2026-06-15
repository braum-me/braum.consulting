'use client'

/**
 * Vier kinematische Säulen-Visuals — wiederverwendbar zwischen Mainpage
 * (components/sections/Services.tsx) und /leistungen-Übersicht.
 *
 * Jedes Visual respektiert prefers-reduced-motion und animiert nur, wenn
 * es per IntersectionObserver in den Viewport scrollt.
 *
 * Visuelle Grammatik:
 *   - Marke      → Brand-System (Logo-Tile + Color-Tokens + Lighthouse)
 *   - M365       → Hub-Spoke mit App-Icons + Pulse-Rings
 *   - KI         → Prompt-Console + Workflow-Node-Chain + Sparkles
 *   - Strategie  → Compass + Roadmap-Path + Milestone-Dots + Zielbild
 */

import { useEffect, useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import {
  Sparkles, MessageSquare, Mail, Calendar, FolderOpen,
  ShieldCheck, Target, Settings,
} from 'lucide-react'
import Monogram from '@/components/ui/Monogram'
import type { ServiceSlug } from '@/lib/services'

const EASE = [0.16, 1, 0.3, 1] as const

/* ── Dispatcher ──────────────────────────────────────────────────────── */

export function ServiceVisual({ slug }: { slug: ServiceSlug }) {
  switch (slug) {
    case 'marke':     return <MarkeServiceVisual />
    case 'm365':      return <M365ServiceVisual />
    case 'ai':        return <AiServiceVisual />
    case 'strategie': return <StrategieServiceVisual />
  }
}

/* ── 1) Marke — Laptop + Phone + Lighthouse + Tokens ──────────────────── */

export function MarkeServiceVisual() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const reduceMotion = useReducedMotion()

  return (
    <div ref={ref} className="absolute inset-0 flex items-center justify-center" style={{ padding: '16px' }}>
      <div className="relative" style={{ width: '100%', maxWidth: '380px', height: '100%' }}>
        {/* Background Monogram Outline */}
        <Monogram
          variant="outline"
          strokeWidth={4}
          style={{
            position: 'absolute',
            left: '-10%',
            top: '4%',
            width: '120%',
            color: 'rgba(220, 128, 68, 0.12)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        {/* Laptop-Mockup mit cleaner Website (Hauptelement, mittig-links) */}
        <FloatTile
          inView={inView}
          reduceMotion={!!reduceMotion}
          delay={0.2}
          floatDelay={0}
          style={{ position: 'absolute', left: '2%', top: '18%', zIndex: 3 }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Laptop-Lid mit Screen */}
            <div
              style={{
                width: 196,
                padding: 5,
                background:
                  'linear-gradient(145deg, rgba(60, 60, 64, 0.95), rgba(30, 30, 32, 0.95))',
                border: '1px solid rgba(245, 245, 250, 0.22)',
                borderRadius: '10px 10px 4px 4px',
                boxShadow:
                  '0 22px 50px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.20)',
              }}
            >
              {/* Inner Screen */}
              <div
                style={{
                  width: '100%',
                  background: 'rgba(15, 14, 12, 0.98)',
                  borderRadius: 5,
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                {/* Browser-Chrome */}
                <div
                  className="flex items-center"
                  style={{
                    gap: 3,
                    padding: '4px 6px 3px',
                    borderBottom: '1px solid rgba(245, 245, 250, 0.08)',
                    background: 'rgba(28, 27, 24, 0.85)',
                  }}
                >
                  {['#FF5F56', '#FFBD2E', '#28C840'].map(c => (
                    <span key={c}
                      style={{ width: 4, height: 4, borderRadius: 999, background: c }} />
                  ))}
                  <span
                    className="font-mono"
                    style={{
                      marginLeft: 6,
                      padding: '1px 5px',
                      fontSize: 4,
                      color: 'rgba(245, 245, 250, 0.55)',
                      background: 'rgba(245, 245, 250, 0.06)',
                      borderRadius: 2,
                      letterSpacing: '0.02em',
                    }}
                  >
                    braum.consulting
                  </span>
                </div>
                {/* Site-Body */}
                <div style={{ padding: '8px 10px 10px', position: 'relative' }}>
                  {/* Nav-Row */}
                  <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
                    <Monogram style={{ width: 18, color: 'var(--brand)' }} />
                    <div className="flex gap-2">
                      {[10, 12, 8].map((w, i) => (
                        <span key={i}
                          style={{ width: w, height: 2, background: 'rgba(245, 245, 250, 0.3)', borderRadius: 1 }} />
                      ))}
                    </div>
                  </div>
                  {/* Headline */}
                  <p
                    className="font-display font-black"
                    style={{
                      fontSize: 11,
                      lineHeight: 1.05,
                      color: 'rgba(245, 245, 248, 0.95)',
                      letterSpacing: '-0.02em',
                      margin: 0,
                    }}
                  >
                    Digitales Handwerk.
                  </p>
                  <p
                    className="font-display"
                    style={{
                      fontSize: 6,
                      color: 'rgba(245, 245, 250, 0.55)',
                      marginTop: 3,
                      lineHeight: 1.3,
                    }}
                  >
                    Operator statt Berater. Direkt mit Stefan.
                  </p>
                  {/* CTA-Pill */}
                  <span
                    style={{
                      display: 'inline-block',
                      marginTop: 6,
                      padding: '2px 6px',
                      fontSize: 4,
                      background: 'var(--accent)',
                      color: 'white',
                      borderRadius: 2,
                      fontFamily: 'var(--font-mono)',
                      letterSpacing: '0.06em',
                    }}
                  >
                    Lagebild →
                  </span>
                  {/* Mini Hero-Visual rechts */}
                  <span
                    style={{
                      position: 'absolute',
                      right: 8, top: 18,
                      width: 26, height: 26,
                      borderRadius: 4,
                      background:
                        'radial-gradient(60% 60% at 50% 50%, rgba(220, 128, 68, 0.55), rgba(146, 48, 30, 0.20))',
                      border: '1px solid rgba(220, 128, 68, 0.30)',
                    }}
                  />
                </div>
              </div>
            </div>
            {/* Laptop-Base */}
            <div
              style={{
                width: 220,
                height: 4,
                background:
                  'linear-gradient(180deg, rgba(60, 60, 64, 0.95), rgba(30, 30, 32, 0.95))',
                borderRadius: '0 0 6px 6px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
              }}
            />
            <div
              style={{
                width: 32, height: 1.5,
                background: 'rgba(245, 245, 250, 0.20)',
                borderRadius: '0 0 4px 4px',
              }}
            />
          </div>
        </FloatTile>

        {/* Color-Tokens (oben rechts klein) */}
        <FloatTile
          inView={inView}
          reduceMotion={!!reduceMotion}
          delay={0.4}
          floatDelay={0.6}
          style={{ position: 'absolute', right: '2%', top: '4%', zIndex: 4 }}
        >
          <div
            style={{
              padding: 7,
              background: 'rgba(28, 27, 24, 0.92)',
              border: '1px solid rgba(245, 245, 250, 0.18)',
              borderRadius: 7,
              backdropFilter: 'blur(20px)',
              boxShadow: '0 14px 30px rgba(0, 0, 0, 0.45)',
            }}
          >
            <p
              className="font-mono uppercase"
              style={{ fontSize: 5, letterSpacing: '0.18em', color: 'rgba(245, 245, 250, 0.45)', marginBottom: 4 }}
            >
              Tokens
            </p>
            <div className="flex gap-0.5">
              {['#0F0E0C', '#DC8044', '#C8622A', '#F2F0EB'].map(c => (
                <div
                  key={c}
                  style={{
                    width: 9, height: 14,
                    borderRadius: 2,
                    background: c,
                    border: '1px solid rgba(245, 245, 250, 0.08)',
                  }}
                />
              ))}
            </div>
          </div>
        </FloatTile>

        {/* Phone-Mockup mit Social-Post (rechts mitte/unten) */}
        <FloatTile
          inView={inView}
          reduceMotion={!!reduceMotion}
          delay={0.5}
          floatDelay={1.1}
          style={{ position: 'absolute', right: '4%', top: '32%', zIndex: 5 }}
        >
          <div
            style={{
              width: 64,
              padding: 3,
              background:
                'linear-gradient(145deg, rgba(40, 40, 44, 0.95), rgba(20, 20, 22, 0.95))',
              border: '1px solid rgba(245, 245, 250, 0.22)',
              borderRadius: 10,
              backdropFilter: 'blur(20px)',
              boxShadow:
                '0 18px 36px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.18)',
            }}
          >
            <div
              style={{
                width: '100%',
                background: 'rgba(15, 14, 12, 0.98)',
                borderRadius: 7,
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {/* Notch */}
              <div
                style={{
                  position: 'absolute',
                  top: 2,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 12,
                  height: 2.5,
                  background: 'rgba(0, 0, 0, 0.95)',
                  borderRadius: 999,
                  zIndex: 4,
                }}
              />
              {/* Post-Header */}
              <div
                className="flex items-center"
                style={{ gap: 3, padding: '6px 4px 3px' }}
              >
                <span
                  style={{
                    width: 8, height: 8,
                    borderRadius: 999,
                    background:
                      'linear-gradient(145deg, var(--brand), var(--accent))',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Monogram style={{ width: 5, color: 'white' }} />
                </span>
                <span className="font-mono" style={{ fontSize: 4, color: 'rgba(245, 245, 250, 0.85)' }}>
                  @braum
                </span>
              </div>
              {/* Post-Image */}
              <div
                style={{
                  width: '100%',
                  aspectRatio: '1 / 1',
                  background:
                    'linear-gradient(145deg, rgba(220, 128, 68, 0.35) 0%, rgba(146, 48, 30, 0.65) 65%, rgba(15, 14, 12, 0.95) 100%)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Monogram
                  style={{
                    position: 'absolute',
                    left: 3,
                    bottom: 3,
                    width: 18,
                    color: 'rgba(245, 245, 248, 0.95)',
                  }}
                />
              </div>
              {/* Engagement */}
              <div className="flex items-center" style={{ padding: '3px 4px', gap: 3 }}>
                <motion.span
                  style={{ fontSize: 5, color: 'var(--brand)' }}
                  animate={reduceMotion ? {} : { scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  ♥
                </motion.span>
                <span className="font-mono" style={{ fontSize: 3.5, color: 'rgba(245, 245, 250, 0.65)' }}>
                  1.2k
                </span>
              </div>
            </div>
          </div>
        </FloatTile>

        {/* Lighthouse-Score (links unten) */}
        <FloatTile
          inView={inView}
          reduceMotion={!!reduceMotion}
          delay={0.65}
          floatDelay={1.6}
          style={{ position: 'absolute', left: '4%', bottom: '4%', zIndex: 4 }}
        >
          <div
            style={{
              padding: '8px 10px',
              background:
                'linear-gradient(145deg, rgba(245, 245, 248, 0.16), rgba(40, 200, 64, 0.08))',
              border: '1px solid rgba(40, 200, 64, 0.32)',
              borderRadius: 8,
              backdropFilter: 'blur(20px)',
              boxShadow: '0 14px 30px rgba(0, 0, 0, 0.45)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            {/* Score-Ring */}
            <div style={{ position: 'relative', width: 28, height: 28 }}>
              <svg viewBox="0 0 36 36" style={{ width: 28, height: 28 }}>
                <circle cx="18" cy="18" r="14" fill="none"
                  stroke="rgba(245, 245, 250, 0.10)" strokeWidth="3" />
                {!reduceMotion ? (
                  <motion.circle
                    cx="18" cy="18" r="14" fill="none"
                    stroke="#28C840" strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="88"
                    initial={{ strokeDashoffset: 88 }}
                    animate={inView ? { strokeDashoffset: 88 * (1 - 0.98) } : undefined}
                    transition={{ duration: 1.6, delay: 0.8, ease: 'easeOut' }}
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '18px 18px' }}
                  />
                ) : (
                  <circle cx="18" cy="18" r="14" fill="none"
                    stroke="#28C840" strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="88" strokeDashoffset={88 * 0.02}
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '18px 18px' }}
                  />
                )}
              </svg>
              <span
                className="font-display font-black"
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  color: '#28C840',
                  lineHeight: 1,
                }}
              >
                98
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <p
                className="font-mono uppercase"
                style={{ fontSize: 5, letterSpacing: '0.18em', color: 'rgba(245, 245, 250, 0.45)' }}
              >
                Lighthouse
              </p>
              <p
                className="font-mono"
                style={{ fontSize: 4.5, color: 'rgba(245, 245, 250, 0.78)', letterSpacing: '0.04em' }}
              >
                Performance · SEO
              </p>
            </div>
          </div>
        </FloatTile>
      </div>
    </div>
  )
}

/* ── 2) M365 — Hub mit Apps + Pulse ──────────────────────────────────── */

export function M365ServiceVisual() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const reduceMotion = useReducedMotion()

  return (
    <div ref={ref} className="absolute inset-0 flex items-center justify-center" style={{ padding: '20px' }}>
      <svg viewBox="0 0 360 200" style={{ width: '100%', height: '100%', maxWidth: '380px' }}>
        <defs>
          <radialGradient id="m365svc-hub" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(220, 128, 68, 0.55)" />
            <stop offset="100%" stopColor="rgba(220, 128, 68, 0)" />
          </radialGradient>
          <linearGradient id="m365svc-cloud" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"  stopColor="rgba(245, 245, 250, 0.10)" />
            <stop offset="100%" stopColor="rgba(245, 245, 250, 0.02)" />
          </linearGradient>
        </defs>

        {/* Admin-Panel oben — Management/Tenant-Indicator */}
        <motion.g
          initial={{ opacity: 0, y: -6 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.6, delay: 0.15, ease: EASE }}
        >
          <rect
            x="106" y="18" width="148" height="32" rx="5"
            fill="rgba(28, 27, 24, 0.92)"
            stroke="rgba(245, 245, 250, 0.18)"
            strokeWidth="0.8"
          />
          {/* Settings-Icon */}
          <foreignObject x="114" y="26" width="14" height="14">
            <div
              style={{
                width: 14, height: 14,
                borderRadius: 4,
                background: 'rgba(220, 128, 68, 0.18)',
                border: '1px solid rgba(220, 128, 68, 0.45)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Settings size={9} strokeWidth={1.8} style={{ color: 'var(--brand)' }} />
            </div>
          </foreignObject>
          <text x="134" y="32" fill="rgba(245, 245, 250, 0.78)" fontSize="6"
            fontFamily="var(--font-mono)" letterSpacing="0.18em" fontWeight="700">
            ADMIN-CENTER
          </text>
          <text x="134" y="42" fill="rgba(245, 245, 250, 0.42)" fontSize="5"
            fontFamily="var(--font-mono)" letterSpacing="0.14em">
            Tenant · EU · 247 Users
          </text>
          {/* Status-Dots rechts */}
          <g>
            <circle cx="224" cy="29" r="2" fill="#28C840" />
            <text x="232" y="32" fill="rgba(245, 245, 250, 0.55)" fontSize="5"
              fontFamily="var(--font-mono)">healthy</text>
            <circle cx="224" cy="41" r="2" fill="#DC8044" />
            <text x="232" y="44" fill="rgba(245, 245, 250, 0.55)" fontSize="5"
              fontFamily="var(--font-mono)">secured</text>
          </g>
        </motion.g>

        <circle cx="180" cy="112" r="48" fill="url(#m365svc-hub)" />

        {!reduceMotion && [0, 0.7, 1.4].map((delay) => (
          <motion.circle
            key={delay}
            cx="180" cy="112" r="30"
            fill="none"
            stroke="rgba(220, 128, 68, 0.55)"
            strokeWidth="0.8"
            initial={{ opacity: 0, r: 30 }}
            animate={inView ? { opacity: [0.65, 0], r: [30, 64] } : undefined}
            transition={{ duration: 2, repeat: Infinity, delay, ease: 'easeOut' }}
          />
        ))}

        {/* Connection-Line vom Admin-Panel zum Hub */}
        <line x1="180" y1="50" x2="180" y2="92"
          stroke="rgba(220, 128, 68, 0.30)" strokeWidth="0.8" strokeDasharray="2 3" />

        <rect
          x="144" y="96" width="72" height="36" rx="8"
          fill="rgba(15, 14, 12, 0.95)"
          stroke="rgba(220, 128, 68, 0.65)" strokeWidth="1.2"
        />
        <text
          x="180" y="112" textAnchor="middle"
          fill="#DC8044" fontSize="12"
          fontFamily="var(--font-display)" fontWeight="700"
          letterSpacing="-0.02em"
        >
          M365
        </text>
        <text
          x="180" y="124" textAnchor="middle"
          fill="rgba(245, 245, 250, 0.45)" fontSize="5"
          fontFamily="var(--font-mono)" letterSpacing="0.24em"
        >
          SECURED · EU
        </text>

        {[
          { x: 32,  y: 112, Icon: Mail,          label: 'Mail' },
          { x: 328, y: 112, Icon: MessageSquare, label: 'Teams' },
          { x: 78,  y: 178, Icon: Calendar,      label: 'Cal' },
          { x: 282, y: 178, Icon: FolderOpen,    label: 'Drive' },
          { x: 138, y: 184, Icon: ShieldCheck,   label: 'MDM' },
          { x: 222, y: 184, Icon: Sparkles,      label: 'Copilot' },
        ].map((a, i) => (
          <g key={i}>
            <line
              x1="180" y1="112" x2={a.x} y2={a.y}
              stroke="rgba(220, 128, 68, 0.18)" strokeWidth="0.8" strokeDasharray="2 3"
            />
            <foreignObject x={a.x - 14} y={a.y - 14} width="28" height="28">
              <div
                style={{
                  width: 28, height: 28,
                  borderRadius: 6,
                  background: 'rgba(15, 14, 12, 0.95)',
                  border: '1px solid rgba(220, 128, 68, 0.32)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 8px 18px rgba(0, 0, 0, 0.55)',
                }}
              >
                <a.Icon size={14} strokeWidth={1.6} style={{ color: 'rgba(220, 128, 68, 0.85)' }} />
              </div>
            </foreignObject>
          </g>
        ))}
      </svg>
    </div>
  )
}

/* ── 3) AI — Prompt-Console + Workflow ───────────────────────────────── */

export function AiServiceVisual() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const reduceMotion = useReducedMotion()

  return (
    <div ref={ref} className="absolute inset-0 flex items-center justify-center" style={{ padding: '20px' }}>
      <div className="relative" style={{ width: '100%', maxWidth: '380px', height: '100%' }}>
        <motion.div
          style={{
            position: 'absolute',
            left: '4%',
            top: '15%',
            width: '60%',
            padding: '12px 14px',
            background:
              'linear-gradient(145deg, rgba(28, 27, 24, 0.95), rgba(15, 14, 12, 0.95))',
            border: '1px solid rgba(220, 128, 68, 0.32)',
            borderRadius: 10,
            backdropFilter: 'blur(14px)',
            boxShadow:
              '0 20px 50px rgba(0, 0, 0, 0.55), 0 0 36px rgba(220, 128, 68, 0.16)',
            zIndex: 3,
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
        >
          <div className="flex items-center gap-1.5" style={{ marginBottom: 6 }}>
            <Sparkles size={9} strokeWidth={1.6} style={{ color: 'var(--brand)' }} />
            <span className="font-mono uppercase" style={{ fontSize: 7, letterSpacing: '0.16em', color: 'var(--fg-muted)' }}>
              Copilot
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <span style={{ height: 3, width: '85%', background: 'rgba(245,245,250,0.20)', borderRadius: 2 }} />
            <span style={{ height: 3, width: '60%', background: 'rgba(245,245,250,0.14)', borderRadius: 2 }} />
            <span style={{ height: 3, width: '74%', background: 'rgba(220,128,68,0.55)', borderRadius: 2 }} />
          </div>
          <motion.div
            style={{
              marginTop: 8,
              padding: '4px 6px',
              background: 'rgba(220, 128, 68, 0.10)',
              border: '1px solid rgba(220, 128, 68, 0.30)',
              borderRadius: 4,
            }}
            animate={reduceMotion ? {} : { borderColor: ['rgba(220, 128, 68, 0.30)', 'rgba(220, 128, 68, 0.70)', 'rgba(220, 128, 68, 0.30)'] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span
              style={{
                display: 'inline-block', width: 1, height: 8,
                background: 'var(--brand)',
                verticalAlign: 'middle',
              }}
            />
          </motion.div>
        </motion.div>

        <motion.div
          style={{
            position: 'absolute',
            right: '4%',
            top: '18%',
            width: '38%',
            padding: '10px 12px',
            background: 'rgba(15, 14, 12, 0.92)',
            border: '1px solid rgba(245, 245, 250, 0.18)',
            borderRadius: 10,
            backdropFilter: 'blur(14px)',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45)',
            zIndex: 4,
          }}
          initial={{ opacity: 0, x: 12 }}
          animate={inView ? { opacity: 1, x: 0 } : undefined}
          transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
        >
          <p
            className="font-mono uppercase"
            style={{ fontSize: 6, letterSpacing: '0.18em', color: 'rgba(245, 245, 250, 0.45)', marginBottom: 6 }}
          >
            Workflow
          </p>
          {[
            { label: 'Mail · Trigger', active: false },
            { label: 'GPT · Classify', active: true  },
            { label: 'Excel · Append', active: false },
          ].map((n, i, arr) => (
            <div key={n.label}>
              <div
                style={{
                  padding: '4px 6px',
                  background: n.active ? 'rgba(220, 128, 68, 0.12)' : 'rgba(245, 245, 250, 0.04)',
                  border: `1px solid ${n.active ? 'rgba(220, 128, 68, 0.40)' : 'rgba(245, 245, 250, 0.10)'}`,
                  borderRadius: 4,
                  fontSize: 7,
                  fontFamily: 'var(--font-mono)',
                  color: n.active ? 'var(--brand)' : 'rgba(245, 245, 250, 0.75)',
                  letterSpacing: '0.02em',
                }}
              >
                {n.label}
              </div>
              {i < arr.length - 1 && (
                <div
                  style={{
                    width: 1, height: 6,
                    background: 'rgba(220, 128, 68, 0.40)',
                    marginLeft: 8,
                  }}
                />
              )}
            </div>
          ))}
        </motion.div>

        {!reduceMotion && [0, 0.5, 1].map((delay, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${30 + i * 18}%`,
              top: `${75 + (i % 2) * 6}%`,
              zIndex: 2,
            }}
            animate={{
              y: [0, -6, 0],
              opacity: [0.4, 0.85, 0.4],
            }}
            transition={{ duration: 2.6, repeat: Infinity, delay, ease: 'easeInOut' }}
          >
            <Sparkles size={10} strokeWidth={1.6} style={{ color: 'var(--brand)' }} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ── 4) Strategie — Roadmap-Plan ─────────────────────────────────────── */

export function StrategieServiceVisual() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const reduceMotion = useReducedMotion()

  const phases = [
    { x: 26,  w: 60, label: 'Discovery', sub: 'Q1' },
    { x: 92,  w: 80, label: 'Plan',      sub: 'Q2' },
    { x: 178, w: 88, label: 'Execute',   sub: 'Q3' },
    { x: 272, w: 56, label: 'Handover',  sub: 'Q4' },
  ] as const

  const nowX = 150 // Heute-Marker zwischen Plan und Execute

  return (
    <div ref={ref} className="absolute inset-0 flex items-center justify-center" style={{ padding: '20px' }}>
      <svg viewBox="0 0 360 200" style={{ width: '100%', height: '100%', maxWidth: '380px' }}>
        <defs>
          <radialGradient id="strat-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"  stopColor="rgba(220, 128, 68, 0.30)" />
            <stop offset="100%" stopColor="rgba(220, 128, 68, 0)" />
          </radialGradient>
          <linearGradient id="phase-active" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"  stopColor="rgba(220, 128, 68, 0.45)" />
            <stop offset="100%" stopColor="rgba(220, 128, 68, 0.20)" />
          </linearGradient>
        </defs>

        {/* Plan-Paper Grid — feine Karos im Background */}
        <g stroke="rgba(245, 245, 250, 0.04)" strokeWidth="0.5">
          {[24, 48, 72, 96, 120, 144, 168, 192].map(y => (
            <line key={y} x1="0" y1={y} x2="360" y2={y} />
          ))}
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={i} x1={30 * (i + 1)} y1="0" x2={30 * (i + 1)} y2="200" />
          ))}
        </g>

        <circle cx="180" cy="100" r="90" fill="url(#strat-glow)" />

        {/* Header — ROADMAP · 2026 */}
        <text x="26" y="32"
          fill="rgba(245, 245, 250, 0.55)" fontSize="7"
          fontFamily="var(--font-mono)" letterSpacing="0.28em">
          ROADMAP · 2026
        </text>
        <line x1="26" y1="40" x2="334" y2="40"
          stroke="rgba(245, 245, 250, 0.10)" strokeWidth="0.6" />

        {/* Phase-Bars */}
        {phases.map((p, i) => {
          const isActive = i === 1 || i === 2
          const isPast   = i === 0
          return (
            <motion.g
              key={p.label}
              initial={{ opacity: 0, x: -4 }}
              animate={inView ? { opacity: 1, x: 0 } : undefined}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.55, delay: 0.2 + i * 0.12, ease: EASE }}
            >
              <rect
                x={p.x} y="64" width={p.w} height="22" rx="3"
                fill={isActive ? 'url(#phase-active)' : 'rgba(28, 27, 24, 0.78)'}
                stroke={isActive
                  ? 'rgba(220, 128, 68, 0.65)'
                  : isPast
                    ? 'rgba(40, 200, 64, 0.40)'
                    : 'rgba(245, 245, 250, 0.18)'}
                strokeWidth="0.8"
              />
              {/* Subtle progress fill für past phase */}
              {isPast && (
                <rect
                  x={p.x} y="64" width={p.w} height="22" rx="3"
                  fill="rgba(40, 200, 64, 0.10)"
                />
              )}
              <text
                x={p.x + p.w / 2} y="79"
                textAnchor="middle"
                fill={isActive ? '#DC8044' : 'rgba(245, 245, 250, 0.78)'}
                fontSize="7.5"
                fontFamily="var(--font-display)"
                fontWeight="600"
              >
                {p.label}
              </text>
              <text
                x={p.x + p.w / 2} y="100"
                textAnchor="middle"
                fill="rgba(245, 245, 250, 0.42)"
                fontSize="6"
                fontFamily="var(--font-mono)"
                letterSpacing="0.18em"
              >
                {p.sub}
              </text>
            </motion.g>
          )
        })}

        {/* Connection-Linien zwischen Phasen */}
        {phases.slice(0, -1).map((p, i) => {
          const next = phases[i + 1]
          return (
            <line
              key={i}
              x1={p.x + p.w} y1="75"
              x2={next.x}    y2="75"
              stroke="rgba(220, 128, 68, 0.55)"
              strokeWidth="1"
            />
          )
        })}

        {/* Heute-Marker — vertikale Brand-Linie */}
        <g>
          <line
            x1={nowX} y1="56" x2={nowX} y2="120"
            stroke="#DC8044" strokeWidth="1.4" strokeDasharray="2 2"
          />
          <polygon
            points={`${nowX - 4},54 ${nowX + 4},54 ${nowX},60`}
            fill="#DC8044"
          />
          <text x={nowX} y="48" textAnchor="middle"
            fill="#DC8044" fontSize="6"
            fontFamily="var(--font-mono)" letterSpacing="0.18em" fontWeight="700">
            HEUTE
          </text>
        </g>

        {/* Milestones — Diamond-Marker pro Phase */}
        {phases.map((p, i) => {
          const cx = p.x + p.w / 2
          const cy = 122
          const isActiveMilestone = i === 1 || i === 2
          return (
            <motion.g
              key={`m-${i}`}
              initial={{ opacity: 0, y: 4 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.4, delay: 0.6 + i * 0.12, ease: EASE }}
            >
              {/* Diamond */}
              <g transform={`translate(${cx} ${cy}) rotate(45)`}>
                <rect
                  x="-3.5" y="-3.5" width="7" height="7"
                  fill={isActiveMilestone ? '#DC8044' : 'rgba(15, 14, 12, 0.95)'}
                  stroke="#DC8044" strokeWidth="1.2"
                />
              </g>
              {!reduceMotion && i === 2 && (
                <motion.circle
                  cx={cx} cy={cy} r="5"
                  fill="none" stroke="#DC8044" strokeWidth="0.8"
                  animate={{ r: [5, 13], opacity: [0.55, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                />
              )}
            </motion.g>
          )
        })}

        {/* Baseline */}
        <line x1="26" y1="122" x2="334" y2="122"
          stroke="rgba(245, 245, 250, 0.10)" strokeWidth="0.6" />

        {/* Status-Row unten */}
        <text x="26" y="148"
          fill="rgba(245, 245, 250, 0.45)" fontSize="6"
          fontFamily="var(--font-mono)" letterSpacing="0.20em">
          STATUS · ON TRACK
        </text>
        <g transform="translate(108 144)">
          <circle r="2" fill="#28C840" />
        </g>

        {/* Zielbild-Box rechts unten */}
        <motion.g
          initial={{ opacity: 0, scale: 0.85 }}
          animate={inView ? { opacity: 1, scale: 1 } : undefined}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.6, delay: 1.2, ease: EASE }}
          style={{ transformOrigin: '305px 162px' }}
        >
          <rect
            x="278" y="140" width="56" height="42" rx="5"
            fill="rgba(15, 14, 12, 0.95)"
            stroke="rgba(220, 128, 68, 0.55)" strokeWidth="1"
          />
          <foreignObject x="295" y="148" width="14" height="14">
            <Target size={14} strokeWidth={1.8} style={{ color: 'var(--brand)' }} />
          </foreignObject>
          <text x="306" y="174" textAnchor="middle"
            fill="rgba(245, 245, 250, 0.85)" fontSize="6"
            fontFamily="var(--font-mono)" letterSpacing="0.18em">
            ZIELBILD
          </text>
        </motion.g>
      </svg>
    </div>
  )
}

/* ── Float-Wrapper ───────────────────────────────────────────────────── */

function FloatTile({
  children,
  style,
  delay,
  floatDelay,
  inView,
  reduceMotion,
}: {
  children:     React.ReactNode
  style:        React.CSSProperties
  delay:        number
  floatDelay:   number
  inView:       boolean
  reduceMotion: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reduceMotion) return
    const el = ref.current
    if (!el) return
    let raf = 0
    const start = performance.now() + floatDelay * 1000
    const tick = (now: number) => {
      const t = (now - start) / 1000
      const y = Math.sin(t * 0.85) * 4
      const r = Math.sin(t * 0.6) * 0.6
      el.style.transform = `translateY(${y}px) rotate(${r}deg)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduceMotion, floatDelay])

  return (
    <motion.div
      style={style}
      initial={reduceMotion ? false : { opacity: 0, scale: 0.85, y: 14 }}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : undefined}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      <div ref={ref}>{children}</div>
    </motion.div>
  )
}
