import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Assistant } from 'next/font/google'
import Image from 'next/image'
import MetaPixel from '@/components/MetaPixel'
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
                background: 'linear-gradient(transparent 55%, rgba(245,200,66,0.8) 55%)',
                color: INK,
                padding: '0 0.22em',
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

function SoundChip({ children, tone = 'blue' }: { children: React.ReactNode; tone?: 'blue' | 'gold' }) {
  const blue = tone === 'blue'
  return (
    <span
      className="inline-block rounded-full"
      style={{
        backgroundColor: blue ? 'rgba(27,48,84,0.06)' : 'rgba(245,200,66,0.32)',
        color: INK,
        border: `1px solid ${blue ? 'rgba(27,48,84,0.14)' : 'rgba(201,162,39,0.4)'}`,
        padding: '0.45rem 1.25rem',
        fontSize: '1.1rem',
        fontWeight: 600,
        direction: 'ltr',
      }}
    >
      {children}
    </span>
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

/* ---------- page ---------- */

export default function TheSoundOfEnglishPage() {
  return (
    <>
    <MetaPixel />
    <main dir="rtl" className={assistant.className} style={{ backgroundColor: '#fff', color: INK, textAlign: 'center' }}>
      <style
        dangerouslySetInnerHTML={{
          __html: `
@keyframes fceFloat { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-9px) } }
/* No will-change here on purpose: the page carries 60 of these, and promoting
   every one to its own layer costs more on a phone than it saves. */
.fce-float { animation: fceFloat 4.5s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .fce-float { animation: none !important; } }
`,
        }}
      />

      {/* HERO */}
      <section
        className="relative overflow-hidden pt-16 pb-16"
        style={{ background: 'linear-gradient(180deg, #FFF6DE 0%, #FDFBF4 46%, #FCFBF7 100%)' }}
      >
        {/* Two glows, one per side, so the light is symmetric around the centre. */}
        <div
          aria-hidden
          className="absolute"
          style={{ top: -200, right: -150, width: 560, height: 560, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,200,66,0.34) 0%, rgba(245,200,66,0) 70%)' }}
        />
        <div
          aria-hidden
          className="absolute"
          style={{ top: -200, left: -150, width: 560, height: 560, borderRadius: '50%', background: 'radial-gradient(circle, rgba(127,176,228,0.26) 0%, rgba(127,176,228,0) 70%)' }}
        />
        <Phonetics set={0} />
        <Confetti />
        <div className="relative max-w-3xl mx-auto px-6">
          <p className="mb-7 inline-block rounded-full" style={{ backgroundColor: 'rgba(27,48,84,0.05)', padding: '0.45rem 1.3rem', fontSize: '1.02rem', color: SOFT }}>
            🎧 קורס דיגיטלי להגייה ומבטא
          </p>

          <h1 className="mb-8" style={{ fontSize: 'clamp(2.1rem, 5.6vw, 3.4rem)', fontWeight: 600, lineHeight: 1.32, letterSpacing: '-0.02em' }}>
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
                  <path d="M3 8 C 90 2, 190 2, 297 7" stroke="#7FB0E4" strokeWidth="4" strokeLinecap="round" fill="none" />
                </svg>
              </span>{' '}
              <strong style={{ fontWeight: 700 }}>לא רע</strong>.
            </span>
            <span style={{ display: 'block', marginTop: '0.35em' }}>אז למה עדיין מבקשים מכם</span>
            <span
              style={{
                display: 'block',
                marginTop: '0.2em',
                fontSize: '1.16em',
                fontWeight: 700,
              }}
            >
              <span
                style={{
                  background: 'linear-gradient(transparent 60%, rgba(245,200,66,0.75) 60%)',
                  padding: '0 0.16em',
                  boxDecorationBreak: 'clone',
                  WebkitBoxDecorationBreak: 'clone',
                }}
              >
                לחזור שוב על מה שאמרתם?
              </span>
            </span>
          </h1>

          <Lines
            lines={[
              { t: 'הגיע הזמן לשפר את ההגייה, המבטא ויכולת התקשורת שלכם.', k: 'b' },
              { t: 'בלי להתעסק במילים גבוהות, אנגלית עסקית או דקדוק מורכב.' },
              { t: '(כי זה לא מה שאתם צריכים…)' },
            ]}
          />

          <div className="mt-10 mb-10">
            <Card>
              <Lines
                lines={[
                  { t: 'אתם מדברים אנגלית בפגישות, בכנסים ובנסיעות עבודה כבר שנים' },
                  { t: 'אבל מרגישים שמשהו שם לא יושב עד הסוף.', k: 'b' },
                  { t: 'אתם שומעים את עצמכם מסתבכים עם המילים,' },
                  { t: 'נבוכים מזה,', k: 'b' },
                  { t: 'רואים איך אנשים מתקרבים פיזית למצלמה של הזום', k: 'hl' },
                  { t: 'בניסיון להבין אתכם' },
                  { t: 'ובסוף אתם בכלל לא בטוחים אם הם הבינו אתכם?', k: 'u' },
                ]}
              />
            </Card>
          </div>

          <Cta label="אני רוצה שיבינו אותי" />
        </div>
      </section>

      {/* NOT YOUR FAULT */}
      <section className="relative overflow-hidden py-24" style={{ backgroundColor: '#fff' }}>
        <Phonetics set={1} />
        <div className="relative max-w-3xl mx-auto px-6">
          <H2>אתם ממש לא לבד, וזו לא אשמתכם 💛</H2>
          <Lines
            lines={[
              { t: 'אף אחד לא לימד אתכם את הצלילים.', k: 'hl' },
              { t: 'למדנו דקדוק, זמנים, אוצר מילים ומבחנים.' },
              { t: 'אף אחד לא עצר ואמר לכם איפה הלשון אמורה לגעת,', k: 'u' },
              { t: 'מה הפה עושה, ואיפה נופלת ההדגשה.' },
              { t: 'לא בבית הספר, לא באוניברסיטה,' },
              { t: 'ובטח שלא בסטארטאפ שאתם עובדים בו.' },
            ]}
          />

          <p className="mt-12 mb-6" style={{ fontSize: '1.22rem', fontWeight: 300, color: BODY }}>
            באנגלית יש צלילים שפשוט לא קיימים בעברית:
          </p>
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            <SoundChip>TH</SoundChip>
            <SoundChip tone="gold">sheep / ship</SoundChip>
            <SoundChip>R</SoundChip>
            <SoundChip tone="gold">schwa</SoundChip>
          </div>

          <Lines
            lines={[
              { t: 'ה-TH. ההבדל בין sheep ל-ship.' },
              { t: 'ה-R שהוא לא ר׳ של עברית.' },
              { t: 'כשלא לימדו אתכם צליל, הפה עושה את הדבר ההגיוני היחיד:' },
              { t: 'מחליף אותו בצליל הכי קרוב שהוא מכיר מעברית.', k: 'b' },
              { t: 'וזה כבר לא "מבטא".' },
              { t: 'לפעמים זו פשוט מילה אחרת שממש לא התכוונתם להגיד.', k: 'u' },
            ]}
          />

          <div className="mt-14">
            <Lines
              lines={[
                { t: 'המבטא שלכם הוא לא הבעיה.', k: 'big' },
                { t: 'הבעיה היא כשלא מבינים אתכם.', k: 'hl' },
              ]}
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative overflow-hidden py-24" style={{ backgroundColor: '#FCFBF7' }}>
        <Phonetics set={2} />
        <div className="relative max-w-3xl mx-auto px-6">
          <H2>אז מה עושים?</H2>
          <Card>
            <Lines
              lines={[
                { t: 'בכל שיעור לוקחים צליל אחד', k: 'big' },
                { t: 'או צמד מאותה משפחה.' },
                { t: 'קודם אני מסבירה מה בדיוק הפה שלכם צריך לעשות.', k: 'b' },
                { t: 'בלי מונחים מפוצצים ובלי סימנים פונטיים שאף אחד לא מבין.' },
                { t: 'ואז מתרגלים יחד באנגלית, איתי ועם המצגת.' },
                { t: 'מילים, ואז משפטים מהחיים:' },
                { t: 'עבודה, קולגות, חופשות, ילדים, חברים.', k: 'u' },
                { t: 'אתם חוזרים אחריי בקול, ואני איתכם. 🎤', k: 'hl' },
              ]}
            />
          </Card>
        </div>
      </section>

      {/* SAMPLE LESSONS */}
      <section className="py-24" style={{ backgroundColor: '#fff' }}>
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
        </div>
      </section>

      {/* ABOUT */}
      <section className="relative overflow-hidden py-24" style={{ backgroundColor: '#FCFBF7' }}>
        <Phonetics set={0} />
        <div className="relative max-w-3xl mx-auto px-6">
          <H2>אז למה שתקשיבו לי?</H2>
          <p className="mb-7" style={{ fontSize: '1.7rem', fontWeight: 600 }}>
            נעים להכיר, אני סשה 👋
          </p>
          <div className="flex justify-center mb-10">
            <div
              className="relative rounded-full overflow-hidden"
              style={{ width: 230, height: 230, border: '6px solid #fff', boxShadow: '0 18px 40px rgba(27,48,84,0.18)' }}
            >
              <Image
                src="/images/sasha-2026.jpg"
                alt="סשה דניאל"
                fill
                sizes="230px"
                priority
                style={{ objectFit: 'cover', objectPosition: 'center 18%' }}
              />
            </div>
          </div>
          <Card>
            <Lines
              lines={[
                { t: 'קואצ׳רית לאנגלית מדוברת, מתמחה בהגייה ובמבטא.', k: 'b' },
                { t: 'מעל 8 שנים אני עוזרת ליזמים, מנהלים, פרופסורים, מרצים ורופאים' },
                { t: 'שמבינים אנגלית אבל נתקעים ברגע האמת,' },
                { t: 'לפתוח את הפה ולדבר בביטחון.', k: 'u' },
                { t: 'אנגלית היא בכלל שפה שלישית שלי,', k: 'b' },
                { t: 'ודווקא בגלל זה אני יודעת, מבינה ומרגישה את התסכולים שלכם.' },
                { t: 'כי עברתי אותם.' },
                { t: 'למדתי משחק בניו יורק בגיל 22, ושם בבית הספר היה לנו שיעור פונטיקה' },
                { t: 'שהפיל לי את האסימון הכי גדול בחיים:', k: 'hl' },
                { t: 'יש שפה שלמה של צלילים שלא מלמדים אותנו.', k: 'b' },
                { t: 'ממש כמו המטריקס, הרגשתי שהסתירו ממני מידע קריטי כל השנים.' },
                { t: 'ועכשיו אני עושה הכל בשביל לחשוף את המידע הזה' },
                { t: 'לכל מי שרק רוצה לגלות אותו.' },
                { t: 'את הקורס הזה בניתי מהצלילים שאני מלמדת בשיעורים פרטיים שוב ושוב, שנה אחרי שנה.' },
                { t: 'כמעט ואין בארץ קורס דיגיטלי שמתמקד בהגייה ובמבטא,', k: 'b' },
                { t: 'וזו בדיוק הסיבה שבניתי אותו.' },
              ]}
            />
          </Card>
        </div>
      </section>

      {/* WHAT'S INSIDE */}
      <section className="relative overflow-hidden py-24" style={{ backgroundColor: '#fff' }}>
        <Phonetics set={1} />
        <div className="relative max-w-3xl mx-auto px-6">
          <H2>אז מה יש בקורס?</H2>
          <Lines
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
          <div className="mt-14">
            <Cta />
          </div>
        </div>
      </section>

      {/* IS IT FOR YOU */}
      <section className="relative overflow-hidden py-24" style={{ backgroundColor: '#FCFBF7' }}>
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

      {/* GUARANTEE */}
      <section className="py-24" style={{ backgroundColor: '#fff' }}>
        <div className="max-w-3xl mx-auto px-6">
          <div className="rounded-3xl" style={{ border: '2px solid rgba(245,200,66,0.9)', padding: '2.6rem 1.7rem' }}>
            <H2>ואם זה לא יעבוד? 🤔</H2>
            <Lines
              lines={[
                { t: 'עברתם את כל הקורס, מהשיעור הראשון ועד האחרון,' },
                { t: 'תרגלתם בקול,' },
                { t: 'ולא קיבלתם את מה שחיפשתם?' },
                { t: 'שלחו לי הקלטה קצרה של עצמכם מבצעים את התרגולים,' },
                { t: 'ואני מחזירה לכם את הכסף.', k: 'hl' },
                { t: 'בלי ויכוחים.', k: 'b' },
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
      <section className="relative overflow-hidden py-24" style={{ backgroundColor: '#FCFBF7' }}>
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
        </div>
      </section>

      {/* CLOSING */}
      <section className="relative overflow-hidden py-24" style={{ backgroundColor: '#fff' }}>
        <Phonetics set={2} />
        <div className="relative max-w-3xl mx-auto px-6">
          <H2>כמה מילים ממני…</H2>
          <Lines
            lines={[
              { t: 'אני לא יודעת מי אתם,' },
              { t: 'אבל אני כן יודעת איך זה מרגיש', k: 'b' },
              { t: 'להיות במבוכה ובלבול מלדבר באנגלית.' },
              { t: 'הקורס הזה לא נולד סתם.' },
              { t: 'יצרתי אותו כי כל יום אני רואה תלמידים מתוסכלים' },
              { t: 'שפשוט נפתח בתוכם משהו', k: 'u' },
              { t: 'כשהם לומדים את הדבר המדויק.' },
              { t: 'ואמרתי: די.', k: 'b' },
              { t: 'למה רק למי שלומד אצלי 1:1 יש גישה לחומרים האלה?' },
              { t: 'אני מתרגשת מהחומר הזה כל פעם מחדש,' },
              { t: 'ומאמינה שגם אתם תתרגשו,' },
              { t: 'כי יהיו בפנים דברים שיכולים לשנות לכם את החיים', k: 'hl' },
              { t: '(או לפחות איך שאתם נשמעים באנגלית 🙂)' },
              { t: 'שיהיה מלא בהצלחה, ותכתבו לי איך היה.' },
            ]}
          />
          <p className="mt-12 mb-12" style={{ fontSize: '1.45rem', color: INK, fontWeight: 600, lineHeight: 1.6 }}>
            באהבה,
            <br />
            סשה דניאל 💛
          </p>
          <Cta />
        </div>
      </section>
    </main>
    </>
  )
}
