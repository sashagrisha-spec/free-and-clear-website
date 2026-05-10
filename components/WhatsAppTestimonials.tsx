import Image from 'next/image'

const screenshots = [
  { src: '/images/testimonials/sr1.jpg', alt: 'תלמידה 3' },
  { src: '/images/testimonials/sr3.jpg', alt: 'תלמידה ממליצה 2' },
  { src: '/images/testimonials/sr2.jpg', alt: 'תלמידה ממליצה' },
  { src: '/images/testimonials/sr4.jpg', alt: 'תרגולים אש' },
  { src: '/images/testimonials/sr5.jpg', alt: 'נמרוד המלצה' },
]

export default function WhatsAppTestimonials() {
  return (
    <section style={{ backgroundColor: 'var(--light-grey)' }} className="py-24">
      <div className="max-w-6xl mx-auto px-6">

        <div className="text-center mb-14">
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--yellow)' }}>
            Direct from Students
          </p>
          <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--navy)' }}>
            Real messages. Zero editing.
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--mid-grey)' }}>
            These are actual messages from students. The kind you send when something genuinely changes.
          </p>
        </div>

        <div className="columns-2 md:columns-3 gap-4 space-y-4">
          {screenshots.map((s, i) => (
            <div
              key={i}
              className="break-inside-avoid rounded-2xl overflow-hidden shadow-sm"
              style={{ border: '1px solid #E5E7EB' }}
            >
              <Image
                src={s.src}
                alt={s.alt}
                width={400}
                height={600}
                className="w-full h-auto"
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
