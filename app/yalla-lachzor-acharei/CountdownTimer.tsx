'use client'

import { useEffect, useState } from 'react'

// Fixed-deadline countdown (same for every visitor - honest urgency, not a
// per-visit evergreen timer). Renders nothing once the deadline passes.

function split(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000))
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  }
}

export default function CountdownTimer({ target, label = 'נגמר בעוד' }: { target: string; label?: string }) {
  const [remaining, setRemaining] = useState<number | null>(null)

  useEffect(() => {
    const end = new Date(target).getTime()
    const tick = () => setRemaining(end - Date.now())
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [target])

  // Render nothing before mount (avoids SSR mismatch) and after the deadline.
  if (remaining === null || remaining <= 0) return null

  const { d, h, m, s } = split(remaining)
  const cells: Array<[number, string]> = [
    [d, 'ימים'],
    [h, 'שעות'],
    [m, 'דקות'],
    [s, 'שניות'],
  ]

  return (
    <div dir="rtl" className="flex flex-col items-center gap-2">
      <span className="text-sm font-bold" style={{ color: 'var(--yellow)' }}>⏳ {label}</span>
      <div className="flex gap-2 justify-center" style={{ fontVariantNumeric: 'tabular-nums' }}>
        {cells.map(([n, l]) => (
          <div key={l} className="flex flex-col items-center">
            <span
              className="rounded-lg font-bold"
              style={{ backgroundColor: 'var(--yellow)', color: 'var(--navy)', fontSize: 26, padding: '8px 10px', minWidth: 52, textAlign: 'center' }}
            >
              {String(n).padStart(2, '0')}
            </span>
            <span className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.7)' }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
