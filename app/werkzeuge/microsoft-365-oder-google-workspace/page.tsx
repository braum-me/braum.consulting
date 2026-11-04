import type { Metadata } from 'next'
import Section from '@/components/ui/Section'
import AccentGlow from '@/components/ui/AccentGlow'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import PageHero from '@/components/layout/PageHero'
import ItalicAccent from '@/components/ui/ItalicAccent'
import Assessment, { type AssessConfig } from '@/components/werkzeuge/Assessment'
import ToolInfo from '@/components/werkzeuge/ToolInfo'

export const metadata: Metadata = {
  title: 'Microsoft 365 oder Google Workspace?',
  description:
    'Welche Cloud-Suite passt zu deinem Betrieb? Sechs Fragen zu Stack, Arbeitsweise, Compliance und IT — du bekommst eine ehrliche Tendenz, vendor-neutral und ohne Religionskrieg.',
  alternates: { canonical: '/werkzeuge/microsoft-365-oder-google-workspace' },
}

const CONFIG: AssessConfig = {
  toolId: 'workspace',
  trackName: 'werkzeug_workspace_result',
  badgePrefix: 'Tendenz',
  flagLabel: 'Was deine Antworten nahelegen',
  cta: { href: '/kontakt', event: 'cta_lagebild_werkzeug_workspace', label: 'Im Lagebild absichern' },
  detail: { href: '/leistungen/m365', label: 'Wie ich beides einführe' },
  disclaimer: 'Eine Tendenz, keine Entscheidung. Den Ausschlag geben oft Details, die ein Lagebild klärt — Lizenzkosten, Spezialsoftware, Migrationsaufwand.',
  related: [
    { href: '/werkzeuge/m365-migration-kosten', label: 'Was treibt meine Migration?' },
    { href: '/werkzeuge/ai-stack-fit', label: 'Welcher KI-Stack passt zu dir?' },
  ],
  bands: [
    { max: -3, name: 'Eher Google Workspace', headline: 'Tendenz: Google Workspace.', note: 'Deine Antworten sprechen für die schlanke, browser-first Suite. Schnell startklar, wenig Verwaltungslast — gerade ohne große eigene IT.' },
    { max: 2, name: 'Kommt auf die Details an', headline: 'Kein klarer Sieger — es kommt auf Details an.', note: 'Beide Suiten passen grundsätzlich. Den Ausschlag geben jetzt Feinheiten: vorhandene Lizenzen, Spezialsoftware, Migrationsaufwand, Team-Gewohnheiten.' },
    { max: 99, name: 'Eher Microsoft 365', headline: 'Tendenz: Microsoft 365.', note: 'Deine Antworten sprechen für den Microsoft-Stack — tiefe Office-Integration, Governance über Entra und Intune, eingespielte Standards in regulierten Umfeldern.' },
  ],
  questions: [
    {
      key: 'stack', label: '01 · Womit arbeitet ihr heute überwiegend?',
      options: [
        { value: 'ms', label: 'Microsoft / Office', weight: 2, flag: 'Bestehende Microsoft-Welt — Wechselkosten sprechen für M365.' },
        { value: 'google', label: 'Google / Gmail', weight: -2, flag: 'Schon im Google-Kosmos — Workspace ist der nahtlose Weg.' },
        { value: 'mix', label: 'Gemischt oder Neustart', weight: 0 },
      ],
    },
    {
      key: 'office', label: '02 · Wie wichtig ist Desktop-Office (Excel-Tiefe, Makros)?',
      options: [
        { value: 'sehr', label: 'Sehr wichtig', weight: 2, flag: 'Tiefe Excel-/Office-Nutzung spricht klar für Microsoft 365.' },
        { value: 'etwas', label: 'Etwas', weight: 0 },
        { value: 'browser', label: 'Browser reicht uns', weight: -2, flag: 'Browser-first-Arbeit passt zu Google Workspace.' },
      ],
    },
    {
      key: 'collab', label: '03 · Wie arbeitet ihr zusammen?',
      options: [
        { value: 'realtime', label: 'Viel Echtzeit-Co-Editing im Browser', weight: -1, flag: 'Echtzeit-Kollaboration ist eine Stärke von Google.' },
        { value: 'docs', label: 'Klassisch über Dokumente, Teams, SharePoint', weight: 1, flag: 'Teams- und SharePoint-Welt spricht für Microsoft.' },
      ],
    },
    {
      key: 'compliance', label: '04 · Viel Regulatorik, Behörden- oder Industrie-Umfeld?',
      options: [
        { value: 'ja', label: 'Ja, reguliert / Industrie', weight: 2, flag: 'Regulierte und Industrie-Umfelder sind oft auf Microsoft-Standards eingespielt (Entra, Intune, Purview).' },
        { value: 'nein', label: 'Eher nicht, wir sind tech-affin', weight: -1, flag: 'Wenig Regulatorik — Google Workspace ist schlank und schnell.' },
      ],
    },
    {
      key: 'it', label: '05 · Habt ihr eigene IT, die das betreut?',
      options: [
        { value: 'ja', label: 'Ja, eigene IT', weight: 1, flag: 'Eigene IT kann die Tiefe von M365 (Entra, Intune) heben.' },
        { value: 'nein', label: 'Nein, soll einfach laufen', weight: -1, flag: 'Ohne eigene IT punktet Google mit weniger Verwaltungslast.' },
      ],
    },
    {
      key: 'size', label: '06 · Wie groß ist das Team?',
      options: [
        { value: 's', label: 'Unter 25', weight: -1, flag: 'Kleine Teams kommen mit Google oft schneller los.' },
        { value: 'm', label: '25–250', weight: 0 },
        { value: 'l', label: 'Über 250', weight: 1, flag: 'Größere Organisationen profitieren von M365-Governance.' },
      ],
    },
  ],
}

export default function WorkspaceDecisionPage() {
  return (
    <>
      <PageHero
        eyebrowNum="05"
        eyebrow="Werkzeug · Cloud-Suite"
        title={<>Microsoft 365 oder <ItalicAccent>Google</ItalicAccent> Workspace?</>}
        lede="Sechs Fragen zu Stack, Arbeitsweise, Compliance und IT. Am Ende steht eine ehrliche Tendenz — vendor-neutral, ohne Religionskrieg. Beide Suiten sind gut; es geht darum, was zu deinem Haus passt."
        compact
      />
      <Section className="pb-32 pt-4 md:pb-44" background={<AccentGlow position="top-right" intensity="low" />}>
        <Breadcrumbs withJsonLd className="mb-12" items={[{ label: 'Werkzeuge', href: '/werkzeuge' }, { label: 'M365 oder Google Workspace' }]} />
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <Assessment config={CONFIG} />
        </div>
        <ToolInfo
          name="Microsoft 365 oder Google Workspace — Entscheidungshelfer"
          path="/werkzeuge/microsoft-365-oder-google-workspace"
          description="Kostenloser Vergleich: Sechs Fragen zu Stack, Arbeitsweise, Compliance und IT liefern eine vendor-neutrale Tendenz zwischen Microsoft 365 und Google Workspace."
          paragraphs={[
            'Microsoft 365 oder Google Workspace — die Frage ist keine Glaubensfrage, sondern eine Passfrage. M365 punktet mit tiefer Office-Integration, Governance über Entra ID und Intune und eingespielten Standards in regulierten Umfeldern. Workspace punktet mit Browser-first-Kollaboration, geringer Verwaltungslast und schnellem Start. Beide sind gut — entscheidend ist, was zu deinem Haus passt.',
            'Dieser Check gewichtet sechs Faktoren: bestehender Stack, Office-Tiefe (Excel, Makros), Art der Zusammenarbeit, Regulatorik, eigene IT und Teamgröße. Heraus kommt eine ehrliche Tendenz — oder das ebenso ehrliche „kommt auf Details an". Den Ausschlag geben dann Lizenzkosten, Spezialsoftware und Migrationsaufwand, die ein Lagebild klärt.',
          ]}
          faq={[
            { q: 'Was ist günstiger — Microsoft 365 oder Google Workspace?', a: 'Auf dem Lizenzpreis nehmen sich vergleichbare Stufen wenig. Die echten Kostenunterschiede entstehen durch Verwaltungsaufwand, benötigte Zusatzdienste und wie gut die Suite zur Arbeitsweise passt — eine schlecht passende Suite ist immer die teuerste.' },
            { q: 'Geht Google Workspace auch in regulierten Branchen?', a: 'Grundsätzlich ja — Datenresidenz und Compliance-Funktionen existieren. In der Praxis sind Industrie- und Behörden-Umfelder aber oft auf Microsoft-Standards (Entra, Intune, Purview) eingespielt, was Audits und Zusammenarbeit vereinfacht.' },
            { q: 'Kann ich später noch wechseln?', a: 'Ja, aber ein Suite-Wechsel ist eine echte Migration mit Aufwand. Deshalb lohnt die Passfrage am Anfang — und bei Unentschieden ein Lagebild, bevor Fakten geschaffen werden.' },
          ]}
        />
      </Section>
    </>
  )
}
