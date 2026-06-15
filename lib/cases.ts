/**
 * Cases — Browser-safe Loader via static JSON-Imports.
 *
 * URL-Routing: /cases/[id] erwartet als id den Slug (z.B. "stewart-consult").
 * Slug = c.num (für Backward-Compat im bestehenden Code).
 *
 * Editier-Workflow: content/cases/{slug}.json editieren, Save, HMR.
 * Bei neuem Case: Datei anlegen + diese Liste erweitern.
 */

import type { ServiceSlug } from './services'

// ── Säule 01 · Marke, Website & Reichweite ─────────────────────────────────
import cStewart       from '../content/cases/stewart-consult.json'
import cWolfswerk     from '../content/cases/wolfswerk.json'
import cSchaefer      from '../content/cases/steuerberater-schaefer.json'
import cHintermeyer   from '../content/cases/holzbau-hintermeyer.json'
import cMalerwerk     from '../content/cases/malerwerk-gaub.json'
import cSchmidt       from '../content/cases/heizungsbau-schmidt.json'
import cBerkel        from '../content/cases/elektro-berkel.json'
import cFaust         from '../content/cases/osteopathie-faust.json'
import cGruen         from '../content/cases/jonathan-gruen.json'

// ── Säule 02 · State-of-the-Art IT & Cloud (anonymisiert) ──────────────────
import cOutline       from '../content/cases/outline-knowledge-base.json'
import cZeroTrust     from '../content/cases/m365-zero-trust-identity.json'

// ── Säule 03 · KI & Automatisierung (anonymisiert) ─────────────────────────
import cPowerPlatCoe  from '../content/cases/power-platform-coe.json'

export interface CaseStudy {
  /** URL-Slug, z.B. "stewart-consult". Wird im Routing als [id] genutzt. */
  num:         string
  title:       string
  sector:      string
  year:        string
  duration:    string
  field:       'm365' | 'marke' | 'ai' | 'strategie'
  fieldLabel:  string
  metric:      string
  metricLabel: string
  impact:      string
  featured?:   boolean
  brief:       string
  context:     string[]
  approach:    string[]
  outcome:     string[]
  tech:        string[]
  serviceSlug: ServiceSlug

  // ── Erweiterungen für Portfolio-Datenbasis (Mai 2026) ────────────────────
  /** Echtes ISO-Datum der letzten Aktualisierung (YYYY-MM-DD). Wird – wenn
   *  gepflegt – in der Sitemap statt des Jahres-Fallbacks als lastModified
   *  genutzt. Optional: fehlt es, greift der konservative Year-Fallback. */
  updatedAt?:   string
  /** Knappe Anchor-Zeile für Cards. */
  anchor?:      string
  /** Hero-/OG-Image (redaktionelles Thumbnail), typisch /cases/{num}.webp. */
  image?:       string
  /** Echter Website-Screenshot, NUR im Showcase-Browser-Frame gezeigt
   *  (getrennt vom Thumbnail). Typisch /cases/{num}-site.webp. Fehlt er,
   *  zeigt das Showcase das generische SVG-Mockup. */
  siteShot?:    string
  /** Marker für anonymisierte Cases. */
  anonymized?:  boolean
  /** Klarer Kundenname, falls vorhanden (sonst undefined → anonym). */
  client?:      string
  /** Live-Website des Kunden (nur bei öffentlichen Marke-Cases). Wird im
   *  Showcase-Device-Frame und im Hero als „Website ansehen“-Link gerendert. */
  clientUrl?:   string
  /** Tracking-ID aus interner Datenbasis-Markdown (z.B. "01-H1"). */
  highlightId?: string
  /** GPT-Prompt für Hero-Bild-Generierung (intern, wird nicht gerendert). */
  imagePrompt?: string
}

export const FIELD_LABELS: Record<CaseStudy['field'], string> = {
  m365:      'M365 · Governance',
  marke:     'Marke & Reichweite',
  ai:        'AI & Automatisierung',
  strategie: 'Strategie · Sparring',
}

export const CASES: CaseStudy[] = [
  // Säule 01 — Marke, Website & Reichweite
  // Highlights zuerst, dann Standard (oben→unten):
  // Malerwerk · Schmidt · Hintermeyer · Faust · Berkel · Grün
  cStewart,
  cWolfswerk,
  cSchaefer,
  cMalerwerk,
  cSchmidt,
  cHintermeyer,
  cFaust,
  cBerkel,
  cGruen,

  // Säule 02 — State-of-the-Art IT & Cloud
  // m365-Reihenfolge: Self-Hosted Wissensbasis · Single Identity
  cOutline,
  cZeroTrust,

  // Säule 03 — KI & Automatisierung
  cPowerPlatCoe,
] as CaseStudy[]

export function getCase(num: string): CaseStudy | undefined {
  return CASES.find(c => c.num === num)
}
