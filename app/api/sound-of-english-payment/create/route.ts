import { NextRequest, NextResponse } from 'next/server'
import { saveLead } from '@/lib/save-lead'

// Cardcom checkout for "The Sound of English".
// Mirrors the proven יאללה flow: the price is decided HERE (never in the
// browser), the lead is captured before the redirect, and an eventId is threaded
// through ReturnValue so Meta can de-duplicate the browser + server Purchase.

const PRODUCT_SLUG = 'the-sound-of-english'
const PRICE = 97 // launch price. Anchor shown on the page is 247.
// After the launch (from 26.10.2026): PRICE = 247 and the page anchor becomes 297.
// Order bumps, both at half their normal price (₪187 and ₪167).
const SMALL_TALK_PRICE = 94
const YALLA_PRICE = 84
const TEST_PRICE = 1

export async function POST(req: NextRequest) {
  const { name, email, test, smallTalk, yalla } = await req.json()

  if (!name || !email) {
    return NextResponse.json({ error: 'חסרים פרטים' }, { status: 400 })
  }

  // ₪1 test checkout is gated behind a secret only Sasha knows, because the
  // browser can send any flag it likes: without this, a visitor who read the
  // page's own javascript could buy the course for ₪1. A wrong key is REFUSED
  // rather than silently charged full price, so a test can never bill for real.
  const testKey = process.env.TEST_CHECKOUT_KEY
  const isTest = Boolean(test) && Boolean(testKey) && test === testKey
  if (test && !isTest) {
    return NextResponse.json({ error: 'מצב בדיקה לא תקין' }, { status: 400 })
  }

  // Every price is decided HERE, never in the browser.
  const base = isTest ? TEST_PRICE : PRICE
  const smallTalkPrice = isTest ? TEST_PRICE : SMALL_TALK_PRICE
  const yallaPrice = isTest ? TEST_PRICE : YALLA_PRICE
  const amount = base + (smallTalk ? smallTalkPrice : 0) + (yalla ? yallaPrice : 0)

  // Where Cardcom sends the buyer back. When the checkout was opened from a
  // local dev server we must return THERE, otherwise the buyer is redirected to
  // the live domain and the whole post-payment flow (verify, access email,
  // RavMesser, Supabase, Meta) never runs. That is exactly what happened on the
  // first real test, 2026-09-27: a ₪97 charge went through and no link was sent.
  // req.nextUrl.origin is always present; the Origin header is not guaranteed.
  const origin = req.nextUrl.origin || req.headers.get('origin') || ''
  const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
  const baseUrl =
    (isLocal && origin) ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_BRANCH_URL && `https://${process.env.VERCEL_BRANCH_URL}`) ||
    (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
    ''

  const eventId = `soe_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
  // Fields 5 and 6 flag which order bumps were added.
  const returnValue = `SOE|${email}|${name}|${eventId}|${smallTalk ? '1' : '0'}|${yalla ? '1' : '0'}`
  const rv = encodeURIComponent(returnValue)

  // Anyone who reaches the payment step is saved as a warm contact even if they
  // abandon. Best-effort, never blocks checkout. The ₪1 test flow is skipped so
  // tests do not pollute the lead list.
  if (!isTest) {
    await saveLead({ product: PRODUCT_SLUG, name, email, bump: Boolean(smallTalk || yalla), eventId })
  }

  const body = {
    TerminalNumber: Number(process.env.CARDCOM_TERMINAL),
    ApiName: process.env.CARDCOM_API_NAME,
    Operation: 'ChargeOnly',
    Amount: amount,
    ISOCoinId: 1,
    MaxNumOfPayments: 1,
    Language: 'he',
    SuccessRedirectUrl: `${baseUrl}/the-sound-of-english/success?rv=${rv}`,
    FailedRedirectUrl: `${baseUrl}/the-sound-of-english?error=payment_failed`,
    ReturnValue: returnValue,
    Document: {
      DocumentTypeToCreate: 'TaxInvoiceAndReceipt',
      Name: name,
      Email: email,
      IsSendByEmail: true,
      Language: 'he',
      Products: [
        {
          Description: 'Free & Clear English - The Sound of English (קורס הגייה ומבטא)',
          UnitCost: base,
          Quantity: 1,
        },
        ...(smallTalk
          ? [{ Description: 'Free & Clear English - קורס Small talk קטן עליי', UnitCost: smallTalkPrice, Quantity: 1 }]
          : []),
        ...(yalla
          ? [{ Description: 'Free & Clear English - יאללה, לחזור אחרי (55 הקלטות)', UnitCost: yallaPrice, Quantity: 1 }]
          : []),
      ],
    },
  }

  const res = await fetch('https://secure.cardcom.solutions/api/v11/LowProfile/Create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const data = await res.json()
  const url = data.Url || data.url

  if (!url) {
    return NextResponse.json({ error: 'שגיאה ביצירת דף תשלום', details: data.Description }, { status: 500 })
  }

  return NextResponse.json({ url })
}
