import { describe, expect, it } from 'vitest'
import { validateLead } from '../app/shared/lead/validate'
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
