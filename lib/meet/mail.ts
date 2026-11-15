import nodemailer from 'nodemailer'
import { MEET, siteUrl } from './config'
import { israelDayLabel, israelTime } from './time'
import { signEventId } from './token'

// Same Gmail SMTP the rest of the site already sends with.
function transporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    // Own app password (created 2026-11-15), so the booking emails do not depend on the older one.
    auth: { user: process.env.GMAIL_USER, pass: process.env.MEET_GMAIL_APP_PASSWORD || process.env.GMAIL_APP_PASSWORD },
  })
}

const FROM = () => `"סשה דניאל | Free & Clear English" <${process.env.GMAIL_USER}>`

export function manageUrl(eventId: string): string {
  return `${siteUrl()}/meet/manage?id=${encodeURIComponent(eventId)}&t=${signEventId(eventId)}`
}

function esc(s: string): string {
  return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string)
}

function wrap(lines: string[], buttons: { href: string; label: string; primary?: boolean }[]): string {
  const body = lines.map(l => `<p style="margin:0 0 10px;font-size:17px;line-height:1.6;color:#1B3054">${l}</p>`).join('')
  const btns = buttons
    .map(
      b =>
        `<a href="${b.href}" style="display:inline-block;margin:6px;padding:12px 26px;border-radius:12px;font-size:16px;font-weight:700;text-decoration:none;${
          b.primary ? 'background:#F5C842;color:#1B3054' : 'background:#ffffff;color:#1B3054;border:2px solid #1B3054'
        }">${b.label}</a>`,
    )
    .join('')
  return `<div dir="rtl" style="font-family:Arial,Helvetica,sans-serif;text-align:center;max-width:520px;margin:0 auto;padding:24px">${body}<div style="margin-top:18px">${btns}</div></div>`
}

export type Booking = { id: string; name: string; email: string; phone: string; start: Date; meetLink?: string; tz: string }

// Guest emails show the guest's own time; Sasha's notices show Israel time.
function when(b: Booking, tz: string = MEET.timeZone) {
  return `${israelDayLabel(b.start, tz)} בשעה ${israelTime(b.start, tz)}`
}

export async function sendGuestConfirmation(b: Booking) {
  const lines = [
    `היי ${esc(b.name)},`,
    `השיחה שלנו נקבעה ל${when(b, b.tz)}.`,
    `הזמנה ליומן נשלחה אליכם במייל נפרד מ-Google.`,
    `ביום השיחה תגיע תזכורת בבוקר ועוד אחת שעה לפני.`,
    `מחכה לשיחה,<br>סשה`,
  ]
  const buttons = [
    ...(b.meetLink ? [{ href: b.meetLink, label: 'הקישור לפגישה', primary: true }] : []),
    { href: manageUrl(b.id), label: 'ביטול או שינוי מועד' },
  ]
  await transporter().sendMail({
    from: FROM(),
    to: b.email,
    subject: `השיחה שלנו נקבעה: ${when(b, b.tz)}`,
    html: wrap(lines, buttons),
  })
}

export async function sendGuestReminder(b: Booking, kind: 'morning' | 'hour') {
  const lines =
    kind === 'morning'
      ? [`היי ${esc(b.name)},`, `תזכורת: היום בשעה ${israelTime(b.start, b.tz)} יש לנו שיחה.`, `לא יכולים להגיע? אפשר לבטל, לשנות מועד או לכתוב לי בלחיצה למטה.`]
      : [`היי ${esc(b.name)},`, `עוד שעה, בשעה ${israelTime(b.start, b.tz)}, אנחנו נפגשים.`, `לא מסתדר? אפשר לבטל, לשנות מועד או לכתוב לי בלחיצה למטה.`]
  const buttons = [
    ...(b.meetLink ? [{ href: b.meetLink, label: 'הקישור לפגישה', primary: true }] : []),
    { href: manageUrl(b.id), label: 'לא יכולים להגיע?' },
  ]
  await transporter().sendMail({
    from: FROM(),
    to: b.email,
    subject: kind === 'morning' ? `תזכורת: השיחה שלנו היום ב-${israelTime(b.start, b.tz)}` : `עוד שעה: השיחה שלנו ב-${israelTime(b.start, b.tz)}`,
    html: wrap(lines, buttons),
  })
}

// Notices to Sasha. Plain and short, so they read well on the phone.
export async function notifySasha(kind: 'booked' | 'cancelled' | 'moved' | 'message', b: Booking, extra = '') {
  const titles = {
    booked: 'שיחת היכרות חדשה נקבעה',
    cancelled: 'שיחת היכרות בוטלה',
    moved: 'שיחת היכרות הועברה',
    message: 'הודעה משיחת היכרות',
  }
  const lines = [
    `<strong>${titles[kind]}</strong>`,
    `${when(b)}`,
    `שם: ${esc(b.name)}`,
    `מייל: ${esc(b.email)}`,
    `טלפון: ${esc(b.phone)}`,
    ...(extra ? [`<br>${esc(extra).replace(/\n/g, '<br>')}`] : []),
  ]
  await transporter().sendMail({
    from: FROM(),
    to: MEET.notifyEmail,
    replyTo: b.email,
    subject: `${titles[kind]}: ${b.name}, ${when(b)}`,
    html: wrap(lines, []),
  })
}
