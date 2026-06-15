import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowUpRight, Quote } from 'lucide-react'
import ItalicAccent from '@/components/ui/ItalicAccent'
import CaseShowcase from '@/components/ui/CaseShowcase'
import CaseHero from '@/components/ui/CaseHero'
import CaseScrollNav from '@/components/ui/CaseScrollNav'
import NextCasePeek from '@/components/ui/NextCasePeek'
import LagebildPushSection from '@/components/lagebild/LagebildPushSection'
import ReadingProgress from '@/components/ui/ReadingProgress'
import ReadingHighlight from '@/components/ui/ReadingHighlight'
import { CASES, getCase } from '@/lib/cases'
import { getService } from '@/lib/services'

export async function generateStaticParams() {
  return CASES.map(c => ({ id: c.num }))
}

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const c = getCase(id)
  if (!c) return {}
  const url = `/cases/${c.num}`
  const description = `${c.sector} · ${c.year} · ${c.duration}. ${c.impact}`
  const images = c.image
    ? [{ url: c.image, width: 1200, height: 630, alt: c.title }]
    : undefined
  return {
    title:       `${c.title} · ${c.fieldLabel}`,
    description,
    alternates:  { canonical: url },
    openGraph: {
      type:        'article',
      title:       c.title,
      description,
      url,
      ...(images ? { images } : {}),
    },
    twitter: {
      card:        'summary_large_image',
      title:       c.title,
      description,
      ...(c.image ? { images: [c.image] } : {}),
    },
  }
}

const NAV_ITEMS = [
  { id: 'case-context',  label: 'Kontext',  num: '01' },
  { id: 'case-approach', label: 'Vorgehen', num: '02' },
  { id: 'case-outcome',  label: 'Outcome',  num: '03' },
  { id: 'case-tech',     label: 'Bausteine', num: '04' },
]

const SITE_URL = 'https://braum.consulting'

export default async function CaseDetailPage({ params }: PageProps) {
  const { id } = await params
  const c = getCase(id)
  if (!c) notFound()

  const service = getService(c.serviceSlug)

  // Next-Case-Logik: chronologisch nächster, cyclical
  const idx = CASES.findIndex(x => x.num === c.num)
  const next = CASES[(idx + 1) % CASES.length]

  const caseJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline:    c.title,
    description: c.impact,
    inLanguage:  'de-DE',
    about:       c.fieldLabel,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id':   `${SITE_URL}/cases/${c.num}`,
    },
    author:    { '@id': SITE_URL + '/#person-stefan-braum' },
    publisher: { '@id': SITE_URL + '/#organization' },
    ...(c.image ? { image: SITE_URL + c.image } : {}),
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Start',     item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Portfolio', item: SITE_URL + '/cases' },
      { '@type': 'ListItem', position: 3, name: c.title,     item: `${SITE_URL}/cases/${c.num}` },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(caseJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ReadingProgress targetSelector="[data-case-article]" topOffset={2} />
      <CaseHero c={c} />

      {/* Visual-Banner — großflächiges Device-Showcase */}
      <CaseShowcase c={c} />

      {/* Main Content mit Sticky-Side-Nav */}
      <section
        data-case-article
        className="relative"
        style={{ padding: 'clamp(80px, 10vw, 128px) 0' }}
      >
        <div className="mx-auto w-full max-w-[var(--container-wide)] px-6 md:px-12">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[200px_1fr] lg:gap-16">
            {/* Sticky Side-Nav */}
            <CaseScrollNav items={NAV_ITEMS} />

            {/* Content */}
            <div style={{ maxWidth: '780px' }}>
              {/* ── Kontext ── */}
              <article id="case-context" style={{ scrollMarginTop: '120px' }}>
                <div
                  className="flex items-baseline gap-4"
                  style={{ marginBottom: '24px' }}
                >
                  <span
                    className="font-mono uppercase"
                    style={{
                      fontSize: '11px',
                      letterSpacing: '0.18em',
                      color: 'var(--brand)',
                    }}
                  >
                    01 · Kontext
                  </span>
                </div>
                <h2
                  className="font-display font-bold"
                  style={{
                    fontSize: 'clamp(32px, 3.6vw, 48px)',
                    lineHeight: 1.1,
                    letterSpacing: 'var(--tr-heading)',
                    color: 'var(--fg-default)',
                  }}
                >
                  Wo wir <ItalicAccent>angefangen</ItalicAccent> haben.
                </h2>
                <div
                  className="mt-10 space-y-6 font-body"
                  style={{
                    fontSize: '18px',
                    lineHeight: 1.7,
                    color: 'var(--fg-default)',
                  }}
                >
                  {c.context.map((p, i) => (
                    <p key={i} style={i > 0 ? { color: 'var(--fg-muted)' } : undefined}>
                      <ReadingHighlight text={p} />
                    </p>
                  ))}
                </div>
              </article>

              {/* ── Vorgehen ── */}
              <article
                id="case-approach"
                style={{ scrollMarginTop: '120px', marginTop: 'clamp(96px, 12vw, 160px)' }}
              >
                <div
                  className="flex items-baseline gap-4"
                  style={{ marginBottom: '24px' }}
                >
                  <span
                    className="font-mono uppercase"
                    style={{
                      fontSize: '11px',
                      letterSpacing: '0.18em',
                      color: 'var(--brand)',
                    }}
                  >
                    02 · Vorgehen
                  </span>
                </div>
                <h2
                  className="font-display font-bold"
                  style={{
                    fontSize: 'clamp(32px, 3.6vw, 48px)',
                    lineHeight: 1.1,
                    letterSpacing: 'var(--tr-heading)',
                    color: 'var(--fg-default)',
                  }}
                >
                  Was wir gemacht haben.
                </h2>
                <ol className="mt-10 space-y-7">
                  {c.approach.map((step, i) => (
                    <li
                      key={i}
                      className="grid grid-cols-[44px_1fr] items-baseline gap-5 border-b pb-7 last:border-b-0 last:pb-0 md:gap-8"
                      style={{ borderColor: 'var(--border-subtle)' }}
                    >
                      <span
                        className="font-mono"
                        style={{
                          fontSize: '14px',
                          color: 'var(--accent)',
                          letterSpacing: '0.04em',
                          fontWeight: 500,
                        }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <p
                        className="font-body"
                        style={{
                          fontSize: '18px',
                          lineHeight: 1.6,
                          color: 'var(--fg-default)',
                        }}
                      >
                        <ReadingHighlight text={step} />
                      </p>
                    </li>
                  ))}
                </ol>

                {/* Pull-Quote zwischen Vorgehen und Outcome */}
                <div
                  style={{ marginTop: 'clamp(64px, 8vw, 96px)' }}
                >
                  <Quote
                    size={36}
                    strokeWidth={1.4}
                    style={{ color: 'var(--accent)' }}
                    aria-hidden
                  />
                  <blockquote
                    className="mt-6 font-display"
                    style={{
                      fontSize: 'clamp(26px, 3.6vw, 48px)',
                      lineHeight: 1.25,
                      letterSpacing: 'var(--tr-heading)',
                      color: 'var(--fg-default)',
                      fontStyle: 'italic',
                      fontFamily: 'var(--font-accent)',
                      fontWeight: 400,
                    }}
                  >
                    „{c.approach[c.approach.length - 1] ?? c.brief}"
                  </blockquote>
                  <p
                    className="mt-6 font-mono uppercase"
                    style={{
                      fontSize: '10px',
                      letterSpacing: '0.20em',
                      color: 'var(--fg-subtle)',
                    }}
                  >
                    Aus dem Engagement · {c.sector}
                  </p>
                </div>
              </article>

              {/* ── Outcome ── */}
              <article
                id="case-outcome"
                style={{ scrollMarginTop: '120px', marginTop: 'clamp(96px, 12vw, 160px)' }}
              >
                <div
                  className="flex items-baseline gap-4"
                  style={{ marginBottom: '24px' }}
                >
                  <span
                    className="font-mono uppercase"
                    style={{
                      fontSize: '11px',
                      letterSpacing: '0.18em',
                      color: 'var(--brand)',
                    }}
                  >
                    03 · Outcome
                  </span>
                </div>
                <h2
                  className="font-display font-bold"
                  style={{
                    fontSize: 'clamp(32px, 3.6vw, 48px)',
                    lineHeight: 1.1,
                    letterSpacing: 'var(--tr-heading)',
                    color: 'var(--fg-default)',
                  }}
                >
                  Was am Ende auf dem <ItalicAccent>Tisch</ItalicAccent> lag.
                </h2>
                <ul className="mt-10 space-y-5">
                  {c.outcome.map((o, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-4 font-body"
                      style={{
                        fontSize: '18px',
                        lineHeight: 1.6,
                        color: 'var(--fg-default)',
                      }}
                    >
                      <span
                        aria-hidden
                        className="mt-3 inline-block h-1.5 w-1.5 shrink-0"
                        style={{
                          background: 'var(--accent)',
                          borderRadius: 'var(--r-pill)',
                          boxShadow: '0 0 8px rgba(200, 98, 42, 0.6)',
                        }}
                      />
                      <ReadingHighlight text={o} />
                    </li>
                  ))}
                </ul>
              </article>

              {/* ── Bausteine ── */}
              <article
                id="case-tech"
                style={{ scrollMarginTop: '120px', marginTop: 'clamp(96px, 12vw, 160px)' }}
              >
                <div className="flex items-baseline justify-between gap-4" style={{ marginBottom: '24px' }}>
                  <span
                    className="font-mono uppercase"
                    style={{
                      fontSize: '11px',
                      letterSpacing: '0.18em',
                      color: 'var(--brand)',
                    }}
                  >
                    04 · Bausteine
                  </span>
                  {service && (
                    <Link
                      href={`/leistungen/${service.slug}`}
                      data-cursor="link"
                      className="inline-flex items-center gap-2 font-mono uppercase transition-colors duration-220 hover:text-[color:var(--brand)]"
                      style={{
                        fontSize: '11px',
                        letterSpacing: '0.16em',
                        color: 'var(--fg-muted)',
                      }}
                    >
                      Mehr zu {service.title}
                      <ArrowUpRight size={12} strokeWidth={1.6} />
                    </Link>
                  )}
                </div>
                <h2
                  className="font-display font-bold"
                  style={{
                    fontSize: 'clamp(32px, 3.6vw, 48px)',
                    lineHeight: 1.1,
                    letterSpacing: 'var(--tr-heading)',
                    color: 'var(--fg-default)',
                  }}
                >
                  Was zusammenkam.
                </h2>
                <ul className="mt-10 flex flex-wrap gap-3">
                  {c.tech.map(t => (
                    <li
                      key={t}
                      className="font-mono"
                      style={{
                        fontSize: '13px',
                        letterSpacing: '0.02em',
                        color: 'var(--fg-default)',
                        padding: '10px 18px',
                        border: '1px solid var(--border-default)',
                        borderRadius: 'var(--r-pill)',
                        background: 'var(--bg-elevated)',
                      }}
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </div>
        </div>
      </section>

      <LagebildPushSection
        saeule={c.serviceSlug}
        headline={<>Selbst eine ähnliche <em style={{ fontFamily: 'var(--font-accent)', fontStyle: 'italic', fontWeight: 400, color: 'var(--brand)' }}>Lage</em>?</>}
        body={`Wenn dieser Case wie eure Situation klingt — vier Minuten Selbst-Check, du bekommst ein persönliches Briefing mit Roadmap-Skizze. Speziell auf eure ${c.fieldLabel}-Frage zugeschnitten.`}
      />

      <NextCasePeek next={next} />
    </>
  )
}
