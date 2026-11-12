'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import { createBeforeSend } from '@/lib/analytics'

/**
 * Lädt das self-hosted Umami-Script — respektiert einen lokalen Opt-Out:
 *
 *   localStorage.setItem('braum.analytics-opt-out', '1')
 *
 * Damit kann jeder Besucher die Reichweitenmessung deaktivieren
 * (Widerspruchsrecht nach Art. 21 DSGVO). Wird auch vom Schalter im
 * `PrivacyNotice` gesetzt.
 *
 * Außerdem:
 * - Vor jedem Versand kürzt `braumUmamiBeforeSend` URL und Referrer auf den
 *   Pfad plus `utm_*` (Werkzeug-Antworten, Ergebnisse, Tokens stehen sonst im
 *   Query und würden mitgeschickt) und verwirft doppelte Seitenaufrufe.
 * - `data-domains`: gezählt wird nur auf der Produktiv-Domain, nicht lokal.
 * - In automatisierten Browsern (`navigator.webdriver`) lädt das Script nicht,
 *   damit Tests keine Besuche erzeugen.
 */
const DOMAINS = 'braum.consulting,www.braum.consulting'
export const OPT_OUT_KEY = 'braum.analytics-opt-out'

export default function Umami() {
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID
  const scriptUrl = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL

  const [optedOut, setOptedOut] = useState<boolean | null>(null)

  useEffect(() => {
    window.braumUmamiBeforeSend = createBeforeSend(window.location.hostname)
    if (navigator.webdriver) {
      setOptedOut(true)
      return
    }
    try {
      setOptedOut(window.localStorage.getItem(OPT_OUT_KEY) === '1')
    } catch {
      setOptedOut(false)
    }
  }, [])

  if (!websiteId || !scriptUrl) return null
  // Vor Mount-Check NICHT laden — verhindert kurzes Aufflackern des Scripts
  // bei aktivem Opt-Out.
  if (optedOut !== false) return null

  return (
    <Script
      src={scriptUrl}
      data-website-id={websiteId}
      // Respektiert den Do-Not-Track-Header des Browsers. Umami ist ohnehin
      // cookieless (kein localStorage/Cookie-Identifier), DNT macht den
      // „kein Tracking"-Anspruch aus PrivacyNotice/Datenschutz explizit.
      data-do-not-track="true"
      data-before-send="braumUmamiBeforeSend"
      data-domains={DOMAINS}
      strategy="afterInteractive"
      defer
    />
  )
}
