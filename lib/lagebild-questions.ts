/**
 * Lagebild-Wizard — verdichtetes Step-Schema (5 Base + 1-4 conditional).
 *
 *   1 Säule  gewählt → 6 Steps total
 *   2 Säulen          → 7
 *   3 Säulen          → 8
 *   4 Säulen          → 9
 *
 * Step-Reihenfolge:
 *   01  WER & WO          Name, Firma, Email, Rolle, Branche, MA-Anzahl
 *   02  ANLIEGEN          Säulen (Multi)            ← bestimmt 03a-03d
 *   03  LAGE              Heutige Lage Freitext
 *   03a TIEFE MARKE       conditional
 *   03b TIEFE M365        conditional
 *   03c TIEFE AI          conditional
 *   03d TIEFE STRATEGIE   conditional
 *   04  VISION            Zielbild + Kernfrage
 *   05  RAHMEN            Entscheidung + Zeit + Budget + Bisheriges + Anrede + Telefon
 *
 * Fragen-Editierung: nur dieses File anfassen, Wizard re-rendert automatisch.
 */

import type { Saeule } from './notion'

export type FieldType =
  | 'text'
  | 'email'
  | 'phone'
  | 'select'
  | 'multi-select'
  | 'long-text'
  | 'honeypot'

export interface Field {
  name:        string
  type:        FieldType
  label:       string
  helper?:     string
  required?:   boolean
  options?:    Array<{ value: string; label: string }>
  minChars?:   number
  placeholder?: string
  /** Layout-Hint: full | half. Defaultet auf full. */
  width?:      'full' | 'half'
}

export interface Step {
  id:           string
  num:          string
  title:        string
  lede:         string
  fields:       Field[]
  showIfSaeule?: Saeule
}

const ROLLE_OPTIONS = [
  { value: 'gf',          label: 'Geschäftsführung' },
  { value: 'it-leitung',  label: 'IT-Leitung' },
  { value: 'fachbereich', label: 'Fachbereich' },
  { value: 'sonstiges',   label: 'Sonstiges' },
]

const BRANCHE_OPTIONS = [
  { value: 'maschinenbau',   label: 'Maschinenbau' },
  { value: 'industrie',      label: 'Industrie / Fertigung' },
  { value: 'handwerk',       label: 'Handwerk / Bau' },
  { value: 'dienstleistung', label: 'Dienstleistung / Beratung' },
  { value: 'handel',         label: 'Handel / E-Commerce' },
  { value: 'sonstiges',      label: 'Sonstiges' },
]

const MA_OPTIONS = [
  { value: '1-10',     label: '1 – 10' },
  { value: '10-50',    label: '10 – 50' },
  { value: '50-200',   label: '50 – 200' },
  { value: '200-1000', label: '200 – 1.000' },
  { value: '1000+',    label: '1.000+' },
]

const SAEULE_OPTIONS = [
  { value: 'marke',     label: 'Marke, Website & Reichweite' },
  { value: 'm365',      label: 'Moderne IT & Cloud (M365 / Workspace)' },
  { value: 'ai',        label: 'KI & Automatisierung' },
  { value: 'strategie', label: 'Digitale Transformation, Change & Security' },
]

const ZEIT_OPTIONS = [
  { value: 'sofort',      label: 'Sofort' },
  { value: 'q1',          label: 'Nächste 1–3 Monate' },
  { value: 'q2',          label: 'In 3–6 Monaten' },
  { value: 'strategisch', label: 'Strategisch, noch offen' },
]

const BUDGET_OPTIONS = [
  { value: 'under-10', label: 'Unter 10.000 €' },
  { value: '10-25',    label: '10 – 25.000 €' },
  { value: '25-60',    label: '25 – 60.000 €' },
  { value: '60-plus',  label: '60.000 € +' },
  { value: 'unklar',   label: 'Noch unklar' },
]

const ENTSCHEIDUNG_OPTIONS = [
  { value: 'umsetzer',   label: 'Entscheidung steht, suchen Umsetzer' },
  { value: 'klarheit',   label: 'Suchen Klarheit über den Weg' },
  { value: 'sondierung', label: 'Reine Sondierung, noch unverbindlich' },
]

const ANREDE_OPTIONS = [
  { value: 'du',  label: 'Du-Form' },
  { value: 'sie', label: 'Sie-Form' },
]

export const STEPS: Step[] = [
  {
    id: 'wer-und-wo',
    num: '01',
    title: 'Wer und wo',
    lede: 'Sechs Felder, alle kurz — damit das Briefing personalisiert ankommt.',
    fields: [
      { name: 'name',     type: 'text',  label: 'Vor- und Nachname', required: true, width: 'half' },
      { name: 'firma',    type: 'text',  label: 'Firma',             required: true, width: 'half' },
      { name: 'email',    type: 'email', label: 'E-Mail-Adresse',    required: true, width: 'full' },
      { name: 'rolle',    type: 'select', label: 'Rolle',    required: true, options: ROLLE_OPTIONS,   width: 'half' },
      { name: 'branche',  type: 'select', label: 'Branche',  required: true, options: BRANCHE_OPTIONS, width: 'half' },
      { name: 'maAnzahl', type: 'select', label: 'Mitarbeitende', required: true, options: MA_OPTIONS, width: 'full' },
    ],
  },
  {
    id: 'anliegen',
    num: '02',
    title: 'Anliegen',
    lede: 'Welche Säulen das Briefing abdecken soll. Mehrfachauswahl möglich — die folgenden Schritte vertiefen sich je nach Wahl.',
    fields: [
      {
        name: 'saeulen',
        type: 'multi-select',
        label: 'Säulen',
        required: true,
        options: SAEULE_OPTIONS,
      },
    ],
  },
  {
    id: 'lage',
    num: '03',
    title: 'Heutige Lage',
    lede: 'Was reibt gerade konkret? Zwei, drei Sätze reichen — das ist der Anker fürs Briefing.',
    fields: [
      {
        name: 'heutigeLage',
        type: 'long-text',
        label: 'Was funktioniert nicht, was funktioniert zu langsam, was funktioniert gar nicht?',
        required: true,
        minChars: 40,
        placeholder: 'Beispiel: Unser M365-Tenant wurde 2020 ohne Identity-Konzept aufgesetzt. Drei AD-Strukturen parallel, Conditional Access greift unzuverlässig, Copilot-Pilot stockt seit drei Monaten an den Berechtigungen.',
      },
    ],
  },

  /* ── Conditional Tiefe-Steps ───────────────────────────────────── */

  {
    id: 'tiefe-marke',
    num: '04',
    title: 'Tiefe — Marke & Reichweite',
    lede: 'Drei Quick-Choices, eine offene Zeile.',
    showIfSaeule: 'marke',
    fields: [
      {
        name: 'tiefe.marke.websiteStatus',
        type: 'select',
        label: 'Status Website heute',
        required: true,
        width: 'half',
        options: [
          { value: 'keine',     label: 'Keine eigene Website' },
          { value: 'wordpress', label: 'WordPress, älter als 3 Jahre' },
          { value: 'modern',    label: 'Modern, aber überaltert' },
          { value: 'aktuell',   label: 'Aktuell, technisch ok' },
        ],
      },
      {
        name: 'tiefe.marke.brandKlarheit',
        type: 'select',
        label: 'Brand-Klarheit',
        required: true,
        width: 'half',
        options: [
          { value: 'stark',  label: 'Stark — Positionierung sitzt' },
          { value: 'mittel', label: 'Mittel — wirkt generisch' },
          { value: 'unklar', label: 'Unklar — austauschbar' },
        ],
      },
      {
        name: 'tiefe.marke.reichweite',
        type: 'select',
        label: 'Reichweite heute',
        required: true,
        width: 'full',
        options: [
          { value: 'organisch', label: 'Organisch über SEO' },
          { value: 'paid',      label: 'Paid Ads im Einsatz' },
          { value: 'empfehlung',label: 'Empfehlung / Mund-zu-Mund' },
          { value: 'nichts',    label: 'Nichts Aktives' },
        ],
      },
      {
        name: 'tiefe.marke.offen',
        type: 'long-text',
        label: 'Wo hakt es konkret beim Auftritt? (optional)',
        required: false,
        placeholder: 'Optional — eine konkrete Frage hilft mir bei der Vorbereitung.',
      },
    ],
  },
  {
    id: 'tiefe-m365',
    num: '04',
    title: 'Tiefe — M365 & Cloud',
    lede: 'Wo steht euer Tenant wirklich.',
    showIfSaeule: 'm365',
    fields: [
      {
        name: 'tiefe.m365.tenant',
        type: 'select',
        label: 'Tenant-Status',
        required: true,
        width: 'half',
        options: [
          { value: 'greenfield', label: 'Greenfield — sauber neu' },
          { value: 'migriert',   label: 'Migriert — älter, läuft' },
          { value: 'hybrid',     label: 'Hybrid — AD + Cloud-Mix' },
          { value: 'mehrtenant', label: 'Mehrere Tenants parallel' },
          { value: 'unklar',     label: 'Ehrlich unsicher' },
        ],
      },
      {
        name: 'tiefe.m365.identity',
        type: 'select',
        label: 'Identity-Setup',
        required: true,
        width: 'half',
        options: [
          { value: 'entra-id-only', label: 'Reine Entra ID' },
          { value: 'ad-only',       label: 'Reine On-Prem-AD' },
          { value: 'hybrid',        label: 'Hybrid (AD + Entra Connect)' },
          { value: 'unklar',        label: 'Niemand kümmert sich' },
        ],
      },
      {
        name: 'tiefe.m365.geraete',
        type: 'select',
        label: 'Geräte-Management',
        required: true,
        width: 'full',
        options: [
          { value: 'intune', label: 'Intune flächendeckend' },
          { value: 'oem',    label: 'OEM-Tools (DEP, Autopilot)' },
          { value: 'mix',    label: 'Mix verschiedener Tools' },
          { value: 'keiner', label: 'Kein zentrales Management' },
        ],
      },
      {
        name: 'tiefe.m365.offen',
        type: 'long-text',
        label: 'Was funktioniert nicht wie ihr es wollt? (optional)',
        required: false,
        placeholder: 'Optional — konkrete Symptome helfen mir bei der Vorbereitung.',
      },
    ],
  },
  {
    id: 'tiefe-ai',
    num: '04',
    title: 'Tiefe — KI & Automatisierung',
    lede: 'Wo ihr beim Thema KI heute steht.',
    showIfSaeule: 'ai',
    fields: [
      {
        name: 'tiefe.ai.einsatz',
        type: 'select',
        label: 'KI heute',
        required: true,
        width: 'half',
        options: [
          { value: 'nichts',    label: 'Nicht im Einsatz' },
          { value: 'pilot',     label: 'Copilot pilotiert' },
          { value: 'produktiv', label: 'Copilot produktiv' },
          { value: 'eigene',    label: 'Eigene Agents' },
        ],
      },
      {
        name: 'tiefe.ai.daten',
        type: 'select',
        label: 'Daten-Reife',
        required: true,
        width: 'half',
        options: [
          { value: 'strukturiert', label: 'Strukturiert, dokumentiert' },
          { value: 'mix',          label: 'Gemischt' },
          { value: 'chaotisch',    label: 'Chaotisch — Insellösungen' },
        ],
      },
      {
        name: 'tiefe.ai.useCase',
        type: 'select',
        label: 'Use-Case-Klarheit',
        required: true,
        width: 'full',
        options: [
          { value: 'konkret',    label: 'Konkreter Use-Case identifiziert' },
          { value: 'vage',       label: 'Vage Idee' },
          { value: 'explorativ', label: 'Explorativ — wollen erst lernen' },
        ],
      },
      {
        name: 'tiefe.ai.offen',
        type: 'long-text',
        label: 'Welcher eine Use-Case wäre den Aufwand wert? (optional)',
        required: false,
        placeholder: 'Optional — wenn ihr eine Idee habt, schreibt sie hier.',
      },
    ],
  },
  {
    id: 'tiefe-strategie',
    num: '04',
    title: 'Tiefe — Strategie, Change & Security',
    lede: 'Wo Strategie und Security heute stehen.',
    showIfSaeule: 'strategie',
    fields: [
      {
        name: 'tiefe.strategie.roadmap',
        type: 'select',
        label: 'Digital-Roadmap',
        required: true,
        width: 'half',
        options: [
          { value: 'existiert', label: 'Existiert schriftlich' },
          { value: 'informell', label: 'Informell, im Kopf' },
          { value: 'keine',     label: 'Keine' },
        ],
      },
      {
        name: 'tiefe.strategie.security',
        type: 'select',
        label: 'Security / ISMS',
        required: true,
        width: 'half',
        options: [
          { value: 'aktiv',  label: 'ISMS aktiv (z.B. ISO 27001)' },
          { value: 'aufbau', label: 'Im Aufbau' },
          { value: 'nichts', label: 'Nicht thematisiert' },
        ],
      },
      {
        name: 'tiefe.strategie.change',
        type: 'select',
        label: 'Change-Erfahrung',
        required: true,
        width: 'full',
        options: [
          { value: 'viel',  label: 'Viel — wir können das' },
          { value: 'etwas', label: 'Etwas — vereinzelt' },
          { value: 'wenig', label: 'Wenig — lernen noch' },
        ],
      },
      {
        name: 'tiefe.strategie.offen',
        type: 'long-text',
        label: 'Welches strategische Thema soll geklärt werden? (optional)',
        required: false,
        placeholder: 'Optional — eine offene Frage hilft mir bei der Vorbereitung.',
      },
    ],
  },

  /* ── Vision + Rahmen ───────────────────────────────────────────── */

  {
    id: 'vision',
    num: '05',
    title: 'Vision & Frage',
    lede: 'Das Zielbild und die eine Frage, die das Briefing am Ende beantworten soll.',
    fields: [
      {
        name: 'zielbild',
        type: 'long-text',
        label: 'Wo wollt ihr in 12 – 18 Monaten stehen?',
        required: true,
        minChars: 30,
        placeholder: 'Beispiel: M365-Tenant konsolidiert, Conditional Access greift überall, ISMS-Vorbereitung abgeschlossen, drei produktive Copilot-Use-Cases im Vertrieb.',
      },
      {
        name: 'kernfrage',
        type: 'long-text',
        label: 'Die eine Frage — die wichtigste, die euch umtreibt.',
        required: true,
        minChars: 15,
        placeholder: 'Beispiel: Lohnt sich Copilot für 200 User in unserem Setup, oder erst Identity neu bauen?',
      },
    ],
  },
  {
    id: 'rahmen',
    num: '06',
    title: 'Rahmen',
    lede: 'Realitätsanker — keine Verbindlichkeit. Dann läuft das Briefing.',
    fields: [
      {
        name: 'entscheidungslage',
        type: 'select',
        label: 'Wo steht ihr in der Entscheidungsfindung?',
        required: true,
        width: 'full',
        options: ENTSCHEIDUNG_OPTIONS,
      },
      {
        name: 'zeithorizont',
        type: 'select',
        label: 'Wann soll es losgehen?',
        required: true,
        width: 'half',
        options: ZEIT_OPTIONS,
      },
      {
        name: 'budget',
        type: 'select',
        label: 'Budget-Korridor',
        required: true,
        width: 'half',
        options: BUDGET_OPTIONS,
      },
      {
        name: 'bisherigeVersuche',
        type: 'long-text',
        label: 'Was habt ihr schon probiert — was hat nicht gewirkt? (optional)',
        required: false,
        placeholder: 'Optional — vorherige Beratungen, Tool-Käufe, interne Initiativen.',
      },
      {
        name: 'anrede',
        type: 'select',
        label: 'Du oder Sie?',
        required: true,
        width: 'half',
        options: ANREDE_OPTIONS,
      },
      {
        name: 'telefon',
        type: 'phone',
        label: 'Telefon (optional)',
        required: false,
        width: 'half',
      },
      { name: 'website', type: 'honeypot', label: 'Website', required: false },
    ],
  },
]

/** Filtert Conditional Steps nach gewählten Säulen. */
export function getActiveSteps(saeulen: readonly Saeule[]): Step[] {
  return STEPS.filter(step => {
    if (!step.showIfSaeule) return true
    return saeulen.includes(step.showIfSaeule)
  })
}
