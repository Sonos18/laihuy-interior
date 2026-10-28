// The count-up of a figure (DESIGN.md "Motion", Count): every number in a value counts from 0
// to itself, so "1.670 m²" passes through "835 m²".
// Thousands keep the copy's grouping ("3.000" in vi, "3,000" in en). A bare four-digit year
// ("2026") is a date, not a quantity, and never counts. The upper end of a range ("44–45") keeps its
// distance from the lower one while it counts, so the range never reads "17–17" or "0–0".

type Token = { start: number, end: number, target: number, separator: string, rangeFrom?: number }

const RANGE_DASH = /^\s*[–-]\s*$/

export type CountFigure = { text: string, tokens: Token[] }

const NUMBER = /\d[\d.,]*\d|\d/g
const YEAR = /^(19|20)\d{2}$/

/** The numbers in `text` that count; null when there are none (a phrase, a year). */
export function parseCountFigure(text: string): CountFigure | null {
  const tokens: Token[] = []

  for (const match of text.matchAll(NUMBER)) {
    const digits = match[0]

    if (YEAR.test(digits) || match.index === undefined) {
      continue
    }

    const previous = tokens[tokens.length - 1]
    const inRange = previous !== undefined && RANGE_DASH.test(text.slice(previous.end, match.index))

    tokens.push({
      ...(inRange ? { rangeFrom: tokens.length - 1 } : {}),
      start: match.index,
      end: match.index + digits.length,
      target: Number(digits.replace(/[.,]/g, '')),
      separator: digits.match(/[.,]/)?.[0] ?? ''
    })
  }

  return tokens.length > 0 ? { text, tokens } : null
}

/** `figure` with each of its numbers at `progress` (0 to 1) of the way to its value. */
export function formatCountFigure(figure: CountFigure, progress: number): string {
  const p = Math.min(1, Math.max(0, progress))
  const values: number[] = []
  let out = ''
  let cursor = 0

  for (const token of figure.tokens) {
    const low = token.rangeFrom === undefined ? undefined : figure.tokens[token.rangeFrom]
    const value = low && token.rangeFrom !== undefined
      ? values[token.rangeFrom]! + (token.target - low.target)
      : Math.round(token.target * p)
    values.push(value)
    const n = String(value)
    const grouped = token.separator ? n.replace(/\B(?=(\d{3})+(?!\d))/g, token.separator) : n
    out += figure.text.slice(cursor, token.start) + grouped
    cursor = token.end
  }

  return out + figure.text.slice(cursor)
}
