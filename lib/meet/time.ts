import { MEET } from './config'

// Wall-clock parts of an instant, in Israel time.
// tz defaults to Israel; guest-facing text passes the guest's own zone.
export function israelParts(d: Date, tz: string = MEET.timeZone) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'short',
    hourCycle: 'h23',
  }).formatToParts(d)
  const get = (t: string) => parts.find(p => p.type === t)?.value || ''
  const weekdayMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }
  return {
    year: Number(get('year')),
    month: Number(get('month')),
    day: Number(get('day')),
    hour: Number(get('hour')),
    minute: Number(get('minute')),
    weekday: weekdayMap[get('weekday')],
  }
}

// Israel wall time -> the real instant. Handles summer and winter time.
export function israelToUtc(year: number, month: number, day: number, hour = 0, minute = 0): Date {
  const guess = Date.UTC(year, month - 1, day, hour, minute)
  const offsetAt = (ms: number) => {
    const p = israelParts(new Date(ms))
    return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute) - ms
  }
  let ts = guess - offsetAt(guess)
  ts = guess - offsetAt(ts)
  return new Date(ts)
}

export function israelDateKey(d: Date, tz: string = MEET.timeZone): string {
  const p = israelParts(d, tz)
  return `${p.year}-${String(p.month).padStart(2, '0')}-${String(p.day).padStart(2, '0')}`
}

export function israelTime(d: Date, tz: string = MEET.timeZone): string {
  const p = israelParts(d, tz)
  return `${String(p.hour).padStart(2, '0')}:${String(p.minute).padStart(2, '0')}`
}

const HE_DAYS = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת']

// "יום שני, 16.11"
export function israelDayLabel(d: Date, tz: string = MEET.timeZone): string {
  const p = israelParts(d, tz)
  return `יום ${HE_DAYS[p.weekday]}, ${p.day}.${p.month}`
}

// A time zone name from the browser, accepted only if it is real.
export function safeTz(v: unknown): string {
  if (typeof v !== 'string' || !v || v.length > 64) return MEET.timeZone
  try {
    new Intl.DateTimeFormat('en-GB', { timeZone: v })
    return v
  } catch {
    return MEET.timeZone
  }
}

export function hm(s: string): [number, number] {
  const [h, m] = s.split(':').map(Number)
  return [h, m]
}
