import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Practice Pods - תרגול אנגלית עם אנשים כמוכם | Free & Clear English',
  description: 'מרחב תרגול מסודר לדוברי עברית שרוצים לפתוח את הפה ולדבר אנגלית. פגישות זום פעמיים בשבוע, 30 דקות, בחדרים קטנים עם שותפים למסע.',
  alternates: {
    canonical: 'https://www.freeandclearenglish.com/practice-pods',
  },
  openGraph: {
    title: 'Practice Pods | Free & Clear English',
    description: 'קבוצת תרגול אנגלית שנפגשת פעמיים בשבוע בזום. לא שיעור, לא מורה - שותפים למסע.',
    url: 'https://www.freeandclearenglish.com/practice-pods',
    siteName: 'Free & Clear English',
    locale: 'he_IL',
    type: 'website',
  },
}

const SESSIONS_URL = 'https://free-and-clear-sessions.vercel.app/sessions'

export default function PracticePodsPage() {
  return (
    <>
      <Nav />

      {/* Hero */}
      <section style={{ backgroundColor: 'var(--navy)' }} className="pt-32 pb-20 px-6" dir="rtl">
        <div className="max-w-3xl mx-auto text-center">
          <span
            className="text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-6 inline-block"
            style={{ backgroundColor: 'var(--yellow)', color: 'var(--navy)' }}
          >
            Practice Pods
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
            מתים לתרגל אנגלית<br />
            אבל אין לכם עם מי?
          </h1>
          <p className="text-lg md:text-xl leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.82)' }}>
            פשוט לפתוח את הפה ולדבר אנגלית - עם אנשים בדיוק כמוכם.
          </p>
          <p className="text-lg md:text-xl leading-relaxed mb-10" style={{ color: 'rgba(255,255,255,0.65)' }}>
            לא פיליפינים, לא &quot;מורים&quot; שלא באמת מתקנים - שותפים אמיתיים למסע.
          </p>
          <a
            href={SESSIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block font-bold py-4 px-10 rounded-lg text-lg hover:opacity-90 transition-opacity"
            style={{ backgroundColor: 'var(--yellow)', color: 'var(--navy)' }}
          >
            לבחירת פגישה
          </a>
          <p className="mt-4 text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
            פגישות בזום · ראשון 20:00 · רביעי 08:30
          </p>
        </div>
      </section>

      {/* What is it + How it works */}
      <section style={{ backgroundColor: 'var(--light-grey)' }} className="py-20 px-6" dir="rtl">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold tracking-widest uppercase mb-3 text-center" style={{ color: 'var(--yellow)' }}>
            מה זה בעצם
          </p>
          <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: 'var(--navy)' }}>
            קבוצת תרגול קטנה. פעמיים בשבוע. חצי שעה.
          </h2>
          <p className="text-lg leading-relaxed text-center mb-14" style={{ color: 'var(--mid-grey)' }}>
            Practice Pod הוא מרחב בטוח ומסודר לתרגול אנגלית. נפגשים בזום, יש מנחה שמוביל,
            מדברים בחדרים קטנים ואז חוזרים לקבוצה לרגע קצר של שיתוף.
            אין שיעורים, אין תיקונים, אין לחץ.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                num: '01',
                title: 'נרשמים',
                desc: 'בוחרים פגישה שמתאימה - ראשון בערב או רביעי בבוקר - ומאשרים את ההרשמה.',
              },
              {
                num: '02',
                title: 'מצטרפים לזום',
                desc: 'המנחה פותח, מציג נושא לשיחה ומחלק לחדרים קטנים.',
              },
              {
                num: '03',
                title: 'מדברים אנגלית',
                desc: '20 דקות בחדרים. 5 דקות האחרונות חוזרים לקבוצה ומשתפים מה חוויתם.',
              },
            ].map(step => (
              <div key={step.num} className="rounded-2xl p-6" style={{ backgroundColor: 'var(--white)', border: '1px solid #E5E7EB' }}>
                <p className="text-3xl font-bold mb-3" style={{ color: 'var(--yellow)' }}>{step.num}</p>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--navy)' }}>{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--mid-grey)' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Yes / No */}
      <section style={{ backgroundColor: 'var(--white)' }} className="py-20 px-6" dir="rtl">
        <div className="max-w-3xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--navy)' }}>
                מה Practice Pods הוא <span style={{ color: 'var(--mid-grey)' }}>לא</span>
              </h2>
              <ul className="space-y-4">
                {[
                  'שיעור עם סשה',
                  'קבוצת לימוד',
                  'מישהו שמתקן כל טעות',
                  'שיחות עם זרים מהפיליפינים',
                ].map(item => (
                  <li key={item} className="flex items-center gap-3 text-base" style={{ color: 'var(--dark-grey)' }}>
                    <span className="text-lg font-bold flex-shrink-0" style={{ color: 'var(--mid-grey)' }}>✕</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--navy)' }}>
                מה <span style={{ color: 'var(--yellow)' }}>כן</span>
              </h2>
              <ul className="space-y-4">
                {[
                  'מרחב בטוח לפתוח את הפה',
                  'ישראלים בדיוק כמוכם',
                  'מסגרת ברורה בלי לחץ',
                  'תרגול אמיתי, פעמיים בשבוע',
                ].map(item => (
                  <li key={item} className="flex items-center gap-3 text-base" style={{ color: 'var(--dark-grey)' }}>
                    <span className="font-bold flex-shrink-0" style={{ color: 'var(--yellow)' }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Who is this for */}
      <section style={{ backgroundColor: 'var(--light-grey)' }} className="py-20 px-6" dir="rtl">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--yellow)' }}>
            למי זה מתאים
          </p>
          <h2 className="text-3xl font-bold mb-10" style={{ color: 'var(--navy)' }}>
            אם זה נשמע כמוכם - Practice Pods בשבילכם
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { emoji: '🫶', text: 'מבינים אנגלית טוב אבל נתקעים ברגע שצריך לדבר' },
              { emoji: '🔒', text: 'מרגישים שמשהו חוסם אתכם כשפותחים את הפה' },
              { emoji: '🎯', text: 'רוצים תרגול עקבי - לא עוד קורס שלא מסיימים' },
            ].map(item => (
              <div key={item.emoji} className="rounded-2xl p-6 text-center" style={{ backgroundColor: 'var(--white)', border: '1px solid #E5E7EB' }}>
                <p className="text-3xl mb-3">{item.emoji}</p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--dark-grey)' }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing + CTA */}
      <section style={{ backgroundColor: 'var(--navy)' }} className="py-20 px-6" dir="rtl">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--yellow)' }}>
            מחיר
          </p>
          <h2 className="text-3xl font-bold text-white mb-3">
            בחרו את החבילה שמתאימה לכם
          </h2>
          <p className="mb-10 text-base" style={{ color: 'rgba(255,255,255,0.55)' }}>
            קרדיטים לפגישות - משתמשים כשמתאים לכם
          </p>
          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            {[
              { label: 'פגישה בודדת', price: '₪45', per: '' },
              { label: '8 פגישות', price: '₪296', per: '₪37 לפגישה', highlight: true },
              { label: '15 פגישות', price: '₪450', per: '₪30 לפגישה' },
            ].map(pkg => (
              <div
                key={pkg.label}
                className="rounded-2xl p-6"
                style={{
                  backgroundColor: pkg.highlight ? 'var(--yellow)' : 'rgba(255,255,255,0.08)',
                  border: pkg.highlight ? 'none' : '1px solid rgba(255,255,255,0.12)',
                }}
              >
                <p className="text-sm font-semibold mb-2" style={{ color: pkg.highlight ? 'var(--navy)' : 'rgba(255,255,255,0.65)' }}>
                  {pkg.label}
                </p>
                <p className="text-2xl font-bold" style={{ color: pkg.highlight ? 'var(--navy)' : 'white' }}>
                  {pkg.price}
                </p>
                {pkg.per && (
                  <p className="text-xs mt-1" style={{ color: pkg.highlight ? 'rgba(27,48,84,0.7)' : 'rgba(255,255,255,0.45)' }}>
                    {pkg.per}
                  </p>
                )}
              </div>
            ))}
          </div>
          <a
            href={SESSIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block font-bold py-4 px-12 rounded-lg text-lg hover:opacity-90 transition-opacity"
            style={{ backgroundColor: 'var(--yellow)', color: 'var(--navy)' }}
          >
            לבחירת פגישה והרשמה
          </a>
          <p className="mt-5 text-sm" style={{ color: 'rgba(255,255,255,0.38)' }}>
            קוד קופון ENGLISHGYM - 5% הנחה
          </p>
        </div>
      </section>

      <Footer />
    </>
  )
}
