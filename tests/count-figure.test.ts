import { describe, expect, it } from 'vitest'
import { formatCountFigure, parseCountFigure } from '../app/utils/count-figure'

describe('count figure', () => {
  it('counts a grouped figure and keeps its grouping', () => {
    const vi = parseCountFigure('3.000 m²')!
    expect(formatCountFigure(vi, 0)).toBe('0 m²')
    expect(formatCountFigure(vi, 0.5)).toBe('1.500 m²')
    expect(formatCountFigure(vi, 1)).toBe('3.000 m²')
    expect(formatCountFigure(parseCountFigure('3,000 m²')!, 1)).toBe('3,000 m²')
  })

  it('counts a range with its upper end keeping its distance', () => {
    const range = parseCountFigure('44–45 phòng')!
    expect(formatCountFigure(range, 0)).toBe('0–1 phòng')
    expect(formatCountFigure(range, 0.4)).toBe('18–19 phòng')
    expect(formatCountFigure(parseCountFigure('20–25 rooms')!, 0.5)).toBe('10–15 rooms')
    expect(formatCountFigure(range, 1)).toBe('44–45 phòng')
  })

  it('counts every number that is not a range on its own', () => {
    expect(formatCountFigure(parseCountFigure('120 m² × 4 căn')!, 0.5)).toBe('60 m² × 2 căn')
  })

  it('keeps the words around a number', () => {
    expect(formatCountFigure(parseCountFigure('Đến 50')!, 0.5)).toBe('Đến 25')
    expect(formatCountFigure(parseCountFigure('120 m² × 4 căn')!, 1)).toBe('120 m² × 4 căn')
  })

  it('leaves phrases and years alone', () => {
    expect(parseCountFigure('Trọn gói')).toBeNull()
    expect(parseCountFigure('2026')).toBeNull()
    expect(parseCountFigure('Thiết kế · Sản xuất · Thi công')).toBeNull()
  })

  it('clamps progress', () => {
    const figure = parseCountFigure('50')!
    expect(formatCountFigure(figure, -1)).toBe('0')
    expect(formatCountFigure(figure, 2)).toBe('50')
  })
})
