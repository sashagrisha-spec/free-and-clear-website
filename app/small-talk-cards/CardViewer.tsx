'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import Image from 'next/image'

const TOTAL = 12
const INK = '#1B3054'
const cardSrc = (i: number) => `/images/small-talk-cards/card-${String(i + 1).padStart(2, '0')}.png`

// `finale` is shown only under the last card.
export default function CardViewer({ finale }: { finale?: ReactNode }) {
  const [index, setIndex] = useState(0)
  const touchX = useRef<number | null>(null)

  const go = (step: number) => setIndex(i => Math.min(TOTAL - 1, Math.max(0, i + step)))

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const arrow = (step: number, label: string, disabled: boolean) => (
    <button
      type="button"
      onClick={() => go(step)}
      disabled={disabled}
      aria-label={label}
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-2xl font-bold transition-opacity disabled:opacity-25"
      style={{ backgroundColor: '#F5C842', color: INK }}
    >
      {step < 0 ? '‹' : '›'}
    </button>
  )

  return (
    <div>
      <div
        className="relative mx-auto w-full overflow-hidden rounded-3xl shadow-lg"
        style={{ aspectRatio: '1086 / 1448', maxWidth: 480 }}
        onTouchStart={e => { touchX.current = e.touches[0].clientX }}
        onTouchEnd={e => {
          if (touchX.current === null) return
          const dx = e.changedTouches[0].clientX - touchX.current
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
          touchX.current = null
        }}
      >
        <Image
          key={index}
          src={cardSrc(index)}
          alt={`Card ${index + 1} of ${TOTAL}`}
          fill
          sizes="(max-width: 520px) 100vw, 480px"
          priority={index === 0}
          className="object-contain"
        />
      </div>

      {/* Preload the next card so flipping feels instant. */}
      {index < TOTAL - 1 && (
        <div className="hidden" aria-hidden="true">
          <Image src={cardSrc(index + 1)} alt="" width={480} height={640} sizes="480px" />
        </div>
      )}

      <div className="mt-6 flex items-center justify-center gap-8">
        {arrow(-1, 'Previous card', index === 0)}
        <span className="w-28 text-lg font-semibold">
          {index + 1} out of {TOTAL}
        </span>
        {arrow(1, 'Next card', index === TOTAL - 1)}
      </div>

      {index === TOTAL - 1 && finale}
    </div>
  )
}
