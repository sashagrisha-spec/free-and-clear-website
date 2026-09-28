import type { Metadata } from 'next'
import { Assistant } from 'next/font/google'
import MetaPixel from '@/components/MetaPixel'
import SignupForm from './SignupForm'

const assistant = Assistant({ subsets: ['hebrew', 'latin'], weight: ['300', '400', '600', '700'], display: 'swap' })

export const metadata: Metadata = {
  title: 'הגרלה | The Sound of English',
  description: 'קורס ההגייה החדש יוצא ממש בקרוב, ואני מגרילה אותו במתנה לשלושה אנשים. משאירים שם מלא ומייל ונכנסים להגרלה.',
  // A pre-launch page with a short life. Keeping it out of Google also keeps it
  // from competing with the real sales page for the same searches.
  robots: { index: false, follow: false },
}

const INK = '#1B3054'
const BODY = '#42536D'
const YELLOW = '#F5C842'

/* The same pastel phonetics that carry the sales page, so the two look like one
   product even though this one is a single screen. Laid out in symmetric pairs:
   whatever sits on the right has a partner on the left at the same height. */
function Phonetics() {
  // On a phone the whole page IS the middle of the screen, so the wide ones
  // would land on the form. They only appear from sm up.
  const glyphs = [
    { g: 'θ', top: '5%', left: '6%', size: 175, rot: -14, c: '#8FBCEA', wide: false },
    { g: 'iː', top: '5%', left: '80%', size: 175, rot: 12, c: '#8FBCEA', wide: false },
    { g: 'ʃ', top: '72%', left: '8%', size: 205, rot: 8, c: '#F3D46B', wide: true },
    { g: 'ə', top: '72%', left: '82%', size: 205, rot: -8, c: '#F3D46B', wide: true },
    { g: 'ɹ', top: '38%', left: '2%', size: 130, rot: 6, c: '#B9D2EE', wide: true },
    { g: 'æ', top: '38%', left: '90%', size: 130, rot: -6, c: '#B9D2EE', wide: true },
  ]
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden select-none">
      {glyphs.map((s, i) => (
        <span
          key={i}
          className={s.wide ? 'hidden sm:inline' : undefined}
          style={{
            position: 'absolute',
            top: s.top,
            left: s.left,
            fontSize: s.size,
            lineHeight: 1,
            transform: `rotate(${s.rot}deg)`,
            color: s.c,
            opacity: 0.45,
            fontWeight: 300,
          }}
        >
          {s.g}
        </span>
      ))}
    </div>
  )
}

/* Confetti. Mirrored left and right around the centre axis, so the page still
   reads as symmetric while feeling like a party. */
function Confetti() {
  const half = [
    { top: '9%', x: 16, w: 13, h: 13, rot: 22, c: YELLOW, round: false, d: 0 },
    { top: '17%', x: 30, w: 9, h: 9, rot: 0, c: '#7FB0E4', round: true, d: 0.7 },
    { top: '29%', x: 9, w: 11, h: 11, rot: -18, c: '#F0A9C0', round: false, d: 1.3 },
    { top: '47%', x: 22, w: 8, h: 8, rot: 0, c: YELLOW, round: true, d: 0.4 },
    { top: '63%', x: 13, w: 12, h: 12, rot: 34, c: '#7FB0E4', round: false, d: 1.1 },
    { top: '81%', x: 27, w: 10, h: 10, rot: 0, c: '#F0A9C0', round: true, d: 1.7 },
  ]
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden select-none">
      {half.map((s, i) => (
        <span key={`r-${i}`} className="fce-float" style={{ position: 'absolute', top: s.top, right: `${s.x}%`, width: s.w, height: s.h, backgroundColor: s.c, borderRadius: s.round ? '50%' : 3, transform: `rotate(${s.rot}deg)`, opacity: 0.85, animationDelay: `${s.d}s` }} />
      ))}
      {half.map((s, i) => (
        <span key={`l-${i}`} className="fce-float" style={{ position: 'absolute', top: s.top, left: `${s.x}%`, width: s.w, height: s.h, backgroundColor: s.c, borderRadius: s.round ? '50%' : 3, transform: `rotate(${-s.rot}deg)`, opacity: 0.85, animationDelay: `${s.d + 0.35}s` }} />
      ))}
    </div>
  )
}

export default function HagralaPage() {
  return (
    <main
      dir="rtl"
      className={`${assistant.className} relative overflow-hidden`}
      style={{
        // A warm cream that lifts towards gold at the top, so the page opens
        // bright instead of flat.
        background: 'linear-gradient(180deg, #FFF6DE 0%, #FDFBF4 42%, #FCFBF7 100%)',
        color: INK,
        textAlign: 'center',
        minHeight: '100vh',
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
@keyframes fceFloat { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-9px) } }
.fce-float { animation: fceFloat 4.5s ease-in-out infinite; }
@keyframes fcePop { 0% { transform: scale(0.94) } 60% { transform: scale(1.03) } 100% { transform: scale(1) } }
.fce-pop { animation: fcePop 0.55s ease-out both; }
@media (prefers-reduced-motion: reduce) { .fce-float, .fce-pop { animation: none !important; } }
`,
        }}
      />

      <MetaPixel />
      <Phonetics />
      <Confetti />

      {/* Two glows, one on each side, so the light is symmetric around the centre. */}
      <div aria-hidden="true" className="pointer-events-none absolute" style={{ top: -240, right: -180, width: 620, height: 620, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,200,66,0.38) 0%, rgba(245,200,66,0) 70%)' }} />
      <div aria-hidden="true" className="pointer-events-none absolute" style={{ top: -240, left: -180, width: 620, height: 620, borderRadius: '50%', background: 'radial-gradient(circle, rgba(127,176,228,0.30) 0%, rgba(127,176,228,0) 70%)' }} />

      <div
        className="relative mx-auto flex flex-col items-center justify-center px-5"
        style={{ minHeight: '100vh', maxWidth: 680, paddingTop: '3.4rem', paddingBottom: '3.4rem' }}
      >
        <p
          className="fce-pop inline-block rounded-full"
          style={{
            backgroundColor: YELLOW,
            padding: '0.55rem 1.7rem',
            fontSize: '1.22rem',
            fontWeight: 700,
            color: INK,
            boxShadow: '0 10px 26px rgba(245,200,66,0.55)',
          }}
        >
          🎉 זה קורה!
        </p>

        {/* clamp, not a fixed size: at 390px the untranslatable English title is
            the widest thing on the page and a fixed 3.1rem pushed the whole
            layout sideways. */}
        <h1 style={{ margin: '1.5rem auto 0', fontSize: 'clamp(1.95rem, 8.4vw, 3.1rem)', fontWeight: 700, lineHeight: 1.15, direction: 'ltr' }}>
          The Sound of English
        </h1>

        <p style={{ margin: '1.5rem auto 0', fontSize: 'clamp(1.22rem, 5vw, 1.42rem)', fontWeight: 600, color: BODY, lineHeight: 1.5 }}>
          קורס ההגייה שלי יוצא ממש בקרוב...
        </p>

        {/* The offer, on its own line so it stays symmetric around the centre. */}
        <p style={{ margin: '1.5rem auto 0', fontSize: 'clamp(1.34rem, 5.8vw, 1.72rem)', fontWeight: 700, lineHeight: 1.5 }}>
          <span
            style={{
              background: `linear-gradient(transparent 56%, rgba(245,200,66,0.85) 56%)`,
              color: INK,
              padding: '0 0.22em',
              boxDecorationBreak: 'clone',
              WebkitBoxDecorationBreak: 'clone',
            }}
          >
            ואני מגרילה אותו במתנה לשלושה אנשים!
          </span>
        </p>

        {/* Three gifts, one per winner. Makes the number concrete and the page
            cheerful without another sentence. */}
        <div className="flex justify-center" style={{ gap: '0.9rem', marginTop: '1.9rem' }}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="fce-float flex items-center justify-center rounded-2xl"
              style={{
                width: 66,
                height: 66,
                fontSize: '2rem',
                backgroundColor: '#fff',
                border: `2px solid rgba(245,200,66,0.9)`,
                boxShadow: '0 10px 22px rgba(27,48,84,0.10)',
                animationDelay: `${i * 0.4}s`,
              }}
            >
              🎁
            </span>
          ))}
        </div>

        <p style={{ margin: '2rem auto 0.3rem', fontSize: '1.22rem', fontWeight: 300, color: BODY, lineHeight: 1.6 }}>
          משאירים שם מלא ומייל, ונכנסים להגרלה.
        </p>

        <div className="mt-7 w-full">
          <SignupForm />
        </div>
      </div>
    </main>
  )
}
