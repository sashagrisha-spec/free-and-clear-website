import { NextRequest, NextResponse } from 'next/server'

// Cardcom checkout for the "יאללה, לחזור אחרי" recordings pack.
// Mirrors the proven workshop-payment flow, plus an eventId threaded through
// ReturnValue so Meta can de-duplicate the browser + server Purchase events.

const PRICE = 97
const TEST_PRICE = 1

export async function POST(req: NextRequest) {
  const { name, email, test } = await req.json()

  if (!name || !email) {
    return NextResponse.json({ error: 'חסרים פרטים' }, { status: 400 })
  }

  const amount = test ? TEST_PRICE : PRICE
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!
  const eventId = `yalla_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
  const returnValue = `YALLA|${email}|${name}|${eventId}`
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
