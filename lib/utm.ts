// Where a buyer came from (utm_source / utm_medium / utm_campaign).
// The sales page saves the UTM from its URL in the browser; the thank-you page
// reads it back after Cardcom and hands it to the complete route, so the
// source never has to travel through Cardcom itself.

export interface Utm {
  source: string
  medium: string
  campaign: string
}

const KEY = 'fce_utm'
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000

// Called on the sales page. A newer UTM link always replaces an older one.
export function rememberUtm(params: URLSearchParams) {
  const source = params.get('utm_source')
  if (!source) return
  try {
    localStorage.setItem(
      KEY,
      JSON.stringify({
        source,
        medium: params.get('utm_medium') || '',
        campaign: params.get('utm_campaign') || '',
        ts: Date.now(),
      }),
    )
  } catch {}
}

// Called on the thank-you page. Null when there is nothing, or it is too old.
export function recallUtm(): Utm | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const u = JSON.parse(raw)
    if (!u?.source || Date.now() - (u.ts || 0) > MAX_AGE_MS) return null
    return { source: String(u.source), medium: String(u.medium || ''), campaign: String(u.campaign || '') }
  } catch {
    return null
  }
}

// Server side: attach the source to an already-saved buyer row. Never throws.
export async function saveBuyerSource(product: string, cardcomLowProfile: string, utm: Utm) {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_ANON_KEY
  if (!url || !key) return
  try {
    const res = await fetch(`${url}/rest/v1/rpc/set_buyer_source`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: key, Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        p_product: product,
        p_cardcom_lowprofile: cardcomLowProfile,
        p_utm_source: utm.source,
        p_utm_medium: utm.medium,
        p_utm_campaign: utm.campaign,
      }),
    })
    if (!res.ok) console.error('[utm] set_buyer_source failed:', res.status, await res.text())
  } catch (err) {
    console.error('[utm] error:', err)
  }
}
