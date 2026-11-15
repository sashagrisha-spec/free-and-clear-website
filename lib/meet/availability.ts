import { MEET } from './config'
import { listEvents, type GEvent } from './google'
import { hm, israelParts, israelToUtc } from './time'

type Busy = { start: number; end: number; buffer: number }

function isOutOfHome(e: GEvent): boolean {
  const text = `${e.summary || ''} ${e.location || ''}`
  if (MEET.outOfHomeWords.some(w => text.includes(w))) return true
  // A physical address in "location" means leaving the house.
  // A video link (Zoom, Meet) does not.
  const loc = (e.location || '').trim()
  if (!loc) return false
  if (/^https?:\/\//i.test(loc) || /zoom|meet\.google|teams\.microsoft/i.test(loc)) return false
  return true
}

function toBusy(e: GEvent): Busy | null {
  if (e.status === 'cancelled') return null
  if (e.eventType === 'workingLocation' || e.eventType === 'focusTime') return null
  // Events marked "free" do not block, except out-of-office which always does.
  if (e.transparency === 'transparent' && e.eventType !== 'outOfOffice') return null
  if (e.attendees?.some(a => a.self && a.responseStatus === 'declined')) return null

  let start: number
  let end: number
  if (e.start?.dateTime && e.end?.dateTime) {
    start = new Date(e.start.dateTime).getTime()
    end = new Date(e.end.dateTime).getTime()
  } else if (e.start?.date && e.end?.date) {
    const [y1, m1, d1] = e.start.date.split('-').map(Number)
    const [y2, m2, d2] = e.end.date.split('-').map(Number)
    start = israelToUtc(y1, m1, d1).getTime()
    end = israelToUtc(y2, m2, d2).getTime()
  } else {
    return null
  }
  const buffer = (isOutOfHome(e) ? MEET.outOfHomeBufferMin : MEET.bufferMin) * 60_000
  return { start, end, buffer }
}

export type Slot = { start: string } // ISO, UTC

// All bookable start times from now until maxDaysAhead.
// excludeEventId: when rescheduling, the guest's own current meeting must not
// block the times around it.
export async function getSlots(excludeEventId?: string): Promise<Slot[]> {
  const now = Date.now()
  const earliest = now + MEET.minNoticeHours * 3_600_000
  const latest = now + MEET.maxDaysAhead * 86_400_000

  // MEET_DEMO=1 (local preview only): an empty calendar, no Google connection needed.
  const events = process.env.MEET_DEMO === '1' ? [] : await listEvents(new Date(now - 86_400_000), new Date(latest + 2 * 86_400_000))
  const busy = events
    .filter(e => e.id !== excludeEventId)
    .map(toBusy)
    .filter((b): b is Busy => b !== null)

  const dur = MEET.durationMin * 60_000
  const [sh, sm] = hm(MEET.dayStart)
  const [eh, em] = hm(MEET.dayEnd)
  const slots: Slot[] = []

  for (let i = 0; i <= MEET.maxDaysAhead + 1; i++) {
    const p = israelParts(new Date(now + i * 86_400_000))
    if (!(MEET.weekdays as readonly number[]).includes(p.weekday)) continue
    const dayOpen = israelToUtc(p.year, p.month, p.day, sh, sm).getTime()
    const dayClose = israelToUtc(p.year, p.month, p.day, eh, em).getTime()
    for (let t = dayOpen; t + dur <= dayClose; t += MEET.slotStepMin * 60_000) {
      if (t < earliest || t > latest) continue
      const end = t + dur
      const clash = busy.some(b => t < b.end + b.buffer && end > b.start - b.buffer)
      if (!clash) slots.push({ start: new Date(t).toISOString() })
    }
  }
  return slots
}
