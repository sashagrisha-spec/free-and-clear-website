import nodemailer from 'nodemailer'
import { NextRequest, NextResponse } from 'next/server'
import { sendPurchaseEvent } from '@/lib/meta-capi'
import { saveBuyer } from '@/lib/save-buyer'
import { saveBuyerSource, type Utm } from '@/lib/utm'
import { addSubscriberToList } from '@/lib/ravmesser'
import { accessUrl } from '@/lib/access'
import { COURSE_LABEL, KIT_NAME, KIT_SLUG, coursesFromCodes, kitPrice, type KitCourse } from '@/lib/speaking-kit'

// Called by /bundle/success after Cardcom redirects back. It FIRST verifies the
// payment with Cardcom: nothing is emailed, stored or counted unless a real
// payment went through. Then, best-effort: one email to the buyer with access to
// every course they bought, the RavMesser buyers lists, Supabase, and the
// server-side Meta Purchase (de-duped with the browser pixel).
//
// Small talk is delivered on the SITE (/courses/small-talk/lessons), NOT through
// Schooler: the buyer is deliberately not added to list 77532, which would make
// Schooler send a second, separate login.

const SOE_LIST_ID = Number(process.env.SOE_LIST_ID) || 121115
const YALLA_LIST_ID = Number(process.env.YALLA_LIST_ID) || 112995
const YALLA_DRIVE_LINK = 'https://drive.google.com/drive/folders/1vUQK4CzoPDkPYX87VAdUNcu5lhkl_yGj?usp=drive_link'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.GMAIL_USER!, pass: process.env.GMAIL_APP_PASSWORD! },
})

async function verifyCardcom(lowProfileCode: string) {
  const res = await fetch('https://secure.cardcom.solutions/api/v11/LowProfile/GetLpResult', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      TerminalNumber: Number(process.env.CARDCOM_TERMINAL),
      ApiName: process.env.CARDCOM_API_NAME,
      LowProfileId: lowProfileCode,
    }),
  })
  return res.json()
}

export type KitLink = { course: KitCourse; label: string; url: string; note: string }

function kitLinks(baseUrl: string, email: string, courses: KitCourse[]): KitLink[] {
  return courses.map((c) => {
    if (c === 'soe')
      return { course: c, label: COURSE_LABEL[c], url: accessUrl(baseUrl, 'the-sound-of-english', email), note: '34 סרטונים ו-17 דפי תרגול' }
    if (c === 'smallTalk')
      return { course: c, label: COURSE_LABEL[c], url: accessUrl(baseUrl, 'small-talk', email), note: '17 שיעורים, 8 דפי תרגול ותעודת סיום' }
    return { course: c, label: COURSE_LABEL[c], url: YALLA_DRIVE_LINK, note: '55 הקלטות להורדה' }
  })
}

function accessEmailHtml(name: string, links: KitLink[]): string {
  const blocks = links
    .map(
      (l) => `
      <div style="background:#FFFBEE;border:1px dashed #F2B705;border-radius:12px;padding:16px 20px;margin:16px 0;line-height:1.8">
        <p style="margin:0 0 4px;font-size:17px"><strong>${l.label}</strong></p>
        <p style="margin:0 0 10px;color:#6B7280">${l.note}</p>
        <a href="${l.url}" style="background:#1B3054;color:#fff;padding:11px 26px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block">לכניסה 👈</a>
      </div>`,
    )
    .join('')
  return `
    <div style="font-family:Arial,sans-serif;direction:rtl;text-align:right;max-width:520px;margin:0 auto;color:#2D2D2D">
      <h2 style="color:#1B3054">היי ${name}, ${KIT_NAME} שלכם מוכנה 🎧</h2>
      <p style="font-size:16px">התשלום עבר, וכל הקורסים מחכים לכם כאן:</p>
      ${blocks}
      <div style="background:#F4F4F4;border-radius:12px;padding:16px 20px;margin:20px 0;line-height:1.8">
        <p style="margin:0"><strong>שמרו את המייל הזה.</strong> הקישורים אישיים, הם לא פגים, והם הדרך שלכם להיכנס בכל פעם.</p>
      </div>
      <p style="font-size:14px;color:#6B7280">שאלה? פשוט תענו למייל הזה.</p>
      <p style="font-size:15px;margin-top:22px">באהבה,<br>סשה 💛</p>
    </div>`
}

export async function POST(req: NextRequest) {
  const { returnValue, lowProfileCode, utm } = (await req.json()) as {
    returnValue: string
    lowProfileCode: string
    utm?: Utm | null
  }

  let amount: number | undefined
  try {
    const v = await verifyCardcom(lowProfileCode)
    if (v.ResponseCode !== 0 || v.TranzactionInfo?.ResponseCode !== 0) {
      return NextResponse.json({ error: 'התשלום לא אושר מול חברת האשראי' }, { status: 400 })
    }
    amount = v.TranzactionInfo?.Amount
  } catch (err) {
    console.error('[kit/complete] Cardcom verify error:', err)
    return NextResponse.json({ error: 'שגיאה בתקשורת מול חברת הסליקה' }, { status: 500 })
  }

  const parts = decodeURIComponent(returnValue || '').split('|')
  if (parts.length < 5 || parts[0] !== 'KIT') {
    return NextResponse.json({ error: 'פרמטרים שגויים' }, { status: 400 })
  }
  const [, email, name, eventId, codes] = parts
  const courses = coursesFromCodes(codes)
  if (!courses) {
    return NextResponse.json({ error: 'פרמטרים שגויים' }, { status: 400 })
  }
  const value = typeof amount === 'number' ? amount : kitPrice(courses)
  const currency = 'ILS'

  const origin = req.nextUrl.origin || ''
  const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
  const baseUrl = (isLocal && origin) || process.env.NEXT_PUBLIC_BASE_URL || ''
  const links = kitLinks(baseUrl, email, courses)

  // Idempotency guard: the thank-you page calls this on every load, so only the
  // FIRST call for a given Cardcom transaction may trigger side effects.
  const claim = await saveBuyer({
    product: KIT_SLUG,
    name,
    email,
    amount: value,
    currency,
    cardcomLowProfile: lowProfileCode,
    eventId,
  })
  if (claim === 'inserted' && utm?.source && lowProfileCode) {
    await saveBuyerSource(KIT_SLUG, lowProfileCode, utm)
  }
  const sourceLabel = utm?.source ? [utm.source, utm.medium, utm.campaign].filter(Boolean).join(' / ').replace(/[<>&"]/g, '') : 'ישיר / לא ידוע'
  const courseList = courses.map((c) => COURSE_LABEL[c]).join(', ')

  if (claim === 'duplicate') {
    return NextResponse.json({ success: true, name, links, eventId, value, currency, duplicate: true })
  }

  if (claim === 'error') {
    transporter.sendMail({
      from: `"Free & Clear English" <${process.env.GMAIL_USER}>`,
      to: [process.env.GMAIL_USER, 'sasha@freeandclearenglish.com'].join(', '),
      subject: `⚠️ רכישת ${KIT_NAME} לא נרשמה במסד! ${name}`,
      html: `<div style="font-family:Arial,sans-serif;direction:rtl;text-align:right;line-height:1.8">
        <h3 style="color:#B91C1C">רכישה לא נשמרה ב-Supabase</h3>
        <p><strong>שם:</strong> ${name}</p>
        <p><strong>מייל:</strong> ${email}</p>
        <p><strong>קורסים:</strong> ${courseList}</p>
        <p><strong>סכום:</strong> ${value} ₪</p>
        <p><strong>מספר עסקה:</strong> ${lowProfileCode}</p>
        <p>הקונה קיבל/ה גישה, אבל הרשומה חסרה. שווה לרשום ידנית.</p>
      </div>`,
    }).catch(() => {})
  }

  const sideEffects: Promise<unknown>[] = []

  sideEffects.push(
    transporter.sendMail({
      from: `"Free & Clear English" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `${KIT_NAME} שלכם מוכנה 🎧`,
      html: accessEmailHtml(name, links),
    }),
  )

  sideEffects.push(
    transporter.sendMail({
      from: `"Free & Clear English" <${process.env.GMAIL_USER}>`,
      to: [process.env.GMAIL_USER, 'sasha@freeandclearenglish.com'].join(', '),
      subject: `🎉 נמכרה ${KIT_NAME}! ${name}`,
      html: `<div style="font-family:Arial,sans-serif;direction:rtl;text-align:right;line-height:1.8">
        <h3 style="color:#1B3054">רכישה חדשה</h3>
        <p><strong>שם:</strong> ${name}</p>
        <p><strong>מייל:</strong> ${email}</p>
        <p><strong>קורסים:</strong> ${courseList}</p>
        <p><strong>סכום:</strong> ${value} ₪</p>
        <p><strong>מקור:</strong> ${sourceLabel}</p>
      </div>`,
    }),
  )

  // Buyers lists, for segmentation only. Access never depends on these calls.
  if (courses.includes('soe')) {
    sideEffects.push(addSubscriberToList({ email, first: name, name, listId: SOE_LIST_ID, disableNotification: true }))
  }
  if (courses.includes('yalla')) {
    sideEffects.push(addSubscriberToList({ email, first: name, name, listId: YALLA_LIST_ID, disableNotification: true }))
  }

  await Promise.allSettled(sideEffects)

  await sendPurchaseEvent({
    email,
    value,
    currency,
    eventId,
    eventSourceUrl: `${baseUrl}/bundle/success`,
    clientIp: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || undefined,
    userAgent: req.headers.get('user-agent') || undefined,
  })

  return NextResponse.json({ success: true, name, links, eventId, value, currency })
}
