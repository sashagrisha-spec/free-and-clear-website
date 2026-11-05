import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'תקנון רכישה והחזרים | ערכת הדיבור באנגלית',
  robots: { index: false },
  alternates: { canonical: 'https://www.freeandclearenglish.com/bundle/terms' },
}

const INK = '#1B3054'

function Section({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: '1.8rem' }}>
      <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: INK, marginBottom: '0.4rem' }}>
        {n}. {title}
      </h2>
      {children}
    </section>
  )
}

export default function BundleTermsPage() {
  const p = { style: { marginBottom: '0.6rem' } }
  return (
    <main dir="rtl" style={{ backgroundColor: '#fff', minHeight: '100vh', padding: '3rem 1.2rem' }}>
      <div style={{ maxWidth: 680, margin: '0 auto', color: '#2B2B35', fontSize: '1.05rem', lineHeight: 1.85, textAlign: 'right' }}>
        <h1 style={{ fontSize: '1.7rem', fontWeight: 900, color: INK, marginBottom: '1.8rem' }}>
          תקנון רכישה והחזרים: ערכת הדיבור באנגלית
        </h1>

        <Section n={1} title="המוצר">
          <p {...p}>
            הבנדל כולל שלושה קורסים דיגיטליים: הגייה, סמול טוק ותרגול דיבור יומיומי. הגישה נשלחת למייל שהוזן ברכישה מיד לאחר התשלום.
          </p>
        </Section>

        <Section n={2} title="אישור בעת הרכישה">
          <p {...p}>
            לפני התשלום הקונה מסמן שרמת האנגלית שלו בינונית ומעלה, שהתרגולים באנגלית, ושקרא והסכים לתקנון זה. הרכישה מתבצעת רק לאחר סימון האישור.
          </p>
        </Section>

        <Section n={3} title="מדיניות החזרים">
          <p {...p}>המוצר הוא תוכן דיגיטלי שהגישה אליו ניתנת מיידית. ניתן לבקש החזר כספי בתנאים הבאים, במצטבר:</p>
          <ul style={{ paddingRight: '1.3rem', marginBottom: '0.6rem', listStyle: 'disc' }}>
            <li>חלפו שלושה חודשים לפחות מיום הרכישה.</li>
            <li>הקונה עבר על כל חומרי הקורסים ותרגל לפי ההנחיות לאורך התקופה.</li>
            <li>למרות זאת לא חלה התקדמות בדיבור באנגלית.</li>
            <li>הבקשה הוגשה תוך 30 יום מתום שלושת החודשים.</li>
          </ul>
        </Section>

        <Section n={4} title="דמי ביטול">
          <p {...p}>
            בכל החזר כספי, בין לפי סעיף 3 ובין מכוח הדין, ינוכו דמי ביטול בסך 5% מגובה הרכישה. יתרת הסכום תוחזר לאמצעי התשלום המקורי תוך 14 ימים מאישור הבקשה.
          </p>
        </Section>

        <Section n={5} title="פנייה">
          <p {...p}>
            בקשות מוגשות בכתב בלבד ל-
            <a href="mailto:sasha@freeandclearenglish.com" dir="ltr" style={{ color: INK, textDecoration: 'underline' }}>
              sasha@freeandclearenglish.com
            </a>
            , עם שם מלא והמייל ששימש לרכישה.
          </p>
        </Section>

        <Section n={6} title="זכויות יוצרים">
          <p {...p}>התכנים מיועדים לשימוש אישי של הקונה בלבד. אין להעתיק, להפיץ או לשתף אותם.</p>
        </Section>
      </div>
    </main>
  )
}
