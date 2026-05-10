const testimonials = [
  {
    quote:
      "Studying with Sasha had a profound impact on my professional life. I've become much more confident and efficient in preparing for presentations, classes and talks in English.",
    name: 'Yohai Sabag',
    title: 'Former VP, Optimove',
    initial: 'Y',
  },
  {
    quote:
      "With Sasha I learned that there is always a 'Next Level'. Highly recommended coach.",
    name: 'Nir Laznik',
    title: 'Co-Founder & CEO, Sedric',
    initial: 'N',
  },
  {
    quote:
      "Every single person in the company should take this course with Sasha even if their English is good. Her approach is so unique and anyone can get better.",
    name: 'Neta',
    title: 'Course Participant, Glassbox',
    initial: 'N',
  },
]

export default function Testimonials() {
  return (
    <section id="testimonials" style={{ backgroundColor: 'var(--white)' }} className="py-24">
      <div className="max-w-6xl mx-auto px-6">

        <div className="text-center mb-14">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-3"
            style={{ color: 'var(--yellow)' }}
          >
            Real Results
          </p>
          <h2 className="text-4xl font-bold" style={{ color: 'var(--navy)' }}>
            What happens when the gap closes
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl p-8 flex flex-col"
              style={{ backgroundColor: 'var(--light-grey)', border: '1px solid #E5E7EB' }}
            >
              <p style={{ color: 'var(--yellow)' }} className="text-4xl font-serif mb-4 leading-none">&ldquo;</p>
              <p className="text-base leading-relaxed mb-6 flex-1" style={{ color: 'var(--dark-grey)' }}>
                {t.quote}
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ backgroundColor: 'var(--navy)' }}
                >
                  {t.initial}
                </div>
                <div>
                  <p className="font-bold text-sm" style={{ color: 'var(--navy)' }}>{t.name}</p>
                  <p className="text-xs" style={{ color: 'var(--mid-grey)' }}>{t.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
