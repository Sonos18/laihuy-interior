import { describe, expect, it } from 'vitest'
import { projects } from '../app/data/projects'
import {
  buildProjectMediaFlow,
  projectGalleryGroups,
  projectImages,
  type ProjectGalleryGroup
} from '../app/media/project-media'
import type { MediaImage } from '../app/shared/media/types'

const image = (path: string): MediaImage => ({
  path,
  width: 1600,
  height: 1200,
  alt: ''
})

const images = (count: number): MediaImage[] =>
  Array.from({ length: count }, (_, index) => image(`projects/fixture/${index + 1}.webp`))

describe('buildProjectMediaFlow', () => {
  it('keeps exactly 12 eligible images in the existing short-media flow', () => {
    const source = images(12)
    const flow = buildProjectMediaFlow(source)

    expect(flow.isLongMedia).toBe(false)
    expect(flow.eligible).toEqual(source)
    expect(flow.inline).toEqual(source)
    expect(flow.remaining).toEqual([])
  })

  it('uses the long-media flow at 13 eligible images with a default inline count of 9', () => {
    const source = images(13)
    const flow = buildProjectMediaFlow(source)

    expect(flow.isLongMedia).toBe(true)
    expect(flow.eligible).toHaveLength(13)
    expect(flow.inline).toHaveLength(9)
    expect(flow.remaining).toHaveLength(4)
    expect(new Set([...flow.inline, ...flow.remaining].map(item => item.path)).size).toBe(13)
  })

  it('removes exact path duplicates in stable order without treating distinct paths as duplicates', () => {
    const first = image('projects/fixture/room.webp')
    const exactDuplicate = { ...first, width: 800 }
    const distinctCrop = image('projects/fixture/room-crop.webp')
    const source = [first, exactDuplicate, distinctCrop, first]

    const flow = buildProjectMediaFlow(source)

    expect(flow.eligible).toEqual([first, distinctCrop])
    expect(source).toHaveLength(4)
  })

  it('represents each meaningful gallery group while preserving stable source order', () => {
    const source = images(15)
    const groups: ProjectGalleryGroup[] = [
      { slug: 'early', images: [source[1]!, source[2]!] },
      { slug: 'middle', images: [source[9]!, source[10]!] },
      { slug: 'late', images: [source[13]!, source[14]!] }
    ]

    const flow = buildProjectMediaFlow(source, groups)
    const inlinePaths = flow.inline.map(item => item.path)

    expect(inlinePaths).toHaveLength(9)
    expect(inlinePaths).toContain(source[0]!.path)
    expect(inlinePaths).toContain(source[1]!.path)
    expect(inlinePaths).toContain(source[9]!.path)
    expect(inlinePaths).toContain(source[13]!.path)
    expect(inlinePaths).toEqual(
      [...inlinePaths].sort((left, right) =>
        source.findIndex(item => item.path === left) - source.findIndex(item => item.path === right))
    )
  })

  it('protects a real short project and curates the real long project', () => {
    const shortProject = projects.find(project => project.slug === 'nha-xuong-anh-cuong')!
    const longProject = projects.find(project => project.slug === 'khach-san-eo-gio')!

    const shortImages = projectImages(shortProject.mediaId, shortProject.name)
    const shortFlow = buildProjectMediaFlow(
      shortImages,
      projectGalleryGroups(shortProject.mediaId, shortProject.name)
    )
    const longImages = projectImages(longProject.mediaId, longProject.name)
    const longGroups = projectGalleryGroups(longProject.mediaId, longProject.name)
    const longFlow = buildProjectMediaFlow(longImages, longGroups)

    expect(shortFlow).toMatchObject({ isLongMedia: false, eligible: shortImages, inline: shortImages, remaining: [] })
    expect(longFlow.isLongMedia).toBe(true)
    expect(longFlow.eligible).toHaveLength(30)
    expect(longFlow.inline).toHaveLength(9)
    expect(longFlow.remaining).toHaveLength(21)
    for (const group of longGroups) {
      expect(longFlow.inline.some(item => group.images.some(groupImage => groupImage.path === item.path))).toBe(true)
    }
  })

  it('classifies every current project from its eligible catalog media', () => {
    const expectedCounts = new Map([
      ['khach-san-eo-gio', 30],
      ['codi-boutique-hotel', 20],
      ['codi-villa-phan-thiet', 16],
      ['nha-vuon-chily', 26],
      ['cai-tao-nha-quan-8', 5],
      ['nha-anh-nam', 9],
      ['nha-ta-dung', 7],
      ['phong-giam-doc', 10],
      ['phong-hop-quan-7', 10],
      ['van-phong-quan-4', 9],
      ['nha-xuong-anh-cuong', 3]
    ])

    for (const project of projects) {
      const flow = buildProjectMediaFlow(
        projectImages(project.mediaId, project.name),
        projectGalleryGroups(project.mediaId, project.name)
      )
      const expected = expectedCounts.get(project.slug)

      expect(flow.eligible, project.slug).toHaveLength(expected!)
      expect(flow.isLongMedia, project.slug).toBe(expected! > 12)
      expect(flow.inline, project.slug).toHaveLength(expected! > 12 ? 9 : expected!)
      expect(flow.remaining, project.slug).toHaveLength(expected! > 12 ? expected! - 9 : 0)
    }
  })
})
