import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import LenisProvider from '@/components/providers/LenisProvider'
import ClientChrome from '@/components/layout/ClientChrome'
import PageFade from '@/components/layout/PageFade'
import './globals.css'

const akmorn = localFont({
  variable: '--font-akmorn',
  display: 'swap',
  // Weights 100/200/300 (+ italics) entfernt — werden nirgends im
  // CSS/JSX verwendet. Spart ~210 KB Font-Download.
  // font-bold (700) und font-black (900) fallen automatisch auf
  // ExtraBold (800) zurück, da kein eigenes 700/900-File existiert.
  src: [
    { path: '../public/fonts/akmorn/AkmornGrotesque-Regular.woff2',        weight: '400', style: 'normal' },
    { path: '../public/fonts/akmorn/AkmornGrotesque-Medium.woff2',         weight: '500', style: 'normal' },
    { path: '../public/fonts/akmorn/AkmornGrotesque-MediumItalic.woff2',   weight: '500', style: 'italic' },
    { path: '../public/fonts/akmorn/AkmornGrotesque-SemiBold.woff2',       weight: '600', style: 'normal' },
    { path: '../public/fonts/akmorn/AkmornGrotesque-SemiBoldItalic.woff2', weight: '600', style: 'italic' },
    { path: '../public/fonts/akmorn/AkmornGrotesque-ExtraBold.woff2',      weight: '800', style: 'normal' },
    { path: '../public/fonts/akmorn/AkmornGrotesque-ExtBdIta.woff2',       weight: '800', style: 'italic' },
  ],
})

const instrumentSerif = localFont({
  variable: '--font-instrument-serif',
  display: 'swap',
  src: [
    { path: '../public/fonts/instrument-serif/InstrumentSerif-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/instrument-serif/InstrumentSerif-Italic.woff2',  weight: '400', style: 'italic'  },
  ],
})


const SITE_URL = 'https://braum.consulting'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Braum Consulting · Digitales Handwerk für den Industriemittelstand',
    template: '%s · Braum Consulting',
  },
  description:
    'Digitaler Lotse für Mittelstand und Industrie. Marke, M365, AI & Automatisierung und digitale Transformation. Direkt mit Stefan Braum aus Sinntal im Main-Kinzig-Kreis (Hessen), mit Enterprise-IT-Erfahrung, ohne Agentur-Apparat.',
  keywords: [
    'Digitale Transformation Mittelstand',
    'Microsoft 365 Beratung',
    'KI & Automatisierung',
    'IT-Strategie Industrie',
    'Main-Kinzig-Kreis',
    'Hessen',
    'Sinntal',
    'Stefan Braum',
  ],
  applicationName: 'Braum Consulting',
  authors: [{ name: 'Stefan Braum' }],
  openGraph: {
    title: 'Braum Consulting',
    description: 'Digitales Handwerk für Unternehmen, die Substanz haben.',
    url: SITE_URL,
    siteName: 'Braum Consulting',
    locale: 'de_DE',
    type: 'website',
  },
  robots: { index: true, follow: true },
  manifest: '/manifest.webmanifest',
}

export const viewport: Viewport = {
  themeColor: '#0F0E0C',
  colorScheme: 'dark',
}

const ORGANIZATION_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': SITE_URL + '/#organization',
  name: 'Braum Consulting',
  url: SITE_URL,
  logo: SITE_URL + '/assets/logo/logo-04.svg',
  image: SITE_URL + '/assets/logo/logo-04.svg',
  description:
    'Digitaler Lotse für Mittelstand und Industrie. Marke, M365, AI & Automatisierung und digitale Transformation — aus Sinntal im Main-Kinzig-Kreis, Hessen.',
  founder: { '@id': SITE_URL + '/#person-stefan-braum' },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Schlüchterner Straße 31',
    postalCode: '36391',
    addressLocality: 'Sinntal',
    addressRegion: 'Hessen',
    addressCountry: 'DE',
  },
  areaServed: [
    { '@type': 'AdministrativeArea', name: 'Main-Kinzig-Kreis' },
    { '@type': 'State', name: 'Hessen' },
    { '@type': 'Country', name: 'Deutschland' },
    { '@type': 'Country', name: 'Österreich' },
    { '@type': 'Country', name: 'Schweiz' },
  ],
  serviceType: [
    'Digitale Transformation',
    'Microsoft 365 & Cloud',
    'KI & Automatisierung',
    'Marke, Website & Reichweite',
    'IT-Strategie & Security',
  ],
  email: 'info@braum.consulting',
  knowsAbout: [
    'Microsoft 365',
    'Entra ID',
    'SharePoint',
    'AI & Automatisierung',
    'Next.js',
    'Webentwicklung',
    'Digitale Strategie',
    'IT-Leitung',
  ],
}

const PERSON_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': SITE_URL + '/#person-stefan-braum',
  name: 'Stefan Braum',
  url: SITE_URL + '/ueber',
  jobTitle: 'IT-Leiter · Digital-Stratege · Operator',
  description:
    'Operator und digitaler Lotse für Mittelstand und Industrie. Marke, Microsoft 365, KI & Automatisierung und digitale Transformation aus einer Hand.',
  email: 'info@braum.consulting',
  sameAs: [
    'https://www.linkedin.com/in/stefanbraum',
    'https://github.com/braum-me',
    'https://www.xing.com/profile/Stefan_Braum',
    'https://stefanbraum.de',
    'https://cv.stefanbraum.de',
  ],
  worksFor: { '@id': SITE_URL + '/#organization' },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Sinntal',
    addressRegion: 'Hessen',
    addressCountry: 'DE',
  },
  areaServed: {
    '@type': 'Country',
    name: 'Deutschland',
  },
  knowsAbout: [
    'Microsoft 365',
    'Google Workspace',
    'KI',
    'Automatisierung',
    'IT-Security',
  ],
}

const WEBSITE_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': SITE_URL + '/#website',
  name: 'Braum Consulting',
  url: SITE_URL,
  inLanguage: 'de-DE',
  publisher: { '@id': SITE_URL + '/#organization' },
}

/**
 * Origin des zur Laufzeit nachgeladenen Umami-Scripts — für preconnect.
 * Wird aus NEXT_PUBLIC_UMAMI_SCRIPT_URL geparst (zur Build-Zeit inlined).
 * Nur ausgegeben, wenn die URL eine valide http(s)-Origin liefert; sonst
 * (leer/unparsebar in Dev) kein Link.
 *
 * Fonts brauchen KEIN preconnect: alle self-hosted via next/font/local
 * (kein Google-Fonts-CDN). Cal.com wird per <iframe> nur auf /termin und
 * /lagebild/danke geladen (CAL_EVENT_URL ist server-side, nicht NEXT_PUBLIC)
 * — daher kein globaler preconnect im Root-Head, das wäre auf allen anderen
 * Seiten verschwendet.
 */
function umamiOrigin(): string | null {
  const raw = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL
  if (!raw) return null
  try {
    const { origin, protocol } = new URL(raw)
    return protocol === 'https:' || protocol === 'http:' ? origin : null
  } catch {
    return null
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const analyticsOrigin = umamiOrigin()
  return (
    <html
      lang="de"
      className={[akmorn.variable, instrumentSerif.variable, GeistSans.variable, GeistMono.variable].join(' ')}
      suppressHydrationWarning
    >
      <head>
        {analyticsOrigin && (
          <>
            <link rel="preconnect" href={analyticsOrigin} crossOrigin="anonymous" />
            <link rel="dns-prefetch" href={analyticsOrigin} />
          </>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSONLD) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_JSONLD) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSONLD) }}
        />
      </head>
      <body className="antialiased">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:px-4 focus:py-2 focus:text-[13px] focus:font-body focus:font-semibold focus:rounded-[var(--r-sm)] focus:bg-[color:var(--accent)] focus:text-[color:var(--on-accent)] focus:shadow-[var(--sh-2)] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)] focus:ring-offset-2 focus:ring-offset-[color:var(--bg-base)]"
        >
          Zum Inhalt springen
        </a>
        <LenisProvider>
          <Nav />
          <PageFade>{children}</PageFade>
          <Footer />
        </LenisProvider>
        <ClientChrome />
      </body>
    </html>
  )
}
