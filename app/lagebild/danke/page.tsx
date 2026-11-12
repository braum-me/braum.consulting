import type { Metadata } from 'next'

import { findLeadByToken, readSelect, readMultiSelect, PROPS } from '@/lib/notion'
import { getSafeCalUrl } from '@/lib/cal'
import DankeExperience from './DankeExperience'

export const metadata: Metadata = {
  title: 'Briefing kommt — Termin auswählen',
  description: 'Dein Lagebild-Briefing wird vorbereitet. Den Termin kannst du direkt hier auswählen.',
  robots: { index: false, follow: false },
}

// PII-Seite (Lead-Lookup per Token): nie prerendern/cachen — dynamisch pro Request.
export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{ token?: string }>
}

/**
 * Lagebild · Danke + Termin
 *
 * Server-Wrapper: holt den Lead per Token (Notion), reicht die Daten an die
 * Client-Experience (Konfetti + Motion) weiter. Erwartet ?token=xyz im URL.
 */
export default async function DankePage({ searchParams }: PageProps) {
  const { token } = await searchParams

  // Lead-Lookup darf die Seite nie crashen: ungültiger/Test-Token, fehlende
  // Notion-Config oder Notion-Ausfall → still auf Default-Ansprache zurückfallen.
  let lead: Awaited<ReturnType<typeof findLeadByToken>> = null
  if (token) {
    try {
      lead = await findLeadByToken(token)
    } catch (err) {
      console.error('[danke] Lead-Lookup fehlgeschlagen, Fallback auf Default:', err)
    }
  }

  const anrede = lead ? readSelect(lead, PROPS.anrede) : null
  const saeulen = lead ? readMultiSelect(lead, PROPS.saeulen) : []

  const dirPron = anrede === 'sie' ? 'Ihr' : 'Dein'
  const dirYou = anrede === 'sie' ? 'Sie' : 'du'

  return (
    <DankeExperience
      dirPron={dirPron}
      dirYou={dirYou}
      anrede={anrede}
      saeulenCount={saeulen.length}
      calUrl={getSafeCalUrl(process.env.CAL_EVENT_URL)}
    />
  )
}
