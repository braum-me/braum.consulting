import type { MetadataRoute } from 'next'
import { SERVICES } from '@/lib/services'
import { POSTS, getAllTags, TAG_INDEX_MIN_POSTS } from '@/lib/posts'
import { CASES } from '@/lib/cases'
import { GLOSSARY } from '@/lib/glossary'

const SITE = 'https://braum.consulting'

/**
 * lastModified nur mit echtem Datum aus der Datenquelle (Post-Datum,
 * Case-updatedAt). Ohne belastbares Datum bleibt das Feld weg, statt ein
 * Build-Datum vorzutäuschen.
 */
function safeDate(value: string | undefined | null): Date | undefined {
  if (!value) return undefined
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? undefined : d
}

/** Macht aus einem relativen Asset-/Routen-Pfad eine absolute URL. */
function abs(path: string): string {
  return path.startsWith('http') ? path : SITE + path
}

interface Entry {
  path:            string
  priority:        number
  changeFrequency: 'weekly' | 'monthly' | 'yearly'
  lastModified?:   Date
  /** Optionale Schlüssel-/OG-Bilder für die Bilder-Sitemap. */
  images?:         string[]
}

export default function sitemap(): MetadataRoute.Sitemap {
  const internalPosts = POSTS.filter(p => p.kind === 'internal')
  // /blog ändert sich mit dem jüngsten Beitrag — echtes Datum, kein Build-Datum.
  const latestPostDate = safeDate(
    internalPosts.map(p => p.updated ?? p.date).sort().at(-1),
  )

  const staticRoutes: Entry[] = [
    // Homepage: gepflegtes OG-Hauptbild aus /public/og/main.webp
    { path: '/',             priority: 1.0,  changeFrequency: 'weekly', images: ['/og/main.webp'] },
    { path: '/lagebild',     priority: 0.95, changeFrequency: 'monthly', images: ['/lagebild/opengraph-image'] },
    // /lagebild/check + /termin bewusst NICHT in der Sitemap: solange der Funnel
    // coming-soon ist (WIZARD_LIVE/BOOKING_LIVE = false), sind sie noindex.
    // Beim Go-Live wieder aufnehmen.
    { path: '/leistungen',   priority: 0.9,  changeFrequency: 'monthly', images: ['/leistungen/opengraph-image'] },
    { path: '/cases',        priority: 0.9,  changeFrequency: 'monthly', images: ['/cases/opengraph-image'] },
    { path: '/blog',         priority: 0.85, changeFrequency: 'weekly',  lastModified: latestPostDate, images: ['/blog/opengraph-image'] },
    { path: '/methodik',     priority: 0.85, changeFrequency: 'monthly', images: ['/methodik/opengraph-image'] },
    { path: '/werkzeuge',                          priority: 0.75, changeFrequency: 'monthly', images: ['/werkzeuge/opengraph-image'] },
    { path: '/werkzeuge/ai-stack-fit',             priority: 0.85, changeFrequency: 'monthly', images: ['/werkzeuge/ai-stack-fit/opengraph-image'] },
    { path: '/werkzeuge/nis2-betroffenheit',       priority: 0.8,  changeFrequency: 'monthly', images: ['/werkzeuge/nis2-betroffenheit/opengraph-image'] },
    { path: '/werkzeuge/m365-migration-kosten',    priority: 0.8,  changeFrequency: 'monthly', images: ['/werkzeuge/m365-migration-kosten/opengraph-image'] },
    { path: '/werkzeuge/iso-27001-readiness',      priority: 0.8,  changeFrequency: 'monthly', images: ['/werkzeuge/iso-27001-readiness/opengraph-image'] },
    { path: '/werkzeuge/ki-readiness',             priority: 0.8,  changeFrequency: 'monthly', images: ['/werkzeuge/ki-readiness/opengraph-image'] },
    { path: '/werkzeuge/microsoft-365-oder-google-workspace', priority: 0.8, changeFrequency: 'monthly', images: ['/werkzeuge/microsoft-365-oder-google-workspace/opengraph-image'] },
    { path: '/werkzeuge/website-check',            priority: 0.8,  changeFrequency: 'monthly', images: ['/werkzeuge/website-check/opengraph-image'] },
    { path: '/werkzeuge/automatisierung-roi',      priority: 0.8,  changeFrequency: 'monthly', images: ['/werkzeuge/automatisierung-roi/opengraph-image'] },
    { path: '/werkzeuge/ki-dsgvo-check',           priority: 0.8,  changeFrequency: 'monthly', images: ['/werkzeuge/ki-dsgvo-check/opengraph-image'] },
    { path: '/werkzeuge/phishing-quiz',            priority: 0.8,  changeFrequency: 'monthly', images: ['/werkzeuge/phishing-quiz/opengraph-image'] },
    { path: '/werkzeuge/cyber-schaden',            priority: 0.8,  changeFrequency: 'monthly', images: ['/werkzeuge/cyber-schaden/opengraph-image'] },
    { path: '/werkzeuge/passwort-check',           priority: 0.8,  changeFrequency: 'monthly', images: ['/werkzeuge/passwort-check/opengraph-image'] },
    { path: '/lexikon',      priority: 0.7,  changeFrequency: 'monthly', images: ['/lexikon/opengraph-image'] },
    { path: '/ueber',        priority: 0.7,  changeFrequency: 'monthly', images: ['/ueber/opengraph-image'] },
    { path: '/kontakt',      priority: 0.8,  changeFrequency: 'yearly', images: ['/kontakt/opengraph-image'] },
    { path: '/sitemap-html', priority: 0.3,  changeFrequency: 'monthly' },
    { path: '/impressum',    priority: 0.2,  changeFrequency: 'yearly' },
    { path: '/datenschutz',  priority: 0.2,  changeFrequency: 'yearly' },
  ]

  const serviceRoutes: Entry[] = SERVICES.map(s => ({
    path:            `/leistungen/${s.slug}`,
    priority:        0.85,
    changeFrequency: 'monthly',
    images:          [`/leistungen/${s.slug}/opengraph-image`],
  }))

  const caseRoutes: Entry[] = CASES.map(c => ({
    path:            `/cases/${c.num}`,
    priority:        0.8,
    changeFrequency: 'monthly',
    lastModified:    safeDate(c.updatedAt),
    // Echtes Hero-/OG-Bild aus dem Case, sonst die dynamische OG-Route.
    images:          [c.image ?? `/cases/${c.num}/opengraph-image`],
  }))

  const lexikonRoutes: Entry[] = GLOSSARY.map(t => ({
    path:            `/lexikon/${t.slug}`,
    priority:        0.55,
    changeFrequency: 'monthly',
    images:          [`/lexikon/${t.slug}/opengraph-image`],
  }))

  const postRoutes: Entry[] = internalPosts
    .map(p => ({
      path:            `/blog/${p.slug}`,
      priority:        0.6,
      changeFrequency: 'monthly',
      lastModified:    safeDate(p.updated ?? p.date),
      // Echtes OG-Asset wenn gepflegt, sonst dynamische OG-Route.
      images:          [
        'ogImage' in p && p.ogImage ? p.ogImage : `/blog/${p.slug}/opengraph-image`,
      ],
    }))

  // Nur Tag-Seiten, die indexiert werden (siehe TAG_INDEX_MIN_POSTS).
  const tagRoutes: Entry[] = getAllTags()
    .filter(t => t.count >= TAG_INDEX_MIN_POSTS)
    .map(t => ({
      path:            `/blog/tag/${encodeURIComponent(t.tag)}`,
      priority:        0.5,
      changeFrequency: 'monthly',
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
    ...(r.lastModified ? { lastModified: r.lastModified } : {}),
    changeFrequency: r.changeFrequency,
    priority:        r.priority,
    ...(r.images && r.images.length > 0 ? { images: r.images.map(abs) } : {}),
  }))
}
