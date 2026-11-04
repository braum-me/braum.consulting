import type { Metadata } from 'next'
import Section from '@/components/ui/Section'
import AccentGlow from '@/components/ui/AccentGlow'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import PageHero from '@/components/layout/PageHero'
import ItalicAccent from '@/components/ui/ItalicAccent'
import Assessment, { type AssessConfig } from '@/components/werkzeuge/Assessment'
import ToolInfo from '@/components/werkzeuge/ToolInfo'

export const metadata: Metadata = {
  title: 'KI-Readiness-Check für den Mittelstand',
  description:
    'Ist dein Betrieb bereit für Copilot und KI? Sechs Fragen zu Berechtigungen, Datenklassifizierung, Identität, Use-Cases, Governance und Adoption — mit ehrlichem Reifegrad.',
  alternates: { canonical: '/werkzeuge/ki-readiness' },
}

const CONFIG: AssessConfig = {
  toolId: 'ki',
  trackName: 'werkzeug_ki_result',
  badgePrefix: 'KI-Reifegrad',
  flagLabel: 'Was vor dem KI-Start zu klären ist',
  cta: { href: '/kontakt', event: 'cta_lagebild_werkzeug_ki', label: 'KI-Readiness im Lagebild' },
  detail: { href: '/blog/copilot-fuer-kmu', label: 'Copilot-Rollout in der Praxis' },
  disclaimer: 'Grobe Selbsteinschätzung, keine Audit-Aussage. Den konkreten Stand zeigt ein Blick in deinen Tenant.',
  related: [
    { href: '/werkzeuge/ai-stack-fit', label: 'Welcher KI-Stack passt zu dir?' },
    { href: '/lexikon/copilot', label: 'Copilot im Lexikon' },
  ],
  bands: [
    { max: 3, name: 'Startklar', headline: 'Ihr seid startklar.', note: 'Das Fundament steht — Berechtigungen, Identität, Governance. Jetzt geht es um die richtigen Use-Cases und einen sauberen Rollout.' },
    { max: 8, name: 'Fast startklar', headline: 'Mit etwas Vorbereitung startklar.', note: 'Die Basis ist da, ein paar Lücken bremsen noch. Meist in wenigen Wochen geschlossen — danach trägt der KI-Einsatz.' },
    { max: 99, name: 'Noch nicht startklar', headline: 'Erst das Fundament, dann KI.', note: 'Wichtige Voraussetzungen fehlen noch. KI ohne dieses Fundament liefert entweder Floskeln oder ein Datenschutz-Problem. Der Weg dahin ist klar und überschaubar.' },
  ],
  questions: [
    {
      key: 'berechtigungen', label: '01 · Sind Berechtigungen (SharePoint, Dateien) aufgeräumt?',
      options: [
        { value: 'ja', label: 'Ja, sauber', weight: 0 },
        { value: 'teil', label: 'Teilweise', weight: 2, flag: 'Berechtigungen nur teilweise aufgeräumt — Copilot legt Oversharing gnadenlos offen.' },
        { value: 'nein', label: 'Eher nicht', weight: 4, flag: 'Berechtigungen ungeklärt — der häufigste Grund, warum Copilot zum Datenschutz-Problem wird.' },
      ],
    },
    {
      key: 'klassifizierung', label: '02 · Sind sensible Daten klassifiziert / markiert?',
      options: [
        { value: 'ja', label: 'Ja', weight: 0 },
        { value: 'teil', label: 'Teilweise', weight: 1, flag: 'Sensible Daten nur teilweise klassifiziert.' },
        { value: 'nein', label: 'Nein', weight: 3, flag: 'Keine Datenklassifizierung — KI kann nicht wissen, was sie nicht zitieren darf.' },
      ],
    },
    {
      key: 'identitaet', label: '03 · Ist die Identität sauber (MFA, ein Login pro Person)?',
      options: [
        { value: 'ja', label: 'Ja', weight: 0 },
        { value: 'teil', label: 'Teilweise', weight: 1, flag: 'Identität nicht durchgängig sauber (MFA, ein Login pro Person).' },
        { value: 'nein', label: 'Unklar', weight: 3, flag: 'Identitätsbasis unklar — Fundament für jeden sicheren KI-Einsatz.' },
      ],
    },
    {
      key: 'usecases', label: '04 · Gibt es konkrete Use-Cases?',
      options: [
        { value: 'ja', label: 'Ja, definiert', weight: 0 },
        { value: 'vage', label: 'Vage', weight: 1, flag: 'Use-Cases nur vage — ohne konkrete Anwendungsfälle verpufft die Lizenz.' },
        { value: 'nein', label: 'Nein', weight: 2, flag: 'Keine definierten Use-Cases.' },
      ],
    },
    {
      key: 'governance', label: '05 · Sind AVV, Governance und Datenschutz geklärt?',
      options: [
        { value: 'ja', label: 'Geklärt', weight: 0 },
        { value: 'teil', label: 'Teilweise', weight: 1, flag: 'Governance/Datenschutz nur teilweise geklärt.' },
        { value: 'nein', label: 'Nein', weight: 2, flag: 'Keine KI-Governance / kein AVV — rechtliches Risiko.' },
      ],
    },
    {
      key: 'adoption', label: '06 · Ist die Einführung (Adoption, Champions) geplant?',
      options: [
        { value: 'ja', label: 'Geplant', weight: 0 },
        { value: 'vage', label: 'Vage', weight: 1, flag: 'Adoption nicht durchdacht — ohne Champions verstaubt die Lizenz.' },
        { value: 'nein', label: 'Nein', weight: 1, flag: 'Keine Adoption geplant.' },
      ],
    },
  ],
}

export default function KiReadinessPage() {
  return (
    <>
      <PageHero
        eyebrowNum="04"
        eyebrow="Werkzeug · KI"
        title={<>Ist dein Betrieb bereit für <ItalicAccent>KI</ItalicAccent>?</>}
        lede="Sechs Fragen zu den Voraussetzungen, an denen ein Copilot-Rollout wirklich hängt — Berechtigungen, Daten, Identität, Use-Cases, Governance, Adoption. Du bekommst einen ehrlichen Reifegrad statt Hype."
        compact
      />
      <Section className="pb-32 pt-4 md:pb-44" background={<AccentGlow position="top-left" intensity="low" />}>
        <Breadcrumbs withJsonLd className="mb-12" items={[{ label: 'Werkzeuge', href: '/werkzeuge' }, { label: 'KI-Readiness' }]} />
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <Assessment config={CONFIG} />
        </div>
        <ToolInfo
          name="KI-Readiness-Check"
          path="/werkzeuge/ki-readiness"
          description="Kostenloser Selbst-Check: Sechs Fragen zu Berechtigungen, Daten, Identität, Use-Cases, Governance und Adoption zeigen, ob dein Betrieb bereit für Copilot & Co. ist."
          paragraphs={[
            'Copilot einschalten ist einfach — sinnvoll einsetzen nicht. Ob KI im Betrieb trägt, entscheidet sich an den Voraussetzungen: aufgeräumte Berechtigungen (sonst zitiert der Assistent das Gehaltsblatt aus dem falschen Ordner), klassifizierte Daten, saubere Identität, konkrete Use-Cases, geklärte Governance und eine geplante Einführung. Dieser Check fragt genau diese sechs Punkte ab.',
            'Das Ergebnis ist ein ehrlicher Reifegrad — startklar, fast startklar oder erst Fundament legen — plus die Liste dessen, was vor dem Rollout zu klären ist. Kein Hype, keine Tool-Empfehlung: nur der Stand deiner Voraussetzungen. Welcher KI-Stack dann passt, klärt der AI-Stack-Fit-Check.',
          ]}
          faq={[
            { q: 'Warum sind Berechtigungen für Copilot so wichtig?', a: 'Copilot zeigt jedem Nutzer alles, worauf er Zugriff hat. Ein über Jahre gewachsenes SharePoint-Berechtigungsmodell legt der Assistent gnadenlos offen — das Oversharing-Problem ist der häufigste Grund für Datenschutz-Vorfälle bei KI-Rollouts.' },
            { q: 'Was kostet eine Copilot-Einführung im Mittelstand?', a: 'Die Lizenz ist der kleinste Posten. Der echte Aufwand steckt in der Vorbereitung (Berechtigungen, Klassifizierung) und der Adoption (Champions, Schulung). Mit sauberem Fundament läuft ein Rollout in 4–6 Wochen.' },
            { q: 'Reicht ChatGPT statt Copilot nicht auch?', a: 'Das sind verschiedene Werkzeuge: Copilot arbeitet in deinem M365-Tenant mit deinen Daten und Berechtigungen, ChatGPT/Claude sind stark für Einzel-Use-Cases. Viele Betriebe fahren beides — mit klaren Regeln, welches Tool wofür.' },
          ]}
        />
      </Section>
    </>
  )
}
