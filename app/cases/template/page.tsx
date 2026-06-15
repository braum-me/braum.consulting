import type { Metadata } from 'next'
import TemplateBlueprint from './TemplateBlueprint'

/**
 * /cases/template — Interne Vorlage / High-Fidelity-Blueprint für
 * Portfolio-Cases. Arbeits-Referenz, nicht für Suchmaschinen.
 *
 * Statisches Segment → gewinnt gegen die dynamische [id]-Route.
 */
export const metadata: Metadata = {
  title:   'Case-Blueprint (intern)',
  robots:  { index: false, follow: false },
  alternates: { canonical: undefined },
}

export default function CaseTemplatePage() {
  return <TemplateBlueprint />
}
