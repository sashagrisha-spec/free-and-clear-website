// Waitlist signup for the pre-launch raffle at /hagrala.
//
// No payment, no Cardcom. A name and an email in, one RavMesser list membership out.
// The list is "נרשמים לקראת - צלילי אנגלית" (121157), segmentation only.
//
// This endpoint is fully public, so it is written defensively: a honeypot field
// catches the dumbest bots, a per-IP limit catches the rest, and nothing here
// can ever charge money or hand out course access.

import nodemailer from 'nodemailer'
import { NextRequest, NextResponse } from 'next/server'
import { addSubscriberToList } from '@/lib/ravmesser'
import { saveLead } from '@/lib/save-lead'

const LIST_ID = Number(process.env.HAGRALA_LIST_ID) || 121157
const PRODUCT_SLUG = 'hagrala-waitlist'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.GMAIL_USER!, pass: process.env.GMAIL_APP_PASSWORD! },
})

// Deliberately permissive: the point is to reject obvious junk, not to argue
// with anyone about what a valid address looks like.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i

// Per-IP throttle. Serverless instances come and go, so this is a speed bump,
// not a wall: enough to stop one browser tab hammering the form.
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 6
const hits = new Map<string, number[]>()

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 5000) hits.clear() // never let the map grow without bound
  return recent.length > MAX_PER_WINDOW
}

export async function POST(req: NextRequest) {
  let body: { name?: string; email?: string; website?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'בקשה לא תקינה' }, { status: 400 })
  }

  // Honeypot: a real person never fills a field they cannot see. Answer with a
  // cheerful success so the bot has nothing to learn.
  if (body.website) return NextResponse.json({ success: true })

  const email = (body.email || '').trim().toLowerCase()
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: 'צריך כתובת מייל תקינה' }, { status: 400 })
  }

  // The draw is by name, so a blank name is a broken entry. Capped because the
  // field is public and the value ends up in an email Sasha reads.
  const name = (body.name || '').trim().slice(0, 80)
  if (name.length < 2) {
    return NextResponse.json({ error: 'צריך למלא שם מלא' }, { status: 400 })
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown'
  if (rateLimited(ip)) {
    return NextResponse.json({ error: 'נסו שוב עוד כמה דקות' }, { status: 429 })
  }

  // Backup copy outside RavMesser, so a signup is never lost to an API hiccup.
  const saved = await saveLead({ product: PRODUCT_SLUG, name, email })

  const added = await addSubscriberToList({ email, name, listId: LIST_ID, disableNotification: true })

  // The person is told they are in either way; what matters is that Sasha finds
  // out the moment an address did NOT reach the list, while she can still add it
  // by hand before the draw.
  if (added !== 'granted') {
    transporter
      .sendMail({
        from: `"Free & Clear English" <${process.env.GMAIL_USER}>`,
        to: [process.env.GMAIL_USER, 'sasha@freeandclearenglish.com'].join(', '),
        subject: '⚠️ נרשם להגרלה לא נכנס לרשימה ברב מסר',
        html: `<div style="font-family:Arial,sans-serif;direction:rtl;text-align:right;line-height:1.8">
        <h3 style="color:#B91C1C">הרשמה להגרלה לא הגיעה לרשימה</h3>
        <p><strong>שם:</strong> ${name}</p>
        <p><strong>מייל:</strong> ${email}</p>
        <p><strong>רשימה:</strong> נרשמים לקראת - צלילי אנגלית (${LIST_ID})</p>
        <p><strong>גיבוי ב-Supabase:</strong> ${saved ? 'נשמר' : 'לא נשמר'}</p>
        <p>צריך להוסיף את המייל הזה ידנית לרשימה.</p>
      </div>`,
      })
      .catch(() => {})
  }

  return NextResponse.json({ success: true })
}
