import { describe, expect, it } from 'vitest'
import {
  MAILTO_MAX_LENGTH,
  buildQuoteMailto,
  type QuoteMailtoCopy,
  type QuoteMailtoInput
} from '../app/utils/contact-mailto'
import { uiText } from '../app/data/ui'

const copy: QuoteMailtoCopy = {
  subjectTag: '[Báo giá]',
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
  attachments: 'Hồ sơ đính kèm:',
  messageMoved: '[Dán nội dung vào đây]'
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

  it('keeps the company in the body, not the subject, to save URL budget', () => {
    const { href } = buildQuoteMailto('noithatlaihuy@gmail.com', copy, { ...input, company: 'Công ty ABC' })
    expect(parse(href).subject).toBe('[Báo giá] Khách sạn & resort – Nguyễn Văn A')
    expect(parse(href).body).toContain('Công ty / đơn vị: Công ty ABC')
  })

  it('writes every field into the body with CRLF line breaks and the dash for an empty company', () => {
    const { href } = buildQuoteMailto('noithatlaihuy@gmail.com', copy, input)
    expect(href).toContain('%0D%0A')
    expect(parse(href).body).toBe([
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
      'Hồ sơ đính kèm:'
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

  it('moves an over-long message out of the URL instead of truncating it', () => {
    const short = buildQuoteMailto('noithatlaihuy@gmail.com', copy, input)
    expect(short).toMatchObject({ messageMoved: false, tooLong: false })
    expect(short.href.length).toBeLessThanOrEqual(MAILTO_MAX_LENGTH)

    const long = buildQuoteMailto('noithatlaihuy@gmail.com', copy, { ...input, message: 'Phòng ngủ. '.repeat(200) })
    expect(long).toMatchObject({ messageMoved: true, tooLong: false })
    expect(long.href.length).toBeLessThanOrEqual(MAILTO_MAX_LENGTH)
    const body = parse(long.href).body
    expect(body).toContain('[Dán nội dung vào đây]')
    expect(body).not.toContain('Phòng ngủ')
  })

  it('reports tooLong only when even the fields alone overflow the URL', () => {
    const result = buildQuoteMailto('noithatlaihuy@gmail.com', copy, { ...input, company: 'Công ty '.repeat(200) })
    expect(result.tooLong).toBe(true)
  })
})

// The site's own copy, in both locales: a fixed overhead that eats the budget is exactly the
// failure the shortened fixture above cannot see (Vietnamese diacritics encode to 6–9 chars each).
describe('buildQuoteMailto with the site copy', () => {
  const siteCopy = (locale: 'vi' | 'en'): QuoteMailtoCopy => {
    const m = uiText.contactForm.mailto
    return {
      subjectTag: m.subjectTag[locale],
      intro: m.intro[locale],
      labels: {
        name: m.labels.name[locale],
        company: m.labels.company[locale],
        phone: m.labels.phone[locale],
        email: m.labels.email[locale],
        projectType: m.labels.projectType[locale],
        scope: m.labels.scope[locale],
        details: m.labels.details[locale]
      },
      emptyValue: '—',
      attachments: m.attachments[locale],
      messageMoved: m.messageMoved[locale]
    }
  }

  const typical = {
    name: 'Nguyễn Thị Phương Thảo',
    company: 'Công ty Kiến trúc Đông Dương',
    phone: '0912 345 678',
    email: 'thao@dongduong.vn',
    projectType: 'Nội thất khách sạn & resort',
    scope: 'Sản xuất tại xưởng'
  }

  it('fits an ordinary Vietnamese project description without moving it', () => {
    const message = 'Khách sạn 40 phòng tại Đà Nẵng, diện tích khoảng 2.000 m². Cần sản xuất và lắp đặt tủ đầu giường, tủ áo, bàn làm việc, quầy lễ tân. Vật liệu: MDF chống ẩm phủ Melamine. Cần bàn giao trước tháng 6/2027. Có bản vẽ và BOQ, sẽ gửi kèm qua email.'
    const result = buildQuoteMailto('noithatlaihuy@gmail.com', siteCopy('vi'), { ...typical, message })
    expect(result).toMatchObject({ messageMoved: false, tooLong: false })
    expect(parse(result.href).body).toContain(message)
  })

  it('fits a long English description without moving it', () => {
    const message = 'A 40-room hotel in Da Nang, about 2,000 m². '.repeat(12)
    const result = buildQuoteMailto('noithatlaihuy@gmail.com', siteCopy('en'), { ...typical, message })
    expect(result).toMatchObject({ messageMoved: false, tooLong: false })
  })

  it.each(['vi', 'en'] as const)('hands a very long %s description to the clipboard path, never truncated', (locale) => {
    const result = buildQuoteMailto('noithatlaihuy@gmail.com', siteCopy(locale), { ...typical, message: 'Phòng ngủ tiêu chuẩn. '.repeat(120) })
    expect(result).toMatchObject({ messageMoved: true, tooLong: false })
    expect(parse(result.href).body).toContain(uiText.contactForm.mailto.messageMoved[locale])
  })
})
