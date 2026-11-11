'use client'
import { useState } from 'react'
import type { HomeCopy } from '@/lib/home-content'

// Plain <a> tags on purpose: crossing between English and Hebrew must be a full
// page load, otherwise the root layout keeps the old lang/dir until a refresh.
export default function HomeNav({ t }: { t: HomeCopy }) {
  const [open, setOpen] = useState(false)
  const links = [
    { href: `${t.base}#about`, label: t.nav.about },
    { href: `${t.base}#services`, label: t.nav.services },
    { href: `${t.base}#testimonials`, label: t.nav.testimonials },
    { href: '/blog', label: t.nav.blog },
  ]

  return (
    <nav className="fh-nav">
      <div className="fh-wrap fh-nav-row">
        <a href={t.base || '/'} className="fh-logo">Free &amp; Clear English</a>

        <div className="fh-nav-links">
          {links.map(l => <a key={l.href} href={l.href}>{l.label}</a>)}
        </div>

        <div className="fh-nav-end">
          <a href={t.otherLangHref} className="fh-lang" lang={t.lang === 'en' ? 'he' : 'en'}>
            {t.otherLangLabel}
          </a>
          <a href={`${t.base}#contact`} className="fh-btn fh-btn-yellow fh-btn-sm fh-hide-sm">{t.nav.cta}</a>
          <button className="fh-burger" onClick={() => setOpen(!open)} aria-label="Menu">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              {open
                ? <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="fh-wrap fh-nav-mobile">
          {links.map(l => <a key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>)}
          <a href={`${t.base}#contact`} className="fh-btn fh-btn-yellow" onClick={() => setOpen(false)}>{t.nav.cta}</a>
        </div>
      )}
    </nav>
  )
}
