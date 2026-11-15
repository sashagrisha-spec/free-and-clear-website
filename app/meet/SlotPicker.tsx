'use client'

import { useEffect, useMemo, useState } from 'react'

export const INK = '#1B3054'
export const BODY = '#42536D'
export const YELLOW = '#F5C842'

const HOME_TZ = 'Asia/Jerusalem'
const HE_DAYS = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת']

// The visitor's own time zone, read in the browser after the page loads.
// The server render uses Israel time, and the first client pass switches.
export function useGuestTz(): string {
  const [tz, setTz] = useState(HOME_TZ)
  useEffect(() => {
    try {
      const detected = Intl.DateTimeFormat().resolvedOptions().timeZone
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (detected) setTz(detected)
    } catch {
      /* keep Israel */
    }
  }, [])
  return tz
}

export function dayKey(iso: string, tz: string) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(iso))
}
export function timeLabel(iso: string, tz: string) {
  return new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date(iso))
}
export function dayLabel(iso: string, tz: string) {
  const d = new Date(iso)
  const wd = new Intl.DateTimeFormat('en-US', { timeZone: tz, weekday: 'short' }).format(d)
  const idx = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(wd)
  const [, m, day] = dayKey(iso, tz).split('-').map(Number)
  return { name: `יום ${HE_DAYS[idx]}`, date: `${day}.${m}` }
}

type Props = {
  tz: string
  selected: string
  onSelect: (iso: string) => void
  exclude?: { id: string; t: string }
  reloadKey?: number
}

export default function SlotPicker({ tz, selected, onSelect, exclude, reloadKey = 0 }: Props) {
  const [slots, setSlots] = useState<string[] | null>(null)
  const [error, setError] = useState('')
  const [day, setDay] = useState('')

  useEffect(() => {
    let alive = true
    const q = exclude ? `?exclude=${encodeURIComponent(exclude.id)}&t=${encodeURIComponent(exclude.t)}` : ''
    fetch(`/api/meet/slots${q}`, { cache: 'no-store' })
      .then(r => r.json())
      .then(d => {
        if (!alive) return
        if (d.error) setError(d.error)
        else setSlots(d.slots.map((s: { start: string }) => s.start))
      })
      .catch(() => alive && setError('לא הצלחנו לטעון את השעות, נסו שוב בעוד רגע'))
    return () => {
      alive = false
    }
  }, [exclude, reloadKey])

  // Days are grouped in the visitor's time zone, so a late slot abroad can land
  // on a different calendar day than it does in Israel.
  const days = useMemo(() => {
    const seen = new Map<string, string>()
    for (const s of slots || []) if (!seen.has(dayKey(s, tz))) seen.set(dayKey(s, tz), s)
    return [...seen.entries()]
  }, [slots, tz])

  const activeDay = day && days.some(([k]) => k === day) ? day : days[0]?.[0] || ''

  if (error) return <p style={{ textAlign: 'center', color: '#B91C1C', fontSize: '1.1rem' }}>{error}</p>
  if (!slots) return <p style={{ textAlign: 'center', color: BODY, fontSize: '1.15rem' }}>טוען שעות פנויות...</p>
  if (!slots.length)
    return (
      <p style={{ textAlign: 'center', color: BODY, fontSize: '1.15rem', lineHeight: 1.7 }}>
        כרגע אין שעות פנויות בשבוע הקרוב.
        <br />
        נסו שוב בעוד כמה ימים.
      </p>
    )

  const times = slots.filter(s => dayKey(s, tz) === activeDay)

  return (
    <div>
      {/* Days: equal-width cells, so the row stays symmetric however many days are open. */}
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(days.length, 4)}, minmax(0, 1fr))` }}>
        {days.map(([key, iso]) => {
          const l = dayLabel(iso, tz)
          const on = key === activeDay
          return (
            <button
              key={key}
              type="button"
              onClick={() => {
                setDay(key)
                onSelect('')
              }}
              className="rounded-2xl transition"
              style={{
                padding: '0.8rem 0.4rem',
                border: `2px solid ${on ? INK : 'rgba(27,48,84,0.16)'}`,
                backgroundColor: on ? INK : '#fff',
                color: on ? '#fff' : INK,
                cursor: 'pointer',
              }}
            >
              <span style={{ display: 'block', fontSize: '1.08rem', fontWeight: 700 }}>{l.name}</span>
              <span style={{ display: 'block', fontSize: '1rem', opacity: 0.85 }}>{l.date}</span>
            </button>
          )
        })}
      </div>

      {/* Wrapping rows, centred: a short last row sits in the middle, not off to one side. */}
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {times.map(s => {
          const on = s === selected
          return (
            <button
              key={s}
              type="button"
              onClick={() => onSelect(s)}
              className="w-[calc((100%-1rem)/3)] rounded-xl transition sm:w-[calc((100%-1.5rem)/4)]"
              style={{
                padding: '0.75rem 0',
                fontSize: '1.15rem',
                fontWeight: 600,
                border: `2px solid ${on ? YELLOW : 'rgba(27,48,84,0.16)'}`,
                backgroundColor: on ? YELLOW : '#fff',
                color: INK,
                cursor: 'pointer',
                direction: 'ltr',
              }}
            >
              {timeLabel(s, tz)}
            </button>
          )
        })}
      </div>
      <p style={{ textAlign: 'center', marginTop: '0.9rem', fontSize: '0.98rem', color: BODY }}>השעות מוצגות לפי אזור הזמן שלכם</p>
    </div>
  )
}
