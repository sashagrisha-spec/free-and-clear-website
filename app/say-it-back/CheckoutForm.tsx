'use client'

// INTERNATIONAL CHECKOUT (Lemon Squeezy, merchant of record)
//
// Unlike the Hebrew page (Cardcom + our own /api/yalla-payment flow), this page
// sends the buyer to a Lemon Squeezy hosted checkout. Lemon Squeezy collects the
// buyer's details, charges in their currency, handles EU / UK / worldwide VAT and
// sends the product email after payment.
//
// SASHA: after you create the product in Lemon Squeezy, paste its "Buy" checkout
// URL below. It looks like https://freeandclearenglish.lemonsqueezy.com/buy/xxxx
// Until it is set, the button is disabled.
const LEMON_CHECKOUT_URL = 'https://freeandclearenglish.lemonsqueezy.com/checkout/buy/b98beb22-c02c-454a-a677-ebefe288ca93?discount=0' // discount=0 hides the coupon field

export default function CheckoutForm() {
  const ready = LEMON_CHECKOUT_URL.length > 0

  function handleClick(e: React.MouseEvent) {
    if (!ready) {
      e.preventDefault()
      return
    }
    // Fire InitiateCheckout for the pixel (best-effort). NOT a purchase.
    const fbq = (window as unknown as { fbq?: (...a: unknown[]) => void }).fbq
    if (fbq) fbq('track', 'InitiateCheckout')
  }

  return (
    <div className="flex flex-col items-center gap-3 max-w-md w-full mx-auto" dir="ltr">
      <a
        href={ready ? LEMON_CHECKOUT_URL : '#'}
        onClick={handleClick}
        aria-disabled={!ready}
        className="inline-flex items-center justify-center rounded-full transition-transform hover:-translate-y-0.5"
        style={{
          backgroundColor: 'var(--yellow)',
          color: '#1B3054',
          padding: '1.15rem 2.9rem',
          fontSize: '1.25rem',
          fontWeight: 700,
          boxShadow: '0 14px 32px rgba(0,0,0,0.25)',
          opacity: ready ? 1 : 0.5,
          pointerEvents: ready ? 'auto' : 'none',
        }}
      >
        Yes, I want to start 👉
      </a>

      {!ready && (
        <p style={{ fontSize: '0.85rem', color: 'var(--yellow)' }}>
          Checkout link not set yet (paste it in CheckoutForm.tsx)
        </p>
      )}

      <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.65)' }}>
        Secure payment via Lemon Squeezy · receipt sent by email
      </p>
    </div>
  )
}
