import { NextRequest, NextResponse } from 'next/server'
import { saveLead } from '@/lib/save-lead'
import { COURSE_CODE, COURSE_LABEL, KIT_NAME, KIT_SLUG, kitPrice, parseCourses } from '@/lib/speaking-kit'

// Cardcom checkout for ערכת הדיבור באנגלית (all three courses, or any two).
// Same proven flow as The Sound of English: the price is decided HERE (never in
// the browser), the lead is captured before the redirect, and an eventId is
// threaded through ReturnValue so Meta can de-duplicate the browser + server
// Purchase.

const TEST_PRICE = 1

export async function POST(req: NextRequest) {
  const { name, email, test, courses: rawCourses } = await req.json()

  if (!name || !email) {
    return NextResponse.json({ error: 'חסרים פרטים' }, { status: 400 })
  }
  const courses = parseCourses(rawCourses)
  if (!courses) {
    return NextResponse.json({ error: 'בחרו שלושה קורסים או שניים' }, { status: 400 })
  }

  // ₪1 test checkout is gated behind a secret only Sasha knows. A wrong key is
  // REFUSED rather than silently charged full price.
  const testKey = process.env.TEST_CHECKOUT_KEY
  const isTest = Boolean(test) && Boolean(testKey) && test === testKey
  if (test && !isTest) {
    return NextResponse.json({ error: 'מצב בדיקה לא תקין' }, { status: 400 })
  }

  const amount = isTest ? TEST_PRICE : kitPrice(courses)

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

  const eventId = `kit_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
  const codes = courses.map((c) => COURSE_CODE[c]).join('')
  const returnValue = `KIT|${email}|${name}|${eventId}|${codes}`
  const rv = encodeURIComponent(returnValue)

  if (!isTest) {
    await saveLead({ product: KIT_SLUG, name, email, bump: courses.length === 2, eventId })
  }

  const body = {
    TerminalNumber: Number(process.env.CARDCOM_TERMINAL),
    ApiName: process.env.CARDCOM_API_NAME,
    Operation: 'ChargeOnly',
    Amount: amount,
    ISOCoinId: 1,
    MaxNumOfPayments: 1,
    Language: 'he',
    SuccessRedirectUrl: `${baseUrl}/bundle/success?rv=${rv}`,
    FailedRedirectUrl: `${baseUrl}/bundle?error=payment_failed`,
    ReturnValue: returnValue,
    Document: {
      DocumentTypeToCreate: 'TaxInvoiceAndReceipt',
      Name: name,
      Email: email,
      IsSendByEmail: true,
      Language: 'he',
      // One line for the whole kit, so the invoice always adds up exactly.
      Products: [
        {
          Description: `Free & Clear English - ${KIT_NAME} (${courses.map((c) => COURSE_LABEL[c]).join(' + ')})`,
          UnitCost: amount,
          Quantity: 1,
        },
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
