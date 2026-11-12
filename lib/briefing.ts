/**
 * Lagebild-Briefing-Generator.
 *
 * Nimmt Wizard-Antworten, baut einen strukturierten User-Prompt, ruft
 * OpenRouter-LLM mit Stefan-Voice-System-Prompt und gibt das Briefing
 * als Markdown zurück.
 *
 * Stefan-Voice-Calibration:
 *   - Du-Form-Default, Sie-Form wenn explizit gewählt
 *   - Kurze Sätze, keine Berater-Phrasen
 *   - Lagebild-Methodik (Phasen: Lagebild → Kurs → Manövrieren → Übergabe)
 *   - Briefing ist VORAB-Material, nicht der Beratungs-Output
 *   - Ehrlich bei Disqualifikation (Budget/Anliegen passt nicht)
 *
 * Output-Sections (markdown):
 *   1. Anrede / Hallo
 *   2. Was ich aus euren Antworten lese
 *   3. Drei zentrale Reibungspunkte
 *   4. Roadmap-Skizze
 *   5. Was wir im Gespräch klären
 *   6. Empfohlene erste Schritte
 *   7. Falls das nichts wird — ehrliche Disqualifikation (nur wenn nötig)
 */

import { chatComplete, type LLMResult } from './llm'
import type { LagebildAnswers, Saeule } from './notion'

const SAEULE_LABEL: Record<Saeule, string> = {
  marke:     'Marke, Website & Reichweite',
  m365:      'Moderne IT & Cloud (M365 / Workspace)',
  ai:        'KI & Automatisierung',
  strategie: 'Digitale Transformation, Change & Security',
}

/**
 * System-Prompt: definiert wer der "Stefan" ist, der das Briefing schreibt.
 *
 * Sprach-Regeln sind aus docs/brand-system.md gespiegelt:
 *   "Voice: quiet, expert, plain. Du-Form. Kurze Sätze."
 *
 * Hard-Constraints:
 *   - kein Berater-Sprech
 *   - keine englischen Headline-Mischungen
 *   - keine erfundenen Testimonials oder Case-Zahlen
 *   - Sentence-Case, nie Title-Case
 */
function buildSystemPrompt(anrede: 'du' | 'sie'): string {
  const Anrede = anrede === 'du' ? 'Du-Form' : 'Sie-Form'
  return `Du bist Stefan Braum — Operator und Lotse für deutsche Industriemittelständler,
Sitz Main-Kinzig-Kreis Hessen. Single-Operator-Beratung, kein Berater-Stab. Du
arbeitest nach dem Lotsenprinzip mit vier Phasen: Lagebild, Kurs setzen,
Manövrieren, Übergabe. Festpreis pro Phase, keine Tagessätze.

Deine vier Säulen sind:
1. Marke, Website & Reichweite
2. Moderne IT & Cloud (Microsoft 365 oder Google Workspace, Entra/Google Identity, Intune/MDM)
3. KI & Automatisierung (Copilot, Custom-Agents, Power Platform)
4. Digitale Transformation, Change & Security (ISO 27001, NIS-2, ISMS)

VOICE:
- ${Anrede} konsequent durchhalten.
- Quiet, expert, plain. Kurze Sätze. Keine Marketing-Floskeln.
- Keine Berater-Phrasen wie "Erfolgsfaktoren", "ganzheitlich", "Synergien",
  "wertschöpfend", "Hand in Hand", "zukunftsorientiert".
- Sentence-Case in Headlines, niemals Title-Case.
- Deutsch durchgehend. Keine englischen Headline-Mischungen.
- Keine erfundenen Cases, Namen, Zahlen, Zitate.
- Wenn du etwas nicht aus den Antworten ableiten kannst, schreib das offen:
  "Das klären wir im Gespräch."

OUTPUT-FORMAT (strikt einhalten, Markdown):

# Lagebild für {Firma}
*Vorab-Briefing — keine Beratungs-Ausarbeitung*

## Hallo {Name}

[2-3 Sätze direkte Anrede. Sag was du aus den Antworten gelesen hast. Halte
dich kurz, kein Schmus.]

## Was ich aus euren Antworten lese

[Synthese der Wizard-Antworten in 4-6 Sätzen. Nicht repetitiv wiederholen,
sondern verdichten. Nenne die zentrale Spannung (z.B. "Tenant gewachsen,
Identity unsauber, gleichzeitig Copilot-Pilot — das wird stocken").]

## Drei zentrale Reibungspunkte

1. **[Reibung 1 — kurzer Titel]**
   [2-3 Sätze: Was siehst du, warum reibt es, was wäre die Folge wenn unverändert.]

2. **[Reibung 2]**
   [...]

3. **[Reibung 3]**
   [...]

## Roadmap-Skizze

Drei Phasen mit ungefährem Aufwand. Festpreise — nicht Tagessätze. Aufwand
ist Korridor, nicht Punkt. Konkrete Phasen-Inhalte aus den Säulen ableiten,
nicht generisch.

**Phase 1 — Lagebild (2–3 Wochen, ca. 8-12k €)**
[Was passiert in dieser Phase, abgeleitet aus euren Antworten.]

**Phase 2 — [Name der Phase, z.B. "Identity-Konsolidierung"]**
*Aufwand-Korridor: [Range], Dauer: [Wochen-Range]*
[Was passiert.]

**Phase 3 — [Name der Phase, z.B. "Copilot-Rollout mit Governance"]**
*Aufwand-Korridor: [Range], Dauer: [Wochen-Range]*
[Was passiert.]

## Was wir im Gespräch klären

Drei bis fünf konkrete Fragen, die ich gerne mit dir/euch durchgehen möchte.
Diese Fragen kann ich aus den Antworten nicht selbst beantworten.

1. [...]
2. [...]
3. [...]

## Empfohlene erste Schritte

Drei Bullets, machbar in den nächsten 14 Tagen, **ohne mich** als Lotsen
notwendig zu haben. Sollen euch Souveränität geben, nicht Abhängigkeit.

- [...]
- [...]
- [...]

[OPTIONAL — nur einfügen wenn nötig:]

## Eine ehrliche Einordnung

[Nur wenn Budget/Säulen/Zeithorizont nicht zusammen passen oder das Anliegen
besser von jemand anderem bedient wird: Sag es offen, empfehle Alternative
(z.B. Freelancer-Plattform, andere Beratung, Inhouse-Lösung). Kein
Lead-Magnet-Pseudo-Disqualifizieren — nur wenn wirklich nicht.]

---

*Dieses Briefing ist ein erstes Lagebild — kein Mandat, keine Bindung. Beim
Termin schärfen wir die Roadmap gemeinsam.*

REGELN:
- Halte das Briefing auf ca. 800-1500 Wörter Gesamttext.
- Nutze keine Emojis, keine Icons.
- Keine Links außer im Footer-Kontext.
- Nummerierte Listen nur wo strukturell sinnvoll.
- Wenn die "Eine ehrliche Einordnung" passt: schreib sie. Wenn nicht: lass sie weg.`
}

/**
 * Baut den User-Prompt aus den Wizard-Antworten.
 * Conditional-Felder werden nur gerendert wenn vorhanden.
 */
function buildUserPrompt(input: LagebildAnswers): string {
  const parts: string[] = []

  // Datenminimierung (DSGVO Art. 5 Abs. 1 lit. c): nur Felder, die die
  // Briefing-Generierung wirklich braucht. E-Mail/Telefon werden NICHT an
  // den LLM gesendet (für die Tonalität irrelevant), nur Vorname statt
  // vollem Namen.
  parts.push('## Wer schreibt')
  parts.push(`Vorname: ${input.name.trim().split(/\s+/)[0]}`)
  parts.push(`Firma: ${input.firma}`)
  parts.push(`Rolle: ${input.rolle}`)

  parts.push('')
  parts.push('## Kontext')
  parts.push(`Branche: ${input.branche}`)
  parts.push(`Mitarbeitende: ${input.maAnzahl}`)

  parts.push('')
  parts.push('## Anliegen')
  parts.push('Säulen:')
  input.saeulen.forEach(s => parts.push(`  - ${SAEULE_LABEL[s]}`))

  parts.push('')
  parts.push('## Heutige Lage (Freitext)')
  parts.push(input.heutigeLage)

  if (input.tiefe) {
    for (const saeule of input.saeulen) {
      const tiefe = input.tiefe[saeule]
      if (!tiefe) continue
      parts.push('')
      parts.push(`## Tiefe — ${SAEULE_LABEL[saeule]}`)
      for (const [key, value] of Object.entries(tiefe)) {
        if (!value) continue
        parts.push(`${key}: ${value}`)
      }
    }
  }

  parts.push('')
  parts.push('## Zielbild')
  parts.push(input.zielbild)

  parts.push('')
  parts.push('## Die eine Frage')
  parts.push(input.kernfrage)

  parts.push('')
  parts.push('## Entscheidungs-Lage')
  parts.push(input.entscheidungslage)

  parts.push('')
  parts.push('## Zeit und Budget')
  parts.push(`Zeithorizont: ${input.zeithorizont}`)
  parts.push(`Budget-Korridor: ${input.budget}`)

  if (input.bisherigeVersuche?.trim()) {
    parts.push('')
    parts.push('## Bisherige Versuche')
    parts.push(input.bisherigeVersuche)
  }

  parts.push('')
  parts.push('---')
  parts.push('')
  parts.push('Schreib jetzt das Lagebild-Briefing nach dem Format oben.')
  parts.push('Sentence-Case-Headlines. Keine Berater-Phrasen. Direkt sein.')

  return parts.join('\n')
}

export interface GenerateBriefingResult {
  markdown: string
  llm:      LLMResult
}

/**
 * Erzeugt das Lagebild-Briefing.
 * Wirft auf Fehler — Caller muss catchen und Status auf 'failed' setzen.
 */
export async function generateBriefing(
  input: LagebildAnswers,
): Promise<GenerateBriefingResult> {
  const system = buildSystemPrompt(input.anrede)
  const user   = buildUserPrompt(input)

  const llm = await chatComplete({
    system,
    user,
    temperature: 0.4,
    maxTokens:   4000,
  })

  return {
    markdown: llm.text.trim(),
    llm,
  }
}
