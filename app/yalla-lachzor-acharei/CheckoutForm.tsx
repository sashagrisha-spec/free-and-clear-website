'use client'

import { useState } from 'react'

export default function CheckoutForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return
    setLoading(true)
    setError('')

    // Fire InitiateCheckout for the pixel (best-effort). NOT a purchase.
    const fbq = (window as unknown as { fbq?: (...a: unknown[]) => void }).fbq
    if (fbq) fbq('track', 'InitiateCheckout')

    try {
      const res = await fetch('/api/yalla-payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || 'משהו השתבש, נסו שוב')
        setLoading(false)
      }
    } catch {
      setError('שגיאת חיבור, נסו שוב')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md w-full mx-auto" dir="rtl">
      <input
        type="text"
        placeholder="שם מלא"
        value={name}
        onChange={e => setName(e.target.value)}
        required
        className="w-full px-4 py-3.5 rounded-xl text-right"
        style={{ backgroundColor: '#fff', color: 'var(--navy)', border: '1.5px solid rgba(27,48,84,0.15)', outline: 'none' }}
      />
      <input
        type="email"
        placeholder="כתובת אימייל"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        className="w-full px-4 py-3.5 rounded-xl text-right"
        style={{ backgroundColor: '#fff', color: 'var(--navy)', border: '1.5px solid rgba(27,48,84,0.15)', outline: 'none' }}
      />
      {error && <p className="text-sm text-center" style={{ color: '#DC2626' }}>{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="font-bold py-4 px-8 rounded-xl text-lg hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg"
        style={{ backgroundColor: 'var(--yellow)', color: 'var(--navy)' }}
      >
        {loading ? 'מעבירים אתכם לתשלום...' : 'אני רוצה להתחיל 👈 ₪97'}
      </button>
      <p className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.6)' }}>
        תשלום מאובטח דרך Cardcom · חשבונית תישלח אוטומטית למייל
      </p>
    </form>
  )
}
