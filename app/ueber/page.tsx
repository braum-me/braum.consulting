import type { Metadata } from 'next'
import Breadcrumbs      from '@/components/ui/Breadcrumbs'
import UeberHero       from '@/components/sections/UeberHero'
import UeberStatement  from '@/components/sections/UeberStatement'
import UeberTimeline   from '@/components/sections/UeberTimeline'
import UeberStack      from '@/components/sections/UeberStack'
import UeberMore       from '@/components/sections/UeberMore'

export const metadata: Metadata = {
  alternates: { canonical: '/ueber' },
  title: 'Über Stefan',
  description:
    'Stefan Braum, IT-Verantwortung in der DACH-Industrie und eigene Praxis für KMU. Werdegang als Horizontal-Scroll, Prinzipien, Stack.',
}

const SITE_URL = 'https://braum.consulting'

// Die /ueber-Seite ist die natürliche „Wer ist Stefan/Braum Consulting?"-Quelle.
// ProfilePage verweist per @id auf die global (layout.tsx) definierte Person —
// keine Neudefinition, alles hängt am selben Entity-Knoten.
const UEBER_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  '@id': SITE_URL + '/ueber#profilepage',
  url: SITE_URL + '/ueber',
  inLanguage: 'de-DE',
  isPartOf: { '@id': SITE_URL + '/#website' },
  mainEntity: { '@id': SITE_URL + '/#person-stefan-braum' },
}

/**
 * /ueber — Hybrid-Komposition:
 *   01 Hero          kinematischer Big-Portrait + Stats
 *   02 Statement     Brand-Statement „Warum ich"
 *   03 Werdegang     H-Scroll-Timeline mit Pin (Desktop) / Snap (Mobile)
 *   04 Stack         Editorial Tool-Grid
 *   05 Außerhalb     Bridge zu stefanbraum.de + LinkedIn + GitHub
 *
 * Final-CTA „Reden wir. Ohne Folien." lebt im globalen Footer.
 */
export default function UeberPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(UEBER_JSONLD) }}
      />
      <UeberHero />
      <div className="mx-auto w-full max-w-[var(--container-wide)] px-6 md:px-12" style={{ paddingTop: '32px' }}>
        <Breadcrumbs withJsonLd items={[{ label: 'Über' }]} />
      </div>
      <UeberStatement />
      <UeberTimeline />
      <UeberStack />
      <UeberMore />
    </>
  )
}
