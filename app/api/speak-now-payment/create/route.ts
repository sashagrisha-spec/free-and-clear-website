import { NextRequest, NextResponse } from 'next/server'
import { saveLead } from '@/lib/save-lead'
import { ADDON_CODE, ADDON_LABEL, ADDON_PRICE, SN_NAME, SN_PRICE, SN_SLUG, parseAddons, snTotal } from '@/lib/speak-now'

// Cardcom checkout for דברו בשטף וביטחון + optional half-price add-ons.
// Same proven flow as /bundle: the price is decided HERE (never in the browser),
// the lead is captured before the redirect, and an eventId is threaded through
// ReturnValue so Meta can de-duplicate the browser + server Purchase.

const TEST_PRICE = 1

export async function POST(req: NextRequest) {
  const { name, email, test, addons: rawAddons } = await req.json()

  if (!name || !email) {
    return NextResponse.json({ error: 'חסרים פרטים' }, { status: 400 })
  }
  const addons = parseAddons(rawAddons)
  if (!addons) {
    return NextResponse.json({ error: 'פרמטרים שגויים' }, { status: 400 })
  }

  // ₪1 test checkout is gated behind a secret only Sasha knows. A wrong key is
  // REFUSED rather than silently charged full price.
  const testKey = process.env.TEST_CHECKOUT_KEY
  const isTest = Boolean(test) && Boolean(testKey) && test === testKey
  if (test && !isTest) {
    return NextResponse.json({ error: 'מצב בדיקה לא תקין' }, { status: 400 })
  }

  const amount = isTest ? TEST_PRICE : snTotal(addons)

  // Return to a local dev server when the checkout was opened from one, or the
  // whole post-payment flow would run on the live domain instead.
  const origin = req.nextUrl.origin || req.headers.get('origin') || ''
  const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
  const baseUrl =
    (isLocal && origin) ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_BRANCH_URL && `https://${process.env.VERCEL_BRANCH_URL}`) ||
    (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
    ''

  const eventId = `sn_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
  const codes = addons.map((a) => ADDON_CODE[a]).join('') || '-'
  const returnValue = `SN|${email}|${name}|${eventId}|${codes}`
  const rv = encodeURIComponent(returnValue)

  if (!isTest) {
    await saveLead({ product: SN_SLUG, name, email, bump: addons.length > 0, eventId })
  }

  // One invoice line per item. In test mode a single ₪1 line, so it adds up.
  const products = isTest
    ? [{ Description: `Free & Clear English - ${SN_NAME} (בדיקה)`, UnitCost: amount, Quantity: 1 }]
    : [
        { Description: `Free & Clear English - ${SN_NAME}`, UnitCost: SN_PRICE, Quantity: 1 },
        ...addons.map((a) => ({ Description: `Free & Clear English - ${ADDON_LABEL[a]}`, UnitCost: ADDON_PRICE[a], Quantity: 1 })),
      ]

  const body = {
    TerminalNumber: Number(process.env.CARDCOM_TERMINAL),
    ApiName: process.env.CARDCOM_API_NAME,
    Operation: 'ChargeOnly',
    Amount: amount,
    ISOCoinId: 1,
    MaxNumOfPayments: 1,
    Language: 'he',
    SuccessRedirectUrl: `${baseUrl}/speak-now/success?rv=${rv}`,
    FailedRedirectUrl: `${baseUrl}/speak-now?error=payment_failed`,
    ReturnValue: returnValue,
    Document: {
      DocumentTypeToCreate: 'TaxInvoiceAndReceipt',
      Name: name,
      Email: email,
      IsSendByEmail: true,
      Language: 'he',
      Products: products,
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
