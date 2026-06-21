import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { blogPosts } from '@/lib/blog-posts'

export const metadata: Metadata = {
  title: 'Blog | Free & Clear English — English Tips for Hebrew Speakers',
  description: 'Articles on English pronunciation, fluency, confidence, and business communication — written for Hebrew-speaking professionals. By Sasha Daniel.',
  keywords: 'English tips Hebrew speakers, English pronunciation blog, אנגלית לדוברי עברית, English coach Israel blog',
  alternates: {
    canonical: 'https://www.freeandclearenglish.com/blog',
  },
  openGraph: {
    title: 'Blog | Free & Clear English',
    description: 'English pronunciation, fluency, and confidence — for Hebrew-speaking professionals.',
    url: 'https://www.freeandclearenglish.com/blog',
    siteName: 'Free & Clear English',
    type: 'website',
  },
}

const categoryColors: Record<string, string> = {
  Confidence: '#F5C842',
  Pronunciation: '#F5C842',
  'Business English': '#F5C842',
  'טיפים': '#F5C842',
  Tips: '#F5C842',
  Mindset: '#F5C842',
}

function formatDate(iso: string, lang: 'en' | 'he') {
  const date = new Date(iso)
  if (lang === 'he') {
    return date.toLocaleDateString('he-IL', { year: 'numeric', month: 'long', day: 'numeric' })
  }
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function BlogIndex() {
  const sorted = [...blogPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )

  return (
    <>
      <Nav />

      {/* Hero */}
      <section style={{ backgroundColor: 'var(--navy)' }} className="pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: 'var(--yellow)' }}>
            Free &amp; Clear English
          </p>
          <h1 className="text-white text-4xl md:text-5xl font-bold leading-tight mb-5">
            The Blog
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            Practical articles on English pronunciation, fluency, and confidence — written for Hebrew-speaking professionals.
          </p>
        </div>
      </section>

      {/* Posts grid */}
      <section className="py-20" style={{ backgroundColor: 'var(--light-grey)' }}>
        <div className="max-w-4xl mx-auto px-6">
          {sorted.length === 0 ? (
            <p className="text-center" style={{ color: 'var(--mid-grey)' }}>No posts yet. Check back soon.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              {sorted.map(post => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden flex flex-col hover:shadow-md transition-shadow"
                  style={{ border: '1px solid #E5E7EB' }}
                >
                  {/* Top color bar */}
                  <div style={{ backgroundColor: 'var(--navy)', height: '4px' }} />

                  <div className="p-7 flex flex-col flex-1" dir={post.lang === 'he' ? 'rtl' : 'ltr'}>
                    <div className="flex items-center gap-3 mb-4">
                      <span
                        className="text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full"
                        style={{ backgroundColor: 'var(--navy)', color: 'var(--yellow)' }}
                      >
                        {post.category}
                      </span>
                      <span className="text-xs" style={{ color: 'var(--mid-grey)' }}>
                        {post.readingTime} min read
                      </span>
                    </div>

                    <h2
                      className="text-lg font-bold leading-snug mb-3 group-hover:opacity-80 transition-opacity"
                      style={{ color: 'var(--navy)' }}
                    >
                      {post.title}
                    </h2>

                    <p className="text-sm leading-relaxed flex-1 mb-4" style={{ color: 'var(--mid-grey)' }}>
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs" style={{ color: 'var(--mid-grey)' }}>
                        {formatDate(post.publishedAt, post.lang)}
                      </span>
                      <span
                        className="text-sm font-semibold"
                        style={{ color: 'var(--navy)' }}
                      >
                        {post.lang === 'he' ? 'קרא עוד ←' : 'Read more →'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: 'var(--navy)' }} className="py-16">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            Ready to sound like yourself in English?
          </h2>
          <p className="text-white/70 mb-7">
            Let&apos;s have a short call to understand where you are and where you want to be.
          </p>
          <Link
            href="/#contact"
            style={{ backgroundColor: 'var(--yellow)', color: 'var(--navy)' }}
            className="inline-block font-bold px-8 py-4 rounded hover:opacity-90 transition-opacity"
          >
            Get in Touch
          </Link>
        </div>
      </section>

      <Footer />
    </>
  )
}
