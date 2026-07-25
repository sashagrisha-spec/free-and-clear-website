// Best-effort: save a buyer to Supabase (public.product_buyers) via PostgREST.
// Never throws. If it fails (e.g. the free-tier DB is paused), the caller's
// notification email to Sasha still contains the buyer's details as a backup.
// Requires env: SUPABASE_URL, SUPABASE_ANON_KEY.

interface Buyer {
  product: string
  name: string
  email: string
  amount?: number
  currency?: string
  cardcomLowProfile?: string
  eventId?: string
}

export async function saveBuyer(b: Buyer): Promise<boolean> {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_ANON_KEY
  if (!url || !key) {
    console.warn('[save-buyer] SUPABASE_URL/SUPABASE_ANON_KEY not set, skipping')
    return false
  }
  try {
    const res = await fetch(`${url}/rest/v1/product_buyers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: key,
        Authorization: `Bearer ${key}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        product: b.product,
        name: b.name,
        email: b.email,
        amount: b.amount,
        currency: b.currency || 'ILS',
        cardcom_lowprofile: b.cardcomLowProfile,
        event_id: b.eventId,
      }),
    })
    if (!res.ok) {
      console.error('[save-buyer] insert failed:', res.status, await res.text())
      return false
    }
    return true
  } catch (err) {
    console.error('[save-buyer] error:', err)
    return false
  }
}
