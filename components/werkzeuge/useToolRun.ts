'use client'

import { useCallback, useMemo, useRef } from 'react'
import { track, type ToolSlug } from '@/lib/analytics'

/**
 * Zählt einen Werkzeug-Durchlauf genau einmal:
 * - `start()` bei der ersten echten Eingabe (nicht beim Laden der Seite und
 *   nicht beim Wiederherstellen eines geteilten Ergebnis-Links),
 * - `complete()` beim ersten erreichten Ergebnis — nur, wenn der Durchlauf
 *   gestartet wurde,
 * - `reset()` bei „Neu starten“: die nächste Eingabe zählt als neuer Durchlauf.
 * Gesendet wird nur die Werkzeug-Kennung, nie Antworten oder Ergebnisse.
 */
export function useToolRun(tool: ToolSlug) {
  const started = useRef(false)
  const completed = useRef(false)

  const start = useCallback(() => {
    if (started.current) return
    started.current = true
    track('tool_started', { tool })
  }, [tool])

  const complete = useCallback(() => {
    if (!started.current || completed.current) return
    completed.current = true
    track('tool_completed', { tool })
  }, [tool])

  const reset = useCallback(() => {
    started.current = false
    completed.current = false
  }, [])

  return useMemo(() => ({ start, complete, reset }), [start, complete, reset])
}
