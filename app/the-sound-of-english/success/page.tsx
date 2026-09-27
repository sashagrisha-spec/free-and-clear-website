'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import MetaPixel, { trackPurchase } from '@/components/MetaPixel'

function SuccessContent() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const [link, setLink] = useState('')

  useEffect(() => {
    const rv = searchParams.get('rv') || ''
    const lowProfileCode =
      searchParams.get('LowProfileCode') ||
      searchParams.get('lowProfileCode') ||
      searchParams.get('lowprofilecode') ||
      ''

    fetch('/api/sound-of-english-payment/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ returnValue: rv, lowProfileCode }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setName(data.name || '')
          setLink(data.accessUrl || '')
          // Counted only here, after the server verified the payment.
          trackPurchase(data.value, data.currency, data.eventId)
          setStatus('success')
        } else {
          setError(data.error || 'שגיאה בעיבוד התשלום')
          setStatus('error')
        }
      })
      .catch(() => {
        setError('שגיאת חיבור')
        setStatus('error')
      })
  }, [searchParams])

  if (status === 'loading') {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--navy)' }}>
        <div className="text-center">
          <div
            className="w-10 h-10 rounded-full border-4 animate-spin mx-auto mb-4"
            style={{ borderColor: 'var(--yellow)', borderTopColor: 'transparent' }}
          />
          <p style={{ color: 'rgba(255,255,255,0.65)' }}>מאשרים את התשלום...</p>
        </div>
      </main>
    )
  }

  if (status === 'error') {
    return (
      <main className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: 'var(--navy)' }} dir="rtl">
        <div className="text-center max-w-sm">
          <p className="text-4xl mb-4">⚠️</p>
          <h1 className="text-xl font-bold text-white mb-2">משהו השתבש</h1>
          <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.55)' }}>{error}</p>
          <a href="/the-sound-of-english" className="text-sm underline" style={{ color: 'var(--yellow)' }}>
            חזרה לעמוד הקורס
          </a>
          <p className="text-xs mt-4" style={{ color: 'rgba(255,255,255,0.4)' }}>
            אם חויבתם ולא קיבלתם גישה, כתבו לנו: sasha@freeandclearenglish.com
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16" style={{ backgroundColor: 'var(--navy)' }} dir="rtl">
      <div className="text-center" style={{ maxWidth: 520 }}>
        <p className="text-5xl mb-5">🎧</p>
        <h1 className="text-3xl font-bold text-white mb-4">{name ? `${name}, הקורס שלכם מוכן!` : 'הקורס שלכם מוכן!'}</h1>
        <p className="mb-9" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.05rem', lineHeight: 1.8 }}>
          התשלום עבר. שלחנו לכם גם מייל עם הקישור האישי, אז אפשר להיכנס מתי שתרצו.
        </p>
        {link && (
          <a
            href={link}
            className="inline-block rounded-full"
            style={{ backgroundColor: 'var(--yellow)', color: '#1B3054', padding: '1.15rem 2.6rem', fontSize: '1.15rem', fontWeight: 700 }}
          >
            כניסה לקורס 👈
          </a>
        )}
        <p className="mt-8" style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', lineHeight: 1.8 }}>
          שמרו את המייל. הקישור אישי ולא פג.
        </p>
      </div>
    </main>
  )
}

export default function SuccessPage() {
  return (
    <>
      <MetaPixel />
      <Suspense fallback={null}>
        <SuccessContent />
      </Suspense>
    </>
  )
}
