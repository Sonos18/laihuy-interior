import { describe, expect, it } from 'vitest'
import {
  factoryCapabilities,
  machineryProcessGroups,
  machinerySectionContent,
  productionWorkflow
} from '../app/data/factory'

const EXPECTED_IDS = [
  'cutting-shaping',
  'boring-connections',
  'edge-finishing',
  'surface-pressing'
] as const

const EXPECTED_MACHINES = {
  vi: [
    'CNC Nesting',
    'Cưa bàn trượt',
    'Máy khoan liên kết CNC',
    'Máy dán cạnh tự động',
    'Máy bào cuốn',
    'Máy chà nhám thùng',
    'Máy ép nguội thủy lực'
  ],
  en: [
    'CNC nesting router',
    'Sliding table saw',
    'CNC boring machine',
    'Automatic edge bander',
    'Thickness planer',
    'Wide-belt sander',
    'Hydraulic cold press'
  ]
} as const

// The machinery groups and machine lists are rendered by /nha-xuong. The home page no longer
// shows them: each of its three factory pillars is one fact plus one supporting line.
describe('factory machinery content', () => {
  it('defines the approved four production stages in order', () => {
    expect(machineryProcessGroups.map(group => group.id)).toEqual(EXPECTED_IDS)
    expect(machineryProcessGroups).toHaveLength(4)
  })

  it.each(['vi', 'en'] as const)('represents every machine exactly once in %s', (locale) => {
    const machineNames = machineryProcessGroups.flatMap(group =>
      group.machines.map(machine => machine[locale])
    )

    expect(machineNames).toEqual(EXPECTED_MACHINES[locale])
    expect(new Set(machineNames).size).toBe(7)
  })

  it.each(['vi', 'en'] as const)('provides the strings behind the three home pillars in %s', (locale) => {
    const pillarSources = [
      productionWorkflow[1]?.title,
      productionWorkflow[1]?.description,
      machinerySectionContent.titleLead,
      machinerySectionContent.titleAccent,
      machinerySectionContent.description,
      factoryCapabilities[2]?.label,
      factoryCapabilities[2]?.description
    ]

    expect(pillarSources).toHaveLength(7)
    for (const source of pillarSources) {
      expect(source?.[locale]).toBeTruthy()
    }
  })

  it.each(['vi', 'en'] as const)('provides complete intro and caption copy in %s', (locale) => {
    expect(machinerySectionContent.titleLead[locale]).not.toBe('')
    expect(machinerySectionContent.titleAccent[locale]).not.toBe('')
    expect(machinerySectionContent.description[locale]).not.toBe('')
    expect(machinerySectionContent.photoCaption[locale]).not.toBe('')
    expect(machinerySectionContent.lineCaption[locale]).not.toBe('')

    for (const group of machineryProcessGroups) {
      expect(group.title[locale]).not.toBe('')
      expect(group.benefit[locale]).not.toBe('')
      expect(group.machines.length).toBeGreaterThan(0)
    }
  })
})
