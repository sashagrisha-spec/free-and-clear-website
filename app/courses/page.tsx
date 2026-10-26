import type { Metadata } from 'next'
import { Assistant } from 'next/font/google'
import Link from 'next/link'
import MetaPixel from '@/components/MetaPixel'
import HolidayStrip from './HolidayStrip'
import { PROMOTED_COUPON } from '@/lib/coupons'
// Reused from the yalla landing page: a fixed deadline, identical for every
// visitor, not a per-visit evergreen timer that resets and lies.
import CountdownTimer from '@/app/yalla-lachzor-acharei/CountdownTimer'

const assistant = Assistant({ subsets: ['hebrew', 'latin'], weight: ['300', '400', '600', '700'], display: 'swap' })
// The handwritten accent, one line per block, same idea as Caveat on Say It Back.
// Caveat has no Hebrew letters, so Hebrew lines are written in Playpen Sans Hebrew.
// Loaded as a plain Google Fonts stylesheet (see the <link> in the page): through
// next/font this font breaks the Vercel build ("queries have exactly one entry").
const hand = { className: 'courses-hand' }
const HAND_FONT_URL = 'https://fonts.googleapis.com/css2?family=Playpen+Sans+Hebrew:wght@500&display=swap'

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
//    price       = המחיר שמשלמים עליו
//    oldPrice    = המספר שמופיע מתחת בסוגריים, "במקום ..."
//    tagline     = שורה אחת מודגשת מתחת לשם
//    whatsInside = "מה קורה בפנים". כל מחרוזת ברשימה היא פסקה נפרדת
//    forWho      = משלים את המשפט "מתאים לכם אם..."
//    kicker      = שורת סיום אופציונלית, מופיעה בירוק מעל הכפתורים
//    bullets     = נקודות קצרות, אופציונלי. רשימה ריקה לא מציירת כלום
//    readMoreUrl = הכתובת של דף הנחיתה המלא
//    buyUrl      = הכתובת של עמוד הסליקה, לרכישה מיידית
//    buyNote     = במקום buyUrl, לקורס שעוד לא יצא. למשל "יוצא ב-11 באוקטובר"
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
  /** The struck-through "instead of" number under the price. */
  oldPrice: number
  /** One bold line under the name: what this thing is. */
  tagline: string
  /** "מה קורה בפנים", one string per paragraph. */
  whatsInside: string[]
  /** Completes the sentence "מתאים לכם אם...". */
  forWho: string
  /** Optional big yellow line under the price, e.g. a launch-price deadline. */
  launchNote?: string
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
  /** Use INSTEAD of buyUrl for a course that is not out yet: fills the buy slot
      with a release line, so there is no live buy button before the launch. */
  buyNote?: string
}

const COURSES: Course[] = [
  {
    slug: 'the-sound-of-english',
    name: 'The Sound of English',
    level: 'בינוני / מתקדם',
    price: 247,
    oldPrice: 297,
    tagline: 'הקורס החדש שלי להגייה ולמבטא.',
    whatsInside: [
      '34 סרטונים קצרים שמחולקים להסברים, לתרגולים ולבונוסים. בכל שיעור לוקחים צליל אחד, או צמד צלילים מאותה משפחה, ועובדים עליו עד הסוף.',
      'קודם אני מסבירה בעברית מה בדיוק הפה שלכם צריך לעשות, בלי מונחים מפוצצים ובלי סימנים פונטיים שאף אחד לא מבין. אחר כך מתרגלים יחד באנגלית: קודם מילים, ואז משפטים מהחיים האמיתיים. אתם חוזרים אחריי בקול, ואני איתכם.',
      'שעה וחצי של סרטונים סך הכל, בקצב שלכם, ועוד דפי תרגול להורדה. גישה לתמיד, בלי מנוי ובלי תפוגה.',
    ],
    forWho: 'האנגלית שלכם טובה, אבל עדיין מבקשים מכם לחזור על מה שאמרתם, או שאתם שומעים את עצמכם ויודעים שהצליל לא יוצא נכון.',
    kicker: 'שני שיעורים פתוחים לצפייה חופשית בדף הקורס, הסבר אחד ותרגול אחד.',
    bullets: [],
    readMoreUrl: '/the-sound-of-english',
    buyUrl: '/the-sound-of-english',
  },
  {
    slug: 'yalla-lachzor-acharei',
    name: 'יאללה, לחזור אחרי',
    level: 'בינוני',
    price: 167,
    oldPrice: 197,
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
    price: 187,
    oldPrice: 237,
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
    slug: 'speak-now',
    name: 'דברו בשטף וביטחון',
    level: 'בינוני / מתקדם',
    price: 237,
    oldPrice: 267,
    tagline: 'הקורס הכי מעמיק שלי, לאנשים שכבר יודעים אנגלית ורוצים באמת לדבר אותה.',
    whatsInside: [
      'הקורס כולו באנגלית: הקדמה, שבעה פרקים ובונוסים. הפרקים מפרקים את הלמידה לשלבים ברורים, אחד אחרי השני.',
      'כל פרק פותח את הראש לתחום אחר שמשפיע על הדיבור שלכם, ומסביר למה הוא חשוב: דקדוק בסיסי, הגייה, אוצר מילים, שטף, והחסמים הפסיכולוגיים שעוצרים אתכם גם כשאתם יודעים מה להגיד.',
    ],
    forWho: 'אתם יודעים אנגלית, מרגישים בנוח ללמוד בה, ורוצים לעבוד על הדיבור שלכם לעומק.',
    bullets: [],
    readMoreUrl: 'https://small-talk.ravpage.co.il/speaknow',
    buyUrl: 'https://secure.cardcom.solutions/EA/EA5/hVhtiN67IEixchc4WCwDkQ/PaymentSP',
  },
  {
    slug: 'etgar-shema',
    name: 'אתגר שמע למתחילים',
    level: 'מתחילים',
    price: 47,
    oldPrice: 77,
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
]


/* ─────────────────────────── building blocks ─────────────────────────── */

// Shown last, on its own, under the "I don't teach beginners" line.
const BEGINNERS_SLUG = 'etgar-shema'

const INK = '#1B3054'
const BODY = '#42536D'
const SOFT = '#7C8AA0'

// Every sentence starts on its own line. Splits after . ! ? only when a space
// follows, so "So, what do you do?" inside quotes and the :) smileys stay whole.
function sentences(text: string): string[] {
  return text.split(/(?<=[.!?])\s+/).filter(Boolean)
}

function SentenceLines({ text, style }: { text: string; style?: React.CSSProperties }) {
  return (
    <p style={style}>
      {sentences(text).map((line, i) => (
        <span key={i} className="block" style={{ marginTop: i === 0 ? 0 : '0.35rem' }}>{line}</span>
      ))}
    </p>
  )
}

// All card TEXT is navy. The level is carried only by a coloured dot.
const LEVEL_DOT: Record<Level, string> = {
  'מתחילים': '#34B37B',
  'בינוני': '#E0A800',
  'בינוני / מתקדם': '#3A63A8',
}

function LevelBadge({ level }: { level: Level }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full whitespace-nowrap"
      style={{ backgroundColor: 'rgba(27,48,84,0.05)', color: INK, fontSize: '0.95rem', fontWeight: 600, padding: '0.35rem 1rem' }}
    >
      <span className="rounded-full flex-shrink-0" style={{ width: 8, height: 8, backgroundColor: LEVEL_DOT[level] }} />
      {level}
    </span>
  )
}

// Marks copy that still has to be written, so nothing blank slips by unnoticed.
function Placeholder({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="block text-sm rounded-lg px-3 py-2"
      style={{ border: '1.5px dashed rgba(27,48,84,0.28)', color: INK, backgroundColor: 'rgba(27,48,84,0.03)' }}
    >
      ◆ {children}
    </span>
  )
}

/* Big pastel IPA glyphs floating behind the cards, mirrored pairs. */
const BLUE_G = '#8FBCEA'
const GOLD_G = '#F3D46B'

function Phonetics({ glyphs }: { glyphs: Array<{ g: string; top: string; left: string; size: number; rot: number; c: string; d: number }> }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden select-none">
      {glyphs.map((s, i) => (
        <span
          key={i}
          className="courses-float"
          style={{ position: 'absolute', top: s.top, left: s.left, fontSize: s.size, lineHeight: 1, color: s.c, opacity: 0.45, fontWeight: 300, animationDelay: `${s.d}s` }}
        >
          <span style={{ display: 'inline-block', transform: `rotate(${s.rot}deg)` }}>{s.g}</span>
        </span>
      ))}
    </div>
  )
}

const HERO_GLYPHS = [
  { g: 'θ', top: '10%', left: '4%', size: 180, rot: -14, c: BLUE_G, d: 0 },
  { g: 'iː', top: '10%', left: '80%', size: 180, rot: 14, c: BLUE_G, d: 1.1 },
  { g: 'ʃ', top: '58%', left: '8%', size: 140, rot: 8, c: GOLD_G, d: 0.6 },
  { g: 'ə', top: '58%', left: '84%', size: 140, rot: -8, c: GOLD_G, d: 1.8 },
]

const GRID_GLYPHS = [
  { g: 'ð', top: '6%', left: '2%', size: 200, rot: 8, c: GOLD_G, d: 0.8 },
  { g: 'ʌ', top: '6%', left: '86%', size: 200, rot: -8, c: GOLD_G, d: 1.9 },
  { g: 'ŋ', top: '52%', left: '1%', size: 170, rot: 6, c: BLUE_G, d: 1.0 },
  { g: 'uː', top: '52%', left: '84%', size: 170, rot: -6, c: BLUE_G, d: 2.1 },
]

/* ───────────────────────────── the card ───────────────────────────── */

// SIX rows, and the card borrows them from the grid itself (see .courses-card
// below). That is what keeps the yellow box and the buttons of one card level
// with the card beside it no matter how long the copy is.
function CourseCard({ course }: { course: Course }) {
  return (
    <article
      className="courses-card rounded-[2rem] text-center"
      style={{
        backgroundColor: '#fff',
        border: '1px solid rgba(27,48,84,0.10)',
        boxShadow: '0 20px 48px rgba(27,48,84,0.06)',
        color: INK,
      }}
    >
      {/* row 1 - level + price */}
      <div className="flex flex-col items-center gap-4 px-7 sm:px-9 pt-9">
        <LevelBadge level={course.level} />
        <span className="flex items-baseline justify-center gap-3">
          <span style={{ fontSize: '1.25rem', fontWeight: 600, color: SOFT, textDecoration: 'line-through' }}>₪{course.oldPrice}</span>
          <span style={{ fontSize: '2.6rem', fontWeight: 700, lineHeight: 1, color: INK }}>₪{course.price}</span>
        </span>
        {course.launchNote && (
          <span
            className="rounded-full"
            style={{ backgroundColor: 'var(--yellow)', color: INK, fontSize: 'clamp(1.2rem, 3.4vw, 1.45rem)', fontWeight: 700, padding: '0.55rem 1.5rem', boxShadow: '0 10px 24px rgba(245,200,66,0.35)' }}
          >
            ⏳ {course.launchNote}
          </span>
        )}
      </div>

      {/* row 2 - name */}
      <h2 className="px-7 sm:px-9 pt-5" style={{ fontSize: 'clamp(1.6rem, 4vw, 1.95rem)', fontWeight: 700, lineHeight: 1.3, letterSpacing: '-0.01em' }}>
        {course.name}
      </h2>

      {/* row 3 - tagline, the one handwritten line of the card */}
      <div className="px-7 sm:px-9 pt-3">
        <p className={hand.className} style={{ fontSize: '1.2rem', fontWeight: 500, lineHeight: 1.6, color: INK }}>
          {course.tagline}
        </p>
      </div>

      {/* row 4 - the flexible one. All the length difference between courses
          gets absorbed here, which is why the rows below stay aligned. */}
      <div className="px-7 sm:px-9 pt-6 flex flex-col gap-5">
        {course.whatsInside.length > 0
          ? course.whatsInside.map((para, i) => (
              <SentenceLines key={i} text={para} style={{ fontSize: '1.08rem', fontWeight: 300, lineHeight: 1.75, color: BODY }} />
            ))
          : <Placeholder>מה בדיוק קורה בקורס</Placeholder>}

        {course.bullets.length > 0 && (
          <ul className="flex flex-col gap-1.5">
            {course.bullets.map(b => (
              <li key={b} style={{ fontSize: '1.05rem', color: BODY }}>✓ {b}</li>
            ))}
          </ul>
        )}

        {course.kicker && (
          <p style={{ fontSize: '1.12rem', fontWeight: 600, lineHeight: 1.75 }}>
            <span
              style={{
                background: 'linear-gradient(transparent 55%, rgba(245,200,66,0.75) 55%)',
                padding: '0 0.2em',
                boxDecorationBreak: 'clone',
                WebkitBoxDecorationBreak: 'clone',
              }}
            >
              {course.kicker}
            </span>
          </p>
        )}
      </div>

      {/* row 5 - "מתאים לכם אם", warm and bright, never grey */}
      <div className="px-7 sm:px-9 pt-8">
        <div
          className="rounded-3xl h-full"
          style={{ background: 'linear-gradient(180deg, #FFF5D6 0%, #FFFBEE 100%)', border: '1.5px solid rgba(245,200,66,0.6)', padding: '1.2rem 1.4rem' }}
        >
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem' }}>מתאים לכם אם</h3>
          {course.forWho
            ? <SentenceLines text={course.forWho} style={{ fontSize: '1.05rem', fontWeight: 400, lineHeight: 1.7, color: INK }} />
            : <Placeholder>למי הקורס הזה מתאים</Placeholder>}
        </div>
      </div>

      {/* row 6 - the two buttons */}
      <div className="px-7 sm:px-9 pt-7 pb-9 flex flex-col sm:flex-row gap-3 items-end">
        {course.readMoreUrl
          ? <CardButton href={course.readMoreUrl} variant="outline">לקרוא עוד</CardButton>
          : course.readMoreNote
            ? <SlotNote text={course.readMoreNote} />
            : <PendingButton label="לקרוא עוד" />}

        {course.buyUrl
          ? <CardButton href={course.buyUrl} variant="primary">לרכישה מיידית</CardButton>
          : course.buyNote
            ? <ReleaseNote text={course.buyNote} />
            : <PendingButton label="לרכישה מיידית" />}
      </div>
    </article>
  )
}

// Buttons share one component so the two variants can never drift apart in
// size. An external checkout URL (Cardcom) needs a plain <a>; an internal path
// gets next/link for client-side navigation.
const BUTTON_CLASS = 'w-full sm:flex-1 text-center rounded-full transition-transform hover:-translate-y-0.5'
const BUTTON_BASE: React.CSSProperties = { fontSize: '1.1rem', fontWeight: 700, padding: '0.95rem 1.2rem', minHeight: 58 }

const BUTTON_STYLE: Record<'primary' | 'outline', React.CSSProperties> = {
  primary: {
    ...BUTTON_BASE,
    backgroundColor: 'var(--yellow)',
    color: INK,
    border: '1.5px solid transparent',
    boxShadow: '0 12px 28px rgba(245,200,66,0.35)',
  },
  outline: {
    ...BUTTON_BASE,
    color: INK,
    border: '1.5px solid rgba(27,48,84,0.35)',
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
// its two-up shape and stays level with the card beside it.
function SlotNote({ text }: { text: string }) {
  return (
    <span
      className="w-full sm:flex-1 text-center flex items-center justify-center rounded-full"
      style={{ ...BUTTON_BASE, fontWeight: 400, color: SOFT, border: '1.5px solid transparent' }}
    >
      {text}
    </span>
  )
}

// Fills the buy slot for a course that is not out yet. Same box as a real
// button so the row stays level, but plainly not a button.
function ReleaseNote({ text }: { text: string }) {
  return (
    <span
      className="w-full sm:flex-1 text-center rounded-full"
      style={{ ...BUTTON_BASE, backgroundColor: 'rgba(245,200,66,0.18)', color: INK, border: '1.5px dashed var(--yellow)' }}
    >
      ⏳ {text}
    </span>
  )
}

// A button with no destination yet. Rendered visibly dead on purpose.
function PendingButton({ label }: { label: string }) {
  return (
    <span
      className="w-full sm:flex-1 text-center rounded-full"
      style={{ ...BUTTON_BASE, backgroundColor: 'rgba(27,48,84,0.05)', color: INK, opacity: 0.5, border: '1.5px dashed rgba(27,48,84,0.3)' }}
    >
      {label}
      <span className="text-xs font-normal"> · חסר לינק</span>
    </span>
  )
}

const CSS = `
/* Namespaced to this page. The whole point of the grid rules is SYMMETRY:
   every section of a card lines up exactly with the same section of the card
   beside it, however much copy each course has. */

.courses-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 2rem;
}

@media (min-width: 760px) {
  .courses-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  /* An odd card out at the end sits centred, at exactly one column's width. */
  .courses-card:last-child:nth-child(odd) {
    grid-column: 1 / -1;
    justify-self: center;
    width: calc(50% - 1rem);
  }
}

/* Fallback for a browser without subgrid: a flex column. */
.courses-card {
  display: flex;
  flex-direction: column;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

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
  box-shadow: 0 26px 60px rgba(27, 48, 84, 0.10);
}

.courses-hand { font-family: 'Playpen Sans Hebrew', cursive; }

@keyframes coursesFloat { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-9px) } }
.courses-float { animation: coursesFloat 4.5s ease-in-out infinite; }
@keyframes coursesBounce { 0%,100% { transform: translateY(0) } 50% { transform: translateY(8px) } }
.courses-bounce { animation: coursesBounce 1.8s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .courses-float, .courses-bounce { animation: none !important; } }
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
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href={HAND_FONT_URL} precedence="default" />
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <MetaPixel />
      <HolidayStrip />

      <main dir="rtl" className={assistant.className} style={{ color: INK, backgroundColor: '#fff', minHeight: '100vh', textAlign: 'center' }}>
        {/* ── hero ── */}
        <section className="relative overflow-hidden" style={{ backgroundColor: INK }}>
          <div aria-hidden className="absolute" style={{ top: -200, right: -150, width: 560, height: 560, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,200,66,0.20) 0%, rgba(245,200,66,0) 70%)' }} />
          <div aria-hidden className="absolute" style={{ top: -200, left: -150, width: 560, height: 560, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,200,66,0.20) 0%, rgba(245,200,66,0) 70%)' }} />
          <Phonetics glyphs={HERO_GLYPHS} />

          {/* logo, centred. Plain <a>, see HOME_LINK_NOTE above. */}
          <div className="relative max-w-6xl mx-auto px-6 pt-8">
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/" className="inline-block text-white hover:opacity-80 transition-opacity" style={{ fontSize: '1.15rem', fontWeight: 600, letterSpacing: '-0.01em' }}>
              Free &amp; Clear English
            </a>
          </div>

          <div className="relative max-w-3xl mx-auto px-6 pt-16 pb-24">
            <h1 style={{ color: '#fff', lineHeight: 1.25, letterSpacing: '-0.02em' }}>
              <span className="block" style={{ fontSize: 'clamp(2rem, 5.6vw, 3.2rem)', fontWeight: 400 }}>כל הקורסים</span>
              <span className="block" style={{ marginTop: '0.25em', fontSize: 'clamp(2.6rem, 8vw, 4.2rem)', fontWeight: 700, color: 'var(--yellow)' }}>
                במקום אחד
              </span>
            </h1>

            <div className="mt-12" style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.25rem', fontWeight: 300, lineHeight: 1.6 }}>
              <p>כל קורס כאן בונה משהו אחר באנגלית שלכם.</p>
              <p className="mt-4">בחרו לפי הרמה שבה אתם נמצאים היום,</p>
              <p className={`${hand.className} mt-6`} style={{ fontSize: 'clamp(1.7rem, 5vw, 2.2rem)', fontWeight: 500, color: 'var(--yellow)', lineHeight: 1.3 }}>
                ותתחילו.
              </p>
              <a href="#courses" aria-label="לקורסים" className="courses-bounce inline-block mt-8" style={{ color: 'var(--yellow)' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 4v15M5 12l7 7 7-7" />
                </svg>
              </a>
            </div>

            {/* Urgency, but honest: one shared deadline, and the whole block
                removes itself the second the sale is over. */}
            {PROMOTED_COUPON && (
              <div className="mt-12">
                <CountdownTimer target={PROMOTED_COUPON.coupon.expires} label="מבצע החגים נגמר בעוד" />
              </div>
            )}
          </div>
        </section>

        {/* ── the courses ── */}
        <section id="courses" className="relative overflow-hidden px-5 sm:px-6 py-24" style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FFFBEE 100%)' }}>
          <Phonetics glyphs={GRID_GLYPHS} />
          <div className="relative courses-grid max-w-5xl mx-auto">
            {COURSES.filter(c => c.slug !== BEGINNERS_SLUG).map(course => (
              <CourseCard key={course.slug} course={course} />
            ))}
          </div>

          {/* The beginners' challenge sits apart, after its own line. */}
          <div className="relative max-w-5xl mx-auto mt-24 mb-12">
            <p style={{ fontSize: '1.3rem', fontWeight: 300, color: BODY, lineHeight: 1.6 }}>ולמרות שאני לא מלמדת מתחילים,</p>
            <p className={`${hand.className} mt-3`} style={{ fontSize: 'clamp(1.6rem, 4.6vw, 2.1rem)', fontWeight: 500, color: INK, lineHeight: 1.4 }}>
              יש לכם פה אתגר למתחילים :)
            </p>
          </div>
          <div className="relative courses-grid max-w-5xl mx-auto">
            {COURSES.filter(c => c.slug === BEGINNERS_SLUG).map(course => (
              <CourseCard key={course.slug} course={course} />
            ))}
          </div>

          <p className="relative max-w-5xl mx-auto mt-16" style={{ fontSize: '1.15rem', fontWeight: 400, color: BODY }}>
            כל הקורסים הם תשלום חד-פעמי, והגישה נשארת שלכם.
          </p>
        </section>

        {/* ── footer ── */}
        <footer className="relative overflow-hidden px-6 py-20" style={{ backgroundColor: INK }}>
          <div aria-hidden className="absolute" style={{ bottom: -260, left: '50%', transform: 'translateX(-50%)', width: 620, height: 520, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,200,66,0.16) 0%, rgba(245,200,66,0) 70%)' }} />
          <div className="relative max-w-5xl mx-auto">
            <p style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 600 }}>Free &amp; Clear English</p>
            <p className={`${hand.className} mt-4`} style={{ fontSize: 'clamp(1.4rem, 4vw, 1.8rem)', fontWeight: 500, color: 'var(--yellow)', lineHeight: 1.4 }}>
              לא רק לדעת אנגלית, אלא גם לדבר אותה בביטחון
            </p>
            {/* plain <a> on purpose, see HOME_LINK_NOTE above */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              className="inline-block mt-9 rounded-full transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: 'var(--yellow)', color: INK, fontSize: '1.05rem', fontWeight: 700, padding: '0.85rem 2.2rem' }}
            >
              לאתר הראשי
            </a>
          </div>
        </footer>
      </main>
    </>
  )
}
