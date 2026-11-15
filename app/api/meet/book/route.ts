import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { MEET } from '@/lib/meet/config'
import { getSlots } from '@/lib/meet/availability'
import { insertEvent } from '@/lib/meet/google'
import { notifySasha, sendGuestConfirmation } from '@/lib/meet/mail'
import { cleanText, validEmail, validPhone } from '@/lib/meet/booking'
import { safeTz } from '@/lib/meet/time'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  // Honeypot: bots fill it, people never see it.
  if (cleanText(body.website, 200)) return NextResponse.json({ ok: true })

  const name = cleanText(body.name, 80)
  const email = cleanText(body.email, 120).toLowerCase()
  const phone = cleanText(body.phone, 30)
  const start = cleanText(body.start, 40)
  const tz = safeTz(body.tz)

  if (!name) return NextResponse.json({ error: 'צריך למלא שם' }, { status: 400 })
  if (!validEmail(email)) return NextResponse.json({ error: 'המייל לא נראה תקין' }, { status: 400 })
  if (!validPhone(phone)) return NextResponse.json({ error: 'מספר הטלפון לא נראה תקין' }, { status: 400 })

  try {
    // Check again right now: the slot may have been taken since the page loaded.
    const slots = await getSlots()
    const startDate = new Date(start)
    if (isNaN(startDate.getTime()) || !slots.some(s => s.start === startDate.toISOString())) {
      return NextResponse.json({ error: 'השעה הזו כבר לא פנויה, בחרו שעה אחרת', taken: true }, { status: 409 })
    }
    // Local preview only: show the success screen without touching the calendar or sending mail.
    if (process.env.MEET_DEMO === '1') return NextResponse.json({ ok: true, start: startDate.toISOString(), meetLink: null })

    const endDate = new Date(startDate.getTime() + MEET.durationMin * 60_000)

    const event = await insertEvent({
      summary: `${MEET.title} | ${name}`,
      description: `שם: ${name}\nמייל: ${email}\nטלפון: ${phone}`,
      start: { dateTime: startDate.toISOString(), timeZone: MEET.timeZone },
      end: { dateTime: endDate.toISOString(), timeZone: MEET.timeZone },
      attendees: [{ email, displayName: name }],
      guestsCanModify: false,
      guestsCanInviteOthers: false,
      reminders: { useDefault: true },
      conferenceData: {
        createRequest: { requestId: randomUUID(), conferenceSolutionKey: { type: 'hangoutsMeet' } },
      },
      extendedProperties: {
        private: { fceMeet: '1', guestName: name, guestEmail: email, guestPhone: phone, guestTz: tz, r1: '', r2: '' },
      },
    })

    const booking = { id: event.id, name, email, phone, start: startDate, meetLink: event.hangoutLink, tz }
    // The meeting exists even if an email fails, so emails never fail the booking.
    await Promise.allSettled([sendGuestConfirmation(booking), notifySasha('booked', booking)]).then(r =>
      r.forEach(x => x.status === 'rejected' && console.error('meet mail', x.reason)),
    )

    return NextResponse.json({ ok: true, start: startDate.toISOString(), meetLink: event.hangoutLink || null })
  } catch (e) {
    console.error('meet book', e)
    return NextResponse.json({ error: 'משהו השתבש, נסו שוב בעוד רגע' }, { status: 500 })
  }
}
