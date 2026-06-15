import type { Metadata } from 'next'
import TrackedLink from '@/components/layout/TrackedLink'
import { ArrowRight, Compass, Map, Hammer, HandMetal } from 'lucide-react'
import ItalicAccent from '@/components/ui/ItalicAccent'
import BigHero from '@/components/sections/BigHero'
import { MethodikVisual } from '@/components/ui/PageHeroVisuals'
import GlossarHighlight from '@/components/ui/GlossarHighlight'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import MethodikArtifacts from '@/components/sections/MethodikArtifacts'

export const metadata: Metadata = {
  title: 'Methodik · Das Lotsenprinzip',
  description:
    'Das Lotsenprinzip im Detail: Lagebild, Kurs setzen, Manövrieren, Übergabe. Vierstufiges Engagement-Modell — wie Beratung anders aussieht, wenn am Ende ein laufendes System steht.',
  alternates: { canonical: '/methodik' },
}

const PHASES = [
  {
    num: '01',
    Icon: Compass,
    title: 'Lagebild',
    lead: 'Bevor etwas gebaut wird, klären wir die Lage.',
    body: 'Zwei bis drei Wochen Discovery, keine Folien-Wand. Was ist da, was blockiert wirklich, was ist kritisch. Ergebnis: schriftliche Einschätzung mit priorisierter Roadmap, klarem Aufwand pro Phase, und einer Empfehlung, ob die nächste Phase auch von Braum Consulting umgesetzt werden sollte oder besser intern.',
    deliverables: [
      'Strukturierte Discovery mit Beteiligten aus IT, Fachbereich, Geschäftsführung',
      'Schriftliche Einschätzung mit identifizierten Reibungspunkten',
      'Priorisierter Roadmap-Entwurf',
      'Klare nächste Schritte mit Aufwand pro Phase',
      'Empfehlung Inhouse vs. extern',
    ],
  },
  {
    num: '02',
    Icon: Map,
    title: 'Kurs setzen',
    lead: 'Wenn die Lage klar ist, kommt der Kurs.',
    body: 'Prioritäten, Zielbild, Roadmap. Schriftlich, mit klarer Outcome-Definition pro Phase. Wer was wann liefert, in welchen Quartal-Slots, mit welchen Rollback-Optionen. Festpreis statt Tagessatz — wer Stundensätze braucht, ruft besser jemand anderen an.',
    deliverables: [
      'Schriftliche Roadmap mit Phasen, Meilensteinen, Verantwortlichkeiten',
      'Festpreis-Angebot pro Phase',
      'Outcome-Definition (was steht am Ende, woran messen wir Erfolg)',
      'Rollback-Plan für kritische Cutover',
    ],
  },
  {
    num: '03',
    Icon: Hammer,
    title: 'Manövrieren',
    lead: 'Umsetzung mit klaren Zwischenständen.',
    body: 'Nicht erst zum Demo-Termin sichtbar — produktive Zwischenstände, die funktionieren. Wöchentlicher Status schriftlich, monatliche Reviews mit Sponsor anhand laufender Ergebnisse. Wenn etwas nicht funktioniert wie geplant, kommt das zuerst von uns, nicht aus dem Reporting.',
    deliverables: [
      'Wöchentlicher schriftlicher Status (Stand, Risiken, nächste Schritte)',
      'Funktionierende Zwischenstände, nicht Mockups',
      'Direkte Kommunikation mit Fachbereichen, kein Account-Filter',
      'Proaktive Eskalation bei Blockern',
    ],
  },
  {
    num: '04',
    Icon: HandMetal,
    title: 'Übergabe',
    lead: 'Übergabe ist kein Anhang, sondern eine eigene Phase.',
    body: 'Dokumentation, Schulung, Betriebssicherheit. Dein Team kennt das Setup, kein versteckter Single-Point-of-Failure. Run-Books, Architecture Decision Records, Schulungs-Sessions, optional 30 Tage Hypercare. Ziel ist nicht, dass dein Team Braum Consulting dauerhaft braucht — Ziel ist, dass das Setup ohne den Lotsen weiterläuft.',
    deliverables: [
      'Dokumentation: Run-Books, ADRs, Konfigurations-Snapshots',
      'Schulung des operativen Teams',
      'Übergabe-Workshop mit Architecture-Walkthrough',
      'Optional 30 Tage Hypercare bei kritischen Setups',
    ],
  },
]

const FAQS = [
  {
    q: 'Was unterscheidet das Lotsenprinzip von klassischer Beratung?',
    a: 'Beratung liefert Empfehlungen. Operator liefern Systeme. Am Ende eines Engagements steht ein laufender Tenant, ein produktiver Workflow oder eine ausgerollte Plattform — mit Doku und Übergabe an den Betrieb.',
  },
  {
    q: 'Was unterscheidet es von Freelancing?',
    a: 'Freelancer arbeiten typischerweise Tickets ab. Lotsen übernehmen strategische Verantwortung für den Kurs einer Phase. Wenn du jemanden brauchst, der nur Code schreibt: gibt bessere Anlaufstellen. Wenn du jemanden brauchst, der eine Phase eines digitalen Vorhabens komplett verantwortet, vom ersten Lagebild bis zur sauberen Übergabe: dann passt der Lotse.',
  },
  {
    q: 'Wie lange dauert ein typisches Engagement?',
    a: 'Lagebild allein: 2–3 Wochen Festpreis. Vollzyklus (Lagebild → Kurs → Manövrieren → Übergabe): 8–22 Wochen je nach Scope. Sehr lange Engagements (>6 Monate) sind die Ausnahme und werden phasenweise verhandelt.',
  },
  {
    q: 'Gibt es laufende Wartungs- oder Retainer-Modelle?',
    a: 'Für Beratungs- und Transformations-Engagements bewusst nicht: Nach der Übergabe läuft das Setup ohne den Lotsen, ein weiteres Vorhaben startet mit neuem Lagebild (Hypercare 30 Tage optional, aber kein Dauer-Retainer). Eine klare Ausnahme ist der Website-Betrieb — Sites, die ich baue, bleiben auf Wunsch in Wartung und Hosting: Updates, Backups, Security-Patches und Monitoring in festem monatlichem Rahmen. Das ist laufender Betrieb, kein Berater-Retainer.',
  },
  {
    q: 'Was passiert, wenn die Lagebild-Empfehlung lautet „intern lösen, nicht extern"?',
    a: 'Dann ist das die Empfehlung. Lagebild ist bewusst entkoppelt vom Sales-Funnel. Wer ein Lagebild bucht, kauft eine ehrliche Einschätzung — auch wenn die heißt, dass Braum Consulting nicht der richtige Partner für die nächste Phase ist.',
  },
]

// FAQ JSON-LD Schema.org
const jsonLd = {
  '@context': 'https://schema.org',
  '@type':    'FAQPage',
  mainEntity: FAQS.map(f => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}

export default function MethodikPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <BigHero
        eyebrowNum="05"
        eyebrow="Methodik"
        title={<>Das <ItalicAccent>Lotsenprinzip</ItalicAccent>.</>}
        lede="Vier Phasen. Ein Bogen. Vom ersten Lagebild bis zur sauberen Übergabe an dein Team. So wie ein Schiffslotse: temporär an Bord für die kritischen Manöver, danach übergibt der Lotse an die eigene Crew."
        facts={[
          { label: 'Modell',  value: 'Engagement in 4 Phasen' },
          { label: 'Bogen',   value: 'Lagebild → Übergabe' },
          { label: 'Ende',    value: 'Dein Team weiter ohne mich' },
        ]}
        visual={<MethodikVisual />}
      />

      {/* Phases — detaillierte Long-Form */}
      <section
        style={{
          maxWidth: '880px',
          margin: '0 auto',
          padding: '0 24px clamp(96px, 12vw, 160px)',
        }}
      >
        <Breadcrumbs
          withJsonLd
          className="mb-12"
          items={[{ label: 'Methodik' }]}
        />
        {PHASES.map((p, i) => {
          const Icon = p.Icon
          return (
            <article
              key={p.num}
              style={{
                paddingTop: i === 0 ? '0' : 'clamp(80px, 10vw, 128px)',
                paddingBottom: 'clamp(48px, 6vw, 72px)',
                borderBottom: i < PHASES.length - 1 ? '1px solid var(--border-subtle)' : 'none',
              }}
            >
              <div className="flex items-baseline justify-between gap-4" style={{ marginBottom: '32px' }}>
                <p
                  className="font-mono uppercase"
                  style={{
                    fontSize: '11px',
                    letterSpacing: '0.20em',
                    color: 'var(--brand)',
                  }}
                >
                  Phase {p.num}
                </p>
                <Icon size={22} strokeWidth={1.4} style={{ color: 'var(--accent)' }} />
              </div>

              <h2
                className="font-display font-bold"
                style={{
                  fontSize: 'clamp(36px, 4.6vw, 64px)',
                  lineHeight: 1,
                  letterSpacing: 'var(--tr-display)',
                  color: 'var(--fg-default)',
                }}
              >
                {p.title}
              </h2>

              <p
                className="mt-6 font-display"
                style={{
                  fontSize: 'clamp(20px, 2vw, 26px)',
                  lineHeight: 1.35,
                  color: 'var(--fg-default)',
                  opacity: 0.85,
                  fontWeight: 400,
                }}
              >
                {p.lead}
              </p>

              <p
                className="mt-8 font-body"
                style={{
                  fontSize: '18px',
                  lineHeight: 1.7,
                  color: 'var(--fg-default)',
                  opacity: 0.85,
                }}
              >
                <GlossarHighlight text={p.body} />
              </p>

              <div style={{ marginTop: '32px' }}>
                <p
                  className="font-mono uppercase"
                  style={{
                    fontSize: '10px',
                    letterSpacing: '0.20em',
                    color: 'var(--fg-subtle)',
                    marginBottom: '14px',
                  }}
                >
                  Deliverables
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {p.deliverables.map(d => (
                    <li
                      key={d}
                      className="flex items-start gap-3 font-body"
                      style={{
                        fontSize: '16px',
                        lineHeight: 1.55,
                        color: 'var(--fg-default)',
                        opacity: 0.85,
                        paddingTop: '8px',
                        paddingBottom: '8px',
                      }}
                    >
                      <span
                        aria-hidden
                        className="mt-2.5 inline-block h-1.5 w-1.5 shrink-0"
                        style={{
                          background: 'var(--accent)',
                          borderRadius: '999px',
                        }}
                      />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          )
        })}
      </section>

      {/* Beispiel-Artefakte — „Wie ein Ergebnis aussieht" */}
      <MethodikArtifacts />

      {/* FAQ */}
      <section
        style={{
          maxWidth: '880px',
          margin: '0 auto',
          padding: '0 24px clamp(96px, 12vw, 160px)',
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: 'clamp(80px, 10vw, 128px)',
        }}
      >
        <p
          className="font-mono uppercase"
          style={{
            fontSize: '11px',
            letterSpacing: '0.20em',
            color: 'var(--brand)',
            marginBottom: '24px',
          }}
        >
          Häufige Fragen
        </p>
        <h2
          className="font-display font-bold"
          style={{
            fontSize: 'clamp(32px, 4vw, 48px)',
            lineHeight: 1.05,
            letterSpacing: 'var(--tr-display)',
            color: 'var(--fg-default)',
            maxWidth: '720px',
          }}
        >
          Was Mandanten vor dem ersten Gespräch wissen wollen.
        </h2>

        <div style={{ marginTop: '48px' }}>
          {FAQS.map((f, i) => (
            <details
              key={i}
              style={{
                padding: '24px 0',
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              <summary
                className="cursor-pointer font-display font-medium"
                style={{
                  fontSize: 'clamp(18px, 2vw, 22px)',
                  lineHeight: 1.3,
                  letterSpacing: '-0.005em',
                  color: 'var(--fg-default)',
                  listStyle: 'none',
                }}
              >
                {f.q}
              </summary>
              <p
                className="mt-4 font-body"
                style={{
                  fontSize: '16px',
                  lineHeight: 1.7,
                  color: 'var(--fg-muted)',
                  maxWidth: '720px',
                }}
              >
                <GlossarHighlight text={f.a} />
              </p>
            </details>
          ))}
        </div>

        {/* CTA */}
        <div
          style={{
            marginTop: 'clamp(64px, 8vw, 96px)',
            textAlign: 'center',
          }}
        >
          <TrackedLink
            href="/kontakt"
            event="cta_lagebild_methodik"
            data-cursor="magnetic"
            className="inline-flex items-center gap-2 font-body font-semibold transition-transform duration-220 hover:-translate-y-px"
            style={{
              padding: '16px 28px',
              fontSize: '15px',
              background: 'var(--accent)',
              color: 'var(--on-accent)',
              borderRadius: 'var(--r-sm)',
              boxShadow: 'var(--sh-2)',
            }}
          >
            Lagebild anfragen
            <ArrowRight size={16} strokeWidth={1.5} />
          </TrackedLink>
        </div>
      </section>
    </>
  )
}
