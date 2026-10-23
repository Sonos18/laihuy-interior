import { describe, expect, it } from 'vitest'
import { projects } from '../app/data/projects'
import {
  buildProjectMediaFlow,
  galleryHeadline,
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

describe('gallery counts', () => {
  it('counts the highlights on the first chip and the whole set on the "view all" button', () => {
    for (const project of projects) {
      const flow = buildProjectMediaFlow(
        projectImages(project.mediaId, project.name, project.galleryLabels),
        projectGalleryGroups(project.mediaId, project.name, project.galleryLabels)
      )
      const headline = galleryHeadline(flow)

      // The chip agrees with the carousel it filters ("1 / n") ...
      expect(headline.count, project.slug).toBe(flow.inline.length)
      expect(headline.kind, project.slug).toBe(flow.isLongMedia ? 'highlights' : 'all')
      // ... and the button opens the lightbox over every eligible image, so "n" there is the total.
      expect(flow.eligible.length, project.slug).toBe(flow.inline.length + flow.remaining.length)
    }
  })

  it('shows Eo Gió as 9 highlights with the 30 images behind the button', () => {
    const eoGio = projects.find(project => project.slug === 'khach-san-eo-gio')!
    const flow = buildProjectMediaFlow(
      projectImages(eoGio.mediaId, eoGio.name, eoGio.galleryLabels),
      projectGalleryGroups(eoGio.mediaId, eoGio.name, eoGio.galleryLabels)
    )

    expect(galleryHeadline(flow)).toEqual({ kind: 'highlights', count: 9 })
    expect(flow.eligible).toHaveLength(30)
  })
})

describe('project image alt', () => {
  const eoGio = projects.find(project => project.slug === 'khach-san-eo-gio')!
  const codiVilla = projects.find(project => project.slug === 'codi-villa-phan-thiet')!

  it('names an image in a labelled room "{project}: {room}", in both locales', () => {
    const groups = projectGalleryGroups(eoGio.mediaId, eoGio.name, eoGio.galleryLabels)
    const lobby = groups.find(group => group.slug === 'sanh-don')!

    expect(lobby.images.length).toBeGreaterThan(0)
    for (const item of lobby.images) {
      expect(item.alt).toEqual({ vi: 'Khách sạn Eo Gió: Sảnh đón', en: 'Eo Gio Hotel: Lobby' })
    }
    const single = groups.find(group => group.slug === 'phong-don-dien-hinh')!
    expect(single.images[0]!.alt).toEqual({
      vi: 'Khách sạn Eo Gió: Phòng đơn điển hình',
      en: 'Eo Gio Hotel: Typical single room'
    })
  })

  it('gives the flat list the same room alt as the group, so the carousel and lightbox agree', () => {
    const flat = projectImages(eoGio.mediaId, eoGio.name, eoGio.galleryLabels)
    const groups = projectGalleryGroups(eoGio.mediaId, eoGio.name, eoGio.galleryLabels)

    for (const group of groups) {
      for (const item of group.images) {
        expect(flat.find(candidate => candidate.path === item.path)?.alt, item.path).toEqual(item.alt)
      }
    }
  })

  it('numbers the images of an ungrouped project "{project}: hình {i}/{n}" / "image {i}/{n}"', () => {
    const flat = projectImages(codiVilla.mediaId, codiVilla.name, codiVilla.galleryLabels)

    expect(projectGalleryGroups(codiVilla.mediaId, codiVilla.name, codiVilla.galleryLabels)).toEqual([])
    expect(flat).toHaveLength(16)
    expect(flat[0]!.alt).toEqual({ vi: 'Codi Villa Phan Thiết: hình 1/16', en: 'Codi Villa, Phan Thiet: image 1/16' })
    expect(flat[15]!.alt).toEqual({ vi: 'Codi Villa Phan Thiết: hình 16/16', en: 'Codi Villa, Phan Thiet: image 16/16' })
  })

  it('never repeats the bare project name as the alt of every image', () => {
    for (const project of projects) {
      const alts = projectImages(project.mediaId, project.name, project.galleryLabels)
        .map(item => (item.alt === '' ? '' : item.alt.vi))

      expect(new Set(alts).size > 1 || alts.length === 1, project.slug).toBe(true)
      expect(alts.every(alt => alt.startsWith(`${project.name.vi}: `)), project.slug).toBe(true)
    }
  })

  it('numbers an image whose room has no label instead of leaving the project name alone', () => {
    const flat = projectImages(eoGio.mediaId, eoGio.name, {})

    expect(flat[0]!.alt).toEqual({ vi: 'Khách sạn Eo Gió: hình 1/30', en: 'Eo Gio Hotel: image 1/30' })
  })
})
