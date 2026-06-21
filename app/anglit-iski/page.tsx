import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'אנגלית עסקית לאנשי מקצוע בישראל | Free & Clear English – Sasha Daniel',
  description: 'אנגלית עסקית למנהלים, יזמים וצוותים בישראל. קואצ׳ינג אישי וסדנאות קורפורייט. סאשה דניאל – 8 שנים, 500+ אנשי מקצוע.',
  keywords: 'אנגלית עסקית, אנגלית לעסקים, אנגלית לאנשי הייטק, סדנאות אנגלית לחברות, הדרכת אנגלית בישראל, business English Israel',
  alternates: {
    canonical: 'https://www.freeandclearenglish.com/anglit-iski',
  },
  openGraph: {
    title: 'אנגלית עסקית לאנשי מקצוע | Free & Clear English',
    description: 'אנגלית עסקית למנהלים, יזמים וצוותים בישראל. קואצ׳ינג אישי וסדנאות.',
    url: 'https://www.freeandclearenglish.com/anglit-iski',
    siteName: 'Free & Clear English',
    locale: 'he_IL',
    type: 'website',
  },
}

const situations = [
  'שיחות גלובליות שאת רוצה להוביל בביטחון',
  'פיצ׳ים למשקיעים ושיחות גיוס הון',
  'מצגות וכנסים בינלאומיים',
  'גיוס וניהול עובדים דוברי אנגלית',
  'שיחות מכירה עם לקוחות בינלאומיים',
  'תקשורת יומיומית — Slack, מייל, כתיבה',
]

const faq = [
  { q: 'למי מיועדות הסדנאות?', a: 'לצוותים עד 12 איש שצריכים לשפר את התקשורת שלהם באנגלית — מחלקות, צוותי מוצר, R&D, מכירות ועוד.' },
  { q: 'מה מכסה סדנה?', a: 'כל סדנה נבנית מאפס. נושאים נפוצים: הגייה ובהירות, תקשורת בין-תרבותית, מצגות, ביטחון בשיחות גלובליות.' },
  { q: 'איך זה מועבר?', a: 'לייב בזום. אינטראקטיבי לחלוטין. לא הרצאה — מפגש עבודה אמיתי שהצוות שלך לומד ממנו.' },
  { q: 'אפשר סדרה של מפגשים?', a: 'כן. חלק מהלקוחות עושים סדנאות רבעוניות, אחרים מעדיפים פורמט אינטנסיבי. נבנה מה שמתאים לחברה שלך.' },
]

export default function AnglitIski() {
  return (
    <>
      <Nav />

      {/* Hero */}
      <section style={{ backgroundColor: 'var(--navy)' }} className="pt-32 pb-20" dir="rtl">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: 'var(--yellow)' }}>
            אנגלית עסקית · ישראל
          </p>
          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            אנגלית עסקית<br />
            <span style={{ color: 'var(--yellow)' }}>לאנשי מקצוע ישראלים</span>
          </h1>
          <p className="text-white/75 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
            את מנהלת שיחות גלובליות, מובילה צוותים בינלאומיים, מציגה בפני משקיעים זרים.
            האנגלית שלך טובה. אבל "טובה" זה לא אותו דבר כמו בטוחה, ברורה ומרשימה. את הפער הזה אנחנו סוגרות.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/#contact"
              style={{ backgroundColor: 'var(--yellow)', color: 'var(--navy)' }}
              className="font-bold px-8 py-4 rounded hover:opacity-90 transition-opacity text-base"
            >
              צרי קשר
            </Link>
            <Link
              href="/#services"
              className="text-white border border-white/30 font-semibold px-8 py-4 rounded hover:border-white transition-colors text-base"
            >
              לכל התוכניות
            </Link>
          </div>
        </div>
      </section>

      {/* Situations */}
      <section className="py-20 bg-white" dir="rtl">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--yellow)' }}>
              איפה זה מתבטא
            </p>
            <h2 className="text-3xl font-bold" style={{ color: 'var(--navy)' }}>
              המצבים העסקיים שבהם אנגלית שטופה משנה הכל
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {situations.map(s => (
              <div key={s} className="flex items-start gap-3 p-4 rounded-xl" style={{ backgroundColor: 'var(--light-grey)' }}>
                <span style={{ color: 'var(--yellow)', backgroundColor: 'var(--navy)' }} className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">✓</span>
                <p style={{ color: 'var(--dark-grey)' }}>{s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Two paths */}
      <section style={{ backgroundColor: 'var(--light-grey)' }} className="py-20" dir="rtl">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--yellow)' }}>
              איך עובדים יחד
            </p>
            <h2 className="text-3xl font-bold" style={{ color: 'var(--navy)' }}>
              קואצ׳ינג אישי או סדנה לצוות — את בוחרת
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl p-8 flex flex-col" style={{ backgroundColor: 'var(--navy)' }}>
              <span className="text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full self-start mb-5" style={{ backgroundColor: 'var(--yellow)', color: 'var(--navy)' }}>
                פרמיום 1:1
              </span>
              <h3 className="text-2xl font-bold mb-2 text-white">קואצ׳ינג אנגלית עסקית אישי</h3>
              <p className="text-sm font-medium mb-4" style={{ color: 'var(--yellow)' }}>
                10 מפגשים · מותאם לך לחלוטין
              </p>
              <p className="text-base leading-relaxed mb-6 flex-1" style={{ color: 'rgba(255,255,255,0.72)' }}>
                תהליך מובנה סביב האתגרים העסקיים הספציפיים שלך. הגייה, שטף, מצגות, חסמים פסיכולוגיים — כל מה שעומד בדרך.
              </p>
              <ul className="space-y-2 mb-8">
                {['הגייה ומבטא', 'שטף תחת לחץ', 'הכנה למצגות קריטיות', 'ביטחון בשיחות גלובליות'].map(h => (
                  <li key={h} className="flex items-start gap-2 text-sm">
                    <span style={{ color: 'var(--yellow)' }} className="mt-0.5 flex-shrink-0">✓</span>
                    <span style={{ color: 'rgba(255,255,255,0.8)' }}>{h}</span>
                  </li>
                ))}
              </ul>
              <Link href="/#contact" className="text-center font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity" style={{ backgroundColor: 'var(--yellow)', color: 'var(--navy)' }}>
                לפרטים ומחיר
              </Link>
            </div>

            <div className="rounded-2xl p-8 flex flex-col" style={{ backgroundColor: 'var(--white)', border: '1px solid #E5E7EB' }}>
              <span className="text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full self-start mb-5" style={{ backgroundColor: 'var(--light-grey)', color: 'var(--navy)' }}>
                קורפורייט
              </span>
              <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--navy)' }}>סדנאות לצוותים</h3>
              <p className="text-sm font-medium mb-4" style={{ color: 'var(--mid-grey)' }}>
                עד 12 משתתפים · לייב בזום · מותאם אישית
              </p>
              <p className="text-base leading-relaxed mb-6 flex-1" style={{ color: 'var(--mid-grey)' }}>
                סדנאות לייב שנבנות סביב הצרכים הספציפיים של הצוות שלך. תקשורת בין-תרבותית, מצגות, אנגלית לשיחות גלובליות.
              </p>
              <ul className="space-y-2 mb-8">
                {['הגייה ובהירות לצוות', 'תקשורת בין-תרבותית', 'קבוצות עד 12 משתתפים', 'לייב בזום, מותאם לחלוטין'].map(h => (
                  <li key={h} className="flex items-start gap-2 text-sm">
                    <span style={{ color: 'var(--navy)' }} className="mt-0.5 flex-shrink-0">✓</span>
                    <span style={{ color: 'var(--dark-grey)' }}>{h}</span>
                  </li>
                ))}
              </ul>
              <Link href="/#contact" className="text-center font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity" style={{ backgroundColor: 'var(--navy)', color: 'var(--white)' }}>
                לפרטים ומחיר
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white" dir="rtl">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--yellow)' }}>
              שאלות נפוצות
            </p>
            <h2 className="text-3xl font-bold" style={{ color: 'var(--navy)' }}>
              על סדנאות הצוות
            </h2>
          </div>
          <div className="space-y-4">
            {faq.map(item => (
              <div key={item.q} className="rounded-xl p-6" style={{ backgroundColor: 'var(--light-grey)' }}>
                <p className="font-bold mb-2" style={{ color: 'var(--navy)' }}>{item.q}</p>
                <p style={{ color: 'var(--mid-grey)' }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: 'var(--navy)' }} className="py-20" dir="rtl">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            בואי נדבר על האנגלית שלך או של הצוות
          </h2>
          <p className="text-white/70 text-lg mb-8">
            בין אם מדובר בקואצ׳ינג אישי או בסדנה לחברה — נמצא את מה שמתאים לך.
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
