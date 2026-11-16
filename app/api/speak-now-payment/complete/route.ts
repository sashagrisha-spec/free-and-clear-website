import nodemailer from 'nodemailer'
import { NextRequest, NextResponse } from 'next/server'
import { sendPurchaseEvent } from '@/lib/meta-capi'
import { saveBuyer } from '@/lib/save-buyer'
import { saveBuyerSource, type Utm } from '@/lib/utm'
import { addSubscriberToList } from '@/lib/ravmesser'
import { accessUrl } from '@/lib/access'
import { ADDON_LABEL, SN_NAME, SN_SLUG, addonsFromCodes, snTotal, type SnAddon } from '@/lib/speak-now'

// Called by /speak-now/success after Cardcom redirects back. It FIRST verifies
// the payment with Cardcom: nothing is emailed, stored or counted unless a real
// payment went through. Then, best-effort: one email to the buyer with access to
// everything they bought, the RavMesser buyers lists, Supabase, and the
// server-side Meta Purchase (de-duped with the browser pixel).
//
// The course is delivered on the SITE (/courses/speak-now/lessons), NOT through
// Schooler: the buyer is deliberately NOT added to list 80839 ("רכשו בוסט דיבור -
// מחיר מלא"), which would make Schooler send a second, separate login. Site buyers
// go to their own list (SPEAKNOW_LIST_ID), added only once that env var is set.

const SPEAKNOW_LIST_ID = Number(process.env.SPEAKNOW_LIST_ID) || 0
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

export type SnLink = { course: string; label: string; url: string; note: string }

function snLinks(baseUrl: string, email: string, addons: SnAddon[]): SnLink[] {
  const links: SnLink[] = [
    { course: 'speak-now', label: SN_NAME, url: accessUrl(baseUrl, 'speak-now', email), note: 'הקדמה, שבעה פרקים ובונוסים' },
  ]
  if (addons.includes('yalla'))
    links.push({ course: 'yalla', label: ADDON_LABEL.yalla, url: YALLA_DRIVE_LINK, note: '55 הקלטות להורדה' })
  if (addons.includes('soe'))
    links.push({ course: 'soe', label: ADDON_LABEL.soe, url: accessUrl(baseUrl, 'the-sound-of-english', email), note: '34 סרטונים ו-17 דפי תרגול' })
  return links
}

function accessEmailHtml(name: string, links: SnLink[]): string {
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
      <div style="background:#F5C842;border-radius:12px;padding:16px 20px;margin:0 0 22px;line-height:1.7">
        <p style="margin:0;font-size:17px;color:#1B3054"><strong>שמרו את המייל הזה.</strong><br><strong>הקישורים אישיים, הם לא פגים, והם הדרך שלכם להיכנס בכל פעם.</strong></p>
      </div>
      <h2 style="color:#1B3054">היי ${name}, הקורס שלכם מוכן 🎧</h2>
      <p style="font-size:16px">התשלום עבר, והכל מחכה לכם כאן.</p>
      ${blocks}
      <p style="font-size:14px;color:#6B7280">שאלה? פשוט תענו למייל הזה.</p>
      <p style="font-size:14px;color:#6B7280"><a href="https://www.freeandclearenglish.com/speak-now/terms" style="color:#6B7280">תקנון הרכישה וההחזרים</a></p>
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
    console.error('[speak-now/complete] Cardcom verify error:', err)
    return NextResponse.json({ error: 'שגיאה בתקשורת מול חברת הסליקה' }, { status: 500 })
  }

  const parts = decodeURIComponent(returnValue || '').split('|')
  if (parts.length < 5 || parts[0] !== 'SN') {
    return NextResponse.json({ error: 'פרמטרים שגויים' }, { status: 400 })
  }
  const [, email, name, eventId, codes] = parts
  const addons = addonsFromCodes(codes)
  const value = typeof amount === 'number' ? amount : snTotal(addons)
  const currency = 'ILS'

  const origin = req.nextUrl.origin || ''
  const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
  const baseUrl = (isLocal && origin) || process.env.NEXT_PUBLIC_BASE_URL || ''
  const links = snLinks(baseUrl, email, addons)

  // Idempotency guard: the thank-you page calls this on every load, so only the
  // FIRST call for a given Cardcom transaction may trigger side effects.
  const claim = await saveBuyer({
    product: SN_SLUG,
    name,
    email,
    amount: value,
    currency,
    cardcomLowProfile: lowProfileCode,
    eventId,
  })
  if (claim === 'inserted' && utm?.source && lowProfileCode) {
    await saveBuyerSource(SN_SLUG, lowProfileCode, utm)
  }
  const sourceLabel = utm?.source ? [utm.source, utm.medium, utm.campaign].filter(Boolean).join(' / ').replace(/[<>&"]/g, '') : 'ישיר / לא ידוע'
  const itemList = [SN_NAME, ...addons.map((a) => ADDON_LABEL[a])].join(', ')

  if (claim === 'duplicate') {
    return NextResponse.json({ success: true, name, links, eventId, value, currency, duplicate: true })
  }

  if (claim === 'error') {
    transporter.sendMail({
      from: `"Free & Clear English" <${process.env.GMAIL_USER}>`,
      to: [process.env.GMAIL_USER, 'sasha@freeandclearenglish.com'].join(', '),
      subject: `⚠️ רכישת ${SN_NAME} לא נרשמה במסד! ${name}`,
      html: `<div style="font-family:Arial,sans-serif;direction:rtl;text-align:right;line-height:1.8">
        <h3 style="color:#B91C1C">רכישה לא נשמרה ב-Supabase</h3>
        <p><strong>שם:</strong> ${name}</p>
        <p><strong>מייל:</strong> ${email}</p>
        <p><strong>קורסים:</strong> ${itemList}</p>
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
      subject: `${SN_NAME}: הקורס שלכם מוכן 🎧`,
      html: accessEmailHtml(name, links),
    }),
  )

  sideEffects.push(
    transporter.sendMail({
      from: `"Free & Clear English" <${process.env.GMAIL_USER}>`,
      to: [process.env.GMAIL_USER, 'sasha@freeandclearenglish.com'].join(', '),
      subject: `🎉 נמכר ${SN_NAME}! ${name}`,
      html: `<div style="font-family:Arial,sans-serif;direction:rtl;text-align:right;line-height:1.8">
        <h3 style="color:#1B3054">רכישה חדשה</h3>
        <p><strong>שם:</strong> ${name}</p>
        <p><strong>מייל:</strong> ${email}</p>
        <p><strong>קורסים:</strong> ${itemList}</p>
        <p><strong>סכום:</strong> ${value} ₪</p>
        <p><strong>מקור:</strong> ${sourceLabel}</p>
      </div>`,
    }),
  )

  // Buyers lists, for segmentation only. Access never depends on these calls.
  if (SPEAKNOW_LIST_ID) {
    sideEffects.push(addSubscriberToList({ email, first: name, name, listId: SPEAKNOW_LIST_ID, disableNotification: true }))
  }
  if (addons.includes('soe')) {
    sideEffects.push(addSubscriberToList({ email, first: name, name, listId: SOE_LIST_ID, disableNotification: true }))
  }
  if (addons.includes('yalla')) {
    sideEffects.push(addSubscriberToList({ email, first: name, name, listId: YALLA_LIST_ID, disableNotification: true }))
  }

  await Promise.allSettled(sideEffects)

  await sendPurchaseEvent({
    email,
    value,
    currency,
    eventId,
    eventSourceUrl: `${baseUrl}/speak-now/success`,
    clientIp: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || undefined,
    userAgent: req.headers.get('user-agent') || undefined,
  })

  return NextResponse.json({ success: true, name, links, eventId, value, currency })
}
