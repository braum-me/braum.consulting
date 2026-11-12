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
    'Zwölf kostenlose Selbst-Checks in vier Bereichen: Website, Microsoft 365 und Workspace, KI und Automatisierung, Sicherheit und NIS2. Ohne Anmeldung.',
  alternates: { canonical: '/werkzeuge' },
}

export default function WerkzeugePage() {
  return (
    <>
      <PageHero
        eyebrowNum="—"
        eyebrow="Werkzeuge"
        title={<>Erst mal selbst <ItalicAccent>sortieren</ItalicAccent>.</>}
        lede="Zwölf kleine Selbst-Checks in vier Bereichen. Sie ersetzen kein Lagebild, aber sie geben dir in zwei Minuten eine ehrliche erste Orientierung — ohne Anmeldung, ohne dass etwas gespeichert wird."
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
