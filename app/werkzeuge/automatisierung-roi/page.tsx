import type { Metadata } from 'next'
import Section from '@/components/ui/Section'
import AccentGlow from '@/components/ui/AccentGlow'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import PageHero from '@/components/layout/PageHero'
import ItalicAccent from '@/components/ui/ItalicAccent'
import RoiRechner from '@/components/werkzeuge/RoiRechner'
import ToolInfo from '@/components/werkzeuge/ToolInfo'

export const metadata: Metadata = {
  title: 'Automatisierungs-ROI: Was spart Automatisierung wirklich?',
  description:
    'Kostenloser Rechner: Häufigkeit, Dauer und Beteiligte eines wiederkehrenden Ablaufs eingeben — und sehen, wie viele Stunden und Arbeitstage Automatisierung pro Jahr spart.',
  alternates: { canonical: '/werkzeuge/automatisierung-roi' },
}

export default function AutomatisierungRoiPage() {
  return (
    <>
      <PageHero
        eyebrowNum="08"
        eyebrow="Werkzeug · Automatisierung"
        title={<>Was spart Automatisierung <ItalicAccent>wirklich</ItalicAccent>?</>}
        lede="Nimm einen wiederkehrenden Ablauf — Rechnungsfreigabe, Datenübertragung, Status-Mails — und rechne in 30 Sekunden aus, wie viele Stunden pro Jahr drinstecken. Konservativ gerechnet, in Zeit statt in geratenen Euros."
        compact
      />
      <Section className="pb-32 pt-4 md:pb-44" background={<AccentGlow position="top-right" intensity="low" />}>
        <Breadcrumbs withJsonLd className="mb-12" items={[{ label: 'Werkzeuge', href: '/werkzeuge' }, { label: 'Automatisierungs-ROI' }]} />
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <RoiRechner />
        </div>
        <ToolInfo
          name="Automatisierungs-ROI-Rechner"
          path="/werkzeuge/automatisierung-roi"
          description="Kostenloser Rechner: Wie viele Stunden und Arbeitstage pro Jahr spart die Automatisierung eines wiederkehrenden Ablaufs? Konservativ gerechnet, ohne geratene Euro-Werte."
          paragraphs={[
            'Der direkteste ROI im Mittelstand steckt selten in KI-Leuchttürmen, sondern in den unscheinbaren Routine-Abläufen: Daten von einem System ins nächste tippen, Freigaben nachjagen, immer dieselben Mails schreiben. Dieser Rechner macht das Potenzial greifbar — Häufigkeit × Dauer × Beteiligte × realistischer Automatisierungsgrad, konservativ mit 46 Arbeitswochen gerechnet.',
            'Bewusst rechnen wir in Stunden und Arbeitstagen statt in Euro: Die Zeitersparnis ist ehrlich kalkulierbar, ein Stundensatz wäre geraten. Ob sich die Automatisierung lohnt, entscheidet dann der Vergleich mit dem Bau-Aufwand — viele Abläufe sind mit Power Automate oder n8n in Tagen automatisiert, manche brauchen mehr. Genau das klärt ein kurzer Blick auf den Prozess.',
          ]}
          faq={[
            { q: 'Welche Prozesse lohnen sich am ehesten?', a: 'Häufig, regelbasiert, nervig: Rechnungs- und Urlaubsfreigaben, Datenübertragung zwischen Systemen, Status-Benachrichtigungen, Berichts-Erstellung. Faustregel: Was öfter als 10× pro Woche passiert und einem festen Muster folgt, ist ein Kandidat.' },
            { q: 'Brauche ich dafür KI?', a: 'Meistens nicht. Ein großer Teil der Routine ist klassische Workflow-Automatisierung ohne Sprachmodell — direkter ROI ohne KI-Risiken. KI kommt dazu, wo unstrukturierte Inhalte im Spiel sind: Mails klassifizieren, Dokumente zusammenfassen.' },
            { q: 'Wie realistisch sind die berechneten Stunden?', a: 'Der Rechner ist bewusst konservativ (46 Arbeitswochen, gewählter Automatisierungsgrad statt 100 %). Die echte Ersparnis hängt davon ab, wie sauber der Prozess definiert ist — chaotische Abläufe muss man erst ordnen, dann automatisieren.' },
          ]}
        />
      </Section>
    </>
  )
}
