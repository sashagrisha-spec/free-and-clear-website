import type { Metadata } from 'next'
import { Assistant, Caveat } from 'next/font/google'
import MetaPixel from '@/components/MetaPixel'

const assistant = Assistant({ subsets: ['latin'], weight: ['300', '400', '600', '700'], display: 'swap' })
const hand = Caveat({ subsets: ['latin'], weight: ['600'], display: 'swap' })

export const metadata: Metadata = {
  title: 'Say It Back | Thank you',
  robots: { index: false, follow: false },
}

const INK = '#1B3054'

// Lemon Squeezy sends the buyer here after payment: /say-it-back/thank-you?k=<key>.
// The same key as the listening page. The Meta Purchase is NOT fired here: the
// Lemon webhook (api/say-it-back/lemon-webhook) reports it from the server, once
// per order, so firing it here too would count every sale twice.
export default async function ThankYouPage({ searchParams }: { searchParams: Promise<{ k?: string }> }) {
  const { k = '' } = await searchParams
  const key = process.env.SAY_IT_BACK_ACCESS_KEY
  const ok = !!key && k === key

  return (
    <>
      <MetaPixel />
      <main dir="ltr" className={`${assistant.className} min-h-screen flex items-center justify-center px-6 py-16 text-center`} style={{ backgroundColor: INK }}>
        <div style={{ maxWidth: 560 }}>
          <p style={{ fontSize: '3.5rem', lineHeight: 1 }}>🎉</p>
          <h1 className="mt-6" style={{ fontSize: 'clamp(2.4rem, 7vw, 3.4rem)', fontWeight: 700, color: '#fff', lineHeight: 1.15 }}>
            Thank you!
          </h1>
          <p className={hand.className} style={{ fontSize: 'clamp(1.9rem, 5.5vw, 2.6rem)', color: 'var(--yellow)', marginTop: '1.2rem', lineHeight: 1.25 }}>
            Your mouth is about to get its turn.
          </p>
          <div className="mt-8" style={{ color: 'rgba(255,255,255,0.88)', fontSize: '1.2rem', fontWeight: 300, lineHeight: 2 }}>
            <p>All 56 recordings are waiting for you.</p>
            <p>We also sent the link to your email.</p>
          </div>
          {ok ? (
            <a
              href={`/say-it-back/listen?k=${encodeURIComponent(k)}`}
              className="inline-block mt-10 rounded-full transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: 'var(--yellow)', color: INK, padding: '1.15rem 2.9rem', fontSize: '1.25rem', fontWeight: 700, boxShadow: '0 14px 32px rgba(0,0,0,0.25)' }}
            >
              Start listening 👉
            </a>
          ) : (
            <p className="mt-10" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.05rem' }}>
              Please use the link from your purchase email.
            </p>
          )}
          <p className="mt-10" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem' }}>
            Questions? sasha@freeandclearenglish.com
          </p>
        </div>
      </main>
    </>
  )
}
