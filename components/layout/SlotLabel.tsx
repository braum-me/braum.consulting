'use client'

import { useEffect, useState } from 'react'
import { getCurrentSlotQuarter } from '@/lib/quarter'

/**
 * Zeigt das aktuell verfügbare Quartal an. Client-Side berechnet, damit
 * es nicht beim Build-Zeitpunkt einfriert (verhindert „1.7. und es steht
 * noch Q2 da").
 */
export default function SlotLabel({ prefix = 'nächster Slot · ' }: { prefix?: string }) {
  const [label, setLabel] = useState<string>('')

  useEffect(() => {
    setLabel(getCurrentSlotQuarter().label)
  }, [])

  if (!label) {
    // Vor Hydration: leerer Platzhalter (kein Layout-Shift weil Mono-Font)
    return <span aria-hidden style={{ visibility: 'hidden' }}>{prefix}Q1</span>
  }

  return <>{prefix}{label}</>
}
