// ─────────────────────────────────────────────────────────────────────────────
//  COUPON CODES for the site's OWN Cardcom checkouts.
//
//  Why this file exists: the site does not use saved Cardcom payment pages. It
//  builds a one-off payment page per buyer through the Cardcom API, and the
//  price is decided HERE, in our code. That means a Cardcom-side coupon can
//  never apply to /yalla-lachzor-acharei. The discount has to live in the code.
//
//  The same human-facing code is ALSO configured by hand in RavMesser for the
//  courses that sell there (Small talk, דברו בשטף וביטחון). Different machinery,
//  identical code, so the buyer types one code everywhere and never sees the
//  seam. If you change a code here, change it in RavMesser too.
//
//  The client imports this for instant on-page feedback, but the CLIENT IS NOT
//  TRUSTED: the server validates again and computes the real amount, so nobody
//  can fake a discount from the browser.
// ─────────────────────────────────────────────────────────────────────────────

export type Coupon = {
  /** Fraction off the price, e.g. 0.35 = 35%. */
  discount: number
  /**
   * Last moment the coupon works, ISO 8601 with an EXPLICIT Israel offset so
   * the deadline means the same thing on a server in any timezone.
   * Israel is UTC+3 (IDT) in summer and UTC+2 (IST) after late October.
   */
  expires: string
  /** Shown to the buyer next to the discounted total. */
  label: string
}

export const COUPONS: Record<string, Coupon> = {
  // Holiday sale 2026. Ends Saturday 3 Oct 2026 at 23:59 Israel time.
  CHAG35: {
    discount: 0.35,
    expires: '2026-10-03T23:59:00+03:00',
    label: 'הנחת חג 35%',
  },
}

/**
 * The coupon currently ADVERTISED on the site: it drives the holiday strip and
 * the countdown on /courses. One switch for the whole promotion.
 *
 * Set it to null to take the banner and the timer off the site immediately.
 * Leaving it pointed at an expired coupon is harmless: both the strip and the
 * countdown hide themselves the moment the deadline passes, so the site never
 * advertises a discount that has stopped working.
 */
export const PROMOTED_COUPON: { code: string; coupon: Coupon } | null = {
  code: 'CHAG35',
  coupon: COUPONS.CHAG35,
}

export type CouponResult =
  | { ok: true; code: string; discount: number; label: string }
  | { ok: false; reason: 'empty' | 'unknown' | 'expired' }

/** Buyer-facing message for a rejected coupon. */
export function couponErrorMessage(reason: 'empty' | 'unknown' | 'expired'): string {
  if (reason === 'expired') return 'הקופון הזה פג תוקף'
  return 'הקוד לא תקין'
}

/**
 * Validate a coupon the buyer typed. Case-insensitive and whitespace-tolerant,
 * because people paste codes out of emails with a stray space.
 */
export function checkCoupon(raw: string | undefined | null, now: Date = new Date()): CouponResult {
  const code = (raw || '').trim().toUpperCase()
  if (!code) return { ok: false, reason: 'empty' }

  const coupon = COUPONS[code]
  if (!coupon) return { ok: false, reason: 'unknown' }

  // Past the deadline the code simply stops working. Nothing to remember to
  // switch off, and the code cannot quietly live on in forums for months.
  if (now.getTime() > new Date(coupon.expires).getTime()) {
    return { ok: false, reason: 'expired' }
  }

  return { ok: true, code, discount: coupon.discount, label: coupon.label }
}

/**
 * Discounted price for ONE line item, in whole shekels.
 *
 * Rounding is per line, not on the total, so the invoice always adds up: every
 * product line on the Cardcom receipt matches the sum that was actually charged.
 * (35% off ₪127 is ₪82.55, charged as ₪83.)
 */
export function applyDiscount(price: number, discount: number): number {
  return Math.round(price * (1 - discount))
}
