'use client'

import { useEffect } from 'react'
import { trackPurchase } from '@/components/MetaPixel'

// Lemon Squeezy takes the money, so there is no server-side verification here.
// Purchase fires once per browser: a refresh or a second visit to this page
// must not count as another sale.
const PRICE = 27
const FLAG = 'sib-purchase-sent'

export default function FirePurchase() {
  useEffect(() => {
    try {
      if (localStorage.getItem(FLAG)) return
    } catch {}
    // The pixel script loads after hydration, so wait for fbq before firing.
    let tries = 0
    const id = setInterval(() => {
      const fbq = (window as unknown as { fbq?: unknown }).fbq
      if (fbq || ++tries > 40) {
        clearInterval(id)
        if (!fbq) return
        trackPurchase(PRICE, 'EUR', `sib-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`)
        try {
          localStorage.setItem(FLAG, '1')
        } catch {}
      }
    }, 250)
    return () => clearInterval(id)
  }, [])
  return null
}
