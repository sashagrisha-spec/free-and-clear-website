import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Business English Israel | אנגלית עסקית לאנשי מקצוע – Sasha Daniel',
  description: 'אנגלית עסקית למנהלים, יזמים וצוותים בישראל. 1:1 coaching and corporate workshops for Hebrew-speaking professionals who work in English.',
  keywords: 'business English Israel, business English coaching Israel, corporate English training Israel, אנגלית עסקית ישראל, הדרכת אנגלית לחברות ישראל, English for work Israel',
  alternates: {
    canonical: 'https://www.freeandclearenglish.com/business-english-israel',
  },
  openGraph: {
    title: 'Business English Coaching in Israel | Free & Clear English',
    description: 'Business English for Israeli professionals and teams. Personal coaching and corporate workshops with Sasha Daniel.',
    url: 'https://www.freeandclearenglish.com/business-english-israel',
    siteName: 'Free & Clear English',
    locale: 'en_US',
    type: 'website',
  },
}

const situations = [
  'Global team calls where you want to sound authoritative',
  'Investor pitches and fundraising conversations',
  'Presentations and conferences',
  'Hiring and managing English-speaking employees',
  'Sales calls with international clients',
  'Day-to-day Slack, email and written communication',
]

const corporate = [
  { q: 'Who is it for?', a: 'Teams up to 12 people who need to communicate better in English — across functions, departments or the whole company.' },
  { q: 'What does a workshop cover?', a: 'Every workshop is built from scratch. Common topics: pronunciation clarity, cross-cultural communication, presentations, global call confidence.' },
  { q: 'How is it delivered?', a: 'Live on Zoom. Fully interactive. Not a lecture — a working session your team actually learns from.' },
  { q: 'What about follow-up?', a: 'We can structure a series of sessions over time. Some clients run quarterly workshops; others prefer intensive formats.' },
]

export default function BusinessEnglishIsrael() {
  return (
    <>
      <Nav />

      {/* Hero */}
      <section style={{ backgroundColor: 'var(--navy)' }} className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: 'var(--yellow)' }}>
            Business English · Israel
          </p>
          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Business English Coaching<br />
            <span style={{ color: 'var(--yellow)' }}>for Israeli Professionals</span>
          </h1>
          <p className="text-white/75 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
            You run global calls, manage international teams, pitch to foreign investors.
            Your English is good. But "good" isn&apos;t the same as confident, clear and
            commanding. That&apos;s the gap we close.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/#contact"
              style={{ backgroundColor: 'var(--yellow)', color: 'var(--navy)' }}
              className="font-bold px-8 py-4 rounded hover:opacity-90 transition-opacity text-base"
            >
              Contact Sasha
            </Link>
            <Link
              href="/#services"
              className="text-white border border-white/30 font-semibold px-8 py-4 rounded hover:border-white transition-colors text-base"
            >
              See All Programs
            </Link>
          </div>
        </div>
      </section>

      {/* Where it shows up */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--yellow)' }}>
              Where It Shows Up
            </p>
            <h2 className="text-3xl font-bold" style={{ color: 'var(--navy)' }}>
              The business moments where English fluency matters most
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {situations.map(s => (
              <div key={s} className="flex items-start gap-3 p-4 rounded-xl" style={{ backgroundColor: 'var(--light-grey)' }}>
                <span style={{ color: 'var(--yellow)', backgroundColor: 'var(--navy)' }} className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">✓</span>
                <p style={{ color: 'var(--dark-grey)' }}>{s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Two paths */}
      <section style={{ backgroundColor: 'var(--light-grey)' }} className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--yellow)' }}>
              How We Work
            </p>
            <h2 className="text-3xl font-bold" style={{ color: 'var(--navy)' }}>
              Personal coaching or team training — you choose
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">

            {/* 1:1 */}
            <div className="rounded-2xl p-8 flex flex-col" style={{ backgroundColor: 'var(--navy)' }}>
              <span
                className="text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full self-start mb-5"
                style={{ backgroundColor: 'var(--yellow)', color: 'var(--navy)' }}
              >
                Premium 1:1
              </span>
              <h3 className="text-2xl font-bold mb-2 text-white">Personal Business English Coaching</h3>
              <p className="text-sm font-medium mb-4" style={{ color: 'var(--yellow)' }}>
                10 sessions · Fully tailored
              </p>
              <p className="text-base leading-relaxed mb-6 flex-1" style={{ color: 'rgba(255,255,255,0.72)' }}>
                A structured process built around your specific business context and communication challenges.
                Pronunciation, fluency, presentations, psychological blocks — everything that&apos;s in the way.
              </p>
              <ul className="space-y-2 mb-8">
                {[
                  'Pronunciation & accent work',
                  'Fluency under pressure',
                  'High-stakes presentation prep',
                  'Confidence for global calls',
                ].map(h => (
                  <li key={h} className="flex items-start gap-2 text-sm">
                    <span style={{ color: 'var(--yellow)' }} className="mt-0.5 flex-shrink-0">✓</span>
                    <span style={{ color: 'rgba(255,255,255,0.8)' }}>{h}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/#contact"
                className="text-center font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity"
                style={{ backgroundColor: 'var(--yellow)', color: 'var(--navy)' }}
              >
                Contact for Pricing
              </Link>
            </div>

            {/* Corporate */}
            <div className="rounded-2xl p-8 flex flex-col" style={{ backgroundColor: 'var(--white)', border: '1px solid #E5E7EB' }}>
              <span
                className="text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full self-start mb-5"
                style={{ backgroundColor: 'var(--light-grey)', color: 'var(--navy)' }}
              >
                Corporate
              </span>
              <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--navy)' }}>Team Workshops</h3>
              <p className="text-sm font-medium mb-4" style={{ color: 'var(--mid-grey)' }}>
                Up to 12 people · Live on Zoom · Customized
              </p>
              <p className="text-base leading-relaxed mb-6 flex-1" style={{ color: 'var(--mid-grey)' }}>
                Live workshops designed for your team&apos;s specific communication needs.
                Whether it&apos;s cross-team communication, presentations, or English for global calls —
                built from scratch for your group.
              </p>
              <ul className="space-y-2 mb-8">
                {[
                  'Pronunciation clarity for your team',
                  'Communication across cultures',
                  'Small groups up to 12',
                  'Live on Zoom, fully customized',
                ].map(h => (
                  <li key={h} className="flex items-start gap-2 text-sm">
                    <span style={{ color: 'var(--navy)' }} className="mt-0.5 flex-shrink-0">✓</span>
                    <span style={{ color: 'var(--dark-grey)' }}>{h}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/#contact"
                className="text-center font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity"
                style={{ backgroundColor: 'var(--navy)', color: 'var(--white)' }}
              >
                Contact for Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--yellow)' }}>
              Corporate FAQ
            </p>
            <h2 className="text-3xl font-bold" style={{ color: 'var(--navy)' }}>
              Common questions about team workshops
            </h2>
          </div>
          <div className="space-y-4">
            {corporate.map(item => (
              <div key={item.q} className="rounded-xl p-6" style={{ backgroundColor: 'var(--light-grey)' }}>
                <p className="font-bold mb-2" style={{ color: 'var(--navy)' }}>{item.q}</p>
                <p style={{ color: 'var(--mid-grey)' }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: 'var(--navy)' }} className="py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Let&apos;s talk about your team or your own English
          </h2>
          <p className="text-white/70 text-lg mb-8">
            Whether it&apos;s personal coaching or a workshop for your company,
            reach out and we&apos;ll figure out the right fit.
          </p>
          <Link
            href="/#contact"
            style={{ backgroundColor: 'var(--yellow)', color: 'var(--navy)' }}
            className="inline-block font-bold px-10 py-4 rounded hover:opacity-90 transition-opacity text-lg"
          >
            Get in Touch
          </Link>
        </div>
      </section>

      <Footer />
    </>
  )
}
