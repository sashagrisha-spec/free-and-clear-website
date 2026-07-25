import nodemailer from 'nodemailer'
import { NextRequest, NextResponse } from 'next/server'
import { sendPurchaseEvent } from '@/lib/meta-capi'
import { saveBuyer } from '@/lib/save-buyer'

// Called by the thank-you page after Cardcom redirects back. It FIRST verifies
// the payment with Cardcom: nothing is counted, emailed or stored unless a real
// payment went through. Then, best-effort: email the buyer the Drive link, email
// Sasha a heads-up (which doubles as the backup record), save the buyer to
// Supabase, and fire the server-side Meta Purchase (de-duped with the browser).

const PRODUCT_SLUG = 'yalla-lachzor-acharei'
const SMALL_TALK_SLUG = 'small-talk-bump'
const SMALL_TALK_LIST = 'רכשו קורס סמול טוק' // RavMesser list that unlocks the Schooler course
const DRIVE_LINK = 'https://drive.google.com/drive/folders/1vUQK4CzoPDkPYX87VAdUNcu5lhkl_yGj?usp=drive_link'

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

function accessEmailHtml(name: string, bump: boolean): string {
  const smallTalkNote = bump
    ? `<div style="background:#FFFBEE;border:1px dashed #F2B705;border-radius:12px;padding:16px 20px;margin:20px 0;line-height:1.8">
        <p style="margin:0 0 6px"><strong>וגם: קורס Small talk קטן עליי 🎉</strong></p>
        <p style="margin:0">הגישה לקורס תגיע אליכם במייל נפרד עם שם משתמש וסיסמה, ממש בקרוב. שווה לחכות לזה.</p>
      </div>`
    : ''
  return `
    <div style="font-family:Arial,sans-serif;direction:rtl;text-align:right;max-width:520px;margin:0 auto;color:#2D2D2D">
      <h2 style="color:#1B3054">היי ${name}, יאללה מתחילים! 🎧</h2>
      <p style="font-size:16px">התשלום עבר, וכל 55 ההקלטות מחכות לכם כאן:</p>
      ${smallTalkNote}

      <p style="text-align:center;margin:28px 0">
        <a href="${DRIVE_LINK}"
           style="background:#1B3054;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block">
          לכל ההקלטות 👈
        </a>
      </p>

      <div style="background:#F4F4F4;border-radius:12px;padding:20px 24px;margin:20px 0;line-height:1.9">
        <p style="margin:0 0 8px"><strong>איך עובדים עם זה:</strong></p>
        <p style="margin:0">בוחרים תיקייה, מקשיבים וחוזרים אחרי בקול. חוזרים על אותה תיקייה עד שהיא מרגישה קלה, ואז עוברים לבאה.</p>
        <p style="margin:8px 0 0">10 דקות, עד שלוש פעמים בשבוע. בקצב שלכם.</p>
      </div>

      <p style="color:#6B7280;font-size:13px">שמרו את המייל הזה: הקישור נמצא כאן והוא שלכם לתמיד.</p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
      <p style="color:#9CA3AF;font-size:12px">Free &amp; Clear English · freeandclearenglish.com</p>
    </div>
  `
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
    console.error('[yalla/complete] Cardcom verify error:', err)
    return NextResponse.json({ error: 'שגיאה בתקשורת מול חברת הסליקה' }, { status: 500 })
  }

  const parts = decodeURIComponent(returnValue || '').split('|')
  if (parts.length < 4 || parts[0] !== 'YALLA') {
    return NextResponse.json({ error: 'פרמטרים שגויים' }, { status: 400 })
  }
  const [, email, name, eventId, bumpFlag] = parts
  const bump = bumpFlag === '1'
  const value = typeof amount === 'number' ? amount : 97
  const currency = 'ILS'

  // Best-effort side effects, never block the buyer's confirmation on one failing.
  const sideEffects: Promise<unknown>[] = [
    transporter.sendMail({
      from: `"Free & Clear English" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'יאללה, לחזור אחרי: הגישה שלכם להקלטות 🎧',
      html: accessEmailHtml(name, bump),
    }),
    // Per-purchase heads-up to Sasha. Kept until the nightly 20:00 summary is
    // built; at that point this is removed so only the Small talk alert remains.
    transporter.sendMail({
      from: `"Free & Clear English" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: `מכירה חדשה: יאללה, לחזור אחרי · ${name}`,
      html: `<div style="font-family:Arial,sans-serif;direction:rtl;text-align:right">
        <h3>רכישה חדשה: יאללה, לחזור אחרי</h3>
        <p><strong>שם:</strong> ${name}</p>
        <p><strong>מייל:</strong> ${email}</p>
        <p><strong>סכום:</strong> ${value} ₪</p>
        ${bump ? '<p><strong>כולל גם:</strong> קורס Small talk 🎓</p>' : ''}
      </div>`,
    }),
    saveBuyer({
      product: PRODUCT_SLUG,
      name,
      email,
      amount: value,
      currency,
      cardcomLowProfile: lowProfileCode,
      eventId,
    }),
  ]

  // Extra actionable alert ONLY when the Small talk course was added, because it
  // needs a manual step (adding the buyer to the RavMesser list).
  if (bump) {
    sideEffects.push(
      transporter.sendMail({
        from: `"Free & Clear English" <${process.env.GMAIL_USER}>`,
        to: process.env.GMAIL_USER,
        subject: `🎓 נמכר Small talk! ${name}`,
        html: `<div style="font-family:Arial,sans-serif;direction:rtl;text-align:right;line-height:1.8;color:#2D2D2D">
          <h3 style="color:#1B3054">רכישת קורס Small talk 🎉</h3>
          <p><strong>שם:</strong> ${name}</p>
          <p><strong>מייל:</strong> ${email}</p>
          <div style="background:#FFFBEE;border:1px dashed #F2B705;border-radius:10px;padding:14px 18px;margin-top:12px">
            <strong>הפעולה שלך:</strong> הוסיפי את <strong>${email}</strong> לרשימה "${SMALL_TALK_LIST}" ברב מסר, וסקולר ישלח לה גישה אוטומטית.
          </div>
        </div>`,
      }),
      saveBuyer({
        product: SMALL_TALK_SLUG,
        name,
        email,
        currency,
        cardcomLowProfile: lowProfileCode,
        eventId,
      }),
    )
  }

  await Promise.allSettled(sideEffects)

  // Count the purchase in Meta (server-side, de-duped with the browser pixel).
  await sendPurchaseEvent({
    email,
    value,
    currency,
    eventId,
    eventSourceUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${PRODUCT_SLUG}/success`,
    clientIp: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || undefined,
    userAgent: req.headers.get('user-agent') || undefined,
  })

  return NextResponse.json({ success: true, name, driveLink: DRIVE_LINK, eventId, value, currency, bump })
}
