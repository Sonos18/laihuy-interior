import { factoryPillars } from '../data/factory'
import type { Locale, LocalizedArray, LocalizedText } from '~/shared/types/localization'
import type {
  ProjectDeliveryPhase,
  ProjectDeliveryPhaseKey,
  ProjectDetailFact,
  ProjectDetailViewModel,
  ProjectExecutionProofId,
  ProjectNavSection,
  ProjectScopeItem,
  ProjectScopeKey
} from '~/shared/types/project-detail'
import type { Project } from '~/shared/types/project'

type Args = {
  project: Project
  projects: readonly Project[]
  imageCount: number
  locale: Locale
}

const textFor = (value: LocalizedText | undefined, locale: Locale) =>
  value?.[locale] ?? value?.vi ?? value?.en ?? ''

const listFor = (value: LocalizedArray | undefined, locale: Locale) =>
  value?.[locale] ?? value?.vi ?? value?.en ?? []

const scopeCatalog: Record<ProjectScopeKey, Omit<ProjectScopeItem, 'label'> & { label: LocalizedText }> = {
  'Thiết kế': {
    key: 'Thiết kế',
    icon: 'i-lucide-pencil-ruler',
    label: { vi: 'Thiết kế', en: 'Design' }
  },
  'Sản xuất': {
    key: 'Sản xuất',
    icon: 'i-lucide-factory',
    label: { vi: 'Sản xuất', en: 'Production' }
  },
  'Thi công': {
    key: 'Thi công',
    icon: 'i-lucide-hard-hat',
    label: { vi: 'Thi công', en: 'Installation' }
  }
}

const phaseCatalog: Record<ProjectDeliveryPhaseKey, Omit<ProjectDeliveryPhase, 'label'> & { label: LocalizedText }> = {
  consultation: {
    key: 'consultation',
    icon: 'i-lucide-messages-square',
    label: { vi: 'Tư vấn & khảo sát', en: 'Consultation' }
  },
  design: {
    key: 'design',
    icon: 'i-lucide-pencil-ruler',
    label: { vi: 'Thiết kế', en: 'Design' }
  },
  production: {
    key: 'production',
    icon: 'i-lucide-factory',
    label: { vi: 'Sản xuất tại xưởng', en: 'Production' }
  },
  installation: {
    key: 'installation',
    icon: 'i-lucide-hard-hat',
    label: { vi: 'Thi công lắp đặt', en: 'Installation' }
  },
  handover: {
    key: 'handover',
    icon: 'i-lucide-key-round',
    label: { vi: 'Bàn giao', en: 'Handover' }
  }
}

const isScopeKey = (value: string): value is ProjectScopeKey => value in scopeCatalog

const resolveScope = (project: Project, locale: Locale) =>
  (project.scope?.vi ?? [])
    .filter(isScopeKey)
    .map((key) => {
      const item = scopeCatalog[key]
      return { key: item.key, icon: item.icon, label: textFor(item.label, locale) }
    })

const resolveFacts = (project: Project, locale: Locale): ProjectDetailFact[] => {
  const candidates: Array<ProjectDetailFact | undefined> = [
    project.area
      ? { key: 'area', icon: 'i-lucide-ruler', label: locale === 'vi' ? 'Diện tích' : 'Floor area', value: textFor(project.area, locale) }
      : undefined,
    project.year
      ? { key: 'year', icon: 'i-lucide-calendar-check', label: locale === 'vi' ? 'Hoàn thành' : 'Completed', value: textFor(project.year, locale) }
      : undefined,
    project.style
      ? { key: 'style', icon: 'i-lucide-palette', label: locale === 'vi' ? 'Phong cách' : 'Style', value: textFor(project.style, locale) }
      : undefined,
    listFor(project.scope, locale).length
      ? { key: 'scope', icon: 'i-lucide-list-checks', label: locale === 'vi' ? 'Phạm vi' : 'Scope', value: listFor(project.scope, locale).join(' · ') }
      : undefined,
    project.location
      ? { key: 'location', icon: 'i-lucide-map-pin', label: locale === 'vi' ? 'Địa điểm' : 'Location', value: textFor(project.location, locale) }
      : undefined
  ]

  return candidates.filter((fact): fact is ProjectDetailFact => Boolean(fact)).slice(0, 5)
}

const resolvePhases = (scopeItems: readonly ProjectScopeItem[], locale: Locale) => {
  const keys: ProjectDeliveryPhaseKey[] = ['consultation']
  if (scopeItems.some(item => item.key === 'Thiết kế')) keys.push('design')
  if (scopeItems.some(item => item.key === 'Sản xuất')) keys.push('production')
  if (scopeItems.some(item => item.key === 'Thi công')) keys.push('installation')
  keys.push('handover')

  return keys.map((key) => {
    const phase = phaseCatalog[key]
    return { key: phase.key, icon: phase.icon, label: textFor(phase.label, locale) }
  })
}

const resolveExecutionProof = (scopeItems: readonly ProjectScopeItem[], locale: Locale) => {
  const ids: ProjectExecutionProofId[] = []
  if (scopeItems.some(item => item.key === 'Sản xuất')) ids.push('direct-factory', 'quality')
  if (scopeItems.some(item => item.key === 'Thi công')) ids.push('craft')

  return ids.map((id) => {
    const pillar = factoryPillars.find(item => item.id === id)
    if (!pillar) throw new Error(`Missing factory proof: ${id}`)
    return {
      id,
      icon: pillar.icon,
      title: textFor(pillar.title, locale),
      description: textFor(pillar.description, locale)
    }
  })
}

const resolveRelatedProjects = (project: Project, projects: readonly Project[]) => {
  const scope = new Set(project.scope?.vi ?? [])
  return projects
    .filter(item => item.slug !== project.slug)
    .map((item) => {
      let score = 0
      if (item.category === project.category) score += 100
      if (item.style?.vi && item.style.vi === project.style?.vi) score += 30
      score += (item.scope?.vi ?? []).filter(key => scope.has(key)).length * 10
      score += (Number(item.year?.vi) || 0) * 0.01
      return { item, score }
    })
    .sort((first, second) => second.score - first.score)
    .slice(0, 3)
    .map(({ item }) => item)
}

export const buildProjectDetailViewModel = ({ project, projects, imageCount, locale }: Args): ProjectDetailViewModel => {
  const scopeItems = resolveScope(project, locale)
  const content = project.content
  const hasStory = Boolean(content?.overview || content?.challenge || content?.solution)
  const hasMaterialStory = Boolean(
    content?.experience
    || content?.designHighlights?.vi.length
    || content?.materials?.vi.length
    || content?.craftsmanship
    || project.testimonial
  )

  const navSections: ProjectNavSection[] = []
  if (hasStory) navSections.push({ id: 'story', label: locale === 'vi' ? 'Câu chuyện' : 'Story' })
  if (imageCount > 0) navSections.push({ id: 'gallery', label: locale === 'vi' ? 'Hình ảnh' : 'Gallery' })
  if (scopeItems.length) navSections.push({ id: 'delivery', label: locale === 'vi' ? 'Triển khai' : 'Delivery' })
  if (hasMaterialStory) navSections.push({ id: 'materials', label: locale === 'vi' ? 'Vật liệu' : 'Materials' })

  return {
    facts: resolveFacts(project, locale),
    scopeItems,
    deliveryPhases: resolvePhases(scopeItems, locale),
    executionProof: resolveExecutionProof(scopeItems, locale),
    navSections,
    relatedProjects: resolveRelatedProjects(project, projects),
    hasMaterialStory
  }
}
