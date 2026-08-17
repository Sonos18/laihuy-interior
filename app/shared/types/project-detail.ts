import type { MediaAsset } from '~/shared/media/types'
import type { Project } from '~/shared/types/project'

export type ProjectFactKey = 'area' | 'year' | 'style' | 'scope' | 'location'
export type ProjectScopeKey = 'Thiết kế' | 'Sản xuất' | 'Thi công'
export type ProjectDeliveryPhaseKey
  = | 'consultation'
    | 'design'
    | 'production'
    | 'installation'
    | 'handover'
export type ProjectNavSectionId = 'story' | 'gallery' | 'delivery' | 'materials'
export type ProjectExecutionProofId = 'direct-factory' | 'quality' | 'craft'

export type ProjectDetailFact = {
  key: ProjectFactKey
  icon: string
  label: string
  value: string
}

export type ProjectScopeItem = {
  key: ProjectScopeKey
  icon: string
  label: string
}

export type ProjectDeliveryPhase = {
  key: ProjectDeliveryPhaseKey
  icon: string
  label: string
}

export type ProjectExecutionProof = {
  id: ProjectExecutionProofId
  icon: string
  title: string
  description: string
}

export type ProjectNavSection = {
  id: ProjectNavSectionId
  label: string
}

export type ProjectRelatedCard = {
  item: Project
  cover?: MediaAsset
}

export type ProjectDetailViewModel = {
  facts: ProjectDetailFact[]
  scopeItems: ProjectScopeItem[]
  deliveryPhases: ProjectDeliveryPhase[]
  executionProof: ProjectExecutionProof[]
  navSections: ProjectNavSection[]
  relatedProjects: Project[]
  hasMaterialStory: boolean
}
