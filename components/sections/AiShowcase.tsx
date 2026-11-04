'use client'

/**
 * AI-Showcase — Full-Ausbau-Pattern für /leistungen/ai.
 *
 * Sektionen:
 *   01 — Mythen vs. Realität     (Voice-of-Brand-Pattern auf KI angewandt)
 *   02 — Was heute schon geht    (Use-Case-Galerie · Tabs nach Werkzeug)
 *   03 — Werkzeugkasten          (Microsoft / LLM-Enterprise / Workflow & Custom)
 *   04 — Vom Prompt zum Prozess  (4-Step-Flow-Animation)
 *   05 — Datenschutz             (DSGVO-Pillars · EU-Region · on-prem)
 *   06 — Reifegrad nach M365     (Foundation → Pilot → Skalierung → Custom)
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { trackEvent } from '@/lib/analytics'
import { motion, useReducedMotion, AnimatePresence } from 'motion/react'
import {
  Sparkles, MessageSquare, Workflow, Code2,
  Mail, Database, Bot, Search, FileText, Headphones,
  Server, Shield, Lock, Globe2, MapPin,
  CheckCircle2, Rocket, Layers, GitBranch, Cpu,
  ArrowRight, Check,
} from 'lucide-react'
import ItalicAccent from '@/components/ui/ItalicAccent'
import GlossarHighlight from '@/components/ui/GlossarHighlight'
import CountUp from '@/components/ui/CountUp'

const EASE = [0.16, 1, 0.3, 1] as const

/**
 * Belebt eine Use-Case-Kennzahl mit CountUp, wenn sie ein klarer
 * Einzelwert ist: optionales Vorzeichen (−/+), Ganzzahl, optionale
 * Einheit (%, ×, s). Gemischte Strings („6 h → 0,5 h", „24/7", „0")
 * bleiben unverändert Text.
 */
function AiMetric({ value }: { value: string }) {
  const m = value.match(/^([−+]?)\s*(\d+)\s*(%|×|s)?$/)
  if (m && Number(m[2]) !== 0) {
    const prefix = m[1] || ''
    const suffix = m[3] ? ` ${m[3]}` : ''
    return <CountUp to={Number(m[2])} prefix={prefix} suffix={suffix} duration={1.4} />
  }
  return <>{value}</>
}

export default function AiShowcase() {
  return (
    <>
      <Section1MythVsReality />
      <Section2UseCases />
      <Section3Toolkit />
      <Section4PromptToProcess />
      <Section5Compliance />
      <Section6Maturity />
    </>
  )
}

/* ════════════════════════════════════════════════════════════════════
   01 — Mythen vs. Realität
   ════════════════════════════════════════════════════════════════════ */

const MYTHS = [
  {
    myth: 'KI ersetzt deine Mitarbeiter.',
    real: 'KI nimmt die statische Arbeit ab — Mails klassifizieren, Daten umtippen, Standard-Reports. Was bleibt: Fachurteil, Kundengespräch, Entscheidung.',
  },
  {
    myth: 'Du brauchst einen Data-Scientist und ein Modell-Team.',
    real: 'Für 80 % der Use-Cases reicht Copilot, Power Automate oder ein n8n-Flow mit GPT-4o-Endpoint. Eigene Modelle baust du erst, wenn die Standard-Tools nicht mehr tragen.',
  },
  {
    myth: 'Alle Daten gehen in die USA.',
    real: 'Azure OpenAI EU-Region, Claude Enterprise EU-Endpoint oder on-prem-Llama — drei dokumentierte Wege ohne Drittland-Transfer. Compliance-Sign-off vor dem ersten Token.',
  },
  {
    myth: 'Ohne AI-Strategie kann man nicht anfangen.',
    real: 'Doch. Ein konkreter Use-Case in einer Abteilung schlägt drei Strategie-PowerPoints. Aus 90 Tagen Pilot wird Lernen, aus Lernen wird Strategie — nicht umgekehrt.',
  },
  {
    myth: 'KI ist eine Frage von ChatGPT-Lizenzen.',
    real: 'Viele Workflows brauchen gar kein LLM. Ein Power-Automate-Flow ohne Token-Kosten löst oft mehr als ein Premium-Agent. Das richtige Werkzeug entscheidet der Use-Case, nicht der Lizenz-Vertrieb.',
  },
  {
    myth: 'Erst die große AI-Roadmap, dann die Umsetzung.',
    real: 'Sechs Monate Strategie-Phase ist Bewegungsstillstand. Lieber zwei Tage Workshop, eine Use-Case-Liste, ein 90-Tage-Pilot. Lernen entsteht aus Tun, nicht aus Folien.',
  },
]

function Section1MythVsReality() {
  return (
    <section
      aria-label="Mythen vs. Realität"
      style={{
        maxWidth: 'var(--container-wide)',
        margin: '0 auto',
        padding: 'clamp(80px, 10vw, 128px) 24px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-15%' }}
        transition={{ duration: 0.7, ease: EASE }}
        style={{ maxWidth: '900px' }}
      >
        <p
          className="font-mono uppercase"
          style={{
            fontSize: '11px',
            letterSpacing: '0.20em',
            color: 'var(--brand)',
            marginBottom: '20px',
          }}
        >
          01 · Die Lücke zwischen Schlagzeile und Alltag
        </p>
        <h2
          className="font-display font-bold"
          style={{
            fontSize: 'clamp(36px, 4.8vw, 64px)',
            lineHeight: 1.05,
            letterSpacing: 'var(--tr-display)',
            color: 'var(--fg-default)',
          }}
        >
          Was die Medien <ItalicAccent>versprechen</ItalicAccent> —
          und was im Betrieb wirklich passiert.
        </h2>
        <p
          className="mt-6 font-body"
          style={{
            fontSize: '17px',
            lineHeight: 1.65,
            color: 'var(--fg-muted)',
            maxWidth: '720px',
          }}
        >
          Zwischen LinkedIn-Hype und Mittwoch um zehn liegt ein
          ehrlicher Realitätsabgleich. Hier sind die sechs Aussagen,
          die in jedem Vorstands-Termin fallen — und das, was tatsächlich
          stimmt.
        </p>
      </motion.div>

      <ul
        className="grid grid-cols-1 gap-5 md:grid-cols-2"
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          marginTop: 'clamp(56px, 7vw, 96px)',
        }}
      >
        {MYTHS.map((m, i) => (
          <motion.li
            key={m.myth}
            className="glass-card relative"
            style={{ padding: '28px 28px 26px' }}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.55, delay: i * 0.06, ease: EASE }}
          >
            <div className="relative z-[3]">
              <p
                className="font-mono uppercase"
                style={{
                  fontSize: '9px',
                  letterSpacing: '0.20em',
                  color: '#92301E',
                  marginBottom: '10px',
                }}
              >
                ✗ Mythos
              </p>
              <p
                className="font-display font-medium italic"
                style={{
                  fontSize: 'clamp(17px, 1.8vw, 21px)',
                  lineHeight: 1.35,
                  color: 'var(--fg-default)',
                  fontFamily: 'var(--font-accent)',
                  fontWeight: 400,
                  opacity: 0.78,
                }}
              >
                „{m.myth}"
              </p>

              <div
                aria-hidden
                className="my-5"
                style={{
                  height: 1,
                  background:
                    'linear-gradient(90deg, transparent, var(--border-subtle) 50%, transparent)',
                }}
              />

              <p
                className="font-mono uppercase"
                style={{
                  fontSize: '9px',
                  letterSpacing: '0.20em',
                  color: 'var(--brand)',
                  marginBottom: '10px',
                }}
              >
                ✓ Realität
              </p>
              <p
                className="font-body"
                style={{
                  fontSize: '15px',
                  lineHeight: 1.6,
                  color: 'var(--fg-default)',
                }}
              >
                <GlossarHighlight text={m.real} />
              </p>
            </div>
          </motion.li>
        ))}
      </ul>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════════════
   02 — Use-Cases-Galerie (Tabs nach Werkzeug)
   ════════════════════════════════════════════════════════════════════ */

type UseCaseTone = 'copilot' | 'platform' | 'flow' | 'custom'

interface UseCase {
  title:    string
  body:     string
  tools:    string[]
  before:   string
  after:    string
  metric:   string
  metricLabel: string
}

interface ToolTrack {
  id:    UseCaseTone
  label: string
  Icon:  typeof MessageSquare
  intro: string
  cases: UseCase[]
}

const TRACKS: ToolTrack[] = [
  {
    id:   'copilot',
    label: 'Copilot · Day-to-Day',
    Icon: MessageSquare,
    intro: 'Die Werkzeuge, die deine Leute schon morgens auf dem Bildschirm haben. Outlook, Word, Excel, Teams — und ein Copilot-Knopf daneben.',
    cases: [
      {
        title:  'E-Mail-Triage in Outlook',
        body:   'Eingehende Mails werden klassifiziert (Anfrage / Beschwerde / Info), zusammengefasst und vorpriorisiert. Antwort-Drafts entstehen auf Knopfdruck im Tonfall des Mitarbeiters.',
        tools:  ['Microsoft Copilot', 'Outlook', 'Power Automate'],
        before: 'Jede Mail einzeln lesen, kopieren, antworten — 30 Min pro Posteingang.',
        after:  '20 Mails sortiert, gedraftet, geantwortet in 8 Min.',
        metric:      '−73 %',
        metricLabel: 'Bearbeitungszeit',
      },
      {
        title:  'Excel-Analysen per Sprache',
        body:   'Mitarbeiter fragt: „Welcher Vertriebler hat letztes Quartal die meisten Stornos?" Copilot baut Pivot, schreibt Formel, erklärt das Ergebnis in einem Satz.',
        tools:  ['Microsoft Copilot', 'Excel', '=COPILOT() · Beta'],
        before: 'Drei Excel-Mappen, zwei VLOOKUPs, vierzig Minuten Frust.',
        after:  'Frage tippen, Pivot-Tabelle in 12 Sekunden.',
        metric:      '−82 %',
        metricLabel: 'Klick-Zeit',
      },
      {
        title:  'Teams-Meeting-Notizen',
        body:   'Copilot transkribiert Meeting, erstellt Action-Items mit Verantwortlichem und Deadline, postet sie nach Meeting-Ende automatisch in den passenden Teams-Channel.',
        tools:  ['Microsoft Copilot', 'Teams', 'Planner'],
        before: 'Jemand muss mitschreiben oder das Meeting wird vergessen.',
        after:  'Protokoll in der Inbox bevor der Kaffee ausgetrunken ist.',
        metric:      '0',
        metricLabel: 'manuelle Notizen',
      },
    ],
  },
  {
    id:   'platform',
    label: 'Power Platform · Agents',
    Icon: Bot,
    intro: 'Copilot-Agents und Power-Apps für die abteilungsspezifischen Use-Cases. Low-Code, im M365-Tenant, mit Compliance-Audit-Trail eingebaut.',
    cases: [
      {
        title:  'HR-Onboarding-Agent',
        body:   'Neuer Mitarbeiter stellt im Teams-Chat alle Fragen — Urlaub, Krankmeldung, Spesen, Zugang zu Tools. Agent zieht Antworten aus dem SharePoint-Handbuch und HR-DB.',
        tools:  ['Copilot Studio', 'SharePoint', 'Power Automate'],
        before: 'HR beantwortet 90 % derselben Fragen 30× pro Jahr.',
        after:  'HR übernimmt nur die Edge-Cases — Standardfragen löst der Agent.',
        metric:      '−60 %',
        metricLabel: 'HR-Tickets',
      },
      {
        title:  'Angebots-Generator Vertrieb',
        body:   'Vertriebler tippt Kunden, Produkt, Menge in Teams. Agent zieht Stammdaten aus Dynamics, Preisliste aus SharePoint, erzeugt Word-Angebot mit Logo und schickt es als PDF an den Kunden.',
        tools:  ['Copilot Studio', 'Dynamics 365', 'Word · Power Automate'],
        before: 'Drei Tools, fünf Copy-Paste, sechs Minuten pro Angebot.',
        after:  'Angebot in 45 Sekunden, ohne ein Fenster zu wechseln.',
        metric:      '8 ×',
        metricLabel: 'schneller',
      },
      {
        title:  'Audit-Trail-Logger',
        body:   'Jeder Agent-Call wird mit User, Zeit, Input, Output und Modell-Version in SharePoint geloggt. Compliance kann jederzeit prüfen, was wer wann gefragt und welche Antwort kam.',
        tools:  ['Power Automate', 'SharePoint', 'Sentinel'],
        before: 'Niemand weiß, wer Copilot wofür benutzt.',
        after:  'Vollständige Nachvollziehbarkeit für DSGVO-Audit.',
        metric:      '100 %',
        metricLabel: 'auditierbar',
      },
    ],
  },
  {
    id:   'flow',
    label: 'Workflow · n8n · Power Automate',
    Icon: Workflow,
    intro: 'Die Prozesse, die zwischen Systemen hängen. Hier zählt Klick-Reduktion, nicht Sprachmodell-Tiefe — oft kommt die KI nur als ein Knoten von vielen vor.',
    cases: [
      {
        title:  'Rechnungs-OCR-Pipeline',
        body:   'PDF kommt per Mail rein, n8n liest sie über Azure Document Intelligence, extrahiert Beträge, prüft gegen die Bestell-DB, bucht in DATEV und verschickt Bestätigung — vollautomatisch.',
        tools:  ['n8n', 'Azure Document Intelligence', 'DATEV'],
        before: 'Buchhaltung tippt 80 Rechnungen pro Tag manuell ab.',
        after:  '80 Rechnungen laufen durch, 5 Edge-Cases gehen ins Tray.',
        metric:      '6 h → 0,5 h',
        metricLabel: 'pro Tag',
      },
      {
        title:  'Lead-Scoring auf Website-Formularen',
        body:   'Formular füllt aus, n8n schickt Inhalt an LLM mit Custom-Prompt („Bewerte Fit zu unseren Produkten"), schreibt Score in HubSpot, alarmiert Vertrieb bei Score > 80.',
        tools:  ['n8n', 'OpenAI · EU-Endpoint', 'HubSpot'],
        before: 'Vertrieb arbeitet 100 Leads gleich priorisiert ab.',
        after:  'Top-20 % bekommen Anruf in 4 h, Rest geht in Nurture-Strecke.',
        metric:      '+38 %',
        metricLabel: 'Win-Rate',
      },
      {
        title:  'Ticket-Routing im Service',
        body:   'Kunden-Mail kommt rein, LLM klassifiziert (Technik / Vertrieb / Finanz / Spam), routet ins richtige Helpdesk-Postfach, ergänzt Stammdaten aus CRM, schreibt First-Response-Draft.',
        tools:  ['Power Automate', 'Azure OpenAI EU', 'Zendesk'],
        before: '1st-Level liest alles und leitet manuell weiter.',
        after:  '1st-Level prüft nur die Klassifikation, akzeptiert per Klick.',
        metric:      '−54 %',
        metricLabel: 'Time-to-Reply',
      },
    ],
  },
  {
    id:   'custom',
    label: 'RAG · Custom-Development',
    Icon: Code2,
    intro: 'Wenn die Standard-Werkzeuge nicht mehr tragen. RAG auf eigenen Daten, eigene Modelle, eigene API-Endpoints — gehostet wo es passt.',
    cases: [
      {
        title:  'RAG auf 12 Jahre Confluence',
        body:   'Tech-Doku, Runbooks, Architektur-Decisions in einer eigenen Vektor-Datenbank. Fragen wie „Wer hat 2021 das Auth-Modell entschieden?" liefern Antwort plus Quellen-Link.',
        tools:  ['Llama 3 · on-prem', 'Qdrant', 'Confluence-API'],
        before: '40 000 Seiten, niemand findet was, niemand schreibt mehr nach.',
        after:  'Fragen ans Wiki, Antwort in 3 s, Quellen direkt verlinkt.',
        metric:      '3 s',
        metricLabel: 'TTI · Antwort',
      },
      {
        title:  'Voice-Bot für 1st-Level-Support',
        body:   'Eingehender Anruf, KI nimmt ab, hört zu, beantwortet die 80 % Standardfragen direkt. Komplexere Fälle werden mit Kontext-Zusammenfassung an Mitarbeiter übergeben.',
        tools:  ['Whisper', 'Claude Sonnet', 'Twilio · ElevenLabs'],
        before: 'Anrufer in der Warteschleife, Mitarbeiter ausgebrannt.',
        after:  '80 % der Anrufe in 90 s erledigt, Rest mit Kontext übergeben.',
        metric:      '24/7',
        metricLabel: 'erreichbar',
      },
      {
        title:  'Klassifizier-Modell für Eingangs-Dokumente',
        body:   'Eigenes Fine-Tuning für eine sehr spezifische Domäne (z. B. Versicherungs-Schadensmeldungen). Schlägt das Standard-LLM in Genauigkeit und kostet pro Inferenz nur Bruchteile.',
        tools:  ['PyTorch', 'Custom-Fine-Tuning', 'Self-hosted'],
        before: 'GPT-4 klassifiziert 87 % korrekt, kostet aber pro Token.',
        after:  'Eigenes Modell klassifiziert 96 % korrekt, kostet ein Zehntel.',
        metric:      '−90 %',
        metricLabel: 'Inferenz-Kosten',
      },
    ],
  },
]

function Section2UseCases() {
  const [trackId, setTrackId] = useState<UseCaseTone>('copilot')
  const track = useMemo(() => TRACKS.find(t => t.id === trackId)!, [trackId])

  return (
    <section
      aria-label="Was heute schon geht"
      style={{
        maxWidth: 'var(--container-wide)',
        margin: '0 auto',
        padding: 'clamp(80px, 10vw, 128px) 24px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-15%' }}
        transition={{ duration: 0.7, ease: EASE }}
        style={{ maxWidth: '900px', marginBottom: 'clamp(40px, 5vw, 56px)' }}
      >
        <p
          className="font-mono uppercase"
          style={{
            fontSize: '11px',
            letterSpacing: '0.20em',
            color: 'var(--brand)',
            marginBottom: '20px',
          }}
        >
          02 · Was heute schon läuft
        </p>
        <h2
          className="font-display font-bold"
          style={{
            fontSize: 'clamp(36px, 4.8vw, 64px)',
            lineHeight: 1.05,
            letterSpacing: 'var(--tr-display)',
            color: 'var(--fg-default)',
          }}
        >
          Use-Cases, die du <ItalicAccent>anfassen</ItalicAccent> kannst.
        </h2>
        <p
          className="mt-6 font-body"
          style={{
            fontSize: '17px',
            lineHeight: 1.65,
            color: 'var(--fg-muted)',
            maxWidth: '720px',
          }}
        >
          Vier Werkzeug-Spuren, zwölf konkrete Beispiele. Vorher/Nachher,
          welche Tools beteiligt sind, was sich messbar ändert.
        </p>
      </motion.div>

      {/* Tab-Bar */}
      <div
        role="tablist"
        aria-label="Werkzeug-Spuren"
        className="flex flex-wrap gap-2"
        style={{ marginBottom: 32 }}
      >
        {TRACKS.map(t => {
          const active = t.id === trackId
          return (
            <button
              key={t.id}
              role="tab"
              type="button"
              aria-selected={active}
              data-cursor="link"
              onClick={() => setTrackId(t.id)}
              className="inline-flex items-center gap-2 transition-all duration-220"
              style={{
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: '10px 18px',
                borderRadius: 'var(--r-pill)',
                background: active
                  ? 'rgba(220, 128, 68, 0.12)'
                  : 'var(--bg-overlay)',
                border: active
                  ? '1px solid rgba(220, 128, 68, 0.40)'
                  : '1px solid var(--border-subtle)',
                color: active ? 'var(--brand)' : 'var(--fg-muted)',
                boxShadow: active ? '0 0 0 1px rgba(220, 128, 68, 0.20)' : 'none',
              }}
            >
              <t.Icon size={13} strokeWidth={1.6} />
              {t.label}
            </button>
          )
        })}
      </div>

      {/* Intro-Bar */}
      <AnimatePresence mode="wait">
        <motion.p
          key={track.id + '-intro'}
          className="font-body"
          style={{
            fontSize: '15px',
            lineHeight: 1.65,
            color: 'var(--fg-default)',
            opacity: 0.85,
            maxWidth: '760px',
            marginBottom: 28,
            paddingLeft: 16,
            borderLeft: '2px solid var(--brand)',
          }}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 0.85, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          transition={{ duration: 0.3 }}
        >
          {track.intro}
        </motion.p>
      </AnimatePresence>

      {/* Use-Cases-Grid */}
      <AnimatePresence mode="wait">
        <motion.ul
          key={track.id + '-cases'}
          className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
          style={{ listStyle: 'none', padding: 0, margin: 0 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {track.cases.map((c, i) => (
            <motion.li
              key={c.title}
              className="glass-card relative h-full"
              style={{ padding: '24px 24px 22px', minHeight: '380px' }}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: EASE }}
            >
              <div className="relative z-[3] flex h-full flex-col">
                <h3
                  className="font-display font-semibold"
                  style={{
                    fontSize: '19px',
                    lineHeight: 1.25,
                    letterSpacing: 'var(--tr-heading)',
                    color: 'var(--fg-default)',
                  }}
                >
                  {c.title}
                </h3>
                <p
                  className="mt-3 font-body"
                  style={{
                    fontSize: '13.5px',
                    lineHeight: 1.6,
                    color: 'var(--fg-muted)',
                  }}
                >
                  <GlossarHighlight text={c.body} />
                </p>

                {/* Tools-Chips */}
                <ul
                  className="mt-4 flex flex-wrap gap-1.5"
                  style={{ listStyle: 'none', padding: 0, margin: 0 }}
                >
                  {c.tools.map(t => (
                    <li
                      key={t}
                      className="font-mono"
                      style={{
                        fontSize: '9.5px',
                        letterSpacing: '0.04em',
                        padding: '4px 8px',
                        borderRadius: 'var(--r-pill)',
                        background: 'var(--bg-overlay)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--fg-default)',
                      }}
                    >
                      {t}
                    </li>
                  ))}
                </ul>

                {/* Before/After */}
                <div
                  className="mt-5 pt-4"
                  style={{ borderTop: '1px solid var(--border-subtle)' }}
                >
                  <div className="flex items-start gap-2">
                    <span
                      className="font-mono uppercase shrink-0"
                      style={{
                        fontSize: '8px',
                        letterSpacing: '0.18em',
                        color: '#92301E',
                        paddingTop: '3px',
                        width: 56,
                      }}
                    >
                      Vorher
                    </span>
                    <p
                      className="font-body"
                      style={{
                        fontSize: '12px',
                        lineHeight: 1.5,
                        color: 'var(--fg-subtle)',
                      }}
                    >
                      {c.before}
                    </p>
                  </div>
                  <div className="mt-2 flex items-start gap-2">
                    <span
                      className="font-mono uppercase shrink-0"
                      style={{
                        fontSize: '8px',
                        letterSpacing: '0.18em',
                        color: 'var(--brand)',
                        paddingTop: '3px',
                        width: 56,
                      }}
                    >
                      Nachher
                    </span>
                    <p
                      className="font-body"
                      style={{
                        fontSize: '12px',
                        lineHeight: 1.5,
                        color: 'var(--fg-default)',
                      }}
                    >
                      {c.after}
                    </p>
                  </div>
                </div>

                {/* Metric */}
                <div className="mt-auto flex items-baseline justify-between pt-5">
                  <span
                    className="font-display font-black tabular-nums"
                    style={{
                      fontSize: 'clamp(24px, 2.4vw, 30px)',
                      lineHeight: 1,
                      color: 'var(--accent)',
                      letterSpacing: 'var(--tr-display)',
                    }}
                  >
                    <AiMetric value={c.metric} />
                  </span>
                  <span
                    className="font-mono uppercase"
                    style={{
                      fontSize: '9px',
                      letterSpacing: '0.18em',
                      color: 'var(--fg-muted)',
                      textAlign: 'right',
                    }}
                  >
                    {c.metricLabel}
                  </span>
                </div>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </AnimatePresence>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════════════
   03 — Werkzeugkasten (Toolkit-Tiers)
   ════════════════════════════════════════════════════════════════════ */

const TIERS = [
  {
    Icon: MessageSquare,
    badge: 'Microsoft-First',
    title: 'M365 + Copilot + Power Platform',
    body:  'Wenn du eh schon im Microsoft-Stack bist: Copilot in Outlook, Word, Excel, Teams. Copilot-Agents in Copilot Studio. Workflows in Power Automate. Alles im selben Tenant, ein Login, ein Audit-Trail.',
    points: [
      'Copilot · Outlook · Word · Excel · Teams',
      'Copilot Studio · Agents · low-code',
      'Power Automate · Workflows',
      'Daten bleiben im M365-Tenant',
    ],
    pricing: 'M365-Lizenz + Copilot-Add-on',
  },
  {
    Icon: Sparkles,
    badge: 'LLM-Direct',
    title: 'ChatGPT · Claude · Gemini · Enterprise',
    body:  'Direkter Zugriff auf die führenden Modelle, mit Enterprise-Vertrag und EU-Endpoint. Maximale Flexibilität, eigene API-Integration. Für Use-Cases jenseits der Microsoft-Apps.',
    points: [
      'OpenAI · Azure OpenAI EU-Region',
      'Anthropic Claude · Enterprise',
      'Google Gemini · Workspace',
      'Eigene API-Integration',
    ],
    pricing: 'Enterprise-Vertrag + API-Cost',
    featured: true,
  },
  {
    Icon: Workflow,
    badge: 'Automation',
    title: 'n8n · Power Automate · Custom Code',
    body:  'Die Prozess-Klebe-Schicht. n8n self-hosted für volle Kontrolle, Power Automate wenn ohnehin M365, klassischer Code wo es kompliziert wird. LLM ist hier nur ein Baustein von vielen.',
    points: [
      'n8n · self-hosted · 400+ Konnektoren',
      'Power Automate · M365-nativ',
      'Custom · Node · Python · TS',
      'Trigger · API · Schedule · Webhook',
    ],
    pricing: 'Hosting + Implementierungs-Aufwand',
  },
]

const TOOL_GRID = [
  { name: 'Microsoft Copilot',       cat: 'M365' },
  { name: 'Copilot Studio',          cat: 'Agents' },
  { name: 'Power Automate',          cat: 'Flow' },
  { name: 'Power Apps',              cat: 'Low-Code' },
  { name: 'Azure OpenAI · EU',       cat: 'LLM' },
  { name: 'Anthropic Claude · EU',   cat: 'LLM' },
  { name: 'GPT-4o · GPT-5',          cat: 'LLM' },
  { name: 'Llama 3 · Mistral',       cat: 'on-prem' },
  { name: 'n8n',                     cat: 'Workflow' },
  { name: 'Make · Zapier',           cat: 'Workflow' },
  { name: 'LangChain · LlamaIndex',  cat: 'Framework' },
  { name: 'Qdrant · Weaviate',       cat: 'Vector-DB' },
  { name: 'Whisper · ElevenLabs',    cat: 'Voice' },
  { name: 'Azure Document AI',       cat: 'OCR' },
  { name: 'Pinecone',                cat: 'Vector-DB' },
]

function Section3Toolkit() {
  return (
    <section
      aria-label="Werkzeugkasten"
      style={{
        maxWidth: 'var(--container-wide)',
        margin: '0 auto',
        padding: 'clamp(80px, 10vw, 128px) 24px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-15%' }}
        transition={{ duration: 0.7, ease: EASE }}
        style={{ maxWidth: '900px', marginBottom: 'clamp(48px, 6vw, 72px)' }}
      >
        <p
          className="font-mono uppercase"
          style={{
            fontSize: '11px',
            letterSpacing: '0.20em',
            color: 'var(--brand)',
            marginBottom: '20px',
          }}
        >
          03 · Werkzeugkasten
        </p>
        <h2
          className="font-display font-bold"
          style={{
            fontSize: 'clamp(36px, 4.8vw, 64px)',
            lineHeight: 1.05,
            letterSpacing: 'var(--tr-display)',
            color: 'var(--fg-default)',
          }}
        >
          Drei Wege, ein <ItalicAccent>Ziel</ItalicAccent>.
        </h2>
        <p
          className="mt-6 font-body"
          style={{
            fontSize: '17px',
            lineHeight: 1.65,
            color: 'var(--fg-muted)',
            maxWidth: '720px',
          }}
        >
          Microsoft-First, wenn dein Tenant trägt. LLM-direkt, wenn du
          Flexibilität brauchst. Automation, wenn die Verklebung
          zwischen Systemen das eigentliche Problem ist. Die Antwort
          liegt fast immer in einer Kombination.
        </p>
      </motion.div>

      <ul
        className="grid grid-cols-1 gap-5 md:grid-cols-3"
        style={{ listStyle: 'none', padding: 0 }}
      >
        {TIERS.map((t, i) => (
          <motion.li
            key={t.badge}
            className="glass-card relative h-full"
            style={{
              padding: '28px 26px 24px',
              minHeight: '380px',
              border: t.featured
                ? '1px solid rgba(220, 128, 68, 0.40)'
                : undefined,
            }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.55, delay: i * 0.08, ease: EASE }}
          >
            <div className="relative z-[3] flex h-full flex-col">
              <div className="flex items-start justify-between gap-3">
                <span
                  className="inline-flex h-10 w-10 items-center justify-center"
                  style={{
                    background: 'rgba(220, 128, 68, 0.10)',
                    border: '1px solid rgba(220, 128, 68, 0.22)',
                    borderRadius: 'var(--r-sm)',
                    color: 'var(--brand)',
                  }}
                >
                  <t.Icon size={16} strokeWidth={1.5} />
                </span>
                {t.featured && (
                  <span
                    className="font-mono uppercase"
                    style={{
                      fontSize: '9px',
                      letterSpacing: '0.18em',
                      color: 'var(--accent)',
                      padding: '4px 10px',
                      background: 'rgba(220, 128, 68, 0.10)',
                      border: '1px solid rgba(220, 128, 68, 0.30)',
                      borderRadius: 'var(--r-pill)',
                    }}
                  >
                    Flexibel
                  </span>
                )}
              </div>

              <p
                className="mt-5 font-mono uppercase"
                style={{
                  fontSize: '10px',
                  letterSpacing: '0.18em',
                  color: 'var(--brand)',
                }}
              >
                {t.badge}
              </p>
              <h3
                className="mt-2 font-display font-semibold"
                style={{
                  fontSize: '20px',
                  lineHeight: 1.2,
                  letterSpacing: 'var(--tr-heading)',
                  color: 'var(--fg-default)',
                }}
              >
                {t.title}
              </h3>
              <p
                className="mt-3 font-body"
                style={{
                  fontSize: '14px',
                  lineHeight: 1.55,
                  color: 'var(--fg-muted)',
                }}
              >
                <GlossarHighlight text={t.body} />
              </p>

              <ul
                className="mt-auto pt-5"
                style={{ listStyle: 'none', padding: '20px 0 0', margin: 0 }}
              >
                {t.points.map(p => (
                  <li
                    key={p}
                    className="flex items-start gap-2 py-1"
                  >
                    <span
                      aria-hidden
                      style={{
                        color: 'var(--accent)',
                        fontSize: 11,
                        paddingTop: 2,
                      }}
                    >
                      ·
                    </span>
                    <span
                      className="font-mono"
                      style={{
                        fontSize: '11px',
                        color: 'var(--fg-default)',
                        letterSpacing: '0.02em',
                      }}
                    >
                      {p}
                    </span>
                  </li>
                ))}
              </ul>

              <div
                className="mt-4 pt-3"
                style={{ borderTop: '1px solid var(--border-subtle)' }}
              >
                <p
                  className="font-mono uppercase"
                  style={{
                    fontSize: '9px',
                    letterSpacing: '0.18em',
                    color: 'var(--fg-subtle)',
                  }}
                >
                  Kosten-Rahmen
                </p>
                <p
                  className="mt-1 font-mono"
                  style={{
                    fontSize: '11px',
                    color: 'var(--fg-default)',
                    letterSpacing: '0.02em',
                  }}
                >
                  {t.pricing}
                </p>
              </div>
            </div>
          </motion.li>
        ))}
      </ul>

      {/* Tools-Strip */}
      <motion.div
        className="mt-16 pt-10"
        style={{ borderTop: '1px solid var(--border-subtle)' }}
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.55, ease: EASE }}
      >
        <p
          className="font-mono uppercase"
          style={{
            fontSize: '10px',
            letterSpacing: '0.20em',
            color: 'var(--fg-subtle)',
            marginBottom: '20px',
          }}
        >
          Werkzeuge im Engagement — Auszug
        </p>
        <ul
          className="flex flex-wrap gap-2"
          style={{ listStyle: 'none', padding: 0, margin: 0 }}
        >
          {TOOL_GRID.map(t => (
            <li
              key={t.name}
              className="font-mono"
              style={{
                fontSize: '11px',
                padding: '6px 12px',
                borderRadius: 'var(--r-pill)',
                background: 'var(--bg-overlay)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--fg-default)',
                letterSpacing: '0.02em',
              }}
            >
              {t.name}
              <span
                className="ml-2 font-mono uppercase"
                style={{
                  fontSize: '9px',
                  letterSpacing: '0.16em',
                  color: 'var(--fg-subtle)',
                }}
              >
                · {t.cat}
              </span>
            </li>
          ))}
        </ul>
      </motion.div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════════════
   04 — Vom Prompt zum Prozess (Flow-Animation)
   ════════════════════════════════════════════════════════════════════ */

const FLOW_STEPS = [
  {
    Icon: Mail,
    title: 'Eingang',
    body:  '20 Kunden-Mails ploppen im Service-Postfach auf.',
    detail: 'Quelle: Outlook · Trigger: neue Mail · 08:00 morgens',
  },
  {
    Icon: Sparkles,
    title: 'Klassifikation',
    body:  'LLM liest, ordnet ein, fasst zusammen.',
    detail: 'Modell: GPT-4o · Region: EU-West · Prompt versioniert',
  },
  {
    Icon: Database,
    title: 'Anreicherung',
    body:  'Stammdaten aus CRM, History, Vertrag werden gezogen.',
    detail: 'Quellen: Dynamics · SharePoint · interne Vertrags-DB',
  },
  {
    Icon: Workflow,
    title: 'Aktion',
    body:  'Ticket erstellt, Draft formuliert, Mitarbeiter benachrichtigt.',
    detail: 'Output: Zendesk-Ticket + Teams-Karte + Draft-Antwort',
  },
]

// Fake-Chat: reale Anfrage rein → Pipeline läuft → Draft raus.
const INCOMING = {
  who:  'Kundin · Service-Postfach',
  time: '08:01',
  text: 'Hallo, auf Rechnung #4711 sind zwei Positionen doppelt berechnet. Könnt ihr das bitte prüfen und korrigieren?',
}
const AGENT_REPLY = {
  who:  'KI-Agent · Entwurf',
  time: '08:01',
  text: 'Geprüft: Rechnung #4711 — Dubletten in Pos. 3 & 7 erkannt, korrigierter Entwurf liegt bereit. Wartet auf deine Freigabe.',
  chips: ['Zendesk #8842', 'Teams-Karte', 'Draft-Antwort'],
}

// Phasen: 0 Anfrage · 1-4 Pipeline-Schritte aktiv · 5+6 Antwort-Draft (Hold) → loop
const PHASE_COUNT = 7

function TypingDots() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--fg-subtle)' }}
          animate={{ opacity: [0.25, 1, 0.25] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }}
        />
      ))}
    </span>
  )
}

function ChatBubble({
  side, who, time, chips, children,
}: {
  side: 'in' | 'out'
  who: string
  time: string
  chips?: string[]
  children: React.ReactNode
}) {
  const isOut = side === 'out'
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: isOut ? 'flex-end' : 'flex-start' }}
    >
      <span className="font-mono uppercase" style={{ fontSize: '9px', letterSpacing: '0.14em', color: 'var(--fg-subtle)', marginBottom: 6 }}>
        {who} · {time}
      </span>
      <div
        style={{
          maxWidth: '88%',
          padding: '12px 15px',
          borderRadius: isOut ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
          background: isOut ? 'rgba(220, 128, 68, 0.14)' : 'var(--bg-overlay)',
          border: isOut ? '1px solid rgba(220, 128, 68, 0.30)' : '1px solid var(--border-subtle)',
        }}
      >
        <p className="font-body" style={{ fontSize: '13.5px', lineHeight: 1.55, margin: 0, color: 'var(--fg-default)' }}>
          {children}
        </p>
        {chips && chips.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
            {chips.map(c => (
              <span key={c} className="font-mono" style={{ fontSize: '10px', padding: '3px 8px', borderRadius: 999, background: 'rgba(220,128,68,0.16)', border: '1px solid rgba(220,128,68,0.32)', color: 'var(--brand)' }}>
                {c}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

function Section4PromptToProcess() {
  const reduceMotion = useReducedMotion()
  const [phase, setPhase] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // reduced-motion → direkt in den Endzustand (Pipeline fertig, Antwort da)
    if (reduceMotion) { setPhase(PHASE_COUNT - 1); return }
    const el = trackRef.current
    if (!el) return

    let timer: ReturnType<typeof setInterval>
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting) {
          timer = setInterval(() => setPhase(p => (p + 1) % PHASE_COUNT), 1500)
        } else {
          clearInterval(timer)
        }
      },
      { rootMargin: '-20%' },
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      clearInterval(timer)
    }
  }, [reduceMotion])

  return (
    <section
      aria-label="Vom Prompt zum Prozess"
      style={{
        maxWidth: 'var(--container-wide)',
        margin: '0 auto',
        padding: 'clamp(80px, 10vw, 128px) 24px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-15%' }}
        transition={{ duration: 0.7, ease: EASE }}
        style={{ maxWidth: '900px', marginBottom: 'clamp(48px, 6vw, 72px)' }}
      >
        <p
          className="font-mono uppercase"
          style={{
            fontSize: '11px',
            letterSpacing: '0.20em',
            color: 'var(--brand)',
            marginBottom: '20px',
          }}
        >
          04 · Vom Prompt zum Prozess
        </p>
        <h2
          className="font-display font-bold"
          style={{
            fontSize: 'clamp(36px, 4.8vw, 64px)',
            lineHeight: 1.05,
            letterSpacing: 'var(--tr-display)',
            color: 'var(--fg-default)',
          }}
        >
          Ein simpler <ItalicAccent>Prompt</ItalicAccent> — und vier Systeme
          arbeiten zusammen.
        </h2>
        <p
          className="mt-6 font-body"
          style={{
            fontSize: '17px',
            lineHeight: 1.65,
            color: 'var(--fg-muted)',
            maxWidth: '720px',
          }}
        >
          Was nach „Chat" aussieht, ist im Backend ein verkabelter Prozess.
          Hier ein realer Service-Triage-Flow — vier Schritte, alle
          messbar, alle ersetzbar.
        </p>
      </motion.div>

      <div
        ref={trackRef}
        className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8"
        style={{ alignItems: 'stretch' }}
      >
        {/* ── Fake-Chat-Fenster ── */}
        <div className="glass-card relative overflow-hidden" style={{ padding: 0 }}>
          <div className="relative z-[3] flex h-full flex-col">
            {/* Titlebar */}
            <div
              className="flex items-center gap-3"
              style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-overlay)' }}
            >
              <span style={{ display: 'inline-flex', gap: 6 }}>
                {['#5c5650', '#7a736b', '#3f3a35'].map(c => (
                  <span key={c} aria-hidden style={{ width: 9, height: 9, borderRadius: 999, background: c }} />
                ))}
              </span>
              <span className="font-mono uppercase" style={{ fontSize: '10px', letterSpacing: '0.16em', color: 'var(--fg-muted)' }}>
                Service-Postfach · KI-Agent
              </span>
              <span className="ml-auto inline-flex items-center gap-1.5">
                <span aria-hidden style={{ width: 7, height: 7, borderRadius: 999, background: 'var(--success-fg, #6CB082)', boxShadow: '0 0 8px rgba(108,176,130,0.6)' }} />
                <span className="font-mono uppercase" style={{ fontSize: '9px', letterSpacing: '0.14em', color: 'var(--fg-subtle)' }}>live</span>
              </span>
            </div>

            {/* Verlauf */}
            <div className="flex flex-1 flex-col gap-5" style={{ padding: '22px 20px', minHeight: 320 }}>
              <ChatBubble side="in" who={INCOMING.who} time={INCOMING.time}>
                {INCOMING.text}
              </ChatBubble>

              {phase >= 1 && phase < 5 && (
                <motion.div
                  key="typing"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
                >
                  <span className="font-mono uppercase" style={{ fontSize: '9px', letterSpacing: '0.14em', color: 'var(--fg-subtle)', marginBottom: 6 }}>
                    KI-Agent · arbeitet
                  </span>
                  <div
                    className="inline-flex items-center gap-3"
                    style={{ padding: '11px 15px', borderRadius: '12px 12px 12px 4px', background: 'var(--bg-overlay)', border: '1px solid var(--border-subtle)' }}
                  >
                    <TypingDots />
                    <span className="font-body" style={{ fontSize: '12.5px', color: 'var(--fg-muted)' }}>
                      {FLOW_STEPS[phase - 1]?.title} …
                    </span>
                  </div>
                </motion.div>
              )}

              {phase >= 5 && (
                <ChatBubble side="out" who={AGENT_REPLY.who} time={AGENT_REPLY.time} chips={AGENT_REPLY.chips}>
                  {AGENT_REPLY.text}
                </ChatBubble>
              )}
            </div>
          </div>
        </div>

        {/* ── Pipeline · läuft im Hintergrund mit ── */}
        <div className="glass-card relative" style={{ padding: '26px 26px' }}>
          <div className="relative z-[3]">
            <p className="font-mono uppercase" style={{ fontSize: '10px', letterSpacing: '0.20em', color: 'var(--brand)', marginBottom: '22px' }}>
              Im Hintergrund · der Prozess
            </p>
            <ol style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {FLOW_STEPS.map((s, i) => {
                const state = phase > i + 1 ? 'done' : phase === i + 1 ? 'active' : 'pending'
                const lit = state !== 'pending'
                return (
                  <li key={s.title} style={{ display: 'flex', gap: 14, minHeight: i < FLOW_STEPS.length - 1 ? 72 : 'auto' }}>
                    {/* Icon-Spalte + Connector */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <span
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center"
                        style={{
                          borderRadius: 'var(--r-sm)',
                          background: lit ? 'rgba(220, 128, 68, 0.16)' : 'var(--bg-overlay)',
                          border: lit ? '1px solid rgba(220, 128, 68, 0.40)' : '1px solid var(--border-subtle)',
                          color: lit ? 'var(--brand)' : 'var(--fg-subtle)',
                          boxShadow: state === 'active' ? '0 0 14px rgba(200, 98, 42, 0.5)' : 'none',
                          transition: 'all 360ms ease',
                        }}
                      >
                        {state === 'done' ? <Check size={15} strokeWidth={2.5} /> : <s.Icon size={15} strokeWidth={1.6} />}
                      </span>
                      {i < FLOW_STEPS.length - 1 && (
                        <span style={{ width: 2, flex: 1, marginTop: 4, background: phase > i + 1 ? 'var(--accent)' : 'var(--border-subtle)', transition: 'background 360ms ease' }} />
                      )}
                    </div>

                    {/* Text */}
                    <div style={{ flex: 1, paddingBottom: 16 }}>
                      <div className="flex items-center gap-2">
                        <p className="font-mono uppercase" style={{ fontSize: '9px', letterSpacing: '0.16em', color: lit ? 'var(--accent)' : 'var(--fg-subtle)' }}>
                          Schritt {String(i + 1).padStart(2, '0')}
                        </p>
                        {state === 'active' && <TypingDots />}
                        {state === 'done' && (
                          <span className="font-mono uppercase" style={{ fontSize: '9px', letterSpacing: '0.14em', color: 'var(--fg-subtle)' }}>erledigt</span>
                        )}
                      </div>
                      <p className="font-display font-medium" style={{ fontSize: '16px', marginTop: 3, color: lit ? 'var(--fg-default)' : 'var(--fg-muted)', transition: 'color 300ms' }}>
                        {s.title}
                      </p>
                      <AnimatePresence initial={false}>
                        {lit && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: EASE }}
                            style={{ overflow: 'hidden' }}
                          >
                            <p className="font-body" style={{ fontSize: '13px', lineHeight: 1.5, color: 'var(--fg-muted)', marginTop: 4 }}>
                              {s.body}
                            </p>
                            <p className="font-mono" style={{ fontSize: '11px', lineHeight: 1.45, color: 'var(--fg-subtle)', marginTop: 6, letterSpacing: '0.02em' }}>
                              {s.detail}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>
      </div>

      {/* Outcome-Row drunter */}
      <motion.div
        className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        {([
          { count: 54, prefix: '−', suffix: ' %', label: 'Time-to-Reply' },
          { count: 0,               label: 'manuelle Klassifikation' },
          { text: '24/7',           label: 'erreichbar' },
        ] as Array<{ count?: number; text?: string; prefix?: string; suffix?: string; label: string }>).map((o, i) => (
          <motion.div
            key={o.label}
            className="glass-card relative"
            style={{ padding: '22px 24px' }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 + i * 0.08, ease: EASE }}
          >
            <div className="relative z-[3] flex items-baseline justify-between gap-3">
              <p
                className="font-display font-black"
                style={{
                  fontSize: 'clamp(28px, 2.8vw, 36px)',
                  color: 'var(--accent)',
                  letterSpacing: 'var(--tr-display)',
                  lineHeight: 1,
                }}
              >
                {o.text ?? <CountUp to={o.count ?? 0} prefix={o.prefix} suffix={o.suffix} duration={1.4} />}
              </p>
              <p
                className="font-mono uppercase"
                style={{
                  fontSize: '10px',
                  letterSpacing: '0.18em',
                  color: 'var(--fg-muted)',
                }}
              >
                {o.label}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════════════
   05 — Datenschutz & Compliance
   ════════════════════════════════════════════════════════════════════ */

const COMPLIANCE_PILLARS = [
  {
    Icon: MapPin,
    title: 'EU-Region oder on-prem',
    body:  'Azure OpenAI in westeuropäischen Rechenzentren, Anthropic Claude mit EU-Endpoint, Llama 3 oder Mistral lokal — drei dokumentierte Wege ohne Drittland-Transfer.',
    badges: ['Azure OpenAI · EU-West', 'Claude · EU-Endpoint', 'on-prem · Llama · Mistral'],
  },
  {
    Icon: Lock,
    title: 'AVV & Sub-Auftrags-Liste',
    body:  'Auftrags­verarbeitungs-Verträge mit allen LLM-Vendoren liegen unterschrieben vor. Sub-Auftragnehmer-Liste pro Provider — aktuell, dokumentiert, deinem Datenschutzbeauftragten ausgehändigt.',
    badges: ['AVV · alle Vendoren', 'TOMs dokumentiert', 'Sub-Liste aktuell'],
  },
  {
    Icon: Shield,
    title: 'Daten-Klassifikation',
    body:  'Welche Daten dürfen in welchen Modell-Endpoint? Klassifikations-Schema (öffentlich / intern / vertraulich / personenbezogen), Tabelle pro Use-Case, freigegeben durch deinen DSB.',
    badges: ['Klassifizierungs-Schema', 'Use-Case-Whitelist', 'DSB-Freigabe'],
  },
  {
    Icon: Globe2,
    title: 'Audit-Trail & Logging',
    body:  'Jeder LLM-Call wird mit User, Zeit, Input, Output, Modell-Version geloggt. Aufbewahrung nach interner Policy, abrufbar für Compliance-Prüfung jederzeit.',
    badges: ['Vollständiges Logging', 'Retention nach Policy', 'Audit-Export'],
  },
]

function Section5Compliance() {
  return (
    <section
      aria-label="Datenschutz & Compliance"
      className="relative overflow-hidden"
      style={{
        padding: 'clamp(80px, 10vw, 128px) 24px',
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(50% 50% at 80% 30%, rgba(40, 200, 64, 0.06) 0%, transparent 60%),' +
            'radial-gradient(50% 50% at 20% 80%, rgba(146, 48, 30, 0.08) 0%, transparent 60%)',
          zIndex: 0,
        }}
      />

      <div
        className="relative mx-auto"
        style={{ maxWidth: 'var(--container-wide)', zIndex: 1 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15%' }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ maxWidth: '900px', marginBottom: 'clamp(48px, 6vw, 72px)' }}
        >
          <p
            className="font-mono uppercase"
            style={{
              fontSize: '11px',
              letterSpacing: '0.20em',
              color: 'var(--brand)',
              marginBottom: '20px',
            }}
          >
            05 · Datenschutz, ohne Bauchschmerzen
          </p>
          <h2
            className="font-display font-bold"
            style={{
              fontSize: 'clamp(36px, 4.8vw, 64px)',
              lineHeight: 1.05,
              letterSpacing: 'var(--tr-display)',
              color: 'var(--fg-default)',
            }}
          >
            DSGVO-sauber, <ItalicAccent>EU-only</ItalicAccent> möglich.
          </h2>
          <p
            className="mt-6 font-body"
            style={{
              fontSize: '17px',
              lineHeight: 1.65,
              color: 'var(--fg-muted)',
              maxWidth: '720px',
            }}
          >
            Die meisten KI-Projekte scheitern nicht an Technik, sondern an
            Compliance. Hier die vier Punkte, die in jedem Engagement
            stehen — bevor das erste Token erzeugt wird.
          </p>
        </motion.div>

        <ul
          className="grid grid-cols-1 gap-5 md:grid-cols-2"
          style={{ listStyle: 'none', padding: 0 }}
        >
          {COMPLIANCE_PILLARS.map((p, i) => (
            <motion.li
              key={p.title}
              className="glass-card relative"
              style={{ padding: '32px 30px 28px' }}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: EASE }}
            >
              <div className="relative z-[3]">
                <div className="flex items-center gap-4">
                  <span
                    className="inline-flex h-11 w-11 items-center justify-center"
                    style={{
                      background:
                        'linear-gradient(145deg, rgba(40, 200, 64, 0.10) 0%, rgba(40, 200, 64, 0.04) 100%)',
                      border: '1px solid rgba(40, 200, 64, 0.28)',
                      borderRadius: 'var(--r-sm)',
                      color: '#28C840',
                    }}
                  >
                    <p.Icon size={18} strokeWidth={1.5} />
                  </span>
                  <h3
                    className="font-display font-semibold"
                    style={{
                      fontSize: 'clamp(20px, 2.2vw, 24px)',
                      lineHeight: 1.2,
                      letterSpacing: 'var(--tr-heading)',
                      color: 'var(--fg-default)',
                    }}
                  >
                    {p.title}
                  </h3>
                </div>
                <p
                  className="mt-5 font-body"
                  style={{
                    fontSize: '15px',
                    lineHeight: 1.65,
                    color: 'var(--fg-muted)',
                  }}
                >
                  <GlossarHighlight text={p.body} />
                </p>
                <ul
                  className="mt-5 flex flex-wrap gap-2"
                  style={{ listStyle: 'none', padding: 0, margin: 0 }}
                >
                  {p.badges.map(b => (
                    <li
                      key={b}
                      className="font-mono"
                      style={{
                        fontSize: '10px',
                        letterSpacing: '0.04em',
                        padding: '4px 10px',
                        borderRadius: 'var(--r-pill)',
                        background: 'rgba(40, 200, 64, 0.08)',
                        border: '1px solid rgba(40, 200, 64, 0.22)',
                        color: '#28C840',
                      }}
                    >
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════════════
   06 — Reifegrad nach M365-Foundation
   ════════════════════════════════════════════════════════════════════ */

const MATURITY_STAGES = [
  {
    Icon: Server,
    phase: 'Foundation',
    title: 'M365 sauber aufgesetzt',
    body:  'SharePoint strukturiert, Berechtigungen klar, Lizenz-Setup ohne Leichen. Ohne diese Basis bringt KI nichts — Copilot braucht Daten, an die er rankommt. Das ist Leistung 02.',
    points: ['Tenant-Audit', 'SharePoint-Architektur', 'Lizenz-Cleanup', 'Berechtigungs-Modell'],
    state: 'done' as const,
    refSlug: '/leistungen/m365',
    refLabel: 'Leistung 02 ansehen',
  },
  {
    Icon: Sparkles,
    phase: 'Pilot',
    title: 'Erster Use-Case, eine Abteilung',
    body:  'Aus dem Workshop kommt eine priorisierte Liste, einer davon wird gebaut. 90 Tage, eine Abteilung, ein Vorher/Nachher. Lernen aus echtem Betrieb, nicht aus PowerPoint.',
    points: ['Anwendungsfall-Workshop · 2 Tage', '90-Tage-Pilot', 'Vorher/Nachher-Metriken', 'Übergabe-Doku'],
    state: 'next' as const,
  },
  {
    Icon: Layers,
    phase: 'Skalierung',
    title: 'Mehr Abteilungen, mehr Use-Cases',
    body:  'Das Pilot-Setup wird übertragen. Templates für Copilot-Agents, n8n-Flows, Power-Apps wachsen zur internen Bibliothek. Schulungen on-demand für die Pilot-Empfänger.',
    points: ['Agent- und Flow-Templates', 'Schulungs-Pfad', 'Center-of-Excellence-Light', 'Multi-Use-Case-Roll-out'],
    state: 'later' as const,
  },
  {
    Icon: GitBranch,
    phase: 'Custom',
    title: 'Eigene Modelle, eigene Pipelines',
    body:  'Wenn Standard-Tools nicht mehr reichen: Fine-Tuning auf eigenen Daten, eigene RAG-Pipelines auf Confluence/SharePoint, eigene API-Endpoints für interne Apps. Voll im Stack.',
    points: ['RAG · Vector-DB', 'Fine-Tuning · on-prem', 'API-Endpoints intern', 'Modell-Monitoring'],
    state: 'later' as const,
  },
  {
    Icon: Cpu,
    phase: 'Plattform',
    title: 'KI als Stack, nicht als Projekt',
    body:  'KI ist Infrastruktur geworden — wie Strom. Eigene Plattform-Schicht für Prompts, Tools, Guardrails, Audit. Fachbereiche bauen selbst, IT pflegt das Gerüst.',
    points: ['Prompt-Registry', 'Guardrail-Layer', 'Cost-Control', 'AI-Governance-Board'],
    state: 'later' as const,
  },
]

function Section6Maturity() {
  return (
    <section
      aria-label="Reifegrad"
      className="relative overflow-hidden"
      style={{
        padding: 'clamp(96px, 12vw, 160px) 24px',
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(50% 60% at 50% 30%, rgba(220, 128, 68, 0.10) 0%, transparent 65%),' +
            'radial-gradient(40% 50% at 80% 80%, rgba(146, 48, 30, 0.08) 0%, transparent 60%)',
          zIndex: 0,
        }}
      />

      <div
        className="relative mx-auto"
        style={{ maxWidth: 'var(--container-wide)', zIndex: 1 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15%' }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ maxWidth: '860px', marginBottom: 'clamp(64px, 8vw, 96px)' }}
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
            06 · Reifegrad — was kommt nach Step 1
          </p>
          <h2
            className="font-display font-bold"
            style={{
              fontSize: 'clamp(40px, 5.4vw, 84px)',
              lineHeight: 0.98,
              letterSpacing: 'var(--tr-display)',
              color: 'var(--fg-default)',
            }}
          >
            Basis steht.<br />
            Jetzt kommt der <ItalicAccent>Hebel</ItalicAccent>.
          </h2>
          <p
            className="mt-8 font-body"
            style={{
              fontSize: '18px',
              lineHeight: 1.6,
              color: 'var(--fg-muted)',
              maxWidth: '720px',
            }}
          >
            KI funktioniert nur auf sauberen Daten. Erst M365 als
            Grundlage, dann der erste Anwendungsfall, dann Skalierung. Jeder
            Schritt optional, jeder zahlt auf den nächsten ein.
          </p>

          {/* Stage-Pills */}
          <div className="mt-10 flex flex-wrap items-center gap-2">
            {MATURITY_STAGES.map((s, i) => (
              <div key={s.phase} className="flex items-center">
                <span
                  className="font-mono uppercase"
                  style={{
                    fontSize: '10px',
                    letterSpacing: '0.16em',
                    padding: '6px 12px',
                    borderRadius: 'var(--r-pill)',
                    color: s.state === 'done'
                      ? '#28C840'
                      : s.state === 'next'
                      ? 'var(--brand)'
                      : 'var(--fg-subtle)',
                    background: s.state === 'done'
                      ? 'rgba(40, 200, 64, 0.10)'
                      : s.state === 'next'
                      ? 'rgba(220, 128, 68, 0.10)'
                      : 'transparent',
                    border: s.state === 'done'
                      ? '1px solid rgba(40, 200, 64, 0.30)'
                      : s.state === 'next'
                      ? '1px solid rgba(220, 128, 68, 0.30)'
                      : '1px solid var(--border-subtle)',
                  }}
                >
                  {s.phase}
                </span>
                {i < MATURITY_STAGES.length - 1 && (
                  <span
                    aria-hidden
                    className="mx-2 font-mono"
                    style={{
                      color: 'var(--fg-subtle)',
                      fontSize: '11px',
                    }}
                  >
                    →
                  </span>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <div className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute hidden md:block"
            style={{
              left: '23px',
              top: '32px',
              bottom: '40px',
              width: '2px',
              background:
                'linear-gradient(180deg, #28C840 0%, rgba(40, 200, 64, 0.40) 8%, var(--brand) 18%, rgba(220, 128, 68, 0.40) 32%, var(--border-subtle) 50%)',
              opacity: 0.6,
            }}
          />

          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {MATURITY_STAGES.map((s, i) => (
              <MaturityStage key={s.phase} stage={s} index={i} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function MaturityStage({
  stage,
  index,
}: {
  stage: typeof MATURITY_STAGES[number]
  index: number
}) {
  const isDone = stage.state === 'done'
  const isNext = stage.state === 'next'
  const accentColor = isDone ? '#28C840' : isNext ? 'var(--brand)' : 'var(--fg-subtle)'
  const dotShadow  = isDone
    ? '0 0 16px rgba(40, 200, 64, 0.65)'
    : isNext
    ? '0 0 18px rgba(220, 128, 68, 0.65)'
    : 'none'

  return (
    <motion.li
      className="relative md:pl-20"
      style={{ marginBottom: index === MATURITY_STAGES.length - 1 ? 0 : 'clamp(28px, 3vw, 40px)' }}
      initial={{ opacity: 0, x: 24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-12%' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: EASE }}
    >
      <div
        aria-hidden
        className="absolute hidden md:flex items-center justify-center"
        style={{
          left: '8px',
          top: '32px',
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'var(--bg-base)',
          border: `2px solid ${accentColor}`,
          boxShadow: dotShadow,
        }}
      >
        {isDone && <Check size={14} strokeWidth={2.4} style={{ color: '#28C840' }} />}
        {isNext && (
          <span
            className="animate-pulse"
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: 'var(--brand)',
            }}
          />
        )}
        {!isDone && !isNext && (
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'var(--fg-subtle)',
              opacity: 0.6,
            }}
          />
        )}
      </div>

      <article
        className="glass-card relative"
        style={{
          padding: 'clamp(24px, 2.4vw, 36px)',
          border: isNext
            ? '1px solid rgba(220, 128, 68, 0.35)'
            : undefined,
          background: isNext
            ? 'linear-gradient(145deg, rgba(220, 128, 68, 0.05), rgba(220, 128, 68, 0.02))'
            : undefined,
        }}
      >
        <div className="relative z-[3]">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <span
                className="inline-flex items-center justify-center"
                style={{
                  width: 48,
                  height: 48,
                  background: isDone
                    ? 'rgba(40, 200, 64, 0.10)'
                    : isNext
                    ? 'rgba(220, 128, 68, 0.12)'
                    : 'var(--bg-overlay)',
                  border: isDone
                    ? '1px solid rgba(40, 200, 64, 0.28)'
                    : isNext
                    ? '1px solid rgba(220, 128, 68, 0.28)'
                    : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--r-sm)',
                  color: accentColor,
                }}
              >
                <stage.Icon size={22} strokeWidth={1.5} />
              </span>
              <div>
                <p
                  className="font-mono uppercase"
                  style={{
                    fontSize: '10px',
                    letterSpacing: '0.20em',
                    color: accentColor,
                    marginBottom: '4px',
                  }}
                >
                  Stage {String(index + 1).padStart(2, '0')} · {stage.phase}
                </p>
                <h3
                  className="font-display font-semibold"
                  style={{
                    fontSize: 'clamp(22px, 2.4vw, 30px)',
                    lineHeight: 1.15,
                    letterSpacing: 'var(--tr-heading)',
                    color: 'var(--fg-default)',
                  }}
                >
                  {stage.title}
                </h3>
              </div>
            </div>

            <span
              className="font-mono uppercase shrink-0"
              style={{
                fontSize: '9px',
                letterSpacing: '0.18em',
                padding: '5px 10px',
                borderRadius: 'var(--r-pill)',
                color: accentColor,
                background: isDone
                  ? 'rgba(40, 200, 64, 0.10)'
                  : isNext
                  ? 'rgba(220, 128, 68, 0.10)'
                  : 'transparent',
                border: `1px solid ${
                  isDone
                    ? 'rgba(40, 200, 64, 0.28)'
                    : isNext
                    ? 'rgba(220, 128, 68, 0.28)'
                    : 'var(--border-subtle)'
                }`,
                whiteSpace: 'nowrap',
              }}
            >
              {isDone ? '✓ Voraussetzung' : isNext ? 'Empfehlung Next' : 'wenn relevant'}
            </span>
          </div>

          <p
            className="mt-6 font-body"
            style={{
              fontSize: '16px',
              lineHeight: 1.6,
              color: 'var(--fg-muted)',
              maxWidth: '720px',
            }}
          >
            <GlossarHighlight text={stage.body} />
          </p>

          <ul
            className="mt-7 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2"
            style={{ listStyle: 'none', padding: 0, margin: 0 }}
          >
            {stage.points.map(p => (
              <li
                key={p}
                className="flex items-start gap-2.5 py-1.5 font-mono"
                style={{
                  fontSize: '12px',
                  color: 'var(--fg-default)',
                  letterSpacing: '0.02em',
                  borderBottom: '1px solid var(--border-subtle)',
                }}
              >
                <span
                  aria-hidden
                  style={{
                    color: accentColor,
                    fontSize: 10,
                    paddingTop: 4,
                  }}
                >
                  ▸
                </span>
                <span style={{ paddingTop: 1 }}>{p}</span>
              </li>
            ))}
          </ul>

          {stage.refSlug && (
            <Link
              href={stage.refSlug}
              data-cursor="link"
              onClick={() => trackEvent('cta_crosslink_ai', { to: stage.refSlug })}
              className="mt-6 inline-flex items-center gap-2 font-mono uppercase transition-colors duration-220 hover:text-[color:var(--brand)]"
              style={{
                fontSize: '11px',
                letterSpacing: '0.18em',
                color: '#28C840',
              }}
            >
              {stage.refLabel}
              <ArrowRight size={11} strokeWidth={1.6} />
            </Link>
          )}
        </div>
      </article>
    </motion.li>
  )
}

/* Suppress unused-import warnings — reserved für künftige Iterations. */
void CheckCircle2; void Rocket; void Search; void FileText; void Headphones;
