/**
 * The /lien-he form has no transport: submitting it composes a mailto link and hands it to the
 * visitor's own mail client. This module is the pure half of that — copy in, href out — so the
 * format can be unit-tested without a browser and the page stays free of string assembly.
 */

/**
 * Mail clients and browsers truncate or reject long mailto URLs: Windows hands protocol URLs over
 * with a 2,083-character ceiling (INTERNET_MAX_URL_LENGTH). The budget is spent on the
 * percent-encoded URL, where every Vietnamese letter with a diacritic costs 6–9 characters, so the
 * fixed part of the body is kept to labels and the subject does not repeat the company.
 */
export const MAILTO_MAX_LENGTH = 2000

export type QuoteMailtoCopy = {
  /** Prefix of the subject line, e.g. "[Báo giá]". */
  subjectTag: string
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
  /** A bare label the visitor completes by attaching files in their mail client. */
  attachments: string
  /** Replaces a message too long for the URL; the page puts the message on the clipboard. */
  messageMoved: string
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
  /** The message did not fit, so the body carries `copy.messageMoved` in its place. */
  messageMoved: boolean
  /** Even without the message the URL is over budget (absurdly long name or company). */
  tooLong: boolean
}

const CRLF = '\r\n'

const compose = (to: string, copy: QuoteMailtoCopy, input: QuoteMailtoInput, details: string) => {
  const name = input.name.trim()
  const company = input.company.trim()

  const subject = `${copy.subjectTag} ${input.projectType} – ${name}`

  const body = [
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
    details,
    '',
    copy.attachments
  ].join(CRLF)

  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

/**
 * A message is never cut: one that does not fit the URL is replaced by `copy.messageMoved`, and
 * the caller is told so it can hand the full text over another way (the clipboard).
 */
export const buildQuoteMailto = (
  to: string,
  copy: QuoteMailtoCopy,
  input: QuoteMailtoInput
): QuoteMailto => {
  const full = compose(to, copy, input, input.message.trim().replace(/\r?\n/g, CRLF))
  if (full.length <= MAILTO_MAX_LENGTH) return { href: full, messageMoved: false, tooLong: false }

  const moved = compose(to, copy, input, copy.messageMoved)
  return { href: moved, messageMoved: true, tooLong: moved.length > MAILTO_MAX_LENGTH }
}
