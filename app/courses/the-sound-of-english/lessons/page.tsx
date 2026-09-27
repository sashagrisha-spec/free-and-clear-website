import CoursePlayer from '@/components/CoursePlayer'
import { CHAPTERS, COURSE_NAME } from '@/lib/sound-of-english-lessons'
import { verifyAccess } from '@/lib/access'

const COURSE_ID = 'the-sound-of-english'

export const metadata = {
  title: `${COURSE_NAME} - Lessons`,
  robots: { index: false, follow: false }, // the gated area is never indexed
}

// Access comes from the personal link in the buyer's email: ?e=<email>&t=<hmac>.
// No login, no password, no database. See lib/access.ts.
export default async function LessonsPage({
  searchParams,
}: {
  searchParams: Promise<{ e?: string; t?: string }>
}) {
  const { e = '', t = '' } = await searchParams

  if (!verifyAccess(COURSE_ID, e, t)) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: 'var(--navy)' }} dir="rtl">
        <div className="text-center max-w-sm">
          <p className="text-4xl mb-4">🔒</p>
          <h1 className="text-xl font-bold text-white mb-3">הקורס נעול</h1>
          <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.8 }}>
            כדי להיכנס, השתמשו בקישור האישי שקיבלתם במייל אחרי הרכישה.
          </p>
          <a href="/the-sound-of-english" className="text-sm underline" style={{ color: 'var(--yellow)' }}>
            לעמוד הקורס
          </a>
          <p className="text-xs mt-6" style={{ color: 'rgba(255,255,255,0.4)' }}>
            לא מוצאים את המייל? כתבו לנו: sasha@freeandclearenglish.com
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen px-5 py-10 sm:py-14" style={{ backgroundColor: 'var(--navy)' }} dir="ltr">
      <CoursePlayer courseName={COURSE_NAME} chapters={CHAPTERS} />
    </main>
  )
}
