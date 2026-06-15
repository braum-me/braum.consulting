import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import AccentGlow from '@/components/ui/AccentGlow'
import GlossarHighlight from '@/components/ui/GlossarHighlight'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import {
  getGlossaryTerm,
  getGlossaryTermSlugs,
  getGlossaryTerms,
} from '@/lib/cms'

export async function generateStaticParams() {
  return getGlossaryTermSlugs().map(slug => ({ slug }))
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const term = getGlossaryTerm(slug)
  if (!term) return {}
  const url = `/lexikon/${slug}`
  return {
    title:       `${term.term} · Lexikon`,
    description: term.definition.slice(0, 160),
    alternates:  { canonical: url },
    openGraph: {
      type:        'article',
      title:       `${term.term} · Lexikon`,
      description: term.definition.slice(0, 160),
      url,
    },
  }
}

const CATEGORY_LABEL = {
  brand:     'Brand · Sprache',
  methodik:  'Methodik',
  technik:   'Technik',
  industrie: 'Industrie & Enterprise',
  recht:     'Recht & Compliance',
}

export default async function LexikonDetailPage({ params }: PageProps) {
  const { slug } = await params
  const term = getGlossaryTerm(slug)
  if (!term) notFound()

  const related = (term.related ?? [])
    .map(s => getGlossaryTerm(s))
    .filter((t): t is NonNullable<typeof t> => Boolean(t))

  // Schema.org DefinedTerm
  const jsonLd = {
    '@context':   'https://schema.org',
    '@type':      'DefinedTerm',
    name:         term.term,
    description:  term.definition,
    inDefinedTermSet: 'https://braum.consulting/lexikon',
    url:          `https://braum.consulting/lexikon/${term.slug}`,
    ...(term.synonyms && { alternateName: term.synonyms }),
  }

  // Find pages that mention this term (best-effort static cross-link)
  const allTerms = getGlossaryTerms()
  const moreInCategory = allTerms
    .filter(t => t.category === term.category && t.slug !== term.slug)
    .slice(0, 4)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section
        className="relative w-screen overflow-hidden"
        style={{
          marginLeft: 'calc(-50vw + 50%)',
          background: 'var(--bg-base)',
          padding: 'clamp(120px, 14vw, 200px) 0 clamp(64px, 8vw, 96px)',
        }}
      >
        <AccentGlow position="top-right" intensity="low" />
        <div className="relative z-[3] mx-auto w-full max-w-[var(--container-wide)] px-6 md:px-12">
          {/* Breadcrumbs inkl. BreadcrumbList-JSON-LD (DefinedTerm-Schema bleibt separat) */}
          <Breadcrumbs
            withJsonLd
            className="mb-6"
            items={[
              { label: 'Lexikon', href: '/lexikon' },
              { label: term.term },
            ]}
          />
          <Link
            href="/lexikon"
            data-cursor="link"
            className="inline-flex items-center gap-2 font-mono uppercase transition-colors duration-220 hover:text-[color:var(--brand)]"
            style={{
              fontSize: '11px',
              letterSpacing: '0.18em',
              color: 'var(--fg-muted)',
            }}
          >
            <ArrowLeft size={11} strokeWidth={1.6} />
            Zum Lexikon
          </Link>

          <p
            className="mt-12 font-mono uppercase"
            style={{
              fontSize: '11px',
              letterSpacing: '0.20em',
              color: 'var(--brand)',
              marginBottom: '24px',
            }}
          >
            Lexikon · {CATEGORY_LABEL[term.category]}
          </p>

          <h1
            className="font-display font-bold"
            style={{
              fontSize: 'clamp(44px, 6.4vw, 96px)',
              lineHeight: 1.02,
              letterSpacing: 'var(--tr-display)',
              color: 'var(--fg-default)',
              maxWidth: '1000px',
            }}
          >
            {term.term}
          </h1>

          {term.synonyms && term.synonyms.length > 0 && (
            <p
              className="mt-6 font-mono uppercase"
              style={{
                fontSize: '11px',
                letterSpacing: '0.16em',
                color: 'var(--fg-subtle)',
              }}
            >
              Auch bekannt als: {term.synonyms.join(' · ')}
            </p>
          )}
        </div>
      </section>

      <section
        style={{
          maxWidth: '720px',
          margin: '0 auto',
          padding: '0 24px clamp(96px, 12vw, 160px)',
        }}
      >
        <p
          className="font-body"
          style={{
            fontSize: '20px',
            lineHeight: 1.6,
            color: 'var(--fg-default)',
            opacity: 0.9,
          }}
        >
          {term.definition}
        </p>

        {term.longForm && (
          <p
            className="mt-8 font-body"
            style={{
              fontSize: '17px',
              lineHeight: 1.7,
              color: 'var(--fg-muted)',
            }}
          >
            <GlossarHighlight text={term.longForm} />
          </p>
        )}

        {term.tool && (
          <Link
            href={term.tool.href}
            className="group mt-10 flex items-center justify-between gap-4"
            style={{
              padding: '16px 20px',
              borderRadius: 10,
              background: 'rgba(220, 128, 68, 0.08)',
              border: '1px solid rgba(220, 128, 68, 0.28)',
            }}
          >
            <span className="flex flex-col">
              <span className="font-mono uppercase" style={{ fontSize: 10.5, letterSpacing: '0.16em', color: 'var(--brand)', marginBottom: 4 }}>
                Selbst-Check · 2 Minuten
              </span>
              <span className="font-body" style={{ fontSize: 15, color: 'var(--fg-default)' }}>
                {term.tool.label}
              </span>
            </span>
            <ArrowUpRight size={16} strokeWidth={1.75} style={{ color: 'var(--brand)', flexShrink: 0 }} className="transition-transform duration-220 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        )}

        {term.source && (
          <a
            href={term.source.url}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="external"
            className="mt-8 inline-flex items-center gap-2 font-mono uppercase transition-colors duration-220 hover:text-[color:var(--brand)]"
            style={{
              fontSize: '11px',
              letterSpacing: '0.16em',
              color: 'var(--fg-muted)',
            }}
          >
            Quelle: {term.source.label}
            <ArrowUpRight size={11} strokeWidth={1.6} />
          </a>
        )}

        {related.length > 0 && (
          <nav
            aria-label="Verwandte Begriffe"
            style={{
              marginTop: 'clamp(64px, 8vw, 96px)',
              paddingTop: '40px',
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            <p
              className="font-mono uppercase"
              style={{
                fontSize: '10px',
                letterSpacing: '0.20em',
                color: 'var(--fg-subtle)',
                marginBottom: '20px',
              }}
            >
              Verwandte Begriffe
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {related.map(r => (
                <li key={r.slug}>
                  <Link
                    href={`/lexikon/${r.slug}`}
                    data-cursor="link"
                    className="group flex items-start justify-between gap-4 rounded-[6px] outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg-base)]"
                    style={{
                      padding: '14px 0',
                      borderBottom: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div>
                      <h2
                        className="font-display font-medium transition-colors duration-220 group-hover:text-[color:var(--brand)]"
                        style={{
                          fontSize: '17px',
                          color: 'var(--fg-default)',
                        }}
                      >
                        {r.term}
                      </h2>
                      <p
                        className="mt-1 font-body"
                        style={{
                          fontSize: '13px',
                          lineHeight: 1.45,
                          color: 'var(--fg-muted)',
                        }}
                      >
                        {r.definition.slice(0, 120)}…
                      </p>
                    </div>
                    <ArrowUpRight size={14} strokeWidth={1.5} className="shrink-0 mt-1 opacity-40 group-hover:opacity-100" style={{ color: 'var(--accent)' }} />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {moreInCategory.length > 0 && (
          <div
            style={{
              marginTop: 'clamp(48px, 6vw, 72px)',
              paddingTop: '32px',
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            <p
              className="font-mono uppercase"
              style={{
                fontSize: '10px',
                letterSpacing: '0.20em',
                color: 'var(--fg-subtle)',
                marginBottom: '12px',
              }}
            >
              Mehr aus {CATEGORY_LABEL[term.category]}
            </p>
            <div className="flex flex-wrap gap-2">
              {moreInCategory.map(t => (
                <Link
                  key={t.slug}
                  href={`/lexikon/${t.slug}`}
                  data-cursor="link"
                  className="inline-flex font-mono uppercase transition-colors duration-220 hover:text-[color:var(--brand)]"
                  style={{
                    fontSize: '11px',
                    letterSpacing: '0.16em',
                    padding: '6px 12px',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--r-pill)',
                    color: 'var(--fg-muted)',
                  }}
                >
                  {t.term}
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  )
}
