import type { MetadataRoute } from 'next'
import { SERVICES } from '@/lib/services'
import { POSTS, getAllTags } from '@/lib/posts'
import { CASES } from '@/lib/cases'
import { GLOSSARY } from '@/lib/glossary'

const SITE = 'https://braum.consulting'

/**
 * Festes Build-/Stand-Datum für statische Seiten ohne eigenes Content-Datum
 * (Startseite, Leistungen, Methodik, Rechtstexte …). Bei größeren Relaunches
 * hochziehen. Content-Seiten (Blog, Cases) bekommen weiter unten ihr echtes
 * Datum aus der Datenquelle.
 */
const BUILD_DATE = new Date('2026-05-30')

/**
 * Parst ein ISO-Datum robust. Fällt bei fehlendem/ungültigem Wert auf das
 * Build-Datum zurück, damit nie ein „Invalid Date" in der Sitemap landet.
 */
function safeDate(value: string | undefined | null): Date {
  if (!value) return BUILD_DATE
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? BUILD_DATE : d
}

/**
 * Cases: bevorzugt das echte updatedAt (ISO, YYYY-MM-DD) aus den Case-Daten.
 * Fehlt es, Fallback auf den 31.12. des Case-Jahres — aber nie in der Zukunft:
 * auf das Build-Datum geclamped, falls das Jahr noch läuft. Ungültig/leer →
 * Build-Datum.
 */
function caseDate(c: { updatedAt?: string; year?: string }): Date {
  if (c.updatedAt) return safeDate(c.updatedAt)
  if (!c.year || !/^\d{4}$/.test(c.year)) return BUILD_DATE
  const d = new Date(`${c.year}-12-31`)
  if (Number.isNaN(d.getTime())) return BUILD_DATE
  return d > BUILD_DATE ? BUILD_DATE : d
}

/** Macht aus einem relativen Asset-/Routen-Pfad eine absolute URL. */
function abs(path: string): string {
  return path.startsWith('http') ? path : SITE + path
}

interface Entry {
  path:            string
  priority:        number
  changeFrequency: 'weekly' | 'monthly' | 'yearly'
  lastModified:    Date
  /** Optionale Schlüssel-/OG-Bilder für die Bilder-Sitemap. */
  images?:         string[]
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: Entry[] = [
    // Homepage: gepflegtes OG-Hauptbild aus /public/og/main.webp
    { path: '/',             priority: 1.0,  changeFrequency: 'weekly',  lastModified: BUILD_DATE, images: ['/og/main.webp'] },
    { path: '/lagebild',     priority: 0.95, changeFrequency: 'monthly', lastModified: BUILD_DATE, images: ['/lagebild/opengraph-image'] },
    // /lagebild/check + /termin bewusst NICHT in der Sitemap: solange der Funnel
    // coming-soon ist (WIZARD_LIVE/BOOKING_LIVE = false), sind sie noindex.
    // Beim Go-Live wieder aufnehmen.
    { path: '/leistungen',   priority: 0.9,  changeFrequency: 'monthly', lastModified: BUILD_DATE, images: ['/leistungen/opengraph-image'] },
    { path: '/cases',        priority: 0.9,  changeFrequency: 'monthly', lastModified: BUILD_DATE, images: ['/cases/opengraph-image'] },
    { path: '/blog',         priority: 0.85, changeFrequency: 'weekly',  lastModified: BUILD_DATE, images: ['/blog/opengraph-image'] },
    { path: '/methodik',     priority: 0.85, changeFrequency: 'monthly', lastModified: BUILD_DATE, images: ['/methodik/opengraph-image'] },
    { path: '/werkzeuge',                          priority: 0.75, changeFrequency: 'monthly', lastModified: BUILD_DATE, images: ['/werkzeuge/opengraph-image'] },
    { path: '/werkzeuge/ai-stack-fit',             priority: 0.85, changeFrequency: 'monthly', lastModified: BUILD_DATE, images: ['/werkzeuge/ai-stack-fit/opengraph-image'] },
    { path: '/werkzeuge/nis2-betroffenheit',       priority: 0.8,  changeFrequency: 'monthly', lastModified: BUILD_DATE, images: ['/werkzeuge/nis2-betroffenheit/opengraph-image'] },
    { path: '/werkzeuge/m365-migration-kosten',    priority: 0.8,  changeFrequency: 'monthly', lastModified: BUILD_DATE, images: ['/werkzeuge/m365-migration-kosten/opengraph-image'] },
    { path: '/werkzeuge/iso-27001-readiness',      priority: 0.8,  changeFrequency: 'monthly', lastModified: BUILD_DATE, images: ['/werkzeuge/iso-27001-readiness/opengraph-image'] },
    { path: '/werkzeuge/ki-readiness',             priority: 0.8,  changeFrequency: 'monthly', lastModified: BUILD_DATE, images: ['/werkzeuge/ki-readiness/opengraph-image'] },
    { path: '/werkzeuge/microsoft-365-oder-google-workspace', priority: 0.8, changeFrequency: 'monthly', lastModified: BUILD_DATE, images: ['/werkzeuge/microsoft-365-oder-google-workspace/opengraph-image'] },
    { path: '/werkzeuge/website-check',            priority: 0.8,  changeFrequency: 'monthly', lastModified: BUILD_DATE, images: ['/werkzeuge/website-check/opengraph-image'] },
    { path: '/werkzeuge/automatisierung-roi',      priority: 0.8,  changeFrequency: 'monthly', lastModified: BUILD_DATE, images: ['/werkzeuge/automatisierung-roi/opengraph-image'] },
    { path: '/werkzeuge/ki-dsgvo-check',           priority: 0.8,  changeFrequency: 'monthly', lastModified: BUILD_DATE, images: ['/werkzeuge/ki-dsgvo-check/opengraph-image'] },
    { path: '/werkzeuge/phishing-quiz',            priority: 0.8,  changeFrequency: 'monthly', lastModified: BUILD_DATE, images: ['/werkzeuge/phishing-quiz/opengraph-image'] },
    { path: '/werkzeuge/cyber-schaden',            priority: 0.8,  changeFrequency: 'monthly', lastModified: BUILD_DATE, images: ['/werkzeuge/cyber-schaden/opengraph-image'] },
    { path: '/werkzeuge/passwort-check',           priority: 0.8,  changeFrequency: 'monthly', lastModified: BUILD_DATE, images: ['/werkzeuge/passwort-check/opengraph-image'] },
    { path: '/lexikon',      priority: 0.7,  changeFrequency: 'monthly', lastModified: BUILD_DATE, images: ['/lexikon/opengraph-image'] },
    { path: '/ueber',        priority: 0.7,  changeFrequency: 'monthly', lastModified: BUILD_DATE, images: ['/ueber/opengraph-image'] },
    { path: '/kontakt',      priority: 0.8,  changeFrequency: 'yearly',  lastModified: BUILD_DATE, images: ['/kontakt/opengraph-image'] },
    { path: '/sitemap-html', priority: 0.3,  changeFrequency: 'monthly', lastModified: BUILD_DATE },
    { path: '/impressum',    priority: 0.2,  changeFrequency: 'yearly',  lastModified: BUILD_DATE },
    { path: '/datenschutz',  priority: 0.2,  changeFrequency: 'yearly',  lastModified: BUILD_DATE },
  ]

  const serviceRoutes: Entry[] = SERVICES.map(s => ({
    path:            `/leistungen/${s.slug}`,
    priority:        0.85,
    changeFrequency: 'monthly',
    lastModified:    BUILD_DATE,
    images:          [`/leistungen/${s.slug}/opengraph-image`],
  }))

  const caseRoutes: Entry[] = CASES.map(c => ({
    path:            `/cases/${c.num}`,
    priority:        0.8,
    changeFrequency: 'monthly',
    lastModified:    caseDate(c),
    // Echtes Hero-/OG-Bild aus dem Case, sonst die dynamische OG-Route.
    images:          [c.image ?? `/cases/${c.num}/opengraph-image`],
  }))

  const lexikonRoutes: Entry[] = GLOSSARY.map(t => ({
    path:            `/lexikon/${t.slug}`,
    priority:        0.55,
    changeFrequency: 'monthly',
    lastModified:    BUILD_DATE,
    images:          [`/lexikon/${t.slug}/opengraph-image`],
  }))

  const postRoutes: Entry[] = POSTS
    .filter(p => p.kind === 'internal')
    .map(p => ({
      path:            `/blog/${p.slug}`,
      priority:        0.6,
      changeFrequency: 'monthly',
      lastModified:    safeDate(p.date),
      // Echtes OG-Asset wenn gepflegt, sonst dynamische OG-Route.
      images:          [
        'ogImage' in p && p.ogImage ? p.ogImage : `/blog/${p.slug}/opengraph-image`,
      ],
    }))

  const tagRoutes: Entry[] = getAllTags().map(t => ({
    path:            `/blog/tag/${encodeURIComponent(t.tag)}`,
    priority:        0.5,
    changeFrequency: 'monthly',
    lastModified:    BUILD_DATE,
    images:          [`/blog/tag/${encodeURIComponent(t.tag)}/opengraph-image`],
  }))

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...caseRoutes,
    ...lexikonRoutes,
    ...postRoutes,
    ...tagRoutes,
  ].map(r => ({
    url:             SITE + r.path,
    lastModified:    r.lastModified,
    changeFrequency: r.changeFrequency,
    priority:        r.priority,
    ...(r.images && r.images.length > 0 ? { images: r.images.map(abs) } : {}),
  }))
}
