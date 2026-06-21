'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

interface Props {
  variant: 'community' | 'followers'
}

function CheckoutFormInner({ variant }: Props) {
  const searchParams = useSearchParams()
  const testMode = searchParams.get('test') === '1'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/workshop-payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), variant, test: testMode }),
      })
      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || 'שגיאה ביצירת דף תשלום')
        setLoading(false)
      }
    } catch {
      setError('שגיאת חיבור, נסו שוב')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm mx-auto w-full" dir="rtl">
      <input
        type="text"
        placeholder="שם מלא"
        value={name}
        onChange={e => setName(e.target.value)}
        required
        className="w-full px-4 py-3 rounded-lg"
        style={{
          backgroundColor: 'rgba(255,255,255,0.1)',
          color: 'white',
          border: '1px solid rgba(255,255,255,0.25)',
          outline: 'none',
        }}
      />
      <input
        type="email"
        placeholder="כתובת מייל"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        className="w-full px-4 py-3 rounded-lg"
        style={{
          backgroundColor: 'rgba(255,255,255,0.1)',
          color: 'white',
          border: '1px solid rgba(255,255,255,0.25)',
          outline: 'none',
        }}
      />
      {error && (
        <p className="text-sm text-center" style={{ color: '#FCA5A5' }}>{error}</p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="font-bold py-4 px-10 rounded-lg text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        style={{ backgroundColor: 'var(--yellow)', color: 'var(--navy)' }}
      >
        {loading ? 'מעבירים לתשלום...' : testMode ? 'TEST: לרכישה 1 ₪' : 'לרכישה במחיר המיוחד'}
      </button>
    </form>
  )
}

export default function CheckoutForm({ variant }: Props) {
  return (
    <Suspense>
      <CheckoutFormInner variant={variant} />
    </Suspense>
  )
}
