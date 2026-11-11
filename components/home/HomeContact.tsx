'use client'
import { useState } from 'react'
import type { HomeCopy } from '@/lib/home-content'

// Same /api/contact call as the old ContactCTA, with the labels per language.
export default function HomeContact({ t }: { t: HomeCopy['contact'] }) {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setLoading(false)
    if (!res.ok) {
      setError(t.error)
      return
    }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="fh-form fh-form-done">
        <p className="fh-done-mark">✓</p>
        <p className="fh-done-title">{t.doneTitle}</p>
        <p className="fh-muted">{t.doneSub}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="fh-form">
      <div className="fh-form-row">
        <label>
          <span>{t.name}</span>
          <input type="text" required value={form.name} placeholder={t.namePh}
            onChange={e => setForm({ ...form, name: e.target.value })} />
        </label>
        <label>
          <span>{t.email}</span>
          <input type="email" required dir="ltr" value={form.email} placeholder="yoni@company.com"
            onChange={e => setForm({ ...form, email: e.target.value })} />
        </label>
      </div>
      <label>
        <span>{t.message}</span>
        <textarea required rows={4} value={form.message} placeholder={t.messagePh}
          onChange={e => setForm({ ...form, message: e.target.value })} />
      </label>
      {error && <p className="fh-error">{error}</p>}
      <button type="submit" disabled={loading} className="fh-btn fh-btn-navy fh-btn-block">
        {loading ? t.sending : t.send}
      </button>
    </form>
  )
}
