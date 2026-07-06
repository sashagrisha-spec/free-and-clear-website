import { blogPosts } from '@/lib/blog-posts'

export type PageLang = 'he' | 'en'

// Route prefixes whose content is written in Hebrew.
// To add a new Hebrew page later, just add its path prefix here.
const HEBREW_PREFIXES = [
  '/anglit-iski',
  '/coach-anglit',
  '/hagaya-anglit',
  '/practice-pods',
  '/speak-like-yourself', // also covers /speak-like-yourself-ig and their /success pages
]

// Decide the real language of a page from its path.
// Blog posts are data-driven: each post declares its own `lang`.
export function getLangForPath(pathname: string | null | undefined): PageLang {
  if (!pathname) return 'en'

  const blogMatch = pathname.match(/^\/blog\/([^/]+)\/?$/)
  if (blogMatch) {
    const post = blogPosts.find(p => p.slug === blogMatch[1])
    return post?.lang === 'he' ? 'he' : 'en'
  }

  if (HEBREW_PREFIXES.some(prefix => pathname.startsWith(prefix))) {
    return 'he'
  }

  return 'en'
}
