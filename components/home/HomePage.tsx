import Image from 'next/image'
import { Fraunces, DM_Sans, Barlow_Condensed, DM_Mono, Caveat, Rubik } from 'next/font/google'
import HomeNav from './HomeNav'
import HomeContact from './HomeContact'
import OfferPicker from './OfferPicker'
import { COMPANIES, type HomeCopy } from '@/lib/home-content'

// English: free look-alikes of the jennakutcher.com fonts (Sasha's reference,
// 2026-11-03). Fraunces ~ Reckless Neue, DM Sans ~ Circular,
// Barlow Condensed ~ Moderat Condensed, DM Mono ~ Maison Mono. Caveat is the
// approved handwritten line from Say It Back.
const fraunces = Fraunces({ subsets: ['latin'], weight: ['300', '400', '600'], style: ['normal', 'italic'], variable: '--fh-display', display: 'swap' })
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700'], variable: '--fh-body', display: 'swap' })
const barlow = Barlow_Condensed({ subsets: ['latin'], weight: ['500', '700'], variable: '--fh-cond', display: 'swap' })
const dmMono = DM_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--fh-mono', display: 'swap' })
const caveat = Caveat({ subsets: ['latin'], weight: ['600'], variable: '--fh-hand-en', display: 'swap' })
// Hebrew: Rubik everywhere (the /bundle font) + Gveret Levin for the hand line.
const rubik = Rubik({ subsets: ['hebrew', 'latin'], weight: ['300', '400', '500', '700', '800'], variable: '--fh-rubik', display: 'swap' })
const GVERET_URL = 'https://fonts.googleapis.com/css2?family=Gveret+Levin&display=swap'

// Pastel IPA glyphs floating in the empty side margins (same family as
// /courses, /bundle and the decks). Always mirrored pairs: same height, same
// size, opposite tilt, so the page stays symmetric. Hidden under 900px,
// where there are no side margins to fill.
const G_BLUE = '#8FBCEA'
const G_GOLD = '#F3D46B'
const G_PINK = '#F2B8CB'
const G_LILAC = '#C9BDEB'
type GlyphPair = { a: string; b: string; top: string; size: number; tilt: number; color: string; delay: number }
function Glyphs({ pairs }: { pairs: GlyphPair[] }) {
  return (
    <div className="fh-glyphs" aria-hidden="true" dir="ltr">
      {pairs.map((p, i) => (
        <span key={i}>
          <span className="fh-glyph" style={{ top: p.top, left: '3%', fontSize: p.size, color: p.color, animationDelay: `${p.delay}s`, ['--tilt' as string]: `${-p.tilt}deg` }}>{p.a}</span>
          <span className="fh-glyph" style={{ top: p.top, right: '3%', fontSize: p.size, color: p.color, animationDelay: `${p.delay + 1.4}s`, ['--tilt' as string]: `${p.tilt}deg` }}>{p.b}</span>
        </span>
      ))}
    </div>
  )
}
const GLYPHS_VIDEO: GlyphPair[] = [{ a: 'θ', b: 'ð', top: '30%', size: 170, tilt: 12, color: G_BLUE, delay: 0 }]
const GLYPHS_ABOUT: GlyphPair[] = [{ a: 'ʃ', b: 'ʒ', top: '58%', size: 150, tilt: 10, color: G_GOLD, delay: 0.6 }]
const GLYPHS_SERVICES: GlyphPair[] = [
  { a: 'iː', b: 'ɪ', top: '6%', size: 160, tilt: 12, color: G_PINK, delay: 0.3 },
  { a: 'ə', b: 'ʌ', top: '46%', size: 170, tilt: 8, color: G_BLUE, delay: 1.1 },
  { a: 'ŋ', b: 'æ', top: '80%', size: 150, tilt: 10, color: G_GOLD, delay: 1.8 },
]
const GLYPHS_TESTIMONIALS: GlyphPair[] = [{ a: 'ɹ', b: 'w', top: '22%', size: 160, tilt: 10, color: '#FFFFFF', delay: 0.9 }]
const GLYPHS_MESSAGES: GlyphPair[] = [{ a: 'uː', b: 'ʊ', top: '4%', size: 150, tilt: 10, color: G_LILAC, delay: 0.4 }]
const GLYPHS_CONTACT: GlyphPair[] = [{ a: 'eɪ', b: 'aɪ', top: '28%', size: 150, tilt: 10, color: G_PINK, delay: 1.3 }]

// WhatsApp / email messages from students, pinned to a board (Hebrew page).
// Laid out in hand-balanced columns so the board stays even; tilt + tape
// colours echo the /bundle page notes. sr8 is left out: it shows a full name.
type Note = { src: string; w: number; h: number; tilt: number; tape: string }
const TAPE = { yellow: 'rgba(245,200,66,0.85)', lilac: 'rgba(207,195,238,0.95)', pink: 'rgba(242,184,203,0.95)' }
const NOTE_COLUMNS: Note[][] = [
  [
    { src: '/images/testimonials/sr2.jpg', w: 1170, h: 1899, tilt: -2.5, tape: TAPE.yellow },
    { src: '/images/testimonials/sr1.jpg', w: 1170, h: 575, tilt: 2, tape: TAPE.pink },
  ],
  [
    { src: '/images/testimonials/sr4.jpg', w: 1169, h: 471, tilt: 1.5, tape: TAPE.lilac },
    { src: '/images/testimonials/sr5.jpg', w: 1164, h: 2165, tilt: -1.5, tape: TAPE.yellow },
  ],
  [
    { src: '/images/testimonials/sr6.jpg', w: 1170, h: 1765, tilt: 2.5, tape: TAPE.pink },
    { src: '/images/testimonials/sr7.jpg', w: 1168, h: 375, tilt: -2, tape: TAPE.yellow },
  ],
  [
    { src: '/images/testimonials/sr3.jpg', w: 1170, h: 1409, tilt: -1, tape: TAPE.lilac },
    { src: '/images/testimonials/sr9.jpg', w: 1206, h: 1339, tilt: 2, tape: TAPE.pink },
  ],
]

// Torn-paper scraps floating around the board (her reference: ripped
// newspaper collage). Jagged edges come from a seeded polygon, so the shape
// is identical on server and client.
function tornPolygon(seed: number, points = 26, depth = 5): string {
  let x = seed * 9301 + 49297
  const rnd = () => { x = (x * 9301 + 49297) % 233280; return x / 233280 }
  const pts: string[] = []
  for (let i = 0; i <= points; i++) pts.push(`${(i / points) * 100}% ${rnd() * depth}%`)
  for (let i = 0; i <= points / 3; i++) pts.push(`${100 - rnd() * 2}% ${(i / (points / 3)) * 100}%`)
  for (let i = points; i >= 0; i--) pts.push(`${(i / points) * 100}% ${100 - rnd() * depth}%`)
  for (let i = Math.floor(points / 3); i >= 0; i--) pts.push(`${rnd() * 2}% ${(i / (points / 3)) * 100}%`)
  return `polygon(${pts.join(', ')})`
}
const SCRAP_TEXT = 'the sound of a word travels further than its meaning. say it slowly, then say it again, and listen to the shape it leaves in the air. a voice that is clear is a voice that is heard. speak as you would in your own kitchen, among friends, with nothing to prove. '
const SCRAPS = [
  { cls: 'fh-scrap-1', tone: 'yellow', seed: 3 },
  { cls: 'fh-scrap-2', tone: 'paper', seed: 7 },
  { cls: 'fh-scrap-3', tone: 'grey', seed: 11 },
  { cls: 'fh-scrap-4', tone: 'paper', seed: 17 },
]

// Her rule: every sentence starts on its own line.
function Sentences({ text }: { text: string }) {
  const parts = text.split(/(?<=[.?!])\s+/)
  return <>{parts.map((s, i) => <span key={i} className="fh-sentence">{s}</span>)}</>
}

export default function HomePage({ t }: { t: HomeCopy }) {
  const he = t.lang === 'he'
  const fontVars = [fraunces.variable, dmSans.variable, barlow.variable, dmMono.variable, caveat.variable, rubik.variable].join(' ')

  return (
    <main dir={he ? 'rtl' : 'ltr'} lang={t.lang} className={`fh ${he ? 'fh-he' : 'fh-en'} ${fontVars}`}>
      {he && <link rel="stylesheet" href={GVERET_URL} precedence="default" />}
      <style>{CSS}</style>

      <HomeNav t={t} />

      {/* HERO */}
      <section className="fh-hero">
        <div className="fh-wrap fh-hero-grid">
          <div className="fh-hero-text">
            <p className="fh-eyebrow">{t.hero.eyebrow}</p>
            <h1 className="fh-h1">
              <span className="fh-block">{t.hero.line1}</span>
              <span className="fh-block">{t.hero.line2}</span>
              <span className="fh-block"><em className="fh-mark">{t.hero.emph}</em></span>
            </h1>
            <p className="fh-lead">{t.hero.sub}</p>
            <div className="fh-btns">
              <a href={`${t.base}#contact`} className="fh-btn fh-btn-navy">{t.hero.ctaMain}</a>
              <a href={`${t.base}#services`} className="fh-btn fh-btn-ghost">{t.hero.ctaSecond}</a>
            </div>
            <div className="fh-stats">
              {t.hero.stats.map(s => (
                <div key={s.label} className="fh-stat">
                  <span className="fh-stat-num">{s.value}</span>
                  <span className="fh-stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="fh-hero-side">
          {t.hero.hand && <p className="fh-hand fh-hero-hand">{t.hero.hand}</p>}
          <div className="fh-hero-photo">
            <div className="fh-arch">
              <div className="fh-arch-photo">
                <Image src="/images/sasha-2.jpg" alt="Sasha Daniel" fill priority quality={90} sizes="(max-width: 860px) 90vw, 500px" className="fh-hero-img" />
              </div>
            </div>
            <svg className="fh-stamp" viewBox="0 0 200 200" aria-hidden="true">
              <defs>
                <path id="fh-circle" d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0" />
              </defs>
              <circle cx="100" cy="100" r="98" fill="#fff" />
              <text className="fh-stamp-text">
                <textPath href="#fh-circle">FREE &amp; CLEAR ENGLISH · SASHA DANIEL ·</textPath>
              </text>
              <text x="100" y="114" textAnchor="middle" className="fh-stamp-mid">F&amp;C</text>
            </svg>
          </div>
          </div>
        </div>
      </section>

      {/* LOGOS */}
      <section className="fh-logos">
        <div className="fh-wrap">
          {t.logosLabel && <p className="fh-eyebrow fh-center">{t.logosLabel}</p>}
          <div className="fh-logo-row" dir="ltr">
            {COMPANIES.map(c => <span key={c}>{c}</span>)}
          </div>
        </div>
      </section>

      {/* STATEMENT, the one dark block */}
      <section className="fh-statement">
        <div className="fh-wrap fh-narrow fh-center">
          <p className="fh-statement-text">
            {t.statement.lines.map((l, i) => (
              <span key={i} className="fh-block">
                {l.text}{l.mark && <span className="fh-yellow">{l.mark}</span>}
              </span>
            ))}
          </p>
          {t.statement.hand && <p className="fh-hand fh-statement-hand">{t.statement.hand}</p>}
        </div>
      </section>

      {/* VIDEO */}
      <section className="fh-section fh-white">
        <div className="fh-wrap fh-center">
          <p className="fh-eyebrow">{t.video.eyebrow}</p>
          {t.video.title && <h2 className="fh-h2">{t.video.title}</h2>}
          <div className="fh-video">
            <video src="/welcome.mp4" poster="/images/video-poster.png" controls playsInline />
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="fh-section fh-grey">
        <div className="fh-wrap fh-about">
          <div className="fh-about-photo">
            <div className="fh-about-frame">
              <Image src="/images/headshot.jpg" alt={t.about.photoAlt} fill sizes="(max-width: 860px) 90vw, 520px" className="fh-cover" />
            </div>
          </div>
          <div className="fh-center">
            <p className="fh-eyebrow">{t.about.eyebrow}</p>
            <h2 className="fh-h2">
              {t.about.title.map(l => (
                <span key={l.text} className="fh-block fh-about-line">
                  {l.text}{l.hand && <span className="fh-hand fh-about-hand">{l.hand}</span>}{l.end}
                </span>
              ))}
            </h2>
            {t.about.paras.map(p => <p key={p} className="fh-body"><Sentences text={p} /></p>)}
            <a href={`${t.base}#contact`} className="fh-btn fh-btn-navy">{t.about.cta}</a>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="fh-section fh-white">
        <div className="fh-wrap">
          <div className="fh-center fh-head">
            <p className="fh-eyebrow">{t.services.eyebrow}</p>
            <h2 className="fh-h2">{t.services.title}</h2>
            <p className="fh-body fh-narrow-text"><Sentences text={t.services.sub} /></p>
          </div>

          <OfferPicker
            hint={t.services.pickHint}
            offers={[
              { id: 'personal', label: t.services.pickPersonal, img: '/images/offer-mugs.png', w: 900, h: 506, panel: (
          <div className="fh-cards3">
            {t.services.cards.map((c, i) => (
              <div key={c.title} className={`fh-card ${i === 0 ? 'fh-card-navy' : 'fh-card-grey'}`}>
                <span className="fh-badge">{c.badge}</span>
                <h3 className="fh-h3">{c.title}</h3>
                <p className="fh-meta">{c.meta}</p>
                <p className="fh-card-desc"><Sentences text={c.desc} /></p>
                <ul className="fh-list">
                  {c.bullets.map(b => <li key={b}>{b}</li>)}
                </ul>
                <div className="fh-price">
                  <span className={c.priceIsCta ? 'fh-price-invite' : 'fh-price-main'}>{c.price}</span>
                  {c.priceNote && <span className="fh-price-note">{c.priceNote}</span>}
                </div>
                <a href={`${t.base}${c.href}`} className={`fh-btn fh-btn-block ${i === 0 ? 'fh-btn-yellow' : 'fh-btn-navy'}`}>{c.cta}</a>
              </div>
            ))}
          </div>
              ) },
              { id: 'digital', label: t.services.pickDigital, img: '/images/offer-laptop.png', w: 900, h: 570, panel: (
          <div className={`fh-cards2 ${t.services.courses.length === 1 ? 'fh-cards-single' : ''} ${t.services.courses.length >= 3 ? 'fh-cards-many' : ''}`}>
            {t.services.courses.map((c, i) => (
              <div key={c.title} className={`fh-card fh-course ${i === 0 ? 'fh-card-yellow' : 'fh-card-grey'}`}>
                <span className="fh-badge">{c.badge}</span>
                <h3 className="fh-h3">{c.title}</h3>
                <p className="fh-meta">{c.meta}</p>
                <p className="fh-card-desc"><Sentences text={c.desc} /></p>
                <div className="fh-price">
                  <span className="fh-price-row">
                    <s className="fh-price-old">{c.oldPrice}</s>
                    <span className="fh-price-main">{c.price}</span>
                  </span>
                  <span className="fh-price-note">{c.priceNote}</span>
                </div>
                <a
                  href={c.href}
                  {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="fh-btn fh-btn-block fh-btn-navy"
                >
                  {c.cta}
                </a>
                {t.services.courses.some(x => x.moreHref) && (
                  c.moreHref
                    ? <a href={c.moreHref} {...(/^https?:/.test(c.moreHref) ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="fh-more-link">{c.moreLabel}</a>
                    : <span className="fh-more-link fh-more-empty" aria-hidden="true">&nbsp;</span>
                )}
              </div>
            ))}
          </div>
              ) },
            ]}
          />
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="fh-section fh-yellow-bg">
        <div className="fh-wrap">
          <div className="fh-center fh-head">
            <p className="fh-eyebrow fh-eyebrow-navy">{t.testimonials.eyebrow}</p>
            <h2 className="fh-h2">{t.testimonials.title}</h2>
          </div>
          <div className="fh-quotes">
            {t.testimonials.items.map(q => (
              <figure key={q.name} className="fh-quote">
                <span className="fh-quote-mark" aria-hidden="true">&ldquo;</span>
                <blockquote>{q.quote}</blockquote>
                <figcaption>
                  <span className="fh-avatar">{q.initial}</span>
                  <span className="fh-quote-name">{q.name}</span>
                  <span className="fh-quote-role">{q.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* WHATSAPP MESSAGES (Hebrew screenshots, so Hebrew page only) */}
      {t.messages && (
      <section className="fh-section fh-white" style={{ overflowX: 'clip' }}>
        <div className="fh-wrap">
          <div className="fh-center fh-head">
            <p className="fh-eyebrow">{t.messages.eyebrow}</p>
            <h2 className="fh-h2">{t.messages.title}</h2>
            <p className="fh-body fh-narrow-text"><Sentences text={t.messages.sub} /></p>
          </div>
          <div className="fh-board-wrap">
            {SCRAPS.map(sc => (
              <div key={sc.cls} className={`fh-scrap ${sc.cls} fh-scrap-${sc.tone}`} aria-hidden="true">
                <div className="fh-scrap-paper" style={{ clipPath: tornPolygon(sc.seed) }}>
                  <p dir="ltr">{SCRAP_TEXT.repeat(3)}</p>
                </div>
              </div>
            ))}
            <div className="fh-board">
              <div className="fh-board-paper" aria-hidden="true">
                <div style={{ clipPath: tornPolygon(5, 60, 2.2) }} />
              </div>
              {NOTE_COLUMNS.map((col, ci) => (
                <div key={ci} className="fh-board-col">
                  {col.map(n => (
                    <figure key={n.src} className="fh-note" style={{ rotate: `${n.tilt}deg` }}>
                      <span className="fh-note-tape" style={{ backgroundColor: n.tape }} aria-hidden="true" />
                      <Image src={n.src} alt="הודעה מתלמיד" width={n.w} height={n.h} sizes="(max-width: 700px) 44vw, 250px" />
                    </figure>
                  ))}
                </div>
              ))}
            </div>
          </div>
          {t.videoTestimonials && (
            <div className="fh-vids">
              {t.videoTestimonials.map(v => (
                <figure key={v.file} className="fh-vid">
                  <video controls preload="none" playsInline poster={`/videos/testimonial-${v.file}.jpg`}>
                    <source src={`/videos/testimonial-${v.file}.mp4`} type="video/mp4" />
                  </video>
                  <figcaption>{v.name}</figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>
      )}

      {/* CONTACT */}
      <section id="contact" className="fh-section fh-grey">
        <div className="fh-wrap fh-narrow fh-center">
          <p className="fh-eyebrow">{t.contact.eyebrow}</p>
          <h2 className="fh-h2">
            <span className="fh-block">{t.contact.title}</span>
            <span className="fh-block"><em className="fh-mark">{t.contact.titleEmph}</em></span>
          </h2>
          <p className="fh-body"><Sentences text={t.contact.sub} /></p>
          <HomeContact t={t.contact} />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="fh-footer">
        <div className="fh-wrap fh-footer-row">
          <span className="fh-logo fh-logo-light">Free &amp; Clear English</span>
          <span>&copy; {new Date().getFullYear()} {t.footer.rights}</span>
          <span className="fh-footer-links">
            <a href="https://www.instagram.com/freeandclearenglish" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://www.linkedin.com/in/sasha-daniel/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href={t.otherLangHref}>{t.otherLangLabel}</a>
          </span>
        </div>
      </footer>
    </main>
  )
}

const CSS = `
.fh {
  --navy: #1B3054;
  --yellow: #F5C842;
  --yellow-soft: #FFF4CC;
  --white: #FFFFFF;
  --grey: #F4F4F4;
  --line: #E4E6EA;
  --ink: #2D2D2D;
  --mute: #5A6272;
  --f-display: var(--fh-display), Georgia, serif;
  /* English page: the heading font (Fraunces) everywhere, her call 2026-11-11.
     The handwritten line keeps Caveat. */
  --f-body: var(--fh-display), Georgia, serif;
  --f-cond: var(--fh-display), Georgia, serif;
  --f-mono: var(--fh-display), Georgia, serif;
  --f-hand: var(--fh-hand-en), cursive;
  background: var(--white);
  color: var(--ink);
  font-family: var(--f-body);
  font-size: 1.2rem;
  line-height: 1.7;
}
.fh-he {
  --f-display: var(--fh-rubik), sans-serif;
  --f-body: var(--fh-rubik), sans-serif;
  --f-cond: var(--fh-rubik), sans-serif;
  --f-mono: var(--fh-rubik), sans-serif;
  --f-hand: 'Gveret Levin', cursive;
}
.fh *, .fh *::before, .fh *::after { box-sizing: border-box; }
.fh:not(.fh-he) .fh-stamp-text, .fh:not(.fh-he) .fh-logo-row span { font-family: var(--fh-display), Georgia, serif; }
:where(.fh) a { color: inherit; text-decoration: none; }
.fh-wrap { max-width: 1180px; margin: 0 auto; padding: 0 16px; }
@media (min-width: 700px) { .fh-wrap { padding: 0 32px; } }
.fh-narrow { max-width: 820px; }
.fh-narrow-text { max-width: 640px; }
.fh-body.fh-narrow-text { margin-inline: auto; }
.fh-center { text-align: center; }
.fh-block, .fh-sentence { display: block; }
.fh-white { background: var(--white); }
.fh-grey { background: var(--grey); }
.fh-yellow-bg { background: var(--yellow); }
.fh-section { padding: 88px 0; position: relative; }
.fh-section > .fh-wrap { position: relative; z-index: 1; }

/* offer picker: two objects, click to open */
.fh-offer-row { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; max-width: 860px; margin: 0 auto; }
.fh-offer { all: unset; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 18px; padding: 18px 10px 14px; border-radius: 28px; transition: background-color .25s ease; -webkit-tap-highlight-color: transparent; }
.fh-offer:focus-visible { outline: 3px solid var(--yellow); outline-offset: 4px; }
.fh-offer-img { display: block; width: min(100%, 360px); aspect-ratio: 16 / 10; position: relative; transition: transform .35s ease; filter: drop-shadow(0 22px 22px rgba(27,48,84,0.16)); }
.fh-offer-img img { width: 100%; height: 100%; object-fit: contain; }
.fh-offer:hover .fh-offer-img, .fh-offer.is-open .fh-offer-img { transform: translateY(-8px) rotate(-2deg); }
.fh-offer-label { font-weight: 700; font-size: clamp(1.25rem, 2.4vw, 1.7rem); color: var(--navy); line-height: 1.2; text-align: center; padding-bottom: 4px; border-bottom: 4px solid transparent; transition: border-color .25s ease; }
.fh-offer.is-open .fh-offer-label, .fh-offer:hover .fh-offer-label { border-bottom-color: var(--yellow); }
.fh-offer-chev { font-size: 1.6rem; line-height: .6; color: var(--navy); opacity: .55; transition: transform .3s ease; }
.fh-offer.is-open .fh-offer-chev { transform: rotate(180deg); opacity: 1; }
@media (max-width: 520px) { .fh-offer-label { font-size: 1.08rem; white-space: nowrap; } .fh-offer-row { gap: 8px; } }
.fh:not(.fh-he) .fh-offer-label { font-weight: 300; }
.fh-offer-hint { text-align: center; margin: 18px 0 0; color: var(--mute); font-size: 1rem; }
.fh-offer-panel { margin-top: 48px; animation: fhPanelIn .45s ease; }
.fh-offer-panel .fh-cards3 { margin-bottom: 0; }
@keyframes fhPanelIn { from { opacity: 0; translate: 0 14px; } to { opacity: 1; translate: 0 0; } }
@media (prefers-reduced-motion: reduce) { .fh-offer-panel { animation: none; } .fh-offer-img, .fh-offer-chev { transition: none; } }

/* floating phonetic glyphs in the side margins */
.fh-glyphs { position: absolute; inset: 0; overflow: hidden; pointer-events: none; user-select: none; z-index: 0; display: none; }
@media (min-width: 1100px) { .fh-glyphs { display: block; } }
.fh-glyph { position: absolute; line-height: 1; font-weight: 300; opacity: 0.5; rotate: var(--tilt); animation: fhGlyphFloat 6s ease-in-out infinite; font-family: var(--fh-body), sans-serif; }
@keyframes fhGlyphFloat { 0%, 100% { translate: 0 0; } 50% { translate: 0 -14px; } }
@media (prefers-reduced-motion: reduce) { .fh-glyph { animation: none; } }
@media (min-width: 900px) { .fh-section { padding: 120px 0; } }
.fh-head { margin-bottom: 56px; }

/* type */
.fh-eyebrow {
  font-family: var(--f-mono);
  font-size: 0.82rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--mute);
  margin: 0 0 18px;
}
.fh-he .fh-eyebrow { letter-spacing: 0.04em; font-size: 1rem; font-weight: 500; }
.fh-eyebrow-navy { color: var(--navy); }
.fh-h1 {
  font-family: var(--f-display);
  font-weight: 300;
  font-size: clamp(2.7rem, 6vw, 4.9rem);
  line-height: 1.04;
  letter-spacing: -0.02em;
  color: var(--navy);
  margin: 0 0 28px;
}
.fh-he .fh-h1 { font-weight: 800; letter-spacing: -0.01em; line-height: 1.2; font-size: clamp(2rem, 3.2vw, 2.8rem); }
@media (min-width: 900px) { .fh-he .fh-h1 .fh-block { white-space: nowrap; } }
.fh-h2 {
  font-family: var(--f-display);
  font-weight: 300;
  font-size: clamp(2.2rem, 4.4vw, 3.5rem);
  line-height: 1.1;
  letter-spacing: -0.015em;
  color: var(--navy);
  margin: 0 0 26px;
}
.fh-he .fh-h2 { font-weight: 700; letter-spacing: 0; line-height: 1.2; }
.fh-h3 {
  font-family: var(--f-display);
  font-weight: 400;
  font-size: 1.9rem;
  line-height: 1.15;
  margin: 0;
}
.fh-he .fh-h3 { font-weight: 700; font-size: 1.75rem; }
.fh-mark {
  font-style: italic;
  background: linear-gradient(transparent 62%, var(--yellow) 62%, var(--yellow) 92%, transparent 92%);
  padding: 0 0.08em;
}
.fh-he .fh-mark { font-style: normal; }
.fh-yellow { color: var(--yellow); font-style: italic; }
.fh-he .fh-yellow { font-style: normal; }
.fh-hand { font-family: var(--f-hand); font-weight: 600; line-height: 1.1; }
.fh-he .fh-hand { font-weight: 400; }
.fh-lead { font-size: 1.3rem; color: var(--mute); margin: 0 auto 34px; max-width: 520px; }
.fh-body { color: var(--mute); margin: 0 0 22px; }
.fh-muted { color: var(--mute); }

/* buttons: pills */
.fh-btn {
  display: inline-flex; align-items: center; justify-content: center;
  font-family: var(--f-body); font-weight: 700; font-size: 1.02rem;
  padding: 16px 34px; border-radius: 999px; border: 2px solid transparent;
  transition: transform .15s ease, opacity .15s ease; cursor: pointer;
}
.fh-en .fh-btn { font-family: var(--f-cond); text-transform: uppercase; letter-spacing: 0.1em; font-size: 1.05rem; }
.fh-btn:hover { transform: translateY(-2px); }
.fh-btn-sm { padding: 10px 22px; font-size: 0.92rem; }
.fh-en .fh-btn-sm { font-size: 0.95rem; }
.fh-btn-block { display: flex; width: 100%; }
.fh-btn-navy { background: var(--navy); color: var(--white); }
.fh-btn-yellow { background: var(--yellow); color: var(--navy); }
.fh-btn-ghost { background: transparent; color: var(--navy); border-color: var(--navy); }
.fh-btns { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; margin-bottom: 44px; }
.fh-btn:disabled { opacity: .6; }

/* nav */
.fh-nav { position: sticky; top: 0; z-index: 50; background: rgba(255,255,255,0.94); backdrop-filter: blur(8px); border-bottom: 1px solid var(--line); }
.fh-nav-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; height: 72px; }
.fh-logo { font-family: var(--fh-display), Georgia, serif; font-weight: 600; font-size: 1.3rem; color: var(--navy); white-space: nowrap; }
.fh-logo-light { color: var(--white); }
.fh-nav-links { display: none; gap: 34px; font-size: 1rem; font-weight: 500; color: var(--navy); }
.fh-nav-links a:hover { color: var(--mute); }
.fh-nav-end { display: flex; align-items: center; gap: 12px; }
.fh-lang {
  font-size: 0.95rem; font-weight: 500; color: var(--navy);
  border: 1.5px solid var(--line); border-radius: 999px; padding: 7px 16px;
}
.fh-lang[lang="he"] { font-family: var(--fh-rubik), sans-serif; }
.fh-lang[lang="en"] { font-family: var(--fh-body), sans-serif; }
.fh-lang:hover { border-color: var(--navy); }
.fh-burger { background: none; border: 0; color: var(--navy); padding: 6px; cursor: pointer; }
.fh-hide-sm { display: none; }
.fh-nav-mobile { display: flex; flex-direction: column; gap: 16px; padding-bottom: 22px; font-weight: 500; color: var(--navy); }
@media (min-width: 900px) {
  .fh-nav-links { display: flex; }
  .fh-hide-sm { display: inline-flex; }
  .fh-burger, .fh-nav-mobile { display: none; }
}

/* hero */
.fh-hero { background: var(--grey); padding: 56px 0 0; overflow: hidden; }
.fh-hero-grid { display: grid; gap: 40px; align-items: end; }
.fh-hero-text { text-align: center; padding-bottom: 8px; }
.fh-hero-side { display: flex; flex-direction: column; align-items: center; }
.fh-hero-hand { color: var(--navy); font-size: 2.6rem; margin: 0 0 4px; transform: rotate(-3deg); }
.fh-he .fh-hero-hand { transform: rotate(3deg); }
.fh-stats { display: grid; grid-template-columns: repeat(3, 1fr); border-top: 1px solid #D9DCE1; padding: 22px 0 48px; }
.fh-stat { display: flex; flex-direction: column; align-items: center; padding: 0 8px; }
.fh-stat + .fh-stat { border-inline-start: 1px solid #D9DCE1; }
.fh-stat-num { font-family: var(--f-display); font-size: 2.4rem; font-weight: 400; color: var(--navy); line-height: 1.1; }
.fh-he .fh-stat-num { font-weight: 700; }
.fh-stat-label { font-size: 0.92rem; color: var(--mute); line-height: 1.35; margin-top: 6px; }
.fh-hero-photo { position: relative; width: min(100%, 470px); margin: 0 auto; aspect-ratio: 470 / 560; }
/* yellow arch frame with the original photo sitting in its middle */
.fh-arch {
  position: absolute; inset: 0;
  background: var(--yellow);
  border-radius: 999px 999px 0 0;
  padding: 16px 16px 0;
}
.fh-arch-photo { position: relative; width: 100%; height: 100%; border-radius: 999px 999px 0 0; overflow: hidden; background: #f3f3f1; }
.fh-hero-img { object-fit: cover; object-position: 47% 30%; }
.fh-stamp { direction: ltr; position: absolute; width: 132px; height: 132px; bottom: 26px; inset-inline-start: -4px; animation: fhSpin 28s linear infinite; filter: drop-shadow(0 6px 16px rgba(27,48,84,.15)); }
.fh-stamp-text { font-family: var(--fh-mono), monospace; font-size: 15.5px; letter-spacing: 3px; fill: var(--navy); }
.fh-stamp-mid { font-family: var(--fh-display), serif; font-size: 40px; font-style: italic; fill: var(--navy); }
@keyframes fhSpin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { .fh-stamp { animation: none; } }
@media (min-width: 900px) {
  .fh-hero { padding-top: 72px; }
  .fh-hero-grid { grid-template-columns: 1.1fr 0.9fr; gap: 56px; }
  .fh-hero-photo { width: 100%; max-width: 500px; }
}

/* logos */
.fh-logos { background: var(--white); padding: 52px 0; border-bottom: 1px solid var(--line); }
.fh-logo-row { display: flex; flex-wrap: wrap; justify-content: center; gap: 18px 44px; }
.fh-logo-row span { font-family: var(--fh-cond), sans-serif; font-weight: 700; font-size: 1.55rem; letter-spacing: 0.06em; text-transform: uppercase; color: var(--navy); opacity: 0.5; }

/* statement */
.fh-statement { background: var(--navy); color: var(--white); padding: 104px 0 96px; }
.fh-statement-text { font-family: var(--f-display); font-weight: 300; font-size: clamp(1.9rem, 4vw, 3.1rem); line-height: 1.3; margin: 0 0 22px; }
.fh-he .fh-statement-text { font-weight: 500; line-height: 1.45; }
.fh-statement-hand { color: var(--yellow); font-size: 2.6rem; transform: rotate(-3deg); margin: 0; }
.fh-he .fh-statement-hand { transform: rotate(3deg); }

/* video */
.fh-video { position: relative; max-width: 880px; margin: 14px auto 0; }
.fh-video::before { content: ''; position: absolute; inset: 22px -18px -18px 22px; background: var(--yellow); border-radius: 30px; }
.fh-he .fh-video::before { inset: 22px 22px -18px -18px; }
.fh-video video { position: relative; display: block; width: 100%; border-radius: 30px; background: var(--navy); }

/* about */
.fh-about { display: grid; gap: 56px; align-items: center; }
.fh-about-photo { position: relative; max-width: 520px; width: 100%; margin: 0 auto; }
.fh-about-photo::before { content: ''; position: absolute; width: 46%; aspect-ratio: 1; background: var(--yellow); border-radius: 50%; top: -28px; inset-inline-start: -28px; }
.fh-about-frame { position: relative; aspect-ratio: 4 / 5; border-radius: 260px 260px 30px 30px; overflow: hidden; background: #e8edf5; }
.fh-cover { object-fit: cover; object-position: 50% 20%; }
@media (min-width: 900px) { .fh-about { grid-template-columns: 1fr 1fr; gap: 80px; } }

.fh-about .fh-h2 { font-size: clamp(1.45rem, 2.6vw, 2.35rem); }
.fh-about-line { white-space: nowrap; }
.fh-about-hand { font-size: 1.4em; line-height: 1; color: var(--navy); }

/* services */
.fh-group-label { display: flex; align-items: center; gap: 18px; margin: 0 0 26px; font-family: var(--f-cond); font-weight: 700; font-size: 1.35rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--navy); }
.fh-he .fh-group-label { letter-spacing: 0; font-size: 1.4rem; }
.fh-group-label::before, .fh-group-label::after { content: ''; flex: 1; height: 1px; background: var(--line); }
.fh-cards3, .fh-cards2 { display: grid; gap: 22px; margin-bottom: 64px; }
.fh-cards2 { margin-bottom: 0; }
.fh-card {
  display: flex; flex-direction: column; gap: 14px;
  border-radius: 28px; padding: 34px 30px; text-align: center; align-items: center;
}
.fh-card > * { margin: 0; }
.fh-card-navy { background: var(--navy); color: var(--white); }
.fh-card-grey { background: var(--grey); color: var(--navy); }
.fh-card-yellow { background: var(--yellow); color: var(--navy); }
.fh-badge {
  justify-self: center; align-self: center;
  font-family: var(--f-mono); font-size: 0.76rem; letter-spacing: 0.16em; text-transform: uppercase;
  padding: 7px 16px; border-radius: 999px; background: var(--white); color: var(--navy);
}
.fh-he .fh-badge { letter-spacing: 0; font-size: 0.92rem; font-weight: 500; }
.fh-card-navy .fh-badge { background: var(--yellow); }
.fh-card-yellow .fh-badge { background: var(--navy); color: var(--yellow); }
.fh-meta { font-size: 0.98rem; font-weight: 500; opacity: 0.75; line-height: 1.5; }
.fh-card-navy .fh-meta { color: var(--yellow); opacity: 1; }
.fh-card-desc { font-size: 1.06rem; line-height: 1.65; opacity: 0.85; }
.fh-list { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 6px; font-size: 1rem; font-weight: 500; }
.fh-list li::before { content: '✓  '; color: var(--yellow); font-weight: 700; }
.fh-card-grey .fh-list li::before { color: var(--navy); }
.fh-price { display: flex; flex-direction: column; align-items: center; padding-top: 16px; border-top: 1px solid currentColor; border-top-color: color-mix(in srgb, currentColor 18%, transparent); width: 100%; }
.fh-price-row { display: flex; align-items: baseline; gap: 10px; }
.fh-price-main { font-family: var(--f-display); font-size: 2.1rem; font-weight: 400; line-height: 1.15; }
.fh-he .fh-price-main { font-weight: 700; }
.fh-price-old { font-size: 1.25rem; opacity: 0.45; }
.fh-price-note { font-size: 0.9rem; opacity: 0.7; }
.fh-price-invite { color: var(--yellow); font-weight: 700; font-size: 1.15rem; line-height: 1.4; max-width: 260px; }
.fh-cards-single { max-width: 580px; margin-inline: auto; }
.fh-more-link { font-weight: 600; text-decoration: underline !important; text-underline-offset: 4px; color: var(--navy); }
.fh-more-empty { text-decoration: none !important; }
.fh-card .fh-btn { align-self: stretch; }
@media (min-width: 900px) {
  .fh-cards3 { grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(7, auto); }
  .fh-cards2 { grid-template-columns: repeat(2, 1fr); grid-template-rows: repeat(6, auto); }
  .fh-cards2.fh-cards-single { grid-template-columns: 1fr; }
  /* 3 or more courses: three per row, an unfinished last row is centred */
  .fh-cards2.fh-cards-many { grid-template-columns: repeat(6, 1fr); grid-template-rows: none; grid-auto-rows: auto; }
  .fh-cards2.fh-cards-many .fh-card { grid-column: span 2; grid-row: span 7; }
  .fh-cards2.fh-cards-many .fh-card:nth-child(3n+1):nth-last-child(2) { grid-column: 2 / span 2; }
  .fh-cards2.fh-cards-many .fh-card:nth-child(3n+1):nth-last-child(1) { grid-column: 3 / span 2; }
  /* symmetry: every row of every card shares the same grid row */
  .fh-cards3 .fh-card { display: grid; grid-template-rows: subgrid; grid-row: span 7; row-gap: 14px; justify-items: center; }
  .fh-cards2 .fh-card { display: grid; grid-template-rows: subgrid; grid-row: span 6; row-gap: 14px; justify-items: center; }
  .fh-card .fh-btn { justify-self: stretch; align-self: end; }
  .fh-card-desc, .fh-list { align-self: start; }
  .fh-price { align-self: end; }
}

/* testimonials */
.fh-quotes { display: grid; gap: 22px; }
.fh-quote { margin: 0; background: var(--white); border-radius: 28px; padding: 34px 30px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 12px; }
.fh-quote-mark { font-family: var(--fh-display), serif; font-size: 4.4rem; line-height: 0.6; color: var(--yellow); height: 34px; }
.fh-quote blockquote { margin: 0; align-self: start; font-family: var(--f-display); font-weight: 300; font-size: 1.32rem; line-height: 1.5; color: var(--navy); }
.fh-he .fh-quote blockquote { font-weight: 400; font-size: 1.22rem; }
.fh-quote figcaption { display: flex; flex-direction: column; align-items: center; gap: 2px; align-self: stretch; padding-top: 18px; border-top: 1px solid var(--line); }
.fh-avatar { width: 44px; height: 44px; border-radius: 50%; background: var(--navy); color: var(--yellow); display: grid; place-items: center; font-weight: 700; margin-bottom: 8px; }
.fh-quote-name { font-weight: 700; color: var(--navy); font-size: 1.05rem; }
.fh-quote-role { font-size: 0.92rem; color: var(--mute); }
@media (min-width: 900px) {
  .fh-quotes { grid-template-columns: repeat(3, 1fr); grid-template-rows: auto 1fr auto; }
  .fh-quote { display: grid; grid-template-rows: subgrid; grid-row: span 3; justify-items: center; }
}

/* whatsapp screenshots */
/* messages board */
.fh-board-wrap { position: relative; max-width: 1120px; margin-inline: auto; padding: 24px 0; }
.fh-board {
  position: relative; z-index: 1;
  display: flex; flex-wrap: wrap; align-items: flex-start; justify-content: center; gap: 28px 22px;
  padding: 56px 28px 48px;
}
/* the board itself: a sheet of light grey paper with torn edges */
.fh-board-paper { position: absolute; inset: 0; z-index: -1; filter: drop-shadow(0 0 0.5px #fff) drop-shadow(2px 0 0 #fff) drop-shadow(-2px 0 0 #fff) drop-shadow(0 2px 0 #fff) drop-shadow(0 -2px 0 #fff) drop-shadow(0 18px 24px rgba(27,48,84,0.18)); }
.fh-board-paper > div {
  width: 100%; height: 100%;
  background-color: #ebe9e4;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.3  0 0 0 0 0.3  0 0 0 0 0.3  0 0 0 0.09 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"), radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.55), transparent 60%);
}
.fh-board-col { display: flex; flex-direction: column; gap: 34px; width: calc(50% - 11px); }
.fh-note { position: relative; margin: 0; }
.fh-note img { display: block; width: 100%; height: auto; border-radius: 10px; box-shadow: 0 10px 22px rgba(27,48,84,0.22); }
.fh-note-tape { position: absolute; top: -11px; left: 50%; width: 74px; height: 22px; margin-left: -37px; z-index: 1; box-shadow: 0 1px 3px rgba(0,0,0,0.15); }
@media (min-width: 900px) {
  .fh-board { padding: 64px 48px 56px; flex-wrap: nowrap; }
  .fh-board-col { width: 25%; max-width: 250px; }
  .fh-board-col:nth-child(even) { margin-top: 36px; }
}

/* video testimonials under the board */
.fh-vids { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; max-width: 900px; margin: 72px auto 0; }
.fh-vid { margin: 0; text-align: center; }
.fh-vid video { display: block; width: 100%; aspect-ratio: 9 / 16; object-fit: cover; border-radius: 22px; background: #000; box-shadow: 0 18px 36px -18px rgba(27,48,84,0.5); }
.fh-vid figcaption { margin-top: 12px; font-weight: 700; font-size: 1.15rem; color: var(--navy); }
@media (max-width: 700px) {
  .fh-vids { grid-template-columns: none; grid-auto-flow: column; grid-auto-columns: 72%; overflow-x: auto; scroll-snap-type: x mandatory; margin-top: 48px; padding-bottom: 8px; }
  .fh-vid { scroll-snap-align: center; }
}

/* torn newspaper scraps around the board */
.fh-scrap { position: absolute; z-index: 2; pointer-events: none; filter: drop-shadow(1.5px 0 0 #fff) drop-shadow(-1.5px 0 0 #fff) drop-shadow(0 1.5px 0 #fff) drop-shadow(0 -1.5px 0 #fff) drop-shadow(0 8px 12px rgba(0,0,0,0.22)); animation: fhScrapFloat 9s ease-in-out infinite; }
.fh-scrap-paper { width: 100%; height: 100%; overflow: hidden; }
.fh-scrap-paper p { margin: 0; padding: 10px 12px; font-family: Georgia, 'Times New Roman', serif; font-size: 11px; line-height: 1.35; text-align: justify; }
.fh-scrap-paper { background: #f3efe6; }
.fh-scrap-paper p { color: rgba(45,45,45,0.55); }
.fh-scrap-yellow .fh-scrap-paper { background: var(--yellow); }
.fh-scrap-yellow p { color: rgba(27,48,84,0.55); }
.fh-scrap-grey .fh-scrap-paper { background: #2d2d2d; }
.fh-scrap-grey p { color: rgba(255,255,255,0.6); }
.fh-scrap-1 { width: 190px; height: 74px; top: -6px; right: 6%; rotate: 6deg; }
.fh-scrap-2 { width: 150px; height: 96px; bottom: -22px; left: 30%; rotate: -8deg; animation-delay: -3s; }
.fh-scrap-3 { width: 120px; height: 48px; top: 38%; left: -28px; rotate: -12deg; animation-delay: -5s; }
.fh-scrap-4 { width: 130px; height: 60px; bottom: 22%; right: -24px; rotate: 9deg; animation-delay: -7s; }
@keyframes fhScrapFloat { 0%, 100% { translate: 0 0; } 50% { translate: 0 -10px; } }
@media (max-width: 899px) { .fh-scrap-3, .fh-scrap-4 { display: none; } .fh-scrap-1 { width: 140px; height: 56px; } .fh-scrap-2 { width: 110px; height: 70px; } }
@media (prefers-reduced-motion: reduce) { .fh-scrap { animation: none; } }

/* contact */
.fh-form { background: var(--white); border-radius: 28px; padding: 30px 22px; margin-top: 34px; text-align: start; display: flex; flex-direction: column; gap: 18px; box-shadow: 0 24px 60px -34px rgba(27,48,84,.35); }
@media (min-width: 700px) { .fh-form { padding: 40px 38px; } }
.fh-form-row { display: grid; gap: 18px; }
@media (min-width: 700px) { .fh-form-row { grid-template-columns: 1fr 1fr; } }
.fh-form label { display: flex; flex-direction: column; gap: 8px; font-size: 0.98rem; font-weight: 500; color: var(--navy); }
.fh-form input, .fh-form textarea {
  font: inherit; font-size: 1.05rem; font-weight: 400; color: var(--ink);
  background: var(--grey); border: 1.5px solid transparent; border-radius: 16px; padding: 14px 16px; resize: none;
}
.fh-he .fh-form input[type=email] { text-align: right; }
.fh-form input:focus, .fh-form textarea:focus { outline: none; border-color: var(--yellow); background: var(--white); }
.fh-error { color: #b42318; font-size: 0.95rem; margin: 0; }
.fh-form-done { align-items: center; text-align: center; padding: 48px 24px; }
.fh-done-mark { font-size: 3rem; color: var(--yellow); margin: 0; }
.fh-done-title { font-size: 1.4rem; font-weight: 700; color: var(--navy); margin: 0; }

/* footer */
.fh-footer { background: var(--navy); color: rgba(255,255,255,.7); padding: 40px 0; font-size: 0.95rem; }
.fh-footer-row { display: flex; flex-direction: column; align-items: center; gap: 14px; text-align: center; }
.fh-footer-links { display: flex; gap: 22px; }
.fh-footer-links a:hover { color: var(--white); }
@media (min-width: 900px) { .fh-footer-row { flex-direction: row; justify-content: space-between; } }
`
