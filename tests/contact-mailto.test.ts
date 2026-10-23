import { describe, expect, it } from 'vitest'
import {
  MAILTO_MAX_LENGTH,
  buildQuoteMailto,
  type QuoteMailtoCopy,
  type QuoteMailtoInput
} from '../app/utils/contact-mailto'

const copy: QuoteMailtoCopy = {
  subjectTag: '[Báo giá]',
  greeting: 'Kính gửi Lai Huy Interior,',
  intro: 'Tôi cần báo giá cho dự án sau.',
  labels: {
    name: 'Họ tên',
    company: 'Công ty / đơn vị',
    phone: 'Điện thoại',
    email: 'Email',
    projectType: 'Loại dự án',
    scope: 'Phạm vi cần báo giá',
    details: 'Thông tin dự án'
  },
  emptyValue: '—',
  attachments: 'Hồ sơ đính kèm: [đính kèm bản vẽ]',
  footer: '(Email soạn từ trang Liên hệ)'
}

const input: QuoteMailtoInput = {
  name: 'Nguyễn Văn A',
  company: '',
  phone: '0912 345 678',
  email: 'a@congty.com',
  projectType: 'Khách sạn & resort',
  scope: 'Chưa xác định',
  message: 'Khách sạn 40 phòng tại Đà Nẵng.\nCó bản vẽ.'
}

const parse = (href: string) => {
  const url = new URL(href)
  return {
    to: decodeURIComponent(url.pathname),
    subject: url.searchParams.get('subject') ?? '',
    body: url.searchParams.get('body') ?? ''
  }
}

describe('buildQuoteMailto', () => {
  it('addresses the company mailbox with the form subject', () => {
    const { href } = buildQuoteMailto('noithatlaihuy@gmail.com', copy, input)
    expect(href.startsWith('mailto:noithatlaihuy@gmail.com?subject=')).toBe(true)
    expect(parse(href).subject).toBe('[Báo giá] Khách sạn & resort – Nguyễn Văn A')
  })

  it('appends the company to the subject only when it is given', () => {
    const { href } = buildQuoteMailto('noithatlaihuy@gmail.com', copy, { ...input, company: 'Công ty ABC' })
    expect(parse(href).subject).toBe('[Báo giá] Khách sạn & resort – Nguyễn Văn A / Công ty ABC')
  })

  it('writes every field into the body with CRLF line breaks and the dash for an empty company', () => {
    const { href } = buildQuoteMailto('noithatlaihuy@gmail.com', copy, input)
    expect(href).toContain('%0D%0A')
    expect(parse(href).body).toBe([
      'Kính gửi Lai Huy Interior,',
      '',
      'Tôi cần báo giá cho dự án sau.',
      '',
      'Họ tên: Nguyễn Văn A',
      'Công ty / đơn vị: —',
      'Điện thoại: 0912 345 678',
      'Email: a@congty.com',
      'Loại dự án: Khách sạn & resort',
      'Phạm vi cần báo giá: Chưa xác định',
      '',
      'Thông tin dự án:',
      'Khách sạn 40 phòng tại Đà Nẵng.',
      'Có bản vẽ.',
      '',
      'Hồ sơ đính kèm: [đính kèm bản vẽ]',
      '',
      '(Email soạn từ trang Liên hệ)'
    ].join('\r\n'))
  })

  it('percent-encodes reserved characters instead of leaking them into the query', () => {
    const { href } = buildQuoteMailto('noithatlaihuy@gmail.com', copy, {
      ...input,
      message: 'Tầng 1 & 2 = sảnh? #A+B'
    })
    const query = href.slice(href.indexOf('?') + 1)
    expect(query.split('&')).toHaveLength(2)
    expect(parse(href).body).toContain('Tầng 1 & 2 = sảnh? #A+B')
  })

  it('reports an over-long message instead of truncating it', () => {
    const short = buildQuoteMailto('noithatlaihuy@gmail.com', copy, input)
    expect(short.tooLong).toBe(false)
    expect(short.href.length).toBeLessThanOrEqual(MAILTO_MAX_LENGTH)

    const long = buildQuoteMailto('noithatlaihuy@gmail.com', copy, { ...input, message: 'Phòng ngủ. '.repeat(200) })
    expect(long.tooLong).toBe(true)
    expect(parse(long.href).body).toContain('Phòng ngủ. '.repeat(200).trimEnd())
  })
})
