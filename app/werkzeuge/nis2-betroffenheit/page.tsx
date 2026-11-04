import type { Metadata } from 'next'
import Section from '@/components/ui/Section'
import AccentGlow from '@/components/ui/AccentGlow'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import PageHero from '@/components/layout/PageHero'
import ItalicAccent from '@/components/ui/ItalicAccent'
import Nis2Check from '@/components/werkzeuge/Nis2Check'
import ToolInfo from '@/components/werkzeuge/ToolInfo'

export const metadata: Metadata = {
  title: 'NIS2-Betroffenheit prüfen',
  description:
    'Bin ich von NIS2 betroffen? Drei Fragen zu Größe, Sektor und Lieferkette — und du weißt, ob du direkt, mittelbar oder gar nicht betroffen bist. Plus die nächsten Schritte.',
  alternates: { canonical: '/werkzeuge/nis2-betroffenheit' },
}

export default function Nis2BetroffenheitPage() {
  return (
    <>
      <PageHero
        eyebrowNum="01"
        eyebrow="Werkzeug · NIS2"
        title={<>Bin ich von NIS2 <ItalicAccent>betroffen</ItalicAccent>?</>}
        lede="Drei Fragen zu Größe, Sektor und Lieferkette. Am Ende steht eine erste, ehrliche Einordnung — direkt betroffen, mittelbar über die Lieferkette, oder aktuell außen vor. Keine Anmeldung, nichts wird gespeichert."
        compact
      />

      <Section
        className="pb-32 pt-4 md:pb-44"
        background={<AccentGlow position="top-right" intensity="low" />}
      >
        <Breadcrumbs
          withJsonLd
          className="mb-12"
          items={[{ label: 'Werkzeuge', href: '/werkzeuge' }, { label: 'NIS2-Betroffenheit' }]}
        />
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <Nis2Check />
        </div>
        <ToolInfo
          name="NIS2-Betroffenheits-Check"
          path="/werkzeuge/nis2-betroffenheit"
          description="Kostenloser Selbst-Check: In drei Fragen zu Größe, Sektor und Lieferkette prüfen, ob dein Unternehmen von der NIS2-Richtlinie betroffen ist."
          paragraphs={[
            'NIS2 weitet die EU-Cybersicherheitspflichten auf 18 Sektoren aus — vom verarbeitenden Gewerbe über Lebensmittel bis zu digitalen Diensten. Dieser Check prüft die drei Kriterien, an denen die Betroffenheit wirklich hängt: Unternehmensgröße (ab etwa 50 Mitarbeitenden oder 10 Mio. € Jahresumsatz), Sektor-Zugehörigkeit nach den NIS2-Anhängen und die meistübersehene Frage — ob du als Zulieferer eines betroffenen Unternehmens die Anforderungen über Kundenverträge durchgereicht bekommst.',
            'Das Ergebnis ist eine erste Einordnung in vier Stufen: direkt betroffen als wesentliche oder wichtige Einrichtung, mittelbar über die Lieferkette, Graubereich, oder aktuell außen vor. Dazu bekommst du die jeweils sinnvollen nächsten Schritte. Alles läuft im Browser — keine Anmeldung, nichts wird gespeichert.',
          ]}
          faq={[
            { q: 'Ab wann ist ein Unternehmen von NIS2 betroffen?', a: 'Die Faustregel: mindestens 50 Mitarbeitende oder mehr als 10 Mio. € Jahresumsatz in einem der 18 gelisteten Sektoren. Besonders kritische Anbieter können auch darunter pflichtig sein, und Konzern-Verflechtungen zählen mit.' },
            { q: 'Bin ich als Zulieferer auch betroffen?', a: 'Sehr oft ja — mittelbar. Lieferketten-Sicherheit ist eine Kernpflicht der direkt Betroffenen, und die reichen ihre Anforderungen über Verträge und Lieferanten-Fragebögen an dich weiter, unabhängig von deiner Größe.' },
            { q: 'Brauche ich für NIS2 ein Zertifikat?', a: 'Nein. NIS2 verlangt belegbare Maßnahmen (Risikomanagement, Meldewege, Notfallvorsorge), kein Zertifikat. Eine bestehende ISO-27001-Struktur deckt allerdings rund 70–80 % der Anforderungen ab.' },
            { q: 'Ist dieses Ergebnis rechtsverbindlich?', a: 'Nein — es ist eine fundierte Orientierung, keine Rechtsberatung. Die finale Einstufung hängt am Einzelfall, etwa an der konkreten Sektor-Definition und Konzernstrukturen.' },
          ]}
        />
      </Section>
    </>
  )
}
