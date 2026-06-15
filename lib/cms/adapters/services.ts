import { SERVICES, getService as getServiceRaw, type Service, type ServiceSlug } from '../../services'

export function getServices(): Service[] {
  return [...SERVICES]
}

export function getService(slug: ServiceSlug): Service | undefined {
  return getServiceRaw(slug)
}

export function getServiceSlugs(): ServiceSlug[] {
  return SERVICES.map(s => s.slug)
}

export type { Service, ServiceSlug }
