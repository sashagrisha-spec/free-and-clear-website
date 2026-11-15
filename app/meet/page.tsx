import type { Metadata } from 'next'
import { Assistant } from 'next/font/google'
import BookingWidget from './BookingWidget'

const assistant = Assistant({ subsets: ['hebrew', 'latin'], weight: ['300', '400', '600', '700'], display: 'swap' })

export const metadata: Metadata = {
  title: 'שיחת היכרות | Free & Clear English',
  description: 'שיחת היכרות של 20 דקות עם סשה דניאל. בוחרים יום ושעה, והקישור לפגישה מגיע למייל וליומן.',
  // A link Sasha sends by hand, not a page to find on Google.
  robots: { index: false, follow: false },
}

const INK = '#1B3054'
const BODY = '#42536D'

export default function MeetPage() {
  return (
    <main dir="rtl" className={assistant.className} style={{ minHeight: '100vh', backgroundColor: '#FBF8F1', padding: '3.5rem 1rem 4rem' }}>
      <div className="mx-auto text-center" style={{ maxWidth: 560 }}>
        <h1 style={{ margin: 0, fontSize: 'clamp(2rem, 6vw, 2.6rem)', fontWeight: 700, color: INK, lineHeight: 1.2 }}>שיחת היכרות</h1>
        <p style={{ margin: '0.9rem 0 0', fontSize: '1.25rem', color: BODY, lineHeight: 1.7 }}>
          20 דקות ב-<bdi>Google Meet</bdi>.
          <br />
          בוחרים יום ושעה, ממלאים פרטים, והקישור מגיע אליכם למייל וליומן.
        </p>
      </div>
      <div className="mx-auto mt-10" style={{ maxWidth: 560 }}>
        <BookingWidget />
      </div>
    </main>
  )
}
