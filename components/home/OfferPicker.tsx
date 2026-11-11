'use client'

import { useState, type ReactNode } from 'react'
import Image from 'next/image'

// Two big objects (inspired by danad.co.il's "what I offer"): the mugs open
// personal coaching, the laptop opens the digital courses. Nothing below them
// shows until one is clicked, so the page stays short. One open at a time.
export type Offer = { id: string; label: string; img: string; w: number; h: number; panel: ReactNode }

export default function OfferPicker({ offers, hint }: { offers: Offer[]; hint: string }) {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <div className="fh-offers">
      <div className="fh-offer-row">
        {offers.map(o => {
          const isOpen = open === o.id
          return (
            <button
              key={o.id}
              type="button"
              className={`fh-offer ${isOpen ? 'is-open' : ''}`}
              aria-expanded={isOpen}
              aria-controls={`offer-${o.id}`}
              onClick={() => setOpen(isOpen ? null : o.id)}
            >
              <span className="fh-offer-img">
                <Image src={o.img} alt="" width={o.w} height={o.h} sizes="(max-width: 700px) 42vw, 360px" />
              </span>
              <span className="fh-offer-label">{o.label}</span>
              <span className="fh-offer-chev" aria-hidden="true">⌄</span>
            </button>
          )
        })}
      </div>
      {!open && <p className="fh-offer-hint">{hint}</p>}
      {offers.map(o => (
        <div key={o.id} id={`offer-${o.id}`} className="fh-offer-panel" hidden={open !== o.id}>
          {o.panel}
        </div>
      ))}
    </div>
  )
}
