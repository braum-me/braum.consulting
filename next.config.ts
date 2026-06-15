import type { NextConfig } from 'next'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

// next.config.ts läuft VOR dem automatischen .env.local-Loading durch Next.
// Damit DEV_ORIGINS hier schon verfügbar ist, parsen wir .env.local manuell
// (ohne dotenv-Dependency) — sonst greift HMR-Cross-Origin-Block beim
// Dev-Zugriff aus dem LAN auf eine Dev-VM und Sections bleiben opacity 0.
const envLocal = resolve(process.cwd(), '.env.local')
if (existsSync(envLocal)) {
  for (const line of readFileSync(envLocal, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/i)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
}

/**
 * 301-Redirects der alten WordPress-Sitemap (braum.consulting Stand vor Mai 2026)
 * auf die neuen v2-Pfade. SEO-Erhalt: Rankings, Backlinks und alte Print-/
 * Visitenkarten-URLs landen auf der passenden neuen Surface.
 *
 * Strategie:
 *   • Klare 1:1 wo Inhalt direkt entspricht (Cases, Pages).
 *   • Thematisch wo Blog-Posts inhaltlich zu einer Leistung passen.
 *   • Fallback auf Container-Seite (/cases, /leistungen) wo kein direktes Ziel.
 *
 * Trailing-Slashes werden von Next automatisch gematcht (source ohne / matcht
 * beide Varianten).
 */
const REDIRECTS: Array<{ source: string; destination: string }> = [
  // ── Pages ─────────────────────────────────────────────────────────────
  { source: '/services',         destination: '/leistungen' },
  { source: '/aboutus',          destination: '/ueber' },
  { source: '/contact',          destination: '/kontakt' },
  { source: '/cookie-richtlinie', destination: '/datenschutz' },
  { source: '/links',            destination: '/' },
  { source: '/canva-test',       destination: '/' },

  // ── WordPress "our_services" → /leistungen ────────────────────────────
  { source: '/our_services',                 destination: '/leistungen' },
  { source: '/our_services/webshops',        destination: '/leistungen/marke' },
  { source: '/our_services/branding-design', destination: '/leistungen/marke' },
  { source: '/our_services/websites',        destination: '/leistungen/marke' },
  { source: '/our_services/beratung',        destination: '/leistungen/strategie' },

  // ── Showcase → Cases (Slug-Mapping) ───────────────────────────────────
  { source: '/showcase',                                destination: '/cases' },
  { source: '/showcase/jonathangruen',                  destination: '/cases/jonathan-gruen' },
  { source: '/showcase/steuerberater-daniel-schaefer',  destination: '/cases/steuerberater-schaefer' },
  { source: '/showcase/wolfswerk',                      destination: '/cases/wolfswerk' },
  { source: '/showcase/elektroberkel',                  destination: '/cases/elektro-berkel' },
  { source: '/showcase/holzbau-hintermeyer',            destination: '/cases/holzbau-hintermeyer' },
  { source: '/showcase/osteopathiefaust',               destination: '/cases/osteopathie-faust' },
  { source: '/showcase/heizungsbau-schmidt',            destination: '/cases/heizungsbau-schmidt' },
  { source: '/showcase/malerwerk',                      destination: '/cases/malerwerk-gaub' },
  { source: '/showcase/stewart-consult',                destination: '/cases/stewart-consult' },
  // Personal-Portfolio gehört thematisch zur Person, kein neuer Case
  { source: '/showcase/personalportfolio',              destination: '/ueber' },
  { source: '/showcase/personal-portfoliocv',           destination: '/ueber' },

  // ── Case-Kategorie-Archive → /cases ───────────────────────────────────
  { source: '/case_category/branding',     destination: '/cases' },
  { source: '/case_category/websites',     destination: '/cases' },
  { source: '/case_category/websiteaudit', destination: '/cases' },

  // ── Blog-Posts thematisch zu Leistungs-Seiten ─────────────────────────
  { source: '/seo-und-social-media-tipps-und-tricks',                                                          destination: '/leistungen/marke' },
  { source: '/warum-die-performance-ihrer-website-entscheidend-fuer-ihren-erfolg-ist',                         destination: '/leistungen/marke' },
  { source: '/wie-eine-professionelle-website-ihren-umsatz-steigert',                                          destination: '/leistungen/marke' },
  { source: '/social-media-fur-unternehmen-wie-kmu-mit-social-media-plattformen-erfolgreich-wachsen',          destination: '/leistungen/marke' },
  { source: '/onepager-vs-multi-page-design',                                                                  destination: '/leistungen/marke' },
  { source: '/seo-grundlagen-nutzen-und-kosten',                                                               destination: '/leistungen/marke' },
  { source: '/chatgpt-fuer-unternehmen',                                                                       destination: '/leistungen/ai' },
  { source: '/ki-revolutioniert-seo-warum-unternehmen-jetzt-ihre-sichtbarkeitsstrategie-ueberdenken-muessen',  destination: '/leistungen/ai' },
  { source: '/aenderungen-durch-iso-27001-20',                                                                 destination: '/leistungen/strategie' },
  { source: '/wordpress-sicherheit-warum-sie-sich-jetzt-darum-kuemmern-sollten',                               destination: '/leistungen/strategie' },
  // Intro-Post ohne klare Themen-Zuordnung → Blog-Übersicht
  { source: '/the-journey-begins',                                                                             destination: '/blog' },
]

const config: NextConfig = {
  output: 'standalone',
  // ── Perf / Hardening-Defaults ─────────────────────────────────────────
  // Gzip/Brotli für HTML/JSON-Responses (greift wenn nicht ohnehin von
  // Reverse-Proxy/Cloudflare übernommen — schadet doppelt nicht).
  compress: true,
  // X-Powered-By: Next.js raus — kein unnötiges Fingerprinting.
  poweredByHeader: false,
  // Dev-Indicator (rundes „N"-Overlay unten links) abschalten — reines
  // Dev-Artefakt, kollidierte im QA mit Mobile-Content. In Production
  // ohnehin nicht sichtbar; aus für saubere Dev-/QA-Screens.
  devIndicators: false,
  // Production-Builds ohne Source-Maps ausliefern (kleinere Payloads,
  // kein Code-Leak). Dev bleibt unberührt.
  productionBrowserSourceMaps: false,
  // Trailing-Slashes nicht auto-normalisieren — sonst macht Next aus alten
  // WordPress-URLs wie /foo/ zuerst ein 308 nach /foo, danach erst greift
  // unser Mapping (2 Hops). Mit skipTrailingSlashRedirect greifen unsere
  // expliziten Redirects (mit und ohne Slash) in einem Hop.
  skipTrailingSlashRedirect: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'stefanbraum.de' },
      { protocol: 'https', hostname: '**.stefanbraum.de' },
    ],
  },
  // Dev-Origins kommen aus ENV (kommagetrennt), damit lokale VM-IPs nicht
  // hartcodiert im Repo landen. Default: localhost + 127.0.0.1.
  // Beispiel .env.local: DEV_ORIGINS=10.0.0.1,localhost,127.0.0.1
  allowedDevOrigins: (process.env.DEV_ORIGINS ?? 'localhost,127.0.0.1')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean),
  async redirects() {
    // Pro Eintrag zwei Quellen registrieren (mit + ohne Trailing-Slash),
    // damit alte WordPress-URLs aus Google in einem Hop am Ziel landen
    // statt erst die Trailing-Slash-Normalisierung zu durchlaufen.
    return REDIRECTS.flatMap(r => [
      { source: r.source,        destination: r.destination, permanent: true },
      { source: r.source + '/',  destination: r.destination, permanent: true },
    ])
  },
  async headers() {
    // Defense-in-depth: Sicherheits-Header ergänzend zu Cloudflare-Settings.
    //
    // ── Content-Security-Policy: REPORT-ONLY (bewusste Entscheidung) ──────
    // Wir liefern die CSP als `Content-Security-Policy-Report-Only` aus, NICHT
    // enforced. Gründe:
    //   • Next.js (App Router/RSC), Motion und GSAP injizieren Inline-Styles
    //     und teils Inline-Bootstrap-Scripts ohne Nonce bei diesem Setup.
    //   • Three.js (@react-three/fiber) nutzt ggf. blob:-Worker.
    //   • Das externe Umami-Script und der Cal.com-Iframe laufen auf
    //     Hosts, die erst zur Laufzeit aus ENV kommen (NEXT_PUBLIC_UMAMI_*,
    //     CAL_EVENT_URL) — kein verlässlicher Build-Zeit-Wert.
    // Report-Only bricht nichts und gibt uns Violation-Reports, um die Policy
    // später gefahrlos auf enforced (`Content-Security-Policy`) zu heben.
    // Wo bekannt, ziehen wir die ENV-Hosts mit in die Policy, damit die
    // Report-Only-Phase realistisch ist.
    const hostOf = (url?: string) => {
      if (!url) return null
      try {
        return new URL(url).origin
      } catch {
        return null
      }
    }
    const umamiOrigin = hostOf(process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL)
    const calOrigin   = hostOf(process.env.CAL_EVENT_URL)

    const scriptSrc  = ["'self'", "'unsafe-inline'", 'blob:', umamiOrigin].filter(Boolean)
    const connectSrc = ["'self'", umamiOrigin].filter(Boolean)
    const frameSrc   = ["'self'", calOrigin].filter(Boolean)

    const csp = [
      "default-src 'self'",
      `script-src ${scriptSrc.join(' ')}`,
      "style-src 'self' 'unsafe-inline'",
      // img-src bewusst eng: nur self + data/blob (Blur-Placeholder, Canvas)
      // + der einzige bekannte Remote-Host (stefanbraum.de, siehe images.remotePatterns).
      // Kein offenes `https:`-Wildcard mehr. Enforce-Pfad: erst Report-Only-Phase
      // im Browser auswerten, dann auf `Content-Security-Policy` heben.
      "img-src 'self' data: blob: https://stefanbraum.de https://*.stefanbraum.de",
      "font-src 'self' data:",
      `connect-src ${connectSrc.join(' ')}`,
      `frame-src ${frameSrc.join(' ')}`,
      "worker-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
      'upgrade-insecure-requests',
    ].join('; ')

    const securityHeaders = [
      { key: 'X-Content-Type-Options',   value: 'nosniff' },
      // SAMEORIGIN statt DENY: erlaubt eigenes Framing/Vorschauen und ist mit
      // dem Cal.com-Iframe-Setup verträglich, blockt aber Fremd-Framing.
      { key: 'X-Frame-Options',          value: 'SAMEORIGIN' },
      { key: 'X-DNS-Prefetch-Control',   value: 'on' },
      { key: 'Referrer-Policy',          value: 'strict-origin-when-cross-origin' },
      // CSP vorerst Report-Only (siehe Begründung oben) — bricht nichts.
      { key: 'Content-Security-Policy-Report-Only', value: csp },
      // Strikte Default-Deny-Policy für Browser-APIs die wir nicht nutzen.
      // camera/microphone/geolocation/etc. komplett aus.
      {
        key:   'Permissions-Policy',
        value: [
          'accelerometer=()',
          'autoplay=()',
          'camera=()',
          'display-capture=()',
          'encrypted-media=()',
          'fullscreen=(self)',
          'geolocation=()',
          'gyroscope=()',
          'magnetometer=()',
          'microphone=()',
          'midi=()',
          'payment=()',
          'picture-in-picture=()',
          'publickey-credentials-get=()',
          'screen-wake-lock=()',
          'sync-xhr=()',
          'usb=()',
          'xr-spatial-tracking=()',
        ].join(', '),
      },
      // HSTS — 2 Jahre, mit Subdomains, preload-ready.
      // Wirkt erst bei HTTPS; auf HTTP-Antworten ignorieren Browser den Header.
      {
        key:   'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
      },
      // Cross-Origin-Opener: zukunftsfest für isolierte Browsing-Contexts.
      { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
    ]
    // Sensible, personenbezogene Inhalte (Briefings, Danke-Seite, Briefing-API)
    // dürfen weder vom Browser noch von Zwischen-Caches/CDN gespeichert werden.
    const noStore = [
      { key: 'Cache-Control', value: 'no-store, max-age=0, must-revalidate' },
    ]
    // Statische /public-Assets bekommen eine lange Cache-Control. Ohne sie
    // vergibt der CDN-Layer (Cloudflare) nur seine Default-TTL (~4h) — PageSpeed
    // „Effiziente Verweildauer im Cache". /assets (Logo, Brand) + /fonts ändern
    // sich praktisch nie → immutable/1 Jahr. /cases + /og können aktualisiert
    // werden → 30 Tage + stale-while-revalidate (bei gleichem Dateinamen sehen
    // wiederkehrende Besucher das alte Bild bis zu 30 Tagen — akzeptabel; bei
    // echtem Austausch Dateinamen ändern).
    const immutableYear = [
      { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
    ]
    const monthSWR = [
      { key: 'Cache-Control', value: 'public, max-age=2592000, stale-while-revalidate=604800' },
    ]
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      { source: '/briefing/:token*',  headers: noStore },
      { source: '/lagebild/danke',    headers: noStore },
      { source: '/api/briefing/:path*', headers: noStore },
      // Lange Caches für statische Assets aus /public
      { source: '/assets/:path*', headers: immutableYear },
      { source: '/fonts/:path*',  headers: immutableYear },
      { source: '/cases/:path*',  headers: monthSWR },
      { source: '/og/:path*',     headers: monthSWR },
    ]
  },
}

export default config
