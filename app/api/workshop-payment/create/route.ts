import { NextRequest, NextResponse } from 'next/server'

const VARIANTS = {
  community: { amount: 127, successPath: '/speak-like-yourself/success' },
  followers: { amount: 147, successPath: '/speak-like-yourself-ig/success' },
}

const TEST_AMOUNT = 1

export async function POST(req: NextRequest) {
  const { name, email, variant = 'community', test } = await req.json()

  if (!name || !email) {
    return NextResponse.json({ error: 'חסרים פרטים' }, { status: 400 })
  }

  const config = VARIANTS[variant as keyof typeof VARIANTS] ?? VARIANTS.community
  const amount = test ? TEST_AMOUNT : config.amount
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!
  const returnValue = encodeURIComponent(`WORKSHOP|${email}|${name}`)

  const body = {
    TerminalNumber: Number(process.env.CARDCOM_TERMINAL),
    ApiName: process.env.CARDCOM_API_NAME,
    Operation: 'ChargeOnly',
    Amount: amount,
    ISOCoinId: 1,
    MaxNumOfPayments: 1,
    Language: 'he',
    SuccessRedirectUrl: `${baseUrl}${config.successPath}?rv=${returnValue}`,
    FailedRedirectUrl: `${baseUrl}/speak-like-yourself?error=payment_failed`,
    ReturnValue: returnValue,
    Document: {
      DocumentTypeToCreate: 'TaxInvoiceAndReceipt',
      Name: name,
      Email: email,
      IsSendByEmail: true,
      Language: 'he',
      Products: [
        {
          Description: 'Free & Clear English - Speak Like Yourself Workshop',
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
