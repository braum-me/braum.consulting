/**
 * CMS-Adapter-Layer (Payload-ready).
 *
 * Alle Content-Konsumenten (Pages, Sections) sollen langfristig durch
 * diese Adapter gehen, nicht direkt auf lib/cases.ts, lib/posts.ts etc.
 * zugreifen. Heute liefert der Adapter die bestehenden TS-Daten — sobald
 * Payload angebunden ist, tausche ich die Implementierung intern aus,
 * ohne dass ein Consumer angefasst werden muss.
 *
 * Naming-Convention:
 *   getXxx()       → sync, kommt aus statischen Files
 *   fetchXxx()     → async, kommt aus externer Quelle (RSS, später Payload)
 *
 * Migration zu Payload (Phase „später"):
 *   1. payload-collections/* anlegen mit denselben Type-Shapes
 *   2. Adapter-Bodies austauschen: `getCases()` ruft Payload-API statt
 *      `import { CASES }`. Cache via `unstable_cache` mit Tag-Revalidation.
 *   3. Pages bleiben unverändert.
 */

export { getCases, getCase, getCaseSlugs } from './adapters/cases'
export type { CaseStudy } from './adapters/cases'

export { getServices, getService, getServiceSlugs } from './adapters/services'
export type { Service, ServiceSlug } from './adapters/services'

export {
  getEngagements,
  getRunningEngagements,
  getHeroStatusEngagements,
  getCapacity,
  groupEngagementsByState,
  getDoneDisplayCount,
} from './adapters/engagements'
export type { Engagement, EngagementState } from './adapters/engagements'

export {
  getInternalPosts,
  getInternalPost,
  getInternalSlugs,
  fetchExternalPosts,
  fetchAllPosts,
  fetchRecentPosts,
} from './adapters/posts'
export type { InternalPost, ExternalPost, Post } from './adapters/posts'

export {
  getGlossaryTerms,
  getGlossaryTerm,
  getGlossaryTermSlugs,
  findMatchingTerms,
} from './adapters/glossary'
export type { GlossaryTerm, GlossaryCategory, TermMatch } from './adapters/glossary'
