import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  const { name, email, message } = await request.json()

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  await resend.emails.send({
    from: 'Free & Clear English <sasha@freeandclearenglish.com>',
    to: 'sasha@freeandclearenglish.com',
    subject: `New message from ${name}`,
    html: `
      <h2>New contact form submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `,
    replyTo: email,
  })

  return NextResponse.json({ success: true })
}
