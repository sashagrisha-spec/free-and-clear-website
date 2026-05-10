export default function Logos() {
  const companies = [
    'Teva', 'Monday', 'Optimove', 'Glassbox', 'HoneyBook', 'Passport Card', 'SEDRIC'
  ]

  return (
    <section style={{ backgroundColor: 'var(--light-grey)' }} className="py-12 border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-center text-sm font-semibold tracking-widest uppercase mb-8" style={{ color: 'var(--mid-grey)' }}>
          Trusted by professionals from
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {companies.map((company) => (
            <span
              key={company}
              className="text-lg font-bold tracking-tight"
              style={{ color: 'var(--navy)', opacity: 0.6 }}
            >
              {company}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
