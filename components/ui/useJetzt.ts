'use client'

import { useSyncExternalStore } from 'react'

let jetzt: Date | null = null
const subscribe = () => () => {}

/**
 * Aktuelles Datum im Browser, `null` beim Server-Rendering und beim ersten
 * Hydrations-Durchlauf. Für datumsabhängige Anzeigen auf statisch
 * vorgerenderten Seiten (sonst stünde dort das Datum des Builds).
 */
export function useJetzt(): Date | null {
  return useSyncExternalStore(subscribe, () => (jetzt ??= new Date()), () => null)
}
