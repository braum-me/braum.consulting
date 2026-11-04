'use client'

/**
 * Page-Transition via motion.div + AnimatePresence.
 *
 * Soft-Zoom Crossfade: alte Page fadet weg (scale 1→0.96, opacity 1→0),
 * neue Page kommt rein (scale 1.06→1, opacity 0→1). `mode="wait"`
 * vermeidet Doppel-Mount-Konflikt.
 *
 * SSR-safe weil: initial-state explicit als Object (kein Variant-String),
 * sodass motion v12 SSR den initial-state korrekt rendert.
 *
 * Initial-Load skippt die Animation (kein erstes Fade-In), damit
 * Mainpage-Hero seine eigene Word-Reveal-Animation sauber starten kann.
 */

import { useRef } from 'react'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

const DURATION = 0.5
const EASE = [0.32, 0.72, 0, 1] as const

export default function PageFade({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const initialPathnameRef = useRef<string | null>(null)
  const reduceMotion = useReducedMotion()

  if (initialPathnameRef.current === null) {
    initialPathnameRef.current = pathname
  }

  const isInitial = initialPathnameRef.current === pathname

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.main
        id="content"
        key={pathname}
        style={{ minHeight: '100vh', willChange: 'transform, opacity' }}
        initial={
          isInitial || reduceMotion
            ? false
            : { opacity: 0, scale: 1.04 }
        }
        animate={{ opacity: 1, scale: 1 }}
        exit={
          reduceMotion
            ? undefined
            : { opacity: 0, scale: 0.98, transition: { duration: 0.28, ease: EASE } }
        }
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: DURATION, ease: EASE }
        }
      >
        {children}
      </motion.main>
    </AnimatePresence>
  )
}
