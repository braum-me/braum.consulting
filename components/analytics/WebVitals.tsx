'use client'

import { useReportWebVitals } from 'next/web-vitals'
import { reportVital } from '@/lib/analytics'

/**
 * Real-User-Monitoring (RUM) der Core Web Vitals → Umami.
 *
 * Nutzt Next 16 `useReportWebVitals` und schickt LCP/CLS/INP/FCP/TTFB über
 * `reportVital` aus `@/lib/analytics` an Umami. Opt-Out-aware und throw-safe
 * — die gesamte Opt-Out-/No-op-Logik lebt in `reportVital`/`trackEvent`,
 * identisch zur Umami-Komponente.
 *
 * Next liefert über denselben Callback auch eigene Custom-Metriken
 * (`Next.js-hydration`, `Next.js-route-change-to-render`, `Next.js-render`).
 * Die sind keine Web Vitals und haben kein `rating` — wir filtern sie raus
 * und melden nur die fünf Standard-Metriken.
 *
 * Render-frei (kein DOM) — wird in ClientChrome neben Umami gemountet.
 */

const CORE_VITALS = new Set(['LCP', 'CLS', 'INP', 'FCP', 'TTFB'])

export default function WebVitals() {
  useReportWebVitals((metric) => {
    if (!CORE_VITALS.has(metric.name)) return
    // `rating` ist Teil des web-vitals-Metric, fehlt aber im Next-Typ —
    // defensiv auslesen statt casten.
    const rating = (metric as { rating?: string }).rating
    reportVital(metric.name, metric.value, rating)
  })

  return null
}
