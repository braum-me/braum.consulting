'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

/**
 * Client-Only Wrapper für alle non-critical UI-Komponenten.
 * Wird einmal in app/layout.tsx (Server-Component) gemountet.
 *
 * Lade-Strategie (Initial Load + INP schonen, ohne Desktop-Wirkung zu nehmen):
 *
 *   sofort        — leichtgewichtig oder funktional/rechtlich relevant
 *                   (ShareToast, ScrollProgress, PrivacyNotice, Umami, WebVitals)
 *   nach Idle/    — auf allen Geräten, aber erst wenn der Main-Thread frei ist
 *   Interaktion     bzw. der User das erste Mal interagiert
 *                   (CommandPalette, PaletteFloatingButton, EasterEggs)
 *   nur Desktop   — reine Pointer-/Motion-Deko, die auf Touch ohnehin no-opt.
 *   (pointer:fine)  Hier wird der Chunk auf Mobile gar nicht erst geladen.
 *                   (ParticleField, MagneticCursor, CardTilt)
 *
 * Jeder dynamic-Call bleibt ein eigener Chunk (`ssr: false`). Durch das
 * conditional Rendering wird der Chunk erst angefordert, wenn die Bedingung
 * erfüllt ist — auf Touch-Geräten also nie für die Desktop-Deko.
 */

const ParticleField         = dynamic(() => import('@/components/ui/ParticleField'),         { ssr: false })
const MagneticCursor        = dynamic(() => import('@/components/ui/MagneticCursor'),        { ssr: false })
const EasterEggs            = dynamic(() => import('@/components/ui/EasterEggs'),            { ssr: false })
const ScrollProgress        = dynamic(() => import('@/components/ui/ScrollProgress'),        { ssr: false })
const CommandPalette        = dynamic(() => import('@/components/ui/CommandPalette'),        { ssr: false })
const PaletteFloatingButton = dynamic(() => import('@/components/ui/PaletteFloatingButton'), { ssr: false })
const CardTilt              = dynamic(() => import('@/components/ui/CardTilt'),              { ssr: false })
const PrivacyNotice         = dynamic(() => import('@/components/layout/PrivacyNotice'),     { ssr: false })
const Umami                 = dynamic(() => import('@/components/analytics/Umami'),          { ssr: false })
const WebVitals             = dynamic(() => import('@/components/analytics/WebVitals'),      { ssr: false })
const ShareToast            = dynamic(() => import('@/components/ui/ShareToast'),            { ssr: false })

/**
 * true, sobald der Browser idle ist ODER der User zum ersten Mal interagiert.
 * Verhindert, dass non-critical Chunks mit der initialen Hydration konkurrieren.
 */
function useDeferredMount(): boolean {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let fired = false
    const trigger = () => {
      if (fired) return
      fired = true
      setReady(true)
    }

    const events: (keyof WindowEventMap)[] = [
      'pointerdown',
      'keydown',
      'touchstart',
      'wheel',
      'scroll',
    ]
    events.forEach(e => window.addEventListener(e, trigger, { once: true, passive: true }))

    // requestIdleCallback wo verfügbar (alle modernen Browser, Safari ab 16.4),
    // sonst setTimeout-Fallback. `in`-Check für die Safari-Lücke.
    const hasRic = 'requestIdleCallback' in window
    const idleId = hasRic
      ? window.requestIdleCallback(trigger, { timeout: 2500 })
      : window.setTimeout(trigger, 1500)

    return () => {
      events.forEach(e => window.removeEventListener(e, trigger))
      if (hasRic) window.cancelIdleCallback(idleId)
      else clearTimeout(idleId)
    }
  }, [])

  return ready
}

/**
 * true nur auf Geräten mit präzisem Pointer (Maus/Trackpad) und ohne
 * prefers-reduced-motion. Gate für die reine Pointer-/Motion-Deko, die auf
 * Touch ohnehin früh aussteigt — so wird ihr Chunk dort nie geladen.
 */
function usePointerFine(): boolean {
  const [fine, setFine] = useState(false)

  useEffect(() => {
    const noReduce = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setFine(window.matchMedia('(pointer: fine)').matches && noReduce)
  }, [])

  return fine
}

export default function ClientChrome() {
  const deferred    = useDeferredMount()
  const pointerFine = usePointerFine()
  const desktopFx   = deferred && pointerFine

  return (
    <>
      {/* sofort */}
      <ShareToast />
      <ScrollProgress />
      <PrivacyNotice />
      <Umami />
      <WebVitals />

      {/* nach Idle/Interaktion — alle Geräte */}
      {deferred && <CommandPalette />}
      {deferred && <PaletteFloatingButton />}
      {deferred && <EasterEggs />}

      {/* nach Idle + nur Desktop/pointer:fine (auf Touch no-opt → Chunk gespart) */}
      {desktopFx && <ParticleField />}
      {desktopFx && <MagneticCursor />}
      {desktopFx && <CardTilt />}
    </>
  )
}
