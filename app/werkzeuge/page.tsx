import type { Metadata } from 'next'
import Section from '@/components/ui/Section'
import AccentGlow from '@/components/ui/AccentGlow'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import PageHero from '@/components/layout/PageHero'
import ItalicAccent from '@/components/ui/ItalicAccent'
import ToolHubGrid from '@/components/werkzeuge/ToolHubGrid'

export const metadata: Metadata = {
  title: 'Werkzeuge',
  description:
    'Kleine Selbst-Checks für den Einstieg: NIS2-Betroffenheit, M365-Migrationsaufwand, ISO-27001-Reifegrad, KI-Readiness und Microsoft 365 vs. Google Workspace. Ohne Anmeldung, in zwei Minuten.',
  alternates: { canonical: '/werkzeuge' },
}

export default function WerkzeugePage() {
  return (
    <>
      <PageHero
        eyebrowNum="—"
        eyebrow="Werkzeuge"
        title={<>Erst mal selbst <ItalicAccent>sortieren</ItalicAccent>.</>}
        lede="Ein paar kleine Selbst-Checks für den Einstieg. Sie ersetzen kein Lagebild, aber sie geben dir in zwei Minuten eine ehrliche erste Orientierung — ohne Anmeldung, ohne dass etwas gespeichert wird."
        compact
      />

      <Section
        className="pb-32 pt-4 md:pb-44"
        background={<AccentGlow position="spread" intensity="low" />}
      >
        <Breadcrumbs withJsonLd className="mb-12" items={[{ label: 'Werkzeuge' }]} />

        <ToolHubGrid />
      </Section>
    </>
  )
}
