import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'English Pronunciation Coaching | שיפור הגייה באנגלית – Sasha Daniel',
  description: 'שיפור הגייה ומבטא באנגלית לדוברי עברית. Targeted pronunciation coaching for Israeli professionals — sound clear, confident and natural in English.',
  keywords: 'English pronunciation coaching, pronunciation coach Israel, accent reduction Hebrew speakers, English accent coaching, שיפור הגייה באנגלית, מבטא אנגלי',
  alternates: {
    canonical: 'https://www.freeandclearenglish.com/pronunciation-coaching',
  },
  openGraph: {
    title: 'English Pronunciation Coaching | Free & Clear English',
    description: 'Pronunciation and accent coaching for Hebrew-speaking professionals. Sound as confident in English as you do in Hebrew.',
    url: 'https://www.freeandclearenglish.com/pronunciation-coaching',
    siteName: 'Free & Clear English',
    locale: 'en_US',
    type: 'website',
  },
}

const sounds = [
  { letter: 'P / B', detail: 'Hebrew speakers often blend these in English' },
  { letter: 'TH', detail: 'The sound that doesn\'t exist in Hebrew' },
  { letter: 'V / W', detail: 'A common confusion for Hebrew speakers' },
  { letter: 'Word stress', detail: 'Where the emphasis falls changes meaning' },
  { letter: 'Sentence rhythm', detail: 'English flows differently than Hebrew' },
  { letter: 'Vowel sounds', detail: 'English has 15+ vowels; Hebrew has fewer' },
]

const steps = [
  {
    num: '01',
    title: 'Diagnosis',
    desc: 'We start by identifying exactly which sounds and patterns are holding you back — not generic exercises, but your specific gaps.',
  },
  {
    num: '02',
    title: 'Targeted practice',
    desc: 'Every session is focused on what you specifically need to work on. Real words, real sentences, real scenarios from your life.',
  },
  {
    num: '03',
    title: 'Fluency & rhythm',
    desc: 'Pronunciation is only part of it. We also work on the natural rhythm and flow that makes you sound confident and clear.',
  },
  {
    num: '04',
    title: 'Real-world integration',
    desc: 'You take what you practice in sessions into your actual meetings, calls, and presentations — and it sticks.',
  },
]

export default function PronunciationCoaching() {
  return (
    <>
      <Nav />

      {/* Hero */}
      <section style={{ backgroundColor: 'var(--navy)' }} className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: 'var(--yellow)' }}>
            Pronunciation Coaching
          </p>
          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            English Pronunciation Coaching<br />
            <span style={{ color: 'var(--yellow)' }}>for Hebrew Speakers</span>
          </h1>
          <p className="text-white/75 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
            Your accent isn&apos;t the problem. The problem is when people ask you to repeat yourself,
            or when you hold back in meetings because you&apos;re not sure how something will sound.
            That&apos;s exactly what we fix.
          </p>
          <Link
            href="/#contact"
            style={{ backgroundColor: 'var(--yellow)', color: 'var(--navy)' }}
            className="inline-block font-bold px-8 py-4 rounded hover:opacity-90 transition-opacity text-base"
          >
            Start Pronunciation Coaching
          </Link>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--yellow)' }}>
                Why Pronunciation Matters
              </p>
              <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--navy)' }}>
                It&apos;s not about losing your accent. It&apos;s about being understood.
              </h2>
              <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--mid-grey)' }}>
                Having an accent isn&apos;t a problem. Everyone has one. But when your pronunciation
                creates friction — when people misunderstand you, when you hesitate before speaking,
                when you feel less impressive in English than you are in Hebrew — that&apos;s worth fixing.
              </p>
              <p className="text-base leading-relaxed" style={{ color: 'var(--mid-grey)' }}>
                My approach is targeted, not generic. We work on the specific sounds and patterns
                that trip up Hebrew speakers in English — not a one-size-fits-all program.
              </p>
            </div>
            <div className="space-y-3">
              {[
                'You repeat yourself more than you should',
                'You hold back in meetings or on calls',
                'You feel less confident in English than in Hebrew',
                'People sometimes mishear or misunderstand you',
                'You know what you want to say but it doesn\'t come out right',
              ].map(item => (
                <div key={item} className="flex items-start gap-3 p-4 rounded-xl" style={{ backgroundColor: 'var(--light-grey)' }}>
                  <span style={{ color: 'var(--navy)' }} className="font-bold flex-shrink-0">→</span>
                  <p style={{ color: 'var(--dark-grey)' }}>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Common challenges */}
      <section style={{ backgroundColor: 'var(--light-grey)' }} className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--yellow)' }}>
              What We Work On
            </p>
            <h2 className="text-3xl font-bold" style={{ color: 'var(--navy)' }}>
              The sounds Hebrew speakers struggle with most
            </h2>
            <p className="mt-4 text-lg max-w-xl mx-auto" style={{ color: 'var(--mid-grey)' }}>
              These aren&apos;t random — they&apos;re the exact patterns that come from thinking in Hebrew and speaking in English.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {sounds.map(s => (
              <div key={s.letter} className="bg-white rounded-xl p-5" style={{ border: '1px solid #E5E7EB' }}>
                <p className="text-xl font-bold mb-1" style={{ color: 'var(--navy)' }}>{s.letter}</p>
                <p className="text-sm" style={{ color: 'var(--mid-grey)' }}>{s.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--yellow)' }}>
              The Process
            </p>
            <h2 className="text-3xl font-bold" style={{ color: 'var(--navy)' }}>
              How pronunciation coaching works
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {steps.map(s => (
              <div key={s.num} className="rounded-2xl p-7" style={{ backgroundColor: 'var(--light-grey)' }}>
                <p className="text-4xl font-bold mb-3" style={{ color: 'var(--yellow)', opacity: 0.6 }}>{s.num}</p>
                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--navy)' }}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--mid-grey)' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: 'var(--navy)' }} className="py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to work on your pronunciation?
          </h2>
          <p className="text-white/70 text-lg mb-4">
            The 1:1 coaching program includes deep pronunciation work as a core part of the process.
          </p>
          <p className="text-white/50 text-sm mb-8">
            10 sessions · Fully tailored to your specific needs
          </p>
          <Link
            href="/#contact"
            style={{ backgroundColor: 'var(--yellow)', color: 'var(--navy)' }}
            className="inline-block font-bold px-10 py-4 rounded hover:opacity-90 transition-opacity text-lg"
          >
            Contact Sasha
          </Link>
        </div>
      </section>

      <Footer />
    </>
  )
}
