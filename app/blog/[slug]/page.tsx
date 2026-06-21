import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { blogPosts, getPostBySlug, getAllSlugs } from '@/lib/blog-posts'

export function generateStaticParams() {
  return getAllSlugs().map(slug => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}

  return {
    title: `${post.title} | Free & Clear English`,
    description: post.excerpt,
    keywords: post.keywords.join(', '),
    alternates: {
      canonical: `https://www.freeandclearenglish.com/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://www.freeandclearenglish.com/blog/${post.slug}`,
      siteName: 'Free & Clear English',
      type: 'article',
      publishedTime: post.publishedAt,
      authors: ['Sasha Daniel'],
    },
  }
}

function formatDate(iso: string, lang: 'en' | 'he') {
  const date = new Date(iso)
  if (lang === 'he') {
    return date.toLocaleDateString('he-IL', { year: 'numeric', month: 'long', day: 'numeric' })
  }
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const isHe = post.lang === 'he'

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    author: {
      '@type': 'Person',
      name: 'Sasha Daniel',
      url: 'https://www.freeandclearenglish.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Free & Clear English',
      url: 'https://www.freeandclearenglish.com',
    },
    url: `https://www.freeandclearenglish.com/blog/${post.slug}`,
    keywords: post.keywords.join(', '),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Nav />

      {/* Hero */}
      <section style={{ backgroundColor: 'var(--navy)' }} className="pt-32 pb-14">
        <div className="max-w-3xl mx-auto px-6" dir={isHe ? 'rtl' : 'ltr'}>
          <div className="flex items-center gap-3 mb-5">
            <Link href="/blog" className="text-white/50 hover:text-white text-sm transition-colors">
              {isHe ? '← הבלוג' : '← Blog'}
            </Link>
            <span className="text-white/30">·</span>
            <span
              className="text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full"
              style={{ backgroundColor: 'rgba(245,200,66,0.15)', color: 'var(--yellow)' }}
            >
              {post.category}
            </span>
          </div>
          <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-5">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-white/50 text-sm">
            <span>Sasha Daniel</span>
            <span>·</span>
            <span>{formatDate(post.publishedAt, post.lang)}</span>
            <span>·</span>
            <span>{post.readingTime} {isHe ? 'דקות קריאה' : 'min read'}</span>
          </div>
        </div>
      </section>

      {/* Article body */}
      <article className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6" dir={isHe ? 'rtl' : 'ltr'}>
          <div
            className="blog-body"
            dangerouslySetInnerHTML={{ __html: post.body }}
          />
        </div>
      </article>

      {/* Author bio */}
      <section style={{ backgroundColor: 'var(--light-grey)' }} className="py-12">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white rounded-2xl p-7 flex gap-5 items-start" style={{ border: '1px solid #E5E7EB' }}>
            <div
              className="w-14 h-14 rounded-full flex-shrink-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/images/sasha-1.jpg')" }}
            />
            <div>
              <p className="font-bold text-base mb-1" style={{ color: 'var(--navy)' }}>Sasha Daniel</p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--mid-grey)' }}>
                English pronunciation and fluency coach for Hebrew-speaking professionals. 8 years, 500+ clients across Israel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related posts */}
      {(() => {
        const related = blogPosts
          .filter(p => p.slug !== post.slug && p.lang === post.lang)
          .slice(0, 2)
        if (related.length === 0) return null
        return (
          <section className="py-16" style={{ backgroundColor: 'var(--light-grey)' }}>
            <div className="max-w-3xl mx-auto px-6">
              <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--navy)' }}>
                {isHe ? 'עוד מאמרים' : 'More Articles'}
              </h2>
              <div className="grid sm:grid-cols-2 gap-5">
                {related.map(rel => (
                  <Link
                    key={rel.slug}
                    href={`/blog/${rel.slug}`}
                    className="bg-white rounded-xl p-6 hover:shadow-md transition-shadow"
                    style={{ border: '1px solid #E5E7EB' }}
                    dir={rel.lang === 'he' ? 'rtl' : 'ltr'}
                  >
                    <p className="font-bold text-sm leading-snug mb-2" style={{ color: 'var(--navy)' }}>
                      {rel.title}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--mid-grey)' }}>
                      {rel.lang === 'he' ? 'קרא עוד →' : 'Read more →'}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )
      })()}

      {/* CTA */}
      <section style={{ backgroundColor: 'var(--navy)' }} className="py-16">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            {isHe ? 'רוצה להישמע כמו עצמך באנגלית?' : 'Ready to sound like yourself in English?'}
          </h2>
          <p className="text-white/70 mb-7">
            {isHe
              ? 'בואו נדבר - שיחת היכרות קצרה בחינם'
              : "Let's have a short call to understand where you are and where you want to be."}
          </p>
          <Link
            href="/#contact"
            style={{ backgroundColor: 'var(--yellow)', color: 'var(--navy)' }}
            className="inline-block font-bold px-8 py-4 rounded hover:opacity-90 transition-opacity"
          >
            {isHe ? 'צרו קשר' : 'Get in Touch'}
          </Link>
        </div>
      </section>

      <Footer />
    </>
  )
}
