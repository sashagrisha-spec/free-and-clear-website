import type { DemoChapter } from '@/components/CoursePlayer'

// Small talk קטן עליי, in the same order as the course in Schooler
// (2026-10-26). The Vimeo videos are the same ones Schooler embeds: they are
// "Embed only, embeddable anywhere", so both places play them unchanged.
// Each Small talk lesson carries its practice sheet from /public/small-talk-pdf.
export const COURSE_NAME = 'סמול טוק קטן עליי'

export const CHAPTERS: DemoChapter[] = [
  {
    title: 'מפת הדרכים של סשה',
    lessons: [
      { title: 'מבוא', vimeoId: '1130222782' },
      { title: 'שיעור 1 - הבסיס', vimeoId: '1130211542' },
      { title: 'שיעור 2 - אקטיבי מול פאסיבי', vimeoId: '1130218074' },
      { title: 'שיעור 3 - תרגול יומיומי', vimeoId: '1130235012' },
      { title: 'שיעור 4 - ללמוד בהנאה', vimeoId: '1130204760' },
      { title: 'שיעור 5 - בעיית ההגייה', vimeoId: '1130200889' },
      { title: 'שיעור 6 - סיכום', vimeoId: '1130215535' },
    ],
  },
  {
    title: 'סמול טוק',
    lessons: [
      { title: 'שיעור 1 - איך שוברים את הקרח', vimeoId: '1127218893', pdf: '/small-talk-pdf/01-breaking-the-ice.pdf' },
      { title: 'שיעור 2 - שאלות פתוחות מול שאלות סגורות', vimeoId: '1127824629', pdf: '/small-talk-pdf/02-open-vs-closed.pdf' },
      { title: 'שיעור 3 - איך להגיב נכון', vimeoId: '1127244019', pdf: '/small-talk-pdf/03-respond-naturally.pdf' },
      { title: 'שיעור 4 - איך להחמיא מבלי להישמע מזויף', vimeoId: '1127825286', pdf: '/small-talk-pdf/04-natural-compliments.pdf' },
      { title: 'שיעור 5 - נושאים בטוחים וכאלה שפחות', vimeoId: '1127828129', pdf: '/small-talk-pdf/05-safe-and-sensitive-topics.pdf' },
      { title: 'שיעור 6 - סמול טוק במצבים מקצועיים', vimeoId: '1127836014', pdf: '/small-talk-pdf/06-professional-settings.pdf' },
      { title: 'שיעור 7 - מה עושים כשנתקעים', vimeoId: '1127838694', pdf: '/small-talk-pdf/07-when-you-get-stuck.pdf' },
      { title: 'שיעור 8 - איך לסיים שיחה באנגלית', vimeoId: '1127840692', pdf: '/small-talk-pdf/08-ending-conversations.pdf' },
    ],
  },
  {
    title: 'בונוסים',
    lessons: [
      { title: 'בונוס 1 - טעויות נפוצות של ישראלים', vimeoId: '1130498838' },
      { title: 'בונוס 2 - שפת גוף, נשימה ומיינדפולנס', vimeoId: '1130501662' },
    ],
  },
]
