import type { Metadata } from 'next'
import { Assistant, Caveat } from 'next/font/google'
import Image from 'next/image'
import MetaPixel from '@/components/MetaPixel'
import CheckoutForm from './CheckoutForm'

const assistant = Assistant({ subsets: ['latin'], weight: ['300', '400', '600', '700'], display: 'swap' })
const hand = Caveat({ subsets: ['latin'], weight: ['600'], display: 'swap' })

export const metadata: Metadata = {
  title: 'Say It Back | 56 shadowing recordings to get English out of your head and into your mouth',
  description:
    'You understand English. So why does nothing come out when it is your turn to speak? 56 short shadowing recordings, 10 minutes at a time. Launch price €27.',
  alternates: { canonical: 'https://www.freeandclearenglish.com/say-it-back' },
  openGraph: {
    title: 'Say It Back',
    description: 'You understand English. Now let your mouth catch up. 56 shadowing recordings. Launch price €27.',
    url: 'https://www.freeandclearenglish.com/say-it-back',
    siteName: 'Free & Clear English',
    locale: 'en_GB',
    type: 'website',
  },
}

const INK = '#1B3054'
const BODY = '#42536D'
const SOFT = '#7C8AA0'
const GOLD = '#C9A227'

/* ---------- lines ---------- */
/* Same system as the Sound of English page: every paragraph is a stack of short
   centred lines, and anything emphasised gets its OWN line so the emphasis stays
   symmetrical around the centre axis. */

type Kind = 'n' | 'b' | 'hl' | 'u' | 'big' | 'hand'
type Line = { t: React.ReactNode; k?: Kind; space?: string }

function Lines({ lines, tone = BODY, airy = false }: { lines: Line[]; tone?: string; airy?: boolean }) {
  return (
    <div className="mx-auto" style={{ maxWidth: 680 }}>
      {lines.map((l, i) => {
        const k = l.k ?? 'n'
        const base: React.CSSProperties = {
          margin: l.space ?? (airy ? (k === 'n' ? '0.9rem auto' : '1.8rem auto') : k === 'n' ? '0.5rem auto' : '1.15rem auto'),
          lineHeight: 1.6,
          textAlign: 'center',
        }
        if (k === 'hand')
          // Yellow on navy; on light backgrounds yellow disappears, so it writes in ink.
          return <p key={i} className={hand.className} style={{ ...base, fontSize: 'clamp(1.9rem, 5.5vw, 2.6rem)', fontWeight: 600, lineHeight: 1.25, color: tone === BODY ? INK : 'var(--yellow)' }}>{l.t}</p>
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
  // Mirrored pairs: same height, same size, opposite tilt, shared colour.
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

/* Mirrored confetti, only where the page celebrates: the opening and the buy box. */
function Confetti() {
  const colors = { a: '#F5C842', b: '#9CC6F0', c: '#F3B6CA' }
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

function Cta({ label = "I'm in 👉" }: { label?: string }) {
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

function H2({ children, color = INK }: { children: React.ReactNode; color?: string }) {
  return (
    <h2 className="text-center mb-10" style={{ fontSize: 'clamp(1.8rem, 4.8vw, 2.7rem)', fontWeight: 600, letterSpacing: '-0.015em', color, lineHeight: 1.3 }}>
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

/* Three equal cards on a subgrid, so icon, title and text line up across the row. */
function Trio({ items, dark = false }: { items: Array<{ icon: string; title: string; text: string }>; dark?: boolean }) {
  return (
    <div className="grid gap-5 sm:grid-cols-3 mx-auto" style={{ maxWidth: 880 }}>
      {items.map((it) => (
        <div
          key={it.title}
          className="rounded-3xl grid"
          style={{
            gridRow: 'span 3',
            gridTemplateRows: 'subgrid',
            rowGap: '0.6rem',
            padding: '1.8rem 1.4rem',
            backgroundColor: dark ? 'rgba(255,255,255,0.06)' : '#fff',
            border: dark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(27,48,84,0.12)',
            boxShadow: dark ? 'none' : '0 14px 32px rgba(27,48,84,0.05)',
          }}
        >
          <p style={{ fontSize: '2.4rem', lineHeight: 1 }}>{it.icon}</p>
          <p style={{ fontSize: '1.3rem', fontWeight: 700, color: dark ? 'var(--yellow)' : INK }}>{it.title}</p>
          <p style={{ whiteSpace: 'pre-line', fontSize: '1.1rem', fontWeight: 300, lineHeight: 1.55, color: dark ? 'rgba(255,255,255,0.9)' : BODY }}>{it.text}</p>
        </div>
      ))}
    </div>
  )
}

/* ---------- written testimonials ---------- */
/* SASHA: replace with REAL reviews from real students and set real: true on each.
   The section only appears for entries marked real: true, so nothing placeholder
   can ever go live by accident. */
const TESTIMONIALS: Array<{ quote: string; name: string; detail?: string; real: boolean }> = [
  { quote: 'Your student’s words go here.', name: 'First name', detail: 'Country / job (optional)', real: false },
  { quote: 'Your student’s words go here.', name: 'First name', detail: 'Country / job (optional)', real: false },
  { quote: 'Your student’s words go here.', name: 'First name', detail: 'Country / job (optional)', real: false },
]

/* ---------- page ---------- */

export default function SayItBackPage() {
  return (
    <>
      <MetaPixel />
      <main dir="ltr" className={assistant.className} style={{ backgroundColor: '#fff', color: INK, textAlign: 'center' }}>
        <style
          dangerouslySetInnerHTML={{
            __html: `
@keyframes fceFloat { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-9px) } }
.fce-float { animation: fceFloat 4.5s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .fce-float { animation: none !important; } }
`,
          }}
        />

        {/* HERO */}
        <section className="relative overflow-hidden pt-16 pb-20" style={{ backgroundColor: INK }}>
          <div aria-hidden className="absolute" style={{ top: -200, right: -150, width: 560, height: 560, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,200,66,0.20) 0%, rgba(245,200,66,0) 70%)' }} />
          <div aria-hidden className="absolute" style={{ top: -200, left: -150, width: 560, height: 560, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,200,66,0.20) 0%, rgba(245,200,66,0) 70%)' }} />
          <Phonetics set={0} />
          <Confetti />
          <div className="relative max-w-3xl mx-auto px-6">
            <p className="mb-7 inline-block rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.08)', padding: '0.45rem 1.3rem', fontSize: '1.02rem', color: 'var(--yellow)', fontWeight: 600 }}>
              🎧 Say It Back · 56 shadowing recordings
            </p>

            <h1 className="mb-16" style={{ fontSize: 'clamp(2.1rem, 5.6vw, 3.4rem)', fontWeight: 600, lineHeight: 1.32, letterSpacing: '-0.02em', color: '#fff' }}>
              <span style={{ display: 'block', fontWeight: 400 }}>
                You{' '}
                <span className="relative inline-block">
                  understand English
                  <svg
                    viewBox="0 0 300 12"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                    style={{ position: 'absolute', left: 0, right: 0, bottom: '-0.16em', width: '100%', height: '0.22em' }}
                  >
                    <path d="M3 8 C 90 2, 190 2, 297 7" stroke="rgba(255,255,255,0.85)" strokeWidth="4" strokeLinecap="round" fill="none" />
                  </svg>
                </span>
                .
              </span>
              <span style={{ display: 'block', marginTop: '0.9em', fontSize: 'min(3.9rem, 7.6vw)', whiteSpace: 'nowrap', fontWeight: 700, lineHeight: 1.15, color: 'var(--yellow)' }}>
                So why can&apos;t you speak
              </span>
              <span style={{ display: 'block', marginTop: '0.35em', fontSize: '0.8em', fontWeight: 400, color: 'var(--yellow)' }}>
                when it&apos;s your turn?
              </span>
            </h1>

            <Lines
              tone="#fff"
              airy
              lines={[
                { t: 'You know the words.' },
                { t: 'You know the grammar.' },
                { t: 'But in the meeting, on the call, at the dinner table,' },
                { t: 'your mouth goes blank.', k: 'b', space: '3rem auto' },
                { t: 'Your English isn’t missing.', k: 'hand' },
                { t: 'It’s stuck in your head.', k: 'hand' },
              ]}
            />

            <div className="mt-16">
              <Cta label="Get my English out 👉" />
            </div>
            <div className="mt-14 flex items-baseline justify-center gap-3">
              <span style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'line-through', fontSize: 'clamp(1.5rem, 5vw, 2.25rem)', fontWeight: 700 }}>€49</span>
              <span style={{ color: 'var(--yellow)', fontSize: 'clamp(3.25rem, 11vw, 5rem)', fontWeight: 700, lineHeight: 1 }}>€27</span>
            </div>
            <p className="mt-3" style={{ fontSize: '1.15rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>
              One-time payment · <span style={{ color: 'var(--yellow)' }}>⏳ Launch price</span>
            </p>
          </div>
        </section>

        {/* PAIN */}
        <section className="relative overflow-hidden py-20" style={{ backgroundColor: '#fff' }}>
          <div className="relative max-w-3xl mx-auto px-6">
            <Card>
              <Lines airy
                lines={[
                  { t: 'Sound familiar?', k: 'big' },
                  { t: 'You build the perfect sentence in your head.' },
                  { t: 'By the time it’s ready, the conversation has moved on.', k: 'hl' },
                  { t: 'You translate every word before you say it.' },
                  { t: 'You stay quiet in meetings you could have led.', k: 'u' },
                  { t: 'You say “yeah, exactly”' },
                  { t: 'when you had so much more to say.', k: 'b' },
                  { t: 'And later, in the shower,' },
                  { t: 'you know exactly what you should have said.' },
                  { t: <span style={{ fontSize: '1.3em' }}>Enough.</span>, k: 'hand' },
                ]}
              />
            </Card>
          </div>
        </section>

        {/* THREE THINGS THAT DON'T WORK */}
        <section className="relative overflow-hidden py-24" style={{ backgroundColor: 'var(--light-grey)' }}>
          <Phonetics set={1} />
          <div className="relative max-w-4xl mx-auto px-6">
            <H2>You’ve probably already tried…</H2>
            <Trio
              items={[
                { icon: '📚', title: 'Another grammar course', text: 'You already know the rules.\nKnowing isn’t speaking.' },
                { icon: '📱', title: 'Language apps', text: 'Tapping a screen trains your thumbs, not your mouth.' },
                { icon: '📺', title: 'Series with subtitles', text: 'Great for your ears.\nYour mouth just sits there and watches.' },
              ]}
            />
            <div className="mt-12">
              <Lines
                lines={[
                  { t: <span style={{ fontSize: '1.3em', fontWeight: 400 }}>They all train your head.</span> },
                  { t: <span style={{ fontSize: '1.35em' }}>Nobody trains your mouth.</span>, k: 'hand', space: '1.6rem auto' },
                ]}
              />
            </div>
          </div>
        </section>

        {/* NOT YOUR FAULT */}
        <section className="relative overflow-hidden py-24" style={{ backgroundColor: '#fff' }}>
          <Phonetics set={2} />
          <div className="relative max-w-3xl mx-auto px-6">
            <H2>The problem isn’t you</H2>
            <Lines airy
              lines={[
                { t: 'At school you learned English to pass tests:' },
                { t: 'reading, writing, grammar.' },
                { t: 'Nobody ever taught your mouth to speak it.', k: 'hl' },
                { t: 'So now you have a head full of English' },
                { t: 'and a mouth that never got to practise.', k: 'hand' },
              ]}
            />
          </div>
        </section>

        {/* SHADOWING: warm yellow section so the solution feels like the bright spot of the page */}
        <section className="relative overflow-hidden py-24" style={{ background: 'linear-gradient(180deg, #FFF5D6 0%, #FFFBEE 100%)' }}>
          <Phonetics set={0} />
          <div className="relative max-w-3xl mx-auto px-6">
            <H2>
              Meet{' '}
              <span style={{ background: 'linear-gradient(transparent 58%, rgba(245,200,66,0.85) 58%)', padding: '0 0.15em' }}>Shadowing</span>{' '}
              ☀️
            </H2>
            <div
              className="rounded-3xl mx-auto"
              style={{ backgroundColor: '#fff', border: '2px solid rgba(245,200,66,0.7)', padding: '2.2rem 1.8rem', boxShadow: '0 20px 48px rgba(201,162,39,0.14)', maxWidth: 760 }}
            >
              <Lines airy
                lines={[
                  { t: 'You hear a sentence.' },
                  { t: 'You say it back, out loud.', k: 'hl' },
                ]}
              />
              {/* Three equal yellow pills, so the three "No"s read as one symmetric beat. */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mx-auto my-8" style={{ maxWidth: 600 }}>
                {['No translating.', 'No inventing.', 'No thinking.'].map((x) => (
                  <span
                    key={x}
                    className="rounded-full"
                    style={{ backgroundColor: 'var(--yellow)', color: INK, fontWeight: 700, fontSize: '1.15rem', padding: '0.7rem 1rem' }}
                  >
                    {x}
                  </span>
                ))}
              </div>
              <Lines airy
                lines={[
                  { t: 'You just copy the sound, the rhythm and the melody.' },
                  { t: 'It’s how actors, speakers and politicians' },
                  { t: 'train their delivery.' },
                  { t: 'And it’s how your mouth finally gets its turn.', k: 'hand' },
                ]}
              />
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="relative overflow-hidden py-24" style={{ backgroundColor: '#fff' }}>
          <div className="relative max-w-4xl mx-auto px-6">
            <H2>How it works</H2>
            <Trio
              items={[
                { icon: '▶️', title: '1. Press play', text: 'Listen to a short sentence from real, everyday English.' },
                { icon: '🗣️', title: '2. Say it back', text: 'Out loud, right after it.\nCopy the sound, not just the words.' },
                { icon: '🔁', title: '3. Again tomorrow', text: '10 minutes, up to 3 times a week.\nThat’s all.' },
              ]}
            />
            <div className="mt-12">
              <Lines
                lines={[
                  { t: <span style={{ fontSize: '1.2em' }}>No big goals.</span>, k: 'hand' },
                  { t: 'Just 10 minutes and your own voice.' },
                ]}
              />
            </div>
          </div>
        </section>

        {/* WHAT'S INSIDE */}
        <section className="relative overflow-hidden py-24" style={{ backgroundColor: INK }}>
          <Phonetics set={1} />
          <div className="relative max-w-3xl mx-auto px-6">
            <H2 color="var(--yellow)">What you get</H2>
            <Lines airy
              tone="#fff"
              lines={[
                { t: '56 short recordings', k: 'big' },
                { t: 'in 19 weekly folders, about 10 minutes each' },
                { t: 'everyday English, the kind people actually say' },
                { t: 'Listen in the car, while cooking, on a walk', k: 'hand' },
                { t: 'Instant access by email the moment you pay', k: 'u' },
                { t: 'Yours forever.', k: 'b' },
                { t: 'No subscription.', k: 'b' },
              ]}
            />
          </div>
        </section>

        {/* SAMPLE */}
        <section className="py-24" style={{ backgroundColor: 'var(--light-grey)' }}>
          <div className="max-w-xl mx-auto px-6">
            <H2>Want a taste? 🎧</H2>
            <Lines
              lines={[
                { t: 'Press play and say it back out loud.' },
                { t: 'Yes, right now.', k: 'b' },
                { t: 'Nobody’s listening.', k: 'hand' },
              ]}
            />
            <div className="rounded-3xl mt-10" style={{ backgroundColor: '#fff', border: '1px solid rgba(27,48,84,0.12)', padding: '1.6rem 1.4rem', boxShadow: '0 14px 32px rgba(27,48,84,0.05)' }}>
              <audio controls preload="metadata" style={{ width: '100%' }}>
                <source src="/audio/yalla-sample.mp3" type="audio/mpeg" />
                <source src="/audio/yalla-sample-v2.m4a" type="audio/mp4" />
                Your browser does not support the player. <a href="/audio/yalla-sample.mp3">Download the recording</a>
              </audio>
              <p className="mt-4" style={{ fontSize: '1rem', fontWeight: 600, color: SOFT }}>
                Week 15 · Agreeing &amp; Disagreeing Politely
              </p>
            </div>
            <div className="mt-12">
              <Cta />
            </div>
          </div>
        </section>

        {/* TESTIMONIALS: only entries marked real: true */}
        {TESTIMONIALS.some(t => t.real) && (
          <section className="py-24" style={{ backgroundColor: '#fff' }}>
            <div className="max-w-5xl mx-auto px-6">
              <H2>They already said it back 💛</H2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {TESTIMONIALS.filter(t => t.real).map((t, i) => (
                  <figure
                    key={i}
                    className="rounded-3xl grid"
                    style={{ gridRow: 'span 2', gridTemplateRows: 'subgrid', padding: '1.8rem 1.4rem', backgroundColor: '#fff', border: '1px solid rgba(27,48,84,0.12)' }}
                  >
                    <blockquote style={{ fontSize: '1.1rem', fontWeight: 300, lineHeight: 1.6, color: BODY }}>“{t.quote}”</blockquote>
                    <figcaption>
                      <span className="block" style={{ fontWeight: 700, color: INK }}>{t.name}</span>
                      {t.detail && <span className="block" style={{ fontSize: '0.95rem', color: SOFT }}>{t.detail}</span>}
                    </figcaption>
                  </figure>
                ))}
              </div>
              <div className="mt-12">
                <Cta />
              </div>
            </div>
          </section>
        )}

        {/* IS IT FOR YOU */}
        <section className="relative overflow-hidden py-24" style={{ backgroundColor: '#fff' }}>
          <Phonetics set={2} />
          <div className="relative max-w-3xl mx-auto px-6">
            <H2>Wait, is this for you?</H2>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-3xl" style={{ backgroundColor: INK, color: '#fff', padding: '2rem 1.6rem' }}>
                <p className="mb-4" style={{ fontSize: '1.5rem', color: 'var(--yellow)', fontWeight: 700 }}>Yes ✅</p>
                <p className="mx-auto" style={{ fontSize: '1.15rem', color: 'rgba(255,255,255,0.92)', fontWeight: 300, maxWidth: 360, lineHeight: 1.6 }}>
                  If you <span style={{ fontWeight: 700, color: '#fff' }}>already speak English</span>,
                  <br />
                  understand much more than you say,
                  <br />
                  <br />
                  and want the words to come out
                  <br />
                  when you actually need them.
                </p>
              </div>
              <div className="rounded-3xl" style={{ backgroundColor: '#fff', border: '1px solid rgba(27,48,84,0.12)', padding: '2rem 1.6rem' }}>
                <p className="mb-4" style={{ fontSize: '1.5rem', fontWeight: 700 }}>No 🙅</p>
                <p className="mx-auto" style={{ fontSize: '1.15rem', color: BODY, fontWeight: 300, maxWidth: 360, lineHeight: 1.6 }}>
                  If your English is <span style={{ fontWeight: 700, color: INK }}>still basic</span>.
                  <br />
                  <br />
                  This really isn&apos;t the place to start,
                  <br />
                  and I don&apos;t want you to waste your money.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section className="py-20" style={{ backgroundColor: 'var(--light-grey)' }}>
          <div className="max-w-2xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center gap-8 rounded-3xl p-8 bg-white shadow-sm" style={{ border: '1px solid #E5E7EB' }}>
              <div className="relative rounded-full overflow-hidden flex-shrink-0 w-32 h-32 md:w-40 md:h-40" style={{ border: '4px solid var(--yellow)' }}>
                <Image src="/images/sasha-2026.jpg" alt="Sasha Daniel" fill sizes="160px" style={{ objectFit: 'cover', objectPosition: 'center 18%' }} />
              </div>
              <div className="text-center md:text-left">
                <h2 className="mb-3" style={{ color: INK, fontSize: '1.6rem', fontWeight: 700 }}>Hi, I&apos;m Sasha 👋</h2>
                <p className="mb-4" style={{ color: BODY, fontSize: '1.15rem', lineHeight: 1.65 }}>
                  English is my <strong style={{ color: INK }}>third language</strong>.
                  <br />
                  At 22 I went to acting school in New York, discovered phonetics, and spent years training my own mouth until English felt like mine.
                  <br />
                  Today I&apos;m a communication and pronunciation coach, and I made these recordings for people who understand
                  English but freeze when they speak.
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
              <H2>And if it doesn’t work?</H2>
              <Lines airy
                lines={[
                  { t: 'You did all 19 folders,' },
                  { t: 'gave it 3 months of real practice,' },
                  { t: 'and nothing changed?' },
                  { t: 'I’ll refund every cent.', k: 'hl', space: '2.4rem auto' },
                  { t: 'Because I know that when you practise, it works.', k: 'b' },
                ]}
              />
            </div>
          </div>
        </section>

        {/* PRICE */}
        <section id="buy" className="relative overflow-hidden py-24" style={{ backgroundColor: INK }}>
          <Phonetics set={0} />
          <Confetti />
          <div className="relative max-w-xl mx-auto px-6" style={{ color: '#fff' }}>
            <H2 color="#fff">Launch price</H2>
            <p className="mb-1" style={{ fontSize: '1.3rem', color: 'rgba(255,255,255,0.55)', fontWeight: 300 }}>
              <s>€49</s>
            </p>
            <p className="mb-6" style={{ fontSize: 'clamp(3.6rem, 13vw, 5.6rem)', lineHeight: 1, color: 'var(--yellow)', fontWeight: 700 }}>
              €27
            </p>
            <p className="mb-3" style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.9)', fontWeight: 300 }}>
              One-time payment · Yours forever
            </p>
            <p className="mb-10" style={{ fontSize: '1.2rem', color: 'var(--yellow)', fontWeight: 600 }}>
              56 recordings = less than €0.50 each
            </p>
            <CheckoutForm />
          </div>
        </section>

        {/* FAQ */}
        <section className="relative overflow-hidden py-24" style={{ backgroundColor: 'var(--light-grey)' }}>
          <Phonetics set={1} />
          <div className="relative max-w-3xl mx-auto px-6">
            <H2>Questions you’re probably asking</H2>
            <div className="space-y-4">
              <Faq q="How much time does it take?">
                <Lines
                  lines={[
                    { t: 'About 10 minutes, up to 3 times a week.' },
                    { t: 'Small and steady beats big and rare.', k: 'b' },
                  ]}
                />
              </Faq>
              <Faq q="Can I really do it while driving?">
                <Lines
                  lines={[
                    { t: 'Yes.' },
                    { t: 'All you need is your ears and your voice.' },
                    { t: 'Eyes on the road, English in your mouth.', k: 'b' },
                  ]}
                />
              </Faq>
              <Faq q="How do I get the recordings?">
                <Lines
                  lines={[
                    { t: 'Right after you pay, you get an email with your access link.' },
                    { t: 'Listen on your phone or computer,' },
                    { t: 'as many times as you like.', k: 'b' },
                  ]}
                />
              </Faq>
              <Faq q="What level do I need?">
                <Lines
                  lines={[
                    { t: 'Intermediate or above.' },
                    { t: 'If you understand this page, you’re ready.', k: 'b' },
                  ]}
                />
              </Faq>
            </div>
            <div className="mt-14">
              <Cta />
            </div>
          </div>
        </section>

        <footer className="py-8 text-center" style={{ backgroundColor: INK }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>Free &amp; Clear English · freeandclearenglish.com</p>
        </footer>
      </main>
    </>
  )
}
