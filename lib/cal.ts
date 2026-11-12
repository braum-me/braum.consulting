/**
 * Cal.com-Embed-Absicherung.
 *
 * Validiert die aus ENV kommende `CAL_EVENT_URL` und gibt sie nur zurück, wenn
 * Protokoll = https und der Host auf der Allowlist steht. Verhindert, dass eine
 * fehlkonfigurierte oder manipulierte URL beliebige Fremd-Inhalte in den
 * Buchungs-Iframe lädt.
 */

// Cal wird self-hosted unter braum.consulting betrieben (z. B.
// cal.braum.consulting — siehe .env.example, CAL_EVENT_URL). Auf der Allowlist
// steht daher ausschließlich die eigene Domain. Die Cal.com-SaaS-Hosts sind
// bewusst NICHT erlaubt: so kann eine fehlkonfigurierte/manipulierte
// CAL_EVENT_URL kein Fremd-Embed in den Buchungs-Iframe laden.
const ALLOWED_CAL_HOSTS = ['braum.consulting']

export function getSafeCalUrl(raw?: string | null): string | null {
  if (!raw) return null
  try {
    const u = new URL(raw)
    if (u.protocol !== 'https:') return null
    const host = u.hostname.toLowerCase()
    const ok = ALLOWED_CAL_HOSTS.some(d => host === d || host.endsWith(`.${d}`))
    return ok ? u.toString() : null
  } catch {
    return null
  }
}

/** Minimal nötige Iframe-Berechtigungen für das Cal-Embed (Booking-Widget). */
export const CAL_FRAME_SANDBOX = 'allow-scripts allow-forms allow-same-origin allow-popups'
