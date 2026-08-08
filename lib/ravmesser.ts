// RavMesser (responder.live) API client — just enough to grant course access.
//
// When a buyer is added to a RavMesser list that is wired to a Schooler course,
// Schooler automatically emails them a username + password. So "delivering" the
// Small talk order-bump = adding the buyer's email to list 77532
// ("רכשו קורס סמול טוק"). This replaces the manual step Sasha used to do by hand.
//
// SAFETY (this handles real customers + a live mailing list — be conservative):
//  - We only ever ADD ONE email to ONE list. Never bulk, never send, never delete.
//  - override:false -> we never modify an existing contact's details and never
//    resurrect anyone who unsubscribed. Worst case for an existing contact is a
//    no-op, which we then detect and fall back to a manual alert.
//  - We do NOT trust the write blindly: after adding we READ the list back and
//    confirm the buyer is actually an active member before reporting success.
//    If we can't confirm it, the caller falls back to the old manual flow, so a
//    buyer is never silently left without access.
//
// Auth: OAuth client_credentials against graph.responder.live/v2. Token is
// short-lived, cached in-module, refreshed a minute before expiry.
// Requires env: RAVMESSER_CLIENT_ID, RAVMESSER_CLIENT_SECRET, RAVMESSER_USER_TOKEN.

const V2_BASE = 'https://graph.responder.live/v2'

let cachedToken: { token: string; expires: number } | null = null

async function getToken(): Promise<string> {
  if (cachedToken && cachedToken.expires > Date.now() + 60_000) {
    return cachedToken.token
  }
  const res = await fetch(`${V2_BASE}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.RAVMESSER_CLIENT_ID,
      client_secret: process.env.RAVMESSER_CLIENT_SECRET,
      user_token: process.env.RAVMESSER_USER_TOKEN,
      grant_type: 'client_credentials',
    }),
  })
  if (!res.ok) throw new Error(`RavMesser auth failed: ${res.status} ${await res.text()}`)
  const data = (await res.json()) as { token: string; expire: number }
  cachedToken = { token: data.token, expires: data.expire * 1000 }
  return cachedToken.token
}

type ListSubscriber = { email?: string; active?: number; unsubscribed?: number }

// Read the list back and confirm this email is an ACTIVE member (not unsubscribed
// / blocked). The v2 API ignores the subscriber_id/email query filter, so we page
// through and match ourselves. We page newest-first (dir=1) because a just-added
// buyer is at the end, so the common case resolves on the first page. Read-only.
async function isActiveMember(token: string, listId: number, email: string): Promise<boolean> {
  const target = email.trim().toLowerCase()
  const PAGE = 500
  const HARD_CAP = 60_000 // safety bound on how far we page, regardless of list size
  for (let offset = 0; offset < HARD_CAP; offset += PAGE) {
    const res = await fetch(
      `${V2_BASE}/lists/${listId}/subscribers?limit=${PAGE}&offset=${offset}&dir=1`,
      { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } },
    )
    if (!res.ok) throw new Error(`RavMesser read-back failed: ${res.status} ${await res.text()}`)
    const body = (await res.json()) as { data?: ListSubscriber[]; total?: number }
    const rows = body.data ?? []
    for (const s of rows) {
      if ((s.email || '').trim().toLowerCase() === target) {
        return s.active === 1 && s.unsubscribed !== 1
      }
    }
    // Stop once we've walked the whole list or the API returns a short page.
    if (rows.length < PAGE) break
    if (typeof body.total === 'number' && offset + PAGE >= body.total) break
  }
  return false
}

// 'granted' = buyer is confirmed active on the list (Schooler emails their creds)
// 'error'   = env missing, API failure, or membership could NOT be confirmed
//             -> caller MUST fall back to the manual alert.
export type GrantResult = 'granted' | 'error'

// Add a buyer to a RavMesser list and confirm it. Never throws.
export async function addSubscriberToList(params: {
  email: string
  first?: string
  name?: string
  listId: number
}): Promise<GrantResult> {
  const { email, first, name, listId } = params
  if (!process.env.RAVMESSER_CLIENT_ID || !process.env.RAVMESSER_CLIENT_SECRET || !process.env.RAVMESSER_USER_TOKEN) {
    console.warn('[ravmesser] credentials not set, skipping')
    return 'error'
  }
  try {
    const token = await getToken()
    const res = await fetch(`${V2_BASE}/subscribers`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email,
        list_ids: [listId],
        first: first || name || '',
        name: name || first || '',
        // Do NOT touch an existing contact's details or status. New contacts are
        // created + added; existing ones are only added to this list (a no-op if
        // already on it). This is what keeps us from ever resurrecting someone
        // who unsubscribed.
        override: false,
      }),
    })
    if (!res.ok) {
      console.error('[ravmesser] add subscriber failed:', res.status, await res.text())
      return 'error'
    }

    // Confirm the buyer is really an active member before we report success.
    const active = await isActiveMember(token, listId, email)
    if (!active) {
      console.error('[ravmesser] add returned OK but membership not confirmed for', email)
      return 'error'
    }
    return 'granted'
  } catch (err) {
    console.error('[ravmesser] error:', err)
    return 'error'
  }
}
