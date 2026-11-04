/**
 * Umami-Event-Tracking — sicherer Wrapper für window.umami.track().
 *
 * Respektiert den localStorage-Opt-Out (siehe components/analytics/Umami).
 * Throw-safe: wenn Umami nicht geladen oder Browser-API nicht da, no-op.
 *
 * Verwendung:
 *   import { trackEvent } from '@/lib/analytics'
 *   trackEvent('lagebild_step_view', { step: 3, total: 8 })
 */

declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: Record<string, unknown>) => void
    }
  }
}

const OPT_OUT_KEY = 'braum.analytics-opt-out'

export function trackEvent(name: string, props?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return
  try {
    if (window.localStorage.getItem(OPT_OUT_KEY) === '1') return
  } catch {
    /* localStorage blocked */
  }
  try {
    window.umami?.track(name, props)
  } catch {
    /* umami not loaded, ignore */
  }
}

/**
 * Web-Vitals (RUM) → Umami.
 *
 * Schickt ein einzelnes Core-Web-Vital (LCP/CLS/INP/FCP/TTFB) als Event an
 * Umami. Nutzt dieselbe Opt-Out-/Throw-safe-Logik wie `trackEvent` — bei
 * Opt-Out oder fehlendem Umami ein No-op.
 *
 * Werte werden sinnvoll gerundet: CLS ist ein Layout-Shift-Score (kleine
 * Dezimalzahl, 4 Nachkommastellen), alle übrigen Metriken sind Millisekunden
 * (auf ganze ms gerundet).
 *
 * Event-Name: `web-vital` mit { name, value, rating }.
 */
export function reportVital(
  name: string,
  value: number,
  rating?: string,
): void {
  if (typeof window === 'undefined') return
  // CLS ist unitless (Score), Rest sind Millisekunden.
  const rounded =
    name === 'CLS' ? Math.round(value * 10000) / 10000 : Math.round(value)
  trackEvent('web-vital', {
    name,
    value: rounded,
    ...(rating ? { rating } : {}),
  })
}

/**
 * Zentrale, typisierte Event-Namen — Single Source of Truth, damit
 * Komponenten keine String-Literals streuen (Typos brechen sonst still die
 * Auswertung). `as const` macht jeden Wert zu einem Literal-Type.
 *
 * Verwendung:
 *   import { trackEvent, EVENTS } from '@/lib/analytics'
 *   trackEvent(EVENTS.ctaLagebild, { source: 'hero' })
 *
 * Erweitern statt umbenennen — bestehende String-Calls bleiben gültig,
 * trackEvent nimmt weiterhin beliebige Strings entgegen.
 */
export const EVENTS = {
  // ── CTAs ────────────────────────────────────────────────────────────
  ctaLagebild:  'cta_lagebild',
  ctaKontakt:   'cta_kontakt',
  ctaTermin:    'cta_termin',

  // ── Lagebild-Funnel ─────────────────────────────────────────────────
  funnelStart:    'lagebild_start',
  funnelStepView: 'lagebild_step_view',
  funnelComplete: 'lagebild_complete',
  funnelAbandon:  'lagebild_abandon',

  // ── Kontaktformular ─────────────────────────────────────────────────
  contactSubmit:  'kontakt_submit',
  contactSuccess: 'kontakt_success',
  contactError:   'kontakt_error',

  // ── Inhalte / Sharing ───────────────────────────────────────────────
  share:          'share',
  commandPalette: 'command_palette_open',
  outboundLink:   'outbound_link',
} as const

/** Union aller bekannten, typisierten Event-Namen. */
export type EventName = (typeof EVENTS)[keyof typeof EVENTS]
