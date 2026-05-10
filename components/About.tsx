import Image from 'next/image'
import Link from 'next/link'

export default function About() {
  return (
    <section id="about" className="py-24" style={{ backgroundColor: 'var(--white)' }}>
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

        {/* Image */}
        <div className="relative">
          <div
            className="relative w-full h-[500px] rounded-2xl overflow-hidden"
            style={{ backgroundColor: '#e8edf5' }}
          >
            <Image
              src="/images/sasha-2.jpg"
              alt="Sasha Daniel laughing"
              fill
              className="object-cover object-top"
            />
          </div>
          <div
            style={{ backgroundColor: 'var(--yellow)' }}
            className="absolute -bottom-6 -right-6 w-32 h-32 rounded-2xl -z-10"
          />
        </div>

        {/* Text */}
        <div>
          <p
            className="text-xs font-bold tracking-widest uppercase mb-3"
            style={{ color: 'var(--yellow)' }}
          >
            About Sasha
          </p>
          <h2 className="text-4xl font-bold mb-6" style={{ color: 'var(--navy)' }}>
            I&apos;m not an English teacher.<br />I&apos;m a communication coach.
          </h2>
          <p className="text-lg leading-relaxed mb-5" style={{ color: 'var(--mid-grey)' }}>
            There&apos;s a difference. Teachers explain grammar.
            I help you sound like yourself in English: confident, clear, and fully present.
          </p>
          <p className="text-lg leading-relaxed mb-5" style={{ color: 'var(--mid-grey)' }}>
            My clients are managers, founders, doctors and executives who already speak English
            but feel like they&apos;re leaving something on the table every time they open their
            mouth in a meeting or on a call.
          </p>
          <p className="text-lg leading-relaxed mb-8" style={{ color: 'var(--mid-grey)' }}>
            The gap between who you are and how you come across? That&apos;s exactly what we close together.
          </p>
          <Link
            href="#contact"
            style={{ backgroundColor: 'var(--navy)', color: 'var(--white)' }}
            className="font-bold px-8 py-4 rounded hover:opacity-90 transition-opacity inline-block"
          >
            Work With Me
          </Link>
        </div>

      </div>
    </section>
  )
}
