import type { Metadata } from 'next'
import Section from '@/components/ui/Section'
import AccentGlow from '@/components/ui/AccentGlow'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import PageHero from '@/components/layout/PageHero'
import ItalicAccent from '@/components/ui/ItalicAccent'
import M365Estimator from '@/components/werkzeuge/M365Estimator'
import ToolInfo from '@/components/werkzeuge/ToolInfo'

export const metadata: Metadata = {
  title: 'M365-Migration: Aufwand einschätzen',
  description:
    'Was treibt deine Microsoft-365-Migration? Fünf Fragen zu Ausgangslage, Nutzern, Identität, Compliance und Ziel — du bekommst Komplexität und Dauer eingeordnet. Ehrlich, ohne erfundene Zahl.',
  alternates: { canonical: '/werkzeuge/m365-migration-kosten' },
}

export default function M365KostenPage() {
  return (
    <>
      <PageHero
        eyebrowNum="02"
        eyebrow="Werkzeug · M365"
        title={<>Was treibt deine <ItalicAccent>Migration</ItalicAccent>?</>}
        lede="Fünf Fragen zu deiner Ausgangslage. Statt einer erfundenen Euro-Zahl bekommst du eine ehrliche Einordnung von Komplexität und Dauer — und die Treiber, an denen der Preis wirklich hängt. Den Festpreis macht ein Lagebild fest."
        compact
      />

      <Section
        className="pb-32 pt-4 md:pb-44"
        background={<AccentGlow position="top-left" intensity="low" />}
      >
        <Breadcrumbs
          withJsonLd
          className="mb-12"
          items={[{ label: 'Werkzeuge', href: '/werkzeuge' }, { label: 'M365-Migration' }]}
        />
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <M365Estimator />
        </div>
        <ToolInfo
          name="M365-Migrationsaufwand-Rechner"
          path="/werkzeuge/m365-migration-kosten"
          description="Kostenloser Selbst-Check: Fünf Fragen zur Ausgangslage ordnen Komplexität und Dauer einer Microsoft-365-Migration ein — ehrlich, ohne erfundene Pauschale."
          paragraphs={[
            'Was kostet eine Microsoft-365-Migration? Die ehrliche Antwort: Es hängt an fünf Treibern — Ausgangslage (Altlast, Schatten-IT), Datenmenge und Postfächer, Identität und Berechtigungen, Compliance-Anforderungen und dem Ziel (Lift-and-Shift oder modernisieren). Zwei Betriebe mit gleicher Mitarbeiterzahl können beim Aufwand um den Faktor drei auseinanderliegen. Genau deshalb nennt dieses Werkzeug bewusst keine Euro-Pauschale, sondern ordnet deine Lage in ein Komplexitätsband mit realistischer Wochen-Range ein.',
            'Du beantwortest fünf Fragen zu deiner heutigen Umgebung und siehst sofort, welche Treiber bei dir den Aufwand hochziehen — und woran sich sparen lässt (Altdaten) und woran nicht (Berechtigungskonzept, Adoption). Der Festpreis entsteht danach in einem Lagebild: Bestandsaufnahme, Risiken, Aufwand pro Phase.',
          ]}
          faq={[
            { q: 'Warum nennt der Rechner keinen Preis in Euro?', a: 'Weil eine seriöse Zahl ohne Blick in deine Umgebung nicht möglich ist. Wer pauschale Festpreise ohne Bestandsaufnahme nennt, rechnet entweder hohe Risikoaufschläge ein oder erlebt Überraschungen. Komplexität und Dauer lassen sich dagegen ehrlich einordnen.' },
            { q: 'Wie lange dauert eine M365-Migration im Mittelstand?', a: 'Je nach Ausgangslage zwischen etwa 4 und 20+ Wochen: schlanke Umgebungen mit sauberer Identität migrieren in Wochen, gewachsene Multi-Standort-Landschaften mit mehreren Active Directories brauchen ein mehrphasiges Programm mit Co-Existence-Phase.' },
            { q: 'Was ist der am meisten unterschätzte Kostentreiber?', a: 'Identität und Berechtigungen. Mehrere lokale Verzeichnisse auf eine zentrale Entra-ID-Identität zu konsolidieren ist aufwendig — aber das Fundament, ohne das später weder Sicherheit noch Copilot sauber funktionieren.' },
          ]}
        />
      </Section>
    </>
  )
}
