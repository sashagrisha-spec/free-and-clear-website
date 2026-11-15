'use client'

import { useMemo, useState } from 'react'
import SlotPicker, { BODY, INK, YELLOW, dayLabel, timeLabel, useGuestTz } from '../SlotPicker'

type Props = { id: string; t: string; start: string; name: string; meetLink: string }
type Mode = 'menu' | 'cancel' | 'move' | 'message'

const btn = (primary: boolean): React.CSSProperties => ({
  padding: '1rem',
  fontSize: '1.15rem',
  fontWeight: 700,
  borderRadius: 16,
  border: primary ? 'none' : `2px solid ${INK}`,
  backgroundColor: primary ? YELLOW : '#fff',
  color: INK,
  cursor: 'pointer',
  width: '100%',
})

const area: React.CSSProperties = {
  width: '100%',
  minHeight: 120,
  padding: '1rem',
  fontSize: '1.1rem',
  borderRadius: 16,
  border: '2px solid rgba(27,48,84,0.16)',
  color: INK,
  outlineColor: INK,
  fontFamily: 'inherit',
}

export default function ManageWidget({ id, t, start, name, meetLink }: Props) {
  const tz = useGuestTz()
  const [mode, setMode] = useState<Mode>('menu')
  const [current, setCurrent] = useState(start)
  const [slot, setSlot] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const exclude = useMemo(() => ({ id, t }), [id, t])

  async function act(action: 'cancel' | 'reschedule' | 'message') {
    setError('')
    if (action === 'reschedule' && !slot) return setError('בחרו יום ושעה חדשים')
    if (action === 'message' && !message.trim()) return setError('כתבו הודעה')
    setLoading(true)
    try {
      const res = await fetch('/api/meet/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, t, action, start: slot, message, tz }),
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
      if (action === 'cancel') setDone('הפגישה בוטלה.\nתודה שעדכנתם!')
      if (action === 'message') setDone('ההודעה נשלחה לסשה.')
      if (action === 'reschedule') {
        setCurrent(data.start)
        setDone(`הפגישה הועברה ל${dayLabel(data.start, tz).name}, ${dayLabel(data.start, tz).date} בשעה ${timeLabel(data.start, tz)}.\nעדכון נשלח אליכם למייל.`)
      }
    } catch {
      setError('משהו השתבש, נסו שוב')
    } finally {
      setLoading(false)
    }
  }

  const l = dayLabel(current, tz)

  if (done) return <p style={{ fontSize: '1.3rem', color: INK, fontWeight: 600, lineHeight: 1.7, whiteSpace: 'pre-line' }}>{done}</p>

  return (
    <div>
      <p style={{ margin: 0, fontSize: '1.2rem', color: BODY }}>היי {name},</p>
      <p style={{ margin: '0.3rem 0 1.8rem', fontSize: '1.3rem', color: INK, fontWeight: 700 }}>
        {l.name}, {l.date} בשעה {timeLabel(current, tz)}
      </p>

      {mode === 'menu' && (
        <div className="grid gap-3">
          {meetLink && (
            <a href={meetLink} style={{ ...btn(true), display: 'block', textDecoration: 'none' }}>
              הקישור לפגישה
            </a>
          )}
          <button type="button" style={btn(false)} onClick={() => setMode('move')}>שינוי מועד</button>
          <button type="button" style={btn(false)} onClick={() => setMode('message')}>לשלוח הודעה לסשה</button>
          <button type="button" style={btn(false)} onClick={() => setMode('cancel')}>ביטול הפגישה</button>
        </div>
      )}

      {mode === 'move' && (
        <div>
          <SlotPicker tz={tz} selected={slot} onSelect={setSlot} exclude={exclude} reloadKey={reloadKey} />
          <div className="mt-5 grid gap-3">
            <button type="button" disabled={loading} style={btn(true)} onClick={() => act('reschedule')}>
              {loading ? 'מעבירים...' : slot ? `להעביר ל${dayLabel(slot, tz).name} ב-${timeLabel(slot, tz)}` : 'להעביר'}
            </button>
            <button type="button" style={btn(false)} onClick={() => setMode('menu')}>חזרה</button>
          </div>
        </div>
      )}

      {(mode === 'cancel' || mode === 'message') && (
        <div className="grid gap-3">
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder={mode === 'cancel' ? 'רוצים לכתוב משהו? (לא חובה)' : 'מה תרצו לכתוב לסשה?'}
            style={area}
          />
          <button type="button" disabled={loading} style={btn(true)} onClick={() => act(mode === 'cancel' ? 'cancel' : 'message')}>
            {loading ? 'שולחים...' : mode === 'cancel' ? 'לבטל את הפגישה' : 'לשלוח'}
          </button>
          <button type="button" style={btn(false)} onClick={() => setMode('menu')}>חזרה</button>
        </div>
      )}

      {error && <p style={{ color: '#B91C1C', marginTop: '1rem', fontSize: '1.05rem' }}>{error}</p>}
    </div>
  )
}
