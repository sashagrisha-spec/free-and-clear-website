'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <nav style={{ backgroundColor: 'var(--navy)' }} className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-white font-bold text-lg tracking-tight">
          Free &amp; Clear English
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/#about" className="text-white/80 hover:text-white text-sm font-medium transition-colors">About</Link>
          <Link href="/#services" className="text-white/80 hover:text-white text-sm font-medium transition-colors">Services</Link>
          <Link href="/#testimonials" className="text-white/80 hover:text-white text-sm font-medium transition-colors">Testimonials</Link>
          <Link href="/blog" className="text-white/80 hover:text-white text-sm font-medium transition-colors">Blog</Link>
          <Link href="/#contact" style={{ backgroundColor: 'var(--yellow)', color: 'var(--navy)' }} className="text-sm font-bold px-5 py-2 rounded hover:opacity-90 transition-opacity">
            Let&apos;s Talk
          </Link>
        </div>

        {/* Mobile burger */}
        <button className="md:hidden text-white" onClick={() => setOpen(!open)} aria-label="Menu">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div style={{ backgroundColor: 'var(--navy)' }} className="md:hidden px-6 pb-6 flex flex-col gap-4">
          <Link href="/#about" className="text-white/80 text-sm font-medium" onClick={() => setOpen(false)}>About</Link>
          <Link href="/#services" className="text-white/80 text-sm font-medium" onClick={() => setOpen(false)}>Services</Link>
          <Link href="/#testimonials" className="text-white/80 text-sm font-medium" onClick={() => setOpen(false)}>Testimonials</Link>
          <Link href="/blog" className="text-white/80 text-sm font-medium" onClick={() => setOpen(false)}>Blog</Link>
          <Link href="/#contact" style={{ backgroundColor: 'var(--yellow)', color: 'var(--navy)' }} className="text-sm font-bold px-5 py-2 rounded text-center" onClick={() => setOpen(false)}>
            Let&apos;s Talk
          </Link>
        </div>
      )}
    </nav>
  )
}
