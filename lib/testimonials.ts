/**
 * Testimonials — echte Kundenstimmen.
 *
 * WICHTIG (Brand-Regel, CLAUDE.md): Keine Quotes erfinden. Dieses Array bleibt
 * leer, bis echte, freigegebene Zitate vorliegen. Solange `TESTIMONIALS` leer
 * ist, rendert die <Testimonials />-Section gar nichts — es erscheint also nie
 * ein Platzhalter oder Fake auf der Live-Site.
 *
 * So fügst du eine echte Stimme hinzu:
 *   1. Zitat + Freigabe vom Kunden einholen (1–2 Sätze reichen).
 *   2. Einen Eintrag nach folgendem Muster ergänzen:
 *
 *      {
 *        quote:    'Stefan hat unsere Website von Grund auf neu gedacht — seitdem
 *                   kommen Anfragen rein, die vorher nie kamen.',
 *        author:   'Vorname Nachname',          // oder nur Rolle, wenn anonym gewünscht
 *        role:     'Inhaber, Musterfirma GmbH',  // Rolle · Firma
 *        caseSlug: 'wolfswerk',                  // optional: verlinkt auf den Case
 *        field:    'marke',                      // optional: Säulen-Zuordnung
 *      },
 *
 * Kandidaten mit Klarnamen-Case (gute erste Asks): wolfswerk,
 * osteopathie-faust, steuerberater-schaefer, stewart-consult.
 *
 * Tech-Mandate (m365/ai/strategie) sind diskret — dort nur anonyme Rollen-Zitate
 * („IT-Leiter eines Maschinenbauers") und nur mit ausdrücklicher Freigabe.
 */

import type { ServiceSlug } from './services'

export interface Testimonial {
  /** Das echte, freigegebene Zitat. Kurz halten — 1–2 Sätze wirken am stärksten. */
  quote: string
  /** Name der Person, oder eine anonyme Rolle, wenn so gewünscht. */
  author: string
  /** Rolle und/oder Firma, z.B. „Inhaberin, Praxis Faust". */
  role: string
  /** Optional: Slug eines Cases (content/cases/{slug}.json) für die Verlinkung. */
  caseSlug?: string
  /** Optional: Säulen-Zuordnung für spätere Filterung/Platzierung. */
  field?: ServiceSlug
}

export const TESTIMONIALS: Testimonial[] = [
  // Noch leer — wird mit echten, freigegebenen Stimmen befüllt (siehe Doc oben).
]
