/**
 * The company mailbox, in a file of its own with no imports so that every data module (`company`,
 * `ui`, `factory`, `legal`) can quote it in running copy without pulling in the media catalog or
 * creating an import cycle. Change the address here and nowhere else.
 *
 * Owner (2026-11-15): the site moves from the old Gmail address to a mailbox on the company
 * domain. The mailbox must exist before this ships, or enquiries bounce.
 */
export const COMPANY_EMAIL = 'lienhe@noithatlaihuy.vn'
