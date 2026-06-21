import nodemailer from 'nodemailer'
import { NextRequest, NextResponse } from 'next/server'

const ZOOM_LINK = 'https://us06web.zoom.us/j/89889474454?pwd=xUDaECgoPyyeIlE70drTtl8c1uqkZZ.1'

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

async function sendNotificationToSasha(email: string, name: string) {
  await transporter.sendMail({
    from: `"Free & Clear English" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER,
    subject: `נרשמ/ת לסדנה: ${name}`,
    html: `
      <div style="font-family:Arial,sans-serif;direction:rtl;text-align:right">
        <h3>נרשמ/ת חדש/ה לסדנה Speak Like Yourself</h3>
        <p><strong>שם:</strong> ${name}</p>
        <p><strong>מייל:</strong> ${email}</p>
        <p><strong>תאריך:</strong> 29.6.2025 | 20:00</p>
      </div>
    `,
  })
}

async function sendConfirmationEmail(email: string, name: string) {
  await transporter.sendMail({
    from: `"Free & Clear English" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'אתם רשומים! Speak Like Yourself — כל הפרטים',
    html: `
      <div style="font-family:Arial,sans-serif;direction:rtl;text-align:right;max-width:520px;margin:0 auto;color:#2D2D2D">
        <h2 style="color:#1B3054">היי ${name}!</h2>
        <p style="font-size:16px">אתם רשומים לסדנה. הנה כל מה שצריך:</p>

        <div style="background:#F4F4F4;border-radius:12px;padding:20px 24px;margin:20px 0;line-height:2">
          <p style="margin:0"><strong>סדנה:</strong> Speak Like Yourself</p>
          <p style="margin:0"><strong>תאריך:</strong> יום שני, 29 ביוני 2025</p>
          <p style="margin:0"><strong>שעה:</strong> 20:00 שעון ישראל</p>
          <p style="margin:0"><strong>מיקום:</strong> זום</p>
        </div>

        <p style="text-align:center;margin:28px 0">
          <a
            href="${ZOOM_LINK}"
            style="background:#1B3054;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block"
          >
            כניסה לזום
          </a>
        </p>

        <p style="color:#6B7280;font-size:13px">
          שמרו את המייל הזה — הלינק נמצא כאן
        </p>

        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
        <p style="color:#9CA3AF;font-size:12px">Free & Clear English · freeandclearenglish.com</p>
      </div>
    `,
  })
}

export async function POST(req: NextRequest) {
  const { returnValue, lowProfileCode } = await req.json()

  try {
    const verifyData = await verifyCardcom(lowProfileCode)
    if (verifyData.ResponseCode !== 0 || verifyData.TranzactionInfo?.ResponseCode !== 0) {
      return NextResponse.json({ error: 'התשלום לא אושר מול חברת האשראי' }, { status: 400 })
    }
  } catch (err) {
    console.error('[workshop/complete] Cardcom verify error:', err)
    return NextResponse.json({ error: 'שגיאה בתקשורת מול חברת הסליקה' }, { status: 500 })
  }

  const parts = decodeURIComponent(returnValue).split('|')
  if (parts.length < 3 || parts[0] !== 'WORKSHOP') {
    return NextResponse.json({ error: 'פרמטרים שגויים' }, { status: 400 })
  }

  const [, email, name] = parts

  try {
    await Promise.all([
      sendConfirmationEmail(email, name),
      sendNotificationToSasha(email, name),
    ])
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[workshop/complete] Email error:', err)
    return NextResponse.json({ error: 'שגיאה בשליחת מייל' }, { status: 500 })
  }
}
