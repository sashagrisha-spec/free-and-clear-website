import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'הגייה באנגלית לדוברי עברית | Free & Clear English – Sasha Daniel',
  description: 'שיפור הגייה ומבטא באנגלית לדוברי עברית. סאשה דניאל מתמחה בעבודה על הצלילים, הקצב והשטף שיגרמו לאנגלית שלך להישמע ברורה וטבעית.',
  keywords: 'הגייה באנגלית, שיפור הגייה אנגלית, מבטא אנגלי, שיפור מבטא, אנגלית ברורה, הגייה נכונה באנגלית',
  alternates: {
    canonical: 'https://www.freeandclearenglish.com/hagaya-anglit',
  },
  openGraph: {
    title: 'הגייה באנגלית לדוברי עברית | Free & Clear English',
    description: 'שיפור הגייה ומבטא באנגלית — מותאם לדוברי עברית. סאשה דניאל.',
    url: 'https://www.freeandclearenglish.com/hagaya-anglit',
    siteName: 'Free & Clear English',
    locale: 'he_IL',
    type: 'website',
  },
}

const sounds = [
  { letter: 'P / B', detail: 'דוברי עברית נוטים לערבב בין השניים' },
  { letter: 'TH', detail: 'הצליל שלא קיים בעברית' },
  { letter: 'V / W', detail: 'בלבול נפוץ לדוברי עברית' },
  { letter: 'הטעמת מילים', detail: 'איפה שמים את ההדגשה משנה את המשמעות' },
  { letter: 'קצב המשפט', detail: 'אנגלית זורמת אחרת מעברית' },
  { letter: 'תנועות', detail: 'לאנגלית יש 15+ תנועות; לעברית פחות' },
]

const steps = [
  { num: '01', title: 'אבחון', desc: 'מתחילים בזיהוי הצלילים והדפוסים הספציפיים שמעכבים אותך — לא תרגילים גנריים, אלא הפערים שלך בלבד.' },
  { num: '02', title: 'תרגול ממוקד', desc: 'כל מפגש מתמקד במה שאת צריכה לעבוד עליו. מילים אמיתיות, משפטים אמיתיים, מצבים מהחיים שלך.' },
  { num: '03', title: 'שטף וקצב', desc: 'הגייה היא רק חלק מהעניין. אנחנו עובדות גם על הקצב הטבעי שגורם לך להישמע בטוחה וברורה.' },
  { num: '04', title: 'יישום בחיים האמיתיים', desc: 'מה שמתרגלים במפגשים עובר לפגישות, לשיחות ולמצגות — ונשאר.' },
]

export default function HagayaAnglit() {
  return (
    <>
      <Nav />

      {/* Hero */}
      <section style={{ backgroundColor: 'var(--navy)' }} className="pt-32 pb-20" dir="rtl">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: 'var(--yellow)' }}>
            הגייה באנגלית
          </p>
          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            שיפור הגייה באנגלית<br />
            <span style={{ color: 'var(--yellow)' }}>לדוברי עברית</span>
          </h1>
          <p className="text-white/75 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
            המבטא שלך לא הבעיה. הבעיה היא כשמבקשים ממך לחזור על עצמך, כשאת מהססת לפני שאת מדברת,
            כשאת מרגישה פחות מרשימה באנגלית ממה שאת בעברית. בדיוק על זה אנחנו עובדות.
          </p>
          <Link
            href="/#contact"
            style={{ backgroundColor: 'var(--yellow)', color: 'var(--navy)' }}
            className="inline-block font-bold px-8 py-4 rounded hover:opacity-90 transition-opacity text-base"
          >
            להתחיל לעבוד על ההגייה
          </Link>
        </div>
      </section>

      {/* The problem */}
      <section className="py-20 bg-white" dir="rtl">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--yellow)' }}>
                למה הגייה חשובה
              </p>
              <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--navy)' }}>
                זה לא על לאבד את המבטא. זה על להישמע ברור.
              </h2>
              <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--mid-grey)' }}>
                מבטא זה לא בעיה — לכולם יש אחד. אבל כשההגייה יוצרת חיכוך — כשלא מבינים אותך, כשאת מהססת לפני שאת מדברת, כשאת מרגישה פחות ממה שאת — זה שווה לתקן.
              </p>
              <p className="text-base leading-relaxed" style={{ color: 'var(--mid-grey)' }}>
                הגישה שלי היא ממוקדת, לא גנרית. אנחנו עובדות על הצלילים והדפוסים הספציפיים שמעכבים דוברי עברית באנגלית.
              </p>
            </div>
            <div className="space-y-3">
              {[
                'מבקשים ממך לחזור על עצמך יותר מדי',
                'את מהססת בפגישות או בשיחות',
                'את מרגישה פחות בטוחה באנגלית מאשר בעברית',
                'אנשים לפעמים שומעים אותך לא נכון',
                'את יודעת מה לומר — אבל זה לא יוצא כמו שאת רוצה',
              ].map(item => (
                <div key={item} className="flex items-start gap-3 p-4 rounded-xl" style={{ backgroundColor: 'var(--light-grey)' }}>
                  <span style={{ color: 'var(--navy)' }} className="font-bold flex-shrink-0">←</span>
                  <p style={{ color: 'var(--dark-grey)' }}>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Common sounds */}
      <section style={{ backgroundColor: 'var(--light-grey)' }} className="py-20" dir="rtl">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--yellow)' }}>
              מה אנחנו עובדות עליו
            </p>
            <h2 className="text-3xl font-bold" style={{ color: 'var(--navy)' }}>
              הצלילים שדוברי עברית מתקשים איתם הכי הרבה
            </h2>
            <p className="mt-4 text-lg max-w-xl mx-auto" style={{ color: 'var(--mid-grey)' }}>
              אלה לא אקראיים — אלה הדפוסים שנוצרים כשחושבים בעברית ומדברים אנגלית.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {sounds.map(s => (
              <div key={s.letter} className="bg-white rounded-xl p-5" style={{ border: '1px solid #E5E7EB' }}>
                <p className="text-xl font-bold mb-1" style={{ color: 'var(--navy)' }}>{s.letter}</p>
                <p className="text-sm" style={{ color: 'var(--mid-grey)' }}>{s.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-white" dir="rtl">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--yellow)' }}>
              איך זה עובד
            </p>
            <h2 className="text-3xl font-bold" style={{ color: 'var(--navy)' }}>
              תהליך שיפור ההגייה
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {steps.map(s => (
              <div key={s.num} className="rounded-2xl p-7" style={{ backgroundColor: 'var(--light-grey)' }}>
                <p className="text-4xl font-bold mb-3" style={{ color: 'var(--yellow)', opacity: 0.6 }}>{s.num}</p>
                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--navy)' }}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--mid-grey)' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: 'var(--navy)' }} className="py-20" dir="rtl">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            מוכנה לעבוד על ההגייה?
          </h2>
          <p className="text-white/70 text-lg mb-4">
            תוכנית הקואצ׳ינג האישי כוללת עבודה מעמיקה על הגייה כחלק מרכזי בתהליך.
          </p>
          <p className="text-white/50 text-sm mb-8">
            10 מפגשים · מותאם לצרכים הספציפיים שלך
          </p>
          <Link
            href="/#contact"
            style={{ backgroundColor: 'var(--yellow)', color: 'var(--navy)' }}
            className="inline-block font-bold px-10 py-4 rounded hover:opacity-90 transition-opacity text-lg"
          >
            לדברי עם סאשה
          </Link>
        </div>
      </section>

      <Footer />
    </>
  )
}
