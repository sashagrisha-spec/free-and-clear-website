import type { GEvent } from './google'
import type { Booking } from './mail'
import { safeTz } from './time'

// The calendar event IS the booking record. The guest's details ride along in
// the event's private properties, so there is no database to keep in sync.
export function eventToBooking(e: GEvent): Booking | null {
  const p = e.extendedProperties?.private
  if (!p || p.fceMeet !== '1' || !e.start?.dateTime) return null
  return {
    id: e.id,
    name: p.guestName || '',
    email: p.guestEmail || '',
    phone: p.guestPhone || '',
    start: new Date(e.start.dateTime),
    meetLink: e.hangoutLink,
    tz: safeTz(p.guestTz),
  }
}

export function cleanText(v: unknown, max: number): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : ''
}

export function validEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s)
}

export function validPhone(s: string): boolean {
  return /^[+\d][\d\s()-]{7,}$/.test(s) && s.replace(/\D/g, '').length >= 9
}
