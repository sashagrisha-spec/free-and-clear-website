'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { ADDON_FULL, ADDON_LABEL, ADDON_PRICE } from '@/lib/speak-now'

const INK = '#1B3054'

// Half-price add-ons, offered ONLY on this page (2026-11-15). Prices live in
// lib/speak-now.ts, shared with the server, which sets the real charge.
const ADDONS = [
  {
    id: 'yalla' as const,
    name: ADDON_LABEL.yalla,
    full: ADDON_FULL.yalla,
    price: ADDON_PRICE.yalla,
    note: ['התוכנית הכי פופולרית שלי לתרגול לבד.', '55 הקלטות: מקשיבים וחוזרים אחריי בקול.'],
  },
  {
    id: 'soe' as const,
    name: ADDON_LABEL.soe,
    full: ADDON_FULL.soe,
    price: ADDON_PRICE.soe,
    note: ['הקורס היחיד בארץ להגייה.', 'כל מה שאתם צריכים לדעת כדי להיות ברורים יותר.', '34 סרטונים ו־17 דפי תרגול.'],
  },
]
type AddonId = (typeof ADDONS)[number]['id']

// The signup form at the bottom of /speak-now. The checkbox is mandatory:
// the buyer confirms the course is all in English, not for beginners, and
// that they read the terms (/speak-now/terms, refund rules live there).
// Submit goes to /api/speak-now-payment/create, which redirects to Cardcom.
export default function SpeakNowSignup({ price }: { price: number }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  // ?test=<secret> switches the charge to ₪1. The server checks the secret;
  // the browser only passes it through.
  const testKey = useSearchParams().get('test') || ''
  const [addons, setAddons] = useState<AddonId[]>([])
  const toggle = (id: AddonId) => setAddons((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]))
  const total = price + ADDONS.filter((a) => addons.includes(a.id)).reduce((s, a) => s + a.price, 0)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!name.trim() || !email.trim()) return setError('צריך שם ומייל')
    if (!agreed) return setError('צריך לסמן את התיבה לפני התשלום')
    setLoading(true)
    try {
      const res = await fetch('/api/speak-now-payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          addons,
          ...(testKey ? { test: testKey } : {}),
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (data.url) {
        window.location.href = data.url
        return
      }
      setError(data.error || 'שגיאה ביצירת דף התשלום')
    } catch {
      setError('שגיאת חיבור, נסו שוב')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: 560 }}>
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

      <div className="rounded-3xl mb-6" style={{ border: '2px dashed var(--yellow)', padding: '1.3rem 1.1rem' }}>
        <p style={{ color: '#fff', fontWeight: 700, fontSize: '1.25rem' }}>רוצים להוסיף עוד קורס בחצי מחיר?</p>
        <p
          className="inline-block rounded-full"
          style={{ backgroundColor: 'var(--yellow)', color: INK, fontWeight: 900, fontSize: 'clamp(1.25rem, 4.5vw, 1.6rem)', padding: '0.5rem 1.4rem', marginTop: '0.8rem', marginBottom: '1.2rem' }}
        >
          הנחה כזו יש רק בעמוד הזה!
        </p>
        <div className="flex flex-col gap-3">
          {ADDONS.map((a) => {
            const on = addons.includes(a.id)
            return (
              <label
                key={a.id}
                className="flex items-start gap-3 rounded-2xl"
                style={{
                  padding: '0.9rem 1rem',
                  cursor: 'pointer',
                  textAlign: 'right',
                  backgroundColor: on ? 'rgba(245,200,66,0.14)' : 'rgba(255,255,255,0.05)',
                  border: on ? '2px solid var(--yellow)' : '2px solid transparent',
                }}
              >
                <input type="checkbox" checked={on} onChange={() => toggle(a.id)} style={{ width: 22, height: 22, marginTop: 3, flexShrink: 0, accentColor: '#F5C842' }} />
                <span className="flex-1">
                  <span className="block" style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>{a.name}</span>
                  {a.note.map((n) => (
                    <span key={n} className="block" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                      {n}
                    </span>
                  ))}
                </span>
                <span className="shrink-0" style={{ textAlign: 'left' }}>
                  <span className="block" style={{ color: 'var(--yellow)', fontWeight: 700, fontSize: '1.3rem' }}>₪{a.price}</span>
                  <span className="block" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}><s>₪{a.full}</s></span>
                </span>
              </label>
            )
          })}
        </div>
      </div>

      {/* Required before paying, like /bundle: level, all-English, and the terms page. */}
      <label className="flex items-start gap-3 mb-6" style={{ cursor: 'pointer', textAlign: 'right' }}>
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          style={{ width: 22, height: 22, marginTop: 3, flexShrink: 0, accentColor: '#F5C842' }}
        />
        <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem', lineHeight: 1.6 }}>
          ידוע לי שהקורס כולו באנגלית.
          <br />
          ידוע לי שהוא מתאים לרמה בינונית ומעלה, ולא למתחילים.
          <br />
          קראתי והסכמתי ל
          <a href="/speak-now/terms" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--yellow)', textDecoration: 'underline' }}>
            תקנון הרכישה וההחזרים
          </a>
          .
        </span>
      </label>

      {error && <p style={{ color: '#FFB4A8', fontSize: '1rem', marginBottom: 12 }}>{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full transition-transform hover:-translate-y-0.5"
        style={{ backgroundColor: 'var(--yellow)', color: INK, padding: '1.2rem 2rem', fontSize: '1.3rem', fontWeight: 700, cursor: 'pointer', border: 'none' }}
      >
        {loading ? 'רגע...' : testKey ? 'תשלום בדיקה, ₪1' : `✅ אני בפנים! תני לי גישה עכשיו, ₪${total}`}
      </button>
    </form>
  )
}
