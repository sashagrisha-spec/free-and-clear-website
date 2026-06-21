import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import CheckoutForm from './CheckoutForm'

export const metadata: Metadata = {
  title: 'Speak Like Yourself | סדנת תקשורת חיה באנגלית',
  description: 'סדנת תקשורת חיה באנגלית, רק למסיימי הקורסים ולחברי המועדון. שעה וחצי בזום. 129 ש״ח.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function SpeakLikeYourselfPage() {
  return (
    <>
      <Nav />

      {/* Hero */}
      <section style={{ backgroundColor: 'var(--navy)' }} className="pt-32 pb-20 px-6" dir="rtl">
        <div className="max-w-3xl mx-auto text-center">
          <span
            className="text-base font-bold tracking-wide px-5 py-2 rounded-full mb-6 inline-block"
            style={{ backgroundColor: 'var(--yellow)', color: 'var(--navy)' }}
          >
            רק לחברי הקהילה
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            Speak Like Yourself
          </h1>
          <p className="text-xl md:text-2xl leading-relaxed mb-2" style={{ color: 'rgba(255,255,255,0.82)' }}>
            סדנת תקשורת חיה באנגלית
          </p>
          <p className="text-lg mb-3" style={{ color: 'rgba(255,255,255,0.55)' }}>
            רק למסיימי הקורסים שלי ולחברי המועדון
          </p>
          <p className="text-base font-semibold mb-10" style={{ color: 'var(--yellow)' }}>
            יום שני, 29 ביוני · 20:00 שעון ישראל · זום
          </p>
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-xl line-through" style={{ color: 'rgba(255,255,255,0.35)' }}>169 ₪</span>
            <span className="text-3xl font-bold" style={{ color: 'var(--yellow)' }}>127 ₪</span>
          </div>
          <CheckoutForm variant="community" />
          <p className="mt-4 text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
            שעה וחצי · מחיר מיוחד לחברי הקהילה
          </p>
        </div>
      </section>

      {/* Hook */}
      <section style={{ backgroundColor: 'var(--white)' }} className="py-20 px-6" dir="rtl">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-2xl md:text-3xl font-bold leading-relaxed mb-12" style={{ color: 'var(--navy)' }}>
            מרגישים שבא לכם אתגר נוסף?
          </p>
          <div className="flex flex-col gap-8">
            <p className="text-xl leading-relaxed" style={{ color: 'var(--mid-grey)' }}>
              משהו קטן ולא מאוד מחייב אבל כן מרים את האדרנלין ומחייב אתכם להתמודד עם החששות שלכם?
            </p>
            <p className="text-xl leading-relaxed" style={{ color: 'var(--mid-grey)' }}>
              בואו לדבר באנגלית בזמן אמת, עם אנשים אמיתיים, ולהרגיש פחות לחוצים ויותר טבעיים.
            </p>
            <p className="text-xl leading-relaxed" style={{ color: 'var(--mid-grey)' }}>
              בסדנה חיה של שעה וחצי נתרגל תקשורת באנגלית בקבוצות קטנות, באווירה נעימה, תומכת ולא שיפוטית.
            </p>
          </div>
        </div>
      </section>

      {/* What you'll learn */}
      <section style={{ backgroundColor: 'var(--light-grey)' }} className="py-20 px-6" dir="rtl">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-10 text-center" style={{ color: 'var(--navy)' }}>
            מה נלמד?
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              'איך לדבר בקצב רגוע וברור יותר',
              'איך להרגיע את מערכת העצבים בזמן שיחה',
              'איך לחלק רעיונות למשפטים קצרים',
              'איך להשתמש במילים פשוטות ולהעביר מסר מדויק',
              'איך להרגיש טבעיים יותר גם בלי אנגלית מושלמת',
            ].map(item => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-xl p-5"
                style={{ backgroundColor: 'var(--white)', border: '1px solid #E5E7EB' }}
              >
                <span className="mt-1 font-bold flex-shrink-0 text-lg" style={{ color: 'var(--yellow)' }}>✓</span>
                <p className="text-base leading-relaxed" style={{ color: 'var(--dark-grey)' }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What happens */}
      <section style={{ backgroundColor: 'var(--white)' }} className="py-20 px-6" dir="rtl">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-10 text-center" style={{ color: 'var(--navy)' }}>
            מה יקרה בסדנה?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { num: '01', title: 'חדרים קטנים', desc: 'תרגול בחדרים קטנים ואינטימיים - בלי לחץ של קבוצה גדולה.' },
              { num: '02', title: 'שיחות אמיתיות', desc: 'שיחות על נושאים מעניינים וכלים פרקטיים שאפשר להשתמש בהם מיד.' },
              { num: '03', title: 'פידבק ישיר', desc: 'אפשרות לקבל ממני פידבק ישיר בלייב.' },
            ].map(step => (
              <div key={step.num} className="rounded-2xl p-6" style={{ backgroundColor: 'var(--light-grey)', border: '1px solid #E5E7EB' }}>
                <p className="text-3xl font-bold mb-3" style={{ color: 'var(--yellow)' }}>{step.num}</p>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--navy)' }}>{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--mid-grey)' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section style={{ backgroundColor: 'var(--light-grey)' }} className="py-20 px-6" dir="rtl">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--navy)' }}>
            למי הסדנה מתאימה?
          </h2>
          <p className="text-lg leading-relaxed mb-4" style={{ color: 'var(--mid-grey)' }}>
            לכל מי שיכול להחזיק שיחה באנגלית בלבד, גם אם הרמה עדיין לא גבוהה.
          </p>
          <p className="text-lg font-semibold mb-2" style={{ color: 'var(--navy)' }}>
            אתם לא צריכים לדבר מושלם.
          </p>
          <p className="text-lg leading-relaxed" style={{ color: 'var(--mid-grey)' }}>
            אתם רק צריכים להיות מוכנים לדבר, לתרגל ולצאת קצת מאזור הנוחות.
          </p>
        </div>
      </section>

      {/* CTA bottom */}
      <section style={{ backgroundColor: 'var(--navy)' }} className="py-20 px-6" dir="rtl">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--yellow)' }}>
            הגיע הזמן
          </p>
          <h2 className="text-3xl font-bold text-white mb-4">
            לקחת את האנגלית שלמדתם ולהתחיל להשתמש בה באמת
          </h2>
          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              { label: 'תאריך', value: '29.6' },
              { label: 'שעה', value: '20:00' },
              { label: 'מחיר', value: '127 ₪' },
            ].map(detail => (
              <div
                key={detail.label}
                className="rounded-2xl p-5"
                style={{ backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
              >
                <p className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{detail.label}</p>
                <p className="text-xl font-bold text-white">{detail.value}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-lg line-through" style={{ color: 'rgba(255,255,255,0.35)' }}>169 ₪</span>
            <span className="text-2xl font-bold" style={{ color: 'var(--yellow)' }}>127 ₪</span>
          </div>
          <CheckoutForm variant="community" />
        </div>
      </section>

      <Footer />
    </>
  )
}
