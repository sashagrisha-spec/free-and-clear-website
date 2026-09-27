import nodemailer from 'nodemailer'
import { NextRequest, NextResponse } from 'next/server'
import { sendPurchaseEvent } from '@/lib/meta-capi'
import { saveBuyer } from '@/lib/save-buyer'
import { addSubscriberToList } from '@/lib/ravmesser'
import { accessUrl } from '@/lib/access'

// Called by the thank-you page after Cardcom redirects back. It FIRST verifies
// the payment with Cardcom: nothing is emailed, stored or counted unless a real
// payment went through. Then, best-effort: email the buyer their personal access
// link, add them to the RavMesser buyers list, save them to Supabase and fire the
// server-side Meta Purchase (de-duped with the browser pixel).

const PRODUCT_SLUG = 'the-sound-of-english'
const COURSE_ID = 'the-sound-of-english'
// RavMesser buyers list "רכשו את צלילי אנגלית" (segmentation only: access itself
// is the signed link below, not a Schooler password).
const SOE_LIST_ID = Number(process.env.SOE_LIST_ID) || 121115
// Order bumps. Both are delivered exactly the way they already are on the
// live יאללה page, so nothing new is invented here.
const SMALL_TALK_SLUG = 'small-talk-bump'
const SMALL_TALK_LIST = 'רכשו קורס סמול טוק' // the RavMesser list Schooler watches
const SMALL_TALK_LIST_ID = Number(process.env.SMALL_TALK_LIST_ID) || 77532
const YALLA_SLUG = 'yalla-bump'
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

function accessEmailHtml(name: string, link: string, smallTalk: boolean, yalla: boolean): string {
  const yallaNote = yalla
    ? `<div style="background:#F4F8FF;border:1px dashed #1B3054;border-radius:12px;padding:16px 20px;margin:20px 0;line-height:1.8">
        <p style="margin:0 0 6px"><strong>וגם: יאללה, לחזור אחרי 🎧</strong></p>
        <p style="margin:0">כל 55 ההקלטות מחכות לכם כאן:
          <a href="${YALLA_DRIVE_LINK}" style="color:#1B3054">לכל ההקלטות</a>
        </p>
      </div>`
    : ''
  const smallTalkNote = smallTalk
    ? `<div style="background:#FFFBEE;border:1px dashed #F2B705;border-radius:12px;padding:16px 20px;margin:20px 0;line-height:1.8">
        <p style="margin:0 0 6px"><strong>וגם: קורס Small talk קטן עליי 🎉</strong></p>
        <p style="margin:0">הגישה לקורס תגיע במייל נפרד עם שם משתמש וסיסמה, ממש בקרוב.</p>
      </div>`
    : ''
  return `
    <div style="font-family:Arial,sans-serif;direction:rtl;text-align:right;max-width:520px;margin:0 auto;color:#2D2D2D">
      <h2 style="color:#1B3054">היי ${name}, הקורס שלכם מוכן 🎧</h2>
      <p style="font-size:16px">התשלום עבר, וכל השיעורים מחכים לכם כאן:</p>

      <p style="text-align:center;margin:28px 0">
        <a href="${link}"
           style="background:#1B3054;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block">
          לכניסה לקורס 👈
        </a>
      </p>

      ${yallaNote}
      ${smallTalkNote}

      <div style="background:#FFFBEE;border:1px dashed #F2B705;border-radius:12px;padding:16px 20px;margin:20px 0;line-height:1.8">
        <p style="margin:0"><strong>שמרו את המייל הזה.</strong> הקישור הוא אישי, הוא לא פג, והוא הדרך שלכם להיכנס לקורס בכל פעם.</p>
      </div>

      <div style="background:#F4F4F4;border-radius:12px;padding:20px 24px;margin:20px 0;line-height:1.9">
        <p style="margin:0 0 8px"><strong>איך עובדים עם זה:</strong></p>
        <p style="margin:0">שיעור אחד ביום. קודם צופים בהסבר, ואז מתרגלים יחד איתי בקול. מתחת לכל תרגול יש דף תרגול להדפסה.</p>
      </div>

      <p style="font-size:14px;color:#6B7280">שאלה? פשוט תענו למייל הזה.</p>
      <p style="font-size:15px;margin-top:22px">באהבה,<br>סשה 💛</p>
    </div>`
}

export async function POST(req: NextRequest) {
  const { returnValue, lowProfileCode } = await req.json()

  let amount: number | undefined
  try {
    const v = await verifyCardcom(lowProfileCode)
    if (v.ResponseCode !== 0 || v.TranzactionInfo?.ResponseCode !== 0) {
      return NextResponse.json({ error: 'התשלום לא אושר מול חברת האשראי' }, { status: 400 })
    }
    amount = v.TranzactionInfo?.Amount
  } catch (err) {
    console.error('[soe/complete] Cardcom verify error:', err)
    return NextResponse.json({ error: 'שגיאה בתקשורת מול חברת הסליקה' }, { status: 500 })
  }

  const parts = decodeURIComponent(returnValue || '').split('|')
  if (parts.length < 4 || parts[0] !== 'SOE') {
    return NextResponse.json({ error: 'פרמטרים שגויים' }, { status: 400 })
  }
  const [, email, name, eventId, smallTalkFlag, yallaFlag] = parts
  const smallTalk = smallTalkFlag === '1'
  const yalla = yallaFlag === '1'
  const value = typeof amount === 'number' ? amount : 97
  const currency = 'ILS'

  // The access link must point at the site the buyer actually came from. On a
  // local dev server NEXT_PUBLIC_BASE_URL still holds the live domain, which is
  // how the first test produced an email whose button led to a 404.
  const origin = req.nextUrl.origin || ''
  const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
  const baseUrl = (isLocal && origin) || process.env.NEXT_PUBLIC_BASE_URL || ''
  const link = accessUrl(baseUrl, COURSE_ID, email)

  // Idempotency guard: the thank-you page calls this on every load, so only the
  // FIRST call for a given Cardcom transaction may trigger side effects.
  const claim = await saveBuyer({
    product: PRODUCT_SLUG,
    name,
    email,
    amount: value,
    currency,
    cardcomLowProfile: lowProfileCode,
    eventId,
  })
  if (claim === 'duplicate') {
    return NextResponse.json({ success: true, name, accessUrl: link, eventId, value, currency, smallTalk, yalla, duplicate: true })
  }

  // If the purchase could NOT be recorded, the buyer is still served below, but
  // the record would be lost unless we surface it the same day.
  if (claim === 'error') {
    transporter.sendMail({
      from: `"Free & Clear English" <${process.env.GMAIL_USER}>`,
      to: [process.env.GMAIL_USER, 'sasha@freeandclearenglish.com'].join(', '),
      subject: `⚠️ רכישת קורס הצלילים לא נרשמה במסד! ${name}`,
      html: `<div style="font-family:Arial,sans-serif;direction:rtl;text-align:right;line-height:1.8">
        <h3 style="color:#B91C1C">רכישה לא נשמרה ב-Supabase</h3>
        <p><strong>שם:</strong> ${name}</p>
        <p><strong>מייל:</strong> ${email}</p>
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
      subject: 'הקורס שלכם מוכן - The Sound of English 🎧',
      html: accessEmailHtml(name, link, smallTalk, yalla),
    }),
  )

  // Buyers list, for segmentation. Access does not depend on this call.
  sideEffects.push(
    addSubscriberToList({ email, first: name, name, listId: SOE_LIST_ID, disableNotification: true }),
  )

  sideEffects.push(
    transporter.sendMail({
      from: `"Free & Clear English" <${process.env.GMAIL_USER}>`,
      to: [process.env.GMAIL_USER, 'sasha@freeandclearenglish.com'].join(', '),
      subject: `🎉 נמכר The Sound of English! ${name}`,
      html: `<div style="font-family:Arial,sans-serif;direction:rtl;text-align:right;line-height:1.8">
        <h3 style="color:#1B3054">רכישה חדשה</h3>
        <p><strong>שם:</strong> ${name}</p>
        <p><strong>מייל:</strong> ${email}</p>
        <p><strong>סכום:</strong> ${value} ₪</p>
        <p><strong>Small talk:</strong> ${smallTalk ? 'כן' : 'לא'}</p>
        <p><strong>יאללה, לחזור אחרי:</strong> ${yalla ? 'כן' : 'לא'}</p>
      </div>`,
    }),
  )

  // יאללה bump: the Drive link is already in the email above; here we only add
  // the buyer to its list and record the sale.
  if (yalla) {
    sideEffects.push(
      addSubscriberToList({ email, first: name, name, listId: YALLA_LIST_ID, disableNotification: true }),
    )
    sideEffects.push(
      saveBuyer({ product: YALLA_SLUG, name, email, currency, cardcomLowProfile: lowProfileCode, eventId }),
    )
  }

  // Small talk bump: adding the buyer to the RavMesser list makes Schooler email
  // them a username + password. If that fails, ask Sasha to do it by hand so no
  // buyer is left without access.
  if (smallTalk) {
    const grant = await addSubscriberToList({ email, first: name, name, listId: SMALL_TALK_LIST_ID })
    if (grant === 'error') {
      sideEffects.push(
        transporter.sendMail({
          from: `"Free & Clear English" <${process.env.GMAIL_USER}>`,
          to: [process.env.GMAIL_USER, 'sasha@freeandclearenglish.com'].join(', '),
          subject: `⚠️ נמכר Small talk - הוספה ידנית נדרשת! ${name}`,
          html: `<div style="font-family:Arial,sans-serif;direction:rtl;text-align:right;line-height:1.8">
            <h3 style="color:#B91C1C">ההוספה האוטומטית נכשלה</h3>
            <p>הוסיפי ידנית את <strong>${email}</strong> לרשימה "${SMALL_TALK_LIST}" ברב מסר, וסקולר ישלח גישה.</p>
          </div>`,
        }),
      )
    }
    sideEffects.push(
      saveBuyer({ product: SMALL_TALK_SLUG, name, email, currency, cardcomLowProfile: lowProfileCode, eventId }),
    )
  }

  await Promise.allSettled(sideEffects)

  await sendPurchaseEvent({
    email,
    value,
    currency,
    eventId,
    eventSourceUrl: `${baseUrl}/${PRODUCT_SLUG}/success`,
    clientIp: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || undefined,
    userAgent: req.headers.get('user-agent') || undefined,
  })

  return NextResponse.json({ success: true, name, accessUrl: link, eventId, value, currency, smallTalk, yalla })
}
