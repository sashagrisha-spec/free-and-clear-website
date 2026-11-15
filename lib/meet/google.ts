import { MEET } from './config'

// Google Calendar, called directly over REST with a refresh token for the
// business account (sasha@freeandclearenglish.com). No extra packages.

let cached: { token: string; exp: number } | null = null

async function accessToken(): Promise<string> {
  if (cached && cached.exp > Date.now() + 60_000) return cached.token
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID || '',
      client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN || '',
      grant_type: 'refresh_token',
    }),
    cache: 'no-store',
  })
  const data = await res.json()
  if (!res.ok || !data.access_token) {
    throw new Error(`Google token error: ${res.status} ${JSON.stringify(data)}`)
  }
  cached = { token: data.access_token, exp: Date.now() + (data.expires_in || 3600) * 1000 }
  return cached.token
}

const BASE = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(MEET.calendarId)}/events`

async function gcal(path: string, init: RequestInit = {}) {
  const token = await accessToken()
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
    cache: 'no-store',
  })
  if (res.status === 204) return null
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    const err = new Error(`Google Calendar ${res.status}: ${JSON.stringify(data)}`) as Error & { status?: number }
    err.status = res.status
    throw err
  }
  return data
}

export type GEvent = {
  id: string
  status?: string
  summary?: string
  location?: string
  transparency?: string
  eventType?: string
  hangoutLink?: string
  start?: { dateTime?: string; date?: string }
  end?: { dateTime?: string; date?: string }
  attendees?: { email?: string; self?: boolean; responseStatus?: string }[]
  extendedProperties?: { private?: Record<string, string> }
}

export async function listEvents(timeMin: Date, timeMax: Date, extra: Record<string, string> = {}): Promise<GEvent[]> {
  const out: GEvent[] = []
  let pageToken = ''
  do {
    const q = new URLSearchParams({
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      singleEvents: 'true',
      orderBy: 'startTime',
      maxResults: '250',
      ...extra,
    })
    if (pageToken) q.set('pageToken', pageToken)
    const data = await gcal(`?${q}`)
    out.push(...(data.items || []))
    pageToken = data.nextPageToken || ''
  } while (pageToken)
  return out
}

export async function getEvent(id: string): Promise<GEvent | null> {
  try {
    return await gcal(`/${encodeURIComponent(id)}`)
  } catch (e) {
    const status = (e as { status?: number }).status
    if (status === 404 || status === 410 || status === 400) return null
    throw e
  }
}

export async function insertEvent(body: object): Promise<GEvent> {
  return gcal(`?conferenceDataVersion=1&sendUpdates=all`, { method: 'POST', body: JSON.stringify(body) })
}

export async function patchEvent(id: string, body: object, sendUpdates: 'all' | 'none' = 'none'): Promise<GEvent> {
  return gcal(`/${encodeURIComponent(id)}?sendUpdates=${sendUpdates}`, { method: 'PATCH', body: JSON.stringify(body) })
}

// Cancels the meeting. Google moves the event to the calendar's trash and
// emails the guest a cancellation.
export async function cancelEvent(id: string): Promise<void> {
  await gcal(`/${encodeURIComponent(id)}?sendUpdates=all`, { method: 'DELETE' })
}
