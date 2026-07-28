import nodemailer from 'nodemailer'
import { NextRequest, NextResponse } from 'next/server'

// Nightly sales summary for "יאללה, לחזור אחרי". Vercel Cron hits this at
// 03:00 UTC (~06:00 Israel time) and it reports the PREVIOUS Israel-day's sales
// to Sasha: how many purchases and how much revenue. People buy at night, so
// summarizing the finished day the next morning is the honest number.

export const dynamic = 'force-dynamic'

const SUMMARY_TO = 'sasha@freeandclearenglish.com'

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

  // Read via a SECURITY DEFINER function (yalla_sales_summary) so RLS on
  // product_buyers doesn't block the anon key from reading. It returns only
  // aggregates (count/revenue), never customer PII. Excludes ₪1/₪2 tests.
  let count: number, revenue: number, withBump: number
  try {
    const res = await fetch(`${url}/rest/v1/rpc/yalla_sales_summary`, {
      method: 'POST',
      headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ target_date: yesterday }),
    })
    const data = await res.json()
    const row = Array.isArray(data) ? data[0] : data
    if (!row || typeof row.cnt === 'undefined') {
      console.error('[daily-summary] unexpected rpc response:', JSON.stringify(data).slice(0, 200))
      return NextResponse.json({ error: 'summary query failed' }, { status: 500 })
    }
    count = Number(row.cnt) || 0
    revenue = Number(row.revenue) || 0
    withBump = Number(row.with_bump) || 0
  } catch (err) {
    console.error('[daily-summary] supabase rpc error:', err)
    return NextResponse.json({ error: 'fetch failed' }, { status: 500 })
  }

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
