/**
 * Single Source of Truth für alle laufenden + abgeschlossenen Engagements.
 *
 * Konsumenten:
 *   - components/home/HeroStatus.tsx → kompakte „Laufende Projekte"-Liste auf der Mainpage
 *   - components/sections/PortfolioHero.tsx → Kanban-Board auf der /portfolio-Seite
 *
 * Wenn ein Engagement seinen Status ändert, ändert sich beides synchron.
 *
 * State-Modell:
 *   - scoping  → Lagebild-Phase, Anbahnung, noch kein Mandat
 *   - active   → laufendes Mandat, am Werk
 *   - wrapping → kurz vor Übergabe an internes Team
 *   - done     → abgeschlossen
 *
 * Optional `highlight`: maximal ein Engagement zur Zeit. Wird auf der Site
 * mit Brand-Amber + Pulse statt regulärer State-Farbe gerendert (visueller
 * Schwerpunkt, „das hier ist gerade das aktive Mandat").
 */

import { CASES } from './cases'

export type EngagementState = 'scoping' | 'active' | 'wrapping' | 'done'

export interface Engagement {
  /** Kurz-Name des Mandats, z.B. „M365-Governance", „Sparring-Mandat" */
  project:    string
  /** Anonymisierter Client-Kontext, z.B. „Mittelstand · DACH", „Maschinenbau · BW" */
  client:     string
  state:      EngagementState
  /** Höchstens ein Engagement gleichzeitig. Bekommt Brand-Pulse statt State-Color. */
  highlight?: boolean
  /** Optionaler feinerer Status-Text, der STATE_LABEL überschreibt — z.B.
   *  „staging", „ongoing", „final". Color-Dot bleibt am state. */
  detail?:    string
}

/* ── Mapping-Konstanten (geteilt zwischen Mainpage und Portfolio) ─────── */

export const STATE_LABEL: Record<EngagementState, string> = {
  scoping:  'scoping',
  active:   'aktiv',
  wrapping: 'finish',
  done:     'done',
}

/** Spalten-Label für die /portfolio Kanban-Ansicht */
export const STATE_COLUMN_LABEL: Record<EngagementState, string> = {
  scoping:  'Lagebild',
  active:   'In Arbeit',
  wrapping: 'Übergabe',
  done:     'Abgeschlossen',
}

/** CSS-Variable mit der Statusfarbe (Token-System aus globals.css) */
export const STATE_COLOR_VAR: Record<EngagementState, string> = {
  scoping:  'var(--warning-fg)',
  active:   'var(--success-fg)',
  wrapping: 'var(--info-fg)',
  done:     'var(--fg-faint)',
}

/* ── Daten ────────────────────────────────────────────────────────────── */

// Engagements werden aus content/engagements.json geladen.
// Editieren via JSON-File (oder später via BraumStack Management Interface).
import engagementsJson from '../content/engagements.json'

export const ENGAGEMENTS: Engagement[] = engagementsJson as Engagement[]

/* ── Selektoren / Helper ──────────────────────────────────────────────── */

/** Laufende Engagements (alles außer „done") */
export function getRunningEngagements(): Engagement[] {
  return ENGAGEMENTS.filter(e => e.state !== 'done')
}

/** Engagements nach State gruppiert (für Kanban)
 *
 *  Done-Spalte wird aus den Case-Studies gefüttert (drei jüngste featured
 *  Cases), nicht aus den Engagements selbst. So zeigt das Kanban immer
 *  aktuelle Referenzen, ohne dass jemand die done-Liste pflegen muss.
 */
export function groupEngagementsByState(): Record<EngagementState, Engagement[]> {
  return {
    scoping:  ENGAGEMENTS.filter(e => e.state === 'scoping'),
    active:   ENGAGEMENTS.filter(e => e.state === 'active'),
    wrapping: ENGAGEMENTS.filter(e => e.state === 'wrapping'),
    done:     getRecentDoneFromCases(3),
  }
}

/** Wandelt die N jüngsten featured Cases in Pseudo-Engagements (state=done)
 *  damit sie im Kanban-Renderer wie reguläre Engagements verarbeitbar sind. */
function getRecentDoneFromCases(limit: number): Engagement[] {
  return [...CASES]
    .filter(c => c.featured)
    .sort((a, b) => b.year.localeCompare(a.year))
    .slice(0, limit)
    .map(c => ({
      project: c.title,
      client:  c.sector,
      state:   'done' as const,
      detail:  c.year,
    }))
}

/** Maximale Anzahl Engagements in der HeroStatus-Kachel auf der Mainpage */
export const HERO_STATUS_LIMIT = 4

/**
 * Auswahl für die kompakte HeroStatus-Liste auf der Mainpage:
 *   1. Highlighted-Engagement (wenn vorhanden), egal welcher State
 *   2. Pro verbleibendem running-State (active → scoping → wrapping)
 *      jeweils das erste passende Engagement
 *   3. Fallback: weitere running-Engagements bis HERO_STATUS_LIMIT erreicht
 *
 * Wenn mehrere active-Mandate existieren, wird das highlighted bevorzugt,
 * sodass die Zeile mit Brand-Amber + Pulse die User-Aufmerksamkeit nimmt.
 */
export function getHeroStatusEngagements(): Engagement[] {
  const running = getRunningEngagements()
  const highlighted = running.find(e => e.highlight)
  // Highlight zuerst, dann der Rest in JSON-Reihenfolge — so kann der
  // Autor die Liste über die engagements.json explizit sortieren.
  const ordered = highlighted
    ? [highlighted, ...running.filter(e => e !== highlighted)]
    : running
  return ordered.slice(0, HERO_STATUS_LIMIT)
}

/* ── Capacity (Mainpage „1 Slot frei"-Badge) ──────────────────────────── */

export const CAPACITY_TOTAL = 4

export interface CapacityInfo {
  filled: number
  total:  number
  free:   number
  label:  string
}

/**
 * Belegung der Engagement-Slots pro Quartal.
 * Capped bei CAPACITY_TOTAL: mehr als 4 running ist möglich (z.B. Sparring +
 * Discovery parallel), aber die UI zeigt max. 4-of-4 belegt.
 */
export function getCapacity(): CapacityInfo {
  const runningCount = getRunningEngagements().length
  const filled = Math.min(runningCount, CAPACITY_TOTAL)
  const free   = Math.max(0, CAPACITY_TOTAL - filled)

  const label =
    free === 0
      ? 'Ausgebucht'
      : free === 1
        ? '1 Slot frei'
        : `${free} Slots frei`

  return { filled, total: CAPACITY_TOTAL, free, label }
}

/**
 * Anzeige-Count für die „Abgeschlossen"-Spalte im Portfolio-Kanban.
 * Bezieht aus lib/cases.ts, damit die Zahl mit der dokumentierten Liste
 * auf /portfolio übereinstimmt.
 */
export function getDoneDisplayCount(): string {
  return `${CASES.length}+`
}
