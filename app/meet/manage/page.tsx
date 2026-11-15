import type { Metadata } from 'next'
import { Assistant } from 'next/font/google'
import { getEvent } from '@/lib/meet/google'
import { eventToBooking } from '@/lib/meet/booking'
import { verifyEventId } from '@/lib/meet/token'
import ManageWidget from './ManageWidget'

const assistant = Assistant({ subsets: ['hebrew', 'latin'], weight: ['300', '400', '600', '700'], display: 'swap' })

export const metadata: Metadata = {
  title: 'ניהול הפגישה | Free & Clear English',
  robots: { index: false, follow: false },
}
export const dynamic = 'force-dynamic'

const INK = '#1B3054'
const BODY = '#42536D'

export default async function ManagePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams
  const id = typeof sp.id === 'string' ? sp.id : ''
  const t = typeof sp.t === 'string' ? sp.t : ''

  let content: React.ReactNode
  if (!verifyEventId(id, t)) {
    content = <p style={{ fontSize: '1.2rem', color: BODY }}>הקישור לא תקין.</p>
  } else {
    const event = await getEvent(id).catch(() => null)
    const b = event && event.status !== 'cancelled' ? eventToBooking(event) : null
    content = b ? (
      <ManageWidget id={id} t={t} start={b.start.toISOString()} name={b.name} meetLink={b.meetLink || ''} />
    ) : (
      <p style={{ fontSize: '1.2rem', color: BODY, lineHeight: 1.7 }}>
        הפגישה הזו כבר בוטלה.
        <br />
        אפשר לקבוע חדשה <a href="/meet" style={{ color: INK, fontWeight: 700 }}>כאן</a>.
      </p>
    )
  }

  return (
    <main dir="rtl" className={assistant.className} style={{ minHeight: '100vh', backgroundColor: '#FBF8F1', padding: '3.5rem 1rem 4rem' }}>
      <div className="mx-auto text-center" style={{ maxWidth: 560 }}>
        <h1 style={{ margin: '0 0 1.6rem', fontSize: 'clamp(1.9rem, 6vw, 2.4rem)', fontWeight: 700, color: INK }}>שיחת ההיכרות שלכם</h1>
        {content}
      </div>
    </main>
  )
}
