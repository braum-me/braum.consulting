import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowUpRight, Plus } from 'lucide-react'
import ItalicAccent from '@/components/ui/ItalicAccent'
import ServiceHero from '@/components/ui/ServiceHero'
import CaseScrollNav from '@/components/ui/CaseScrollNav'
import GlossarHighlight from '@/components/ui/GlossarHighlight'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import LagebildPushSection from '@/components/lagebild/LagebildPushSection'

// Branded Hero + Showcase pro Slug lazy laden — so lädt /leistungen/<slug>
// nur das JS seines eigenen Showcases statt aller vier (SSR bleibt erhalten).
const MarkeHero         = dynamic(() => import('@/components/sections/MarkeHero'))
const M365Hero          = dynamic(() => import('@/components/sections/M365Hero'))
const AiHero            = dynamic(() => import('@/components/sections/AiHero'))
const StrategieHero     = dynamic(() => import('@/components/sections/StrategieHero'))
const MarkeShowcase     = dynamic(() => import('@/components/sections/MarkeShowcase'))
const M365Showcase      = dynamic(() => import('@/components/sections/M365Showcase'))
const AiShowcase        = dynamic(() => import('@/components/sections/AiShowcase'))
const StrategieShowcase = dynamic(() => import('@/components/sections/StrategieShowcase'))
import {
  getService,
  getServices,
  getServiceSlugs,
  getCases,
} from '@/lib/cms'
import type { ServiceSlug } from '@/lib/cms'

export async function generateStaticParams() {
  return getServiceSlugs().map(slug => ({ slug }))
}

interface PageProps {
  params: Promise<{ slug: ServiceSlug }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const s = getService(slug)
  if (!s) return {}
  const url = `/leistungen/${s.slug}`
  return {
    title:       s.title,
    description: s.metaDesc,
    alternates:  { canonical: url },
    openGraph: {
      title:       s.title,
      description: s.metaDesc,
      url,
      type:        'website',
    },
  }
}

const NAV_ITEMS_DEFAULT = [
  { id: 'svc-problem',  label: 'Problem',   num: '01' },
  { id: 'svc-outcomes', label: 'Outcome',   num: '02' },
  { id: 'svc-scope',    label: 'Scope',     num: '03' },
  { id: 'svc-cases',    label: 'Cases',     num: '04' },
  { id: 'svc-pricing',  label: 'Rahmen',    num: '05' },
  { id: 'svc-faq',      label: 'FAQ',       num: '06' },
]

const SITE_URL = 'https://braum.consulting'

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params
  const s = getService(slug)
  if (!s) notFound()

  const cases = getCases()
  // ref und case zusammen halten — sonst kann ein Index-Versatz nach dem
  // Filtern fehlender Cases einen falschen Titel/Metric auf den Case kleben.
  const referencedCases = s.caseRefs
    .map(ref => ({ ref, c: cases.find(c => c.num === ref.num) }))
    .filter((x): x is { ref: typeof x.ref; c: NonNullable<typeof x.c> } => Boolean(x.c))

  /** Hat dieser Service eine Cases-Sektion? Steuert das Showcase-2-Spalten-Grid:
   *  ohne Cases bleibt nur die FAQ → die soll dann volle Breite bekommen. */
  const hasCases = referencedCases.length > 0

  // Icon ist eine Function-Reference und nicht über die Server→Client-
  // Props-Boundary serialisierbar. ServiceHero resolved Icon selbst.
  const { icon: _icon, ...serviceForClient } = s

  // Schema.org JSON-LD: Service + Offer + FAQ + Breadcrumb
  const serviceJsonLd = {
    '@context':        'https://schema.org',
    '@type':           'Service',
    name:              s.title,
    description:       s.metaDesc,
    provider: { '@id': SITE_URL + '/#organization' },
    areaServed: { '@type': 'AdministrativeArea', name: 'DACH-Region' },
    serviceType:       s.title,
    url:               `${SITE_URL}/leistungen/${s.slug}`,
    offers: {
      '@type':              'Offer',
      priceSpecification: {
        '@type':            'PriceSpecification',
        priceCurrency:      'EUR',
        valueAddedTaxIncluded: false,
      },
      availability:         'https://schema.org/InStock',
      description:          s.pricing,
      url:                  `${SITE_URL}/kontakt`,
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name:    'Scope',
      itemListElement: s.scope.map((item, i) => ({
        '@type':     'Offer',
        position:    i + 1,
        itemOffered: { '@type': 'Service', name: item },
      })),
    },
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type':    'FAQPage',
    mainEntity: s.faqs.map(f => ({
      '@type': 'Question',
      name:    f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  const breadcrumbJsonLd = {
    '@context':       'https://schema.org',
    '@type':          'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',       item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Leistungen', item: `${SITE_URL}/leistungen` },
      { '@type': 'ListItem', position: 3, name: s.title,      item: `${SITE_URL}/leistungen/${s.slug}` },
    ],
  }

  // Slugs mit eigenem Showcase-Layout: bringen eigenen Hero + Showcase mit
  // und überspringen das generische Standard-Template (Problem/Outcomes/Scope/Rahmen).
  // Nur Cases + FAQ bleiben am Ende als 2-Spalten-Grid.
  const isShowcase = slug === 'marke' || slug === 'm365' || slug === 'ai' || slug === 'strategie'

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {slug === 'marke'     && <MarkeHero     s={serviceForClient as typeof s} />}
      {slug === 'm365'      && <M365Hero      s={serviceForClient as typeof s} />}
      {slug === 'ai'        && <AiHero        s={serviceForClient as typeof s} />}
      {slug === 'strategie' && <StrategieHero s={serviceForClient as typeof s} />}
      {!isShowcase          && <ServiceHero   s={serviceForClient as typeof s} />}

      {slug === 'marke'     && <MarkeShowcase />}
      {slug === 'm365'      && <M365Showcase />}
      {slug === 'ai'        && <AiShowcase />}
      {slug === 'strategie' && <StrategieShowcase />}

      <section className="relative" style={{ padding: 'clamp(80px, 10vw, 128px) 0' }}>
        <div className="mx-auto w-full max-w-[var(--container-wide)] px-6 md:px-12">
          {/* Sichtbare Breadcrumbs — JSON-LD liegt bereits oben als breadcrumbJsonLd */}
          <Breadcrumbs
            className="mb-12"
            items={[
              { label: 'Leistungen', href: '/leistungen' },
              { label: s.title },
            ]}
          />
          <div className={isShowcase ? '' : 'grid grid-cols-1 gap-12 lg:grid-cols-[200px_1fr] lg:gap-16'}>
            {!isShowcase && <CaseScrollNav items={NAV_ITEMS_DEFAULT} />}

            <div
              className={isShowcase ? (hasCases ? 'grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start lg:gap-12' : '') : ''}
              style={isShowcase ? undefined : { maxWidth: '780px' }}
            >

              {!isShowcase && (
              <>
              <article id="svc-problem" style={{ scrollMarginTop: '120px' }}>
                <SectionHeading num="01" eyebrow="Problem" title={<>Wo es <ItalicAccent>kippt</ItalicAccent>.</>} />
                <ul className="mt-10 space-y-5" style={{ listStyle: 'none', padding: 0 }}>
                  {s.problem.map((p, i) => (
                    <li key={i} className="flex items-start gap-4 font-body" style={{ fontSize: '17px', lineHeight: 1.65, color: 'var(--fg-default)', opacity: 0.85 }}>
                      <span aria-hidden className="mt-3 inline-block h-1.5 w-1.5 shrink-0" style={{ background: 'var(--accent)', borderRadius: '999px' }} />
                      <GlossarHighlight text={p} />
                    </li>
                  ))}
                </ul>
              </article>

              <article id="svc-outcomes" style={{ scrollMarginTop: '120px', marginTop: 'clamp(96px, 12vw, 160px)' }}>
                <SectionHeading num="02" eyebrow="Outcome" title={<>Was am <ItalicAccent>Ende</ItalicAccent> steht.</>} />
                <ul className="mt-10 space-y-5" style={{ listStyle: 'none', padding: 0 }}>
                  {s.outcomes.map((o, i) => (
                    <li key={i} className="flex items-start gap-4 font-body" style={{ fontSize: '17px', lineHeight: 1.65, color: 'var(--fg-default)', opacity: 0.85 }}>
                      <span aria-hidden className="mt-3 inline-block h-1.5 w-1.5 shrink-0" style={{ background: 'var(--accent)', borderRadius: '999px', boxShadow: '0 0 8px rgba(200,98,42,0.5)' }} />
                      <GlossarHighlight text={o} />
                    </li>
                  ))}
                </ul>
              </article>

              <article id="svc-scope" style={{ scrollMarginTop: '120px', marginTop: 'clamp(96px, 12vw, 160px)' }}>
                <SectionHeading num="03" eyebrow="Scope" title={<>Was im <ItalicAccent>Engagement</ItalicAccent> liegt.</>} />
                <ol className="mt-10 space-y-6">
                  {s.scope.map((step, i) => (
                    <li key={i} className="grid grid-cols-[44px_1fr] items-baseline gap-5 border-b pb-6 last:border-b-0 last:pb-0 md:gap-8" style={{ borderColor: 'var(--border-subtle)' }}>
                      <span className="font-mono" style={{ fontSize: '14px', color: 'var(--accent)', letterSpacing: '0.04em', fontWeight: 500 }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <p className="font-body" style={{ fontSize: '17px', lineHeight: 1.6, color: 'var(--fg-default)' }}>
                        <GlossarHighlight text={step} />
                      </p>
                    </li>
                  ))}
                </ol>
                {s.tags.length > 0 && (
                  <ul className="mt-10 flex flex-wrap gap-2" style={{ listStyle: 'none', padding: 0 }}>
                    {s.tags.map(t => (
                      <li key={t} className="font-mono uppercase" style={{ fontSize: '10px', letterSpacing: '0.16em', padding: '6px 12px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--r-pill)', color: 'var(--fg-muted)' }}>
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
              </>
              )}

              {referencedCases.length > 0 && (
                <article id="svc-cases" style={{ scrollMarginTop: '120px', marginTop: isShowcase ? 0 : 'clamp(96px, 12vw, 160px)' }}>
                  <SectionHeading num={isShowcase ? '07' : '04'} eyebrow="Cases" title={<>Aus echten <ItalicAccent>Mandaten</ItalicAccent>.</>} />
                  <ul className="mt-10 flex flex-col gap-4" style={{ listStyle: 'none', padding: 0 }}>
                    {referencedCases.map(({ ref, c }) => {
                      return (
                        <li key={c.num}>
                          <Link href={`/cases/${c.num}`} data-cursor="card" data-cursor-label="lesen" className="glass-card group block" style={{ padding: '24px 28px' }}>
                            <div className="relative z-[3] grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto] md:items-center md:gap-8">
                              <div>
                                <p className="font-mono uppercase" style={{ fontSize: '10px', letterSpacing: '0.18em', color: 'var(--brand)' }}>
                                  {c.sector}
                                </p>
                                <p className="mt-3 font-display font-medium transition-colors duration-220 group-hover:text-[color:var(--brand)]" style={{ fontSize: 'clamp(18px, 1.8vw, 22px)', lineHeight: 1.3, color: 'var(--fg-default)', letterSpacing: 'var(--tr-heading)' }}>
                                  {ref.title}
                                </p>
                              </div>
                              <div className="flex items-baseline gap-3 md:flex-col md:items-end md:gap-1">
                                <span className="font-display font-bold" style={{ fontSize: 'clamp(26px, 2.8vw, 36px)', lineHeight: 1, color: 'var(--accent)', letterSpacing: 'var(--tr-display)' }}>
                                  {ref.metric}
                                </span>
                                <span className="font-mono uppercase" style={{ fontSize: '10px', letterSpacing: '0.18em', color: 'var(--fg-muted)' }}>
                                  {ref.metricLabel}
                                </span>
                              </div>
                            </div>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </article>
              )}

              {!isShowcase && (
              <article id="svc-pricing" style={{ scrollMarginTop: '120px', marginTop: 'clamp(96px, 12vw, 160px)' }}>
                <SectionHeading num="05" eyebrow="Rahmen" title={<>Fixer Rahmen, klare <ItalicAccent>Konditionen</ItalicAccent>.</>} />
                <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="glass-card relative" style={{ padding: '32px' }}>
                    <div className="relative z-[3]">
                      <p className="font-mono uppercase" style={{ fontSize: '10px', letterSpacing: '0.20em', color: 'var(--fg-muted)', marginBottom: '12px' }}>
                        Dauer
                      </p>
                      <p className="font-display font-bold" style={{ fontSize: 'clamp(26px, 2.8vw, 36px)', lineHeight: 1.1, color: 'var(--fg-default)', letterSpacing: 'var(--tr-display)' }}>
                        {s.duration}
                      </p>
                    </div>
                  </div>
                  <div className="glass-card relative" style={{ padding: '32px' }}>
                    <div className="relative z-[3]">
                      <p className="font-mono uppercase" style={{ fontSize: '10px', letterSpacing: '0.20em', color: 'var(--fg-muted)', marginBottom: '12px' }}>
                        Konditionen
                      </p>
                      <p className="font-display font-semibold" style={{ fontSize: 'clamp(18px, 1.8vw, 22px)', lineHeight: 1.3, color: 'var(--fg-default)', letterSpacing: '-0.005em' }}>
                        <GlossarHighlight text="Festpreis nach Lagebild — keine Stundensätze, keine Überraschungen." />
                      </p>
                    </div>
                  </div>
                </div>
              </article>
              )}

              {s.faqs.length > 0 && (
                <article id="svc-faq" style={{ scrollMarginTop: '120px', marginTop: isShowcase ? 0 : 'clamp(96px, 12vw, 160px)' }}>
                  <SectionHeading num={isShowcase ? '08' : '06'} eyebrow="FAQ" title={<>Was <ItalicAccent>vorab</ItalicAccent> geklärt sein sollte.</>} />
                  <div className="mt-10">
                    {s.faqs.map((f, i) => (
                      <details key={i} className="group" style={{ padding: '24px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                        <summary className="flex cursor-pointer items-center justify-between gap-4 font-display font-medium" style={{ fontSize: 'clamp(17px, 1.9vw, 21px)', lineHeight: 1.3, color: 'var(--fg-default)', listStyle: 'none' }}>
                          <span>{f.q}</span>
                          <span aria-hidden className="inline-flex h-8 w-8 shrink-0 items-center justify-center transition-transform duration-300 group-open:rotate-45" style={{ border: '1px solid var(--border-subtle)', borderRadius: '999px', color: 'var(--brand)' }}>
                            <Plus size={14} strokeWidth={1.6} />
                          </span>
                        </summary>
                        <p className="mt-4 font-body" style={{ fontSize: '16px', lineHeight: 1.7, color: 'var(--fg-muted)' }}>
                          <GlossarHighlight text={f.a} />
                        </p>
                      </details>
                    ))}
                  </div>
                </article>
              )}

              {/* Andere Leistungen — 3 Glass-Cards. CTA lebt im globalen Footer.
                  Bei /marke (2-col-Grid) full-width über beide Spalten ziehen. */}
              <div
                className={isShowcase ? 'lg:col-span-2' : ''}
                style={{ marginTop: 'clamp(96px, 12vw, 160px)', paddingTop: '48px', borderTop: '1px solid var(--border-subtle)' }}
              >
                <p
                  className="font-mono uppercase"
                  style={{
                    fontSize: '11px',
                    letterSpacing: '0.18em',
                    color: 'var(--brand)',
                    marginBottom: '24px',
                  }}
                >
                  Andere Leistungen
                </p>
                <ul
                  className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5"
                  style={{ listStyle: 'none', padding: 0 }}
                >
                  {getServices().filter(o => o.slug !== s.slug).map(o => {
                    const OIcon = o.icon
                    return (
                      <li key={o.slug}>
                        <Link
                          href={`/leistungen/${o.slug}`}
                          data-cursor="card"
                          data-cursor-label="öffnen"
                          className="glass-card group block h-full"
                          style={{ padding: '20px 22px', minHeight: '180px' }}
                        >
                          <div className="relative z-[3] flex h-full flex-col">
                            <div className="flex items-start justify-between gap-3">
                              <span
                                className="inline-flex h-9 w-9 items-center justify-center"
                                style={{
                                  background: 'var(--bg-overlay)',
                                  borderRadius: 'var(--r-sm)',
                                  color: 'var(--brand)',
                                }}
                              >
                                <OIcon size={16} strokeWidth={1.5} />
                              </span>
                              <ArrowUpRight
                                size={14}
                                strokeWidth={1.5}
                                className="opacity-30 transition-all duration-300 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                style={{ color: 'var(--accent)' }}
                              />
                            </div>
                            <p
                              className="mt-5 font-mono uppercase"
                              style={{
                                fontSize: '10px',
                                letterSpacing: '0.18em',
                                color: 'var(--brand)',
                              }}
                            >
                              {o.num}
                            </p>
                            <h3
                              className="mt-2 font-display font-semibold"
                              style={{
                                fontSize: '17px',
                                lineHeight: 1.2,
                                letterSpacing: 'var(--tr-heading)',
                                color: 'var(--fg-default)',
                              }}
                            >
                              {o.title}
                            </h3>
                            <p
                              className="mt-2 font-body"
                              style={{
                                fontSize: '13px',
                                lineHeight: 1.45,
                                color: 'var(--fg-muted)',
                              }}
                            >
                              {o.short}
                            </p>
                          </div>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>

            </div>
          </div>
        </div>
      </section>

      <LagebildPushSection saeule={s.slug} />
    </>
  )
}

function SectionHeading({ num, eyebrow, title }: { num: string; eyebrow: string; title: React.ReactNode }) {
  return (
    <>
      <p className="font-mono uppercase" style={{ fontSize: '11px', letterSpacing: '0.18em', color: 'var(--brand)', marginBottom: '24px' }}>
        {num} · {eyebrow}
      </p>
      <h2 className="font-display font-bold" style={{ fontSize: 'clamp(32px, 3.6vw, 48px)', lineHeight: 1.1, letterSpacing: 'var(--tr-heading)', color: 'var(--fg-default)' }}>
        {title}
      </h2>
    </>
  )
}
