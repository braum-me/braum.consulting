/**
 * Services — Browser-safe Loader via static JSON-Imports.
 * Icon wird via String-Mapping aufgelöst (JSON kann keine Funktions-Refs).
 */

import { Globe, Server, Brain, Compass } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import marke     from '../content/services/marke.json'
import m365      from '../content/services/m365.json'
import ai        from '../content/services/ai.json'
import strategie from '../content/services/strategie.json'

export type ServiceSlug = 'marke' | 'm365' | 'ai' | 'strategie'

export interface Service {
  slug:        ServiceSlug
  num:         string
  icon:        LucideIcon
  title:       string
  short:       string
  bodyIntro?:  string
  bullets:     string[]
  result:      string
  resultLabel: string
  lead:        string
  problem:     string[]
  outcomes:    string[]
  scope:       string[]
  tags:        string[]
  caseRefs:    Array<{ num: string; title: string; metric: string; metricLabel: string }>
  pricing:     string
  duration:    string
  metaDesc:    string
  faqs:        Array<{ q: string; a: string }>
}

const ICON_MAP: Record<string, LucideIcon> = { Globe, Server, Brain, Compass }

interface ServiceJSON extends Omit<Service, 'icon'> {
  iconName?: string | null
}

function resolve(raw: ServiceJSON): Service {
  const { iconName, ...rest } = raw
  const icon = (iconName && ICON_MAP[iconName]) || Compass
  return { ...rest, icon } as Service
}

// Reihenfolge bewusst: Marke → M365 → AI → Strategie (Lotse-Bogen)
export const SERVICES: Service[] = [
  resolve(marke     as ServiceJSON),
  resolve(m365      as ServiceJSON),
  resolve(ai        as ServiceJSON),
  resolve(strategie as ServiceJSON),
]

export function getService(slug: string): Service | undefined {
  return SERVICES.find(s => s.slug === slug)
}
