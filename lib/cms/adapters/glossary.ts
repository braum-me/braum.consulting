import {
  getAllTerms,
  getTerm,
  getTermSlugs,
  findMatches,
  type GlossaryTerm,
  type GlossaryCategory,
  type TermMatch,
} from '../../glossary'

export function getGlossaryTerms(): GlossaryTerm[] {
  return getAllTerms()
}

export function getGlossaryTerm(slug: string): GlossaryTerm | undefined {
  return getTerm(slug)
}

export function getGlossaryTermSlugs(): string[] {
  return getTermSlugs()
}

export const findMatchingTerms = findMatches

export type { GlossaryTerm, GlossaryCategory, TermMatch }
