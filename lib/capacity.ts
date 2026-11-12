import { getNextQuarter, type Quarter } from './quarter'

/**
 * Projektkapazität: bewusst begrenzt auf wenige parallele Kundenprojekte.
 * Einzige Quelle für alle Kapazitätsangaben (Startseite, Portfolio).
 */
export const CAPACITY_TOTAL = 2

/** Was die Kapazitätsrechnung von einem Engagement braucht. */
export interface CapacityEngagement {
  state:    'scoping' | 'active' | 'wrapping' | 'done'
  /** Abschlussdatum (ISO, z. B. „2027-02-28"). Ohne Datum zählt das Projekt als weiterlaufend. */
  endDate?: string
}

export interface CapacityInfo {
  /** Belegte Slots, höchstens CAPACITY_TOTAL */
  filled:  number
  total:   number
  free:    number
  full:    boolean
  /** Bezugsquartal, z. B. „Q1 2027"; null vor dem ersten Rendern im Browser */
  quarter: string | null
  /** „1 von 2 Projektslots belegt" */
  label:   string
}

/**
 * Belegung im nächsten Kalenderquartal. Ein laufendes Projekt belegt einen
 * Slot, solange kein Abschlussdatum vor Quartalsbeginn hinterlegt ist —
 * konservativ, damit keine unbelegte Verfügbarkeit versprochen wird.
 * Ohne `now` (Server-Rendering) zählen alle laufenden Projekte.
 */
export function computeCapacity(engagements: CapacityEngagement[], now: Date | null): CapacityInfo {
  const q: Quarter | null = now ? getNextQuarter(now) : null
  const occupied = engagements.filter(e =>
    e.state !== 'done' && (!q || !e.endDate || new Date(e.endDate) >= q.start),
  ).length
  const filled = Math.min(occupied, CAPACITY_TOTAL)
  const free = CAPACITY_TOTAL - filled
  return {
    filled,
    total: CAPACITY_TOTAL,
    free,
    full: free === 0,
    quarter: q?.label ?? null,
    label: `${filled} von ${CAPACITY_TOTAL} Projektslots belegt`,
  }
}
