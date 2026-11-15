'use client'

import { useState } from 'react'
import SlotPicker, { BODY, INK, YELLOW, dayLabel, timeLabel, useGuestTz } from './SlotPicker'

export const fieldStyle: React.CSSProperties = {
  padding: '1rem 1.2rem',
  fontSize: '1.12rem',
  textAlign: 'center',
  border: '2px solid rgba(27,48,84,0.16)',
  backgroundColor: '#fff',
  color: INK,
  outlineColor: INK,
}

export default function BookingWidget() {
  const tz = useGuestTz()
  const [slot, setSlot] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [website, setWebsite] = useState('') // honeypot
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState<string>('')
  const [reloadKey, setReloadKey] = useState(0)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!slot) return setError('בחרו יום ושעה')
    setLoading(true)
    try {
      const res = await fetch('/api/meet/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, start: slot, website, tz }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'משהו השתבש, נסו שוב')
        if (data.taken) {
          setSlot('')
          setReloadKey(k => k + 1)
        }
        return
      }
      setDone(slot)
    } catch {
      setError('משהו השתבש, נסו שוב')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    const l = dayLabel(done, tz)
    return (
      <div className="mx-auto text-center" style={{ maxWidth: 520 }}>
        <div
          className="mx-auto flex items-center justify-center rounded-full"
          style={{ width: 82, height: 82, backgroundColor: 'rgba(22,163,74,0.12)', color: '#16A34A', fontSize: '2.4rem' }}
        >
          ✓
        </div>
        <p style={{ margin: '1.4rem auto 0.6rem', fontSize: '1.7rem', fontWeight: 700, color: INK }}>נקבע!</p>
        <p style={{ margin: 0, fontSize: '1.25rem', color: INK, fontWeight: 600 }}>
          {l.name}, {l.date} בשעה {timeLabel(done, tz)}
        </p>
        <p style={{ margin: '1rem 0 0', fontSize: '1.15rem', color: BODY, lineHeight: 1.7 }}>
          הזמנה ליומן עם קישור לפגישה נשלחה אליכם למייל.
          <br />
          ביום השיחה תגיע תזכורת בבוקר ועוד אחת שעה לפני.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="mx-auto" style={{ maxWidth: 520 }}>
      <SlotPicker tz={tz} selected={slot} onSelect={setSlot} reloadKey={reloadKey} />

      <div className="mt-8">
        <input type="text" autoComplete="name" value={name} onChange={e => setName(e.target.value)} placeholder="שם מלא" required className="w-full rounded-2xl" style={fieldStyle} />
        <input type="email" inputMode="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="מייל" required className="mt-3 w-full rounded-2xl" style={fieldStyle} />
        <input type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="טלפון" required className="mt-3 w-full rounded-2xl" style={fieldStyle} />
        <input
          type="text"
          name="website"
          value={website}
          onChange={e => setWebsite(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
        />
      </div>

      {error && <p style={{ textAlign: 'center', color: '#B91C1C', marginTop: '1rem', fontSize: '1.05rem' }}>{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-5 w-full rounded-2xl transition"
        style={{ padding: '1.05rem', fontSize: '1.25rem', fontWeight: 700, backgroundColor: YELLOW, color: INK, border: 'none', cursor: 'pointer', opacity: loading ? 0.6 : 1 }}
      >
        {loading ? 'קובעים...' : slot ? `לקבוע ל${dayLabel(slot, tz).name} ב-${timeLabel(slot, tz)}` : 'לקבוע שיחה'}
      </button>
    </form>
  )
}
