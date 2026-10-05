import Link from 'next/link'

// The two smaller digital courses. The Sound of English has no href on purpose:
// it is not out yet, so the card shows its release date instead of a button.
// On 11.10.2026 give it href: 'https://www.freeandclearenglish.com/the-sound-of-english'
// and drop releaseNote.
const DIGITAL_COURSES: Array<{
  title: string
  meta: string
  desc: string
  price: number
  oldPrice: number
  href?: string
  releaseNote?: string
}> = [
  {
    title: 'The Sound of English',
    meta: 'Hebrew explanations · English practice · Intermediate+',
    desc: 'My new pronunciation course. 34 short videos, one sound at a time: first what your mouth actually has to do, then practice out loud with me. An hour and a half in all, plus practice sheets, yours forever. The launch price holds for two weeks only.',
    price: 97,
    oldPrice: 247,
    releaseNote: 'Out October 11',
  },
  {
    title: 'Small Talk קטן עליי',
    meta: 'English + Hebrew · Beginners+',
    desc: 'For people who understand and speak a little but freeze up, even on the simplest topics. Real phrases, popular topics and cultural differences, so you stop dreading \u201cso what do you do?\u201d',
    price: 187,
    oldPrice: 237,
    href: 'https://small-talk.ravpage.co.il/smalltalkall',
  },
]

// Namespaced to this section. The point is SYMMETRY: the two cards borrow the
// grid's own rows, so title, price, text and button line up exactly.
const CSS = `
.home-courses-pair {
  display: grid;
  gap: 1.5rem;
}

.home-course-card {
  display: flex;
  flex-direction: column;
}

@media (min-width: 768px) {
  .home-courses-pair {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-template-rows: auto auto 1fr auto;
  }

  @supports (grid-template-rows: subgrid) {
    .home-course-card {
      display: grid;
      grid-template-rows: subgrid;
      grid-row: span 4;
      row-gap: 0;
    }
  }
}
`

export default function Services() {
  return (
    <section id="services" style={{ backgroundColor: 'var(--light-grey)' }} className="py-24">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
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
          <p className="text-lg md:text-xl font-bold tracking-wide uppercase mb-5" style={{ color: 'var(--navy)' }}>
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
                href="/#contact"
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
                href="/#contact"
                className="text-center font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity"
                style={{ backgroundColor: 'var(--navy)', color: 'var(--white)' }}
              >
                Contact for Pricing
              </Link>
            </div>

          </div>

          {/* Small Group Cohort */}
          <div className="mt-6 rounded-2xl p-8" style={{ backgroundColor: 'var(--white)', border: '1px solid #E5E7EB' }}>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
              <div className="flex-1">
                <span
                  className="text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full inline-block mb-5"
                  style={{ backgroundColor: 'var(--yellow)', color: 'var(--navy)' }}
                >
                  Small Group
                </span>
                <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--navy)' }}>Small Group Cohort</h3>
                <p className="text-sm font-medium mb-4" style={{ color: 'var(--mid-grey)' }}>
                  3 to 6 people · 8 sessions · 1 hr 20 min each · Over 8 weeks · Intermediate+
                </p>
                <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--mid-grey)' }}>
                  An intimate Zoom cohort of just 3 to 6 people. Over 8 weeks we work on speaking fluency,
                  pronunciation, releasing the psychological blocks that show up in front of a group,
                  presentation skills and more. Small enough that everyone speaks, every session.
                </p>
                <ul className="space-y-2">
                  {['Speaking fluency', 'Pronunciation & accent', 'Releasing blocks in front of a group', 'Presentations & more'].map(h => (
                    <li key={h} className="flex items-start gap-2 text-sm">
                      <span style={{ color: 'var(--navy)' }} className="mt-0.5 flex-shrink-0">✓</span>
                      <span style={{ color: 'var(--dark-grey)' }}>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-shrink-0 flex flex-col md:items-end md:text-right">
                <span className="text-3xl font-bold" style={{ color: 'var(--navy)' }}>₪2,700</span>
                <span className="text-xs font-semibold uppercase tracking-wide mb-5" style={{ color: 'var(--mid-grey)' }}>
                  Full 8-week cohort
                </span>
                <Link
                  href="/#contact"
                  className="text-center font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: 'var(--navy)', color: 'var(--white)' }}
                >
                  Reserve Your Spot
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Digital Courses - beginner-friendly first, then the advanced course */}
        <div>
          <p className="text-lg md:text-xl font-bold tracking-wide uppercase mb-5" style={{ color: 'var(--navy)' }}>
            Digital Courses
          </p>

          {/* NEW launch: יאללה, לחזור אחרי - the most prominent card (yellow) */}
          <div
            dir="rtl"
            className="mb-6 rounded-2xl p-8"
            style={{ backgroundColor: 'var(--yellow)', boxShadow: '0 22px 55px -22px rgba(245,200,66,0.75)' }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex-1">
                <span
                  className="inline-block text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-4"
                  style={{ backgroundColor: 'var(--navy)', color: 'var(--yellow)' }}
                >
                  ⭐ הכי מבוקש
                </span>
                <h3 className="text-3xl font-bold mb-2" style={{ color: 'var(--navy)' }}>יאללה, לחזור אחרי!</h3>
                <p className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--navy)', opacity: 0.7 }}>
                  55 הקלטות בשיטת Shadowing · לשיפור הדיבור
                </p>
                <p className="text-base leading-relaxed" style={{ color: 'var(--navy)', opacity: 0.9, maxWidth: 470 }}>
                  מקשיבים, חוזרים אחרי בקול, והפה סוף סוף מתאמן בדיבור. 10 דקות ביום, בקצב שלכם, ושלכם לתמיד.
                </p>
              </div>
              <div className="flex-shrink-0 flex flex-col md:items-center text-center">
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--navy)', opacity: 0.7 }}>
                  פחות מ-₪3.1 לאימון
                </span>
                <span className="flex items-baseline justify-center gap-2 my-1">
                  <span className="text-2xl font-bold" style={{ color: 'var(--navy)', opacity: 0.4, textDecoration: 'line-through' }}>₪197</span>
                  <span className="text-5xl font-black leading-none" style={{ color: 'var(--navy)' }}>₪167</span>
                </span>
                <span className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--navy)', opacity: 0.7 }}>
                  תשלום חד-פעמי
                </span>
                <Link
                  href="/yalla-lachzor-acharei"
                  className="text-center font-bold py-3.5 px-10 rounded-lg hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: 'var(--navy)', color: 'var(--white)' }}
                >
                  רוצה להתחיל 👈
                </Link>
              </div>
            </div>
          </div>

          {/* The two smaller courses, side by side. Every row of one card is
              literally the same grid row as that row of the other (subgrid), so
              the price, the text and the button can never drift apart. */}
          <div className="home-courses-pair">
            {DIGITAL_COURSES.map(course => (
              <div
                key={course.title}
                className="home-course-card rounded-2xl"
                style={{ backgroundColor: 'var(--white)', border: '1px solid #E5E7EB' }}
              >
                <div className="px-7 pt-7 flex items-start justify-between gap-4">
                  <h3 className="text-xl font-bold" style={{ color: 'var(--navy)' }}>{course.title}</h3>
                  <span className="flex items-baseline gap-2 flex-shrink-0">
                    <span className="text-base font-bold" style={{ color: 'var(--navy)', opacity: 0.4, textDecoration: 'line-through' }}>₪{course.oldPrice}</span>
                    <span className="text-xl font-bold" style={{ color: 'var(--navy)' }}>₪{course.price}</span>
                  </span>
                </div>

                <p className="px-7 pt-1 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--mid-grey)' }}>
                  {course.meta}
                </p>

                <p className="px-7 pt-4 text-sm leading-relaxed" style={{ color: 'var(--mid-grey)' }}>
                  {course.desc}
                </p>

                <div className="px-7 pt-5 pb-7">
                  {course.href ? (
                    <a
                      href={course.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity text-sm"
                      style={{ backgroundColor: 'var(--navy)', color: 'var(--white)' }}
                    >
                      Get the Course
                    </a>
                  ) : (
                    /* Not out yet, so there is no way to buy from here. Same box as
                       the button beside it, but plainly not a button. */
                    <span
                      className="block text-center font-bold py-3 px-6 rounded-lg text-sm"
                      style={{ backgroundColor: 'rgba(245,200,66,0.18)', color: 'var(--navy)', border: '2px dashed var(--yellow)' }}
                    >
                      ⏳ {course.releaseNote}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coming Soon */}
        <div className="mt-8 grid gap-4">
          {[
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
