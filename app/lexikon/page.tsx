import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import ItalicAccent from '@/components/ui/ItalicAccent'
import BigHero from '@/components/sections/BigHero'
import { LexikonVisual } from '@/components/ui/PageHeroVisuals'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import { getGlossaryTerms, type GlossaryCategory } from '@/lib/cms'
import { GLOSSARY } from '@/lib/glossary'

export const metadata: Metadata = {
  title: 'Lexikon',
  description:
    'Begriffe aus Engagement-Praxis: Lotsenprinzip, Lagebild, M365-Governance, TISAX, AI-Governance. Kompakt definiert, mit Querverweisen.',
  alternates: { canonical: '/lexikon' },
}

const SITE_URL = 'https://braum.consulting'

const LEXIKON_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'DefinedTermSet',
  name: 'Lexikon · Braum Consulting',
  url: SITE_URL + '/lexikon',
  inLanguage: 'de-DE',
  hasDefinedTerm: GLOSSARY.map(t => ({
    '@type': 'DefinedTerm',
    name: t.term,
    url: SITE_URL + '/lexikon/' + t.slug,
  })),
}

const CATEGORY_ORDER: GlossaryCategory[] = ['brand', 'methodik', 'technik', 'industrie', 'recht']

const CATEGORY_LABEL: Record<GlossaryCategory, string> = {
  brand:     'Brand · Sprache',
  methodik:  'Methodik',
  technik:   'Technik',
  industrie: 'Industrie & Enterprise',
  recht:     'Recht & Compliance',
}

export default function LexikonPage() {
  const terms = getGlossaryTerms()

  const grouped = CATEGORY_ORDER.map(cat => ({
    cat,
    label: CATEGORY_LABEL[cat],
    items: terms.filter(t => t.category === cat),
  })).filter(g => g.items.length > 0)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(LEXIKON_JSONLD) }}
      />

      <BigHero
        eyebrowNum="06"
        eyebrow="Lexikon"
        title={<>Sprache vor <ItalicAccent>Definition</ItalicAccent>.</>}
        lede="Begriffe aus Engagement-Praxis, Brand-Sprache und Industrie-Domain. Kompakt definiert, mit Querverweisen. Wer den Lotsenprinzip-Loop verstehen will, fängt hier an."
        facts={[
          { label: 'Einträge',    value: `${terms.length}+` },
          { label: 'Kategorien',  value: '5 (Brand, Methodik, Technik …)' },
          { label: 'Format',      value: 'Kompakt, querverlinkt' },
        ]}
        visual={<LexikonVisual />}
      />

      <section
        style={{
          maxWidth: '880px',
          margin: '0 auto',
          padding: '0 24px clamp(96px, 12vw, 160px)',
        }}
      >
        <Breadcrumbs
          withJsonLd
          className="mb-12"
          items={[{ label: 'Lexikon' }]}
        />
        {grouped.map(({ cat, label, items }) => (
          <div key={cat} style={{ marginBottom: '64px' }}>
            <p
              className="font-mono uppercase"
              style={{
                fontSize: '11px',
                letterSpacing: '0.18em',
                color: 'var(--brand)',
                marginBottom: '20px',
                paddingBottom: '12px',
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              {label}
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {items.map(term => (
                <li key={term.slug}>
                  <Link
                    href={`/lexikon/${term.slug}`}
                    data-cursor="link"
                    className="group flex items-start justify-between gap-6"
                    style={{
                      padding: '20px 0',
                      borderBottom: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div className="flex-1">
                      <h2
                        className="font-display font-medium transition-colors duration-220 group-hover:text-[color:var(--brand)]"
                        style={{
                          fontSize: 'clamp(20px, 1.9vw, 24px)',
                          lineHeight: 1.25,
                          letterSpacing: 'var(--tr-heading)',
                          color: 'var(--fg-default)',
                        }}
                      >
                        {term.term}
                      </h2>
                      <p
                        className="mt-2 font-body"
                        style={{
                          fontSize: '15px',
                          lineHeight: 1.55,
                          color: 'var(--fg-muted)',
                          maxWidth: '620px',
                        }}
                      >
                        {term.definition}
                      </p>
                      {term.synonyms && term.synonyms.length > 0 && (
                        <p
                          className="mt-2 font-mono"
                          style={{
                            fontSize: '10px',
                            letterSpacing: '0.04em',
                            color: 'var(--fg-subtle)',
                          }}
                        >
                          Auch bekannt als: {term.synonyms.join(' · ')}
                        </p>
                      )}
                    </div>
                    <ArrowUpRight
                      size={16}
                      strokeWidth={1.5}
                      className="shrink-0 opacity-30 transition-all duration-300 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      style={{ color: 'var(--accent)', marginTop: '4px' }}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </>
  )
}
