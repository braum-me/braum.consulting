/**
 * Passwort-Bewertung mit zxcvbn-ts (Mustererkennung statt reiner Zeichen-Rechnung):
 * erkennt häufige Passwörter, Wörter und Namen (Deutsch + allgemein), Jahreszahlen,
 * Wiederholungen, Folgen und Tastaturmuster (u. a. QWERTZ).
 *
 * Läuft nur im Browser. Das Passwort wird nicht übertragen, gespeichert oder geloggt.
 * Die Wörterbücher werden erst auf der Passwort-Seite nachgeladen.
 */
import type { ZxcvbnResult } from '@zxcvbn-ts/core'

export type Band = 'sehr schwach' | 'schwach' | 'okay' | 'stark' | 'sehr stark'

/**
 * Bänder nach geschätzter Zahl der Rateversuche (log10). zxcvbn vergibt ab 10^10
 * seine Höchstnote; hier bewusst strenger, weil erbeutete Hashes offline
 * angegriffen werden.
 */
export function bandFor(guessesLog10: number): Band {
  if (guessesLog10 < 6)  return 'sehr schwach'
  if (guessesLog10 < 10) return 'schwach'
  if (guessesLog10 < 12) return 'okay'
  if (guessesLog10 < 14) return 'stark'
  return 'sehr stark'
}

export interface Bewertung {
  band: Band
  /** Knackdauer bei gut gespeicherten Hashes (10.000 Versuche/s), deutsch formatiert */
  dauer: string
  warnung: string | null
  tipps: string[]
}

export function bewerten(z: { check: (pw: string) => ZxcvbnResult }, pw: string): Bewertung | null {
  if (!pw) return null
  const r = z.check(pw)
  return {
    band: bandFor(r.guessesLog10),
    dauer: r.crackTimes.offlineSlowHashingXPerSecond.display,
    warnung: r.feedback.warning,
    tipps: r.feedback.suggestions,
  }
}

type Estimator = { check: (pw: string) => ZxcvbnResult }
let laden: Promise<Estimator> | null = null

/** Lädt zxcvbn-ts samt Wörterbüchern einmalig (eigener Chunk). */
export function ladeBewertung(): Promise<Estimator> {
  laden ??= Promise.all([
    import('@zxcvbn-ts/core'),
    import('@zxcvbn-ts/language-common'),
    import('@zxcvbn-ts/language-de'),
  ]).then(([core, common, de]) =>
    new core.ZxcvbnFactory({
      dictionary: { ...common.dictionary, ...de.dictionary },
      graphs: common.adjacencyGraphs,
      translations: de.translations,
    }),
  )
  return laden
}
