'use client'

import { useEffect, useState } from 'react'

const BASE_PRICE = 97
const BUMP_PRICE = 68
const BUMP_OLD_PRICE = 137

const SMALL_TALK_PERKS = [
  'מה להגיד בכל סיטואציה בחיים - במעלית, בסופר, בתחילת פגישה',
  'הבדלים תרבותיים - מה להגיד וממה להיזהר',
  'איך לשמור על שיחה זורמת ואיך לסיים שיחה בצורה מנומסת',
  'עבודה פסיכולוגית שתעזור לכם אחר כך בכל שפה',
  'הקורס שלכם - לתמיד',
]

export default function CheckoutForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [bump, setBump] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isTest, setIsTest] = useState(false)

  useEffect(() => {
    setIsTest(new URLSearchParams(window.location.search).get('test') === '1')
  }, [])

  const total = BASE_PRICE + (bump ? BUMP_PRICE : 0)
  const testCharge = 1 + (bump ? 1 : 0)

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
        body: JSON.stringify({ name: name.trim(), email: email.trim(), test: isTest, bump }),
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

      {/* Order bump: add the Small talk course at a discount */}
      <label
        className="block w-full text-right cursor-pointer select-none rounded-2xl p-4 mt-1"
        style={{ backgroundColor: '#FFFBEE', border: '2px dashed var(--yellow)', position: 'relative' }}
      >
        <span
          className="absolute text-xs font-bold px-3 py-1 rounded-full"
          style={{ top: -12, insetInlineStart: 16, backgroundColor: 'var(--yellow)', color: 'var(--navy)' }}
        >
          רק עכשיו, בעמוד הזה ✦
        </span>

        <span className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={bump}
            onChange={e => setBump(e.target.checked)}
            className="flex-shrink-0"
            style={{ width: 22, height: 22, marginTop: 2, accentColor: 'var(--navy)' }}
          />
          <span className="block">
            <span className="block font-bold text-lg" style={{ color: 'var(--navy)' }}>
              <span style={{ fontStyle: 'italic' }}>Small talk</span> קטן עליי
            </span>
            <span className="block text-sm mt-0.5" style={{ color: 'var(--mid-grey)' }}>
              הוסיפו את הקורס שמלמד לנהל שיחת חולין באנגלית בלי להיתקע.
            </span>
          </span>
        </span>

        <span className="block mt-3" style={{ paddingInlineStart: 34 }}>
          <span className="flex flex-col gap-1.5">
            {SMALL_TALK_PERKS.map(perk => (
              <span key={perk} className="flex items-start gap-2 text-sm" style={{ color: 'var(--dark-grey)' }}>
                <span style={{ color: '#1B8A5A', fontWeight: 800 }} className="flex-shrink-0">✓</span>
                <span>{perk}</span>
              </span>
            ))}
          </span>

          <span className="block text-sm mt-3 mb-2" style={{ color: 'var(--mid-grey)' }}>
            🎓 <strong style={{ color: 'var(--navy)' }}>1,468 תלמידים</strong> כבר בפנים
          </span>

          <span className="flex items-center gap-2.5">
            <span style={{ color: 'var(--mid-grey)', textDecoration: 'line-through' }}>₪{BUMP_OLD_PRICE}</span>
            <span className="font-bold text-2xl" style={{ color: 'var(--navy)' }}>₪{BUMP_PRICE}</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(27,138,90,0.12)', color: '#1B8A5A' }}>
              חיסכון של 50%
            </span>
          </span>
        </span>
      </label>

      {/* Total */}
      <div className="flex items-center justify-between px-1 pt-1" style={{ color: '#fff' }}>
        <span className="font-bold text-lg">סה״כ לתשלום</span>
        <span className="font-bold text-lg" style={{ fontVariantNumeric: 'tabular-nums' }}>₪{total}</span>
      </div>

      {isTest && (
        <p className="text-xs text-center" style={{ color: 'var(--yellow)' }}>
          מצב בדיקה: החיוב בפועל בקארדקום יהיה ₪{testCharge} (המחירים שמוצגים הם האמיתיים)
        </p>
      )}

      {error && <p className="text-sm text-center" style={{ color: '#DC2626' }}>{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="font-bold py-4 px-8 rounded-xl text-lg hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg"
        style={{ backgroundColor: 'var(--yellow)', color: 'var(--navy)' }}
      >
        {loading ? 'מעבירים אתכם לתשלום...' : `לתשלום המאובטח ₪${total} 👈`}
      </button>
      <p className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.6)' }}>
        תשלום מאובטח דרך Cardcom · חשבונית תישלח אוטומטית למייל
      </p>
    </form>
  )
}
