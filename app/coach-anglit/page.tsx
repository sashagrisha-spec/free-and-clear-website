import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: "קואצ'ר אנגלית לאנשי מקצוע | Free & Clear English – Sasha Daniel",
  description: "קואצ'ר אנגלית לאנשי מקצוע בישראל. סאשה דניאל עוזרת למנהלים, יזמים, רופאים ומנהלות לדבר אנגלית בביטחון ובהירות. 8 שנות ניסיון, 500+ אנשי מקצוע.",
  keywords: "קואצ'ר אנגלית, מאמן אנגלית, קואצ'ינג אנגלית, שיפור אנגלית, אנגלית לאנשי מקצוע, English coach Israel",
  alternates: {
    canonical: 'https://www.freeandclearenglish.com/coach-anglit',
  },
  openGraph: {
    title: "קואצ'ר אנגלית לאנשי מקצוע | Free & Clear English",
    description: "קואצ'ר אנגלית לדוברי עברית. סאשה דניאל – 8 שנים, 500+ אנשי מקצוע.",
    url: 'https://www.freeandclearenglish.com/coach-anglit',
    siteName: 'Free & Clear English',
    locale: 'he_IL',
    type: 'website',
  },
}

const clients = [
  { role: 'מנכ"ל', detail: 'מציג בפני משקיעים בחו"ל' },
  { role: 'מנהל כספים', detail: 'מוביל שיחות גלובליות' },
  { role: 'רופא', detail: 'מציג בכנסים בינלאומיים' },
  { role: 'יזם', detail: 'מגייס ומנהל צוותים דוברי אנגלית' },
  { role: 'מנהל', detail: 'תקשורת בין-תרבותית' },
  { role: 'מרצה', detail: 'הרצאות ומצגות באנגלית' },
]

export default function CoachAnglit() {
  return (
    <>
      <Nav />

      {/* Hero */}
      <section style={{ backgroundColor: 'var(--navy)' }} className="pt-32 pb-20" dir="rtl">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: 'var(--yellow)' }}>
            קואצ׳ר אנגלית · ישראל
          </p>
          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            קואצ׳ר אנגלית<br />
            <span style={{ color: 'var(--yellow)' }}>לאנשי מקצוע בישראל</span>
          </h1>
          <p className="text-white/75 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
            את חדה, מנוסה ומרשימה בעברית. אבל ברגע שאת עוברת לאנגלית — משהו הולך לאיבוד.
            זה לא בעיית שפה. זה בדיוק מה שאנחנו מתקנות.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/#contact"
              style={{ backgroundColor: 'var(--yellow)', color: 'var(--navy)' }}
              className="font-bold px-8 py-4 rounded hover:opacity-90 transition-opacity text-base"
            >
              בואי נדבר
            </Link>
            <Link
              href="/#services"
              className="text-white border border-white/30 font-semibold px-8 py-4 rounded hover:border-white transition-colors text-base"
            >
              לכל התוכניות
            </Link>
          </div>

          <div className="mt-14 flex flex-wrap justify-center gap-10">
            <div>
              <p className="text-white text-3xl font-bold">500+</p>
              <p className="text-white/50 text-sm mt-1">אנשי מקצוע שעברו אצלי</p>
            </div>
            <div>
              <p className="text-white text-3xl font-bold">8</p>
              <p className="text-white/50 text-sm mt-1">שנות ניסיון</p>
            </div>
            <div>
              <p style={{ color: 'var(--yellow)' }} className="text-3xl font-bold">ישראל</p>
              <p className="text-white/50 text-sm mt-1">מבוססת, מאמנת בזום</p>
            </div>
          </div>
        </div>
      </section>

      {/* For whom */}
      <section style={{ backgroundColor: 'var(--light-grey)' }} className="py-20" dir="rtl">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--yellow)' }}>
              עבור מי
            </p>
            <h2 className="text-3xl font-bold" style={{ color: 'var(--navy)' }}>
              לאנשי מקצוע שכבר יודעים אנגלית — אבל רוצים לדבר אותה אחרת
            </h2>
            <p className="mt-4 text-lg max-w-xl mx-auto" style={{ color: 'var(--mid-grey)' }}>
              הלקוחות שלי לא צריכים שיעורי דקדוק. הם צריכים להישמע בביטחון באנגלית כמו שהם נשמעים בעברית.
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
      <section className="py-20 bg-white" dir="rtl">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--yellow)' }}>
                על סאשה
              </p>
              <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--navy)' }}>
                קואצ׳ר אנגלית שמבינה את המוח הדובר עברית
              </h2>
              <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--mid-grey)' }}>
                אני סאשה דניאל. במשך 8 שנים אימנתי מעל 500 אנשי מקצוע דוברי עברית — מנכ"לים, רופאים, יזמים, מנהלי כספים — שצלולים באנגלית אבל מרגישים פער בין מי שהם בעברית לבין איך שהם נשמעים באנגלית.
              </p>
              <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--mid-grey)' }}>
                העבודה שלי היא לא על דקדוק. היא על הגייה, שטף, ביטחון — ועל לגרום לאנגלית שלך להרגיש כמו שלך.
              </p>
              <Link
                href="/#contact"
                style={{ backgroundColor: 'var(--navy)', color: 'var(--white)' }}
                className="inline-block font-bold px-8 py-4 rounded hover:opacity-90 transition-opacity"
              >
                לשיחת היכרות
              </Link>
            </div>
            <div className="space-y-4">
              {[
                'הגייה ומבטא מותאמים לדוברי עברית',
                'שטף ובטחון בשיחות ובמצגות',
                'עבודה על חסמים פסיכולוגיים',
                'זמין לכל הארץ דרך זום',
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

      {/* Programs */}
      <section style={{ backgroundColor: 'var(--light-grey)' }} className="py-20" dir="rtl">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--yellow)' }}>
              תוכניות
            </p>
            <h2 className="text-3xl font-bold" style={{ color: 'var(--navy)' }}>
              קואצ׳ינג אנגלית לכל שלב
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { tag: 'פרמיום 1:1', name: 'קואצ׳ינג אישי', desc: '10 מפגשים מותאמים אישית. הגייה, שטף, חסמים פסיכולוגיים ותקשורת בסיטואציות קריטיות.', cta: 'לפרטים ומחיר', navy: true },
              { tag: 'קורפורייט', name: 'סדנאות לצוותים', desc: 'מפגשי זום לקבוצות עד 12 איש, מותאמים לצרכי הצוות שלך.', cta: 'לפרטים ומחיר', navy: false },
              { tag: 'קורסים דיגיטליים', name: 'קורסים מוקלטים', desc: 'קורסים בקצב שלך — שטף, הגייה ו-small talk. מתחיל מ-₪137.', cta: 'לכל הקורסים', navy: false },
            ].map(o => (
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
                  href={o.navy ? '/#contact' : '/#services'}
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
      <section style={{ backgroundColor: 'var(--navy)' }} className="py-20" dir="rtl">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            מוכנה לדבר אנגלית כמו שאת באמת?
          </h2>
          <p className="text-white/70 text-lg mb-8">
            שיחה קצרה כדי להבין איפה את עומדת ולאן את רוצה להגיע.
          </p>
          <Link
            href="/#contact"
            style={{ backgroundColor: 'var(--yellow)', color: 'var(--navy)' }}
            className="inline-block font-bold px-10 py-4 rounded hover:opacity-90 transition-opacity text-lg"
          >
            צרי קשר
          </Link>
        </div>
      </section>

      <Footer />
    </>
  )
}
