import type { Metadata } from 'next'
import { Assistant } from 'next/font/google'
import CardViewer from './CardViewer'
import FinalCard from './FinalCard'

const assistant = Assistant({ subsets: ['hebrew', 'latin'], weight: ['300', '400', '600', '700'], display: 'swap' })

export const metadata: Metadata = {
  title: 'Start | Respond | Keep It Going | Free & Clear English',
  description: '12 small talk cards, from easy to hard.',
  // A free giveaway shared by link only. Kept out of Google.
  robots: { index: false, follow: false },
}

const INK = '#1B3054'

export default function SmallTalkCardsPage() {
  return (
    <main
      className={`${assistant.className} min-h-screen px-4 py-10 sm:py-14`}
      style={{ backgroundColor: '#FDF8F3', color: INK }}
    >
      <div className="mx-auto max-w-xl text-center">
        <h1 className="mb-8 text-3xl font-bold leading-tight sm:text-4xl">
          Start | Respond | Keep It Going
        </h1>

        <CardViewer finalCard={<FinalCard />} />
      </div>
    </main>
  )
}
