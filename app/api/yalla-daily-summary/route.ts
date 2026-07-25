import nodemailer from 'nodemailer'
import { NextRequest, NextResponse } from 'next/server'

// Nightly sales summary for "יאללה, לחזור אחרי". Vercel Cron hits this at
// 03:00 UTC (~06:00 Israel time) and it reports the PREVIOUS Israel-day's sales
// to Sasha: how many purchases and how much revenue. People buy at night, so
// summarizing the finished day the next morning is the honest number.

export const dynamic = 'force-dynamic'

const SUMMARY_TO = 'sasha@freeandclearenglish.com'
const PRODUCT_SLUG = 'yalla-lachzor-acharei'
const REAL_MIN = 90 // exclude ₪1/₪2 test purchases
const BUMP_MIN = 150 // a sale that included the Small talk bump (97 + 68 = 165)

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.GMAIL_USER!, pass: process.env.GMAIL_APP_PASSWORD! },
})

const ils = (n: number) => `₪${n.toLocaleString('he-IL')}`

// Calendar date (YYYY-MM-DD) of an instant, in Israel time. DST-safe via Intl.
function jerusalemDate(d: Date): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jerusalem' }).format(d)
}

export async function GET(req: NextRequest) {
  // Vercel Cron sends "Authorization: Bearer <CRON_SECRET>" when CRON_SECRET is set.
  const secret = process.env.CRON_SECRET
  if (secret && req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_ANON_KEY
  if (!url || !key) {
    return NextResponse.json({ error: 'supabase not configured' }, { status: 500 })
  }

  const yesterday = jerusalemDate(new Date(Date.now() - 24 * 3600 * 1000))
  const cutoff = new Date(Date.now() - 48 * 3600 * 1000).toISOString()

  let rows: Array<{ amount: number | null; created_at: string }> = []
  try {
    const res = await fetch(
      `${url}/rest/v1/product_buyers?product=eq.${PRODUCT_SLUG}&created_at=gte.${encodeURIComponent(cutoff)}&select=amount,created_at`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` } },
    )
    const data = await res.json()
    if (Array.isArray(data)) rows = data
  } catch (err) {
    console.error('[daily-summary] supabase fetch error:', err)
    return NextResponse.json({ error: 'fetch failed' }, { status: 500 })
  }

  const day = rows.filter(
    r => jerusalemDate(new Date(r.created_at)) === yesterday && Number(r.amount) >= REAL_MIN,
  )
  const count = day.length
  const revenue = day.reduce((s, r) => s + Number(r.amount || 0), 0)
  const withBump = day.filter(r => Number(r.amount) >= BUMP_MIN).length

  const [yy, mm, dd] = yesterday.split('-')
  const dateHe = `${dd}/${mm}/${yy}`

  const html =
    count === 0
      ? `<div style="font-family:Arial,sans-serif;direction:rtl;text-align:right;color:#2D2D2D">
          <h2 style="color:#1B3054">סיכום ${dateHe}</h2>
          <p style="font-size:16px">לא היו רכישות אתמול של "יאללה, לחזור אחרי".</p>
        </div>`
      : `<div style="font-family:Arial,sans-serif;direction:rtl;text-align:right;color:#2D2D2D;line-height:1.8">
          <h2 style="color:#1B3054">סיכום מכירות ${dateHe} 🎧</h2>
          <p style="font-size:20px"><strong>${count}</strong> רכישות · <strong>${ils(revenue)}</strong></p>
          ${withBump ? `<p style="font-size:16px">מתוכן <strong>${withBump}</strong> כללו גם את קורס Small talk 🎓</p>` : ''}
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0"/>
          <p style="color:#9CA3AF;font-size:12px">Free &amp; Clear English</p>
        </div>`

  try {
    await transporter.sendMail({
      from: `"Free & Clear English" <${process.env.GMAIL_USER}>`,
      to: SUMMARY_TO,
      subject:
        count === 0
          ? `סיכום ${dateHe}: אין רכישות`
          : `סיכום מכירות ${dateHe}: ${count} רכישות · ${ils(revenue)}`,
      html,
    })
  } catch (err) {
    console.error('[daily-summary] email error:', err)
    return NextResponse.json({ error: 'email failed' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, date: yesterday, count, revenue, withBump })
}
