import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Check } from 'lucide-react'
import LeistungenHero from '@/components/sections/LeistungenHero'
import { ServiceVisual } from '@/components/ui/ServiceVisuals'
import { getServices } from '@/lib/cms'
import { SERVICES } from '@/lib/services'

export const metadata: Metadata = {
  title:       'Leistungen',
  description:
    'Marke, Microsoft 365 oder Google Workspace, KI & Automatisierung, digitale Strategie. Vier Schwerpunkte, eine Hand. Direkt mit Stefan Braum.',
  alternates: { canonical: '/leistungen' },
}

const SITE_URL = 'https://braum.consulting'

const LEISTUNGEN_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Leistungen · Braum Consulting',
  url: SITE_URL + '/leistungen',
  inLanguage: 'de-DE',
  isPartOf: { '@id': SITE_URL + '/#website' },
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: SERVICES.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: SITE_URL + '/leistungen/' + s.slug,
      name: s.title,
    })),
  },
}

export default function LeistungenPage() {
  const services = getServices()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(LEISTUNGEN_JSONLD) }}
      />

      <LeistungenHero />

      <section
        id="leistungen-list"
        style={{
          maxWidth: 'var(--container-wide)',
          margin: '0 auto',
          padding: 'clamp(48px, 6vw, 80px) 24px clamp(96px, 12vw, 144px)',
        }}
      >
        <ul
          className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-7"
          style={{ listStyle: 'none', padding: 0 }}
        >
          {services.map(s => (
            <li key={s.slug}>
              <Link
                href={`/leistungen/${s.slug}`}
                data-cursor="card"
                data-cursor-label="öffnen"
                className="glass-card group relative block h-full overflow-hidden"
              >
                <div
                  className="relative w-full overflow-hidden"
                  style={{
                    aspectRatio: '16 / 9',
                    borderBottom: '1px solid var(--border-subtle)',
                    background:
                      'radial-gradient(75% 90% at 50% 50%, rgba(146, 48, 30, 0.16) 0%, rgba(15, 14, 12, 0.6) 60%, var(--bg-base) 100%)',
                  }}
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                      backgroundImage: 'var(--noise-svg)',
                      mixBlendMode: 'overlay',
                      opacity: 0.08,
                    }}
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-60 transition-opacity duration-700 group-hover:opacity-100"
                    style={{
                      background:
                        'radial-gradient(60% 60% at 50% 100%, rgba(220, 128, 68, 0.22) 0%, transparent 70%)',
                    }}
                  />
                  <ServiceVisual slug={s.slug} />
                </div>

                <div className="relative z-[3] flex flex-col p-7 md:p-9">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-baseline gap-3">
                      <p
                        className="font-mono uppercase"
                        style={{
                          fontSize: '10px',
                          letterSpacing: '0.20em',
                          color: 'var(--brand)',
                        }}
                      >
                        Leistung {s.num}
                      </p>
                      <span
                        aria-hidden
                        style={{
                          width: 4, height: 4, borderRadius: '50%',
                          background: 'var(--fg-subtle)',
                          opacity: 0.4,
                        }}
                      />
                      <p
                        className="font-mono"
                        style={{
                          fontSize: '11px',
                          color: 'var(--fg-subtle)',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {s.duration}
                      </p>
                    </div>
                    <ArrowUpRight
                      size={18}
                      strokeWidth={1.5}
                      className="opacity-30 transition-all duration-300 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      style={{ color: 'var(--accent)' }}
                    />
                  </div>

                  <h3
                    className="mt-4 font-display font-semibold transition-colors duration-220 group-hover:text-[color:var(--brand)]"
                    style={{
                      fontSize: 'clamp(24px, 2.2vw, 32px)',
                      lineHeight: 1.12,
                      letterSpacing: 'var(--tr-heading)',
                      color: 'var(--fg-default)',
                    }}
                  >
                    {s.title}
                  </h3>

                  <p
                    className="mt-3 font-body"
                    style={{
                      fontSize: '15px',
                      lineHeight: 1.55,
                      color: 'var(--fg-muted)',
                    }}
                  >
                    {s.short}
                  </p>

                  <ul
                    className="mt-5"
                    style={{ listStyle: 'none', padding: 0, margin: 0 }}
                  >
                    {s.bullets.map(b => (
                      <li key={b} className="flex items-start gap-2.5 py-1.5">
                        <Check
                          size={12}
                          strokeWidth={2.4}
                          style={{
                            color: 'var(--accent)',
                            flexShrink: 0,
                            marginTop: 4,
                          }}
                        />
                        <span
                          className="font-body"
                          style={{
                            fontSize: '13.5px',
                            lineHeight: 1.45,
                            color: 'var(--fg-default)',
                          }}
                        >
                          {b}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-7 flex items-end justify-between gap-3 pt-6"
                    style={{ borderTop: '1px solid rgba(220, 128, 68, 0.18)' }}
                  >
                    <div>
                      <p
                        className="font-display font-black"
                        style={{
                          fontSize: 'clamp(22px, 2vw, 28px)',
                          lineHeight: 1,
                          color: 'var(--accent)',
                          letterSpacing: 'var(--tr-display)',
                        }}
                      >
                        {s.result}
                      </p>
                      <p
                        className="mt-1.5 font-mono uppercase"
                        style={{
                          fontSize: '9px',
                          letterSpacing: '0.18em',
                          color: 'var(--fg-subtle)',
                        }}
                      >
                        {s.resultLabel}
                      </p>
                    </div>
                    <span
                      className="inline-flex items-center gap-1.5 font-mono uppercase transition-colors duration-220 group-hover:text-[color:var(--brand)]"
                      style={{
                        fontSize: '10px',
                        letterSpacing: '0.18em',
                        color: 'var(--fg-subtle)',
                      }}
                    >
                      Mehr →
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
