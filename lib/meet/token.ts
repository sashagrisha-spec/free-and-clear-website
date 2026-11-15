import { createHmac, timingSafeEqual } from 'crypto'

// The guest's personal "manage my meeting" link is signed, so nobody can
// cancel someone else's meeting by guessing an id.
export function signEventId(id: string): string {
  return createHmac('sha256', process.env.MEET_SECRET || '')
    .update(`meet:${id}`)
    .digest('base64url')
    .slice(0, 32)
}

export function verifyEventId(id: string, token: string): boolean {
  if (!id || !token || !process.env.MEET_SECRET) return false
  const a = Buffer.from(signEventId(id))
  const b = Buffer.from(token)
  return a.length === b.length && timingSafeEqual(a, b)
}
