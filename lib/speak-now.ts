// דברו בשטף וביטחון on the site (/speak-now, 2026-11-16).
// Shared by the signup form, the checkout and the completion route so the
// prices can never drift apart between what the buyer sees and what is charged.

export const SN_SLUG = 'speak-now'
export const SN_NAME = 'דברו בשטף וביטחון'

export const SN_PRICE = 197

// Half-price add-ons, offered ONLY on /speak-now (2026-11-15).
export const SN_ADDONS = ['yalla', 'soe'] as const
export type SnAddon = (typeof SN_ADDONS)[number]

export const ADDON_LABEL: Record<SnAddon, string> = {
  yalla: 'יאללה, לחזור אחרי',
  soe: 'צלילי אנגלית',
}
export const ADDON_FULL: Record<SnAddon, number> = { yalla: 167, soe: 147 }
export const ADDON_PRICE: Record<SnAddon, number> = { yalla: 84, soe: 74 }

// One letter per add-on travels inside Cardcom's ReturnValue.
export const ADDON_CODE: Record<SnAddon, string> = { yalla: 'Y', soe: 'S' }

export function parseAddons(input: unknown): SnAddon[] | null {
  if (input == null) return []
  if (!Array.isArray(input)) return null
  if (!input.every((a) => SN_ADDONS.includes(a as SnAddon))) return null
  return SN_ADDONS.filter((a) => input.includes(a))
}

export function addonsFromCodes(codes: string): SnAddon[] {
  return SN_ADDONS.filter((a) => (codes || '').includes(ADDON_CODE[a]))
}

export function snTotal(addons: SnAddon[]): number {
  return SN_PRICE + addons.reduce((s, a) => s + ADDON_PRICE[a], 0)
}
