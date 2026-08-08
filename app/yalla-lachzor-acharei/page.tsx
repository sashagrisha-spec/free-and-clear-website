import type { Metadata } from 'next'
import { Suez_One } from 'next/font/google'
import MetaPixel from '@/components/MetaPixel'
import CheckoutForm from './CheckoutForm'

const display = Suez_One({ subsets: ['hebrew', 'latin'], weight: '400', display: 'swap' })

export const metadata: Metadata = {
  title: 'יאללה, לחזור אחרי | 55 הקלטות לשיפור הדיבור באנגלית',
  description: 'נמאס לכם להתבאס מהאנגלית שלכם? 55 הקלטות בשיטת Shadowing שסוגרות את הפער בין מה שיש בראש למה שיוצא מהפה. ₪197, תשלום חד-פעמי.',
  alternates: { canonical: 'https://www.freeandclearenglish.com/yalla-lachzor-acharei' },
  openGraph: {
    title: 'יאללה, לחזור אחרי',
    description: '55 הקלטות בשיטת Shadowing לשיפור הדיבור באנגלית. ₪197, תשלום חד-פעמי.',
    url: 'https://www.freeandclearenglish.com/yalla-lachzor-acharei',
    siteName: 'Free & Clear English',
    locale: 'he_IL',
    type: 'website',
  },
}

// Yellow highlighter behind a key phrase.
function HL({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ backgroundColor: 'var(--yellow)', color: 'var(--navy)', padding: '0.02em 0.3em', borderRadius: '6px', fontWeight: 700, boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone' }}>
      {children}
    </span>
  )
}

// Hand-drawn underline used under key phrases and the big headline.
function Swoosh({ color = 'var(--yellow)', className = '' }: { color?: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 300 18" fill="none" preserveAspectRatio="none" aria-hidden="true">
      <path d="M4 12 C 80 4, 150 4, 296 10" stroke={color} strokeWidth="6" strokeLinecap="round" />
    </svg>
  )
}

function InstagramIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  )
}

// Big, fat, bouncy yellow down-arrow badge used to connect sections and add life.
function DownArrow() {
  return (
    <div className="flex justify-center pt-12" aria-hidden>
      <div
        className="animate-bounce rounded-full flex items-center justify-center shadow-xl"
        style={{ backgroundColor: 'var(--yellow)', width: 72, height: 72 }}
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--navy)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 4 L12 19 M5 12 L12 19 L19 12" />
        </svg>
      </div>
    </div>
  )
}

// Inline call-to-action that scrolls to the checkout box.
function InlineCTA({ label = 'אני רוצה להתחיל 👈' }: { label?: string }) {
  return (
    <div className="text-center mt-12">
      <a
        href="#buy"
        className="inline-block font-bold px-12 py-4 rounded-lg hover:opacity-90 transition-opacity text-lg shadow-lg"
        style={{ backgroundColor: 'var(--yellow)', color: 'var(--navy)' }}
      >
        {label}
      </a>
    </div>
  )
}

const YES = [
  'אתם מבינים ומדברים אנגלית, אבל נתקעים ומתביישים ברגע האמת',
  'אתם רוצים להגדיל אוצר מילים, וגם להשתמש בו בזמן אמת',
  'אתם ברמה בינונית ומעלה',
]

const GAINS = [
  'ביטחון לדבר אנגלית בקול רם',
  'אוצר מילים שאתם באמת משתמשים בו',
  'הבנה עמוקה של הגייה טבעית ושל הקיצורים שעושים את כל ההבדל',
]

export default function YallaLandingPage() {
  return (
    <>
      <MetaPixel />
      <main dir="rtl" style={{ backgroundColor: 'var(--white)' }}>

        {/* Hero */}
        <section style={{ backgroundColor: 'var(--navy)', position: 'relative', overflow: 'hidden' }} className="pt-14 pb-24">
          {/* decorative blobs */}
          <div aria-hidden style={{ position: 'absolute', top: '-80px', insetInlineStart: '-80px', width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,200,66,0.20), transparent 70%)' }} />
          <div aria-hidden style={{ position: 'absolute', bottom: '-60px', insetInlineEnd: '-60px', width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,200,66,0.14), transparent 70%)' }} />

          <div className="max-w-3xl mx-auto px-6 text-center" style={{ position: 'relative' }}>
            <p className="font-bold text-lg mb-10" style={{ color: 'var(--yellow)' }}>Free &amp; Clear English</p>

            <p className="text-white text-2xl md:text-3xl font-bold mb-4">
              נמאס לכם להתבאס מהאנגלית שלכם?
            </p>

            <h1 className={`${display.className} leading-none mb-1`} style={{ color: 'var(--yellow)', fontSize: 'clamp(3rem, 9vw, 5.5rem)' }}>
              יאללה, לחזור אחרי!
            </h1>
            <div className="mx-auto mb-8" style={{ width: 'min(360px, 80%)', height: 16 }}>
              <Swoosh className="w-full h-full" color="rgba(255,255,255,0.85)" />
            </div>

            <p className="text-white/80 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
              כי שנים אומרים לכם לעבוד על דקדוק, ובדיוק ברגע שצריך לפתוח את הפה: <strong style={{ color: 'var(--yellow)' }}>לא יוצא כלום.</strong> לא הגיע הזמן לעשות משהו אחר?
            </p>
            <a
              href="#buy"
              style={{ backgroundColor: 'var(--yellow)', color: 'var(--navy)' }}
              className="inline-block font-bold px-12 py-4 rounded-lg hover:opacity-90 transition-opacity text-lg"
            >
              הגיע הזמן 👈
            </a>
            <p className="mt-6 text-base font-semibold" style={{ color: 'rgba(255,255,255,0.9)' }}>
              ₪197 · תשלום חד-פעמי ·{' '}
              <span style={{ color: 'var(--yellow)' }}>פחות מ-₪4 לכל אימון</span>
            </p>
          </div>
        </section>

        {/* The honest truth */}
        <section id="story" className="py-20" style={{ backgroundColor: 'var(--white)', position: 'relative', overflow: 'hidden' }}>
          <div aria-hidden style={{ position: 'absolute', top: 20, insetInlineEnd: -30, width: 140, height: 140, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,200,66,0.18), transparent 70%)' }} />
          <div className="max-w-2xl mx-auto px-6 text-center" style={{ position: 'relative' }}>
            <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--navy)' }}>בואו נדבר בכנות רגע</h2>
            <div className="text-lg leading-relaxed space-y-4" style={{ color: 'var(--mid-grey)' }}>
              <p>
                <span style={{ color: 'var(--navy)', fontWeight: 700, borderBottom: '3px solid var(--yellow)', paddingBottom: 2 }}>
                  אתם במלחמה עם האנגלית כבר שנים.
                </span>{' '}
                כנראה עוד מבית הספר.
              </p>
              <p>השנים עוברות, והאנגלית תקועה בדיוק באותו מקום.</p>
              <p>אין איפה לתרגל, אין תוכנית רילוקיישן באופק, ואין לכם מושג מה מכל מה שיש בחוץ בכלל יעבוד.</p>
              <p>ולשלם עוד אלפי שקלים על עוד משהו שאולי לא יזיז כלום? <strong style={{ color: 'var(--navy)' }}>לא בא לכם. ובצדק.</strong></p>
            </div>
          </div>
        </section>

        {/* Not your fault */}
        <section className="py-20" style={{ backgroundColor: 'var(--light-grey)', position: 'relative', overflow: 'hidden' }}>
          <div aria-hidden style={{ position: 'absolute', bottom: -30, insetInlineStart: -30, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(27,48,84,0.07), transparent 70%)' }} />
          <div className="max-w-2xl mx-auto px-6 text-center" style={{ position: 'relative' }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--navy)' }}>הבעיה היא לא אתם</h2>
            <p className="text-lg leading-relaxed" style={{ color: 'var(--mid-grey)' }}>
              כולנו למדנו אנגלית בשיטות הישנות: קריאה, דקדוק, מבחנים. אז יצא שנשארנו עם ראש מלא מילים,
              אבל ברגע שצריך לפתוח את הפה ולדבר, <HL>הכל נתקע</HL>.
            </p>
          </div>
        </section>

        {/* Solution + what it is */}
        <section className="py-20" style={{ backgroundColor: 'var(--white)' }}>
          <div className="max-w-3xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--navy)' }}>
                אבל יש דרך שמאמנת ממש את שריר הדיבור.<br />
                קוראים לה <HL>Shadowing</HL>.
              </h2>
              <p className="text-lg leading-relaxed max-w-xl mx-auto mb-4" style={{ color: 'var(--mid-grey)' }}>
                מקשיבים למשפט, וחוזרים עליו בקול מיד אחרי. לא מתרגמים, לא ממציאים, לא נלחצים.
                רק מחקים את הצליל, הקצב והמנגינה.
              </p>
              <p className="text-lg leading-relaxed max-w-xl mx-auto" style={{ color: 'var(--mid-grey)' }}>
                ככה שחקנים, מרצים ופוליטיקאים לומדים מבטא ותקשורת.<br />
                <strong style={{ color: 'var(--navy)' }}>וככה הפה שלכם סוף סוף מתאמן בדיבור.</strong>
              </p>
            </div>
            <div className="rounded-3xl p-8 md:p-10" style={{ backgroundColor: 'var(--navy)', position: 'relative', overflow: 'hidden' }}>
              <div aria-hidden style={{ position: 'absolute', top: -50, insetInlineEnd: -50, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,200,66,0.16), transparent 70%)' }} />
              <p className="text-center text-5xl mb-3">🎧</p>
              <h3 className={`${display.className} text-white text-3xl md:text-4xl mb-6 text-center`} style={{ position: 'relative' }}>
                יאללה, לחזור אחרי
              </h3>
              <ul className="space-y-3 max-w-md mx-auto" style={{ position: 'relative' }}>
                {[
                  ['55 הקלטות', ' קצרות בנושאים מגוונים'],
                  ['18 תיקיות', ', בערך 10 דקות כל אחת'],
                  ['הכל במייל אחד', ' עם דרייב. שלכם, להורדה ולתמיד'],
                  ['10 דקות', ', עד 3 פעמים בשבוע. בקצב שלכם'],
                ].map(([bold, rest]) => (
                  <li key={bold} className="flex items-start gap-3">
                    <span style={{ color: 'var(--yellow)' }} className="flex-shrink-0 mt-1">✦</span>
                    <span style={{ color: 'rgba(255,255,255,0.85)' }}>
                      <strong style={{ color: 'var(--yellow)' }}>{bold}</strong>{rest}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Hear a sample */}
        <section className="py-20" style={{ backgroundColor: 'var(--white)' }}>
          <div className="max-w-xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-3" style={{ color: 'var(--navy)' }}>רוצים דוגמא? 🎧</h2>
            <p className="text-lg mb-8" style={{ color: 'var(--mid-grey)' }}>
              תלחצו play ותחזרו אחרי בקול.
            </p>
            <div className="rounded-2xl p-6 md:p-8 shadow-sm" style={{ backgroundColor: 'var(--light-grey)', border: '1px solid #E5E7EB' }}>
              <audio controls preload="metadata" style={{ width: '100%' }}>
                <source src="/audio/yalla-sample.mp3" type="audio/mpeg" />
                <source src="/audio/yalla-sample-v2.m4a" type="audio/mp4" />
                הדפדפן שלכם לא תומך בנגן. <a href="/audio/yalla-sample.mp3">להורדת ההקלטה</a>
              </audio>
              <p className="text-xs mt-4 font-semibold uppercase tracking-wide" style={{ color: 'var(--mid-grey)' }}>
                Week 15 · Agreeing &amp; Disagreeing Politely
              </p>
            </div>
            <InlineCTA />
          </div>
        </section>

        {/* Testimonials - moved up: social proof right after the sample */}
        <section className="py-20" style={{ backgroundColor: 'var(--light-grey)' }}>
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: 'var(--navy)' }}>הם כבר חזרו אחרי 💛</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'נעומי', file: 'naomi' },
                { name: 'תומר', file: 'tomer' },
                { name: 'אורי', file: 'uri' },
                { name: 'מרוה', file: 'marve' },
              ].map(t => (
                <div key={t.file}>
                  <video
                    controls
                    preload="none"
                    poster={`/videos/testimonial-${t.file}.jpg`}
                    className="w-full rounded-xl bg-black"
                    style={{ aspectRatio: '9 / 16', objectFit: 'cover' }}
                  >
                    <source src={`/videos/testimonial-${t.file}.mp4`} type="video/mp4" />
                  </video>
                  <p className="text-center text-sm font-bold mt-2" style={{ color: 'var(--navy)' }}>{t.name}</p>
                </div>
              ))}
            </div>
            <InlineCTA />
          </div>
        </section>

        {/* Who it's for */}
        <section className="py-20" style={{ backgroundColor: 'var(--white)', position: 'relative', overflow: 'hidden' }}>
          <div aria-hidden style={{ position: 'absolute', top: -50, insetInlineStart: -50, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(27,48,84,0.06), transparent 70%)' }} />
          <div aria-hidden style={{ position: 'absolute', bottom: -40, insetInlineEnd: -40, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,200,66,0.18), transparent 70%)' }} />
          <div className="max-w-2xl mx-auto px-6" style={{ position: 'relative' }}>
            <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: 'var(--navy)' }}>רגע, זה בשבילכם?</h2>
            <div className="space-y-3 mb-8">
              {YES.map(item => (
                <div key={item} className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm" style={{ border: '1px solid #E5E7EB' }}>
                  <span className="flex-shrink-0 mt-0.5 text-lg">✅</span>
                  <span style={{ color: 'var(--dark-grey)' }}>{item}</span>
                </div>
              ))}
            </div>
            <div className="flex items-start gap-3 rounded-xl p-4" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}>
              <span className="flex-shrink-0 mt-0.5 text-lg">❌</span>
              <span style={{ color: '#991B1B' }}>
                האנגלית שלכם בסיסית? <strong>זה ממש לא המקום להתחיל בו</strong>, ואני לא רוצה שתבזבזו כסף.
              </span>
            </div>
          </div>
        </section>

        {/* What you gain */}
        <section className="py-20" style={{ backgroundColor: 'var(--navy)', position: 'relative', overflow: 'hidden' }}>
          <div aria-hidden style={{ position: 'absolute', top: -70, insetInlineStart: -70, width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,200,66,0.16), transparent 70%)' }} />
          <div aria-hidden style={{ position: 'absolute', bottom: -60, insetInlineEnd: -60, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,200,66,0.12), transparent 70%)' }} />
          <div className="max-w-2xl mx-auto px-6" style={{ position: 'relative' }}>
            <p className="text-xs font-bold tracking-widest uppercase mb-3 text-center" style={{ color: 'var(--yellow)' }}>מה יוצא לכם מזה</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-white">מה מרוויחים</h2>
            <div className="space-y-4">
              {GAINS.map(item => (
                <div key={item} className="flex items-center gap-4 rounded-xl p-4" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                  <span style={{ color: 'var(--navy)', backgroundColor: 'var(--yellow)' }} className="w-9 h-9 rounded-full flex items-center justify-center text-base font-bold flex-shrink-0">✓</span>
                  <span className="text-lg font-medium" style={{ color: 'rgba(255,255,255,0.92)' }}>{item}</span>
                </div>
              ))}
            </div>
            <InlineCTA />
          </div>
        </section>

        {/* About Sasha */}
        <section className="py-20" style={{ backgroundColor: 'var(--light-grey)' }}>
          <div className="max-w-2xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center gap-8 rounded-3xl p-8 bg-white shadow-sm" style={{ border: '1px solid #E5E7EB' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/sasha-2.jpg" alt="סשה דניאל" className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover flex-shrink-0" style={{ border: '4px solid var(--yellow)' }} />
              <div className="text-center md:text-right">
                <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--navy)' }}>נעים להכיר, אני סשה 👋</h2>
                <p className="leading-relaxed mb-4" style={{ color: 'var(--mid-grey)' }}>
                  קואצ׳רית לאנגלית מדוברת. כבר 8 שנים אני עוזרת לישראלים שמבינים אנגלית אבל נתקעים בדיבור,
                  לפתוח את הפה ולדבר בביטחון. את ההקלטות האלה יצרתי בדיוק בשביל אנשים כמוכם, שרוצים להתחיל
                  ממשהו קטן ולטעום דרך חדשה, שונה ו<strong style={{ color: 'var(--navy)' }}>אפקטיבית מאוד</strong>.
                </p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2">
                  <a
                    href="https://www.instagram.com/freeandclearenglish"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-bold hover:opacity-80 transition-opacity"
                    style={{ color: 'var(--navy)' }}
                  >
                    <InstagramIcon /> @freeandclearenglish
                  </a>
                  <a
                    href="https://www.freeandclearenglish.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-bold hover:opacity-80 transition-opacity"
                    style={{ color: 'var(--navy)' }}
                  >
                    🌐 freeandclearenglish.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Guarantee */}
        <section className="py-20" style={{ backgroundColor: 'var(--light-grey)' }}>
          <div className="max-w-2xl mx-auto px-6">
            <div className="rounded-3xl p-8 md:p-10 text-center bg-white shadow-sm" style={{ border: '2px dashed var(--yellow)' }}>
              <p className="text-6xl mb-4">🛡️</p>
              <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--navy)' }}>ואם זה לא יעבוד?</h2>
              <p className="text-lg leading-relaxed" style={{ color: 'var(--mid-grey)' }}>
                עשיתם את כל 18 התיקיות, נתתם לזה 3 חודשים מלאים של עבודה אמיתית, ועדיין כלום?
                אני מחזירה לכם <HL>כל שקל</HL>. אני יכולה להבטיח את זה, כי אני יודעת שכשעובדים עם זה, זה עובד.
              </p>
            </div>
          </div>
        </section>

        {/* Price + checkout */}
        <section id="buy" style={{ backgroundColor: 'var(--navy)', position: 'relative', overflow: 'hidden' }} className="py-20">
          <div aria-hidden style={{ position: 'absolute', top: -70, insetInlineStart: -70, width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,200,66,0.16), transparent 70%)' }} />
          <div className="max-w-xl mx-auto px-6 text-center" style={{ position: 'relative' }}>

            <span className="inline-block text-sm font-bold uppercase tracking-widest mb-4 px-4 py-1.5 rounded-full" style={{ backgroundColor: 'var(--yellow)', color: 'var(--navy)' }}>
              🎧 55 אימונים · פחות מ-₪4 לכל אימון
            </span>

            <p className="mb-1 flex items-baseline justify-center gap-3">
              <span className="text-6xl font-bold text-white">₪197</span>
            </p>
            <p className="text-white/60 text-sm mb-6">תשלום חד-פעמי. בלי מנוי, בלי חיובים חוזרים.</p>

            <div className="rounded-2xl p-5 mb-8 text-right max-w-md mx-auto" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
              <p className="flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.92)' }}>
                <span style={{ color: 'var(--yellow)' }} className="flex-shrink-0 font-bold">✓</span>
                <span>55 אימונים = <strong style={{ color: 'var(--yellow)' }}>פחות מ-₪4 לאימון</strong></span>
              </p>
            </div>

            <CheckoutForm />

            <p className="flex items-center justify-center gap-2 mt-5 text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
              🛡️ <span>אחריות מלאה: לא עבד אחרי 3 חודשים? החזר כספי מלא.</span>
            </p>

            <p className={`${display.className} text-white text-2xl mt-10`}>יאללה, לחזור אחרי!</p>
          </div>
        </section>

        <footer className="py-8 text-center" style={{ backgroundColor: 'var(--navy)' }}>
          <p className="text-white/40 text-xs">Free &amp; Clear English · freeandclearenglish.com</p>
        </footer>
      </main>
    </>
  )
}
