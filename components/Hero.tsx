import Image from 'next/image'
import Link from 'next/link'

export default function Hero() {
  return (
    <section
      style={{ backgroundColor: 'var(--navy)' }}
      className="min-h-screen pt-20 flex items-center"
    >
      <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">

        {/* Text */}
        <div className="order-2 md:order-1">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-4"
            style={{ color: 'var(--yellow)' }}
          >
            English Communication Coaching
          </p>
          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            You know English.<br />
            <span style={{ color: 'var(--yellow)' }}>Now let&apos;s make it<br />sound like you.</span>
          </h1>
          <p className="text-white/75 text-lg leading-relaxed mb-8 max-w-md">
            For 8 years I&apos;ve worked with entrepreneurs, CEOs, CFOs, founders,
            lecturers and doctors who are sharp, experienced, and impressive in Hebrew
            but feel like a smaller version of themselves the moment they switch to English.
            That&apos;s the thing we fix.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="#contact"
              style={{ backgroundColor: 'var(--yellow)', color: 'var(--navy)' }}
              className="font-bold px-8 py-4 rounded hover:opacity-90 transition-opacity text-base"
            >
              Let&apos;s Talk
            </Link>
            <Link
              href="#services"
              className="text-white border border-white/30 font-semibold px-8 py-4 rounded hover:border-white transition-colors text-base"
            >
              See What I Offer
            </Link>
          </div>

          {/* Quick stats */}
          <div className="mt-12 flex gap-10">
            <div>
              <p className="text-white text-3xl font-bold">500+</p>
              <p className="text-white/50 text-sm mt-1">Professionals coached</p>
            </div>
            <div>
              <p className="text-white text-3xl font-bold">8</p>
              <p className="text-white/50 text-sm mt-1">Years of experience</p>
            </div>
            <div>
              <p style={{ color: 'var(--yellow)' }} className="text-3xl font-bold">1</p>
              <p className="text-white/50 text-sm mt-1">Method that actually works</p>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="order-1 md:order-2 flex justify-center md:justify-end">
          <div className="relative w-72 h-96 md:w-80 md:h-[480px] lg:w-96 lg:h-[560px]">
            <div
              style={{ backgroundColor: 'var(--yellow)', opacity: 0.15 }}
              className="absolute inset-0 rounded-2xl translate-x-4 translate-y-4"
            />
            <div
              className="relative w-full h-full rounded-2xl overflow-hidden"
              style={{ backgroundColor: '#2a4470' }}
            >
              <Image
                src="/images/sasha-1.jpg"
                alt="Sasha Daniel - Free & Clear English"
                fill
                className="object-cover object-top"
                priority
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
