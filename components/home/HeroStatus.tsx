'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { getCurrentSlotQuarter, type SlotInfo } from '@/lib/quarter'
import {
  getHeroStatusEngagements,
  getCapacity,
  STATE_COLOR_VAR,
  STATE_LABEL,
} from '@/lib/engagements'

const EASE = [0.16, 1, 0.3, 1] as const

const GLASS_BASE: React.CSSProperties = {
  background:
    'linear-gradient(145deg, rgba(242, 240, 235, 0.10) 0%, rgba(242, 240, 235, 0.03) 100%)',
  border: '1px solid rgba(242, 240, 235, 0.16)',
  backdropFilter: 'blur(28px) saturate(160%)',
  WebkitBackdropFilter: 'blur(28px) saturate(160%)',
  borderRadius: 'var(--r-md)',
  boxShadow:
    'inset 0 1px 0 rgba(242, 240, 235, 0.14), inset 0 -1px 0 rgba(0, 0, 0, 0.30), 0 24px 48px -16px rgba(0, 0, 0, 0.55), 0 8px 24px -8px rgba(0, 0, 0, 0.40)',
}

export default function HeroStatus() {
  const reduce = useReducedMotion()
  // Slot-Berechnung ist abhängig vom aktuellen Datum → würde server-side
  // (UTC) und client-side (User-TZ) unterschiedliche Werte liefern und
  // Hydration-Mismatch werfen. Deshalb erst nach Mount setzen.
  const [slot, setSlot] = useState<SlotInfo | null>(null)
  useEffect(() => {
    setSlot(getCurrentSlotQuarter())
  }, [])

  const engagements   = getHeroStatusEngagements()
  const capacity      = getCapacity()
  const CAPACITY = {
    filled: capacity.filled,
    total:  capacity.total,
    label:  capacity.label,
    sub:    slot
      ? `nächster Engagement-Start · ${slot.label}`
      : 'nächster Engagement-Start',
  }

  return (
    <motion.div
      className="flex w-full max-w-[420px] flex-col gap-4 md:max-w-[440px]"
      initial={reduce ? false : { opacity: 0, x: 28 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.9, delay: 0.9, ease: EASE }}
    >
      {/* Laufende Projekte */}
      <div className="relative overflow-hidden p-6 md:p-7" style={GLASS_BASE}>
        {/* Top specular highlight */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(242, 240, 235, 0.45) 50%, transparent 100%)',
          }}
        />
        {/* Subtle neutral bloom top-left — kein Orange, damit der
            HeroStatus auch vor warmem Background lesbar bleibt */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(80% 70% at 0% 0%, rgba(242, 240, 235, 0.06) 0%, transparent 60%)',
          }}
        />
        {/* Subtle inner edge */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            borderRadius: 'inherit',
            boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.04)',
          }}
        />

        <div className="relative">
          <div className="flex items-center gap-2.5">
            <span className="relative inline-flex h-2 w-2">
              <span
                aria-hidden
                className="absolute inset-0 animate-ping"
                style={{
                  background: 'var(--success-fg)',
                  borderRadius: 'var(--r-pill)',
                  opacity: 0.5,
                }}
              />
              <span
                className="relative inline-block h-2 w-2"
                style={{
                  background: 'var(--success-fg)',
                  borderRadius: 'var(--r-pill)',
                  boxShadow: '0 0 10px rgba(108, 176, 130, 0.6)',
                }}
              />
            </span>
            <p
              className="font-mono uppercase"
              style={{
                fontSize: 'var(--t-micro)',
                letterSpacing: 'var(--tr-eyebrow)',
                color: 'var(--fg-default)',
              }}
            >
              Laufende Projekte
            </p>
          </div>

          <ul className="mt-6 space-y-3.5">
            {engagements.map((e, i) => {
              const dotColor = e.highlight ? 'var(--accent)' : STATE_COLOR_VAR[e.state]
              const dotGlow  = e.highlight ? 'rgba(220, 128, 68, 0.6)' : dotColor
              const label    = e.detail
                ? e.detail
                : e.highlight
                ? 'aktiv'
                : STATE_LABEL[e.state]
              return (
                <motion.li
                  key={`${e.project}-${e.client}`}
                  className="flex items-center justify-between gap-4 border-b pb-3.5 last:border-b-0 last:pb-0"
                  style={{ borderColor: 'rgba(242, 240, 235, 0.08)' }}
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 1.1 + i * 0.08, ease: EASE }}
                >
                  <div className="min-w-0 flex-1">
                    <p
                      className="font-display font-semibold leading-tight"
                      style={{
                        fontSize: 'var(--t-body)',
                        color: 'var(--fg-default)',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {e.project}
                    </p>
                    <p
                      className="mt-1 font-mono uppercase"
                      style={{
                        fontSize: '10px',
                        letterSpacing: 'var(--tr-eyebrow)',
                        color: 'var(--fg-muted)',
                      }}
                    >
                      {e.client}
                    </p>
                  </div>
                  <span className="flex shrink-0 items-center gap-2">
                    {e.highlight ? (
                      <span className="relative inline-flex h-1.5 w-1.5">
                        <span
                          aria-hidden
                          className="absolute inset-0 animate-ping"
                          style={{
                            background: dotColor,
                            borderRadius: 'var(--r-pill)',
                            opacity: 0.5,
                          }}
                        />
                        <span
                          className="relative inline-block h-1.5 w-1.5"
                          style={{
                            background: dotColor,
                            borderRadius: 'var(--r-pill)',
                            boxShadow: `0 0 10px ${dotGlow}`,
                          }}
                        />
                      </span>
                    ) : (
                      <span
                        aria-hidden
                        className="inline-block h-1.5 w-1.5"
                        style={{
                          background: dotColor,
                          borderRadius: 'var(--r-pill)',
                          boxShadow: `0 0 8px ${dotGlow}`,
                        }}
                      />
                    )}
                    <span
                      className="font-mono uppercase"
                      style={{
                        fontSize: '10px',
                        color: 'var(--fg-muted)',
                        letterSpacing: 'var(--tr-eyebrow)',
                      }}
                    >
                      {label}
                    </span>
                  </span>
                </motion.li>
              )
            })}
          </ul>
        </div>
      </div>

      {/* Kapazität — neutrales Liquid-Glass, Orange-Akzent nur in der
          gefüllten Bar + im „X SLOTS FREI"-Label */}
      <motion.div
        className="relative overflow-hidden p-5 md:p-6"
        initial={reduce ? false : { opacity: 0, x: 28 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, delay: 1.25, ease: EASE }}
        style={GLASS_BASE}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(242, 240, 235, 0.40) 50%, transparent 100%)',
          }}
        />

        <div className="relative">
          <div className="flex items-baseline justify-between">
            <p
              className="font-mono uppercase"
              style={{
                fontSize: 'var(--t-micro)',
                letterSpacing: 'var(--tr-eyebrow)',
                color: 'var(--fg-default)',
              }}
            >
              Kapazität
            </p>
            <p
              className="font-mono uppercase"
              style={{
                fontSize: 'var(--t-micro)',
                color: 'var(--accent)',
                letterSpacing: 'var(--tr-eyebrow)',
                textShadow: '0 0 12px rgba(200, 98, 42, 0.5)',
              }}
            >
              {CAPACITY.label}
            </p>
          </div>

          <div className="mt-4 flex gap-2">
            {Array.from({ length: CAPACITY.total }).map((_, i) => (
              <motion.span
                key={i}
                className="h-2 flex-1"
                style={{
                  background:
                    i < CAPACITY.filled
                      ? 'var(--accent)'
                      : 'rgba(242, 240, 235, 0.12)',
                  borderRadius: 'var(--r-pill)',
                  boxShadow:
                    i < CAPACITY.filled
                      ? '0 0 16px rgba(200, 98, 42, 0.5)'
                      : 'none',
                }}
                initial={reduce ? false : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: 0.6,
                  delay: 1.4 + i * 0.10,
                  ease: EASE,
                }}
              />
            ))}
          </div>

          <p
            className="mt-3 font-mono"
            style={{
              fontSize: '10px',
              letterSpacing: '0.04em',
              color: 'var(--fg-muted)',
              textTransform: 'uppercase',
            }}
          >
            {CAPACITY.sub}
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}
