import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: "English Coach in Israel | קואצ'ר אנגלית בישראל – Sasha Daniel",
  description: "קואצ'ר אנגלית למנהלים, יזמים ואנשי מקצוע בישראל. English coaching for Hebrew speakers who want to sound as confident in English as they do in Hebrew.",
  keywords: "English coach Israel, English coaching Israel, English teacher Israel, English tutor Israel, אנגלית עסקית ישראל, קואצ'ר אנגלית ישראל",
  alternates: {
    canonical: 'https://www.freeandclearenglish.com/english-coach-israel',
  },
  openGraph: {
    title: 'English Coach in Israel | Free & Clear English',
    description: 'English coaching for Hebrew-speaking professionals. Sasha Daniel – 8 years, 500+ professionals coached in Israel.',
    url: 'https://www.freeandclearenglish.com/english-coach-israel',
    siteName: 'Free & Clear English',
    locale: 'en_US',
    type: 'website',
  },
}

const clients = [
  { role: 'CEO', detail: 'Pitching to US investors' },
  { role: 'CFO', detail: 'Leading global finance calls' },
  { role: 'Doctor', detail: 'Presenting at international conferences' },
  { role: 'Founder', detail: 'Hiring and managing English-speaking teams' },
  { role: 'Manager', detail: 'Navigating cross-cultural communication' },
  { role: 'Lecturer', detail: 'Teaching or presenting in English' },
]

const offerings = [
  {
    name: 'Personal Coaching',
    tag: 'Premium 1:1',
    desc: '10 sessions fully tailored to you. We work on pronunciation, fluency, psychological blocks, and high-stakes communication.',
    cta: 'Contact for Pricing',
    href: '/#contact',
    navy: true,
  },
  {
    name: 'Team Workshops',
    tag: 'Corporate',
    desc: 'Live Zoom sessions for groups up to 12, built around your team\'s specific communication challenges.',
    cta: 'Contact for Pricing',
    href: '/#contact',
    navy: false,
  },
  {
    name: 'Digital Courses',
    tag: 'Self-paced',
    desc: 'Online courses starting at ₪137 – fluency, pronunciation, small talk. Learn at your own pace.',
    cta: 'See Courses',
    href: '/#services',
    navy: false,
  },
]

export default function EnglishCoachIsrael() {
  return (
    <>
      <Nav />

      {/* Hero */}
      <section style={{ backgroundColor: 'var(--navy)' }} className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: 'var(--yellow)' }}>
            English Coach · Israel
          </p>
          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            The English Coach<br />
            <span style={{ color: 'var(--yellow)' }}>Israeli Professionals Trust</span>
          </h1>
          <p className="text-white/75 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
            You&apos;re sharp, experienced and impressive in Hebrew. But the moment you switch to English,
            something gets lost. That&apos;s not a language problem — that&apos;s exactly what I fix.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/#contact"
              style={{ backgroundColor: 'var(--yellow)', color: 'var(--navy)' }}
              className="font-bold px-8 py-4 rounded hover:opacity-90 transition-opacity text-base"
            >
              Let&apos;s Talk
            </Link>
            <Link
              href="/#services"
              className="text-white border border-white/30 font-semibold px-8 py-4 rounded hover:border-white transition-colors text-base"
            >
              See What I Offer
            </Link>
          </div>

          <div className="mt-14 flex flex-wrap justify-center gap-10">
            <div>
              <p className="text-white text-3xl font-bold">500+</p>
              <p className="text-white/50 text-sm mt-1">Professionals coached</p>
            </div>
            <div>
              <p className="text-white text-3xl font-bold">8</p>
              <p className="text-white/50 text-sm mt-1">Years of experience</p>
            </div>
            <div>
              <p style={{ color: 'var(--yellow)' }} className="text-3xl font-bold">Israel</p>
              <p className="text-white/50 text-sm mt-1">Based, coaching globally</p>
            </div>
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section style={{ backgroundColor: 'var(--light-grey)' }} className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--yellow)' }}>
              Who I Work With
            </p>
            <h2 className="text-3xl font-bold" style={{ color: 'var(--navy)' }}>
              Built for Israeli professionals who already know English
            </h2>
            <p className="mt-4 text-lg max-w-xl mx-auto" style={{ color: 'var(--mid-grey)' }}>
              My clients don&apos;t need grammar lessons. They need to sound as confident in English as they do in Hebrew.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {clients.map(c => (
              <div key={c.role} className="bg-white rounded-xl p-5 flex items-start gap-3" style={{ border: '1px solid #E5E7EB' }}>
                <span style={{ color: 'var(--yellow)', backgroundColor: 'var(--navy)' }} className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">✓</span>
                <div>
                  <p className="font-bold" style={{ color: 'var(--navy)' }}>{c.role}</p>
                  <p className="text-sm mt-0.5" style={{ color: 'var(--mid-grey)' }}>{c.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--yellow)' }}>
                About Sasha
              </p>
              <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--navy)' }}>
                An English coach who understands the Hebrew-speaking mind
              </h2>
              <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--mid-grey)' }}>
                I&apos;m Sasha Daniel. For 8 years I&apos;ve coached over 500 Hebrew-speaking professionals
                across Israel — CEOs, doctors, founders, CFOs — who are fluent in English but feel
                a gap between who they are in Hebrew and who they sound like in English.
              </p>
              <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--mid-grey)' }}>
                My work isn&apos;t about grammar. It&apos;s about pronunciation, fluency, confidence,
                and making your English finally feel like yours.
              </p>
              <Link
                href="/#contact"
                style={{ backgroundColor: 'var(--navy)', color: 'var(--white)' }}
                className="inline-block font-bold px-8 py-4 rounded hover:opacity-90 transition-opacity"
              >
                Book a Free Discovery Call
              </Link>
            </div>
            <div className="space-y-4">
              {[
                'Native-level English fluency coaching',
                'Pronunciation & accent work tailored to Hebrew speakers',
                'Confidence for presentations, pitches and global calls',
                'Available across Israel and internationally via Zoom',
              ].map(item => (
                <div key={item} className="flex items-start gap-3">
                  <span style={{ color: 'var(--yellow)', backgroundColor: 'var(--navy)' }} className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">✓</span>
                  <p style={{ color: 'var(--dark-grey)' }}>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Offerings */}
      <section style={{ backgroundColor: 'var(--light-grey)' }} className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--yellow)' }}>
              How We Work Together
            </p>
            <h2 className="text-3xl font-bold" style={{ color: 'var(--navy)' }}>
              English coaching for every stage
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {offerings.map(o => (
              <div
                key={o.name}
                className="rounded-2xl p-7 flex flex-col"
                style={o.navy ? { backgroundColor: 'var(--navy)' } : { backgroundColor: 'var(--white)', border: '1px solid #E5E7EB' }}
              >
                <span
                  className="text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full self-start mb-4"
                  style={o.navy
                    ? { backgroundColor: 'var(--yellow)', color: 'var(--navy)' }
                    : { backgroundColor: 'var(--light-grey)', color: 'var(--navy)' }}
                >
                  {o.tag}
                </span>
                <h3 className="text-xl font-bold mb-3" style={{ color: o.navy ? 'white' : 'var(--navy)' }}>{o.name}</h3>
                <p className="text-sm leading-relaxed flex-1 mb-5" style={{ color: o.navy ? 'rgba(255,255,255,0.72)' : 'var(--mid-grey)' }}>{o.desc}</p>
                <Link
                  href={o.href}
                  className="text-center font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity text-sm"
                  style={o.navy
                    ? { backgroundColor: 'var(--yellow)', color: 'var(--navy)' }
                    : { backgroundColor: 'var(--navy)', color: 'var(--white)' }}
                >
                  {o.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: 'var(--navy)' }} className="py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to sound like yourself in English?
          </h2>
          <p className="text-white/70 text-lg mb-8">
            Let&apos;s have a short call to understand where you are and where you want to be.
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
