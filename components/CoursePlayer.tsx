'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type Player from '@vimeo/player'

export interface DemoLesson {
  title: string
  vimeoId: string
  // Private ("hide from Vimeo") videos have a hash in their URL:
  // vimeo.com/<id>/<hash>. Without it the embed refuses to play.
  vimeoHash?: string
  description?: string
  // Printable practice sheet(s) for this sound, served from /public/practice-pdf.
  pdf?: string
  pdf2?: string
}

export interface DemoChapter {
  title: string
  lessons: DemoLesson[]
  // A one-lesson "chapter" that should read as a single lesson: no chapter
  // header in the list, no chapter line above the video. Used for the closing
  // video, which needs no label to say what it is.
  standalone?: boolean
}

const STORAGE_KEY = 'fce-course-demo-progress'
const CERT_NAME_KEY = 'fce-course-certificate-name'

// Standalone entries are not chapters, so they must not consume a chapter
// number: without this the bonuses would be "Chapter 4" and the closing video
// "Chapter 5", which is exactly the labelling we removed.
function chapterNumber(chapters: DemoChapter[], ci: number): number {
  return chapters.slice(0, ci + 1).filter((c) => !c.standalone).length
}

export default function CoursePlayer({
  courseName,
  chapters,
}: {
  courseName: string
  chapters: DemoChapter[]
}) {
  // Lessons are navigated as one flat list; the sidebar keeps the chapter shape.
  const flat = useMemo(
    () =>
      chapters.flatMap((chapter, ci) =>
        chapter.lessons.map((lesson, li) => ({ ...lesson, chapterIndex: ci, lessonIndex: li })),
      ),
    [chapters],
  )

  const [i, setI] = useState(0)
  const [done, setDone] = useState<Set<number>>(new Set())
  const [menuOpen, setMenuOpen] = useState(false)
  const [finished, setFinished] = useState(false)
  const [showCertificate, setShowCertificate] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const playerRef = useRef<Player | null>(null)
  // Chapters start folded; only the chapter you are in is open.
  const [openChapters, setOpenChapters] = useState<Set<number>>(() => new Set([0]))

  // Progress lives in the browser, so it survives a refresh without a login.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setDone(new Set(JSON.parse(saved) as number[]))
    } catch {}
  }, [])

  const save = (next: Set<number>) => {
    setDone(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]))
    } catch {}
  }

  const lesson = flat[i]

  // Vimeo's own end screen ("More videos") cannot be switched off on the
  // Starter plan, and it shows videos from Sasha's other courses. So for every
  // lesson the site covers the player the moment the video ends.
  useEffect(() => {
    const iframe = iframeRef.current
    if (!lesson?.vimeoId || !iframe) return
    let cancelled = false
    let player: Player | null = null
    import('@vimeo/player').then(({ default: VimeoPlayer }) => {
      if (cancelled) return
      const p = new VimeoPlayer(iframe)
      player = p
      playerRef.current = p
      p.on('ended', () => {
        setFinished(true)
        // A fullscreen player would sit above anything the page draws. Never
        // wait on the answer: if the player doesn't reply, the cover still shows.
        try {
          p.exitFullscreen().catch(() => {})
        } catch {}
      })
    })
    return () => {
      cancelled = true
      player?.off('ended')
      playerRef.current = null
    }
  }, [lesson?.vimeoId])

  const watchAgain = () => {
    setFinished(false)
    const p = playerRef.current
    p?.setCurrentTime(0)
      .then(() => p.play())
      .catch(() => {})
  }

  const toggleChapter = (ci: number) =>
    setOpenChapters((prev) => {
      const next = new Set(prev)
      if (next.has(ci)) next.delete(ci)
      else next.add(ci)
      return next
    })
  const isLast = i === flat.length - 1

  const goTo = (n: number) => {
    const target = Math.min(Math.max(n, 0), flat.length - 1)
    setI(target)
    setFinished(false)
    // Moving into another chapter opens it, so the current lesson is always visible.
    const ci = flat[target].chapterIndex
    setOpenChapters((prev) => (prev.has(ci) ? prev : new Set(prev).add(ci)))
    setMenuOpen(false)
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const complete = () => {
    save(new Set(done).add(i))
    if (isLast) {
      setFinished(false)
      setShowCertificate(true)
      return
    }
    goTo(i + 1)
  }

  const toggleDone = (n: number) => {
    const next = new Set(done)
    if (next.has(n)) next.delete(n)
    else next.add(n)
    save(next)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goTo(i + 1)
      if (e.key === 'ArrowLeft') goTo(i - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [i, flat.length])

  const pct = Math.round((done.size / flat.length) * 100)

  const sidebar = (
    <aside>
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--yellow)' }}>
          {courseName}
        </p>
        <div
          className="h-1.5 rounded-full overflow-hidden mb-2"
          style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
        >
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${pct}%`, backgroundColor: 'var(--yellow)' }}
          />
        </div>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
          {done.size} of {flat.length} lessons complete
        </p>
      </div>

      <nav className="space-y-1">
        {chapters.map((chapter, ci) => {
          const indices = flat.flatMap((f, n) => (f.chapterIndex === ci ? [n] : []))
          const doneCount = indices.filter((n) => done.has(n)).length
          const open = openChapters.has(ci)

          // Standalone: rendered as one plain lesson row, always visible.
          if (chapter.standalone) {
            const n = indices[0]
            const active = n === i
            const isDone = done.has(n)
            return (
              <div key={ci} className="flex items-center gap-1 pt-2">
                <button
                  onClick={() => toggleDone(n)}
                  aria-label={isDone ? 'Mark as not watched' : 'Mark as watched'}
                  className="shrink-0 rounded-full flex items-center justify-center transition-colors"
                  style={{
                    width: '18px',
                    height: '18px',
                    border: isDone ? 'none' : '1.5px solid rgba(255,255,255,0.3)',
                    backgroundColor: isDone ? 'var(--yellow)' : 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  {isDone && (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--navy)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={() => goTo(n)}
                  className="flex-1 text-left text-sm rounded-md px-2 py-1.5 transition-colors"
                  style={{
                    color: active ? 'var(--navy)' : 'rgba(255,255,255,0.75)',
                    backgroundColor: active ? 'var(--yellow)' : 'transparent',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {chapter.lessons[0].title}
                </button>
              </div>
            )
          }

          return (
            <div key={ci}>
              <button
                onClick={() => toggleChapter(ci)}
                aria-expanded={open}
                aria-controls={`chapter-${ci}`}
                className="w-full flex items-center justify-between gap-3 text-left rounded-lg py-2"
                style={{ cursor: 'pointer' }}
              >
                <span>
                  <span className="block text-[11px] font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    Chapter {chapterNumber(chapters, ci)}
                  </span>
                  <span className="block text-sm font-bold text-white">{chapter.title}</span>
                </span>
                <span className="flex items-center gap-2 shrink-0">
                  <span className="text-xs tabular-nums" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    {doneCount}/{indices.length}
                  </span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="rgba(255,255,255,0.6)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 150ms' }}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>
              </button>
              {open && (
                <ul id={`chapter-${ci}`} className="space-y-0.5 mt-1 mb-3">
                  {chapter.lessons.map((l, li) => {
                    const n = flat.findIndex((f) => f.chapterIndex === ci && f.lessonIndex === li)
                    const active = n === i
                    const isDone = done.has(n)
                    return (
                      <li key={li} className="flex items-center gap-1">
                        <button
                          onClick={() => toggleDone(n)}
                          aria-label={isDone ? 'Mark as not watched' : 'Mark as watched'}
                          className="shrink-0 rounded-full flex items-center justify-center transition-colors"
                          style={{
                            width: '18px',
                            height: '18px',
                            border: isDone ? 'none' : '1.5px solid rgba(255,255,255,0.3)',
                            backgroundColor: isDone ? 'var(--yellow)' : 'transparent',
                            cursor: 'pointer',
                          }}
                        >
                          {isDone && (
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--navy)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20 6L9 17l-5-5" />
                            </svg>
                          )}
                        </button>
                        <button
                          onClick={() => goTo(n)}
                          className="flex-1 text-left text-sm rounded-md px-2 py-1.5 transition-colors"
                          style={{
                            color: active ? 'var(--navy)' : 'rgba(255,255,255,0.75)',
                            backgroundColor: active ? 'var(--yellow)' : 'transparent',
                            fontWeight: active ? 700 : 400,
                            cursor: 'pointer',
                          }}
                        >
                          {l.title}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )

  return (
    <div className="max-w-6xl mx-auto lg:grid lg:gap-12" style={{ gridTemplateColumns: '260px 1fr' }}>
      {showCertificate && (
        <Certificate courseName={courseName} onClose={() => setShowCertificate(false)} />
      )}
      {/* Mobile: the same list, folded into a toggle above the video. */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="w-full flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold"
          style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#fff' }}
        >
          <span>
            Lesson {i + 1} of {flat.length}
          </span>
          <span style={{ color: 'var(--yellow)' }}>{menuOpen ? 'Close' : 'Course contents'}</span>
        </button>
        {menuOpen && <div className="mt-5">{sidebar}</div>}
      </div>

      <div className="hidden lg:block">{sidebar}</div>

      <main>
        <div
          className="relative rounded-2xl overflow-hidden mb-6"
          style={{ aspectRatio: '16 / 9', backgroundColor: 'rgba(255,255,255,0.06)' }}
        >
          {lesson.vimeoId ? (
            <iframe
              key={lesson.vimeoId}
              ref={iframeRef}
              src={`https://player.vimeo.com/video/${lesson.vimeoId}${lesson.vimeoHash ? `?h=${lesson.vimeoHash}` : ''}`}
              className="w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title={lesson.title}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Video coming soon
            </div>
          )}
          {finished && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center"
              style={{ background: 'linear-gradient(rgba(255,255,255,0.06), rgba(255,255,255,0.06)), var(--navy)' }}
            >
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--yellow)' }}>
                Lesson complete
              </p>
              {/* On a phone the title already sits right under the video. */}
              <p className="hidden sm:block text-2xl font-bold text-white">{lesson.title}</p>
              <div className="flex items-center justify-center gap-3">
                <NavButton onClick={watchAgain} disabled={false} variant="ghost" compact>
                  Watch again
                </NavButton>
                <NavButton onClick={complete} disabled={false} variant="solid" compact>
                  {isLast ? 'Finish course' : 'Next lesson'}
                  <Arrow dir="right" />
                </NavButton>
              </div>
            </div>
          )}
        </div>

        {!chapters[lesson.chapterIndex].standalone && (
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--yellow)' }}>
            Chapter {chapterNumber(chapters, lesson.chapterIndex)} · {chapters[lesson.chapterIndex].title}
          </p>
        )}
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">{lesson.title}</h1>
        {lesson.description && (
          <p className="text-base leading-relaxed mb-10" style={{ color: 'rgba(255,255,255,0.65)' }}>
            {lesson.description}
          </p>
        )}

        {[lesson.pdf, lesson.pdf2].filter(Boolean).map((href) => (
          <a
            key={href}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-xl mb-8 transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.18)', padding: '0.85rem 1.2rem', color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}
          >
            <span
              className="shrink-0 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'var(--yellow)', width: 30, height: 30 }}
              aria-hidden="true"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--navy)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v12" />
                <path d="M7 12l5 5 5-5" />
                <path d="M4 20h16" />
              </svg>
            </span>
            PDF for practice
          </a>
        ))}

        <div className="flex items-center justify-between gap-3 pt-2">
          <NavButton onClick={() => goTo(i - 1)} disabled={i === 0} variant="ghost">
            <Arrow dir="left" />
            Previous
          </NavButton>
          <NavButton onClick={complete} disabled={false} variant="solid">
            {isLast ? 'Finish course' : done.has(i) ? 'Next lesson' : 'Complete and continue'}
            <Arrow dir="right" />
          </NavButton>
        </div>
      </main>
    </div>
  )
}

/* The reward for finishing. The old "Finish course" button did nothing at all,
   which is a flat ending for a course somebody paid for and worked through.
   The learner types their own name (we never learn it from the signed link,
   which carries only an email) and can print or save it as a PDF. */
function Certificate({ courseName, onClose }: { courseName: string; onClose: () => void }) {
  const [name, setName] = useState('')

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CERT_NAME_KEY)
      if (saved) setName(saved)
    } catch {}
  }, [])

  const onName = (v: string) => {
    setName(v)
    try {
      localStorage.setItem(CERT_NAME_KEY, v)
    } catch {}
  }

  // Hardcoded Israel time: the date on the certificate should be her students'
  // date, not the timezone of whatever device they happen to be using.
  const date = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jerusalem',
  }).format(new Date())

  const confetti = [
    { top: '8%', left: '10%', c: '#F5C842', r: false, s: 13, d: 0 },
    { top: '14%', left: '86%', c: '#F5C842', r: false, s: 13, d: 0.5 },
    { top: '30%', left: '5%', c: '#7FB0E4', r: true, s: 10, d: 0.9 },
    { top: '30%', left: '92%', c: '#7FB0E4', r: true, s: 10, d: 1.4 },
    { top: '68%', left: '8%', c: '#F0A9C0', r: false, s: 11, d: 0.3 },
    { top: '68%', left: '89%', c: '#F0A9C0', r: false, s: 11, d: 1.1 },
    // Kept in the corners: at 16%/81% these two landed on the date and the
    // signature line.
    { top: '91%', left: '4%', c: '#F5C842', r: true, s: 9, d: 1.7 },
    { top: '91%', left: '94%', c: '#F5C842', r: true, s: 9, d: 0.7 },
  ]

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto cert-overlay"
      style={{ backgroundColor: 'rgba(11,23,44,0.92)', backdropFilter: 'blur(3px)' }}
      role="dialog"
      aria-modal="true"
      aria-label="Certificate of completion"
    >
      <style>{`
@keyframes certFloat { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-9px) } }
@keyframes certIn { from { opacity: 0; transform: translateY(14px) scale(0.97) } to { opacity: 1; transform: none } }
.cert-float { animation: certFloat 4.5s ease-in-out infinite; }
.cert-card { animation: certIn 0.5s ease-out both; }
@media (prefers-reduced-motion: reduce) { .cert-float, .cert-card { animation: none !important; } }
@media print {
  body * { visibility: hidden !important; }
  .cert-overlay { position: absolute !important; inset: 0 !important; background: #fff !important; backdrop-filter: none !important; overflow: visible !important; }
  .cert-card, .cert-card * { visibility: visible !important; }
  .cert-card { box-shadow: none !important; margin: 0 !important; animation: none !important; }
  .cert-hide-print { display: none !important; }
  @page { size: A4 landscape; margin: 12mm; }
}
      `}</style>

      <div className="min-h-full flex flex-col items-center justify-center px-4 py-10">
        <div
          className="cert-card relative w-full"
          style={{
            maxWidth: 780,
            backgroundColor: '#FDFBF4',
            border: '1px solid rgba(27,48,84,0.12)',
            borderRadius: 20,
            padding: 'clamp(2rem, 6vw, 3.6rem) clamp(1.2rem, 5vw, 3.4rem)',
            boxShadow: '0 30px 70px rgba(0,0,0,0.35)',
            textAlign: 'center',
            color: '#1B3054',
          }}
        >
          {/* A gold inner rule, the way a real certificate is framed. */}
          <span
            aria-hidden
            style={{ position: 'absolute', inset: 12, borderRadius: 14, border: '2px solid rgba(201,162,39,0.45)', pointerEvents: 'none' }}
          />
          {confetti.map((c, n) => (
            <span
              key={n}
              aria-hidden
              className="cert-float"
              style={{
                position: 'absolute',
                top: c.top,
                left: c.left,
                width: c.s,
                height: c.s,
                backgroundColor: c.c,
                borderRadius: c.r ? '50%' : 3,
                opacity: 0.9,
                animationDelay: `${c.d}s`,
              }}
            />
          ))}

          <p style={{ fontSize: '2.6rem', lineHeight: 1 }} aria-hidden>
            🎉
          </p>

          <p
            className="uppercase"
            style={{ marginTop: '1.1rem', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.24em', color: '#C9A227' }}
          >
            Certificate of Completion
          </p>

          <p style={{ marginTop: '1.6rem', fontSize: '1.02rem', color: '#42536D' }}>This certifies that</p>

          <input
            value={name}
            onChange={(e) => onName(e.target.value)}
            placeholder="Your name"
            aria-label="Your name"
            className="cert-name"
            style={{
              display: 'block',
              margin: '0.6rem auto 0',
              width: 'min(100%, 420px)',
              textAlign: 'center',
              fontSize: 'clamp(1.6rem, 5.5vw, 2.3rem)',
              fontWeight: 700,
              color: '#1B3054',
              background: 'transparent',
              border: 'none',
              borderBottom: '2px solid rgba(201,162,39,0.55)',
              padding: '0.25rem 0.4rem',
              outline: 'none',
            }}
          />

          <p style={{ marginTop: '1.5rem', fontSize: '1.02rem', color: '#42536D' }}>has completed</p>
          <p style={{ marginTop: '0.45rem', fontSize: 'clamp(1.35rem, 4.6vw, 1.85rem)', fontWeight: 700, direction: 'ltr' }}>
            {courseName}
          </p>
          <p style={{ marginTop: '1.1rem', fontSize: '1rem', lineHeight: 1.65, color: '#42536D' }}>
            every sound, every practice, all the way to the end.
          </p>

          <div
            style={{
              marginTop: '2.4rem',
              paddingTop: '1.4rem',
              borderTop: '1px solid rgba(27,48,84,0.12)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.8rem',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.9rem',
              color: '#7C8AA0',
            }}
          >
            <span>{date}</span>
            <span style={{ fontWeight: 700, color: '#1B3054' }}>Sasha · Free &amp; Clear English</span>
          </div>
        </div>

        <div className="cert-hide-print flex flex-wrap items-center justify-center gap-3" style={{ marginTop: '1.8rem' }}>
          <button
            onClick={() => window.print()}
            className="rounded-full font-bold"
            style={{ backgroundColor: 'var(--yellow)', color: 'var(--navy)', padding: '0.85rem 1.7rem', fontSize: '0.95rem', cursor: 'pointer', border: 'none' }}
          >
            Print or save as PDF
          </button>
          <button
            onClick={onClose}
            className="rounded-full font-bold"
            style={{ backgroundColor: 'transparent', color: 'rgba(255,255,255,0.8)', padding: '0.85rem 1.5rem', fontSize: '0.95rem', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.3)' }}
          >
            Back to the course
          </button>
        </div>
      </div>
    </div>
  )
}

function NavButton({
  children,
  onClick,
  disabled,
  variant,
  compact = false,
}: {
  children: React.ReactNode
  onClick: () => void
  disabled: boolean
  variant: 'solid' | 'ghost'
  compact?: boolean
}) {
  const solid = variant === 'solid'
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-2 rounded-full font-bold transition-opacity"
      style={{
        padding: compact ? '0.6rem 1.1rem' : solid ? '0.9rem 1.6rem' : '0.9rem 1.3rem',
        fontSize: compact ? '0.85rem' : '0.95rem',
        whiteSpace: compact ? 'nowrap' : undefined,
        backgroundColor: solid ? 'var(--yellow)' : 'transparent',
        color: solid ? 'var(--navy)' : 'rgba(255,255,255,0.75)',
        border: solid ? 'none' : '1px solid rgba(255,255,255,0.25)',
        opacity: disabled ? 0.3 : 1,
        cursor: disabled ? 'default' : 'pointer',
      }}
    >
      {children}
    </button>
  )
}

function Arrow({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ transform: dir === 'right' ? 'rotate(180deg)' : undefined }}
    >
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
  )
}
