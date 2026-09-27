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
}

const STORAGE_KEY = 'fce-course-demo-progress'

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
    if (!isLast) goTo(i + 1)
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
                    Chapter {ci + 1}
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

        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--yellow)' }}>
          Chapter {lesson.chapterIndex + 1} · {chapters[lesson.chapterIndex].title}
        </p>
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
