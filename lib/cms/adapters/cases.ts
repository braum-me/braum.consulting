/**
 * Cases-Adapter — wraps lib/cases.ts hinter einem stabilen API-Layer.
 * Future: ersetze die Bodies durch Payload-Collection-Calls.
 */
import { CASES, getCase as getCaseRaw, type CaseStudy } from '../../cases'

export function getCases(): CaseStudy[] {
  return [...CASES]
}

export function getCase(num: string): CaseStudy | undefined {
  return getCaseRaw(num)
}

export function getCaseSlugs(): string[] {
  return CASES.map(c => c.num)
}

export type { CaseStudy }
