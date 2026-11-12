/**
 * Nächstes Kalenderquartal für die öffentliche Kapazitätsanzeige.
 * Beispiele: November 2026 → Q1 2027, Januar 2027 → Q2 2027, April 2027 → Q3 2027.
 */

export interface Quarter {
  /** 1–4 */
  quarter: number
  year:    number
  /** „Q1 2027" */
  label:   string
  /** Erster Tag des Quartals, 00:00 Ortszeit */
  start:   Date
}

export function getNextQuarter(now: Date = new Date()): Quarter {
  const current = Math.floor(now.getMonth() / 3) // 0–3
  const next = (current + 1) % 4
  const year = now.getFullYear() + (current === 3 ? 1 : 0)
  return { quarter: next + 1, year, label: `Q${next + 1} ${year}`, start: new Date(year, next * 3, 1) }
}
