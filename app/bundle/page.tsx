import type { Metadata } from 'next'
import { Rubik } from 'next/font/google'
import Image from 'next/image'
import BundleCheckout from './BundleCheckout'

// Rubik for the whole page, the font Sasha picked from Dana's site (2026-10-27).
const rubik = Rubik({ subsets: ['hebrew', 'latin'], weight: ['300', '400', '500', '700', '900'], display: 'swap' })

// The one handwritten line per section: Gveret Levin, the round handwriting
// Sasha likes. Loaded as a plain stylesheet, like the handwriting on /courses.
const FONTS_URL = 'https://fonts.googleapis.com/css2?family=Gveret+Levin&display=swap'

export const metadata: Metadata = {
  title: 'ערכת הדיבור באנגלית | Free & Clear English',
  description:
    'אתם מבינים אנגלית, אבל כשצריך לדבר זה יוצא אחרת. שלושה קורסים בחבילה אחת: הגייה, סמול טוק ותרגול דיבור יומיומי. ₪397 במקום ₪601.',
  alternates: { canonical: 'https://www.freeandclearenglish.com/bundle' },
  openGraph: {
    title: 'ערכת הדיבור באנגלית',
    description: 'הגייה, סמול טוק ותרגול דיבור. שלושה קורסים, ₪397 במקום ₪601.',
    url: 'https://www.freeandclearenglish.com/bundle',
    siteName: 'Free & Clear English',
    locale: 'he_IL',
    type: 'website',
    images: [{ url: 'https://www.freeandclearenglish.com/images/bundle/sasha-laugh.jpg', width: 1400, height: 933 }],
  },
}

// Her brand colours, plus soft pink and soft lavender for variety.
const INK = '#1B3054'
const BODY = '#42536D'
const YELLOW = '#F5C842'
const PINK = '#F2B8CB'
const PINK_BG = '#FCEEF3'
const LAV = '#CFC3EE'
const LAV_BG = '#F1EDFB'

/* ---------- building blocks ---------- */

// One sentence per line, always. Groups are separated by a little air.
function Lines({ groups, tone = BODY, size = '1.3rem' }: { groups: string[][]; tone?: string; size?: string }) {
  return (
    <div className="mx-auto" style={{ maxWidth: 640 }}>
      {groups.map((g, gi) => (
        <div key={gi} style={{ marginTop: gi === 0 ? 0 : '1.6rem' }}>
          {g.map((l, i) => {
            // "**" at the start marks the line that carries the point.
            // "__" keeps the line regular and draws a soft curved line under it.
            if (l.startsWith('__'))
              return (
                <p key={i} style={{ fontSize: size, lineHeight: 1.7, color: tone, fontWeight: 300 }}>
                  <span className="relative inline-block">
                    {l.slice(2)}
                    <svg
                      viewBox="0 0 300 12"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                      style={{ position: 'absolute', left: 0, right: 0, bottom: '-0.18em', width: '100%', height: '0.3em' }}
                    >
                      <path d="M3 8 C 90 2, 190 2, 297 7" stroke="#C9A227" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.9" />
                    </svg>
                  </span>
                </p>
              )
            const strong = l.startsWith('**')
            return (
              <p
                key={i}
                style={{
                  fontSize: strong ? `calc(${size} * 1.12)` : size,
                  lineHeight: 1.7,
                  color: strong && tone === BODY ? INK : tone,
                  fontWeight: strong ? 700 : 300,
                }}
              >
                {strong ? l.slice(2) : l}
              </p>
            )
          })}
        </div>
      ))}
    </div>
  )
}

function Hand({ children, color = INK, size = '1.7rem' }: { children: React.ReactNode; color?: string; size?: string }) {
  return (
    <p className="bundle-hand" style={{ color, fontSize: `calc(${size} * 1.3)`, lineHeight: 1.4 }}>
      {children}
    </p>
  )
}

function H2({ children, color = INK }: { children: React.ReactNode; color?: string }) {
  return (
    <h2 className="bundle-serif" style={{ color, fontSize: 'clamp(2rem, 6vw, 3rem)', fontWeight: 700, lineHeight: 1.25, marginBottom: '1.6rem' }}>
      {children}
    </h2>
  )
}

// A word in colour with a hand-drawn line under it.
function Mark({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span className="relative inline-block" style={{ color }}>
      {children}
      <svg
        viewBox="0 0 300 14"
        preserveAspectRatio="none"
        aria-hidden="true"
        style={{ position: 'absolute', left: 0, right: 0, bottom: '-0.12em', width: '100%', height: '0.22em' }}
      >
        <path d="M4 9 C 80 3, 200 3, 296 8" stroke={color} strokeWidth="5" strokeLinecap="round" fill="none" />
      </svg>
    </span>
  )
}

function Cta({ label = 'אני רוצה את שלושתם 👈', dark = false }: { label?: string; dark?: boolean }) {
  return (
    <a
      href="#buy"
      className="inline-block rounded-full transition-transform hover:-translate-y-0.5"
      style={{
        backgroundColor: dark ? INK : YELLOW,
        color: dark ? '#fff' : INK,
        padding: '1.1rem 2.4rem',
        fontSize: '1.25rem',
        fontWeight: 700,
        marginTop: '2.4rem',
      }}
    >
      {label}
    </a>
  )
}

// The round "nice to meet you" seal, the way Jenna's page signs its intro.
function Seal() {
  return (
    <div
      className="absolute"
      style={{ width: 132, height: 132, bottom: -40, insetInlineStart: -36, borderRadius: '50%', backgroundColor: INK, boxShadow: '0 10px 30px rgba(0,0,0,0.25)' }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 132 132" width="132" height="132" className="bundle-spin">
        <defs>
          <path id="seal-circle" d="M66,66 m-48,0 a48,48 0 1,1 96,0 a48,48 0 1,1 -96,0" />
        </defs>
        {/* Hebrew on a circle only renders with an explicit rtl direction and a
            centred anchor; textLength stretches it to close the ring. */}
        <text fill="#fff" fontSize="12.5" fontWeight="700" direction="rtl" style={{ fontFamily: 'inherit' }}>
          <textPath href="#seal-circle" startOffset="50%" textAnchor="middle" textLength="296" lengthAdjust="spacing">
            נעים להכיר · אני סשה דניאל · נעים להכיר · אני סשה ·
          </textPath>
        </text>
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center bundle-serif"
        style={{ color: YELLOW, fontSize: '2.1rem', fontWeight: 700 }}
      >
        ס
      </span>
    </div>
  )
}

/* ---------- content ---------- */

const COURSES = [
  {
    tag: 'הפה',
    tagColor: '#E7B400',
    name: 'צלילי אנגלית',
    lines: [
      'הפה שלכם מחליף צלילים באנגלית בצלילים מעברית.',
      'ופתאום יוצאת מילה אחרת.',
      'אני מראה לכם בדיוק מה הפה עושה ב־TH, ב־R וב־L.',
    ],
    meta: '34 סרטונים קצרים · 17 דפי תרגול',
    bg: '#FFFDF4',
  },
  {
    tag: 'הראש',
    tagColor: '#D97A9C',
    name: 'סמול טוק, קטן עליי',
    lines: [
      'מה אומרים אחרי Hi.',
      'איך ממשיכים שיחה, ואיך מחמיאים בלי להישמע מזויפים.',
      'ואיך יוצאים ממנה בלי לברוח לשירותים.',
    ],
    meta: '17 שיעורים · 8 דפי תרגול · תעודת סיום',
    bg: '#FFF7FA',
  },
  {
    tag: 'השריר',
    tagColor: '#8C78CC',
    name: 'יאללה, לחזור אחרי',
    lines: ['דיבור הוא שריר.', 'ושריר צריך אימון.', 'מקשיבים לי, וחוזרים אחרי בקול.'],
    meta: '55 הקלטות · עשר דקות ביום',
    bg: '#FAF8FF',
  },
]

const FAMOUS = [
  { name: 'ריף נאמן', src: '/images/bundle/reef-neeman.jpg', pos: 'center 30%' },
  { name: 'אביב אלוש', src: '/images/bundle/aviv-alush.jpg', pos: 'center 25%' },
  { name: 'נועה קירל', src: '/images/bundle/noa-kirel.jpg', pos: 'center 30%' },
  { name: 'רן דנקר', src: '/images/bundle/ran-danker.jpg', pos: 'center 25%' },
]

const VIDEOS = [
  { name: 'נעומי', file: 'naomi' },
  { name: 'תומר', file: 'tomer' },
  { name: 'אורי', file: 'uri' },
  { name: 'מרוה', file: 'marve' },
]

const NOTES = [
  { src: '/images/soe-reviews/review-1.jpg', w: 876, h: 1040, tilt: -3, tape: 'rgba(245,200,66,0.75)' },
  { src: '/images/soe-reviews/review-2.jpg', w: 845, h: 772, tilt: 2, tape: 'rgba(207,195,238,0.9)' },
  { src: '/images/soe-reviews/review-5.jpg', w: 851, h: 585, tilt: -1.5, tape: 'rgba(242,184,203,0.9)' },
  { src: '/images/soe-reviews/review-6.jpg', w: 878, h: 1371, tilt: 2.5, tape: 'rgba(245,200,66,0.75)' },
  { src: '/images/soe-reviews/review-7.jpg', w: 1000, h: 1164, tilt: -2, tape: 'rgba(207,195,238,0.9)' },
]

/* ---------- page ---------- */

export default function BundlePage() {
  return (
    <main dir="rtl" className={rubik.className} style={{ backgroundColor: '#fff', color: INK, textAlign: 'center' }}>
      <link rel="stylesheet" href={FONTS_URL} precedence="default" />
      <style>{`
.bundle-serif { font-weight: 700; }
.bundle-hand { font-family: 'Gveret Levin', cursive; font-weight: 400; }
@keyframes bundleSpin { to { transform: rotate(360deg) } }
.bundle-spin { animation: bundleSpin 26s linear infinite; }
@media (prefers-reduced-motion: reduce) { .bundle-spin { animation: none; } }
.bundle-cards { display: grid; gap: 1.4rem; grid-template-columns: 1fr; }
.bundle-card { display: grid; grid-template-rows: subgrid; grid-row: span 4; }
@media (min-width: 900px) { .bundle-cards { grid-template-columns: repeat(3, 1fr); } }
.bundle-try { display: grid; gap: 1.6rem; grid-template-columns: 1fr; }
@media (min-width: 760px) { .bundle-try { grid-template-columns: 1fr 1fr; } }
.bundle-dont { display: grid; gap: 1rem; grid-template-columns: 1fr; }
@media (min-width: 760px) { .bundle-dont { grid-template-columns: repeat(3, 1fr); } }
      `}</style>

      {/* HERO */}
      <section className="relative overflow-hidden" style={{ backgroundColor: INK, padding: '3.5rem 16px 6rem' }}>
        <p
          className="inline-block rounded-full"
          style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: YELLOW, fontWeight: 700, fontSize: '1.05rem', padding: '0.45rem 1.2rem' }}
        >
          ערכת הדיבור באנגלית
        </p>

        <h1
          className="bundle-serif mx-auto"
          style={{ color: '#fff', fontSize: 'clamp(2.3rem, 8vw, 4.6rem)', fontWeight: 900, lineHeight: 1.3, maxWidth: 900, marginTop: '2rem' }}
        >
          בעברית אתם
          <br />
          <Mark color={YELLOW}>חדים</Mark>, <Mark color={PINK}>מצחיקים</Mark>, <Mark color={LAV}>נוכחים</Mark>.
          <br />
          באנגלית אתם מהנהנים.
        </h1>

        <div style={{ marginTop: '2.2rem' }}>
          <Hand color={YELLOW}>ויש לזה פתרון. בעצם שלושה.</Hand>
        </div>

        {/* The photo sits in an arch, with the round seal on its edge. */}
        <div className="relative mx-auto" style={{ width: 'min(100%, 340px)', marginTop: '2.6rem' }}>
          <div
            className="relative overflow-hidden"
            style={{ aspectRatio: '4 / 5', borderRadius: '170px 170px 24px 24px', border: `6px solid ${LAV}` }}
          >
            <Image
              src="/images/bundle/sasha-laugh.jpg"
              alt="סשה דניאל"
              fill
              priority
              sizes="340px"
              style={{ objectFit: 'cover', objectPosition: '48% 20%' }}
            />
          </div>
          <Seal />
        </div>

        <Cta />
      </section>

      {/* PAIN */}
      <section style={{ padding: '5.5rem 16px' }}>
        <Lines
          groups={[
            ['אתם יושבים בזום עם הצוות מחו"ל.', '**מבינים הכל.', 'אפילו צוחקים במקום הנכון.'],
            ['**ואז שואלים אתכם משהו.'],
            ['הלב דופק.', 'המילה שהייתה לכם על הלשון נעלמת.', '__ומה שיוצא נשמע לכם עקום.', 'גם אם אף אחד לא אמר כלום.'],
            ['אחר כך, בהפסקת הקפה, מישהו אומר:'],
          ]}
        />
        <p dir="ltr" style={{ fontSize: '1.9rem', fontWeight: 500, color: INK, margin: '1.2rem 0' }}>
          Hey, how&apos;s it going?
        </p>
        <Lines
          groups={[
            ['ואתם עונים Good.', '**והשיחה נגמרת.'],
            ['ובערב אתם חושבים:'],
          ]}
        />
        <p style={{ fontSize: 'clamp(2rem, 6vw, 2.8rem)', fontWeight: 900, color: INK, marginTop: '0.6rem' }}>למה שתקתי??</p>
        <p style={{ fontSize: '1.6rem', fontWeight: 700, color: INK, marginTop: '2.2rem' }}>נכון?</p>
        <p style={{ fontSize: '1.6rem', fontWeight: 700, color: INK }}>אז די.</p>
      </section>

      {/* NOT YOU */}
      <section style={{ backgroundColor: LAV_BG, padding: '5.5rem 16px' }}>
        <Hand size="2rem">האנגלית שלכם בסדר גמור.</Hand>
        <div style={{ marginTop: '1.8rem' }}>
          <Lines
            groups={[
              ['**היא פשוט תקועה בראש.'],
              [
                'בבית הספר לימדו אתכם לקרוא, לכתוב ולעבור מבחנים.',
                'אף אחד לא לימד אתכם איפה שמים את הלשון ב־TH.',
                'אף אחד לא לימד אתכם מה אומרים אחרי Hi.',
                '**ואף אחד לא נתן לכם לדבר.',
              ],
              ['אז חסרים לכם שלושה דברים.', 'לא מילים.', 'לא דקדוק.', '**שלושה דברים אחרים לגמרי.'],
            ]}
          />
        </div>
      </section>

      {/* THREE THAT DON'T WORK */}
      <section style={{ backgroundColor: PINK_BG, padding: '5.5rem 16px' }}>
        <H2>שלושה פתרונות שלא עובדים</H2>
        <div className="bundle-dont mx-auto" style={{ maxWidth: 1140 }}>
          {['עוד אפליקציה של מילים', 'עוד קורס דקדוק', 'עוד סדרה בלי כתוביות'].map((t) => (
            <div key={t} className="rounded-2xl bg-white flex items-center justify-center" style={{ padding: '2.2rem 1rem', boxShadow: '0 6px 20px rgba(217,122,156,0.12)' }}>
              <p style={{ fontSize: 'clamp(1.5rem, 2.3vw, 1.85rem)', fontWeight: 700, color: INK, whiteSpace: 'nowrap', textDecoration: 'line-through', textDecorationColor: '#D97A9C', textDecorationThickness: 2 }}>
                {t}
              </p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '2.4rem' }}>
          <Lines groups={[['כל אלה מאמנים את האוזן.', '**והאוזן שלכם כבר מצוינת.']]} />
        </div>
      </section>

      {/* SOLUTION: bright yellow, the three courses side by side */}
      <section style={{ backgroundColor: YELLOW, padding: '5.5rem 16px' }}>
        <Hand size="2.2rem">הפה. הראש. השריר.</Hand>
        <p className="bundle-serif" style={{ fontSize: 'clamp(1.7rem, 5vw, 2.4rem)', fontWeight: 700, color: INK, marginTop: '0.8rem' }}>
          שלושה קורסים. ערכה אחת.
        </p>

        <div className="bundle-cards mx-auto" style={{ maxWidth: 1100, marginTop: '2.8rem' }}>
          {COURSES.map((c) => (
            <div key={c.name} className="bundle-card rounded-3xl" style={{ backgroundColor: c.bg, padding: '2rem 1.5rem', gap: '0.9rem' }}>
              <p className="bundle-hand" style={{ color: c.tagColor, fontSize: '1.6rem' }}>
                {c.tag}
              </p>
              <p className="bundle-serif" style={{ fontSize: '1.75rem', fontWeight: 700, color: INK }}>
                {c.name}
              </p>
              <div>
                {c.lines.map((l) => (
                  <p key={l} style={{ fontSize: '1.15rem', lineHeight: 1.7, color: BODY }}>
                    {l}
                  </p>
                ))}
              </div>
              <p style={{ fontSize: '1rem', fontWeight: 700, color: INK, borderTop: '1px solid rgba(27,48,84,0.12)', paddingTop: '0.9rem', alignSelf: 'end' }}>
                {c.meta}
              </p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '2.8rem' }}>
          <Lines
            tone={INK}
            groups={[['**שלושתם ביחד, כי ככה זה עובד.', 'הגייה בלי תרגול לא נדבקת.', 'ותרגול בלי לדעת מה להגיד לא מוביל לשום מקום.']]}
          />
        </div>
        <Cta dark />
      </section>

      {/* TRY BEFORE BUYING */}
      <section style={{ padding: '5.5rem 16px' }}>
        <H2>תנסו לפני שקונים</H2>
        <Lines groups={[['**שיעור מכל קורס, פתוח לגמרי.', 'בלי לשלם ובלי להשאיר פרטים.', 'תראו איך אני מלמדת, ותחליטו אחר כך.']]} />

        <div className="bundle-try mx-auto" style={{ maxWidth: 1000, marginTop: '2.8rem' }}>
          {[
            { label: 'סמול טוק', note: 'איך שוברים את הקרח', id: '1127218893' },
            { label: 'צלילי אנגלית', note: 'שיעור הסבר: EE ו־i', id: '1227663263' },
            { label: 'צלילי אנגלית', note: 'שיעור תרגול: EE ו־i', id: '1226981823' },
          ].map((v) => (
            <div key={v.id}>
              <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: '16 / 9', backgroundColor: LAV_BG }}>
                <iframe
                  src={`https://player.vimeo.com/video/${v.id}`}
                  className="w-full h-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title={v.note}
                />
              </div>
              <p style={{ fontWeight: 700, fontSize: '1.15rem', marginTop: 10 }}>{v.label}</p>
              <p style={{ color: BODY, fontSize: '1.05rem' }}>{v.note}</p>
            </div>
          ))}
          <div>
            <div
              className="rounded-2xl flex flex-col items-center justify-center"
              style={{ aspectRatio: '16 / 9', backgroundColor: INK, padding: '1.2rem' }}
            >
              <p style={{ fontSize: '2.4rem' }} aria-hidden="true">
                🎧
              </p>
              <p style={{ color: '#fff', fontSize: '1.1rem', margin: '0.4rem 0 0.9rem' }}>תלחצו play ותחזרו אחרי בקול</p>
              <audio controls preload="metadata" style={{ width: '100%', maxWidth: 360 }}>
                <source src="/audio/yalla-sample.mp3" type="audio/mpeg" />
                <source src="/audio/yalla-sample-v2.m4a" type="audio/mp4" />
              </audio>
            </div>
            <p style={{ fontWeight: 700, fontSize: '1.15rem', marginTop: 10 }}>יאללה, לחזור אחרי</p>
            <p dir="ltr" style={{ color: BODY, fontSize: '1.05rem' }}>
              Agreeing &amp; Disagreeing Politely
            </p>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section style={{ backgroundColor: INK, padding: '5.5rem 16px' }}>
        <div
          className="relative mx-auto overflow-hidden"
          style={{ width: 200, height: 200, borderRadius: '50%', border: `5px solid ${PINK}` }}
        >
          <Image src="/images/bundle/sasha-stage-sq.jpg" alt="סשה על הבמה" fill sizes="200px" style={{ objectFit: 'cover', objectPosition: 'center' }} />
        </div>
        <div style={{ marginTop: '2rem' }}>
          <H2 color="#fff">אני סשה</H2>
        </div>
        <Lines
          tone="rgba(255,255,255,0.85)"
          groups={[
            ['ואנגלית היא השפה השלישית שלי.'],
            ['בגיל 22 טסתי ללמוד משחק בניו יורק.', 'עם ביטחון בשמיים.'],
            ['ותוך שנייה קיבלתי שוק.', 'בעברית הייתי חדה, מצחיקה, נוכחת.', '**באנגלית הייתי שקטה, ביישנית, מבולבלת.', 'גם כשכבר ידעתי את השפה.'],
            ['אז החלטתי להרים יד בכל פעם שהמורה ביקשה מתנדב.', 'התבלבלתי.', 'צחקתי.', '**ולמדתי מלא.'],
            ['ושם גם גיליתי את תורת ההגייה.'],
          ]}
        />
        <div style={{ marginTop: '1.4rem' }}>
          <Hand color={YELLOW} size="1.9rem">
            והרגשתי שגיליתי את המטריקס.
          </Hand>
        </div>
        <div style={{ marginTop: '1.8rem' }}>
          <Lines
            tone="rgba(255,255,255,0.85)"
            groups={[
              ['כבר 15 שנה אני מלמדת ישראלים לדבר אנגלית.', 'מנהלים, רופאים, מרצים ויזמים.', 'אנשים מגוגל, פייסבוק, וויז ומאנדיי.'],
            ]}
          />
        </div>

        <p style={{ color: LAV, fontWeight: 700, fontSize: '1.15rem', marginTop: '3.2rem' }}>אלה רק חלק מהתלמידים שלמדו אצלי</p>
        <div className="mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6" style={{ maxWidth: 820, marginTop: '1.6rem' }}>
          {FAMOUS.map((f) => (
            <div key={f.name}>
              <div className="relative mx-auto overflow-hidden" style={{ width: 'min(100%, 150px)', aspectRatio: '1', borderRadius: '50%', border: `4px solid ${YELLOW}` }}>
                <Image src={f.src} alt={f.name} fill sizes="150px" style={{ objectFit: 'cover', objectPosition: f.pos }} />
              </div>
              <p style={{ color: '#fff', fontWeight: 700, fontSize: '1.15rem', marginTop: 10 }}>{f.name}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '3rem' }}>
          <Lines tone="#fff" groups={[['ובערכה הזאת שמתי את שלושת הדברים שאני הכי מאמינה בהם.']]} />
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ backgroundColor: PINK_BG, padding: '5.5rem 16px' }}>
        <H2>הם כבר מדברים</H2>
        <div className="mx-auto grid grid-cols-2 md:grid-cols-4 gap-4" style={{ maxWidth: 1000 }}>
          {VIDEOS.map((t) => (
            <div key={t.file}>
              <video
                controls
                preload="none"
                poster={`/videos/testimonial-${t.file}.jpg`}
                className="w-full rounded-2xl bg-black"
                style={{ aspectRatio: '9 / 16', objectFit: 'cover' }}
              >
                <source src={`/videos/testimonial-${t.file}.mp4`} type="video/mp4" />
              </video>
              <p style={{ fontWeight: 700, fontSize: '1.1rem', marginTop: 8 }}>{t.name}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto flex flex-wrap justify-center items-start gap-6" style={{ maxWidth: 1200, marginTop: '3.4rem' }}>
          {NOTES.map((n) => (
            <div key={n.src} className="relative" style={{ width: 'min(100%, 210px)', transform: `rotate(${n.tilt}deg)` }}>
              <span
                aria-hidden="true"
                className="absolute"
                style={{ top: -10, left: '50%', width: 70, height: 20, marginLeft: -35, backgroundColor: n.tape, zIndex: 1 }}
              />
              <Image
                src={n.src}
                alt="הודעה מתלמידה"
                width={n.w}
                height={n.h}
                sizes="210px"
                className="rounded-lg"
                style={{ width: '100%', height: 'auto', boxShadow: '0 8px 22px rgba(27,48,84,0.15)' }}
              />
            </div>
          ))}
        </div>
        <Cta />
      </section>

      {/* WHAT'S INSIDE + NOT FOR */}
      <section style={{ padding: '5.5rem 16px' }}>
        <H2>מה מקבלים</H2>
        <div className="mx-auto" style={{ maxWidth: 560 }}>
          {[
            'צלילי אנגלית: 34 סרטונים ו־17 דפי תרגול',
            'סמול טוק, קטן עליי: 17 שיעורים, 8 דפי תרגול ותעודת סיום',
            'יאללה, לחזור אחרי: 55 הקלטות להורדה',
            'גישה לתמיד, בלי מנוי',
            'מהמחשב או מהטלפון',
          ].map((t) => (
            <p key={t} style={{ fontSize: '1.2rem', lineHeight: 1.7, color: BODY, margin: '0.5rem 0' }}>
              <span style={{ color: '#1B8A5A', fontWeight: 800 }}>✓</span> {t}
            </p>
          ))}
        </div>

        <div className="mx-auto rounded-3xl" style={{ maxWidth: 560, backgroundColor: LAV_BG, padding: '2rem 1.4rem', marginTop: '3rem' }}>
          <p className="bundle-serif" style={{ fontSize: '1.7rem', fontWeight: 700, color: INK, marginBottom: '0.8rem' }}>
            למי זה לא מתאים
          </p>
          <Lines size="1.2rem" groups={[['למי שעוד לא מבין אנגלית.', 'ולמי שמחפש קסם בלי לפתוח את הפה.']]} />
        </div>
      </section>

      {/* PRICE */}
      <section id="buy" style={{ backgroundColor: INK, padding: '5.5rem 16px' }}>
        <H2 color="#fff">ערכת הדיבור באנגלית</H2>
        <Lines tone="rgba(255,255,255,0.85)" groups={[['אני לא אגיד לכם כמה זה שווה לכם.', 'הנה פשוט המחיר.']]} />
        <div style={{ marginTop: '2.4rem' }}>
          <BundleCheckout />
        </div>
      </section>
    </main>
  )
}
