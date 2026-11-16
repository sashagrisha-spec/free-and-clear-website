import type { DemoChapter } from '@/components/CoursePlayer'

// דברו בשטף וביטחון, in the same order as the course in Schooler (2026-11-15).
// The whole course is in English, left to right (titles exactly as in Schooler).
// vimeoId is empty until Sasha sends the Vimeo links; an empty id shows
// "the video is coming soon" in the player instead of a broken embed.
export const COURSE_NAME = 'Speak English fluently & confidently'

export const CHAPTERS: DemoChapter[] = [
  {
    title: 'Welcome!',
    lessons: [
      { title: 'What to expect', vimeoId: '1066274938' },
      { title: 'Mindset & goals', vimeoId: '1066274954' },
    ],
  },
  {
    title: 'Who are you in English',
    lessons: [{ title: 'Lesson 1', vimeoId: '1066274961' }],
  },
  {
    title: 'Pace',
    lessons: [
      { title: 'Understand your pace', vimeoId: '1066274981' },
      { title: 'Task 2 - reading out loud', vimeoId: '1066274994', pdf: '/speak-now-pdf/reading-out-loud.pdf' },
    ],
  },
  {
    title: 'Fillers',
    lessons: [
      { title: 'Childhood memory', vimeoId: '1066275025' },
      { title: 'Self intro - no fillers', vimeoId: '1066275014' },
    ],
  },
  {
    title: 'Pronunciation',
    lessons: [
      { title: 'Overview', vimeoId: '1066275108' },
      { title: 'TH sound', vimeoId: '1066275129' },
      { title: 'TH cont.', vimeoId: '1066275116' },
      { title: 'EE & i', vimeoId: '1066275044' },
      { title: 'Minimal pairs', vimeoId: '1066275096' },
      { title: 'EE & i sentences', vimeoId: '1066275079' },
      { title: 'EE & i text', vimeoId: '1066275065' },
    ],
  },
  {
    title: 'Grammar',
    lessons: [
      { title: 'Intro', vimeoId: '1066275151' },
      { title: 'Present simple', vimeoId: '1066275222', pdf: '/speak-now-pdf/present-simple.pdf', answers: '/speak-now-pdf/present-simple-answers.pdf' },
      { title: 'Present simple task 1', vimeoId: '1066275248' },
      { title: 'Present simple task 2', vimeoId: '1066275237', pdf: '/speak-now-pdf/present-simple-task-2.pdf', answers: '/speak-now-pdf/present-simple-task-2-answers.pdf' },
      { title: 'Present progressive', vimeoId: '1066275210' },
      { title: 'Present simple + prog', vimeoId: '1066275215', pdf: '/speak-now-pdf/present-simple-progressive.pdf', answers: '/speak-now-pdf/present-simple-progressive-answers.pdf' },
      { title: 'Past simple intro', vimeoId: '1066275181' },
      { title: 'Past simple practice', vimeoId: '1066275194', pdf: '/speak-now-pdf/past-simple.pdf', answers: '/speak-now-pdf/past-simple-answers.pdf' },
      { title: 'Future', vimeoId: '1066275141', pdf: '/speak-now-pdf/future.pdf', answers: '/speak-now-pdf/future-answers.pdf' },
    ],
  },
  {
    title: 'Difficult words',
    lessons: [{ title: "Let's do it", vimeoId: '1066275265', pdf: '/speak-now-pdf/history-of-humanity.pdf' }],
  },
  {
    title: 'Building habits',
    lessons: [{ title: "Let's build", vimeoId: '1066275276' }],
  },
  {
    title: 'Bonuses',
    lessons: [
      {
        title: '21 audio practice challenge',
        vimeoId: '',
        link: { href: 'https://drive.google.com/drive/folders/147nC50pNFMib5lrinBeGl9utjjdBGnQ3?usp=drive_link', label: 'Open the recordings' },
      },
      {
        title: 'Business Templates',
        vimeoId: '',
        link: { href: '/speak-now-pdf/business-email-templates.pdf', label: 'Open the templates' },
      },
    ],
  },
]
