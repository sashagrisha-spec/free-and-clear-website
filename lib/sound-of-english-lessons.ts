import type { DemoChapter } from '@/components/CoursePlayer'

// The Sounds of English, in Sasha's order (2026-09-17). Each entry is one Vimeo
// video; explanations and practices are separate lessons. Practice lessons also
// carry their printable sheet from /public/practice-pdf.
export const COURSE_NAME = 'The Sound of English'

export const CHAPTERS: DemoChapter[] = [
  {
    title: 'Intro',
    lessons: [
      { title: 'Intro', vimeoId: '1225692757' },
      { title: 'Shiur Lashon', vimeoId: '1225694094' },
    ],
  },
  {
    title: 'Consonants',
    lessons: [
      { title: 'Consonants', vimeoId: '1225695969' },
      { title: 'TH', vimeoId: '1226974351' },
      { title: 'TH practice', vimeoId: '1226981871', pdf: '/practice-pdf/01-th.pdf' },
      { title: 'The R', vimeoId: '1226974777' },
      { title: 'The soft R', vimeoId: '1226974225' },
      { title: 'The R sounds practice', vimeoId: '1226980882', pdf: '/practice-pdf/02-r.pdf' },
      { title: 'IR', vimeoId: '1226973763' },
      { title: 'IR sound practice', vimeoId: '1226981370', pdf: '/practice-pdf/03-ir.pdf' },
      { title: 'TR+DR', vimeoId: '1226975103' },
      { title: 'TR+DR practice', vimeoId: '1226980883', pdf: '/practice-pdf/04-tr-dr.pdf' },
      { title: 'The L', vimeoId: '1226974585' },
      { title: 'The L practice', vimeoId: '1226981457', pdf: '/practice-pdf/05-l.pdf' },
      { title: 'The Flapped T', vimeoId: '1226973357' },
      { title: 'Flapped T practice', vimeoId: '1226981182', pdf: '/practice-pdf/06-flapped-t.pdf' },
    ],
  },
  {
    title: 'Vowels',
    lessons: [
      { title: 'Vowels - EE & i', vimeoId: '1227663263' },
      { title: 'EE & i practice', vimeoId: '1226981823', pdf: '/practice-pdf/07-ee-i.pdf' },
      { title: 'The schwa', vimeoId: '1226974993' },
      { title: 'The schwa practice', vimeoId: '1227673550', pdf: '/practice-pdf/08-schwa.pdf' },
      { title: 'The U & AA', vimeoId: '1226973204' },
      { title: 'U & AA practice', vimeoId: '1226981688', pdf: '/practice-pdf/09-uh-ah.pdf' },
      { title: 'AE & E', vimeoId: '1226973232' },
      { title: 'AE & E practice', vimeoId: '1226981625', pdf: '/practice-pdf/10-ae-e.pdf' },
      { title: 'AE/U/AA', vimeoId: '1226973162' },
      { title: 'AE/U/AA practice', vimeoId: '1226981544', pdf: '/practice-pdf/11-three-a.pdf' },
      { title: 'OO/OO', vimeoId: '1226973775' },
      { title: 'OO/OO practice', vimeoId: '1226981452', pdf: '/practice-pdf/14-oo.pdf' },
      { title: 'OU/Ah', vimeoId: '1226974136' },
      { title: 'OU/Ah practice', vimeoId: '1226981291', pdf: '/practice-pdf/13-ou-ah.pdf', pdf2: '/practice-pdf/12-ou.pdf' },
    ],
  },
  {
    title: 'Ending',
    lessons: [{ title: 'Ending', vimeoId: '1226973327' }],
  },
  {
    title: 'Bonuses',
    lessons: [
      { title: 'Silent letters', vimeoId: '1226980885', pdf: '/practice-pdf/15-silent-letters.pdf' },
      { title: 'V/W practice', vimeoId: '1226981178', pdf: '/practice-pdf/16-v-w.pdf' },
      { title: 'ED ending', vimeoId: '1226980884', pdf: '/practice-pdf/17-ed-endings.pdf' },
    ],
  },
]
