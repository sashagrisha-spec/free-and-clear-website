import Link from 'next/link'

// Launch block for The Sound of English, the first thing under the nav.
// Launch price runs until 25.10.2026; the price rises to 247 on 26.10.
export default function LaunchBanner() {
  return (
    <section style={{ backgroundColor: 'var(--navy)' }} className="pt-24 px-6">
      <div
        className="relative overflow-hidden max-w-6xl mx-auto rounded-3xl px-6 py-10 md:py-12 text-center"
        style={{
          background: 'linear-gradient(135deg, #F5C842 0%, #FFE08A 50%, #F5C842 100%)',
          boxShadow: '0 22px 55px -22px rgba(245,200,66,0.75)',
        }}
      >
        {/* Confetti dots, so the block reads as a celebration. */}
        <span
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(rgba(27,48,84,0.18) 2px, transparent 2px), radial-gradient(rgba(255,255,255,0.7) 3px, transparent 3px)',
            backgroundSize: '38px 38px, 61px 61px',
            backgroundPosition: '0 0, 19px 27px',
          }}
        />

        <div className="relative">
          <span
            className="inline-block text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-5"
            style={{ backgroundColor: 'var(--navy)', color: 'var(--yellow)' }}
          >
            🎉 Out now · Launch price
          </span>

          <h2 className="text-3xl md:text-5xl font-black leading-tight" style={{ color: 'var(--navy)' }}>
            The Sound of English is here!
          </h2>

          <p className="mt-3 text-base md:text-lg font-semibold" style={{ color: 'var(--navy)', opacity: 0.8 }}>
            My new pronunciation course · 34 short videos · One sound at a time
          </p>

          <p className="mt-6 flex items-baseline justify-center gap-3">
            <span className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--navy)', opacity: 0.4, textDecoration: 'line-through' }}>₪247</span>
            <span className="text-6xl md:text-7xl font-black leading-none" style={{ color: 'var(--navy)' }}>₪97</span>
          </p>

          <p className="mt-3 text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--navy)', opacity: 0.75 }}>
            Launch price until October 25
          </p>

          <Link
            href="/the-sound-of-english"
            className="inline-block mt-7 font-bold text-lg py-4 px-12 rounded-xl hover:opacity-90 transition-opacity"
            style={{ backgroundColor: 'var(--navy)', color: 'var(--white)' }}
          >
            Get the Course
          </Link>
        </div>
      </div>
    </section>
  )
}
