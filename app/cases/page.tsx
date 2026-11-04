import type { Metadata } from 'next'
import PortfolioHero from '@/components/sections/PortfolioHero'
import PortfolioBrowser from '@/components/sections/PortfolioBrowser'
import { CASES } from '@/lib/cases'

// Engagement-Zahl aus der Datenquelle, abgerundet auf die nächste Zehn —
// bleibt korrekt während das Portfolio wächst, ohne harten „Über 30"-Claim
// (aktuell 22 Cases → „Über 20").
const ENGAGEMENTS_FLOOR = Math.floor(CASES.length / 10) * 10

export const metadata: Metadata = {
  title: 'Portfolio',
  description:
    `Über ${ENGAGEMENTS_FLOOR} Engagements aus Marke, M365, KI und Strategie im deutschen Mittelstand und in der Industrie. Branchen rotiert, Kennzahlen nachvollziehbar.`,
  alternates: { canonical: '/cases' },
}

const SITE_URL = 'https://braum.consulting'

const CASES_COLLECTION_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Portfolio · Engagements',
  url: SITE_URL + '/cases',
  inLanguage: 'de-DE',
  isPartOf: { '@id': SITE_URL + '/#website' },
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: CASES.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: SITE_URL + '/cases/' + c.num,
      name: c.title,
    })),
  },
}

/**
 * Portfolio-Page — strukturierter Browser.
 *
 *   <PortfolioHero>            Editorial-Hero mit Lotsen-Kanban
 *   <PortfolioBrowser>         Stats + Sticky-Filter + Säulen-Sektionen
 *                              mit Highlight-Cards und Standard-Strips
 */
export default function CasesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(CASES_COLLECTION_JSONLD) }}
      />
      <PortfolioHero />
      <PortfolioBrowser />
    </>
  )
}
