'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import MetaPixel, { trackPurchase } from '@/components/MetaPixel'
import { recallUtm } from '@/lib/utm'

type Link = { course: string; label: string; url: string; note: string }

function SuccessContent() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const [links, setLinks] = useState<Link[]>([])

  useEffect(() => {
    const rv = searchParams.get('rv') || ''
    const lowProfileCode =
      searchParams.get('LowProfileCode') ||
      searchParams.get('lowProfileCode') ||
      searchParams.get('lowprofilecode') ||
      ''

    fetch('/api/bundle-payment/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ returnValue: rv, lowProfileCode, utm: recallUtm() }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setName(data.name || '')
          setLinks(data.links || [])
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
          <a href="/bundle" className="text-sm underline" style={{ color: 'var(--yellow)' }}>
            חזרה לעמוד
          </a>
          <p className="text-xs mt-4" style={{ color: 'rgba(255,255,255,0.4)' }}>
            אם חויבתם ולא קיבלתם גישה, כתבו לנו: sasha@freeandclearenglish.com
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16" style={{ backgroundColor: 'var(--navy)' }} dir="rtl">
      <div className="text-center w-full" style={{ maxWidth: 520 }}>
        <p className="text-5xl mb-5">🎧</p>
        <h1 className="text-3xl font-bold text-white mb-4">{name ? `${name}, הערכה שלכם מוכנה!` : 'הערכה שלכם מוכנה!'}</h1>
        <p className="mb-9" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.05rem', lineHeight: 1.8 }}>
          התשלום עבר.
          <br />
          שלחנו לכם גם מייל עם כל הקישורים, אז אפשר להיכנס מתי שתרצו.
        </p>
        <p className="mb-4" style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 700 }}>
          מומלץ לעשות בסדר הזה:
        </p>
        <div className="flex flex-col gap-4">
          {links.map((l, i) => (
            <a
              key={l.course}
              href={l.url}
              className="block rounded-2xl transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: 'var(--yellow)', color: '#1B3054', padding: '1.1rem 1.4rem' }}
            >
              <span className="block" style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                {i + 1}. {l.label} 👈
              </span>
              <span className="block" style={{ fontSize: '0.95rem', opacity: 0.75 }}>
                {l.note}
              </span>
            </a>
          ))}
        </div>
        <p className="mt-8" style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', lineHeight: 1.8 }}>
          שמרו את המייל. הקישורים אישיים ולא פגים.
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
