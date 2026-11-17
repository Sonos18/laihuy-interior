import { describe, expect, it } from 'vitest'
import { localeFromPath, localizePath, stripLocalePrefix } from '../app/utils/locale-path'

describe('locale paths', () => {
  it('reads the locale from the /en prefix only', () => {
    expect(localeFromPath('/')).toBe('vi')
    expect(localeFromPath('/du-an')).toBe('vi')
    expect(localeFromPath('/en')).toBe('en')
    expect(localeFromPath('/en/du-an/nha-ta-dung')).toBe('en')
    expect(localeFromPath('/en?x=1')).toBe('en')
    // A Vietnamese slug that merely starts with "en" is not English.
    expect(localeFromPath('/enterprise')).toBe('vi')
  })

  it('strips the prefix and keeps query and hash', () => {
    expect(stripLocalePrefix('/en')).toBe('/')
    expect(stripLocalePrefix('/en#top')).toBe('/#top')
    expect(stripLocalePrefix('/en/lien-he#cach-gui-ho-so')).toBe('/lien-he#cach-gui-ho-so')
    expect(stripLocalePrefix('/du-an')).toBe('/du-an')
  })

  it('localizes site paths in both directions and is idempotent', () => {
    expect(localizePath('/', 'en')).toBe('/en')
    expect(localizePath('/du-an', 'en')).toBe('/en/du-an')
    expect(localizePath('/en/du-an', 'en')).toBe('/en/du-an')
    expect(localizePath('/lien-he#cach-gui-ho-so', 'en')).toBe('/en/lien-he#cach-gui-ho-so')
    expect(localizePath('/?ref=a', 'en')).toBe('/en?ref=a')
    expect(localizePath('/en/du-an?x=1', 'vi')).toBe('/du-an?x=1')
    expect(localizePath('/en', 'vi')).toBe('/')
  })

  it('leaves non-site links alone', () => {
    for (const href of ['#delivery-journey', 'mailto:a@b.c', 'tel:0900', 'https://zalo.me/1', '//cdn.example.com/x']) {
      expect(localizePath(href, 'en')).toBe(href)
    }
  })
})
