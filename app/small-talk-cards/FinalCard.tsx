import { Assistant, Source_Serif_4 } from 'next/font/google'

const assistant = Assistant({ subsets: ['hebrew', 'latin'], weight: ['400', '600', '700'], display: 'swap' })
const serif = Source_Serif_4({ subsets: ['latin'], weight: ['500', '600'], display: 'swap' })

const INK = '#1B2A4A'
const CREAM = '#FCF8F2'
const BLUE = '#E4EEF9'
const PILL = '#D6E4F5'
const CORAL = '#E8907E'
const YELLOW = '#F5C842'
const COURSE_URL = '/the-sound-of-english'

// Every size is in cqw (percent of the card's width), so the card scales
// exactly like the image cards next to it.
const cq = (n: number) => `${n}cqw`

// Pastel IPA glyphs as the illustration, laid out symmetrically around the centre.
const GLYPHS = [
  { g: 'θ', x: 24, y: 52, size: 20, rot: -10, c: '#8FBCEA' },
  { g: 'ʃ', x: 50, y: 46, size: 19, rot: 0, c: '#F3C94B' },
  { g: 'æ', x: 76, y: 52, size: 20, rot: 10, c: '#F0A9C0' },
]

function Sparks({ side }: { side: 'left' | 'right' }) {
  const flip = side === 'left' ? -1 : 1
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 40 40"
      style={{ position: 'absolute', top: cq(2.4), [side]: cq(9), width: cq(6), transform: `scaleX(${flip})` }}
    >
      <g stroke="#F3C94B" strokeWidth="3" strokeLinecap="round">
        <line x1="6" y1="8" x2="14" y2="14" />
        <line x1="4" y1="22" x2="14" y2="22" />
        <line x1="6" y1="36" x2="14" y2="30" />
      </g>
    </svg>
  )
}

function Heart({ x, y, size, color }: { x: number; y: number; size: number; color: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      style={{ position: 'absolute', left: cq(x), top: cq(y), width: cq(size) }}
    >
      <path
        d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.2 4.3 2.6.7-1.4 2.2-2.6 4.3-2.6 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z"
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function FinalCard() {
  return (
    <div
      className={assistant.className}
      style={{ containerType: 'inline-size', position: 'absolute', inset: 0, backgroundColor: CREAM, color: INK }}
    >
      {/* Top pill, like "CARD 1 • KEEP IT SIMPLE" */}
      <Sparks side="left" />
      <Sparks side="right" />
      <div
        className={serif.className}
        style={{
          position: 'absolute', top: cq(3), left: '50%', transform: 'translateX(-50%)',
          backgroundColor: PILL, borderRadius: 999, padding: `${cq(1.6)} ${cq(4.5)}`,
          fontSize: cq(2.9), letterSpacing: cq(0.6), whiteSpace: 'nowrap', fontWeight: 500,
        }}
      >
        CARD 13 • ONE MORE THING
      </div>

      {/* Inner pastel panel */}
      <div
        style={{
          position: 'absolute', top: cq(11.5), left: cq(6), right: cq(6), bottom: cq(15),
          backgroundColor: BLUE, borderRadius: cq(5),
          display: 'flex', flexDirection: 'column', paddingBottom: cq(5),
        }}
      >
        {/* Illustration strip */}
        <div aria-hidden="true" style={{ position: 'relative', height: cq(27), flex: 'none' }}>
          {GLYPHS.map(s => (
            <span
              key={s.g}
              className={serif.className}
              style={{
                position: 'absolute', left: `${s.x}%`, top: `${s.y}%`,
                transform: `translate(-50%, -50%) rotate(${s.rot}deg)`,
                fontSize: cq(s.size), lineHeight: 1, color: s.c, fontWeight: 500,
              }}
            >
              {s.g}
            </span>
          ))}
          <Heart x={7} y={8} size={6} color="#F0A9C0" />
          <Heart x={75} y={8} size={6} color="#F0A9C0" />
        </div>

        {/* White box with the invitation */}
        <div
          dir="rtl"
          style={{
            margin: `0 ${cq(3)}`, backgroundColor: CREAM, borderRadius: cq(3.5),
            padding: `${cq(4.5)} ${cq(4)}`, textAlign: 'center',
            fontSize: cq(5.2), lineHeight: 1.45,
          }}
        >
          <p style={{ color: CORAL, fontWeight: 700, fontSize: cq(3.4), letterSpacing: cq(0.3), marginBottom: cq(2) }}>
            ואם בא לכם גם לשייף את ההגייה
          </p>
          <p>קורס הדגל שלי</p>
          <p dir="ltr" className={serif.className} style={{ fontSize: cq(8), fontWeight: 600, lineHeight: 1.2, margin: `${cq(1)} 0` }}>
            The sound of English
          </p>
          <p>עכשיו במחיר השקה</p>
          <p style={{ fontWeight: 700 }}>רק עד ה-26 לחודש :)</p>
        </div>

        {/* Button */}
        <div style={{ textAlign: 'center', marginTop: 'auto' }}>
          <a
            href={COURSE_URL}
            dir="rtl"
            className="inline-block transition-transform hover:scale-105"
            style={{
              backgroundColor: YELLOW, color: INK, borderRadius: 999, fontWeight: 700,
              fontSize: cq(5.4), padding: `${cq(2.6)} ${cq(10)}`,
            }}
          >
            לקורס ההגייה
          </a>
        </div>
      </div>

      {/* Footer, like the image cards */}
      <div
        style={{
          position: 'absolute', bottom: cq(3.5), left: 0, right: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: cq(2.5),
        }}
      >
        <span style={{ width: cq(12), height: 1, backgroundColor: INK, opacity: 0.6 }} />
        <span className={serif.className} style={{ fontSize: cq(3.4) }}>Free &amp; Clear English</span>
        <span style={{ width: cq(12), height: 1, backgroundColor: INK, opacity: 0.6 }} />
      </div>
      <Heart x={48} y={120.5} size={4} color={CORAL} />
    </div>
  )
}
