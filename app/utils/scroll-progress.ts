export function calculateScrollProgress(scrollY: number, elementTop: number, range: number) {
  if (range <= 0) return 1
  return Math.min(1, Math.max(0, (scrollY - elementTop) / range))
}
