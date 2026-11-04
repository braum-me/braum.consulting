/**
 * Server-Side OG-Image-Fetcher.
 *
 * Holt die og:image-URL aus einem externen Posts-HTML (z.B. stefanbraum.de).
 * Next-fetch-Cache mit 24h Revalidation, also kein Spam-Fetch bei jedem Render.
 *
 * Verwendung in Server-Components:
 *   const ogUrl = await getOgImage('https://stefanbraum.de/blog/abc/')
 *   // → 'https://stefanbraum.de/img/og/abc.png' oder null
 *
 * Damit Next/Image die externen Bilder ausliefern darf, müssen die Hostnames
 * in next.config.ts unter images.remotePatterns gewhitelisted sein.
 */

const OG_META_PATTERNS: RegExp[] = [
  /<meta\s+property=["']og:image["'][^>]*content=["']([^"']+)["']/i,
  /<meta\s+content=["']([^"']+)["'][^>]*property=["']og:image["']/i,
  /<meta\s+name=["']og:image["'][^>]*content=["']([^"']+)["']/i,
  /<meta\s+property=["']twitter:image["'][^>]*content=["']([^"']+)["']/i,
]

export async function getOgImage(sourceUrl: string): Promise<string | null> {
  try {
    const res = await fetch(sourceUrl, {
      next: { revalidate: 86400 }, // 24h Edge-Cache
      headers: {
        'User-Agent': 'BraumConsulting-OGFetcher/1.0 (+https://braum.consulting)',
        'Accept': 'text/html,application/xhtml+xml',
      },
    })

    if (!res.ok) return null
    const html = await res.text()

    for (const pattern of OG_META_PATTERNS) {
      const match = html.match(pattern)
      if (match?.[1]) {
        try {
          return new URL(match[1], sourceUrl).toString()
        } catch {
          return match[1]
        }
      }
    }

    return null
  } catch {
    return null
  }
}
