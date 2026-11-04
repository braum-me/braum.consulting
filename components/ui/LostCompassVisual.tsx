'use client'

/**
 * Lost-Compass für die 404-Page — die Needle dreht sich endlos,
 * findet keinen Norden. Charm-Boost auf der Fehlerseite.
 *
 * Respektiert prefers-reduced-motion: statt Endlos-Rotation eine
 * leicht gekippte Statik-Pose.
 */

import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { Compass } from 'lucide-react'

export function LostCompassVisual() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const reduceMotion = useReducedMotion()

  return (
    <div ref={ref} className="relative" style={{ width: '100%', maxWidth: 340 }}>
      <svg viewBox="0 0 240 240" style={{ width: '100%', height: 'auto' }}>
        <defs>
          <radialGradient id="lost-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"  stopColor="rgba(220, 128, 68, 0.40)" />
            <stop offset="100%" stopColor="rgba(220, 128, 68, 0)" />
          </radialGradient>
        </defs>

        {/* Background Glow */}
        <circle cx="120" cy="120" r="90" fill="url(#lost-glow)" />

        {/* Outer Ring */}
        <circle cx="120" cy="120" r="86"
          fill="none"
          stroke="rgba(245, 245, 250, 0.10)"
          strokeWidth="1"
        />

        {/* Rotating Dash-Ring */}
        {!reduceMotion ? (
          <motion.circle
            cx="120" cy="120" r="78"
            fill="none"
            stroke="rgba(220, 128, 68, 0.35)"
            strokeWidth="0.8"
            strokeDasharray="3 5"
            initial={{ rotate: 0 }}
            animate={inView ? { rotate: 360 } : undefined}
            style={{ transformOrigin: '120px 120px' }}
            transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
          />
        ) : (
          <circle cx="120" cy="120" r="78"
            fill="none" stroke="rgba(220, 128, 68, 0.35)"
            strokeWidth="0.8" strokeDasharray="3 5"
          />
        )}

        {/* Cardinal-Marks mit Labels */}
        {[
          { deg: 270, label: 'N' },
          { deg: 0,   label: 'O' },
          { deg: 90,  label: 'S' },
          { deg: 180, label: 'W' },
        ].map(({ deg, label }) => {
          const rad = (deg * Math.PI) / 180
          const x = 120 + 78 * Math.cos(rad)
          const y = 120 + 78 * Math.sin(rad)
          const tx = 120 + 64 * Math.cos(rad)
          const ty = 120 + 64 * Math.sin(rad)
          return (
            <g key={deg}>
              <circle cx={x} cy={y} r="2.5"
                fill={label === 'N' ? '#DC8044' : 'rgba(245, 245, 250, 0.45)'}
              />
              <text x={tx} y={ty + 3} textAnchor="middle"
                fill={label === 'N' ? '#DC8044' : 'rgba(245, 245, 250, 0.42)'}
                fontSize="9"
                fontFamily="var(--font-mono)" letterSpacing="0.20em">
                {label}
              </text>
            </g>
          )
        })}

        {/* Tick-Marks */}
        {Array.from({ length: 24 }).map((_, i) => {
          const deg = i * 15
          const rad = (deg * Math.PI) / 180
          const inner = 80
          const outer = 86
          const x1 = 120 + inner * Math.cos(rad)
          const y1 = 120 + inner * Math.sin(rad)
          const x2 = 120 + outer * Math.cos(rad)
          const y2 = 120 + outer * Math.sin(rad)
          return (
            <line
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="rgba(245, 245, 250, 0.20)"
              strokeWidth="0.6"
            />
          )
        })}

        {/* Lost Needle — dreht sich wild & endlos */}
        {!reduceMotion ? (
          <motion.g
            style={{ transformOrigin: '120px 120px' }}
            initial={{ rotate: 0 }}
            animate={inView ? { rotate: [0, 280, 120, 440, 200, 580] } : undefined}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          >
            {/* North-Spike (brand) */}
            <path
              d="M 120 120 L 116 80 L 120 60 L 124 80 Z"
              fill="#DC8044"
              stroke="rgba(0, 0, 0, 0.30)"
              strokeWidth="0.5"
            />
            {/* South-Spike (muted) */}
            <path
              d="M 120 120 L 116 160 L 120 180 L 124 160 Z"
              fill="rgba(245, 245, 250, 0.35)"
              stroke="rgba(0, 0, 0, 0.30)"
              strokeWidth="0.5"
            />
          </motion.g>
        ) : (
          <g transform="rotate(38 120 120)">
            <path d="M 120 120 L 116 80 L 120 60 L 124 80 Z" fill="#DC8044" />
            <path d="M 120 120 L 116 160 L 120 180 L 124 160 Z"
              fill="rgba(245, 245, 250, 0.35)" />
          </g>
        )}

        {/* Center-Hub */}
        <circle cx="120" cy="120" r="8"
          fill="rgba(15, 14, 12, 0.95)"
          stroke="#DC8044"
          strokeWidth="1.5"
        />
        <foreignObject x="111" y="111" width="18" height="18">
          <div className="flex items-center justify-center" style={{ width: 18, height: 18 }}>
            <Compass size={14} strokeWidth={1.8} style={{ color: 'var(--brand)' }} />
          </div>
        </foreignObject>

        {/* Pulse-Ring um Center */}
        {!reduceMotion && (
          <motion.circle
            cx="120" cy="120" r="8"
            fill="none"
            stroke="#DC8044"
            strokeWidth="0.8"
            animate={{ r: [10, 30], opacity: [0.5, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
          />
        )}

        {/* „LOST" Watermark unten */}
        <text x="120" y="222" textAnchor="middle"
          fill="rgba(245, 245, 250, 0.32)"
          fontSize="9"
          fontFamily="var(--font-mono)" letterSpacing="0.32em">
          LOST · NO NORTH
        </text>
      </svg>
    </div>
  )
}
