'use client'

import { useState } from 'react'

const INK = '#1B3054'
const BODY = '#42536D'
const SOFT = '#7C8AA0'

const fieldStyle: React.CSSProperties = {
  padding: '1.05rem 1.3rem',
  fontSize: '1.15rem',
  textAlign: 'center',
  border: '2px solid rgba(27,48,84,0.16)',
  backgroundColor: '#fff',
  color: INK,
  outlineColor: INK,
}

export default function SignupForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('') // honeypot, humans never see it
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!name.trim()) {
      setError('צריך למלא שם מלא')
      return
    }
    if (!email.trim()) {
      setError('צריך למלא מייל')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/hagrala', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, website }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'משהו השתבש, נסו שוב')
        return
      }
      setDone(true)
    } catch {
      setError('משהו השתבש, נסו שוב')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="fce-pop mx-auto text-center" style={{ maxWidth: 520 }}>
        <div
          className="mx-auto flex items-center justify-center rounded-full"
          style={{ width: 82, height: 82, backgroundColor: 'rgba(22,163,74,0.12)', color: '#16A34A', fontSize: '2.4rem' }}
        >
          ✓
        </div>
        <p style={{ margin: '1.4rem auto 0.5rem', fontSize: '1.72rem', fontWeight: 700, color: INK }}>אתם בהגרלה 🎉</p>
        <p style={{ margin: '0 auto', fontSize: '1.22rem', fontWeight: 300, color: BODY, lineHeight: 1.6 }}>
          אשלח מייל כשההשקה יוצאת,
        </p>
        <p style={{ margin: '0 auto', fontSize: '1.22rem', fontWeight: 300, color: BODY, lineHeight: 1.6 }}>
          ומייל נוסף עם תוצאות ההגרלה.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: 480 }}>
      {/* Two identical fields, same width and same padding, so the block stays
          symmetric around the centre axis. */}
      <input
        type="text"
        autoComplete="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="השם המלא שלכם"
        required
        className="w-full rounded-2xl"
        style={fieldStyle}
      />

      <input
        type="email"
        inputMode="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="המייל שלכם"
        required
        className="mt-3 w-full rounded-2xl"
        style={fieldStyle}
      />

      {/* Honeypot. Hidden from people and from screen readers, tempting to bots. */}
      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
      />

      {error && (
        <p style={{ margin: '0.9rem 0 0', fontSize: '1.02rem', color: '#B91C1C', textAlign: 'center' }}>{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-4 w-full rounded-full transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-4 disabled:opacity-60"
        style={{
          backgroundColor: 'var(--yellow)',
          color: INK,
          padding: '1.15rem 2rem',
          fontSize: '1.25rem',
          fontWeight: 700,
          boxShadow: '0 14px 32px rgba(27,48,84,0.18)',
          outlineColor: INK,
        }}
      >
        {loading ? 'רגע...' : 'אני רוצה להשתתף בהגרלה 🤞'}
      </button>

      <p style={{ margin: '1.1rem auto 0', fontSize: '0.98rem', fontWeight: 300, color: SOFT, textAlign: 'center' }}>
        ההגרלה נערכת ביום חמישי, 8.10, בין כל הנרשמים.
      </p>
      <p style={{ margin: '0.25rem auto 0', fontSize: '0.98rem', fontWeight: 300, color: SOFT, textAlign: 'center' }}>
        שלושה זוכים מקבלים את הקורס המלא, לתמיד.
      </p>
    </form>
  )
}
