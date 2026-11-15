import { NextResponse, type NextRequest } from 'next/server'
import { MEET } from '@/lib/meet/config'
import { listEvents, patchEvent } from '@/lib/meet/google'
import { sendGuestReminder } from '@/lib/meet/mail'
import { eventToBooking } from '@/lib/meet/booking'
import { israelDateKey, israelParts } from '@/lib/meet/time'

export const dynamic = 'force-dynamic'

// Called every 10 minutes by .github/workflows/meet-reminders.yml.
// Each reminder is marked on the event itself once sent, so a reminder never
// goes out twice, however often this runs.
export async function GET(req: NextRequest) {
  const secret = process.env.MEET_CRON_SECRET
  if (!secret || req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const now = new Date()
  const events = await listEvents(now, new Date(now.getTime() + 26 * 3_600_000), {
    privateExtendedProperty: 'fceMeet=1',
  })

  const sent: string[] = []
  for (const e of events) {
    const b = eventToBooking(e)
    if (!b || e.status === 'cancelled') continue
    const p = { ...e.extendedProperties?.private }
    const minsLeft = (b.start.getTime() - now.getTime()) / 60_000
    // "Morning of the meeting" in the guest's own time zone.
    const sameDay = israelDateKey(now, b.tz) === israelDateKey(b.start, b.tz)
    const morningTime = israelParts(now, b.tz).hour >= MEET.morningReminderHour

    let kind: 'morning' | 'hour' | null = null
    if (!p.r2 && minsLeft > 0 && minsLeft <= MEET.hourBeforeMin + 5) {
      kind = 'hour'
      p.r2 = now.toISOString()
      p.r1 = p.r1 || 'skipped'
    } else if (!p.r1 && sameDay && morningTime && minsLeft > MEET.hourBeforeMin + 10) {
      kind = 'morning'
      p.r1 = now.toISOString()
    }
    if (!kind) continue

    try {
      await sendGuestReminder(b, kind)
      await patchEvent(e.id, { extendedProperties: { private: p } })
      sent.push(`${kind}:${e.id}`)
    } catch (err) {
      console.error('meet reminder', e.id, err)
    }
  }
  return NextResponse.json({ ok: true, checked: events.length, sent })
}
