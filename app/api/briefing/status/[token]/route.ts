import { NextResponse } from 'next/server'
import { findLeadByToken, readSelect, PROPS } from '@/lib/notion'

/**
 * GET /api/briefing/status/[token]
 *
 * Lightweight Polling-Endpoint für die /briefing/[token] Pending-Variante.
 * Antwortet mit { status: 'pending' | 'generating' | 'ready' | 'failed' }.
 *
 * Wird vom Client-Component PendingPoller alle 4s aufgerufen, sobald
 * `ready` reagiert die Page mit router.refresh().
 *
 * Cache: no-store — wir brauchen jedes Mal frische Daten.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params
  if (!token || token.length < 8) {
    return NextResponse.json({ status: 'unknown' }, { status: 404 })
  }

  try {
    const lead = await findLeadByToken(token)
    if (!lead) {
      return NextResponse.json({ status: 'unknown' }, { status: 404 })
    }
    const status = readSelect(lead, PROPS.briefingStatus) ?? 'pending'
    return NextResponse.json(
      { status },
      { status: 200, headers: { 'Cache-Control': 'no-store' } },
    )
  } catch (err) {
    console.error('[briefing-status] error', err)
    return NextResponse.json({ status: 'error' }, { status: 500 })
  }
}
