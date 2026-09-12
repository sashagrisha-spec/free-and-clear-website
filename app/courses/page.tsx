import type { Metadata } from 'next'
import { Suez_One } from 'next/font/google'
import Link from 'next/link'
import MetaPixel from '@/components/MetaPixel'
import HolidayStrip from './HolidayStrip'
import { PROMOTED_COUPON } from '@/lib/coupons'
// Reused from the yalla landing page: a fixed deadline, identical for every
// visitor, not a per-visit evergreen timer that resets and lies.
import CountdownTimer from '@/app/yalla-lachzor-acharei/CountdownTimer'

const display = Suez_One({ subsets: ['hebrew', 'latin'], weight: '400', display: 'swap' })

export const metadata: Metadata = {
  title: 'כל הקורסים | Free & Clear English',
  description: 'כל הקורסים הדיגיטליים של Free & Clear English במקום אחד, מסודרים לפי רמה. בחרו את הקורס שמתאים לאנגלית שלכם היום ותתחילו לדבר.',
  alternates: { canonical: 'https://www.freeandclearenglish.com/courses' },
  openGraph: {
    title: 'כל הקורסים של Free & Clear English',
    description: 'כל הקורסים במקום אחד, מסודרים לפי רמה. בחרו את הקורס שמתאים לאנגלית שלכם היום.',
    url: 'https://www.freeandclearenglish.com/courses',
    siteName: 'Free & Clear English',
    locale: 'he_IL',
    type: 'website',
  },
}

// ═══════════════════════════════════════════════════════════════════════════
//  SASHA: כל מה שצריך לערוך נמצא בבלוק COURSES שמתחת ורק בו.
//
//  לכל קורס:
//    tagline     = שורה אחת מודגשת מתחת לשם
//    whatsInside = "מה קורה בפנים". כל מחרוזת ברשימה היא פסקה נפרדת
//    forWho      = משלים את המשפט "מתאים לכם אם..."
//    kicker      = שורת סיום אופציונלית, מופיעה בירוק מעל הכפתורים
//    bullets     = נקודות קצרות, אופציונלי. רשימה ריקה לא מציירת כלום
//    readMoreUrl = הכתובת של דף הנחיתה המלא
//    buyUrl      = הכתובת של עמוד הסליקה, לרכישה מיידית
//
//  טקסט שנשאר ריק יופיע בדף כמקום שמור מסומן ב-◆.
//  לינק שנשאר ריק יהפוך את הכפתור לאפור עם הערה "חסר לינק",
//  כדי שלא יעלה לאוויר כפתור שנראה תקין ולא מוביל לשומקום.
// ═══════════════════════════════════════════════════════════════════════════

type Level = 'מתחילים' | 'בינוני' | 'בינוני / מתקדם'

type Course = {
  slug: string
  name: string
  level: Level
  price: number
  /** One bold line under the name: what this thing is. */
  tagline: string
  /** "מה קורה בפנים", one string per paragraph. */
  whatsInside: string[]
  /** Completes the sentence "מתאים לכם אם...". */
  forWho: string
  /** Optional closing punch line, shown just above the buttons. */
  kicker?: string
  /** Optional short points. Renders nothing when empty. */
  bullets: string[]
  /** Full landing page. Empty string = button renders visibly dead. */
  readMoreUrl: string
  /** Use when a course has NO separate landing page: shown in place of the
      "read more" button, so the slot stays filled and the row stays symmetric. */
  readMoreNote?: string
  /** Straight to checkout. Empty string = button renders visibly dead. */
  buyUrl: string
}

const COURSES: Course[] = [
  {
    slug: 'etgar-shema',
    name: 'אתגר שמע למתחילים',
    level: 'מתחילים',
    price: 47,
    tagline: '21 הקלטות קצרות שיעזרו לכם סוף סוף לפתוח את הפה.',
    whatsInside: [
      '21 הקלטות אודיו, אחת לכל יום של האתגר, וכולן מגיעות אליכם בלינק אחד מיד אחרי הרכישה. כל הקלטה היא דקה או שתיים בנושא יומיומי, ואתם פשוט חוזרים אחריי. השיטה היא Shadowing, בגרסה שמתאימה גם למתחילים.',
      'זה המוצר היחיד שלי שמתאים גם לאנשים ברמה בסיסית: כאלה שמבינים לא מעט אנגלית, אבל כמעט לא מדברים אותה.',
      'אין סרטונים ואין צורך לשבת מול מחשב. שמים אוזניות ומתרגלים באוטו בדרך לעבודה, תוך כדי סידור המטבח, או בהליכה עם הכלב. הוא לא יעיר לכם על המבטא :)',
    ],
    forWho: 'אתם מבינים אנגלית הרבה יותר טוב ממה שאתם מצליחים לדבר ורוצים להתחיל לאמן את הפה, האוזן והביטחון.',
    bullets: [],
    readMoreUrl: '',
    readMoreNote: 'כל ההסבר נמצא כאן למעלה',
    buyUrl: 'https://secure.cardcom.solutions/EA/EA5/PVxn8Db8UEGNxWe3KEtkPQ/PaymentSP',
  },
  {
    slug: 'yalla-lachzor-acharei',
    name: 'יאללה, לחזור אחרי',
    level: 'בינוני',
    price: 127,
    tagline: 'תוכנית התרגול הכי פופולרית שלי בשנה האחרונה.',
    whatsInside: [
      '55 הקלטות בנושאים שונים, שנועדו להפוך את האנגלית הפסיבית שלכם לאנגלית שאתם באמת משתמשים בה.',
      'אם הקריאה, הכתיבה וההבנה שלכם אחלה, אבל ברגע שאתם צריכים לדבר משהו משתבש - זה בדיוק בשבילכם.',
      'אתם חוזרים אחריי ויחד איתי מתרגלים הגייה, שטף דיבור, מילים מורכבות, חיבורים טבעיים בין מילים, דקדוק בתוך דיבור אמיתי ועוד המון דברים שקשה ללמוד מספר.',
      'פשוט שמים הקלטה וחוזרים אחריי. שוב ושוב. ככה בונים אנגלית שיוצאת מהפה ולא נשארת רק בראש.',
    ],
    forWho: 'יש לכם אנגלית פסיבית טובה ואתם רוצים שהדיבור סוף סוף ידביק את הקצב.',
    kicker: 'אין מצב שאתם עוברים על כל 55 ההקלטות ולא משתפרים.',
    bullets: [],
    readMoreUrl: '/yalla-lachzor-acharei',
    buyUrl: '/yalla-lachzor-acharei#buy',
  },
  {
    slug: 'small-talk',
    name: 'סמול טוק, קטן עליי',
    level: 'בינוני',
    price: 137,
    tagline: 'מיקרו-קורס ממוקד שיעזור לכם להפסיק להרגיש מוזר בסמול טוק.',
    whatsInside: [
      'איך נכנסים לשיחה? איך ממשיכים אותה בלי להיתקע? מה שואלים חוץ מ-"So, what do you do?" ואיך הופכים שיחה עם קולגה, לקוח או מישהו שפגשתם בכנס להרבה יותר טבעית?',
      'הקורס מצולם בעברית ובאנגלית ונותן כלים מאוד פרקטיים סביב הנושא הטריקי הזה שנקרא Small Talk.',
    ],
    forWho: 'האנגלית שלכם בסדר גמור, אבל ברגע שמישהו מחו"ל פונה אליכם בשאלה פשוטה אתם פתאום לא יודעים מה לעשות עם עצמכם :)',
    bullets: [],
    readMoreUrl: 'https://small-talk.ravpage.co.il/smalltalkall',
    buyUrl: 'https://secure.cardcom.solutions/EA/EA5/cfTDi0SJAkCJnWBxeOjVA/PaymentSP',
  },
  {
    slug: 'dabru-beshetef',
    name: 'לדבר אנגלית בשטף וביטחון',
    level: 'בינוני / מתקדם',
    price: 197,
    tagline: 'הקורס הדיגיטלי הכי מעמיק שלי.',
    whatsInside: [
      'קורס מצולם ומקיף למי שרוצה באמת להעמיק באנגלית: לבנות הרגלים חדשים סביב השפה, להבין יותר לעומק הגייה, לרענן את כללי הדקדוק שמעלים אבק עוד מהתיכון, לתרגל בצורה אחרת ומהנה ובעיקר - לשנות את מערכת היחסים עם האנגלית.',
      'הקורס כולו מצולם באנגלית, ולכן הוא מתאים למי שכבר יש לו אנגלית לא רעה ורוצה לקחת אותה שלב קדימה. הוא כן מצריך זמן מול המחשב, אבל אל דאגה - זה לא תואר ואפילו לא סמסטר :)',
    ],
    forWho: 'אתם כבר מסתדרים באנגלית, אבל רוצים לדבר בצורה שוטפת, מדויקת ובטוחה יותר ולהרגיש שהאנגלית באמת הופכת לחלק מכם.',
    bullets: [],
    readMoreUrl: 'https://small-talk.ravpage.co.il/speaknow',
    buyUrl: 'https://secure.cardcom.solutions/EA/EA5/hVhtiN67IEixchc4WCwDkQ/PaymentSP',
  },
]

/* ─────────────────────────── building blocks ─────────────────────────── */

// Hand-drawn underline, same one used on the other Hebrew landing pages.
function Swoosh({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 300 18" fill="none" preserveAspectRatio="none" aria-hidden="true">
      <path d="M4 12 C 80 4, 150 4, 296 10" stroke="var(--yellow)" strokeWidth="6" strokeLinecap="round" />
    </svg>
  )
}

// All card TEXT is navy. The level is carried by a coloured dot in the badge
// and by the strip across the top of the card, never by a second text colour.
const LEVEL_STYLE: Record<Level, { badgeBg: string; dot: string; accent: string }> = {
  'מתחילים': {
    badgeBg: 'rgba(27,138,90,0.13)',
    dot: '#1B8A5A',
    accent: 'linear-gradient(90deg, #34B37B, #1B8A5A)',
  },
  'בינוני': {
    badgeBg: 'rgba(245,200,66,0.30)',
    dot: '#D9A400',
    accent: 'linear-gradient(90deg, #F5C842, #E0A800)',
  },
  'בינוני / מתקדם': {
    badgeBg: 'rgba(27,48,84,0.11)',
    dot: '#1B3054',
    accent: 'linear-gradient(90deg, #3A63A8, #1B3054)',
  },
}

function LevelBadge({ level }: { level: Level }) {
  const s = LEVEL_STYLE[level]
  return (
    <span
      className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap"
      style={{ backgroundColor: s.badgeBg, color: 'var(--navy)' }}
    >
      <span className="rounded-full flex-shrink-0" style={{ width: 7, height: 7, backgroundColor: s.dot }} />
      {level}
    </span>
  )
}

// Marks copy that still has to be written, so nothing blank slips by unnoticed.
function Placeholder({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="block text-sm rounded-lg px-3 py-2"
      style={{ border: '1.5px dashed rgba(27,48,84,0.28)', color: 'var(--navy)', backgroundColor: 'rgba(27,48,84,0.03)' }}
    >
      ◆ {children}
    </span>
  )
}

/* ───────────────────────────── the card ───────────────────────────── */

// SIX rows, and the card borrows them from the grid itself (see .courses-card
// in globals.css). That is what keeps the yellow box and the buttons of one
// card level with the card beside it no matter how long the copy is.
function CourseCard({ course }: { course: Course }) {
  const level = LEVEL_STYLE[course.level]

  return (
    <article
      className="courses-card rounded-3xl"
      style={{
        backgroundColor: 'var(--white)',
        border: '1px solid rgba(27,48,84,0.09)',
        boxShadow: '0 10px 36px rgba(27,48,84,0.10)',
        position: 'relative',
        overflow: 'hidden',
        color: 'var(--navy)',
      }}
    >
      {/* level accent across the top. Positioned, so it never becomes a row. */}
      <span
        aria-hidden="true"
        style={{ position: 'absolute', top: 0, insetInline: 0, height: 5, background: level.accent }}
      />

      {/* row 1 - level + price */}
      <div className="flex items-center justify-between gap-3 px-6 sm:px-7 pt-7">
        <LevelBadge level={course.level} />
        <span className="font-black leading-none" style={{ fontSize: '1.875rem' }}>
          <span className="font-bold" style={{ fontSize: '0.62em', opacity: 0.75 }}>₪</span>
          {course.price}
        </span>
      </div>

      {/* row 2 - name */}
      <h2 className={`${display.className} px-6 sm:px-7 pt-4 leading-tight`} style={{ fontSize: 'clamp(1.375rem, 4vw, 1.625rem)' }}>
        {course.name}
      </h2>

      {/* row 3 - tagline */}
      <p className="px-6 sm:px-7 pt-2.5 text-base font-bold leading-relaxed">
        {course.tagline}
      </p>

      {/* row 4 - the flexible one. All the length difference between courses
          gets absorbed here, which is why the rows below stay aligned. */}
      <div className="px-6 sm:px-7 pt-4 flex flex-col gap-3">
        {course.whatsInside.length > 0
          ? course.whatsInside.map((para, i) => (
              <p key={i} className="text-sm leading-relaxed">{para}</p>
            ))
          : <Placeholder>מה בדיוק קורה בקורס</Placeholder>}

        {course.bullets.length > 0 && (
          <ul className="flex flex-col gap-1.5 mt-1">
            {course.bullets.map(b => (
              <li key={b} className="flex items-start gap-2 text-sm">
                <span className="flex-shrink-0 font-black">✓</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}

        {course.kicker && (
          <p className="text-sm font-bold leading-relaxed mt-1">
            <span
              style={{
                backgroundColor: 'var(--yellow)',
                padding: '0.1em 0.35em',
                borderRadius: 6,
                boxDecorationBreak: 'clone',
                WebkitBoxDecorationBreak: 'clone',
              }}
            >
              {course.kicker}
            </span>
          </p>
        )}
      </div>

      {/* row 5 - "מתאים לכם אם". The line that makes people self-select, so it
          gets its own box instead of blending into the paragraphs above. */}
      <div className="px-6 sm:px-7 pt-6">
        <div
          className="rounded-2xl px-4 py-3.5 h-full"
          style={{ background: 'linear-gradient(135deg, #FFFBEE, #FFF6DC)', border: '1px solid rgba(245,200,66,0.6)' }}
        >
          <h3 className="text-sm font-black mb-1">מתאים לכם אם</h3>
          {course.forWho
            ? <p className="text-sm leading-relaxed">{course.forWho}</p>
            : <Placeholder>למי הקורס הזה מתאים</Placeholder>}
        </div>
      </div>

      {/* row 6 - the two buttons */}
      <div className="px-6 sm:px-7 pt-5 pb-7 flex flex-col sm:flex-row gap-2.5 items-end">
        {course.readMoreUrl
          ? <CardButton href={course.readMoreUrl} variant="outline">לקרוא עוד</CardButton>
          : course.readMoreNote
            ? <SlotNote text={course.readMoreNote} />
            : <PendingButton label="לקרוא עוד" />}

        {course.buyUrl
          ? <CardButton href={course.buyUrl} variant="primary">לרכישה מיידית</CardButton>
          : <PendingButton label="לרכישה מיידית" />}
      </div>
    </article>
  )
}

// Buttons share one component so the two variants can never drift apart in
// size. An external checkout URL (Cardcom) needs a plain <a>; an internal path
// gets next/link for client-side navigation.
const BUTTON_CLASS = 'w-full sm:flex-1 text-center font-bold py-3.5 px-5 rounded-xl transition-opacity hover:opacity-90'

const BUTTON_STYLE: Record<'primary' | 'outline', React.CSSProperties> = {
  primary: {
    backgroundColor: 'var(--yellow)',
    color: 'var(--navy)',
    border: '2px solid transparent',
    boxShadow: '0 6px 18px rgba(245,200,66,0.45)',
  },
  outline: {
    color: 'var(--navy)',
    border: '2px solid var(--navy)',
  },
}

function CardButton({
  href,
  variant,
  children,
}: {
  href: string
  variant: 'primary' | 'outline'
  children: React.ReactNode
}) {
  const style = BUTTON_STYLE[variant]

  if (/^https?:/.test(href)) {
    return <a href={href} className={BUTTON_CLASS} style={style}>{children}</a>
  }
  return <Link href={href} className={BUTTON_CLASS} style={style}>{children}</Link>
}

// For a course with no separate landing page: fills the slot so the row keeps
// its two-up shape and stays level with the card beside it, and tells the
// reader plainly that there is nothing further to go and read.
function SlotNote({ text }: { text: string }) {
  return (
    <span
      className="w-full sm:flex-1 text-center text-sm font-medium rounded-xl flex items-center justify-center"
      style={{ color: 'var(--navy)', opacity: 0.55, border: '2px solid transparent', minHeight: 56 }}
    >
      {text}
    </span>
  )
}

// A button with no destination yet. Rendered visibly dead on purpose: better a
// grey button that says "missing link" than a live one that goes nowhere.
function PendingButton({ label }: { label: string }) {
  return (
    <span
      className="w-full sm:flex-1 text-center font-bold py-3.5 px-5 rounded-xl"
      style={{ backgroundColor: 'rgba(27,48,84,0.05)', color: 'var(--navy)', opacity: 0.5, border: '2px dashed rgba(27,48,84,0.3)' }}
    >
      {label}
      <span className="text-xs font-normal"> · חסר לינק</span>
    </span>
  )
}

const CSS = `
/* Namespaced to this page, and kept in the page instead of globals.css so the
   all-courses layout owns its own rules and nothing can leak elsewhere.
   The whole point of this block is SYMMETRY: every section of a card must line
   up exactly with the same section of the card beside it, however much copy
   each course has. */

.courses-grid {
  display: grid;
  gap: 1.5rem;
}

@media (min-width: 700px) {
  .courses-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* Fallback for a browser without subgrid: a flex column. Buttons still land at
   the bottom, the highlighted boxes may sit a little apart. */
.courses-card {
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

/* The real thing. Each card borrows the grid's OWN rows, so the
   "matches you if" box and the buttons are literally the same rows for both
   cards in a pair. They cannot drift apart. */
@supports (grid-template-rows: subgrid) {
  .courses-card {
    display: grid;
    grid-template-rows: subgrid;
    grid-row: span 6;
    row-gap: 0;
  }
}

.courses-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 50px rgba(27, 48, 84, 0.16);
}

/* Soft dot texture, so the navy is never a flat slab. */
.courses-dots {
  background-image: radial-gradient(rgba(255, 255, 255, 0.16) 1px, transparent 1px);
  background-size: 22px 22px;
}
`

/* ───────────────────────────── the page ─────────────────────────────

   HOME_LINK_NOTE: the two links out to the English site are plain <a> tags on
   purpose. This page is Hebrew (dir="rtl"); the home page is English
   (dir="ltr"). The root layout decides <html lang/dir> from the request path,
   and Next does NOT re-render the root layout during a client-side navigation,
   so a next/link click would land on the English site still flipped to RTL.
   A real page load makes the server set the direction correctly. Do not turn
   these back into <Link>.
   ──────────────────────────────────────────────────────────────────── */

export default function CoursesPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <MetaPixel />
      <HolidayStrip />

      <main
        dir="rtl"
        style={{
          color: 'var(--navy)',
          background: 'linear-gradient(180deg, #FFFCF3 0%, #FBFAFF 42%, #F3F6FD 100%)',
          minHeight: '100vh',
        }}
      >
        {/* ── hero. Navy, but not a flat slab: a gradient, a dot texture and a
            soft yellow glow, rounded off at the bottom. ── */}
        <section
          className="relative overflow-hidden"
          style={{
            background: 'linear-gradient(155deg, #22395F 0%, #16274A 52%, #1B3054 100%)',
            borderBottomLeftRadius: 36,
            borderBottomRightRadius: 36,
          }}
        >
          <span aria-hidden="true" className="courses-dots absolute inset-0" style={{ opacity: 0.55 }} />
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '-45%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '75%',
              height: '150%',
              background: 'radial-gradient(closest-side, rgba(245,200,66,0.20), rgba(245,200,66,0))',
              pointerEvents: 'none',
            }}
          />

          {/* logo bar, sitting inside the hero so there is no seam */}
          <div className="relative max-w-6xl mx-auto px-6 pt-5">
            {/* plain <a>, not next/link, so the English site opens LTR.
                See HOME_LINK_NOTE above. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/" className="text-white font-bold text-lg tracking-tight hover:opacity-80 transition-opacity">
              Free &amp; Clear English
            </a>
          </div>

          <div className="relative max-w-3xl mx-auto px-6 pt-10 pb-16 text-center">
            <h1 className={`${display.className} leading-tight`} style={{ color: '#fff', fontSize: 'clamp(2rem, 7vw, 3.25rem)' }}>
              כל הקורסים{' '}
              <span className="relative inline-block">
                <span style={{ color: 'var(--yellow)' }}>במקום אחד</span>
                <Swoosh className="absolute" style={{ bottom: '-0.2em', insetInline: 0, width: '100%', height: '0.26em' }} />
              </span>
            </h1>

            <p className="mt-7 text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.88)' }}>
              <span className="block">כל קורס כאן בונה משהו אחר באנגלית שלכם.</span>
              <span className="block mt-1.5">בחרו לפי הרמה שבה אתם נמצאים היום, ותתחילו.</span>
            </p>

            {/* Urgency, but honest: one shared deadline, and the whole block
                removes itself the second the sale is over. */}
            {PROMOTED_COUPON && (
              <div className="mt-9">
                <CountdownTimer target={PROMOTED_COUPON.coupon.expires} label="מבצע החגים נגמר בעוד" />
              </div>
            )}
          </div>
        </section>

        {/* ── the four courses ── */}
        <section className="px-6 py-14">
          <div className="courses-grid max-w-5xl mx-auto">
            {COURSES.map(course => (
              <CourseCard key={course.slug} course={course} />
            ))}
          </div>

          <p className="max-w-5xl mx-auto mt-12 text-center text-sm font-medium" style={{ opacity: 0.75 }}>
            כל הקורסים הם תשלום חד-פעמי, והגישה נשארת שלכם.
          </p>
        </section>

        {/* ── footer ── */}
        <footer
          className="relative overflow-hidden mx-4 mb-4 rounded-3xl px-6 py-12"
          style={{ background: 'linear-gradient(155deg, #22395F 0%, #16274A 100%)' }}
        >
          <span aria-hidden="true" className="courses-dots absolute inset-0" style={{ opacity: 0.4 }} />
          <div className="relative max-w-5xl mx-auto text-center">
            <p className="font-bold text-white text-lg">Free &amp; Clear English</p>
            <p className="mt-2 text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
              לא רק לדעת אנגלית, אלא גם לדבר אותה בביטחון
            </p>
            {/* plain <a> on purpose, see HOME_LINK_NOTE above */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              className="inline-block mt-5 text-sm font-bold px-5 py-2.5 rounded-xl transition-opacity hover:opacity-85"
              style={{ backgroundColor: 'var(--yellow)', color: 'var(--navy)' }}
            >
              לאתר הראשי
            </a>
          </div>
        </footer>
      </main>
    </>
  )
}
