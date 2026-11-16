import type { Metadata } from 'next'
import { Rubik } from 'next/font/google'
import Image from 'next/image'
import MetaPixel from '@/components/MetaPixel'
import UtmCapture from '@/components/UtmCapture'
import SpeakNowSignup from './SpeakNowSignup'
import { SN_PRICE } from '@/lib/speak-now'
import { Suspense } from 'react'

// דברו בשטף וביטחון: the sales page on the site (2026-11-15).
// Design: the /bundle page. Copy: word for word from the RavMesser page
// small-talk.ravpage.co.il/speaknow (long dashes swapped for short ones).
const rubik = Rubik({ subsets: ['hebrew', 'latin'], weight: ['300', '400', '500', '700', '900'], display: 'swap' })
const FONTS_URL = 'https://fonts.googleapis.com/css2?family=Gveret+Levin&display=swap'

const PRICE = SN_PRICE

export const metadata: Metadata = {
  title: 'דברו אנגלית בביטחון | Free & Clear English',
  description: 'קורס דיגיטלי שיעזור לכם לשבור את מחסום הדיבור באנגלית. 197 שקלים, תשלום חד פעמי.',
  alternates: { canonical: 'https://www.freeandclearenglish.com/speak-now' },
  openGraph: {
    title: 'דברו אנגלית בביטחון',
    description: 'קורס דיגיטלי שיעזור לכם לשבור את מחסום הדיבור באנגלית',
    url: 'https://www.freeandclearenglish.com/speak-now',
    siteName: 'Free & Clear English',
    locale: 'he_IL',
    type: 'website',
    images: [{ url: 'https://www.freeandclearenglish.com/images/bundle/sasha-laugh.jpg', width: 1400, height: 933 }],
  },
}

const INK = '#1B3054'
const BODY = '#42536D'
const YELLOW = '#F5C842'
const PINK = '#F2B8CB'
const PINK_BG = '#FCEEF3'
const LAV = '#CFC3EE'
const LAV_BG = '#F1EDFB'

/* ---------- building blocks (same as /bundle) ---------- */

// One sentence per line. "**" marks the line that carries the point,
// "__" draws a soft curved line under it.
function Lines({
  groups,
  tone = BODY,
  size = '1.3rem',
  gap = '2.2rem',
}: {
  groups: string[][]
  tone?: string
  size?: string
  gap?: string
}) {
  return (
    <div className="mx-auto" style={{ maxWidth: 640 }}>
      {groups.map((g, gi) => (
        <div key={gi} style={{ marginTop: gi === 0 ? 0 : gap }}>
          {g.map((l, i) => {
            // "*_" = bold, in ink, with the curved line under it.
            if (l.startsWith('*_'))
              return (
                <p key={i} style={{ fontSize: `calc(${size} * 1.12)`, lineHeight: 1.7, color: tone === BODY ? INK : '#fff', fontWeight: 700 }}>
                  <span className="relative inline-block">
                    {l.slice(2)}
                    <svg
                      viewBox="0 0 300 12"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                      style={{ position: 'absolute', left: 0, right: 0, bottom: '-0.18em', width: '100%', height: '0.3em' }}
                    >
                      <path d="M3 8 C 90 2, 190 2, 297 7" stroke={YELLOW} strokeWidth="4" strokeLinecap="round" fill="none" />
                    </svg>
                  </span>
                </p>
              )
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
    <p className="sn-hand" style={{ color, fontSize: `calc(${size} * 1.3)`, lineHeight: 1.4 }}>
      {children}
    </p>
  )
}

function H2({ children, color = INK }: { children: React.ReactNode; color?: string }) {
  return (
    <h2 style={{ color, fontSize: 'clamp(2rem, 6vw, 3rem)', fontWeight: 700, lineHeight: 1.25, marginBottom: '1.6rem' }}>
      {children}
    </h2>
  )
}

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

function Cta({ label = 'קחי אותי לקורס', href = '#buy', dark = false }: { label?: string; href?: string; dark?: boolean }) {
  return (
    <a
      href={href}
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

function Seal() {
  return (
    <div
      className="absolute"
      style={{ width: 132, height: 132, bottom: -40, insetInlineStart: -36, borderRadius: '50%', backgroundColor: INK, boxShadow: '0 10px 30px rgba(0,0,0,0.25)' }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 132 132" width="132" height="132" className="sn-spin">
        <defs>
          <path id="sn-seal-circle" d="M66,66 m-48,0 a48,48 0 1,1 96,0 a48,48 0 1,1 -96,0" />
        </defs>
        <text fill="#fff" fontSize="12.5" fontWeight="700" direction="rtl" style={{ fontFamily: 'inherit' }}>
          <textPath href="#sn-seal-circle" startOffset="50%" textAnchor="middle" textLength="296" lengthAdjust="spacing">
            נעים להכיר · אני סשה דניאל · נעים להכיר · אני סשה ·
          </textPath>
        </text>
      </svg>
      <span className="absolute inset-0 flex items-center justify-center" style={{ color: YELLOW, fontSize: '2.1rem', fontWeight: 700 }}>
        ס
      </span>
    </div>
  )
}

// line: a thin dark rule on the seam, for two light sections that touch.
function Seam({ a, b, color, line = false }: { a: string; b: string; color: string; line?: boolean }) {
  const glyph = (g: string, side: 'left' | 'right', tilt: number, delay: number) => (
    <span
      className="absolute sn-float"
      style={{
        [side]: '4%',
        top: 0,
        transform: 'translateY(-50%)',
        fontSize: 'clamp(70px, 11vw, 140px)',
        lineHeight: 1,
        color,
        opacity: 0.55,
        fontWeight: 700,
        animationDelay: `${delay}s`,
        ['--tilt' as string]: `${tilt}deg`,
      }}
    >
      {g}
    </span>
  )
  return (
    <div className="relative" style={{ height: 0, zIndex: 2, pointerEvents: 'none' }} aria-hidden="true" dir="ltr">
      {line && <div className="absolute inset-x-0" style={{ top: 0, height: 1.5, backgroundColor: 'rgba(27,48,84,0.5)' }} />}
      {glyph(a, 'left', -12, 0)}
      {glyph(b, 'right', 12, 1.6)}
    </div>
  )
}

/* ---------- content ---------- */

const CHAPTERS = [
  {
    name: '1. מיינדסט ומטרות',
    lines: [
      'זה הפרק שבו אתם עושים reset לראש.',
      'אנגלית לא נתקעת בגלל מילים - היא נתקעת בגלל פחד מטעות, לחץ, וחוסר ביטחון.',
      'כאן מיישרים את הראש, בוחרים מטרה ברורה ומהירה לניצחון, ומשחררים את המקום הזה שמחפש שלמות במקום תקשורת.',
    ],
  },
  {
    name: '2. מי אתם באנגלית',
    lines: [
      'כאן כל אחד מגלה מי הוא באנגלית - איך הוא נשמע, איזה טון מרגיש טבעי, ואיך לשמור על אותנטיות בלי להרגיש שהוא “משחק דמות”.',
      'זה פרק של זהות: לא רק איך אתם מדברים, אלא מי אתם הופכים להיות כשאתם מדברים.',
    ],
  },
  {
    name: '3. קצב דיבור',
    lines: [
      'ישראלים נוטים לדבר מהר מדי...',
      'כאן לומדים למצוא את ה-flow הנכון: איפה לנשום, איפה לעצור, ואיך לא לתת ללחץ לדחוף אתכם ל-fast-forward.',
      'קצב נכון = אמינות, סמכות ושקט פנימי.',
    ],
  },
  {
    name: '4. פילרים וחוסר שטף',
    lines: [
      'אממ, אהה, לייק… כל הדברים הקטנים שעושים רעש.',
      'במקום להילחם בהם, לומדים איך להמיר אותם להרגלים חכמים: שתיקות בטוחות, מילים שמחזירות שליטה, ומשפטים שממשיכים אתכם קדימה גם כשאתם תקועים.',
    ],
  },
  {
    name: '5. הגייה נכונה',
    lines: [
      'זה המקום שבו פתאום הכול מתחבר.',
      'איך להזיז אוויר, איפה לפתוח את הפה, איך להבדיל בין TH ל-S בלי להתבייש.',
      'זו למידה דרך תחושה, לא חוקים.',
      'ברגע אחד אתם נשמעים פחות “ישראלים” ויותר עצמכם באנגלית.',
    ],
  },
  {
    name: '6. דקדוק בסיסי קריטי',
    lines: [
      'רק מה שחשוב באמת בשיחה.',
      'הזמנים שאי אפשר בלעדיהם, הטעויות הקלאסיות של ישראלים, ואיך לבנות משפט בלי להיתקע.',
      'גישה פרקטית, ברורה, שמביאה תוצאה מיידית - לא שיעורי לשון.',
    ],
  },
  {
    name: '7. מילים קשות',
    lines: [
      'כאן מטפלים בכל המילים שתוקעות אתכם: כאלה שכולם יודעים “להכיר” אבל לא יודעים להגיד.',
      'איך להגיד אותן נכון, איך לזכור אותן, ואיך לשלוף אותן בלי שתרגישו שאתם “מתאמצים”.',
      'זה משחרר עומס מהראש ומייצר ביטחון.',
    ],
  },
  {
    name: '8. בניית הרגלים',
    lines: [
      'איך להפוך ידע להרגלים - כאלה שעובדים ביום-יום, ב-10–15 דקות.',
      'לא להסתמך על מוטיבציה, אלא לבנות מערכת קטנה, עקבית ואוטומטית.',
      'פה קורה השינוי האמיתי: אתם לא “לומדים אנגלית” אתם מדברים אותה.',
    ],
  },
]

const BONUSES = [
  {
    tag: 'בונוס 1',
    name: 'אתגר אודיו פשוט ומהיר ב-21 נושאים שונים וקריטיים',
    lines: ['אימון מוקלט קצר שילווה אתכם לפני כל שיחה באנגלית.', 'דקה אחת בכל נושא וקיבלת בוסט רציני של משפטים חדשים לתרגול'],
  },
  {
    tag: 'בונוס 2',
    name: 'טמפלטים למיילים עסקיים באנגלית',
    lines: [
      'לא צריך לשבור את הראש איך להתחיל מייל או לנסח משפטים רשמיים.',
      'קבלו מאגר מוכן של טמפלטים חכמים, עם נימה טבעית ומקצועית, שחוסכים זמן - ומונעים טעויות מביכות.',
    ],
  },
]

const FAMOUS = [
  { name: 'ריף נאמן', src: '/images/bundle/reef-neeman.jpg', pos: 'center 30%' },
  { name: 'אביב אלוש', src: '/images/bundle/aviv-alush.jpg', pos: 'center 25%' },
  { name: 'נועה קירל', src: '/images/bundle/noa-kirel.jpg', pos: 'center 30%' },
  { name: 'רן דנקר', src: '/images/bundle/ran-danker.jpg', pos: 'center 25%' },
]

// Screenshots of real emails from students of the digital courses (2026-11-15),
// taken in Gmail with names, avatars and signatures blacked out. Only praise
// lines are shown; ד׳'s email shows only the part she wrote as a testimonial.
const SHOTS: { file: string; w: number; h: number }[] = [
  { file: 'r-talia-2.png', w: 1568, h: 535 },
  { file: 'r-leah-1.png', w: 1568, h: 769 },
  { file: 'r-leah-2.png', w: 1568, h: 359 },
  { file: 'r-keren.png', w: 1568, h: 560 },
  { file: 'r-aviran.png', w: 1568, h: 305 },
  { file: 'r-noa-yalla.png', w: 1568, h: 392 },
  { file: 'r-noa-soe.png', w: 1568, h: 411 },
  { file: 'r-yossi.png', w: 1568, h: 392 },
  { file: 'r-gali.png', w: 1568, h: 593 },
]

// Two free sample lessons, Sasha's picks (2026-11-15).
const SAMPLES: { title: string; vimeoId: string }[] = [
  { title: 'Past simple intro', vimeoId: '1066275181' },
  { title: 'Who are you in English', vimeoId: '1066274961' },
]

const FIT = [
  'משתמשים באנגלית ביום-יום אבל נתקעים ונלחצים כשאתם צריכים לדבר',
  'שופטים כל מילה שיוצאת לכם מהפה',
  'מתים שמישהו ידייק לכם את הדקדוק הבסיסי',
  'מרגישים שאתם נשמעים פחות חכמים ממה שאתם',
  'יודעים שההגייה שלכם צריכה שפצור',
  'רוצים להפסיק “להתכונן” ולהתחיל פשוט לדבר',
]

const FAQ = [
  {
    q: 'זה קורס למתחילים או למתקדמים?',
    a: [
      'הקורס כל כולו באנגלית ולכם הוא לא קורס למתחילים.',
      'אתם חייבים להבין אנגלית כדי להתאמן, כדי לקרוא את התכנים לחזור אחריי ולעשות תרגולים.',
      'רמה בינונית - בהחלט לא למתחילים.',
    ],
  },
  {
    q: 'יש החזר כספי אם אתחרט?',
    a: ['ברור.', 'יש לכם אחריות מלאה.', 'אם עשיתם את כל הקורס והוא לא הניב לכם תוצאות הכסף יוחזר לכם ללא שאלות.'],
  },
  {
    q: 'כמה זמן תהיה לנו גישה לקורס?',
    a: ['ללא הגבלה.', 'גישה מלאה ולתמיד.', 'תוכלו לחזור לתרגולים, לקבצי האודיו ולכל השיעורים - מתי שתרצו, גם בעוד שנה או שנתיים.'],
  },
  {
    q: 'מה ההבדל בין זה לבין סרטונים ביוטיוב?',
    a: [
      'שאלה מעולה.',
      'ביוטיוב יש קטעים מפוזרים.',
      'פה הכול מסודר, מובנה, מדויק.',
      'תהליך אמיתי עם התחלה, אמצע ותוצאה.',
      'אתם לא צריכים לנחש מה ללמוד - רק ללחוץ Play ולעבוד איתי.',
    ],
  },
  {
    q: 'אין לי הרבה זמן. הקורס דורש השקעה יומיומית?',
    a: [
      'ככל שתתאמנו יותר ככה תרגישו את השינוי.',
      'אבל השיעורים קצרים וזמינים לכם לכל החיים ואתם יכולים לעשות אותם מתי שבא לכם ומתי שיש לכם זמן.',
    ],
  },
  {
    q: 'לא חזק/ה בטכנולוגיה. אצליח להבין איך לגשת לתכנים?',
    a: [
      'חד משמעית כן.',
      'מיד אחרי ההרשמה תקבלו מייל עם גישה פשוטה וברורה.',
      'לוחצים - ונכנסים.',
      'אין שום דבר מסובך, ואם בכל זאת מסתבכים - אני כאן לעזור בכל רגע.',
    ],
  },
]

/* ---------- page ---------- */

export default function SpeakNowPage() {
  return (
    <>
      <MetaPixel />
      <UtmCapture />
      <main dir="rtl" className={rubik.className} style={{ backgroundColor: '#fff', color: INK, textAlign: 'center' }}>
        <link rel="stylesheet" href={FONTS_URL} precedence="default" />
        <style>{`
.sn-hand { font-family: 'Gveret Levin', cursive; font-weight: 400; }
@keyframes snSpin { to { transform: rotate(360deg) } }
.sn-spin { animation: snSpin 26s linear infinite; }
@keyframes snFloat { 0%,100% { translate: 0 -50%; rotate: var(--tilt) } 50% { translate: 0 calc(-50% - 12px); rotate: calc(var(--tilt) * -0.5) } }
.sn-float { animation: snFloat 7s ease-in-out infinite; transform: none !important; translate: 0 -50%; rotate: var(--tilt); }
@media (prefers-reduced-motion: reduce) { .sn-spin, .sn-float { animation: none; } }
.sn-chapters { display: grid; gap: 1.4rem; grid-template-columns: 1fr; }
.sn-chapter { display: grid; grid-template-rows: subgrid; grid-row: span 2; }
@media (min-width: 760px) { .sn-chapters { grid-template-columns: repeat(2, 1fr); } }
.sn-bonuses { display: grid; gap: 1.4rem; grid-template-columns: 1fr; }
.sn-bonus { display: grid; grid-template-rows: subgrid; grid-row: span 3; }
@media (min-width: 760px) { .sn-bonuses { grid-template-columns: repeat(2, 1fr); } }
.sn-two { display: grid; gap: 1.6rem; grid-template-columns: 1fr; }
@media (min-width: 760px) { .sn-two { grid-template-columns: 1fr 1fr; } }
.sn-faq summary, .sn-reviews summary { list-style: none; cursor: pointer; }
.sn-reviews summary::-webkit-details-marker { display: none; }
@keyframes snBob { 0%,100% { transform: translateY(0) rotate(-1deg) } 50% { transform: translateY(-10px) rotate(1deg) } }
.sn-bob { animation: snBob 3.2s ease-in-out infinite; }
.sn-bob:hover { animation-play-state: paused; }
.sn-reviews[open] .sn-bob { animation: none; }
.sn-close-hint { display: none !important; }
.sn-reviews[open] .sn-close-hint { display: block !important; }
.sn-reviews[open] .sn-open-hint { display: none !important; }
@media (prefers-reduced-motion: reduce) { .sn-bob { animation: none; } }
.sn-faq summary::-webkit-details-marker { display: none; }
.sn-faq details[open] .sn-plus { transform: rotate(45deg); }
        `}</style>

        {/* HERO */}
        <section className="relative overflow-hidden" style={{ backgroundColor: INK, padding: '3.5rem 16px 6rem' }}>
          <p
            className="inline-block rounded-full"
            style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: YELLOW, fontWeight: 700, fontSize: '1.05rem', padding: '0.45rem 1.2rem' }}
          >
            בוסט לאנגלית מדוברת
          </p>

          <div style={{ marginTop: '2rem' }}>
            <Lines
              tone="rgba(255,255,255,0.85)"
              gap="1.3rem"
              groups={[['גם אתם מבינים אנגלית ורואים נטפליקס בלי כתוביות'], ['אבל נמאס לכם להבין הכול ועדיין להיתקע כשאתם צריכים לדבר?']]}
            />
          </div>

          <h1
            className="mx-auto"
            style={{ color: '#fff', fontSize: 'clamp(2.1rem, 7vw, 4rem)', fontWeight: 900, lineHeight: 1.3, maxWidth: 900, marginTop: '3rem' }}
          >
            הגיע הזמן לשבור את <Mark color={YELLOW}>מחסום הדיבור</Mark> באנגלית
            <br />
            ולדבר <Mark color={PINK}>בחופשיות</Mark> <Mark color={LAV}>ובביטחון</Mark>
          </h1>

          <div style={{ marginTop: '3rem' }}>
            <Hand color={YELLOW}>גם אם האנגלית שלכם לא מושלמת!</Hand>
          </div>

          <div style={{ marginTop: '2.6rem' }}>
            <Lines
              tone="#fff"
              gap="1.1rem"
              groups={[['בלי ״ללמוד״ עם אנשים מהפיליפינים'], ['בלי להתבייש על כל טעות'], ['בלי להילחץ שאין לכם את המילה המדוייקת']]}
            />
          </div>

          <div className="relative mx-auto" style={{ width: 'min(100%, 340px)', marginTop: '2.6rem' }}>
            <div className="relative overflow-hidden" style={{ aspectRatio: '4 / 5', borderRadius: '170px 170px 24px 24px', border: `6px solid ${LAV}` }}>
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

          <Cta label="מה יש בקורס?" href="#inside" />
        </section>

        <Seam a="θ" b="ɹ" color="#8FBCEA" />

        {/* PAIN */}
        <section style={{ padding: '5.5rem 16px' }}>
          <Lines
            gap="1.7rem"
            groups={[
              ['מכירים את זה שאתם יושבים בישיבה באנגלית'],
              ['והכל סבבה - אתם מבינים כל מילה'],
              ['אפילו צוחקים במקום הנכון…'],
              ['**אבל כשמגיע הרגע לדבר?'],
              ['הלב מתחיל לדפוק...', 'הראש מתרוקן...'],
              ['__והפה פשוט לא משתף פעולה.'],
              ['פתאום האנגלית שהייתה שם כל הזמן, נעלמת.', 'ואתם שומעים את עצמכם מגמגמים, מתבלבלים,', 'או גרוע מזה - פשוט שותקים.'],
              ['ואז מישהו אחר לוקח את הבמה, מדבר אנגלית שוטפת,', 'ואתם יושבים שם וחושבים …'],
            ]}
          />
          <p style={{ fontSize: 'clamp(1.7rem, 5vw, 2.4rem)', fontWeight: 900, color: INK, marginTop: '1.2rem' }}>“אבל זה בדיוק מה שרציתי להגיד.”</p>
        </section>

        <Seam a="ʊ" b="ŋ" color="#8FBCEA" line />

        {/* IT KEEPS HAPPENING */}
        <section style={{ backgroundColor: LAV_BG, padding: '5.5rem 16px' }}>
          <Hand size="2rem">וזה קורה שוב ושוב...</Hand>
          <div style={{ marginTop: '2.6rem' }}>
            <Lines
              gap="1.7rem"
              groups={[
                ['בישיבות, בשיחות עם קולגות מחו"ל', 'כשצריך להציג מצגת', 'להוביל שיחה, או אפילו להזמין קפה בכנס...'],
                ['**ואני יודעת כמה זה מתסכל!'],
                ['כי אתם חכמים, מקצועיים,', 'אבל באנגלית זה לא מרגיש ככה.'],
                ['זה מרגיש כאילו פתאום הורידו לכם את הביטחון בכמה רמות.'],
              ]}
            />
          </div>
        </section>

        <Seam a="eɪ" b="ɔː" color="#B9A6E8" line />

        {/* IT'S NOT THE ENGLISH */}
        <section style={{ backgroundColor: PINK_BG, padding: '5.5rem 16px' }}>
          <Lines
            gap="1.7rem"
            groups={[
              ['ובואו…'],
              ['עמוק בפנים אתם יודעים', '**שזה לא באמת האנגלית.', 'זה משהו אחר.', '__זה המחסום שביניכם לבין השפה.'],
              ['**ואת זה חברים? אפשר לשנות.'],
              ['רק שרוב האנשים בכלל לא יודעים איך…'],
            ]}
          />
          <div className="mx-auto" style={{ maxWidth: 760, marginTop: '3rem' }}>
            <Image
              src="/images/speak-now/reviews.png"
              alt="הודעות מתלמידים שסיימו את הקורס"
              width={2000}
              height={1600}
              sizes="(max-width: 760px) 100vw, 760px"
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
          {/* The email screenshots stay folded behind a badge, so the page stays light. */}
          <details className="sn-reviews mx-auto" style={{ maxWidth: 760, marginTop: '3rem' }}>
            <summary className="sn-bob inline-flex items-center rounded-full" style={{ backgroundColor: '#2D2D2D', boxShadow: '0 10px 24px rgba(0,0,0,0.18)' }}>
              <span style={{ padding: '0.75rem 1.6rem 0.75rem 1.1rem', textAlign: 'center' }}>
                <span className="block" style={{ color: '#fff', fontWeight: 700, fontSize: 'clamp(1.05rem, 3.6vw, 1.3rem)' }}>
                  עוד המלצות על הקורסים הדיגיטליים
                </span>
                <span className="sn-open-hint block" style={{ color: YELLOW, fontWeight: 700, fontSize: '0.95rem', marginTop: 2 }}>
                  לחצו כאן לקריאה 👇
                </span>
                <span className="sn-close-hint block" style={{ color: YELLOW, fontWeight: 700, fontSize: '0.95rem', marginTop: 2 }}>
                  לחצו כאן לסגירה
                </span>
              </span>
              <span
                aria-hidden="true"
                className="flex items-center justify-center shrink-0"
                style={{ width: 62, height: 62, borderRadius: '50%', backgroundColor: '#E0393E', border: '4px solid #C62D32', marginInlineStart: -6, marginBlock: -6 }}
              >
                <svg width="28" height="26" viewBox="0 0 24 22" fill="#fff">
                  <path d="M12 21.6 10.3 20C4.2 14.5 0 10.7 0 6.1 0 2.6 2.7 0 6.1 0 8.1 0 10 .9 12 3.3 14 .9 15.9 0 17.9 0 21.3 0 24 2.6 24 6.1c0 4.6-4.2 8.4-10.3 13.9L12 21.6z" />
                </svg>
              </span>
            </summary>
          <div className="flex flex-col gap-5" style={{ marginTop: '2rem' }}>
            {SHOTS.map((r) => (
              <Image
                key={r.file}
                src={`/images/speak-now/reviews/${r.file}`}
                alt="הודעה מתלמיד שרכש קורס דיגיטלי"
                width={r.w}
                height={r.h}
                sizes="(max-width: 760px) 100vw, 760px"
                className="rounded-2xl bg-white"
                style={{ width: '100%', height: 'auto', padding: '0.6rem', boxShadow: '0 6px 20px rgba(217,122,156,0.14)' }}
              />
            ))}
          </div>
          </details>
        </section>

        <Seam a="ə" b="æ" color="#B9A6E8" />

        {/* ABOUT */}
        <section style={{ backgroundColor: INK, padding: '5.5rem 16px' }}>
          <Hand color={YELLOW} size="1.9rem">
            ואיך אני יודעת אתם שואלים?
          </Hand>
          <div className="mx-auto" style={{ maxWidth: 300, marginTop: '2rem' }}>
            <Image
              src="/images/speak-now/instagram.png"
              alt="סשה דניאל באינסטגרם"
              width={1080}
              height={1920}
              sizes="300px"
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
          <div style={{ marginTop: '2rem' }}>
            <Lines
              tone="rgba(255,255,255,0.85)"
              gap="1.7rem"
              groups={[
                ['אם עוד לא יצא לנו להכיר', '**נעים מאוד, אני סשה דניאל.'],
                ['אני קואצ׳רית לתקשורת ותורת ההגייה באנגלית'],
                ['אבל יותר מזה - אני מאמנת אנשים', 'להבין מי הם באנגלית', '__ולעבוד עם עצמם ולא נגד עצמם.'],
              ]}
            />
          </div>
          <Cta />
        </section>

        {/* STORY */}
        <section style={{ padding: '5.5rem 16px' }}>
          <H2>הייתי במקום שלכם</H2>
          <Lines
            gap="1.7rem"
            groups={[
              ['**הייתי במקום שלכם - ואני זוכרת כמה זה מתסכל.'],
              ['מגיל צעיר מאוד אהבתי אנגלית', 'את המוזיקה, את הסדרות, הסרטים...'],
              ['למדתי בעצמי, קראתי מילים של שירים', 'חיקיתי מה ששמעתי בלי חוקים', 'פשוט זרמתי.'],
              ['והיה לי חלום ללמוד משחק בניו יורק...', 'אז כדי לשפר את עצמי במשחק באנגלית', 'לקחתי מורה פרטית במשך שנתיים', 'שחיזקה אצלי את השפה ותחושת הביטחון.'],
            ]}
          />
          <div className="relative mx-auto overflow-hidden rounded-3xl" style={{ maxWidth: 420, aspectRatio: '4 / 3', marginTop: '2.4rem', border: `6px solid ${PINK}` }}>
            <Image src="/images/speak-now/young-sasha.jpg" alt="סשה צעירה על הבמה" fill sizes="420px" style={{ objectFit: 'cover' }} />
          </div>
          <div style={{ marginTop: '3rem' }}>
            <Lines
              gap="1.7rem"
              groups={[
                ['**והגשמתי את החלום.'],
                ['טסתי לניו יורק ללמוד משחק עם ביטחון בשמיים!'],
                ['**אבל תוך שנייה - קיבלתי שוק.'],
                ['בעברית הייתי חדה, מצחיקה, נוכחת.', 'אבל באנגלית? שקטה. ביישנית. מבולבלת.', '(כן, גם כשכבר ידעתי את השפה)'],
              ]}
            />
          </div>
        </section>

        <Seam a="ʒ" b="tʃ" color="#F2B8CB" line />

        {/* TWO OPTIONS */}
        <section style={{ backgroundColor: LAV_BG, padding: '5.5rem 16px' }}>
          <Hand size="2rem">ואז הבנתי שיש לי 2 אפשרויות:</Hand>
          <div className="sn-two mx-auto" style={{ maxWidth: 820, marginTop: '2rem' }}>
            {['1. להתחבא בשורה האחרונה ולהמשיך להתבייש', '2. לקפוץ ראש ולהרים יד בכל פעם שהמורה ביקש/ה מתנדב/ת.'].map((t) => (
              <div key={t} className="rounded-2xl bg-white flex items-center justify-center" style={{ padding: '2rem 1.2rem', boxShadow: '0 6px 20px rgba(140,120,204,0.12)' }}>
                <p style={{ fontSize: '1.3rem', fontWeight: 700, color: INK, lineHeight: 1.6 }}>{t}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '3rem' }}>
            <Lines
              gap="1.7rem"
              groups={[
                ['פחדתי בטירוף אבל החלטתי שאני קופצת למים'],
                ['דיברתי וכמובן שהתבלבלתי.'],
                ['אבל גם צחקתי ובעיקר למדתי.'],
                ['__מלא.'],
                ['ויחד עם לימודי הגייה בבית הספר', 'פתאום הכל התחיל להתחבר', '**והרגשתי ש"פיצחתי" את השפה האנגלית.'],
              ]}
            />
          </div>
        </section>

        <Seam a="ʃ" b="ð" color="#F2B8CB" />

        {/* STUDENTS */}
        <section style={{ backgroundColor: INK, padding: '5.5rem 16px' }}>
          <Lines
            tone="rgba(255,255,255,0.85)"
            gap="1.7rem"
            groups={[
              ['כשחזרתי לארץ התחלתי לאמן שחקנים לאודישנים באנגלית ולהתכונן לתפקידים'],
              ['ועם הזמן התחלתי לאמן מנהלים, רופאים, מרצים ויזמים ומצאתי את עצמי עובדת עם אנשים בחברות כמו גוגל, פייסבוק, ווייז, מאנדיי ועוד..'],
            ]}
          />
          <p style={{ color: LAV, fontWeight: 700, fontSize: '1.15rem', marginTop: '3.2rem' }}>אלו רק חלק מהתלמידים שלמדו אצלי...</p>
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
        </section>

        {/* THE COURSE */}
        <section style={{ padding: '5.5rem 16px' }}>
          <Lines
            gap="1.7rem"
            groups={[
              ['אם הגעתם עד לכאן'],
              ['זה אומר שאתם באמת רוצים להפסיק להתקע', 'ולקחת את האנגלית שלכם לשלב הבא!'],
              ['אז אני מתרגשת להציג בפניכם את'],
            ]}
          />
          <p style={{ fontSize: 'clamp(1.8rem, 5.5vw, 2.6rem)', fontWeight: 900, color: INK, marginTop: '1rem', lineHeight: 1.35 }}>
            “בוסט לאנגלית מדוברת - <span dir="ltr">Speak with Confidence</span>”
          </p>
          <div className="mx-auto" style={{ maxWidth: 820, marginTop: '2.4rem' }}>
            <Image
              src="/images/speak-now/course-mockup.png"
              alt="הקורס Speak Fluently & Confidently"
              width={3840}
              height={2160}
              sizes="(max-width: 820px) 100vw, 820px"
              className="rounded-3xl"
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
          <div style={{ marginTop: '3rem' }}>
            <Lines
              gap="1.7rem"
              groups={[
                ['**קורס דיגיטלי שיעזור לכם לשבור את מחסום הדיבור באנגלית'],
                ['זהו תהליך אינטרקטיבי שבו אתם שותפים פעילים:', 'אלה שיעורים מוקלטים', 'בהם אתם ממש מדברים בקול, חוזרים אחרי', 'וקוראים בקול רם.'],
              ]}
            />
          </div>
        </section>

        <Seam a="aɪ" b="oʊ" color="#8FBCEA" line />

        {/* UNDERSTAND vs SPEAK */}
        <section style={{ backgroundColor: PINK_BG, padding: '5.5rem 16px' }}>
          <Hand size="2rem">אתם חייבים להפנים...</Hand>
          <div style={{ marginTop: '2.6rem' }}>
            <Lines
              gap="1.7rem"
              groups={[
                ['**להבין אנגלית ולדבר אנגלית', '**זה שני דברים שונים לגמרי'],
                ['אלו שני תהליכים נוירולוגים שונים'],
                ['ואתם חייבים לעשות הכל', '__בשביל להתחיל לדבר.'],
              ]}
            />
          </div>
          <Cta label="אני בפנים" />
        </section>

        <Seam a="iː" b="ʌ" color="#F3D46B" />

        {/* INSIDE: bright yellow, the eight chapters */}
        <section id="inside" style={{ backgroundColor: YELLOW, padding: '5.5rem 16px' }}>
          <Hand size="2.2rem">הנה טעימה קטנה ממה שמחכה לך בפנים</Hand>
          <p style={{ fontSize: 'clamp(1.7rem, 5vw, 2.4rem)', fontWeight: 700, color: INK, marginTop: '0.8rem' }}>הפרקים המוקלטים</p>

          <div className="sn-chapters mx-auto" style={{ maxWidth: 1000, marginTop: '2.8rem' }}>
            {CHAPTERS.map((c, i) => (
              <div
                key={c.name}
                className="sn-chapter rounded-3xl"
                style={{ backgroundColor: ['#FFFDF4', '#FFF7FA', '#FAF8FF'][i % 3], padding: '2rem 1.5rem', gap: '0.9rem' }}
              >
                <p style={{ fontSize: '1.6rem', fontWeight: 700, color: INK }}>{c.name}</p>
                <div>
                  {c.lines.map((l) => (
                    <p key={l} style={{ fontSize: '1.1rem', lineHeight: 1.7, color: BODY }}>
                      {l}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Cta dark />
        </section>

        {/* SAMPLE LESSONS */}
        <section style={{ padding: '5.5rem 16px' }}>
          <H2>שני שיעורים לדוגמה</H2>
          <div className="sn-two mx-auto" style={{ maxWidth: 1000 }}>
            {SAMPLES.map((s, i) => (
              <div key={i}>
                <div className="rounded-2xl overflow-hidden flex items-center justify-center" style={{ aspectRatio: '16 / 9', backgroundColor: LAV_BG }}>
                  {s.vimeoId ? (
                    <iframe
                      src={`https://player.vimeo.com/video/${s.vimeoId}`}
                      className="w-full h-full"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      title={s.title}
                    />
                  ) : (
                    <p style={{ color: BODY, fontSize: '1rem' }}>שיעור לדוגמה {i + 1}</p>
                  )}
                </div>
                {s.title && (
                  <p dir="ltr" style={{ fontWeight: 700, fontSize: '1.15rem', marginTop: 10 }}>
                    {s.title}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        <Seam a="dʒ" b="ɪ" color="#B9A6E8" line />

        {/* BONUSES */}
        <section style={{ backgroundColor: LAV_BG, padding: '5.5rem 16px' }}>
          <Hand size="2rem">והאם זה לא מספיק...</Hand>
          <p style={{ fontSize: 'clamp(1.5rem, 4.5vw, 2.1rem)', fontWeight: 700, color: INK, marginTop: '0.8rem' }}>
            הנה המתנות שאתם מקבלים בנוסף לכל התוכן השווה הזה
          </p>
          <div className="sn-bonuses mx-auto" style={{ maxWidth: 900, marginTop: '2.4rem' }}>
            {BONUSES.map((b) => (
              <div key={b.tag} className="sn-bonus rounded-3xl bg-white" style={{ padding: '2rem 1.5rem', gap: '0.8rem', boxShadow: '0 6px 20px rgba(140,120,204,0.12)' }}>
                <p className="sn-hand" style={{ color: '#8C78CC', fontSize: '1.7rem' }}>
                  {b.tag}
                </p>
                <p style={{ fontSize: '1.45rem', fontWeight: 700, color: INK, lineHeight: 1.45 }}>{b.name}</p>
                <div>
                  {b.lines.map((l) => (
                    <p key={l} style={{ fontSize: '1.1rem', lineHeight: 1.7, color: BODY }}>
                      {l}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PRICE + SIGNUP */}
        <section id="buy" style={{ backgroundColor: INK, padding: '5.5rem 16px' }}>
          <H2 color="#fff">אז מה ההשקעה שלכם ב“בוסט לאנגלית מדוברת”?</H2>
          <Lines
            tone="rgba(255,255,255,0.85)"
            gap="1.7rem"
            groups={[
              ['האמת?'],
              ['*_נמאס כבר לראות ״במקום 970״', 'או', '*_״תחשבו כמה זה שווה לכם', '*_אחרי כל השנים האלה שלא עשיתם התקדמתם באנגלית...״'],
              ['אז', '**אני לא אגיד לכם את זה.'],
              ['**הנה פשוט המחיר'],
            ]}
          />
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.3rem', marginTop: '1.6rem' }}>ההשקעה שלכם היא:</p>
          <p style={{ color: YELLOW, fontSize: 'clamp(2.4rem, 8vw, 3.6rem)', fontWeight: 900, lineHeight: 1.2, marginTop: '0.4rem' }}>
            {PRICE} שקלים בלבד
          </p>
          <p style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 700 }}>תשלום חד פעמי!</p>

          <div style={{ marginTop: '3rem' }}>
            <Lines
              tone="rgba(255,255,255,0.85)"
              gap="1.7rem"
              groups={[
                ['אני עושה את מה שאני עושה', 'כי זו שליחות עבורי'],
                ['וכי אני חושבת שכל בן אדם שרוצה לדבר אנגלית בביטחון', 'חייב לעשות את זה מוקדם יותר', 'מאשר מאוחר מידיי.'],
                ['**כל מה שאתם צריכים לעשות זה:', '1️⃣ למלא את הטופס כאן למטה', '2️⃣ להשלים את ההרשמה בעמוד התשלום המאובטח', '3️⃣ ותוך 15 שניות - כל התוכן של “בוסט באנגלית מדוברת” כבר אצלכם במייל'],
              ]}
            />
          </div>

          <div style={{ marginTop: '3rem' }}>
            <Hand color={YELLOW}>אז לאן לשלוח לך את התוכנית? 👇</Hand>
          </div>
          <div style={{ marginTop: '1.6rem' }}>
            <Suspense fallback={null}>
              <SpeakNowSignup price={PRICE} />
            </Suspense>
          </div>
        </section>

        {/* FIT */}
        <section style={{ padding: '5.5rem 16px' }}>
          <H2>הקורס הזה מתאים לכם אם אתם:</H2>
          <div className="mx-auto" style={{ maxWidth: 620 }}>
            {FIT.map((t) => (
              <p key={t} style={{ fontSize: '1.25rem', lineHeight: 1.7, color: BODY, margin: '0.7rem 0' }}>
                <span style={{ color: '#1B8A5A', fontWeight: 800 }}>✓</span> {t}
              </p>
            ))}
          </div>
          <div style={{ marginTop: '3rem' }}>
            <Lines groups={[['**אם תוך כדי קריאה חשבת “זה לגמרי אני”', 'זה סימן שזה הרגע שלך :)']]} />
          </div>
        </section>

        <Seam a="ɜː" b="ɑː" color="#F3D46B" line />

        {/* FAQ */}
        <section className="sn-faq" style={{ backgroundColor: LAV_BG, padding: '5.5rem 16px' }}>
          <H2>שאלות? הנה התשובות:</H2>
          <div className="mx-auto flex flex-col gap-3" style={{ maxWidth: 720 }}>
            {FAQ.map((f) => (
              <details key={f.q} className="rounded-2xl bg-white" style={{ padding: '1.2rem 1.4rem', textAlign: 'right' }}>
                <summary className="flex items-center justify-between gap-4" style={{ fontSize: '1.2rem', fontWeight: 700, color: INK }}>
                  <span>{f.q}</span>
                  <span className="sn-plus shrink-0 transition-transform" style={{ color: '#8C78CC', fontSize: '1.6rem', lineHeight: 1 }} aria-hidden="true">
                    +
                  </span>
                </summary>
                <div style={{ marginTop: '0.8rem' }}>
                  {f.a.map((l) => (
                    <p key={l} style={{ fontSize: '1.1rem', lineHeight: 1.7, color: BODY }}>
                      {l}
                    </p>
                  ))}
                </div>
              </details>
            ))}
          </div>
          <Cta />
        </section>

        {/* FROM THE HEART */}
        <section style={{ backgroundColor: INK, padding: '5.5rem 16px' }}>
          <Hand color={YELLOW} size="2rem">
            ❤️ משהו קטן מהלב ❤️
          </Hand>
          <div style={{ marginTop: '2.6rem' }}>
            <Lines
              tone="rgba(255,255,255,0.85)"
              gap="1.7rem"
              groups={[
                ['אני לא יודעת באיזה שלב אתם נמצאים עכשיו.', 'אולי אתם כבר שנים מדברים אנגלית', 'אבל מרגישים תקועים', 'ואולי אתם מצליחים להסתדר'],
                ['אבל בפנים...'],
                ['זה תמיד מלווה במתח קטן.', 'באותה התחושה שאתם לא נשמעים', 'כמו מי שאתם באמת.'],
                ['לא אספר לכם סיפורים על ניסים', 'כי זו עבודה וזה שינויי הרגלים וזה אמונה בעצמיכם', 'וזה לוקח זמן!'],
                ['אבל…'],
                ['אם תתנו לעצמכם את הצ’אנס הזה', '**אני מבטיחה לכם שיקרה משהו עמוק.', 'לא רק באנגלית'],
                ['אלא בדרך שבה אתם מדברים עם העולם.'],
                ['אני מחכה לכם בצד השני של הקורס', 'כדי שתשמעו סוף סוף את מה שאני כבר יודעת מזמן'],
              ]}
            />
          </div>
          <div style={{ marginTop: '1.4rem' }}>
            <Hand color={YELLOW} size="1.9rem">
              שהקול שלכם, גם באנגלית, יפה בדיוק כמו שהוא.
            </Hand>
          </div>
          <div className="relative mx-auto overflow-hidden" style={{ width: 220, height: 220, borderRadius: '50%', border: `5px solid ${PINK}`, marginTop: '2.6rem' }}>
            <Image src="/images/bundle/sasha-mug.jpg" alt="סשה דניאל" fill sizes="220px" style={{ objectFit: 'cover' }} />
          </div>
          <Cta />
        </section>
      </main>
    </>
  )
}
