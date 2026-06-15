import {
  ENGAGEMENTS,
  getRunningEngagements as getRunningEngagementsRaw,
  getHeroStatusEngagements as getHeroStatusEngagementsRaw,
  getCapacity as getCapacityRaw,
  groupEngagementsByState as groupEngagementsByStateRaw,
  getDoneDisplayCount as getDoneDisplayCountRaw,
  type Engagement,
  type EngagementState,
} from '../../engagements'

export function getEngagements(): Engagement[] {
  return [...ENGAGEMENTS]
}

export const getRunningEngagements    = getRunningEngagementsRaw
export const getHeroStatusEngagements = getHeroStatusEngagementsRaw
export const getCapacity              = getCapacityRaw
export const groupEngagementsByState  = groupEngagementsByStateRaw
export const getDoneDisplayCount      = getDoneDisplayCountRaw

export type { Engagement, EngagementState }
