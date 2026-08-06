// Best-effort: save a LEAD (someone who reached the payment step) to Supabase
// (public.product_leads) BEFORE the Cardcom redirect. Never throws, never blocks
// checkout. If the person abandons at payment we still have their name+email as a
// warm "interested but didn't buy" contact. Goes through the SECURITY DEFINER
// function public.yalla_capture_lead for the same RLS reason as saveBuyer.
// Requires env: SUPABASE_URL, SUPABASE_ANON_KEY.

interface Lead {
  product: string
  name: string
  email: string
  bump?: boolean
  eventId?: string
}

export async function saveLead(l: Lead): Promise<boolean> {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_ANON_KEY
  if (!url || !key) {
    console.warn('[save-lead] SUPABASE_URL/SUPABASE_ANON_KEY not set, skipping')
    return false
  }
  try {
    const res = await fetch(`${url}/rest/v1/rpc/yalla_capture_lead`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        p_product: l.product,
        p_name: l.name,
        p_email: l.email,
        p_bump: l.bump ?? false,
        p_event_id: l.eventId ?? null,
      }),
    })
    if (!res.ok) {
      console.error('[save-lead] rpc failed:', res.status, await res.text())
      return false
    }
    return true
  } catch (err) {
    console.error('[save-lead] error:', err)
    return false
  }
}
