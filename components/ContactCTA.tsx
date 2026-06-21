'use client'
import { useState } from 'react'

export default function ContactCTA() {
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
      const data = await res.json()
      setError(data.error || 'Something went wrong. Please try again.')
      return
    }
    setSubmitted(true)
  }

  return (
    <section id="contact" style={{ backgroundColor: 'var(--navy)' }} className="py-24">
      <div className="max-w-3xl mx-auto px-6 text-center">

        <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--yellow)' }}>
          Ready?
        </p>
        <h2 className="text-4xl font-bold text-white mb-4">
          Let&apos;s figure out<br />
          <span style={{ color: 'var(--yellow)' }}>what&apos;s holding you back.</span>
        </h2>
        <p className="text-white/70 text-lg mb-12 max-w-md mx-auto">
          Drop me a message. No pressure, no scripts - just a real conversation
          about where you are and where you want to be.
        </p>

        {submitted ? (
          <div className="rounded-2xl p-10" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
            <p style={{ color: 'var(--yellow)' }} className="text-5xl mb-4">✓</p>
            <p className="text-white text-xl font-bold mb-2">Got it. I&apos;ll be in touch soon.</p>
            <p className="text-white/60">Usually within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="rounded-2xl p-8 text-left" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Your name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/30 border border-white/10 focus:outline-none focus:border-yellow-400 transition-colors"
                  placeholder="Yoni Cohen"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/30 border border-white/10 focus:outline-none focus:border-yellow-400 transition-colors"
                  placeholder="yoni@company.com"
                />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-white/70 text-sm font-medium mb-2">Tell me a bit about where you&apos;re at</label>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/30 border border-white/10 focus:outline-none focus:border-yellow-400 transition-colors resize-none"
                placeholder="I've been speaking English for years but in meetings I still feel like I'm leaving something on the table..."
              />
            </div>
            {error && (
              <p className="text-red-400 text-sm mb-4">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: 'var(--yellow)', color: 'var(--navy)' }}
              className="w-full font-bold py-4 rounded-lg hover:opacity-90 transition-opacity text-base disabled:opacity-60"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        )}

      </div>
    </section>
  )
}
