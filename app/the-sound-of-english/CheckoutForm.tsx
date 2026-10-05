'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'

const PRICE = 97
const OLD_PRICE = 247

// Order bumps, each at half its normal price. The server decides the real
// charge; these numbers only draw the screen.
const BUMPS = [
  {
    id: 'smallTalk' as const,
    title: 'סמול טוק קטן עליי',
    line: 'הקורס שמלמד לנהל שיחה באנגלית בלי להיתקע, ובלי להישמע מוזר.',
    price: 94,
    old: 187,
    perks: [
      '8 פרקים קצרים, כל אחד על סיטואציה אחרת',
      'איך פותחים שיחה, איך מגיבים, ואיך מסיימים בלי מבוכה',
      'הטעויות התרבותיות שישראלים עושים באנגלית',
      'הקורס שלכם לתמיד',
    ],
  },
  {
    id: 'yalla' as const,
    title: 'יאללה, לחזור אחרי',
    line: '55 הקלטות שמאמנות את שריר הדיבור. עשר דקות ביום, בלי דקדוק ובלי שינון.',
    price: 84,
    old: 167,
    perks: [
      '55 הקלטות קצרות ב-18 תיקיות',
      'שיטת Shadowing: מקשיבים וחוזרים אחרי בקול',
      'מאמן את הפה, לא את הזיכרון',
      'הכל להורדה, שלכם לתמיד',
    ],
  },
]

export default function CheckoutForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [picked, setPicked] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  // ?test=<secret> switches the charge to ₪1. The server checks the secret;
  // the browser only passes it through.
  const testKey = useSearchParams().get('test') || ''
  const isTest = testKey.length > 0

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!name.trim() || !email.trim()) {
      setError('צריך שם ומייל')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/sound-of-english-payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          test: testKey,
          smallTalk: !!picked.smallTalk,
          yalla: !!picked.yalla,
        }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || 'שגיאה ביצירת דף התשלום')
        setLoading(false)
      }
    } catch {
      setError('שגיאת חיבור, נסו שוב')
      setLoading(false)
    }
  }

  const field: React.CSSProperties = {
    width: '100%',
    borderRadius: 14,
    border: '1px solid rgba(255,255,255,0.22)',
    backgroundColor: 'rgba(255,255,255,0.08)',
    color: '#fff',
    padding: '0.95rem 1.1rem',
    fontSize: '1.05rem',
    textAlign: 'right',
  }

  const extras = BUMPS.reduce((sum, b) => sum + (picked[b.id] ? b.price : 0), 0)
  const total = PRICE + extras

  return (
    <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: 440 }}>
      <div className="flex flex-col gap-3 mb-4">
        <input
          type="text"
          placeholder="השם שלכם"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={field}
          autoComplete="name"
        />
        <input
          type="email"
          placeholder="המייל שלכם"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={field}
          autoComplete="email"
          dir="ltr"
        />
      </div>

      <div className="mb-6">
        <p className="mb-3" style={{ color: 'var(--yellow)', fontWeight: 700, fontSize: '1.05rem' }}>
          ✦ רק כאן, ורק בתוך הרכישה הזאת ✦
        </p>

        <div className="flex flex-col gap-4">
          {BUMPS.map((b, i) => {
            const on = !!picked[b.id]
            return (
              <label
                key={b.id}
                className="block w-full text-right cursor-pointer select-none rounded-2xl"
                style={{
                  backgroundColor: '#FFFBEE',
                  border: on ? '3px solid #1B8A5A' : '2px dashed var(--yellow)',
                  padding: '1.15rem 1.15rem 1rem',
                  position: 'relative',
                  marginTop: 10,
                }}
              >
                <span
                  className="absolute rounded-full"
                  style={{
                    top: -13,
                    insetInlineStart: 16,
                    backgroundColor: on ? '#1B8A5A' : 'var(--yellow)',
                    color: on ? '#fff' : '#1B3054',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    padding: '0.28rem 0.85rem',
                    letterSpacing: '0.02em',
                  }}
                >
                  {on ? 'נוסף להזמנה ✓' : i === 0 ? 'חצי מחיר, רק בעמוד הזה ✦' : 'חצי מחיר, רק עכשיו ✦'}
                </span>

                <span className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() => setPicked((p) => ({ ...p, [b.id]: !p[b.id] }))}
                    className="flex-shrink-0"
                    style={{ width: 22, height: 22, marginTop: 3, accentColor: '#1B8A5A', cursor: 'pointer' }}
                  />
                  <span className="block">
                    <span className="block font-bold" style={{ color: '#1B3054', fontSize: '1.2rem', lineHeight: 1.4 }}>
                      להוסיף את {b.title}
                    </span>
                    <span className="block" style={{ color: '#5B6B80', fontSize: '0.95rem', lineHeight: 1.6, marginTop: 2 }}>
                      {b.line}
                    </span>
                  </span>
                </span>

                <span className="block" style={{ paddingInlineStart: 34, marginTop: 12 }}>
                  <span className="flex flex-col gap-1.5">
                    {b.perks.map((perk) => (
                      <span key={perk} className="flex items-start gap-2" style={{ color: '#2D3B4F', fontSize: '0.92rem', lineHeight: 1.55 }}>
                        <span style={{ color: '#1B8A5A', fontWeight: 800 }} className="flex-shrink-0">
                          ✓
                        </span>
                        <span>{perk}</span>
                      </span>
                    ))}
                  </span>

                  <span
                    className="flex items-center gap-2 flex-wrap"
                    style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid rgba(27,48,84,0.12)' }}
                  >
                    <span style={{ color: '#1B3054', fontSize: '1.45rem', fontWeight: 800 }}>{b.price} ₪</span>
                    <span style={{ color: '#8A97A8', fontSize: '1rem' }}>
                      <s>{b.old} ₪</s>
                    </span>
                    <span
                      className="rounded-full"
                      style={{ backgroundColor: '#1B8A5A', color: '#fff', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem' }}
                    >
                      חוסכים {b.old - b.price} ₪
                    </span>
                  </span>

                  <span className="block" style={{ color: '#8A6B12', fontSize: '0.84rem', marginTop: 8, lineHeight: 1.5 }}>
                    המחיר הזה קיים רק כאן. בעמוד של הקורס עצמו הוא {b.old} ₪.
                  </span>
                </span>
              </label>
            )
          })}
        </div>
      </div>

      {extras > 0 && !isTest && (
        <div
          className="mb-4 rounded-2xl"
          style={{ backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', padding: '0.9rem 1.1rem' }}
        >
          <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: '0.92rem' }}>
            הקורס {PRICE} ₪
            {BUMPS.filter((b) => picked[b.id]).map((b) => ` + ${b.title} ${b.price} ₪`)}
          </p>
          <p style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 800, marginTop: 4 }}>
            סך הכל: {total} ₪{' '}
            <span style={{ color: 'var(--yellow)', fontSize: '0.92rem', fontWeight: 700 }}>
              (חסכתם {BUMPS.reduce((n, b) => n + (picked[b.id] ? b.old - b.price : 0), 0)} ₪)
            </span>
          </p>
        </div>
      )}

      {error && (
        <p className="mb-3" style={{ color: '#FFB4A8', fontSize: '0.95rem' }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full transition-transform hover:-translate-y-0.5"
        style={{
          backgroundColor: 'var(--yellow)',
          color: '#1B3054',
          padding: '1.15rem 2rem',
          fontSize: '1.2rem',
          fontWeight: 700,
          cursor: loading ? 'default' : 'pointer',
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? 'רגע...' : isTest ? 'תשלום בדיקה' : `אני בפנים 👈`}
      </button>

      <p className="mt-4" style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
        {isTest
          ? `מצב בדיקה: החיוב יהיה ₪${1 + BUMPS.filter((b) => picked[b.id]).length}.`
          : `תשלום מאובטח בכרטיס אשראי · ${PRICE} ₪ במקום ${OLD_PRICE} ₪`}
        <br />
        מיד אחרי התשלום נשלח אליכם מייל עם קישור אישי לקורס.
      </p>
    </form>
  )
}
