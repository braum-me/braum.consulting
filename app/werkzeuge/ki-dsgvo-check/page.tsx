import type { Metadata } from 'next'
import Section from '@/components/ui/Section'
import AccentGlow from '@/components/ui/AccentGlow'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import PageHero from '@/components/layout/PageHero'
import ItalicAccent from '@/components/ui/ItalicAccent'
import Assessment, { type AssessConfig } from '@/components/werkzeuge/Assessment'
import ToolInfo from '@/components/werkzeuge/ToolInfo'

export const metadata: Metadata = {
  title: 'KI & DSGVO: Darf ich dieses KI-Tool so nutzen?',
  description:
    'Kostenloser Schnellcheck: Fünf Fragen zu Datenart, AVV, Verarbeitungsort und Regeln zeigen als Ampel, ob dein KI-Einsatz datenschutzkonform aufgestellt ist.',
  alternates: { canonical: '/werkzeuge/ki-dsgvo-check' },
}

const CONFIG: AssessConfig = {
  toolId: 'ki-dsgvo',
  trackName: 'werkzeug_kidsgvo_result',
  badgePrefix: 'DSGVO-Ampel',
  flagLabel: 'Was zu klären ist',
  cta: { href: '/kontakt', event: 'cta_lagebild_werkzeug_kidsgvo', label: 'KI-Einsatz sauber aufsetzen' },
  detail: { href: '/lexikon/dsgvo', label: 'DSGVO im Lexikon' },
  disclaimer: 'Orientierung, keine Rechtsberatung. Die Bewertung im Einzelfall hängt an Tool, Vertrag und Datenart — im Zweifel gehört der Datenschutzbeauftragte an den Tisch.',
  related: [
    { href: '/werkzeuge/ki-readiness', label: 'Ist mein Betrieb bereit für KI?' },
    { href: '/lexikon/avv', label: 'Was ein AVV ist' },
  ],
  bands: [
    { max: 1, name: 'Grün', headline: 'Sieht sauber aus.', note: 'Datenart, Vertrag und Regeln passen zusammen. Bleib dran: Jedes neue Tool und jeder neue Use-Case durchläuft idealerweise denselben kurzen Check.' },
    { max: 5, name: 'Gelb', headline: 'Geht — aber mit offenen Flanken.', note: 'Der Einsatz ist nicht per se unzulässig, aber an ein, zwei Stellen fehlt die Absicherung. Die gute Nachricht: AVV, Datenregion und klare Regeln sind schnell nachgezogen.' },
    { max: 99, name: 'Rot', headline: 'So bitte nicht weitermachen.', note: 'In dieser Konstellation ist das Risiko real — für Betroffene und für den Betrieb. Das heißt nicht „KI verbieten", sondern: Setup ändern. Mit dem richtigen Vertrag, der richtigen Datenregion und klaren Regeln wird aus Rot meist schnell Grün.' },
  ],
  questions: [
    {
      key: 'daten', label: '01 · Welche Daten gehen in das KI-Tool?',
      options: [
        { value: 'keine', label: 'Keine personenbezogenen Daten', weight: 0 },
        { value: 'pbd', label: 'Personenbezogene Daten (Kunden, Mitarbeiter)', weight: 3, flag: 'Personenbezogene Daten im KI-Tool — ohne AVV und Rechtsgrundlage ein echtes Risiko.' },
        { value: 'sensibel', label: 'Sensible Daten (Gesundheit, Finanzen, Personal)', weight: 5, flag: 'Besonders schützenswerte Daten — hier gelten verschärfte Anforderungen, im Zweifel: nicht ohne DSB-Votum.' },
      ],
    },
    {
      key: 'avv', label: '02 · Gibt es einen AVV / Unternehmens-Vertrag mit dem Anbieter?',
      options: [
        { value: 'ja', label: 'Ja, Business-Vertrag mit AVV', weight: 0 },
        { value: 'unsicher', label: 'Weiß nicht', weight: 2, flag: 'AVV-Status unklar — ohne Auftragsverarbeitungs-Vertrag dürfen personenbezogene Daten nicht zum Anbieter.' },
        { value: 'nein', label: 'Nein, freie/private Accounts', weight: 4, flag: 'Freie oder private Accounts im Firmeneinsatz — kein AVV, oft Training auf euren Daten. Dringendster Fix.' },
      ],
    },
    {
      key: 'region', label: '03 · Wo verarbeitet das Tool die Daten?',
      options: [
        { value: 'eu', label: 'EU-Region / EU-Datenresidenz', weight: 0 },
        { value: 'unsicher', label: 'Weiß nicht', weight: 2, flag: 'Verarbeitungsort unklar — bei US-Verarbeitung braucht es zusätzliche Absicherung (z. B. Data Privacy Framework).' },
        { value: 'us', label: 'USA / außerhalb der EU', weight: 2, flag: 'Drittland-Verarbeitung — zulässig nur mit gültiger Transfer-Grundlage, das gehört geprüft und dokumentiert.' },
      ],
    },
    {
      key: 'regeln', label: '04 · Gibt es Regeln, was Mitarbeitende eingeben dürfen?',
      options: [
        { value: 'ja', label: 'Ja, klare KI-Richtlinie', weight: 0 },
        { value: 'muendlich', label: 'Mündlich / informell', weight: 1, flag: 'Nur informelle Regeln — eine kurze schriftliche KI-Richtlinie schützt Mitarbeitende und Betrieb.' },
        { value: 'nein', label: 'Keine', weight: 3, flag: 'Keine Eingabe-Regeln — dann landen früher oder später Kundendaten im falschen Tool.' },
      ],
    },
    {
      key: 'schatten', label: '05 · Nutzen Mitarbeitende KI-Tools auf eigene Faust?',
      options: [
        { value: 'nein', label: 'Nein, nur freigegebene Tools', weight: 0 },
        { value: 'vermutlich', label: 'Vermutlich ja', weight: 2, flag: 'KI-Schatten-IT wahrscheinlich — Verbote helfen nicht, ein freigegebenes gutes Tool plus Regeln schon.' },
        { value: 'ja', label: 'Ja, sicher', weight: 3, flag: 'Aktive KI-Schatten-IT — unkontrollierter Datenabfluss. Der Weg raus: gutes freigegebenes Angebot statt Verbotspolitik.' },
      ],
    },
  ],
}

export default function KiDsgvoCheckPage() {
  return (
    <>
      <PageHero
        eyebrowNum="09"
        eyebrow="Werkzeug · KI & DSGVO"
        title={<>Darf ich dieses KI-Tool so <ItalicAccent>nutzen</ItalicAccent>?</>}
        lede="Fünf Fragen zu Datenart, Vertrag, Verarbeitungsort und Regeln — als Ampel beantwortet. Keine Panikmache und kein Freibrief, sondern eine ehrliche erste Einordnung deines KI-Einsatzes."
        compact
      />
      <Section className="pb-32 pt-4 md:pb-44" background={<AccentGlow position="top-left" intensity="low" />}>
        <Breadcrumbs withJsonLd className="mb-12" items={[{ label: 'Werkzeuge', href: '/werkzeuge' }, { label: 'KI-DSGVO-Check' }]} />
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <Assessment config={CONFIG} />
        </div>
        <ToolInfo
          name="KI-DSGVO-Schnellcheck"
          path="/werkzeuge/ki-dsgvo-check"
          description="Kostenloser Schnellcheck: Fünf Fragen zeigen als Ampel, ob dein KI-Einsatz (ChatGPT, Copilot & Co.) datenschutzkonform aufgestellt ist — mit konkreten nächsten Schritten."
          paragraphs={[
            'Zwischen „KI ist bei uns verboten" und „jeder macht, was er will" liegt der Bereich, in dem die meisten Betriebe tatsächlich stehen — und beides ist riskant. Datenschutzkonform wird KI-Einsatz durch ein überschaubares Set an Bausteinen: wissen, welche Daten ins Tool gehen, ein Auftragsverarbeitungs-Vertrag mit dem Anbieter, geklärter Verarbeitungsort (idealerweise EU-Region), schriftliche Eingabe-Regeln und ein freigegebenes Angebot, das Schatten-Nutzung überflüssig macht.',
            'Dieser Check fragt genau diese fünf Punkte ab und antwortet als Ampel. Rot heißt dabei nicht „KI verbieten", sondern „Setup ändern": Mit Business-Vertrag statt Privat-Account, EU-Datenregion und einer kurzen Richtlinie wird aus den meisten roten Konstellationen schnell eine grüne.',
          ]}
          faq={[
            { q: 'Darf ich ChatGPT mit Kundendaten nutzen?', a: 'Mit einem freien Privat-Account: nein — kein AVV, und Eingaben können fürs Training verwendet werden. Mit Business-/Enterprise-Verträgen inklusive AVV und abgeschaltetem Training ist der Einsatz gestaltbar, sofern Rechtsgrundlage und Datenart passen.' },
            { q: 'Was ist ein AVV und warum brauche ich ihn?', a: 'Der Auftragsverarbeitungs-Vertrag regelt, dass der Anbieter deine Daten nur nach deiner Weisung verarbeitet. Sobald personenbezogene Daten in ein Tool fließen, ist er Pflicht — bei Business-Tarifen der großen Anbieter ist er Teil des Vertrags.' },
            { q: 'Reicht es, KI-Tools einfach zu verbieten?', a: 'Praktisch nein. Verbote erzeugen Schatten-Nutzung über private Geräte — unkontrollierter als jede geregelte Lösung. Wirksamer: ein gutes freigegebenes Tool, klare Eingabe-Regeln und kurze Schulung.' },
          ]}
        />
      </Section>
    </>
  )
}
