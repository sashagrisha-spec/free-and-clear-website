// Best-effort: save a buyer to Supabase (public.product_buyers) via PostgREST.
// Never throws. If it fails (e.g. the free-tier DB is paused), the caller's
// notification email to Sasha still contains the buyer's details as a backup.
// Requires env: SUPABASE_URL, SUPABASE_ANON_KEY.
//
// The insert is idempotent per Cardcom transaction: a unique constraint on
// (product, cardcom_lowprofile) + PostgREST `resolution=ignore-duplicates` means
// re-processing the same transaction (e.g. the buyer refreshing the thank-you
// page) inserts nothing and reports 'duplicate'. Callers use that to avoid
// re-sending emails / re-firing Meta events for a transaction already handled.

interface Buyer {
  product: string
  name: string
  email: string
  amount?: number
  currency?: string
  cardcomLowProfile?: string
  eventId?: string
}

// 'inserted'  = this row was newly written (first time we see this transaction)
// 'duplicate' = a row for (product, cardcom_lowprofile) already existed, ignored
// 'error'     = could not reach/insert (env missing, DB paused, network, etc.)
export type SaveBuyerResult = 'inserted' | 'duplicate' | 'error'

export async function saveBuyer(b: Buyer): Promise<SaveBuyerResult> {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_ANON_KEY
  if (!url || !key) {
    console.warn('[save-buyer] SUPABASE_URL/SUPABASE_ANON_KEY not set, skipping')
    return 'error'
  }
  try {
    const res = await fetch(
      `${url}/rest/v1/product_buyers?on_conflict=product,cardcom_lowprofile`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: key,
          Authorization: `Bearer ${key}`,
          // ignore-duplicates: on a conflict, insert nothing (don't overwrite).
          // return=representation: the response body lists only rows actually
          // inserted, so an empty array means it was a duplicate.
          Prefer: 'resolution=ignore-duplicates,return=representation',
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
      },
    )
    if (!res.ok) {
      console.error('[save-buyer] insert failed:', res.status, await res.text())
      return 'error'
    }
    const rows = await res.json().catch(() => [])
    return Array.isArray(rows) && rows.length === 0 ? 'duplicate' : 'inserted'
  } catch (err) {
    console.error('[save-buyer] error:', err)
    return 'error'
  }
}
