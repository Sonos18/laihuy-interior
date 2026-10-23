/**
 * The /lien-he form has no transport: submitting it composes a mailto link and hands it to the
 * visitor's own mail client. This module is the pure half of that — copy in, href out — so the
 * format can be unit-tested without a browser and the page stays free of string assembly.
 */

/**
 * Mail clients and browsers truncate or reject long mailto URLs (the practical ceiling is a little
 * over 2,000 characters). An over-long message is reported to the visitor, never silently cut:
 * a quote request that loses its tail is worse than one that is not sent.
 */
export const MAILTO_MAX_LENGTH = 1800

export type QuoteMailtoCopy = {
  /** Prefix of the subject line, e.g. "[Báo giá]". */
  subjectTag: string
  greeting: string
  intro: string
  labels: {
    name: string
    company: string
    phone: string
    email: string
    projectType: string
    scope: string
    details: string
  }
  /** Stands in for an empty optional field so the body keeps a stable shape. */
  emptyValue: string
  attachments: string
  footer: string
}

export type QuoteMailtoInput = {
  name: string
  company: string
  phone: string
  email: string
  projectType: string
  scope: string
  message: string
}

export type QuoteMailto = {
  href: string
  tooLong: boolean
}

const CRLF = '\r\n'

export const buildQuoteMailto = (
  to: string,
  copy: QuoteMailtoCopy,
  input: QuoteMailtoInput
): QuoteMailto => {
  const name = input.name.trim()
  const company = input.company.trim()

  const subject = `${copy.subjectTag} ${input.projectType} – ${name}${company ? ` / ${company}` : ''}`

  const body = [
    copy.greeting,
    '',
    copy.intro,
    '',
    `${copy.labels.name}: ${name}`,
    `${copy.labels.company}: ${company || copy.emptyValue}`,
    `${copy.labels.phone}: ${input.phone.trim()}`,
    `${copy.labels.email}: ${input.email.trim()}`,
    `${copy.labels.projectType}: ${input.projectType}`,
    `${copy.labels.scope}: ${input.scope}`,
    '',
    `${copy.labels.details}:`,
    input.message.trim().replace(/\r?\n/g, CRLF),
    '',
    copy.attachments,
    '',
    copy.footer
  ].join(CRLF)

  const href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

  return { href, tooLong: href.length > MAILTO_MAX_LENGTH }
}
