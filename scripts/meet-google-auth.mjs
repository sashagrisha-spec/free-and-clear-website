// One-time: connect the /meet booking page to Sasha's business Google Calendar.
//
//   node scripts/meet-google-auth.mjs <path-to-client_secret.json> <output.json>
//
// Opens Google's approval window in the browser (sign in as
// sasha@freeandclearenglish.com), then writes client id, client secret and the
// refresh token to <output.json>. Nothing is printed, nothing is committed.
import http from 'node:http'
import { readFileSync, writeFileSync } from 'node:fs'
import { exec } from 'node:child_process'

const [clientPath, outPath] = process.argv.slice(2)
if (!clientPath || !outPath) {
  console.error('usage: node scripts/meet-google-auth.mjs <client_secret.json> <output.json>')
  process.exit(1)
}
const raw = JSON.parse(readFileSync(clientPath, 'utf8'))
const c = raw.installed || raw.web
const SCOPE = 'https://www.googleapis.com/auth/calendar.events'

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1')
  const code = url.searchParams.get('code')
  if (!code) {
    res.end('No code')
    return
  }
  const redirect = `http://127.0.0.1:${server.address().port}`
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ code, client_id: c.client_id, client_secret: c.client_secret, redirect_uri: redirect, grant_type: 'authorization_code' }),
  })
  const data = await r.json()
  if (!data.refresh_token) {
    res.end('Failed: ' + JSON.stringify(data))
    console.error('Failed', data.error, data.error_description)
    process.exit(1)
  }
  writeFileSync(outPath, JSON.stringify({ GOOGLE_CLIENT_ID: c.client_id, GOOGLE_CLIENT_SECRET: c.client_secret, GOOGLE_REFRESH_TOKEN: data.refresh_token }, null, 2), { mode: 0o600 })
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
  res.end('<div dir="rtl" style="font-family:sans-serif;text-align:center;margin-top:80px;font-size:24px">החיבור הצליח ✓ אפשר לסגור את החלון</div>')
  console.log('OK, saved to', outPath)
  server.close()
})

server.listen(0, '127.0.0.1', () => {
  const redirect = `http://127.0.0.1:${server.address().port}`
  const auth = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  auth.search = new URLSearchParams({
    client_id: c.client_id,
    redirect_uri: redirect,
    response_type: 'code',
    scope: SCOPE,
    access_type: 'offline',
    prompt: 'consent',
    login_hint: 'sasha@freeandclearenglish.com',
  }).toString()
  console.log('Opening:', auth.toString())
  exec(`open "${auth.toString()}"`)
})
