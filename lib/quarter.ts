/**
 * Quartal-Helper für die Slot-Verfügbarkeits-Anzeige.
 * Vermeidet die Situation „1. Juli und auf der Seite steht noch Q2".
 *
 * Logik:
 * - Wenn aktuelles Quartal noch > THRESHOLD_DAYS läuft, zeige es an
 *   („nächster Slot ab Q2")
 * - Wenn weniger als THRESHOLD_DAYS bis Quartals-Ende übrig, zeige
 *   schon das nächste Quartal an
 */

const THRESHOLD_DAYS = 21

export interface SlotInfo {
  /** „Q2" / „Q3" / „Q4" / „Q1" */
  quarter: string
  /** Volle Jahresangabe falls nicht aktuelles Jahr, sonst null */
  year:    number | null
  /** Kombiniert: „Q2" oder „Q1 2027" */
  label:   string
}

/**
 * Liefert das aktuelle Quartal, oder das nächste, wenn das aktuelle
 * praktisch zu Ende ist (< THRESHOLD_DAYS verbleibend).
 */
export function getCurrentSlotQuarter(now: Date = new Date()): SlotInfo {
  const year  = now.getFullYear()
  const month = now.getMonth() // 0-11

  // Quartals-End-Datum (letzter Tag des Quartals)
  const quarterIdx = Math.floor(month / 3) // 0..3
  const quarterEndMonth = quarterIdx * 3 + 2 // Mar, Jun, Sep, Dec
  const quarterEnd = new Date(year, quarterEndMonth + 1, 0) // letzter Tag

  const msUntilEnd = quarterEnd.getTime() - now.getTime()
  const daysUntilEnd = msUntilEnd / (1000 * 60 * 60 * 24)

  const useNext = daysUntilEnd < THRESHOLD_DAYS
  const finalIdx = useNext ? (quarterIdx + 1) % 4 : quarterIdx
  const finalYear = useNext && quarterIdx === 3 ? year + 1 : year

  const quarter = `Q${finalIdx + 1}`
  const showYear = finalYear !== now.getFullYear()
  const label = showYear ? `${quarter} ${finalYear}` : quarter

  return {
    quarter,
    year: showYear ? finalYear : null,
    label,
  }
}
