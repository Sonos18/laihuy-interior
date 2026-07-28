import { describe, expect, it } from 'vitest'
import { validateLead } from '../app/shared/lead/validate'
import { buildMailtoUrl } from '../app/shared/lead/mailto'
import type { LeadDraft } from '../app/shared/lead/types'

const valid: LeadDraft = {
  name: 'Nguyen Van A',
  phone: '+84 903 102 012',
  email: 'a@example.com',
  projectType: 'Thi công nội thất khách sạn',
  message: 'Khách sạn 40 phòng tại Vĩnh Long, cần báo giá nội thất phòng ngủ.'
}

describe('validateLead', () => {
  it('accepts a complete draft', () => {
    expect(validateLead(valid)).toEqual({})
  })

  it('flags every empty field as required', () => {
    const empty: LeadDraft = { name: '', phone: '', email: '', projectType: '', message: '' }

    expect(validateLead(empty)).toEqual({
      name: 'required',
      phone: 'required',
      email: 'required',
      projectType: 'required',
      message: 'required'
    })
  })

  it('treats whitespace-only input as empty', () => {
    expect(validateLead({ ...valid, name: '   ' }).name).toBe('required')
  })

  it('rejects a malformed email', () => {
    expect(validateLead({ ...valid, email: 'a@example' }).email).toBe('emailFormat')
    expect(validateLead({ ...valid, email: 'a.example.com' }).email).toBe('emailFormat')
    expect(validateLead({ ...valid, email: 'a b@example.com' }).email).toBe('emailFormat')
  })

  it('accepts a phone written with spaces, dashes or parentheses', () => {
    expect(validateLead({ ...valid, phone: '(028) 3822-1234' }).phone).toBeUndefined()
    expect(validateLead({ ...valid, phone: '0903102012' }).phone).toBeUndefined()
  })

  it('rejects a phone with fewer than 8 digits', () => {
    expect(validateLead({ ...valid, phone: '090 310' }).phone).toBe('phoneFormat')
  })

  it('rejects a message shorter than 10 characters', () => {
    expect(validateLead({ ...valid, message: 'Bao gia' }).message).toBe('tooShort')
  })

  it('reports errors for several fields at once', () => {
    expect(validateLead({ ...valid, email: 'nope', message: '' })).toEqual({
      email: 'emailFormat',
      message: 'required'
    })
  })
})

describe('buildMailtoUrl', () => {
  it('addresses the mail to the given recipient', () => {
    const url = buildMailtoUrl(valid, 'vi', 'noithatlaihuy@gmail.com')

    expect(url.startsWith('mailto:noithatlaihuy@gmail.com?')).toBe(true)
  })

  it('puts the project type in the Vietnamese subject', () => {
    const url = buildMailtoUrl(valid, 'vi', 'to@example.com')
    // `searchParams.get` decodes for us — decoding a second time throws on a literal `%`.
    const subject = new URL(url).searchParams.get('subject') ?? ''

    expect(subject).toBe('Yêu cầu tư vấn dự án - Thi công nội thất khách sạn')
  })

  it('switches the subject to English for the en locale', () => {
    const url = buildMailtoUrl(valid, 'en', 'to@example.com')
    // `searchParams.get` decodes for us — decoding a second time throws on a literal `%`.
    const subject = new URL(url).searchParams.get('subject') ?? ''

    expect(subject).toBe('Project consultation request - Thi công nội thất khách sạn')
  })

  it('falls back to the company name when no project type is chosen', () => {
    const url = buildMailtoUrl({ ...valid, projectType: '' }, 'vi', 'to@example.com')
    // `searchParams.get` decodes for us — decoding a second time throws on a literal `%`.
    const subject = new URL(url).searchParams.get('subject') ?? ''

    expect(subject).toBe('Yêu cầu tư vấn dự án - Lai Huy Interior')
  })

  it('lists every field in the body', () => {
    const url = buildMailtoUrl(valid, 'vi', 'to@example.com')
    const body = new URL(url).searchParams.get('body') ?? ''

    expect(body).toContain('Họ tên: Nguyen Van A')
    expect(body).toContain('Email: a@example.com')
    expect(body).toContain('Điện thoại: +84 903 102 012')
    expect(body).toContain('Loại dự án: Thi công nội thất khách sạn')
    expect(body).toContain(valid.message)
  })

  it('percent-encodes characters that would break the URL', () => {
    const url = buildMailtoUrl({ ...valid, message: 'Giá & tiến độ? 100%' }, 'vi', 'to@example.com')

    // `&` and `%` are the two characters that would truncate or corrupt the query string.
    expect(url).toContain('%26')
    expect(url).toContain('100%25')
    expect(url).not.toContain('Giá & tiến độ? 100%')
    expect(new URL(url).searchParams.get('body')).toContain('Giá & tiến độ? 100%')
  })
})
