// Best-effort: save a buyer to Supabase (public.product_buyers). Never throws.
// If it fails, the caller still serves the buyer and (see complete/route.ts) an
// alert email is sent to Sasha so a lost record is caught the SAME day.
// Requires env: SUPABASE_URL, SUPABASE_ANON_KEY.
//
// ⚠️ WHY THIS GOES THROUGH AN RPC AND NOT A DIRECT TABLE INSERT ⚠️
// product_buyers has an INSERT-only RLS policy for the anon role and NO SELECT
// policy (deliberate: the anon key must never be able to read customer PII).
// A direct PostgREST insert that asks to read the row back (Prefer:
// return=representation, needed to tell "inserted" from "duplicate") is blocked
// by RLS and fails 42501 -> every capture silently broke for days (2026-08-02
// .. 08-06). We now call the SECURITY DEFINER function public.yalla_upsert_buyer,
// which bypasses RLS and returns ONLY a boolean (was a new row inserted?), never
// any PII. DO NOT switch this back to a direct table insert with
// return=representation unless a SELECT policy for anon is added first.

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
    const res = await fetch(`${url}/rest/v1/rpc/yalla_upsert_buyer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        p_product: b.product,
        p_name: b.name,
        p_email: b.email,
        p_amount: typeof b.amount === 'number' ? b.amount : null,
        p_currency: b.currency || 'ILS',
        p_cardcom_lowprofile: b.cardcomLowProfile ?? null,
        p_event_id: b.eventId ?? null,
      }),
    })
    if (!res.ok) {
      console.error('[save-buyer] rpc failed:', res.status, await res.text())
      return 'error'
    }
    // The function returns a scalar boolean: true = newly inserted, false = duplicate.
    const inserted = await res.json().catch(() => null)
    return inserted === true ? 'inserted' : 'duplicate'
  } catch (err) {
    console.error('[save-buyer] error:', err)
    return 'error'
  }
}
