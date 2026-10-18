import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Assistant } from 'next/font/google'
import Image from 'next/image'
import MetaPixel from '@/components/MetaPixel'
import UtmCapture from '@/components/UtmCapture'
import CheckoutForm from './CheckoutForm'

const assistant = Assistant({ subsets: ['hebrew', 'latin'], weight: ['300', '400', '600', '700'], display: 'swap' })

export const metadata: Metadata = {
  title: 'The Sound of English | קורס הגייה ומבטא באנגלית',
  description:
    'אתם מדברים אנגלית לא רע, אז למה עדיין מבקשים מכם לחזור שוב על מה שאמרתם? קורס דיגיטלי להגייה ומבטא: 34 סרטונים קצרים, גישה לתמיד. ₪97 במקום ₪247.',
  alternates: { canonical: 'https://www.freeandclearenglish.com/the-sound-of-english' },
  openGraph: {
    title: 'The Sound of English',
    description: 'קורס הגייה ומבטא באנגלית. 34 סרטונים קצרים, גישה לתמיד. ₪97 במקום ₪247.',
    url: 'https://www.freeandclearenglish.com/the-sound-of-english',
    siteName: 'Free & Clear English',
    locale: 'he_IL',
    type: 'website',
  },
}

const INK = '#1B3054'
const BODY = '#42536D'
const SOFT = '#7C8AA0'
const GOLD = '#C9A227'

/* ---------- lines ---------- */
/* Every paragraph is a stack of short centred lines. Anything emphasised gets
   its OWN line, so the emphasis stays symmetrical around the centre axis. */

type Kind = 'n' | 'b' | 'hl' | 'u' | 'big'
type Line = { t: React.ReactNode; k?: Kind }

function Lines({ lines, tone = BODY }: { lines: Line[]; tone?: string }) {
  return (
    <div className="mx-auto" style={{ maxWidth: 680 }}>
      {lines.map((l, i) => {
        const k = l.k ?? 'n'
        const base: React.CSSProperties = {
          margin: k === 'n' ? '0.5rem auto' : '1.15rem auto',
          lineHeight: 1.6,
          textAlign: 'center',
        }
        if (k === 'n') return <p key={i} style={{ ...base, fontSize: '1.22rem', fontWeight: 300, color: tone }}>{l.t}</p>
        if (k === 'b')
          return <p key={i} style={{ ...base, fontSize: '1.42rem', fontWeight: 700, color: tone === BODY ? INK : tone }}>{l.t}</p>
        if (k === 'big')
          return <p key={i} style={{ ...base, fontSize: '1.62rem', fontWeight: 600, lineHeight: 1.45, color: tone === BODY ? INK : tone }}>{l.t}</p>
        if (k === 'u')
          return (
            <p key={i} style={{ ...base, fontSize: '1.32rem', fontWeight: 600, color: tone === BODY ? INK : tone }}>
              <span className="relative inline-block">
                {l.t}
                <svg
                  viewBox="0 0 300 12"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                  style={{ position: 'absolute', left: 0, right: 0, bottom: '-0.26em', width: '100%', height: '0.32em' }}
                >
                  <path d="M3 8 C 90 2, 190 2, 297 7" stroke={GOLD} strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.9" />
                </svg>
              </span>
            </p>
          )
        return (
          <p key={i} style={{ ...base, fontSize: '1.42rem', fontWeight: 600 }}>
            <span
              style={{
                // On navy the half-marker hides the ink text, so it becomes a full yellow box.
                background: tone === BODY ? 'linear-gradient(transparent 55%, rgba(245,200,66,0.8) 55%)' : 'var(--yellow)',
                color: INK,
                padding: tone === BODY ? '0 0.22em' : '0.02em 0.3em',
                borderRadius: tone === BODY ? 0 : 6,
                boxDecorationBreak: 'clone',
                WebkitBoxDecorationBreak: 'clone',
              }}
            >
              {l.t}
            </span>
          </p>
        )
      })}
    </div>
  )
}

/* ---------- decorative phonetics ---------- */

const BLUE_G = '#8FBCEA'
const GOLD_G = '#F3D46B'
const PINK_G = '#F0A9C0'

function Phonetics({ set = 0 }: { set?: number }) {
  // Mirrored pairs: whatever sits on the right has a partner on the left at the
  // same height, same size, opposite tilt. The page reads symmetric even though
  // the background is busy. Each pair shares a colour; each glyph floats on its
  // own delay so the movement never looks mechanical.
  const packs = [
    [
      { g: 'θ', top: '7%', left: '5%', size: 185, rot: -14, c: BLUE_G, d: 0 },
      { g: 'iː', top: '7%', left: '80%', size: 185, rot: 14, c: BLUE_G, d: 1.1 },
      { g: 'ʃ', top: '64%', left: '7%', size: 150, rot: 8, c: GOLD_G, d: 0.6 },
      { g: 'ə', top: '64%', left: '83%', size: 150, rot: -8, c: GOLD_G, d: 1.8 },
    ],
    [
      { g: 'ɹ', top: '9%', left: '6%', size: 170, rot: 12, c: PINK_G, d: 0.4 },
      { g: 'æ', top: '9%', left: '81%', size: 170, rot: -12, c: PINK_G, d: 1.5 },
      { g: 'ŋ', top: '62%', left: '4%', size: 145, rot: 6, c: BLUE_G, d: 1.0 },
      { g: 'uː', top: '62%', left: '82%', size: 145, rot: -6, c: BLUE_G, d: 2.1 },
    ],
    [
      { g: 'ð', top: '8%', left: '7%', size: 165, rot: 8, c: GOLD_G, d: 0.8 },
      { g: 'ʌ', top: '8%', left: '81%', size: 165, rot: -8, c: GOLD_G, d: 1.9 },
      { g: 'ɔː', top: '63%', left: '5%', size: 150, rot: -5, c: PINK_G, d: 0.2 },
      { g: 'ɪ', top: '63%', left: '85%', size: 150, rot: 5, c: PINK_G, d: 1.4 },
    ],
  ]
  const pack = packs[set % packs.length]
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden select-none">
      {pack.map((s, i) => (
        <span
          key={i}
          className="fce-float"
          style={{
            position: 'absolute',
            top: s.top,
            left: s.left,
            fontSize: s.size,
            lineHeight: 1,
            // The tilt lives on an inner span: the float animates the outer
            // transform, and one element cannot hold both.
            color: s.c,
            opacity: s.c === PINK_G ? 0.36 : 0.45,
            fontWeight: 300,
            animationDelay: `${s.d}s`,
          }}
        >
          <span style={{ display: 'inline-block', transform: `rotate(${s.rot}deg)` }}>{s.g}</span>
        </span>
      ))}
    </div>
  )
}

/* Confetti, borrowed from the giveaway page so the two feel like one launch.
   Mirrored left and right around the centre axis. Used sparingly: only where
   the page is celebrating (the opening and the buy box), never over reading
   text. `tone` lets it sit on the navy section without disappearing. */
function Confetti({ tone = 'light' }: { tone?: 'light' | 'onNavy' }) {
  const colors = tone === 'onNavy'
    ? { a: '#F5C842', b: '#9CC6F0', c: '#F3B6CA' }
    : { a: '#F5C842', b: '#7FB0E4', c: '#F0A9C0' }
  const half = [
    { top: '11%', x: 15, w: 13, h: 13, rot: 22, c: colors.a, round: false, d: 0 },
    { top: '24%', x: 28, w: 9, h: 9, rot: 0, c: colors.b, round: true, d: 0.7 },
    { top: '41%', x: 8, w: 11, h: 11, rot: -18, c: colors.c, round: false, d: 1.3 },
    { top: '58%', x: 24, w: 8, h: 8, rot: 0, c: colors.a, round: true, d: 0.4 },
    { top: '74%', x: 12, w: 12, h: 12, rot: 34, c: colors.b, round: false, d: 1.1 },
    { top: '87%', x: 26, w: 10, h: 10, rot: 0, c: colors.c, round: true, d: 1.7 },
  ]
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden select-none">
      {half.map((s, i) => (
        <span
          key={`r-${i}`}
          className="fce-float"
          style={{ position: 'absolute', top: s.top, right: `${s.x}%`, width: s.w, height: s.h, backgroundColor: s.c, borderRadius: s.round ? '50%' : 3, transform: `rotate(${s.rot}deg)`, opacity: 0.85, animationDelay: `${s.d}s` }}
        />
      ))}
      {half.map((s, i) => (
        <span
          key={`l-${i}`}
          className="fce-float"
          style={{ position: 'absolute', top: s.top, left: `${s.x}%`, width: s.w, height: s.h, backgroundColor: s.c, borderRadius: s.round ? '50%' : 3, transform: `rotate(${-s.rot}deg)`, opacity: 0.85, animationDelay: `${s.d + 0.35}s` }}
        />
      ))}
    </div>
  )
}

function Cta({ label = 'אני בפנים 👈' }: { label?: string }) {
  return (
    <div className="flex justify-center">
      <a
        href="#buy"
        className="inline-flex items-center gap-2 rounded-full transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-4"
        style={{
          backgroundColor: 'var(--yellow)',
          color: INK,
          padding: '1.15rem 2.9rem',
          fontSize: '1.25rem',
          fontWeight: 700,
          boxShadow: '0 14px 32px rgba(27,48,84,0.18)',
          outlineColor: INK,
        }}
      >
        {label}
      </a>
    </div>
  )
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-center mb-10" style={{ fontSize: 'clamp(1.8rem, 4.8vw, 2.7rem)', fontWeight: 600, letterSpacing: '-0.015em', color: INK, lineHeight: 1.3 }}>
      {children}
    </h2>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-3xl mx-auto"
      style={{ backgroundColor: '#fff', border: '1px solid rgba(27,48,84,0.10)', padding: '2.2rem 1.8rem', boxShadow: '0 20px 48px rgba(27,48,84,0.06)', maxWidth: 760 }}
    >
      {children}
    </div>
  )
}

function Faq({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <details className="group rounded-2xl text-center" style={{ backgroundColor: '#fff', border: '1px solid rgba(27,48,84,0.12)', padding: '1.25rem 1.4rem' }}>
      <summary className="flex items-center justify-center gap-3 cursor-pointer list-none" style={{ color: INK, fontSize: '1.2rem', fontWeight: 600 }}>
        {q}
        <span
          className="shrink-0 rounded-full flex items-center justify-center transition-transform group-open:rotate-45"
          style={{ backgroundColor: 'rgba(245,200,66,0.6)', width: 28, height: 28 }}
          aria-hidden="true"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
      </summary>
      <div className="pt-4">{children}</div>
    </details>
  )
}

/* ---------- taped notes ---------- */
/* Three real messages, each a small paper square stuck to the wall with a strip
   of washi tape. Every square is the same size so the row stays symmetrical;
   only the tilt and the tape colour change. */

const NOTES = [
  { src: '/images/soe-reviews/review-1.jpg', w: 876, h: 1040, tilt: -3, tape: 'rgba(245,200,66,0.75)', tapeTilt: -4 },
  { src: '/images/soe-reviews/review-2.jpg', w: 845, h: 772, tilt: 2, tape: 'rgba(168,198,236,0.8)', tapeTilt: 3 },
  { src: '/images/soe-reviews/review-5.jpg', w: 851, h: 585, tilt: -1.5, tape: 'rgba(240,169,192,0.75)', tapeTilt: -2 },
]

function TapedNotes() {
  return (
    <div className="grid gap-12 sm:gap-8 sm:grid-cols-3 mx-auto mt-14" style={{ maxWidth: 880 }}>
      {NOTES.map((n, i) => (
        <figure
          key={n.src}
          className="fce-note relative mx-auto w-full"
          style={{ maxWidth: 300, ['--tilt' as string]: `${n.tilt}deg` }}
        >
          <span
            aria-hidden="true"
            className="fce-tape absolute left-1/2 z-10"
            style={{ top: -14, width: 96, height: 28, backgroundColor: n.tape, transform: `translateX(-50%) rotate(${n.tapeTilt}deg)` }}
          />
          <div
            className="flex items-center justify-center"
            style={{
              aspectRatio: '1 / 1',
              backgroundColor: '#fff',
              padding: '1.6rem 1rem 1rem',
              boxShadow: '0 1px 2px rgba(27,48,84,0.08), 0 12px 28px rgba(27,48,84,0.12)',
            }}
          >
            <Image
              src={n.src}
              alt={`הודעה מתלמיד/ה ${i + 1}`}
              width={n.w}
              height={n.h}
              sizes="300px"
              className="max-w-full max-h-full w-auto h-auto"
              style={{ objectFit: 'contain' }}
            />
          </div>
        </figure>
      ))}
    </div>
  )
}

/* ---------- page ---------- */

export default function TheSoundOfEnglishPage() {
  return (
    <>
    <MetaPixel />
    <UtmCapture />
    <main dir="rtl" className={assistant.className} style={{ backgroundColor: '#fff', color: INK, textAlign: 'center' }}>
      <style
        dangerouslySetInnerHTML={{
          __html: `
@keyframes fceFloat { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-9px) } }
/* No will-change here on purpose: the page carries 60 of these, and promoting
   every one to its own layer costs more on a phone than it saves. */
.fce-float { animation: fceFloat 4.5s ease-in-out infinite; }
.fce-note { transform: rotate(var(--tilt)); transition: transform 0.35s ease; }
.fce-note:hover { transform: rotate(0deg) scale(1.04); }
/* Torn ends on the tape strip */
.fce-tape { clip-path: polygon(0 8%, 6% 0, 12% 10%, 18% 2%, 82% 2%, 88% 10%, 94% 0, 100% 8%, 100% 92%, 94% 100%, 88% 90%, 82% 98%, 18% 98%, 12% 90%, 6% 100%, 0 92%); }
@media (prefers-reduced-motion: reduce) { .fce-float { animation: none !important; } .fce-note { transition: none; } }
`,
        }}
      />

      {/* HERO */}
      <section
        className="relative overflow-hidden pt-16 pb-20"
        style={{ backgroundColor: INK }}
      >
        {/* Two glows, one per side, so the light is symmetric around the centre. */}
        <div
          aria-hidden
          className="absolute"
          style={{ top: -200, right: -150, width: 560, height: 560, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,200,66,0.20) 0%, rgba(245,200,66,0) 70%)' }}
        />
        <div
          aria-hidden
          className="absolute"
          style={{ top: -200, left: -150, width: 560, height: 560, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,200,66,0.20) 0%, rgba(245,200,66,0) 70%)' }}
        />
        <Phonetics set={0} />
        <Confetti tone="onNavy" />
        <div className="relative max-w-3xl mx-auto px-6">
          <p className="mb-7 inline-block rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.08)', padding: '0.45rem 1.3rem', fontSize: '1.02rem', color: 'var(--yellow)', fontWeight: 600 }}>
            🎧 קורס דיגיטלי להגייה ומבטא
          </p>

          <h1 className="mb-8" style={{ fontSize: 'clamp(2.1rem, 5.6vw, 3.4rem)', fontWeight: 600, lineHeight: 1.32, letterSpacing: '-0.02em', color: '#fff' }}>
            <span style={{ display: 'block' }}>
              אתם{' '}
              <span className="relative inline-block">
                מדברים אנגלית
                <svg
                  viewBox="0 0 300 12"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                  style={{ position: 'absolute', left: 0, right: 0, bottom: '-0.16em', width: '100%', height: '0.22em' }}
                >
                  <path d="M3 8 C 90 2, 190 2, 297 7" stroke="rgba(255,255,255,0.85)" strokeWidth="4" strokeLinecap="round" fill="none" />
                </svg>
              </span>{' '}
              <strong style={{ fontWeight: 700 }}>לא רע</strong>.
            </span>
            <span
              style={{
                display: 'block',
                marginTop: '0.3em',
                fontSize: '1.08em',
                fontWeight: 700,
                color: 'var(--yellow)',
              }}
            >
              אבל למה עדיין לא מבינים אתכם?
            </span>
          </h1>

          <Lines
            tone="#fff"
            lines={[
              { t: 'זה לא בגלל הדקדוק או אוצר המילים.' },
              { t: 'זה בגלל שאף אחד לא לימד אתכם להגות נכון', k: 'b' },
              { t: 'את המילים הכי פשוטות. ואת המפחידות.' },
              { t: 'ויש שיטה פשוטה.', k: 'hl' },
            ]}
          />

          <div className="mt-10">
            <Cta label="תלמדי אותי הגייה נכונה 👈" />
          </div>
          <div className="mt-9 flex items-baseline justify-center gap-3" style={{ direction: 'rtl' }}>
            <span style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'line-through', fontSize: 'clamp(1.5rem, 5vw, 2.25rem)', fontWeight: 700 }}>247 ₪</span>
            <span style={{ color: 'var(--yellow)', fontSize: 'clamp(3.25rem, 11vw, 5rem)', fontWeight: 700, lineHeight: 1 }}>97 ₪</span>
          </div>
          <p className="mt-3" style={{ fontSize: '1.15rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>
            תשלום חד פעמי ·{' '}
            <span style={{ color: 'var(--yellow)' }}>⏳ מחיר השקה לשבועיים בלבד</span>
          </p>
        </div>
      </section>

      {/* PAIN */}
      <section className="relative overflow-hidden py-20" style={{ backgroundColor: '#fff' }}>
        <div className="relative max-w-3xl mx-auto px-6">
          <Card>
            <Lines
              lines={[
                { t: 'זה לא שאין לכם את המילים.', k: 'big' },
                { t: 'הן פשוט יוצאות אחרת ממה שהתכוונתם.', k: 'hl' },
                { t: 'אתם שומעים את עצמכם מסתבכים עם המילים,' },
                { t: 'נבוכים מזה,', k: 'b' },
                { t: 'רואים איך אנשים מתקרבים פיזית למצלמה של הזום', k: 'u' },
                { t: 'בניסיון להבין אתכם' },
                { t: 'ובסוף אתם בכלל לא בטוחים אם הם הבינו אתכם.' },
                { t: 'נכון? אז די.', k: 'big' },
                { t: 'הגיע הזמן. ויש לכם פה משהו מטורף' },
                { t: 'שתוך שעה וחצי יסדר לכם את הראש.', k: 'b' },
                { t: 'אתם סך הכל צריכים להבין מה עושה הפה' },
                { t: 'ואיפה לשים את הלשון כשאתם אומרים TH ו-R.' },
              ]}
            />
          </Card>
        </div>
      </section>

      {/* NOT YOUR FAULT */}
      <section className="relative overflow-hidden py-24" style={{ backgroundColor: 'var(--light-grey)' }}>
        <Phonetics set={1} />
        <div className="relative max-w-3xl mx-auto px-6">
          <H2>הבעיה היא לא אתם</H2>
          <Lines
            lines={[
              { t: 'כולנו למדנו קריאה, דקדוק ולכתוב מבחנים,' },
              { t: 'אבל אף אחד לא לימד אותנו את הצלילים.', k: 'hl' },
              { t: 'אז הפה מחליף אותם בצלילים מעברית,' },
              { t: 'ופתאום יוצאת מילה אחרת.', k: 'u' },
            ]}
          />
        </div>
      </section>

      {/* THE MATRIX */}
      <section className="relative overflow-hidden py-24" style={{ backgroundColor: '#fff' }}>
        <Phonetics set={2} />
        <div className="relative max-w-3xl mx-auto px-6">
          <H2>אז על מה אני מדברת?</H2>
          <Card>
            <Lines
              lines={[
                { t: 'על תורת ההגייה!', k: 'big' },
                { t: 'ונשבעת, כשלמדתי את זה לגמרי במקרה' },
                { t: 'בבית ספר למשחק בניו יורק,' },
                { t: 'הרגשתי שגיליתי את המטריקס.', k: 'hl' },
                { t: 'בעקבות זה הפכתי לקואצ׳רית לתקשורת ולתורת ההגייה באנגלית.' },
                { t: 'ואנגלית היא בכלל שפה שלישית שלי!', k: 'b' },
                { t: 'למה רק מי שלומד אצלי 1:1 יקבל את החומרים האלה?', k: 'u' },
                { t: 'רוצים גם לגלות את המטריקס של השפה?', k: 'big' },
              ]}
            />
          </Card>
        </div>
      </section>

      {/* WHAT'S INSIDE */}
      <section className="relative overflow-hidden py-24" style={{ backgroundColor: INK }}>
        <Phonetics set={1} />
        <div className="relative max-w-3xl mx-auto px-6">
          <h2 className="text-center mb-10" style={{ fontSize: 'clamp(1.8rem, 4.8vw, 2.7rem)', fontWeight: 600, letterSpacing: '-0.015em', color: 'var(--yellow)', lineHeight: 1.3 }}>
            הנה מה שיש בקורס הדיגיטלי
            <br />
            הקצר והמטורף הזה
          </h2>
          <Lines
            tone="#fff"
            lines={[
              { t: '34 סרטונים קצרים', k: 'big' },
              { t: 'שמתחלקים להסברים, תרגולים ובונוסים' },
              { t: 'בערך שעה וחצי סך הכל, בקצב שלכם' },
              { t: 'פרק בונוס עם צלילים ודפוסים נוספים' },
              { t: 'ההסברים בעברית, עם אנגלית בערבוב טבעי,' },
              { t: 'והתרגול באנגלית' },
              { t: 'גישה לתמיד. בלי מנוי, בלי תפוגה', k: 'hl' },
              { t: 'מיד אחרי הרכישה מקבלים לינק ישיר לכל הסרטונים,', k: 'u' },
              { t: 'לכל החיים' },
              { t: 'לצפייה מהמחשב או מהטלפון' },
            ]}
          />
        </div>
      </section>

      {/* SAMPLE LESSONS */}
      <section className="py-24" style={{ backgroundColor: 'var(--light-grey)' }}>
        <div className="max-w-4xl mx-auto px-6">
          <H2>רוצים לראות איך זה נראה?</H2>
          <Lines
            lines={[
              { t: 'שני שיעורים פתוחים לצפייה,' },
              { t: 'בלי לשלם ובלי להשאיר פרטים:', k: 'b' },
              { t: 'שיעור הסבר אחד ושיעור תרגול אחד.' },
              { t: 'תראו בדיוק איך אני מלמדת, ותחליטו אחר כך.' },
            ]}
          />
          <div className="grid gap-6 sm:grid-cols-2 mt-12">
            {[
              { label: 'שיעור הסבר', note: 'הצלילים EE ו-i, בעברית', id: '1227663263' },
              { label: 'שיעור תרגול', note: 'מתרגלים את EE ו-i יחד', id: '1226981823' },
            ].map((v) => (
              <div key={v.label}>
                <div className="rounded-2xl overflow-hidden mb-3" style={{ aspectRatio: '16 / 9', backgroundColor: 'rgba(27,48,84,0.06)' }}>
                  <iframe
                    src={`https://player.vimeo.com/video/${v.id}`}
                    className="w-full h-full"
                    style={{ border: 0 }}
                    loading="lazy"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    title={`${v.label}: EE & i`}
                  />
                </div>
                <p style={{ fontWeight: 600, fontSize: '1.15rem' }}>{v.label}</p>
                <p style={{ color: SOFT, fontSize: '1.02rem', fontWeight: 300 }}>{v.note}</p>
              </div>
            ))}
          </div>
          <p className="mt-20" style={{ fontSize: '1.45rem', color: INK, fontWeight: 600 }}>
            אנשים שכבר עשו את הקורס השבוע :)
          </p>
          <TapedNotes />
          <div className="mt-16">
            <Cta label="קחי אותי לקורס 👈" />
          </div>
        </div>
      </section>

      {/* IS IT FOR YOU */}
      <section className="relative overflow-hidden py-24" style={{ backgroundColor: '#fff' }}>
        <Phonetics set={2} />
        <div className="relative max-w-3xl mx-auto px-6">
          <H2>רגע, זה בשבילכם?</H2>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-3xl" style={{ backgroundColor: INK, color: '#fff', padding: '2rem 1.6rem' }}>
              <p className="mb-4" style={{ fontSize: '1.5rem', color: 'var(--yellow)', fontWeight: 700 }}>
                כן ✅
              </p>
              <p className="mx-auto" style={{ fontSize: '1.15rem', color: 'rgba(255,255,255,0.92)', fontWeight: 300, maxWidth: 360, lineHeight: 1.6 }}>
                אם אתם <span style={{ fontWeight: 700, color: '#fff' }}>כבר מדברים אנגלית</span>,
                <br />
                ורוצים להישמע ברורים, מדויקים ובטוחים.
                <br />
                <br />
                ואם בא לכם גם להעמיק ולהבין
                <br />
                איך השפה הזאת באמת עובדת.
              </p>
            </div>
            <div className="rounded-3xl" style={{ backgroundColor: '#fff', border: '1px solid rgba(27,48,84,0.12)', padding: '2rem 1.6rem' }}>
              <p className="mb-4" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                לא 🙅
              </p>
              <p className="mx-auto" style={{ fontSize: '1.15rem', color: BODY, fontWeight: 300, maxWidth: 360, lineHeight: 1.6 }}>
                אם אתם <span style={{ fontWeight: 700, color: INK }}>בתחילת הדרך באנגלית</span>.
                <br />
                <br />
                זה ממש לא המקום להתחיל בו,
                <br />
                ואני לא רוצה שתבזבזו כסף.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT: same block as the yalla page */}
      <section className="py-20" style={{ backgroundColor: 'var(--light-grey)' }}>
        <div className="max-w-2xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-8 rounded-3xl p-8 bg-white shadow-sm" style={{ border: '1px solid #E5E7EB' }}>
            <div className="relative rounded-full overflow-hidden flex-shrink-0 w-32 h-32 md:w-40 md:h-40" style={{ border: '4px solid var(--yellow)' }}>
              <Image src="/images/sasha-2026.jpg" alt="סשה דניאל" fill sizes="160px" style={{ objectFit: 'cover', objectPosition: 'center 18%' }} />
            </div>
            <div className="text-center md:text-right">
              <h2 className="mb-3" style={{ color: INK, fontSize: '1.6rem', fontWeight: 700 }}>נעים להכיר, אני סשה 👋</h2>
              <p className="mb-4" style={{ color: BODY, fontSize: '1.15rem', lineHeight: 1.65 }}>
                קואצ׳רית לאנגלית מדוברת. כבר 8 שנים אני עוזרת לישראלים שמבינים אנגלית אבל נתקעים בדיבור,
                לפתוח את הפה ולדבר בביטחון. את הקורס הזה בניתי בדיוק בשביל אנשים כמוכם, שרוצים להתחיל
                ממשהו קטן ולטעום דרך חדשה, שונה ו<strong style={{ color: INK }}>אפקטיבית מאוד</strong>.
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2">
                <a
                  href="https://www.instagram.com/freeandclearenglish"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-bold hover:opacity-80 transition-opacity"
                  style={{ color: INK }}
                >
                  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="2" y="2" width="20" height="20" rx="5.5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
                  </svg>
                  @freeandclearenglish
                </a>
                <a
                  href="https://www.freeandclearenglish.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-bold hover:opacity-80 transition-opacity"
                  style={{ color: INK }}
                >
                  🌐 freeandclearenglish.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GUARANTEE */}
      <section className="py-20" style={{ backgroundColor: 'var(--light-grey)' }}>
        <div className="max-w-2xl mx-auto px-6">
          <div className="rounded-3xl p-8 md:p-10 text-center bg-white shadow-sm" style={{ border: '2px dashed var(--yellow)' }}>
            <p className="mb-4" style={{ fontSize: '3.75rem' }}>🛡️</p>
            <H2>ואם זה לא יעבוד?</H2>
            <Lines
              lines={[
                { t: 'עשיתם את כל הקורס והתאמנתם חודשיים,' },
                { t: 'אבל מרגישים שכלום לא נדבק?' },
                { t: 'אני מחזירה לכם כל שקל.', k: 'hl' },
                { t: 'כי אני יודעת שכשעובדים, זה עובד.', k: 'b' },
              ]}
            />
          </div>
        </div>
      </section>

      {/* PRICE */}
      <section id="buy" className="relative overflow-hidden py-24" style={{ backgroundColor: INK }}>
        <Phonetics set={0} />
        <Confetti tone="onNavy" />
        <div className="relative max-w-xl mx-auto px-6" style={{ color: '#fff' }}>
          <h2 className="mb-7" style={{ fontSize: 'clamp(1.8rem, 4.8vw, 2.7rem)', color: '#fff', fontWeight: 600 }}>
            מחיר ההשקה
          </h2>
          <p className="mb-1" style={{ fontSize: '1.3rem', color: 'rgba(255,255,255,0.55)', fontWeight: 300 }}>
            <s>247 ₪</s>
          </p>
          <p className="mb-6" style={{ fontSize: 'clamp(3.6rem, 13vw, 5.6rem)', lineHeight: 1, color: 'var(--yellow)', fontWeight: 700 }}>
            97 ₪
          </p>
          <p className="mb-3" style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.9)', fontWeight: 300 }}>
            תשלום חד פעמי · גישה לתמיד
          </p>
          <p className="mb-10" style={{ fontSize: '1.2rem', color: 'var(--yellow)', fontWeight: 600 }}>
            ⏳ ההשקה לשבועיים בלבד, ואחריה המחיר עולה
          </p>
          <Suspense fallback={null}>
            <CheckoutForm />
          </Suspense>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative overflow-hidden py-24" style={{ backgroundColor: 'var(--light-grey)' }}>
        <Phonetics set={1} />
        <div className="relative max-w-3xl mx-auto px-6">
          <H2>שאלות שאתם בטח שואלים</H2>
          <div className="space-y-4">
            <Faq q="אני אאבד את המבטא הישראלי שלי?">
              <Lines
                lines={[
                  { t: 'לא, וכמובן שזה גם לא קורה כל כך מהר… וגם לא צריך.' },
                  { t: 'מבטא זה לא בעיה, לכולם יש אחד.' },
                  { t: 'המטרה היא שיבינו אתכם טוב יותר.', k: 'b' },
                ]}
              />
            </Faq>
            <Faq q="כמה זמן זה לוקח?">
              <Lines
                lines={[
                  { t: 'הקורס כולו הוא בערך שעה וחצי.' },
                  { t: 'אבל ככל שתעשו אותו יותר פעמים,' },
                  { t: 'הסיכויים להצלחה ושיפור עולים משמעותית.' },
                  { t: 'שיעור אחד ביום, ולתרגל רק אותו,', k: 'b' },
                  { t: 'עובד הרבה יותר טוב מלעשות את כל הקורס ולא לחזור עליו שלושה חודשים.' },
                ]}
              />
            </Faq>
            <Faq q="מה אם אני לא מצליח לשמוע את ההבדל בין הצלילים?">
              <Lines
                lines={[
                  { t: 'זה בדיוק מה שהתרגולים עושים.' },
                  { t: 'קודם האוזן לומדת לשמוע,', k: 'b' },
                  { t: 'ורק אחר כך הפה מצליח לבצע.' },
                ]}
              />
            </Faq>
            <Faq q="ממה שראיתי את מלמדת מבטא אמריקאי.">
              <Lines
                lines={[
                  { t: 'נכון, העבודה שלי מתרכזת במבטא אמריקאי קלאסי.' },
                  { t: 'אבל מטרת העל היא לגרום לכם להיות ברורים.', k: 'b' },
                  { t: 'ואם על הדרך תשמעו קצת יותר אמריקאים, בריטיים או דרום אפריקאיים,' },
                  { t: 'אף אחד לא ירים גבה. מבטיחה.' },
                  { t: '(ושזו תהיה הבעיה שלכם בחיים)' },
                ]}
              />
            </Faq>
          </div>
          <div className="mt-14">
            <Cta />
          </div>
        </div>
      </section>

    </main>
    </>
  )
}
