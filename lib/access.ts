import crypto from 'crypto'

// Stateless course access: after payment we email the buyer a link containing
// their email + an HMAC signature. The gated lessons page re-computes the
// signature and only grants access if it matches. No database, no passwords.
//
// The secret must be set in env (COURSE_ACCESS_SECRET). Never expose it client-side.

function secret(): string {
  const s = process.env.COURSE_ACCESS_SECRET
  if (!s) throw new Error('COURSE_ACCESS_SECRET is not set')
  return s
}

// Sign grants access to a specific course for a specific email.
export function signAccess(courseId: string, email: string): string {
  const payload = `${courseId}:${email.trim().toLowerCase()}`
  return crypto.createHmac('sha256', secret()).update(payload).digest('hex')
}

export function verifyAccess(courseId: string, email: string, token: string): boolean {
  if (!email || !token) return false
  const expected = signAccess(courseId, email)
  // constant-time compare to avoid timing leaks
  const a = Buffer.from(expected)
  const b = Buffer.from(token)
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(a, b)
}

export function accessUrl(baseUrl: string, courseSlug: string, email: string): string {
  const token = signAccess(courseSlug, email)
  const params = new URLSearchParams({ e: email.trim().toLowerCase(), t: token })
  return `${baseUrl}/courses/${courseSlug}/lessons?${params.toString()}`
}
