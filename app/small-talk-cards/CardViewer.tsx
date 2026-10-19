'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import Image from 'next/image'

const IMAGE_CARDS = 12
// The 12 image cards plus one closing card built in code.
const TOTAL = IMAGE_CARDS + 1
const INK = '#1B3054'
const cardSrc = (i: number) => `/images/small-talk-cards/card-${String(i + 1).padStart(2, '0')}.png`

// `finalCard` is shown as the last card, after the 12 images.
export default function CardViewer({ finalCard }: { finalCard: ReactNode }) {
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
        {index < IMAGE_CARDS ? (
          <Image
            key={index}
            src={cardSrc(index)}
            alt={`Card ${index + 1} of ${TOTAL}`}
            fill
            sizes="(max-width: 520px) 100vw, 480px"
            priority={index === 0}
            className="object-contain"
          />
        ) : (
          finalCard
        )}
      </div>

      {/* Preload the next card so flipping feels instant. */}
      {index < IMAGE_CARDS - 1 && (
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

    </div>
  )
}
