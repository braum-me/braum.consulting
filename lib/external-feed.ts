/**
 * Live-Feed-Anbindung an stefanbraum.de.
 *
 * Zieht den RSS-Feed (https://stefanbraum.de/rss.xml), parst ihn ohne
 * externe XML-Library (Regex auf den paar Tags reicht für valides RSS)
 * und liefert ExternalPost-Objekte zurück, die wie die internen Posts
 * konsumiert werden können.
 *
 * Statt einer kuratierten Cross-Link-Liste in lib/posts.ts sehen Besucher
 * jetzt alles, was Stefan auf seinem Blog veröffentlicht.
 *
 * Cache: 1h via next-fetch. Bei Fehler/Timeout → leere Liste, kein 500.
 */

import type { ExternalPost } from './posts'

const FEED_URL = 'https://stefanbraum.de/rss.xml'

interface RssItem {
  title:       string
  link:        string
  description: string
  pubDate:     string
  categories:  string[]
}

function unescapeXml(s: string): string {
  return s
    .replace(/&amp;/g,  '&')
    .replace(/&lt;/g,   '<')
    .replace(/&gt;/g,   '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
}

function slugFromUrl(url: string): string {
  try {
    const parts = new URL(url).pathname.split('/').filter(Boolean)
    return parts[parts.length - 1] ?? url
  } catch {
    return url
  }
}

function parseItems(xml: string): RssItem[] {
  const items: RssItem[] = []
  const itemRe = /<item>([\s\S]*?)<\/item>/g
  let m: RegExpExecArray | null

  while ((m = itemRe.exec(xml)) !== null) {
    const body = m[1]
    items.push({
      title:       unescapeXml(body.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim() ?? ''),
      link:                   body.match(/<link>([\s\S]*?)<\/link>/)?.[1]?.trim() ?? '',
      description: unescapeXml(body.match(/<description>([\s\S]*?)<\/description>/)?.[1]?.trim() ?? ''),
      pubDate:                body.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1]?.trim() ?? '',
      categories: [...body.matchAll(/<category>([\s\S]*?)<\/category>/g)].map(c => c[1].trim()),
    })
  }

  return items
}

/** Live aus stefanbraum.de/rss.xml. Sortiert desc nach Datum. */
export async function fetchStefanBraumPosts(): Promise<ExternalPost[]> {
  try {
    const res = await fetch(FEED_URL, {
      next: { revalidate: 3600 }, // 1h Cache
      headers: {
        'User-Agent': 'BraumConsulting-FeedReader/1.0 (+https://braum.consulting)',
        'Accept':     'application/rss+xml,application/xml,text/xml',
      },
    })
    if (!res.ok) return []

    const xml = await res.text()
    const items = parseItems(xml)

    return items
      .map<ExternalPost>(it => ({
        kind:    'external',
        slug:    slugFromUrl(it.link),
        title:   it.title,
        date:    new Date(it.pubDate).toISOString().slice(0, 10),
        excerpt: it.description,
        tags:    it.categories,
        source:  'stefanbraum.de',
        url:     it.link,
      }))
      .sort((a, b) => b.date.localeCompare(a.date))
  } catch {
    return []
  }
}
