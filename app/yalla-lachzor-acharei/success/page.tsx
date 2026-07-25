'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import MetaPixel, { trackPurchase } from '@/components/MetaPixel'

function SuccessContent() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const [driveLink, setDriveLink] = useState('')

  useEffect(() => {
    const rv = searchParams.get('rv') || ''
    const lowProfileCode =
      searchParams.get('LowProfileCode') ||
      searchParams.get('lowProfileCode') ||
      searchParams.get('lowprofilecode') ||
      ''

    fetch('/api/yalla-payment/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ returnValue: rv, lowProfileCode }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setName(data.name || '')
          setDriveLink(data.driveLink || '')
          // Purchase is counted ONLY here, after the server verified the payment.
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
  }, [])

  if (status === 'loading') {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--navy)' }}>
        <div className="text-center">
          <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin mx-auto mb-4" style={{ borderColor: 'var(--yellow)', borderTopColor: 'transparent' }} />
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
          <a href="/yalla-lachzor-acharei" className="text-sm underline" style={{ color: 'var(--yellow)' }}>חזרה לדף</a>
          <p className="text-xs mt-4" style={{ color: 'rgba(255,255,255,0.4)' }}>אם חויבתם ולא קיבלתם גישה, כתבו לנו: sasha@freeandclearenglish.com</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: 'var(--navy)' }} dir="rtl">
      <div className="text-center max-w-md">
        <p className="text-5xl mb-6">🎧</p>
        <h1 className="text-3xl font-bold text-white mb-4">יאללה{name ? `, ${name}` : ''}, אתם בפנים!</h1>
        <p className="text-lg mb-2" style={{ color: 'rgba(255,255,255,0.8)' }}>
          שלחנו את הקישור לכל ההקלטות למייל שלכם.
        </p>
        <p className="text-base mb-10" style={{ color: 'rgba(255,255,255,0.45)' }}>
          לא רואים? בדקו גם בקידום מכירות או בספאם.
        </p>
        {driveLink && (
          <a href={driveLink} target="_blank" rel="noopener noreferrer" className="inline-block font-bold py-4 px-10 rounded-lg text-lg hover:opacity-90 transition-opacity" style={{ backgroundColor: 'var(--yellow)', color: 'var(--navy)' }}>
            לכל ההקלטות 👈
          </a>
        )}
      </div>
    </main>
  )
}

export default function YallaSuccessPage() {
  return (
    <Suspense>
      <MetaPixel />
      <SuccessContent />
    </Suspense>
  )
}
