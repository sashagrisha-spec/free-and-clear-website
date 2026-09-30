import crypto from 'crypto'

// Meta Conversions API (server-side) Purchase event.
// This is the reliable way to count purchases in Meta — it is not blocked by
// ad blockers or iOS, unlike the browser pixel. The browser pixel is added
// separately (components/MetaPixel.tsx) and de-duplicated via eventId.
//
// Requires env: META_PIXEL_ID, META_CAPI_TOKEN.
// If they are missing (e.g. during the POC) it silently no-ops.

function sha256(value: string): string {
  return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex')
}

interface PurchaseInput {
  email: string
  value: number
  currency: string
  eventId: string // same id sent from the browser pixel, for de-duplication
  eventSourceUrl?: string
  clientIp?: string
  userAgent?: string
}

export async function sendPurchaseEvent(input: PurchaseInput): Promise<void> {
  const pixelId = process.env.META_PIXEL_ID
  const token = process.env.META_CAPI_TOKEN
  if (!pixelId || !token) {
    console.warn('[meta-capi] META_PIXEL_ID/META_CAPI_TOKEN not set — skipping Purchase event')
    return
  }

  const body = {
    data: [
      {
        event_name: 'Purchase',
        event_time: Math.floor(Date.now() / 1000),
        event_id: input.eventId,
        action_source: 'website',
        event_source_url: input.eventSourceUrl,
        user_data: {
          em: [sha256(input.email)],
          client_ip_address: input.clientIp,
          client_user_agent: input.userAgent,
        },
        custom_data: {
          value: input.value,
          currency: input.currency,
        },
      },
    ],
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${token}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      },
    )
    if (!res.ok) {
      console.error('[meta-capi] Purchase event failed:', await res.text())
    }
  } catch (err) {
    console.error('[meta-capi] Purchase event error:', err)
  }
}

// ---------------------------------------------------------------------------
// Lead event, for the pre-launch giveaway at /hagrala.
//
// Without it a paid campaign can only optimise for clicks and Sasha cannot see
// what one email costs her. Same de-duplication contract as Purchase above: the
// browser fires the identical event_id.

interface LeadInput {
  email: string
  eventId: string
  contentName?: string
  eventSourceUrl?: string
  clientIp?: string
  userAgent?: string
}

export async function sendLeadEvent(input: LeadInput): Promise<void> {
  const pixelId = process.env.META_PIXEL_ID
  const token = process.env.META_CAPI_TOKEN
  if (!pixelId || !token) {
    console.warn('[meta-capi] META_PIXEL_ID/META_CAPI_TOKEN not set — skipping Lead event')
    return
  }

  const body = {
    data: [
      {
        event_name: 'Lead',
        event_time: Math.floor(Date.now() / 1000),
        event_id: input.eventId,
        action_source: 'website',
        event_source_url: input.eventSourceUrl,
        user_data: {
          em: [sha256(input.email)],
          client_ip_address: input.clientIp,
          client_user_agent: input.userAgent,
        },
        custom_data: {
          content_name: input.contentName ?? 'hagrala-waitlist',
        },
      },
    ],
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${token}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      },
    )
    if (!res.ok) {
      console.error('[meta-capi] Lead event failed:', await res.text())
    }
  } catch (err) {
    console.error('[meta-capi] Lead event error:', err)
  }
}
