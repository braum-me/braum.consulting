import { headers } from 'next/headers'

/**
 * Testmodus für automatisierte Tests: `CONTACT_DRY_RUN=1` überspringt Mail-
 * und Notion-Versand der Anfrage-Formulare — aber nur, wenn die Anfrage an
 * localhost geht. Auf der Produktiv-Domain ist der Schalter wirkungslos.
 */
export async function isLocalDryRun(): Promise<boolean> {
  if (process.env.CONTACT_DRY_RUN !== '1') return false
  const host = (await headers()).get('host') ?? ''
  return /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host)
}
