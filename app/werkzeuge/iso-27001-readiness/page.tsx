import type { Metadata } from 'next'
import Section from '@/components/ui/Section'
import AccentGlow from '@/components/ui/AccentGlow'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import PageHero from '@/components/layout/PageHero'
import ItalicAccent from '@/components/ui/ItalicAccent'
import Assessment, { type AssessConfig } from '@/components/werkzeuge/Assessment'
import ToolInfo from '@/components/werkzeuge/ToolInfo'

export const metadata: Metadata = {
  title: 'ISO 27001 Readiness-Check',
  description:
    'Wie weit ist dein ISMS? Sechs Fragen zu Dokumentation, Risikomanagement, Assets, Notfall, Lieferkette und Awareness — du bekommst Reifegrad und die offenen Lücken.',
  alternates: { canonical: '/werkzeuge/iso-27001-readiness' },
}

const CONFIG: AssessConfig = {
  toolId: 'iso',
  trackName: 'werkzeug_iso_result',
  badgePrefix: 'ISMS-Reifegrad',
  flagLabel: 'Wo du noch nachlegen solltest',
  cta: { href: '/kontakt', event: 'cta_lagebild_werkzeug_iso', label: 'Gap-Analyse im Lagebild' },
  detail: { href: '/blog/iso-27001-2022-status', label: 'Was die 2022er-Fassung geändert hat' },
  disclaimer: 'Grobe Selbsteinschätzung, kein Audit. Die echte Reife zeigt erst eine Gap-Analyse gegen den Maßnahmenkatalog.',
  related: [
    { href: '/werkzeuge/nis2-betroffenheit', label: 'Bin ich von NIS2 betroffen?' },
    { href: '/lexikon/isms', label: 'Was ein ISMS ist' },
  ],
  bands: [
    { max: 3, name: 'Kurz vor reif', headline: 'Ihr seid nah dran.', note: 'Die Substanz steht weitgehend. Was fehlt, ist meist Dokumentation und Nachweis — der Rest ist Feinschliff Richtung Audit.' },
    { max: 8, name: 'Auf dem Weg', headline: 'Gutes Fundament, klare Lücken.', note: 'Einige Bausteine stehen, andere fehlen oder laufen informell. Eine Gap-Analyse macht daraus einen planbaren Fahrplan über 3–6 Monate.' },
    { max: 99, name: 'Am Anfang', headline: 'Noch Fundament zu legen.', note: 'Die Kernbausteine eines ISMS fehlen größtenteils. Das ist normal — wichtig ist, mit einem schlanken, zur Lage passenden System zu starten, nicht mit dem Zertifikat als Ziel.' },
  ],
  questions: [
    {
      key: 'isms', label: '01 · Habt ihr ein dokumentiertes ISMS?',
      options: [
        { value: 'ja', label: 'Ja, dokumentiert und gelebt', weight: 0 },
        { value: 'teil', label: 'Teilweise', weight: 2, flag: 'ISMS nur teilweise dokumentiert — Scope und Statement of Applicability schärfen.' },
        { value: 'nein', label: 'Nein', weight: 4, flag: 'Kein dokumentiertes ISMS — das ist das Fundament der Norm.' },
      ],
    },
    {
      key: 'risiko', label: '02 · Gibt es einen Risikomanagement-Prozess?',
      options: [
        { value: 'ja', label: 'Etabliert und wiederholbar', weight: 0 },
        { value: 'informell', label: 'Informell', weight: 2, flag: 'Risikomanagement läuft informell — es braucht einen nachvollziehbaren, wiederholbaren Prozess.' },
        { value: 'nein', label: 'Keiner', weight: 4, flag: 'Kein Risikomanagement-Prozess — Kern jeder Zertifizierung.' },
      ],
    },
    {
      key: 'assets', label: '03 · Habt ihr eine Asset- und Berechtigungsübersicht?',
      options: [
        { value: 'ja', label: 'Vollständig', weight: 0 },
        { value: 'teil', label: 'Teilweise', weight: 1, flag: 'Asset- und Berechtigungsübersicht ist lückenhaft.' },
        { value: 'nein', label: 'Keine', weight: 3, flag: 'Keine belastbare Asset-Übersicht — ohne sie ist Risikobewertung Raten.' },
      ],
    },
    {
      key: 'incident', label: '04 · Gibt es einen geübten Notfall-/Incident-Prozess?',
      options: [
        { value: 'ja', label: 'Dokumentiert und geübt', weight: 0 },
        { value: 'doku', label: 'Nur dokumentiert', weight: 1, flag: 'Notfallprozess existiert auf Papier, ist aber ungeübt.' },
        { value: 'nein', label: 'Keiner', weight: 3, flag: 'Kein geübter Incident-/Notfallprozess.' },
      ],
    },
    {
      key: 'lieferkette', label: '05 · Ist Lieferanten-/Dienstleister-Sicherheit geregelt?',
      options: [
        { value: 'ja', label: 'Ja, geregelt', weight: 0 },
        { value: 'teil', label: 'Teilweise', weight: 1, flag: 'Lieferanten-Sicherheit nur teilweise geregelt.' },
        { value: 'nein', label: 'Nein', weight: 2, flag: 'Lieferanten-/Dienstleister-Sicherheit ungeregelt — bei NIS2 doppelt relevant.' },
      ],
    },
    {
      key: 'awareness', label: '06 · Gibt es regelmäßige Awareness-Schulungen?',
      options: [
        { value: 'ja', label: 'Regelmäßig', weight: 0 },
        { value: 'sporadisch', label: 'Sporadisch', weight: 1, flag: 'Awareness nur sporadisch — Einmal-Schulungen verpuffen.' },
        { value: 'nein', label: 'Keine', weight: 2, flag: 'Keine Awareness-Schulungen.' },
      ],
    },
  ],
}

export default function Iso27001ReadinessPage() {
  return (
    <>
      <PageHero
        eyebrowNum="03"
        eyebrow="Werkzeug · ISO 27001"
        title={<>Wie weit ist dein <ItalicAccent>ISMS</ItalicAccent>?</>}
        lede="Sechs Fragen entlang der Kernbausteine eines Information-Security-Management-Systems. Am Ende steht dein grober Reifegrad und die Lücken, die zwischen dir und einem Audit liegen. Ohne Anmeldung."
        compact
      />
      <Section className="pb-32 pt-4 md:pb-44" background={<AccentGlow position="top-right" intensity="low" />}>
        <Breadcrumbs withJsonLd className="mb-12" items={[{ label: 'Werkzeuge', href: '/werkzeuge' }, { label: 'ISO 27001 Readiness' }]} />
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <Assessment config={CONFIG} />
        </div>
        <ToolInfo
          name="ISO 27001 Readiness-Check"
          path="/werkzeuge/iso-27001-readiness"
          description="Kostenloser Selbst-Check: Sechs Fragen entlang der ISMS-Kernbausteine zeigen den Reifegrad deines Unternehmens auf dem Weg zur ISO-27001-Zertifizierung."
          paragraphs={[
            'ISO 27001 zertifiziert kein Tool, sondern ein Management-System: den Prozess, mit dem ein Unternehmen Informationsrisiken erkennt, bewertet und behandelt. Dieser Check fragt die sechs Kernbausteine ab, an denen Audits in der Praxis hängen — dokumentiertes ISMS, Risikomanagement-Prozess, Asset- und Berechtigungsübersicht, geübter Notfallprozess, Lieferanten-Sicherheit und Awareness.',
            'Das Ergebnis ist ein ehrlicher Reifegrad in drei Stufen plus die Liste der Lücken, die zwischen dir und einem Audit liegen. Für viele Mittelständler kommt der Anstoß über Kundenanforderungen, Ausschreibungen oder NIS2 — der sinnvolle Weg ist dann ein schlankes, zur Lage passendes ISMS, nicht das Zertifikat als Selbstzweck.',
          ]}
          faq={[
            { q: 'Wie lange dauert der Weg zur ISO-27001-Zertifizierung?', a: 'Mit solidem Fundament typischerweise 3–6 Monate strukturierter Arbeit: Gap-Analyse, Lücken schließen, internes Audit, Zertifizierungs-Audit. Ohne Fundament entsprechend länger — entscheidend ist ein sauber abgegrenzter Scope.' },
            { q: 'Brauche ich als Mittelständler überhaupt ISO 27001?', a: 'Nicht immer als Zertifikat. Wenn Kunden, Ausschreibungen oder TISAX/NIS2 es verlangen: ja. Sonst lohnt oft zuerst ein schlankes ISMS ohne Zertifizierung — die Substanz zählt, das Siegel lässt sich nachziehen.' },
            { q: 'Was prüft dieser Check — und was nicht?', a: 'Er prüft die Management-Bausteine, nicht die 93 Einzel-Controls aus Anhang A. Für die braucht es eine echte Gap-Analyse gegen den Maßnahmenkatalog — der Check zeigt dir, ob sich die schon lohnt.' },
          ]}
        />
      </Section>
    </>
  )
}
