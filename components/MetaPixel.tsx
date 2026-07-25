'use client'

import Script from 'next/script'

// Browser-side Meta Pixel. Loads only if NEXT_PUBLIC_META_PIXEL_ID is set.
// Server-side Conversions API (lib/meta-capi.ts) is the reliable counterpart;
// both share an event_id so Meta de-duplicates them.

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID

export default function MetaPixel() {
  if (!PIXEL_ID) return null
  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${PIXEL_ID}');
        fbq('track', 'PageView');
      `}
    </Script>
  )
}

// Helper to fire a de-duplicated Purchase from the browser.
export function trackPurchase(value: number, currency: string, eventId: string) {
  if (typeof window === 'undefined') return
  const fbq = (window as unknown as { fbq?: (...a: unknown[]) => void }).fbq
  if (fbq) {
    fbq('track', 'Purchase', { value, currency }, { eventID: eventId })
  }
}
