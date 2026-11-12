'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
      // Hash-Links (#lotsenprinzip etc.) sauber smooth-scrollen lassen, statt
      // dass der native Sprung mit Lenis kollidiert (= Ruckeln/kein Scroll).
      // Offset für die fixe Header-Höhe.
      anchors: { offset: -96 },
      // Eigener rAF-Loop von Lenis statt gsap.ticker: GSAP + ScrollTrigger
      // (~45 KB gzip) werden so nur noch auf der Startseite geladen, wo
      // Process/SzenarienStrip sie brauchen. Lenis scrollt das native
      // Fenster, ScrollTrigger bekommt die Scroll-Events direkt.
      autoRaf: true,
    })

    return () => {
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
