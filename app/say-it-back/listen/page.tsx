import type { Metadata } from 'next'
import { Assistant, Caveat } from 'next/font/google'
import Player from './Player'

const assistant = Assistant({ subsets: ['latin'], weight: ['300', '400', '600', '700'], display: 'swap' })
const hand = Caveat({ subsets: ['latin'], weight: ['600'], display: 'swap' })

export const metadata: Metadata = {
  title: 'Say It Back | Your recordings',
  robots: { index: false, follow: false }, // the buyers' area is never indexed
}

// Lemon Squeezy sends every buyer the same link: /say-it-back/listen?k=<key>.
// The key lives only in env (SAY_IT_BACK_ACCESS_KEY), never in this public repo.
// Recordings and PDFs are served from the media store in SAY_IT_BACK_MEDIA_BASE
// (Cloudflare R2), so listening never touches the site's own bandwidth.
const MEDIA_BASE = process.env.SAY_IT_BACK_MEDIA_BASE || '/say-it-back-media'

export default async function ListenPage({ searchParams }: { searchParams: Promise<{ k?: string }> }) {
  const { k = '' } = await searchParams
  const key = process.env.SAY_IT_BACK_ACCESS_KEY

  if (!key || k !== key) {
    return (
      <main dir="ltr" className={`${assistant.className} min-h-screen flex items-center justify-center px-6`} style={{ backgroundColor: '#1B3054' }}>
        <div className="text-center max-w-sm">
          <p className="text-4xl mb-4">🔒</p>
          <h1 className="text-white mb-3" style={{ fontSize: '1.5rem', fontWeight: 700 }}>This page is locked</h1>
          <p className="mb-6" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', lineHeight: 1.7 }}>
            Please use the link from your purchase email.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem' }}>
            Can&apos;t find it? Write to sasha@freeandclearenglish.com
          </p>
        </div>
      </main>
    )
  }

  return (
    <main dir="ltr" className={assistant.className} style={{ backgroundColor: '#F4F4F4', color: '#1B3054', minHeight: '100vh' }}>
      <Player mediaBase={MEDIA_BASE} handClass={hand.className} />
    </main>
  )
}
