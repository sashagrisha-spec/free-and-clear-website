import { NextResponse } from 'next/server'
import { MEET } from '@/lib/meet/config'
import { getSlots } from '@/lib/meet/availability'
import { cancelEvent, getEvent, patchEvent } from '@/lib/meet/google'
import { notifySasha, sendGuestConfirmation } from '@/lib/meet/mail'
import { cleanText, eventToBooking } from '@/lib/meet/booking'
import { verifyEventId } from '@/lib/meet/token'
import { safeTz } from '@/lib/meet/time'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const id = cleanText(body.id, 200)
  const t = cleanText(body.t, 64)
  const action = cleanText(body.action, 20)

  if (!verifyEventId(id, t)) return NextResponse.json({ error: 'הקישור לא תקין' }, { status: 403 })

  try {
    const event = await getEvent(id)
    const booking = event && event.status !== 'cancelled' ? eventToBooking(event) : null
    if (!event || !booking) return NextResponse.json({ error: 'הפגישה הזו כבר בוטלה' }, { status: 404 })

    if (action === 'cancel') {
      const reason = cleanText(body.message, 1000)
      await cancelEvent(id)
      await notifySasha('cancelled', booking, reason ? `הודעה: ${reason}` : '').catch(e => console.error('meet mail', e))
      return NextResponse.json({ ok: true })
    }

    if (action === 'message') {
      const message = cleanText(body.message, 2000)
      if (!message) return NextResponse.json({ error: 'צריך לכתוב הודעה' }, { status: 400 })
      await notifySasha('message', booking, message)
      return NextResponse.json({ ok: true })
    }

    if (action === 'reschedule') {
      const startDate = new Date(cleanText(body.start, 40))
      const slots = await getSlots(id)
      if (isNaN(startDate.getTime()) || !slots.some(s => s.start === startDate.toISOString())) {
        return NextResponse.json({ error: 'השעה הזו כבר לא פנויה, בחרו שעה אחרת', taken: true }, { status: 409 })
      }
      const endDate = new Date(startDate.getTime() + MEET.durationMin * 60_000)
      // Whoever moves it now, from wherever they are, sets the zone for the emails.
      const tz = body.tz ? safeTz(body.tz) : booking.tz
      const oldWhen = booking.start
      const updated = await patchEvent(
        id,
        {
          start: { dateTime: startDate.toISOString(), timeZone: MEET.timeZone },
          end: { dateTime: endDate.toISOString(), timeZone: MEET.timeZone },
          // New time, so both reminders go out again.
          extendedProperties: { private: { ...event.extendedProperties?.private, guestTz: tz, r1: '', r2: '' } },
        },
        'all',
      )
      const moved = { ...booking, start: startDate, meetLink: updated.hangoutLink || booking.meetLink, tz }
      await Promise.allSettled([
        sendGuestConfirmation(moved),
        notifySasha('moved', moved, `המועד הקודם: ${oldWhen.toLocaleString('he-IL', { timeZone: MEET.timeZone })}`),
      ]).then(r => r.forEach(x => x.status === 'rejected' && console.error('meet mail', x.reason)))
      return NextResponse.json({ ok: true, start: startDate.toISOString() })
    }

    return NextResponse.json({ error: 'פעולה לא מוכרת' }, { status: 400 })
  } catch (e) {
    console.error('meet manage', e)
    return NextResponse.json({ error: 'משהו השתבש, נסו שוב בעוד רגע' }, { status: 500 })
  }
}
