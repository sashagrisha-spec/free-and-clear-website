'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { SIB_WEEKS, sectionFile, wordsFile } from '@/lib/say-it-back-weeks'

const INK = '#1B3054'
const BODY = '#42536D'
const SOFT = '#7C8AA0'
const SAVE_KEY = 'sib-last' // last track + position, so a driver can pick up where they stopped

type Track = { week: number; section: number; title: string; dur: number }

function fmt(s: number) {
  const t = Math.max(0, Math.floor(s))
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`
}

export default function Player({ mediaBase, handClass }: { mediaBase: string; handClass: string }) {
  // One flat playlist across all weeks, so "next" runs straight through the course.
  const tracks = useMemo<Track[]>(
    () => SIB_WEEKS.flatMap((w) => w.sections.map((dur, i) => ({ week: w.n, section: i + 1, title: w.title, dur }))),
    []
  )
  const audio = useRef<HTMLAudioElement>(null)
  const [cur, setCur] = useState<number | null>(null)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [saved, setSaved] = useState<{ i: number; t: number } | null>(null)
  const resumeAt = useRef(0)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVE_KEY)
      if (raw) {
        const v = JSON.parse(raw)
        if (typeof v.i === 'number' && v.i >= 0 && v.i < tracks.length) setSaved(v)
      }
    } catch {}
  }, [tracks.length])

  const play = useCallback((i: number, at = 0) => {
    resumeAt.current = at
    setCur(i)
    setTime(at)
  }, [])

  // Load and start the chosen track.
  useEffect(() => {
    const a = audio.current
    if (cur === null || !a) return
    const t = tracks[cur]
    a.src = `${mediaBase}/${sectionFile(t.week, t.section)}`
    a.currentTime = resumeAt.current
    a.play().catch(() => setPlaying(false))
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: `Week ${t.week} · Section ${t.section}`,
        artist: t.title,
        album: 'Say It Back',
      })
    }
  }, [cur, mediaBase, tracks])

  const next = useCallback(() => {
    resumeAt.current = 0
    setCur((c) => (c === null ? 0 : Math.min(c + 1, tracks.length - 1)))
  }, [tracks.length])
  const prev = useCallback(() => {
    const a = audio.current
    // Like every music app: first press restarts the track, a quick second press goes back.
    if (a && a.currentTime > 3) {
      a.currentTime = 0
      return
    }
    resumeAt.current = 0
    setCur((c) => (c === null || c === 0 ? 0 : c - 1))
  }, [])

  const toggle = useCallback(() => {
    const a = audio.current
    if (!a) return
    if (cur === null) return play(saved?.i ?? 0, saved?.t ?? 0)
    if (a.paused) a.play().catch(() => {})
    else a.pause()
  }, [cur, play, saved])

  // Lock-screen and car controls.
  useEffect(() => {
    if (!('mediaSession' in navigator)) return
    const ms = navigator.mediaSession
    ms.setActionHandler('play', () => audio.current?.play())
    ms.setActionHandler('pause', () => audio.current?.pause())
    ms.setActionHandler('nexttrack', next)
    ms.setActionHandler('previoustrack', prev)
    return () => {
      ;(['play', 'pause', 'nexttrack', 'previoustrack'] as MediaSessionAction[]).forEach((x) => ms.setActionHandler(x, null))
    }
  }, [next, prev])

  function onTime() {
    const a = audio.current
    if (!a || cur === null) return
    setTime(a.currentTime)
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({ i: cur, t: Math.floor(a.currentTime) }))
    } catch {}
  }

  function onEnded() {
    if (cur !== null && cur + 1 < tracks.length) next()
    else setPlaying(false)
  }

  const now = cur !== null ? tracks[cur] : null
  let flat = 0

  return (
    <>
      <audio
        ref={audio}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={onTime}
        onEnded={onEnded}
      />

      {/* HERO */}
      <section className="text-center px-6 pt-14 pb-16" style={{ backgroundColor: INK }}>
        <p className="mb-6 inline-block rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.08)', padding: '0.45rem 1.3rem', fontSize: '1.02rem', color: 'var(--yellow)', fontWeight: 600 }}>
          🎧 Say It Back · 56 recordings
        </p>
        <h1 style={{ fontSize: 'clamp(2.4rem, 7vw, 3.6rem)', fontWeight: 700, color: '#fff', lineHeight: 1.15 }}>Welcome in</h1>
        <p className={handClass} style={{ fontSize: 'clamp(1.9rem, 5.5vw, 2.6rem)', color: 'var(--yellow)', marginTop: '1.4rem', lineHeight: 1.25 }}>
          Press play.
          <br />
          Say it back out loud.
        </p>
        <div className="mt-8" style={{ color: 'rgba(255,255,255,0.88)', fontSize: '1.2rem', fontWeight: 300, lineHeight: 2 }}>
          <p>One week at a time.</p>
          <p>10 minutes, up to 3 times a week.</p>
          <p style={{ fontWeight: 600, color: '#fff' }}>No big goals.</p>
        </div>
        {saved && cur === null && (
          <button
            onClick={() => play(saved.i, saved.t)}
            className="mt-10 rounded-full transition-transform hover:-translate-y-0.5"
            style={{ backgroundColor: 'var(--yellow)', color: INK, padding: '1rem 2.4rem', fontSize: '1.15rem', fontWeight: 700, boxShadow: '0 14px 32px rgba(0,0,0,0.25)' }}
          >
            ▶ Continue: Week {tracks[saved.i].week} · Section {tracks[saved.i].section}
          </button>
        )}
      </section>

      {/* WEEKS */}
      <section className="px-4 sm:px-6 py-12" style={{ paddingBottom: now ? '9rem' : '3rem' }}>
        <div className="mx-auto space-y-6" style={{ maxWidth: 720 }}>
          {SIB_WEEKS.map((w) => (
            <div key={w.n} className="rounded-3xl" style={{ backgroundColor: '#fff', border: '1px solid rgba(27,48,84,0.10)', boxShadow: '0 14px 32px rgba(27,48,84,0.05)', padding: '1.6rem 1.3rem' }}>
              <div className="text-center mb-5">
                <span className="inline-block rounded-full mb-2" style={{ backgroundColor: 'var(--yellow)', color: INK, padding: '0.25rem 1rem', fontWeight: 700, fontSize: '0.95rem' }}>
                  Week {w.n}
                </span>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: INK, lineHeight: 1.35 }}>{w.title}</h2>
              </div>

              <div className="space-y-2">
                {w.sections.map((dur, si) => {
                  const i = flat++
                  const active = cur === i
                  return (
                    <button
                      key={si}
                      onClick={() => (active ? toggle() : play(i))}
                      className="w-full grid items-center rounded-2xl text-left transition-colors"
                      style={{
                        gridTemplateColumns: '2.6rem 1fr auto',
                        gap: '0.9rem',
                        padding: '0.75rem 1rem',
                        backgroundColor: active ? '#FFF5D6' : '#F7F8FA',
                        border: active ? '2px solid var(--yellow)' : '2px solid transparent',
                      }}
                    >
                      <span className="flex items-center justify-center rounded-full" style={{ width: '2.6rem', height: '2.6rem', backgroundColor: active ? 'var(--yellow)' : INK, color: active ? INK : '#fff', fontSize: '0.95rem' }}>
                        {active && playing ? '❚❚' : '▶'}
                      </span>
                      <span style={{ fontSize: '1.15rem', fontWeight: 600, color: INK }}>Section {si + 1}</span>
                      <span style={{ fontSize: '1rem', color: SOFT, fontVariantNumeric: 'tabular-nums' }}>{fmt(dur)}</span>
                    </button>
                  )
                })}
              </div>

              <div className="text-center mt-5">
                <a
                  href={`${mediaBase}/${wordsFile(w.n)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full hover:opacity-80 transition-opacity"
                  style={{ border: `1.5px solid ${INK}`, color: INK, padding: '0.5rem 1.3rem', fontWeight: 600, fontSize: '1rem' }}
                >
                  📄 Read it while listening
                </a>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center mt-12" style={{ color: BODY, fontSize: '1rem' }}>
          Questions? sasha@freeandclearenglish.com
        </p>
      </section>

      {/* STICKY PLAYER */}
      {now && (
        <div className="fixed left-0 right-0 bottom-0 px-4 pb-4" style={{ zIndex: 50 }}>
          <div className="mx-auto rounded-3xl" style={{ maxWidth: 720, backgroundColor: INK, boxShadow: '0 -8px 32px rgba(27,48,84,0.25)', padding: '0.9rem 1.2rem 1rem' }}>
            <div className="grid items-center" style={{ gridTemplateColumns: '1fr auto', gap: '0.8rem' }}>
              <div className="min-w-0">
                <p style={{ color: 'var(--yellow)', fontWeight: 700, fontSize: '1rem' }}>
                  Week {now.week} · Section {now.section}
                </p>
                <p className="truncate" style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem' }}>{now.title}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={prev} aria-label="Previous" className="rounded-full flex items-center justify-center" style={{ width: 44, height: 44, color: '#fff', fontSize: '1.1rem' }}>⏮</button>
                <button onClick={toggle} aria-label={playing ? 'Pause' : 'Play'} className="rounded-full flex items-center justify-center" style={{ width: 52, height: 52, backgroundColor: 'var(--yellow)', color: INK, fontSize: '1.1rem', fontWeight: 700 }}>
                  {playing ? '❚❚' : '▶'}
                </button>
                <button onClick={next} aria-label="Next" className="rounded-full flex items-center justify-center" style={{ width: 44, height: 44, color: '#fff', fontSize: '1.1rem' }}>⏭</button>
              </div>
            </div>
            <div className="grid items-center mt-2" style={{ gridTemplateColumns: '2.8rem 1fr 2.8rem', gap: '0.6rem' }}>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontVariantNumeric: 'tabular-nums' }}>{fmt(time)}</span>
              <input
                type="range"
                min={0}
                max={now.dur}
                step={1}
                value={Math.min(time, now.dur)}
                onChange={(e) => {
                  const a = audio.current
                  if (a) a.currentTime = Number(e.target.value)
                  setTime(Number(e.target.value))
                }}
                aria-label="Position"
                style={{ width: '100%', accentColor: '#F5C842' }}
              />
              <span className="text-right" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontVariantNumeric: 'tabular-nums' }}>{fmt(now.dur)}</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
