'use client'

import { useState } from 'react'

// The three courses and their real prices on their own pages (2026-10-27).
// The server will decide the real charge; these numbers only draw the screen.
const COURSES = [
  { id: 'soe' as const, name: 'צלילי אנגלית', price: 247 },
  { id: 'smallTalk' as const, name: 'סמול טוק, קטן עליי', price: 187 },
  { id: 'yalla' as const, name: 'יאללה, לחזור אחרי', price: 167 },
]
type CourseId = (typeof COURSES)[number]['id']

const ALL_PRICE = 397
const TWO_PRICE = 315
const SEPARATE = COURSES.reduce((s, c) => s + c.price, 0)

const INK = '#1B3054'
const LAV = '#CFC3EE'

export default function BundleCheckout() {
  const [plan, setPlan] = useState<'all' | 'two'>('all')
  const [two, setTwo] = useState<CourseId[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const togglePick = (id: CourseId) =>
    setTwo((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 2 ? [...prev, id] : [prev[1], id]))

  const ready = plan === 'all' || two.length === 2
  const price = plan === 'all' ? ALL_PRICE : TWO_PRICE

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!ready) return setError('בחרו שני קורסים')
    if (!name.trim() || !email.trim()) return setError('צריך שם ומייל')
    if (!agreed) return setError('צריך לסמן את התיבה לפני התשלום')
    setLoading(true)
    try {
      const res = await fetch('/api/bundle-payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), courses: plan === 'all' ? COURSES.map((c) => c.id) : two }),
      })
      const data = await res.json().catch(() => ({}))
      if (data.url) {
        window.location.href = data.url
        return
      }
      setError(data.error || 'התשלום עדיין לא מחובר')
    } catch {
      setError('התשלום עדיין לא מחובר')
    }
    setLoading(false)
  }

  const optionStyle = (on: boolean): React.CSSProperties => ({
    border: on ? '3px solid var(--yellow)' : '2px solid rgba(255,255,255,0.22)',
    backgroundColor: on ? 'rgba(245,200,66,0.12)' : 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: '1.2rem 1.1rem',
    cursor: 'pointer',
    textAlign: 'center',
  })

  return (
    <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: 560 }}>
      {/* Every course on its own line with its own price, so "601" reads as the
          sum of three, not the price of one. */}
      <div className="rounded-3xl mb-8" style={{ backgroundColor: 'rgba(255,255,255,0.07)', padding: '1.4rem 1.3rem' }}>
        {COURSES.map((c) => (
          <p key={c.id} className="flex items-center justify-between" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.15rem', padding: '0.35rem 0' }}>
            <span>{c.name}</span>
            <span>₪{c.price}</span>
          </p>
        ))}
        <p
          className="flex items-center justify-between"
          style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 700, borderTop: '1px solid rgba(255,255,255,0.2)', marginTop: 8, paddingTop: 12 }}
        >
          <span>ביחד</span>
          <span>₪{SEPARATE}</span>
        </p>
      </div>

      <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <label style={optionStyle(plan === 'all')}>
          <input type="radio" name="plan" checked={plan === 'all'} onChange={() => setPlan('all')} className="sr-only" />
          <span className="block" style={{ color: 'var(--yellow)', fontWeight: 700, fontSize: '1.05rem' }}>
            שלושתם
          </span>
          <span className="block" style={{ color: '#fff', fontSize: '2.4rem', fontWeight: 700, lineHeight: 1.2, marginTop: 6 }}>
            ₪{ALL_PRICE}
          </span>
          <span className="block" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', marginTop: 4 }}>
            <s>₪{SEPARATE}</s>
          </span>
        </label>
        <label style={optionStyle(plan === 'two')}>
          <input type="radio" name="plan" checked={plan === 'two'} onChange={() => setPlan('two')} className="sr-only" />
          <span className="block" style={{ color: LAV, fontWeight: 700, fontSize: '1.05rem' }}>
            רק שניים
          </span>
          <span className="block" style={{ color: '#fff', fontSize: '2.4rem', fontWeight: 700, lineHeight: 1.2, marginTop: 6 }}>
            ₪{TWO_PRICE}
          </span>
          <span className="block" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', marginTop: 4 }}>
            בוחרים בעצמכם
          </span>
        </label>
      </div>

      {plan === 'two' && (
        <div className="mb-6">
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.05rem', marginBottom: 10 }}>אילו שניים?</p>
          <div className="flex flex-col gap-2">
            {COURSES.map((c) => {
              const on = two.includes(c.id)
              return (
                <label
                  key={c.id}
                  className="flex items-center gap-3 rounded-xl"
                  style={{
                    padding: '0.8rem 1rem',
                    cursor: 'pointer',
                    backgroundColor: on ? 'rgba(207,195,238,0.18)' : 'rgba(255,255,255,0.05)',
                    border: on ? `2px solid ${LAV}` : '2px solid transparent',
                    color: '#fff',
                    fontSize: '1.1rem',
                  }}
                >
                  <input type="checkbox" checked={on} onChange={() => togglePick(c.id)} style={{ width: 20, height: 20, accentColor: LAV }} />
                  {c.name}
                </label>
              )
            })}
          </div>
        </div>
      )}

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="שם מלא"
        className="w-full rounded-full mb-3"
        style={{ padding: '1rem 1.4rem', fontSize: '1.1rem', color: INK, backgroundColor: '#fff', border: 'none' }}
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="מייל"
        type="email"
        dir="ltr"
        className="w-full rounded-full mb-5"
        style={{ padding: '1rem 1.4rem', fontSize: '1.1rem', color: INK, backgroundColor: '#fff', border: 'none', textAlign: 'right' }}
      />

      {/* Required before paying: the buyer confirms the level and the no-refund
          terms themselves, so nobody buys by accident. */}
      <label className="flex items-start gap-3 mb-6" style={{ cursor: 'pointer', textAlign: 'right' }}>
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          style={{ width: 22, height: 22, marginTop: 3, flexShrink: 0, accentColor: '#F5C842' }}
        />
        <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem', lineHeight: 1.6 }}>
          רמת האנגלית שלי בינונית ומעלה.
          <br />
          ידוע לי שהתרגולים באנגלית, ושאין החזרים אחרי הרכישה.
        </span>
      </label>

      {error && <p style={{ color: '#FFB4A8', fontSize: '1rem', marginBottom: 12 }}>{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full transition-transform hover:-translate-y-0.5"
        style={{
          backgroundColor: 'var(--yellow)',
          color: INK,
          padding: '1.2rem 2rem',
          fontSize: '1.3rem',
          fontWeight: 700,
          cursor: loading ? 'default' : 'pointer',
          opacity: loading ? 0.6 : 1,
          border: 'none',
        }}
      >
        {loading ? 'רגע...' : `אני רוצה, ₪${price} 👈`}
      </button>
      <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.95rem', marginTop: 14, lineHeight: 1.7 }}>
        תשלום מאובטח בכרטיס אשראי.
        <br />
        מיד אחרי התשלום מגיע מייל עם הגישה לכל הקורסים.
      </p>
    </form>
  )
}
