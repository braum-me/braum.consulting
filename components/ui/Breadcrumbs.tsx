import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'

const SITE_URL = 'https://braum.consulting'

export interface Crumb {
  /** Sichtbares Label, Sentence-Case. */
  label: string
  /** Pfad relativ zur Root (z. B. `/leistungen`). Letzter Eintrag ohne href = aktuelle Seite. */
  href?: string
}

interface BreadcrumbsProps {
  /** Krümel ohne „Start" — der wird automatisch vorangestellt. */
  items: Crumb[]
  className?: string
  /** Rendert zusätzlich das BreadcrumbList-JSON-LD. Nur setzen, wenn die
   *  Page nicht ohnehin schon ein eigenes BreadcrumbList-Schema ausgibt. */
  withJsonLd?: boolean
}

/**
 * Dezente Krümelnavigation: Start → Bereich → Seite. Mono, klein, Brand-Akzent.
 * Letzter Eintrag ist nicht verlinkt und trägt `aria-current="page"`.
 *
 * `Start` (→ `/`) wird immer automatisch als erster Krümel gesetzt, damit
 * Aufrufer nur den seiten-spezifischen Pfad übergeben müssen.
 */
export default function Breadcrumbs({
  items,
  className,
  withJsonLd = false,
}: BreadcrumbsProps) {
  // „Start" immer vorne dran.
  const crumbs: Crumb[] = [{ label: 'Start', href: '/' }, ...items]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    // Crumbs ohne href (= aktuelle Seite) lassen `item` weg — Schema.org/Google
    // erlauben das für den letzten Eintrag. Sonst würde die Start-URL dupliziert.
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: `${SITE_URL}${c.href}` } : {}),
    })),
  }

  return (
    <>
      {withJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <nav
        aria-label="Breadcrumb"
        className={cn('font-mono uppercase', className)}
        style={{
          fontSize: '11px',
          letterSpacing: '0.16em',
        }}
      >
        <ol
          className="flex flex-wrap items-center"
          style={{ listStyle: 'none', padding: 0, margin: 0, gap: '8px' }}
        >
          {crumbs.map((c, i) => {
            const isLast = i === crumbs.length - 1
            return (
              <li key={`${c.label}-${i}`} className="flex items-center" style={{ gap: '8px' }}>
                {i > 0 && (
                  <ChevronRight
                    size={11}
                    strokeWidth={1.6}
                    aria-hidden
                    style={{ color: 'var(--fg-subtle)', opacity: 0.7 }}
                  />
                )}
                {isLast || !c.href ? (
                  <span aria-current="page" style={{ color: 'var(--fg-muted)' }}>
                    {c.label}
                  </span>
                ) : (
                  <Link
                    href={c.href}
                    data-cursor="link"
                    className="transition-colors duration-220 hover:text-[color:var(--brand)]"
                    style={{ color: 'var(--fg-subtle)' }}
                  >
                    {c.label}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
