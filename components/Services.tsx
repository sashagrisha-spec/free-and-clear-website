import Link from 'next/link'

export default function Services() {
  return (
    <section id="services" style={{ backgroundColor: 'var(--light-grey)' }} className="py-24">
      <div className="max-w-6xl mx-auto px-6">

        <div className="text-center mb-16">
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--yellow)' }}>
            What I Offer
          </p>
          <h2 className="text-4xl font-bold" style={{ color: 'var(--navy)' }}>
            Pick your starting point
          </h2>
          <p className="mt-4 text-lg max-w-xl mx-auto" style={{ color: 'var(--mid-grey)' }}>
            From a deep personal process to a daily 10-minute habit. There&apos;s something for wherever you are right now.
          </p>
        </div>

        {/* TIER 1 - Premium: 1:1 + Corporate */}
        <div className="mb-6">
          <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: 'var(--mid-grey)' }}>
            Personal &amp; Corporate
          </p>
          <div className="grid md:grid-cols-2 gap-6">

            {/* 1:1 Coaching */}
            <div
              className="rounded-2xl p-8 flex flex-col"
              style={{ backgroundColor: 'var(--navy)' }}
            >
              <span
                className="text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full self-start mb-5"
                style={{ backgroundColor: 'var(--yellow)', color: 'var(--navy)' }}
              >
                Premium 1:1
              </span>
              <h3 className="text-2xl font-bold mb-2 text-white">Personal Coaching</h3>
              <p className="text-sm font-medium mb-4" style={{ color: 'var(--yellow)' }}>
                10 sessions · Fully tailored to you
              </p>
              <p className="text-base leading-relaxed mb-6 flex-1" style={{ color: 'rgba(255,255,255,0.72)' }}>
                A deep, structured process built around exactly where you get stuck.
                We work on pronunciation and accent, fluency, psychological blocks,
                communication style and presentations. Not a course. Not a formula, but a process that fits you.
              </p>
              <ul className="space-y-2 mb-8">
                {['Pronunciation & accent', 'Speaking fluency', 'Psychological blocks', 'Presentations & high-stakes communication'].map(h => (
                  <li key={h} className="flex items-start gap-2 text-sm">
                    <span style={{ color: 'var(--yellow)' }} className="mt-0.5 flex-shrink-0">✓</span>
                    <span style={{ color: 'rgba(255,255,255,0.8)' }}>{h}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="#contact"
                className="text-center font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity"
                style={{ backgroundColor: 'var(--yellow)', color: 'var(--navy)' }}
              >
                Contact for Pricing
              </Link>
            </div>

            {/* Corporate Workshops */}
            <div
              className="rounded-2xl p-8 flex flex-col"
              style={{ backgroundColor: 'var(--white)', border: '1px solid #E5E7EB' }}
            >
              <span
                className="text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full self-start mb-5"
                style={{ backgroundColor: 'var(--light-grey)', color: 'var(--navy)' }}
              >
                Corporate
              </span>
              <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--navy)' }}>Team Workshops</h3>
              <p className="text-sm font-medium mb-4" style={{ color: 'var(--mid-grey)' }}>
                Up to 12 people · Live on Zoom · Fully customized
              </p>
              <p className="text-base leading-relaxed mb-6 flex-1" style={{ color: 'var(--mid-grey)' }}>
                Live Zoom sessions designed around your team&apos;s specific needs. Whether it&apos;s
                cross-team communication, presentation skills, or English for global calls,
                every workshop is built from scratch for your group.
              </p>
              <ul className="space-y-2 mb-8">
                {['Pronunciation & accent work', 'Fluency & communication', 'Small groups up to 12', 'Live on Zoom - fully customized'].map(h => (
                  <li key={h} className="flex items-start gap-2 text-sm">
                    <span style={{ color: 'var(--navy)' }} className="mt-0.5 flex-shrink-0">✓</span>
                    <span style={{ color: 'var(--dark-grey)' }}>{h}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="#contact"
                className="text-center font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity"
                style={{ backgroundColor: 'var(--navy)', color: 'var(--white)' }}
              >
                Contact for Pricing
              </Link>
            </div>

          </div>
        </div>

        {/* TIER 2 - Digital Courses */}
        <div className="mb-6">
          <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: 'var(--mid-grey)' }}>
            Digital Courses
          </p>
          <div className="grid md:grid-cols-2 gap-6">

            <div className="rounded-2xl p-7 flex flex-col" style={{ backgroundColor: 'var(--white)', border: '1px solid #E5E7EB' }}>
              <div className="flex items-start justify-between gap-4 mb-1">
                <h3 className="text-xl font-bold" style={{ color: 'var(--navy)' }}>Speak with Fluency &amp; Confidence</h3>
                <span className="text-xl font-bold flex-shrink-0" style={{ color: 'var(--navy)' }}>₪197</span>
              </div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: 'var(--mid-grey)' }}>
                8 chapters · English only · Intermediate+
              </p>
              <p className="text-sm leading-relaxed mb-4 flex-1" style={{ color: 'var(--mid-grey)' }}>
                Fluency, pronunciation, critical grammar and habit building. Built for people
                who know English but feel something is getting in the way.
              </p>
              <a href="https://small-talk.ravpage.co.il/speaknow" target="_blank" rel="noopener noreferrer" className="text-center font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity text-sm" style={{ backgroundColor: 'var(--navy)', color: 'var(--white)' }}>
                Get the Course
              </a>
            </div>

            <div className="rounded-2xl p-7 flex flex-col" style={{ backgroundColor: 'var(--white)', border: '1px solid #E5E7EB' }}>
              <div className="flex items-start justify-between gap-4 mb-1">
                <h3 className="text-xl font-bold" style={{ color: 'var(--navy)' }}>Small Talk קטן עליי</h3>
                <span className="text-xl font-bold flex-shrink-0" style={{ color: 'var(--navy)' }}>₪137</span>
              </div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: 'var(--mid-grey)' }}>
                English + Hebrew · All levels
              </p>
              <p className="text-sm leading-relaxed mb-4 flex-1" style={{ color: 'var(--mid-grey)' }}>
                Real phrases, popular topics, cultural differences and how to stop freezing
                the moment someone asks &ldquo;so what do you do?&rdquo;
              </p>
              <a href="https://small-talk.ravpage.co.il/smalltalkall" target="_blank" rel="noopener noreferrer" className="text-center font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity text-sm" style={{ backgroundColor: 'var(--navy)', color: 'var(--white)' }}>
                Get the Course
              </a>
            </div>

          </div>
        </div>

        {/* TIER 3 - Community & Challenge */}
        <div>
          <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: 'var(--mid-grey)' }}>
            Community &amp; Daily Practice
          </p>
          <div className="grid md:grid-cols-2 gap-6">

            <div className="rounded-2xl p-7 flex flex-col" style={{ backgroundColor: 'var(--white)', border: '1px solid #E5E7EB' }}>
              <div className="flex items-start justify-between gap-4 mb-1">
                <h3 className="text-xl font-bold" style={{ color: 'var(--navy)' }}>English Gym</h3>
                <div className="text-right flex-shrink-0">
                  <span className="text-xl font-bold" style={{ color: 'var(--navy)' }}>₪20</span>
                  <span className="text-xs block" style={{ color: 'var(--mid-grey)' }}>/month</span>
                </div>
              </div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: 'var(--mid-grey)' }}>
                Exclusive WhatsApp club · Shadowing method
              </p>
              <p className="text-sm leading-relaxed mb-4 flex-1" style={{ color: 'var(--mid-grey)' }}>
                A weekly 10-minute recording lands in your WhatsApp. You listen, you repeat.
                New topic every week. The most consistent thing you can do for your English.
              </p>
              <a href="https://small-talk.ravpage.co.il/gym" target="_blank" rel="noopener noreferrer" className="text-center font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity text-sm" style={{ backgroundColor: 'var(--navy)', color: 'var(--white)' }}>
                Join the Club
              </a>
            </div>

            <div className="rounded-2xl p-7 flex flex-col" style={{ backgroundColor: 'var(--white)', border: '1px solid #E5E7EB' }}>
              <div className="flex items-start justify-between gap-4 mb-1">
                <h3 className="text-xl font-bold" style={{ color: 'var(--navy)' }}>אתגר שמע</h3>
                <span className="text-xl font-bold flex-shrink-0" style={{ color: 'var(--navy)' }}>₪45</span>
              </div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: 'var(--mid-grey)' }}>
                21 recordings · 2 min each · All levels
              </p>
              <p className="text-sm leading-relaxed mb-4 flex-1" style={{ color: 'var(--mid-grey)' }}>
                21 recordings. 2 minutes each. One topic per recording. You listen, you repeat.
                A great place to start, even if your spoken English is more basic.
              </p>
              <a href="https://secure.cardcom.solutions/EA/EA5/PVxn8Db8UEGNxWe3KEtkPQ/PaymentSP" target="_blank" rel="noopener noreferrer" className="text-center font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity text-sm" style={{ backgroundColor: 'var(--navy)', color: 'var(--white)' }}>
                Start the Challenge
              </a>
            </div>

          </div>
        </div>

        {/* Coming Soon */}
        <div className="mt-8 grid md:grid-cols-2 gap-4">
          {[
            { title: 'Pronunciation Foundations', sub: 'Digital course - coming soon' },
            { title: 'Pronunciation Workshops', sub: 'Live on Zoom - coming very soon' },
          ].map(item => (
            <div
              key={item.title}
              className="rounded-2xl p-5 flex items-center gap-4"
              style={{ border: '2px dashed #CBD5E1' }}
            >
              <span className="text-2xl">🔜</span>
              <div>
                <p className="font-bold" style={{ color: 'var(--navy)', opacity: 0.6 }}>{item.title}</p>
                <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--mid-grey)' }}>{item.sub}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
