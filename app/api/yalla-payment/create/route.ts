import { NextRequest, NextResponse } from 'next/server'

// Cardcom checkout for the "יאללה, לחזור אחרי" recordings pack.
// Mirrors the proven workshop-payment flow, plus an eventId threaded through
// ReturnValue so Meta can de-duplicate the browser + server Purchase events.

const PRICE = 97
const BUMP_PRICE = 68
const TEST_PRICE = 1
const TEST_BUMP_PRICE = 1

export async function POST(req: NextRequest) {
  const { name, email, test, bump } = await req.json()

  if (!name || !email) {
    return NextResponse.json({ error: 'חסרים פרטים' }, { status: 400 })
  }

  const basePrice = test ? TEST_PRICE : PRICE
  const bumpPrice = test ? TEST_BUMP_PRICE : BUMP_PRICE
  const amount = basePrice + (bump ? bumpPrice : 0)
  // Production sets NEXT_PUBLIC_BASE_URL, so live behavior is unchanged. On a
  // Vercel preview (where it isn't set) fall back to the deployment's own URL so
  // Cardcom redirects back to the same preview for end-to-end testing.
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_BRANCH_URL && `https://${process.env.VERCEL_BRANCH_URL}`) ||
    (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
    ''
  const eventId = `yalla_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
  // 5th field flags whether the Small talk order bump was added.
  const returnValue = `YALLA|${email}|${name}|${eventId}|${bump ? '1' : '0'}`
  const rv = encodeURIComponent(returnValue)

  const body = {
    TerminalNumber: Number(process.env.CARDCOM_TERMINAL),
    ApiName: process.env.CARDCOM_API_NAME,
    Operation: 'ChargeOnly',
    Amount: amount,
    ISOCoinId: 1,
    MaxNumOfPayments: 1,
    Language: 'he',
    SuccessRedirectUrl: `${baseUrl}/yalla-lachzor-acharei/success?rv=${rv}`,
    FailedRedirectUrl: `${baseUrl}/yalla-lachzor-acharei?error=payment_failed`,
    ReturnValue: returnValue,
    Document: {
      DocumentTypeToCreate: 'TaxInvoiceAndReceipt',
      Name: name,
      Email: email,
      IsSendByEmail: true,
      Language: 'he',
      Products: [
        {
          Description: 'Free & Clear English - יאללה, לחזור אחרי (55 הקלטות)',
          UnitCost: basePrice,
          Quantity: 1,
        },
        ...(bump
          ? [{
              Description: 'Free & Clear English - קורס Small talk קטן עליי',
              UnitCost: bumpPrice,
              Quantity: 1,
            }]
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
