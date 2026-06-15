/**
 * Mapping Säulen → relevante Glossary-Einträge.
 *
 * Wird am Ende des Briefings als „Diese Bibliothek hilft bei der
 * Vorbereitung"-Sektion angezeigt. Eintrag erscheint pro Säule, die
 * im Wizard gewählt wurde. Duplikate werden dedupliziert.
 *
 * Slugs zeigen auf /lexikon/[slug] und nutzen Sites Lexikon als
 * tiefere Vertiefung — kein externes Material.
 */

import type { Saeule } from './notion'

const PER_SAEULE: Record<Saeule, string[]> = {
  marke: [
    'lotsenprinzip',
    'operator',
    'lagebild',
    'wordpress',
    'next-js',
  ],
  m365: [
    'm365-tenant',
    'entra-id',
    'conditional-access',
    'intune',
    'sso',
    'copilot',
  ],
  ai: [
    'copilot',
    'rag',
    'power-platform',
    'ai-governance',
    'lagebild',
  ],
  strategie: [
    'iso-27001',
    'nis2',
    'tisax',
    'dsgvo',
    'avv',
    'lagebild',
    'uebergabe',
  ],
}

/**
 * Liefert die deduplizierten Glossary-Slugs für die gewählten Säulen.
 * Reihenfolge folgt der Säulen-Wahl, innerhalb der Säule der PER_SAEULE-Liste.
 */
export function getGlossarySlugsForSaeulen(saeulen: readonly Saeule[]): string[] {
  const out: string[] = []
  const seen = new Set<string>()
  for (const s of saeulen) {
    for (const slug of PER_SAEULE[s] ?? []) {
      if (!seen.has(slug)) {
        seen.add(slug)
        out.push(slug)
      }
    }
  }
  return out
}
