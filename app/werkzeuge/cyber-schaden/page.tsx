import type { Metadata } from 'next'
import Section from '@/components/ui/Section'
import AccentGlow from '@/components/ui/AccentGlow'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import PageHero from '@/components/layout/PageHero'
import ItalicAccent from '@/components/ui/ItalicAccent'
import CyberSchaden from '@/components/werkzeuge/CyberSchaden'
import ToolInfo from '@/components/werkzeuge/ToolInfo'
import NextTools from '@/components/werkzeuge/NextTools'

export const metadata: Metadata = {
  title: 'Was kostet ein Cyber-Vorfall?',
  description:
    'Was kostet ein Tag IT-Stillstand? Drei Angaben zu Umsatz, IT-Abhängigkeit und Vorbereitung — du bekommst eine grobe Schadens-Größenordnung für einen ernsten Ausfall wie Ransomware.',
  alternates: { canonical: '/werkzeuge/cyber-schaden' },
}

export default function CyberSchadenPage() {
  return (
    <>
      <PageHero
        eyebrowNum="11"
        eyebrow="Werkzeug · Risiko"
        title={<>Was kostet ein Tag <ItalicAccent>Stillstand</ItalicAccent>?</>}
        lede="Drei Angaben zu Umsatz, IT-Abhängigkeit und Vorbereitung — und du siehst die grobe Größenordnung, die ein ernster IT-Ausfall kosten kann. Nicht zum Angstmachen, sondern um zu zeigen, worum es bei Vorsorge wirklich geht."
        compact
      />
      <Section className="pb-32 pt-4 md:pb-44" background={<AccentGlow position="top-right" intensity="low" />}>
        <Breadcrumbs withJsonLd className="mb-12" items={[{ label: 'Werkzeuge', href: '/werkzeuge' }, { label: 'Cyber-Schaden' }]} />
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <CyberSchaden />
        </div>
        <ToolInfo
          name="Cyber-Schadens-Simulator"
          path="/werkzeuge/cyber-schaden"
          description="Kostenloser Selbst-Check: Schätzt die finanzielle Größenordnung eines ernsten IT-Ausfalls (z. B. Ransomware) aus Umsatz, IT-Abhängigkeit und Vorbereitungsgrad."
          paragraphs={[
            'Was kostet ein Cyber-Vorfall? Die teuerste Position ist selten das Lösegeld, sondern der Stillstand: Tage, an denen Produktion, Vertrieb und Abwicklung stehen. Dieser Rechner schätzt die Größenordnung aus drei Faktoren — eurem Jahresumsatz (als Basis für den Tagesumsatz), wie stark euer Geschäft von der IT abhängt, und wie gut ihr auf den Ernstfall vorbereitet seid. Letzteres entscheidet über die Ausfalldauer: Ein geübter Wiederanlauf bringt euch in ein bis zwei Tagen zurück, ein ungeübter Plan dehnt den Stillstand schnell auf Wochen.',
            'Das Ergebnis ist bewusst eine Spanne und keine exakte Zahl — es soll zeigen, in welcher Liga sich das Risiko bewegt. Dazu kommen Wiederherstellung, Forensik und Krisenkommunikation, die selbst im Mittelstand schnell fünf- bis sechsstellig werden. Genau diese Summe federn ein getesteter Notfallplan (Business Continuity Management) und eine Cyber-Versicherung ab — vorausgesetzt, das Sicherheits-Mindestniveau steht vorher.',
          ]}
          faq={[
            { q: 'Was ist der größte Kostenfaktor bei einem Cyber-Vorfall?', a: 'Meist der Betriebsstillstand. Der Umsatzausfall über mehrere Tage übersteigt in der Regel die direkten Wiederherstellungskosten und ein eventuelles Lösegeld deutlich.' },
            { q: 'Wie lange steht ein Betrieb nach einem Ransomware-Angriff still?', a: 'Sehr unterschiedlich: Mit getestetem Backup und geübtem Notfallplan oft ein bis zwei Tage, ohne geübten Plan nicht selten ein bis drei Wochen, bis der Kernbetrieb wieder läuft.' },
            { q: 'Senkt eine Cyber-Versicherung das Risiko?', a: 'Sie federt den finanziellen Schaden ab, verhindert den Vorfall aber nicht. Versicherer verlangen zudem zunehmend Mindestmaßnahmen wie MFA, getestete Backups und Patch-Management — sonst gibt es keine oder nur eingeschränkte Leistung.' },
            { q: 'Sind die berechneten Zahlen verbindlich?', a: 'Nein — es ist eine grobe Modellrechnung zur Einordnung, kein Gutachten. Vertragsstrafen, Reputationsschaden und Bußgelder sind nicht enthalten und können den realen Schaden deutlich erhöhen.' },
          ]}
        />
        <NextTools current="/werkzeuge/cyber-schaden" />
      </Section>
    </>
  )
}
