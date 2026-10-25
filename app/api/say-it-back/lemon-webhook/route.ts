import crypto from 'crypto'
import nodemailer from 'nodemailer'
import { NextRequest, NextResponse } from 'next/server'
import { sendPurchaseEvent } from '@/lib/meta-capi'
import { saveBuyer } from '@/lib/save-buyer'

// Lemon Squeezy calls this after every order (webhook event "order_created").
// The request is signed with LEMON_WEBHOOK_SECRET, so nothing happens unless
// the call really came from Lemon Squeezy. For a paid Say It Back order:
//   1. record the buyer in Supabase (also the guard against Lemon's retries:
//      a second call for the same order is a 'duplicate' and sends nothing),
//   2. email the buyer the welcome email with the listening link,
//   3. report the Purchase to Meta from the server, so it counts even when the
//      buyer closes the Lemon window without clicking through.
// Test-mode orders get the email (so checkout can be tested) but are NOT sent
// to Meta, so test purchases never pollute the ad data.

const PRODUCT_SLUG = 'say-it-back'
const PRODUCT_NAME = 'Say It Back'
const SITE = 'https://www.freeandclearenglish.com'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.GMAIL_USER!, pass: process.env.GMAIL_APP_PASSWORD! },
})

function validSignature(raw: string, signature: string | null): boolean {
  const secret = process.env.LEMON_WEBHOOK_SECRET
  if (!secret || !signature) return false
  const expected = crypto.createHmac('sha256', secret).update(raw).digest('hex')
  const a = Buffer.from(expected)
  const b = Buffer.from(signature)
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
}

function welcomeEmailHtml(firstName: string, listenUrl: string): string {
  const hi = firstName ? `Hi ${escapeHtml(firstName)},` : 'Hi,'
  const p = 'margin:0 0 14px;font-size:16px;line-height:1.7'
  return `
    <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;color:#2D2D2D">
      <p style="${p}">${hi}</p>
      <p style="${p}">Welcome to Say It Back! I'm so happy you're here.</p>
      <p style="${p}">All 56 recordings are waiting for you:</p>
      <p style="text-align:center;margin:28px 0">
        <a href="${listenUrl}"
           style="background:#F5C842;color:#1B3054;padding:15px 36px;border-radius:999px;text-decoration:none;font-weight:bold;font-size:17px;display:inline-block">
          Start listening
        </a>
      </p>
      <p style="${p}"><strong>How it works:</strong><br/>
        Press play, listen, and say it back out loud, right after me.<br/>
        10 minutes, up to 3 times a week. No big goals.<br/>
        Start with Week 1 and go one week at a time.</p>
      <p style="${p}">Under every week you'll find the written sentences, so you can read along while you listen.<br/>
        The page remembers where you stopped on the same phone or computer, so you can always pick up where you left off.</p>
      <p style="${p}">Save this email so your link is always close.</p>
      <p style="${p}">Any questions? Just reply to this email.</p>
      <p style="margin:24px 0 0;font-size:16px;line-height:1.7">Say it back!<br/>Sasha<br/>Free &amp; Clear English</p>
    </div>
  `
}

function welcomeEmailText(firstName: string, listenUrl: string): string {
  return [
    firstName ? `Hi ${firstName},` : 'Hi,',
    '',
    "Welcome to Say It Back! I'm so happy you're here.",
    '',
    'All 56 recordings are waiting for you:',
    listenUrl,
    '',
    'How it works:',
    'Press play, listen, and say it back out loud, right after me.',
    '10 minutes, up to 3 times a week. No big goals.',
    'Start with Week 1 and go one week at a time.',
    '',
    "Under every week you'll find the written sentences, so you can read along while you listen.",
    'The page remembers where you stopped on the same phone or computer, so you can always pick up where you left off.',
    '',
    'Save this email so your link is always close.',
    '',
    'Any questions? Just reply to this email.',
    '',
    'Say it back!',
    'Sasha',
    'Free & Clear English',
  ].join('\n')
}

type LemonOrder = {
  meta?: { event_name?: string; test_mode?: boolean }
  data?: {
    id?: string
    attributes?: {
      status?: string
      user_email?: string
      user_name?: string
      total?: number
      currency?: string
      first_order_item?: { product_name?: string }
    }
  }
}

export async function POST(req: NextRequest) {
  const raw = await req.text()
  if (!validSignature(raw, req.headers.get('x-signature'))) {
    return NextResponse.json({ error: 'invalid signature' }, { status: 401 })
  }

  let body: LemonOrder
  try {
    body = JSON.parse(raw)
  } catch {
    return NextResponse.json({ error: 'bad json' }, { status: 400 })
  }

  const a = body.data?.attributes
  const orderId = body.data?.id
  // Anything that isn't a paid Say It Back order is acknowledged and ignored,
  // so Lemon doesn't keep retrying it.
  if (
    body.meta?.event_name !== 'order_created' ||
    a?.status !== 'paid' ||
    a?.first_order_item?.product_name !== PRODUCT_NAME ||
    !a?.user_email ||
    !orderId
  ) {
    return NextResponse.json({ ignored: true })
  }

  const testMode = body.meta?.test_mode === true
  const email = a.user_email
  const name = (a.user_name || '').trim()
  const firstName = name.split(/\s+/)[0] || ''
  const value = typeof a.total === 'number' ? a.total / 100 : 27
  const currency = (a.currency || 'EUR').toUpperCase()
  const eventId = `sib-${orderId}`

  // Claim the order: only the first delivery of this webhook gets 'inserted'.
  const claim = await saveBuyer({
    product: testMode ? `${PRODUCT_SLUG}-test` : PRODUCT_SLUG,
    name,
    email,
    amount: value,
    currency,
    cardcomLowProfile: `lemon-${orderId}`, // the table's unique per-transaction key
    eventId,
  })
  if (claim === 'duplicate') return NextResponse.json({ duplicate: true })

  const key = process.env.SAY_IT_BACK_ACCESS_KEY
  if (!key) {
    console.error('[say-it-back/webhook] SAY_IT_BACK_ACCESS_KEY not set')
    return NextResponse.json({ error: 'not configured' }, { status: 500 })
  }
  const listenUrl = `${SITE}/say-it-back/listen?k=${encodeURIComponent(key)}`

  try {
    await transporter.sendMail({
      from: `"Sasha from Free & Clear English" <${process.env.GMAIL_USER}>`,
      replyTo: 'sasha@freeandclearenglish.com',
      to: email,
      subject: 'Your Say It Back recordings are here 🎧',
      html: welcomeEmailHtml(firstName, listenUrl),
      text: welcomeEmailText(firstName, listenUrl),
    })
  } catch (err) {
    // The buyer still has the link in the Lemon receipt, but Sasha must know.
    console.error('[say-it-back/webhook] welcome email failed:', err)
    await transporter
      .sendMail({
        from: `"Free & Clear English" <${process.env.GMAIL_USER}>`,
        to: 'sasha@freeandclearenglish.com',
        subject: `⚠️ Say It Back: welcome email failed for ${email}`,
        text: `Order ${orderId} (${testMode ? 'TEST' : 'live'}). The buyer has the link in the Lemon receipt. Listening link:\n${listenUrl}`,
      })
      .catch(() => {})
  }

  if (claim === 'error') {
    await transporter
      .sendMail({
        from: `"Free & Clear English" <${process.env.GMAIL_USER}>`,
        to: 'sasha@freeandclearenglish.com',
        subject: `⚠️ Say It Back purchase not saved in Supabase: ${email}`,
        text: `Order ${orderId} (${testMode ? 'TEST' : 'live'}), ${name}, ${email}, ${value} ${currency}. The buyer was emailed; save this record by hand.`,
      })
      .catch(() => {})
  }

  if (!testMode) {
    await sendPurchaseEvent({ email, value, currency, eventId, eventSourceUrl: `${SITE}/say-it-back` })
  }

  return NextResponse.json({ ok: true })
}
