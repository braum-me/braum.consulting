import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import BlogHero from '@/components/sections/BlogHero'
import InternalPostsList from '@/components/sections/InternalPostsList'
import AccentGlow from '@/components/ui/AccentGlow'
import ItalicAccent from '@/components/ui/ItalicAccent'
import {
  getInternalPosts,
  getExternalPosts,
  getAllTags,
  type ExternalPost,
} from '@/lib/posts'
import { getOgImage } from '@/lib/og-fetch'

export const metadata: Metadata = {
  alternates: { canonical: '/blog' },
  title: 'Notizen',
  description:
    'Long-Form aus laufenden Engagements und Praxisreflexionen. Eigene Posts plus ausgewählte Cross-Links auf stefanbraum.de.',
}

const COGNAC       = '#A87553'
const COGNAC_LINE  = 'rgba(139, 90, 60, 0.15)'

const MONTHS_DE = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli',  'August',  'September', 'Oktober', 'November', 'Dezember',
] as const

function formatDateDE(iso: string): string {
  const d = new Date(iso + 'T00:00:00')
  return `${d.getDate()}. ${MONTHS_DE[d.getMonth()]} ${d.getFullYear()}`
}

function tagsForDisplay(tags: string[], max = 3): string {
  return tags.slice(0, max).map(t => t.toUpperCase()).join(' · ')
}

type ExternalWithOg = ExternalPost & { fetchedOg: string | null }

export default async function BlogPage() {
  // Internal-Posts kommen sync aus lib/posts.ts, Externe live aus
  // stefanbraum.de/rss.xml (1h-Cache). OG-Bilder für jedes externe Post
  // werden ebenfalls live geholt (24h-Cache).
  const internal = getInternalPosts()
  const tags = getAllTags()
  const external = await getExternalPosts()

  const externalWithOg: ExternalWithOg[] = await Promise.all(
    external.map(async (p) => ({
      ...p,
      fetchedOg: await getOgImage(p.url),
    })),
  )

  return (
    <>
      {/* Hero zeigt ausschließlich eigene Braum-Consulting-Posts.
          stefanbraum.de-Crosslinks bleiben der „Auch relevant"-Sektion vorbehalten. */}
      <BlogHero posts={internal} />

      {/* Sektion 2: Aus dem Engagement (eigene Posts) — kompakter Abstand zum Hero */}
      <section
        id="blog-posts"
        aria-label="Eigene Posts"
        style={{
          position: 'relative',
          overflow: 'hidden',
          maxWidth: '880px',
          margin: '0 auto',
          padding: '8px 24px 96px',
        }}
      >
        {/* Brand-Glow für Tiefe — dezent, oben-rechts wie auf der Startseite */}
        <AccentGlow position="top-right" intensity="low" />

        <p
          className="relative font-mono uppercase"
          style={{
            fontSize: '11px',
            letterSpacing: '0.18em',
            color: 'var(--brand)',
            marginBottom: '24px',
          }}
        >
          02 · Aus dem Engagement
        </p>

        <h2
          className="relative font-display font-bold"
          style={{
            fontSize: 'clamp(32px, 4vw, 44px)',
            lineHeight: 1.15,
            letterSpacing: 'var(--tr-display)',
            color: 'var(--fg-default)',
            maxWidth: '640px',
          }}
        >
          Long-Form rund um die <ItalicAccent>Praxis</ItalicAccent>.
        </h2>

        <p
          className="relative mt-4 font-body"
          style={{
            fontSize: '17px',
            lineHeight: 1.65,
            color: 'var(--fg-muted)',
            maxWidth: '640px',
          }}
        >
          Hier erscheint: Engagement-Methodik, Tool-Wahl, Veränderungen am
          Angebot und Lessons aus laufenden Mandaten. Anonymisiert, wo das
          Mandat es verlangt. Selten, dafür mit Substanz.
        </p>

        {/* Tag-Cloud — direkt vor den Posts, kompakte Discovery-Leiste */}
        {tags.length > 0 && (
          <div className="mt-10">
            <p
              className="font-mono uppercase"
              style={{
                fontSize: '10px',
                letterSpacing: '0.20em',
                color: 'var(--fg-subtle)',
                marginBottom: '12px',
              }}
            >
              Nach Tag stöbern
            </p>
            <ul
              className="flex flex-wrap gap-1.5"
              style={{ listStyle: 'none', padding: 0, margin: 0 }}
            >
              {/* „Alle" ist hier der aktive Zustand — diese Seite zeigt alle Tags. */}
              <li>
                <span
                  aria-current="page"
                  className="inline-flex items-center font-mono uppercase"
                  style={{
                    fontSize: '11px',
                    letterSpacing: '0.16em',
                    padding: '7px 14px',
                    border: '1px solid var(--accent)',
                    borderRadius: 'var(--r-pill)',
                    color: 'var(--on-accent)',
                    background: 'var(--accent)',
                  }}
                >
                  Alle
                </span>
              </li>
              {tags.map(({ tag, count }) => (
                <li key={tag}>
                  <Link
                    href={`/blog/tag/${encodeURIComponent(tag)}`}
                    data-cursor="link"
                    className="inline-flex items-center gap-1.5 font-mono uppercase transition-all duration-220 hover:border-[color:var(--brand)] hover:text-[color:var(--brand)]"
                    style={{
                      fontSize: '11px',
                      letterSpacing: '0.16em',
                      padding: '7px 12px',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--r-pill)',
                      color: 'var(--fg-muted)',
                      background: 'transparent',
                    }}
                  >
                    {tag}
                    <span style={{ opacity: 0.55, marginLeft: 2 }}>{count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <InternalPostsList posts={internal} />
      </section>

      {/* Sektion 3: Auch relevant: stefanbraum.de (Cross-Links) */}
      {external.length > 0 && (
        <section
          aria-label="Cross-Links zu stefanbraum.de"
          style={{
            maxWidth: '880px',
            margin: '0 auto',
            padding: '96px 24px',
            borderTop: `1px solid ${COGNAC_LINE}`,
          }}
        >
          <p
            className="font-mono uppercase"
            style={{
              fontSize: '11px',
              letterSpacing: '0.18em',
              color: COGNAC,
              marginBottom: '24px',
            }}
          >
            03 · Auch relevant
          </p>

          <h2
            className="font-display font-bold"
            style={{
              fontSize: 'clamp(32px, 4vw, 44px)',
              lineHeight: 1.15,
              letterSpacing: 'var(--tr-display)',
              color: 'var(--fg-default)',
            }}
          >
            Auf stefanbraum.de.
          </h2>

          <p
            className="mt-4 font-body"
            style={{
              fontSize: '17px',
              lineHeight: 1.65,
              color: 'var(--fg-muted)',
              maxWidth: '560px',
            }}
          >
            Persönliche Notizen, Reflexionen aus Industrie-Projekten,
            Tech-Experimente und Tool-Praxis. Mehr Volumen, mehr Tiefe,
            weniger B2B-Filter. Wo Themen sinnvoll dort drüben einsortieren,
            verlinke ich von hier.
          </p>

          <div
            className="grid grid-cols-1 md:grid-cols-2"
            style={{ marginTop: '48px', gap: '16px' }}
          >
            {externalWithOg.map(post => (
              <ExternalPostCard key={post.slug} post={post} />
            ))}
          </div>

          <div className="flex justify-center" style={{ marginTop: '64px' }}>
            <a
              href="https://stefanbraum.de/blog/"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="magnetic"
              className="inline-flex items-center gap-2 font-mono uppercase transition-opacity duration-220 hover:opacity-80"
              style={{
                fontSize: '12px',
                letterSpacing: '0.16em',
                color: COGNAC,
              }}
            >
              Alle Praxis-Notizen auf stefanbraum.de
              <ArrowUpRight size={12} strokeWidth={1.6} />
            </a>
          </div>

        </section>
      )}
    </>
  )
}

/**
 * External Post Card — distinkt von den internen Posts durch einen
 * vertikalen Cognac-Stripe links, kompaktes Card-Layout. Macht visuell
 * sofort klar, dass das ein Cross-Link zur Schwesternseite ist.
 */
function ExternalPostCard({ post }: { post: ExternalWithOg }) {
  return (
    <article className="h-full">
      <a
        href={post.url}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor="card"
        data-cursor-label="↗ extern"
        className="group relative flex h-full flex-col overflow-hidden transition-all duration-300"
        style={{
          background:
            'linear-gradient(135deg, rgba(168, 117, 83, 0.06) 0%, rgba(168, 117, 83, 0.02) 100%)',
          border: `1px solid rgba(168, 117, 83, 0.22)`,
          borderRadius: 'var(--r-sm)',
        }}
      >
        {/* Media-Banner — 16:9, native Bildkomposition statt Quadrat-Crop.
            stefanbraum.de liefert 1733×908-Quellbilder; im richtigen Verhältnis
            bleiben Screenshots/Visuals scharf und lesbar. */}
        <div
          className="relative w-full overflow-hidden"
          style={{
            aspectRatio: '16 / 9',
            background:
              'linear-gradient(135deg, rgba(168, 117, 83, 0.16) 0%, rgba(107, 63, 38, 0.06) 100%)',
            borderBottom: '1px solid rgba(168, 117, 83, 0.18)',
          }}
        >
          {post.fetchedOg ? (
            <>
              <Image
                src={post.fetchedOg}
                alt=""
                fill
                sizes="(min-width: 768px) 430px, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
              {/* dezenter Verlauf unten — Marken-Kohäsion + Tiefe */}
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0"
                style={{
                  height: '40%',
                  background:
                    'linear-gradient(180deg, transparent 0%, rgba(10, 8, 7, 0.45) 100%)',
                }}
              />
            </>
          ) : (
            /* Fallback ohne Bild — Marken-Tile statt leerer Fläche, hält die
               Card-Höhe im 2-Spalten-Grid konsistent. */
            <div
              aria-hidden
              className="absolute inset-0 flex items-center justify-center"
              style={{ color: 'rgba(168, 117, 83, 0.45)' }}
            >
              <ArrowUpRight size={40} strokeWidth={1.2} />
            </div>
          )}

          {/* Source-Pill overlay — Cross-Link-Anker, jetzt auf dem Bild */}
          <span
            className="absolute inline-flex items-center font-mono uppercase"
            style={{
              top: '10px',
              left: '10px',
              fontSize: '9px',
              letterSpacing: '0.18em',
              color: '#F0DCC8',
              padding: '4px 9px',
              background: 'rgba(20, 14, 10, 0.62)',
              border: '1px solid rgba(168, 117, 83, 0.40)',
              borderRadius: 'var(--r-pill)',
              gap: '5px',
              backdropFilter: 'blur(4px)',
            }}
          >
            <ArrowUpRight size={10} strokeWidth={1.8} />
            stefanbraum.de
          </span>
        </div>

        {/* Inhalt */}
        <div
          className="flex flex-1 flex-col"
          style={{ padding: '18px 20px', gap: '10px' }}
        >
          {/* Datum */}
          <span
            className="font-mono uppercase"
            style={{
              fontSize: '9px',
              letterSpacing: '0.18em',
              color: 'var(--fg-subtle)',
            }}
          >
            {formatDateDE(post.date)}
          </span>

          {/* Title */}
          <h3
            className="font-display font-medium transition-colors duration-220 group-hover:text-[color:var(--brand)]"
            style={{
              fontSize: '18px',
              lineHeight: 1.28,
              letterSpacing: 'var(--tr-heading)',
              color: 'var(--fg-default)',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {post.title}
          </h3>

          {/* Excerpt */}
          <p
            className="font-body"
            style={{
              fontSize: '13px',
              lineHeight: 1.55,
              color: 'var(--fg-muted)',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {post.excerpt}
          </p>

          {/* Tags + Footer-CTA */}
          <div
            className="mt-auto flex items-end justify-between"
            style={{ gap: '12px', paddingTop: '4px' }}
          >
            <span
              className="font-mono uppercase"
              style={{
                fontSize: '9px',
                letterSpacing: '0.16em',
                color: 'var(--fg-subtle)',
                lineHeight: 1.3,
              }}
            >
              {tagsForDisplay(post.tags, 2)}
            </span>
            <span
              className="inline-flex shrink-0 items-center gap-1.5 font-mono uppercase transition-all duration-220 group-hover:translate-x-0.5"
              style={{
                fontSize: '10px',
                letterSpacing: '0.16em',
                color: COGNAC,
              }}
            >
              Lesen
              <ArrowUpRight size={11} strokeWidth={1.6} />
            </span>
          </div>
        </div>
      </a>
    </article>
  )
}
