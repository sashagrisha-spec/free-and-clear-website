'use client'

import { useCallback, useState, useSyncExternalStore } from 'react'
import { PROMOTED_COUPON } from '@/lib/coupons'

// The holiday sale strip that sits above everything on /courses.
//
// It reads the promoted coupon from lib/coupons, the SAME module the checkout
// reads it from, so the banner and the real discount can never disagree.
// And it takes itself off the page the moment the coupon expires: a strip
// still promising 35% after the code stopped working would be a broken promise
// to anyone landing here on the 4th.

const RECHECK_MS = 15000

/**
 * Is the promoted sale still running?
 *
 * useSyncExternalStore rather than useEffect + setState: the answer depends on
 * the clock, which only exists in the browser. The server snapshot is always
 * false, so the HTML the browser hydrates never disagrees with the server, and
 * the strip appears immediately after hydration.
 */
function useSaleIsLive(expires: string | undefined): boolean {
  const subscribe = useCallback((onChange: () => void) => {
    const id = setInterval(onChange, RECHECK_MS)
    return () => clearInterval(id)
  }, [])

  const getSnapshot = useCallback(
    () => (expires ? Date.now() < new Date(expires).getTime() : false),
    [expires],
  )

  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}

export default function HolidayStrip() {
  const [copied, setCopied] = useState(false)
  const live = useSaleIsLive(PROMOTED_COUPON?.coupon.expires)

  const copyCode = useCallback(async () => {
    if (!PROMOTED_COUPON) return
    try {
      await navigator.clipboard.writeText(PROMOTED_COUPON.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard blocked (old browser, or a non-secure origin). The code is
      // written out in full right there, so it can still be typed by hand.
    }
  }, [])

  if (!PROMOTED_COUPON || !live) return null

  const percent = Math.round(PROMOTED_COUPON.coupon.discount * 100)

  return (
    <div dir="rtl" style={{ backgroundColor: 'var(--yellow)', color: 'var(--navy)' }}>
      <div className="max-w-5xl mx-auto px-5 py-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center">
        <span className="font-black text-base sm:text-lg">
          🎉 מבצע החגים: {percent}% הנחה על כל הקורסים
        </span>

        <button
          type="button"
          onClick={copyCode}
          className="inline-flex items-center gap-2 rounded-lg font-black tracking-wider px-3 py-1.5 transition-opacity hover:opacity-85"
          style={{ backgroundColor: 'var(--navy)', color: 'var(--yellow)', border: 'none', cursor: 'pointer' }}
          aria-label={`העתקת קוד הקופון ${PROMOTED_COUPON.code}`}
        >
          {PROMOTED_COUPON.code}
          <span className="text-xs font-bold" style={{ opacity: 0.85 }}>
            {copied ? '✓ הועתק' : 'העתקה'}
          </span>
        </button>

        <span className="text-sm font-bold" style={{ opacity: 0.75 }}>
          מקלידים את הקוד בעמוד התשלום
        </span>
      </div>
    </div>
  )
}
