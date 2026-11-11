// All the words on the home page, once per language. The layout lives in
// components/home/HomePage.tsx and never holds copy of its own, so the English
// and Hebrew pages can never drift apart in structure.

export type HomeLang = 'en' | 'he'

type Card = {
  badge: string
  title: string
  meta: string
  desc: string
  bullets: string[]
  price: string
  priceNote: string
  priceIsCta?: boolean // the price row is an invitation, not a number
  cta: string
  href: string
}

type Course = {
  badge: string
  title: string
  meta: string
  desc: string
  oldPrice: string
  price: string
  priceNote: string
  cta: string
  href: string
  external?: boolean
  moreLabel?: string // optional second button, e.g. 'לקרוא עוד'
  moreHref?: string
}

export type HomeCopy = {
  lang: HomeLang
  base: string // '' for English, '/he' for Hebrew; anchors hang off it
  otherLangHref: string
  otherLangLabel: string
  nav: { about: string; services: string; testimonials: string; blog: string; cta: string }
  hero: {
    eyebrow: string
    hand?: string // left out = no handwritten line above the photo
    line1: string
    line2: string
    emph: string
    sub: string
    ctaMain: string
    ctaSecond: string
    stats: { value: string; label: string }[]
  }
  logosLabel?: string // left out = company names with no line above
  statement: { lines: { text: string; mark?: string }[]; hand?: string }
  video: { eyebrow: string; title?: string } // no title = eyebrow only
  about: { eyebrow: string; title: { text: string; hand?: string; end?: string }[]; paras: string[]; cta: string; photoAlt: string }
  services: {
    eyebrow: string
    title: string
    sub: string
    personalLabel: string
    pickPersonal: string
    pickDigital: string
    pickHint: string
    cards: Card[]
    digitalLabel: string
    courses: Course[]
  }
  testimonials: {
    eyebrow: string
    title: string
    items: { quote: string; name: string; role: string; initial: string }[]
  }
  messages?: { eyebrow: string; title: string; sub: string } // left out = section hidden
  videoTestimonials?: { name: string; file: string }[] // under the messages board; files in /public/videos/testimonial-<file>.mp4
  contact: {
    eyebrow: string
    title: string
    titleEmph: string
    sub: string
    name: string
    namePh: string
    email: string
    message: string
    messagePh: string
    send: string
    sending: string
    doneTitle: string
    doneSub: string
    error: string
  }
  footer: { rights: string }
}

const COMPANIES = ['Teva', 'Monday', 'Optimove', 'Glassbox', 'HoneyBook', 'Passport Card', 'SEDRIC']
export { COMPANIES }

export const HOME_EN: HomeCopy = {
  lang: 'en',
  base: '',
  otherLangHref: '/he',
  otherLangLabel: 'עברית',
  nav: { about: 'About', services: 'Services', testimonials: 'Testimonials', blog: 'Blog', cta: "Let's Talk" },
  hero: {
    eyebrow: 'English Communication Coaching',
    line1: 'You know English.',
    line2: "Now let's make it",
    emph: 'sound like you.',
    sub: "For the past decade I've worked with entrepreneurs, CEOs, CFOs, founders, lecturers and doctors.",
    ctaMain: "Let's Talk",
    ctaSecond: 'See What I Offer',
    stats: [
      { value: '500+', label: 'Professionals coached' },
      { value: '8', label: 'Years of experience' },
      { value: '1', label: 'Method that actually works' },
    ],
  },
  logosLabel: 'Trusted by professionals from',
  statement: {
    lines: [
      { text: 'You are sharp, experienced and impressive ', mark: 'in your mother tongue.' },
      { text: 'But a smaller version of yourself ', mark: 'the moment you switch to English.' },
      { text: 'This is where I come into the picture.' },
    ],
  },
  video: { eyebrow: 'Say hello', title: 'Meet Sasha' },
  about: {
    eyebrow: 'About Sasha',
    title: [
      { text: "I'm not an ", hand: 'English teacher', end: '.' },
      { text: "I'm a ", hand: 'communication coach', end: '.' },
    ],
    paras: [
      'There’s a difference. Teachers explain grammar. I help you sound like yourself in English: confident, clear, and fully present.',
      'My clients are managers, founders, doctors and executives who already speak English but feel like they’re leaving something on the table every time they open their mouth in a meeting or on a call.',
      'The gap between who you are and how you come across? That’s exactly what we close together.',
    ],
    cta: 'Work With Me',
    photoAlt: 'Sasha Daniel',
  },
  services: {
    eyebrow: 'What I Offer',
    title: 'Pick your starting point',
    sub: 'From a deep personal process to a daily 10-minute habit. There’s something for wherever you are right now.',
    personalLabel: 'Personal & Corporate',
    pickPersonal: 'Personal Coaching',
    pickDigital: 'Digital Courses',
    pickHint: "Click to see what's inside",
    cards: [
      {
        badge: 'Premium 1:1',
        title: 'Personal Coaching',
        meta: '10 sessions · With Sasha · Fully tailored to you',
        desc: 'A deep, structured process built around exactly where you get stuck. We work on pronunciation and accent, fluency, psychological blocks, communication style and presentations. Not a course. Not a formula, but a process that fits you.',
        bullets: ['Pronunciation & accent', 'Speaking fluency', 'Psychological blocks', 'Presentations & high-stakes communication'],
        price: 'Get in touch to book a free intro call',
        priceNote: '',
        priceIsCta: true,
        cta: 'Contact for Pricing',
        href: '#contact',
      },
      {
        badge: '1:1 Foundations',
        title: 'Building Confidence',
        meta: '10 sessions · With a Free & Clear teacher',
        desc: 'For when you still feel you need more work on the basics before the fine-tuning. One-on-one sessions with a teacher from my team, focused on grammar, vocabulary and the confidence to open your mouth and speak.',
        bullets: ['Grammar', 'Vocabulary', 'Speaking confidence', 'Fully tailored to you'],
        price: 'Get in touch to book a free intro call',
        priceNote: '',
        priceIsCta: true,
        cta: 'Contact for Pricing',
        href: '#contact',
      },
      {
        badge: 'Corporate',
        title: 'Team Workshops',
        meta: 'Up to 12 people · Live on Zoom · Fully customized',
        desc: 'Live Zoom sessions designed around your team’s specific needs. Whether it’s cross-team communication, presentation skills, or English for global calls, every workshop is built from scratch for your group.',
        bullets: ['Pronunciation & accent work', 'Fluency & communication', 'Small groups up to 12', 'Live on Zoom, fully customized'],
        price: 'Custom quote',
        priceNote: 'Built for your team',
        cta: 'Contact for Pricing',
        href: '#contact',
      },
    ],
    digitalLabel: 'Digital Courses',
    courses: [
      {
        badge: '⏳ Launch price',
        title: 'Say It Back',
        meta: '56 shadowing recordings',
        desc: 'You understand English. Now let your mouth catch up. Listen, say it back out loud, 10 minutes at a time.',
        oldPrice: '€57',
        price: '€32',
        priceNote: 'One-time payment',
        cta: 'Start Now',
        href: '/say-it-back',
      },
    ],
  },
  testimonials: {
    eyebrow: 'Real Results',
    title: 'What happens when the gap closes',
    items: [
      {
        quote: 'Studying with Sasha had a profound impact on my professional life. I’ve become much more confident and efficient in preparing for presentations, classes and talks in English.',
        name: 'Yohai Sabag',
        role: 'Former VP, Optimove',
        initial: 'Y',
      },
      {
        quote: 'With Sasha I learned that there is always a ‘Next Level’. Highly recommended coach.',
        name: 'Nir Laznik',
        role: 'Co-Founder & CEO, Sedric',
        initial: 'N',
      },
      {
        quote: 'Every single person in the company should take this course with Sasha even if their English is good. Her approach is so unique and anyone can get better.',
        name: 'Neta',
        role: 'Course Participant, Glassbox',
        initial: 'N',
      },
    ],
  },
  contact: {
    eyebrow: 'Ready?',
    title: "Let's figure out",
    titleEmph: "what's holding you back.",
    sub: 'Drop me a message. No pressure, no scripts: just a real conversation about where you are and where you want to be.',
    name: 'Your name',
    namePh: 'Yoni Cohen',
    email: 'Email',
    message: 'Tell me a bit about where you’re at',
    messagePh: 'I’ve been speaking English for years but in meetings I still feel like I’m leaving something on the table...',
    send: 'Send Message',
    sending: 'Sending...',
    doneTitle: 'Got it. I’ll be in touch soon.',
    doneSub: 'Usually within 24 hours.',
    error: 'Something went wrong. Please try again.',
  },
  footer: { rights: 'Sasha Daniel · Free & Clear English' },
}

export const HOME_HE: HomeCopy = {
  lang: 'he',
  base: '/he',
  otherLangHref: '/',
  otherLangLabel: 'English',
  nav: { about: 'קצת עליי', services: 'מה אני מציעה', testimonials: 'המלצות', blog: 'בלוג', cta: 'בואו נדבר' },
  hero: {
    eyebrow: 'אימון תקשורת באנגלית',
    line1: 'אתם יודעים אנגלית.',
    line2: 'עכשיו הגיע הזמן לגרום לכם',
    emph: 'לדבר אותה בנינוחות וביטחון.',
    sub: 'כבר 8 שנים אני עובדת עם יזמים, מנכ״לים, מנהלים, מייסדים, מרצים, רופאים ועוד...',
    ctaMain: 'בואו נדבר',
    ctaSecond: 'מה אני מציעה',
    stats: [
      { value: '500+', label: 'אנשי מקצוע שליוויתי' },
      { value: '8', label: 'שנות ניסיון' },
      { value: '1', label: 'שיטה שבאמת עובדת' },
    ],
  },
  statement: {
    lines: [
      { text: 'אתם חדים, מנוסים ומרשימים ', mark: 'בעברית' },
      { text: 'אבל גרסה קטנה ומצומצמת של עצמכם ', mark: 'ברגע שעוברים לאנגלית, נכון?' },
      { text: 'על זה בדיוק אנחנו נעבוד יחד.' },
    ],
  },
  video: { eyebrow: 'נעים להכיר' },
  about: {
    eyebrow: 'קצת עליי',
    title: [{ text: 'אני לא מורה לאנגלית.' }, { text: 'אני מאמנת תקשורת.' }],
    paras: [
      'מורים מסבירים דקדוק. אני עוזרת לכם להישמע כמו עצמכם באנגלית. הלקוחות שלי כבר מדברים אנגלית, ובכל זאת מרגישים שמשהו נשאר על השולחן בכל פעם שהם פותחים את הפה בפגישה. הפער בין מי שאתם לבין איך שאתם נשמעים? את זה אנחנו סוגרים.',
      'אני אובססיבית להגייה ולתקשורת מאז בית הספר למשחק בניו יורק. שם גיליתי את זה, והרגשתי שהסתירו ממני את אחד הדברים הכי קריטיים בשפה. היום אני עושה הכל כדי לחשוף את העולמות המוסתרים האלה, כי הם צריכים להיות גלויים לכולם.',
    ],
    cta: 'לעבוד איתי',
    photoAlt: 'סשה דניאל',
  },
  services: {
    eyebrow: 'מה אני מציעה',
    title: 'בחרו מאיפה להתחיל',
    sub: 'מתהליך אישי ועמוק ועד הרגל יומי של 10 דקות. יש משהו לכל מקום שבו אתם נמצאים עכשיו.',
    personalLabel: 'אישי וארגוני',
    pickPersonal: 'ליווי אישי',
    pickDigital: 'קורסים דיגיטליים',
    pickHint: "לחצו כדי לראות מה בפנים",
    cards: [
      {
        badge: '1:1 פרימיום',
        title: 'ליווי אישי',
        meta: '10 מפגשים · עם סשה · מותאם לגמרי אליכם',
        desc: 'תהליך עמוק ומובנה שנבנה בדיוק סביב המקומות שבהם אתם נתקעים. עובדים על הגייה ומבטא, שטף דיבור, חסמים פסיכולוגיים, סגנון תקשורת ומצגות. לא קורס. לא נוסחה, אלא תהליך שמתאים לכם.',
        bullets: ['הגייה ומבטא', 'שטף דיבור', 'חסמים פסיכולוגיים', 'מצגות ותקשורת ברגעים חשובים'],
        price: 'צרו קשר לקביעת שיחת היכרות חינמית',
        priceNote: '',
        priceIsCta: true,
        cta: 'לפרטים ומחירים',
        href: '#contact',
      },
      {
        badge: '1:1 בסיס',
        title: 'בונים ביטחון',
        meta: '10 מפגשים · עם מורה מהצוות של Free & Clear',
        desc: 'למי שעדיין מרגישים שצריך לעבוד יותר על הבסיס לפני הליטוש. מפגשים אישיים עם מורה מהצוות שלי, שמתמקדים בדקדוק, באוצר מילים ובביטחון לפתוח את הפה ולדבר.',
        bullets: ['דקדוק', 'אוצר מילים', 'ביטחון בדיבור', 'מותאם לגמרי אליכם'],
        price: 'צרו קשר לקביעת שיחת היכרות חינמית',
        priceNote: '',
        priceIsCta: true,
        cta: 'לפרטים ומחירים',
        href: '#contact',
      },
      {
        badge: 'ארגונים',
        title: 'סדנאות לצוותים',
        meta: 'עד 12 משתתפים · בזום · מותאם לגמרי',
        desc: 'מפגשי זום חיים שנבנים סביב הצרכים של הצוות שלכם. תקשורת בין צוותים, מיומנויות הצגה או אנגלית לשיחות עם חו״ל: כל סדנה נבנית מאפס עבור הקבוצה שלכם.',
        bullets: ['עבודה על הגייה ומבטא', 'שטף ותקשורת', 'קבוצות קטנות עד 12', 'בזום, מותאם לגמרי'],
        price: 'הצעה מותאמת',
        priceNote: 'נבנית לצוות שלכם',
        cta: 'לפרטים ומחירים',
        href: '#contact',
      },
    ],
    digitalLabel: 'קורסים דיגיטליים',
    // Prices copied from app/courses/page.tsx on origin/main (2026-11-11).
    // Change them there and here together.
    courses: [
      {
        badge: 'בינוני / מתקדם',
        title: 'The Sound of English',
        meta: '34 סרטונים · הגייה ומבטא',
        desc: 'הקורס החדש שלי להגייה ולמבטא. האנגלית שלכם טובה, אבל עדיין מבקשים מכם לחזור על מה שאמרתם, או שאתם שומעים את עצמכם ויודעים שהצליל לא יוצא נכון.',
        oldPrice: '₪247',
        price: '₪147',
        priceNote: 'תשלום חד-פעמי',
        cta: 'לרכישה מיידית',
        href: '/the-sound-of-english#buy',
        moreLabel: 'לקרוא עוד',
        moreHref: '/the-sound-of-english',
      },
      {
        badge: 'בינוני',
        title: 'יאללה, לחזור אחרי',
        meta: '55 הקלטות בשיטת Shadowing',
        desc: 'תוכנית התרגול הכי פופולרית שלי בשנה האחרונה. יש לכם אנגלית פסיבית טובה ואתם רוצים שהדיבור סוף סוף ידביק את הקצב.',
        oldPrice: '₪197',
        price: '₪167',
        priceNote: 'תשלום חד-פעמי',
        cta: 'לרכישה מיידית',
        href: '/yalla-lachzor-acharei#buy',
        moreLabel: 'לקרוא עוד',
        moreHref: '/yalla-lachzor-acharei',
      },
      {
        badge: 'בינוני',
        title: 'סמול טוק, קטן עליי',
        meta: 'מיקרו-קורס · בעברית ובאנגלית',
        desc: 'מיקרו-קורס ממוקד שיעזור לכם להפסיק להרגיש מוזר בסמול טוק. האנגלית שלכם בסדר גמור, אבל ברגע שמישהו מחו"ל פונה אליכם בשאלה פשוטה אתם פתאום לא יודעים מה לעשות עם עצמכם :)',
        oldPrice: '₪237',
        price: '₪187',
        priceNote: 'תשלום חד-פעמי',
        cta: 'לרכישה מיידית',
        href: 'https://secure.cardcom.solutions/EA/EA5/cfTDi0SJAkCJnWBxeOjVA/PaymentSP',
        external: true,
        moreLabel: 'לקרוא עוד',
        moreHref: 'https://small-talk.ravpage.co.il/smalltalkall',
      },
      {
        badge: 'בינוני / מתקדם',
        title: 'דברו בשטף וביטחון',
        meta: 'הקדמה, שבעה פרקים ובונוסים',
        desc: 'הקורס הכי מעמיק שלי, לאנשים שכבר יודעים אנגלית ורוצים באמת לדבר אותה. אתם מרגישים בנוח ללמוד באנגלית ורוצים לעבוד על הדיבור שלכם לעומק.',
        oldPrice: '₪267',
        price: '₪197',
        priceNote: 'תשלום חד-פעמי',
        cta: 'לרכישה מיידית',
        href: 'https://secure.cardcom.solutions/EA/EA5/hVhtiN67IEixchc4WCwDkQ/PaymentSP',
        external: true,
        moreLabel: 'לקרוא עוד',
        moreHref: 'https://small-talk.ravpage.co.il/speaknow',
      },
      {
        badge: 'מתחילים',
        title: 'אתגר שמע למתחילים',
        meta: '21 הקלטות אודיו · Shadowing',
        desc: '21 הקלטות קצרות שיעזרו לכם סוף סוף לפתוח את הפה. אתם מבינים אנגלית הרבה יותר טוב ממה שאתם מצליחים לדבר ורוצים להתחיל לאמן את הפה, האוזן והביטחון.',
        oldPrice: '₪77',
        price: '₪47',
        priceNote: 'תשלום חד-פעמי',
        cta: 'לרכישה מיידית',
        href: 'https://secure.cardcom.solutions/EA/EA5/PVxn8Db8UEGNxWe3KEtkPQ/PaymentSP',
        external: true,
      },
    ],
  },
  testimonials: {
    eyebrow: 'תוצאות אמיתיות',
    title: 'מה קורה כשהפער נסגר',
    items: [
      {
        quote: 'הלימוד עם סשה השפיע עמוקות על החיים המקצועיים שלי. נעשיתי הרבה יותר בטוח ויעיל בהכנה של מצגות, שיעורים והרצאות באנגלית.',
        name: 'יוחאי סבג',
        role: 'סמנכ״ל לשעבר, Optimove',
        initial: 'י',
      },
      {
        quote: 'עם סשה למדתי שתמיד יש Next Level. מאמנת מומלצת מאוד.',
        name: 'ניר לזניק',
        role: 'מייסד-שותף ומנכ״ל, Sedric',
        initial: 'נ',
      },
      {
        quote: 'כל אחד ואחת בחברה צריכים לעשות את הקורס הזה עם סשה, גם אם האנגלית שלהם טובה. הגישה שלה כל כך ייחודית, וכל אחד יכול להשתפר.',
        name: 'נטע',
        role: 'משתתפת בקורס, Glassbox',
        initial: 'נ',
      },
    ],
  },
  messages: {
    eyebrow: 'ישר מהתלמידים',
    title: 'הודעות אמיתיות. בלי עריכה.',
    sub: 'אלה הודעות אמיתיות מתלמידים. מהסוג ששולחים כשמשהו באמת משתנה.',
  },
  videoTestimonials: [
    { name: 'דור', file: 'dor' },
    { name: 'ריקי', file: 'riki' },
    { name: 'טליה', file: 'talia' },
  ],
  contact: {
    eyebrow: 'מוכנים?',
    title: 'בואו נבין',
    titleEmph: 'מה עוצר אתכם.',
    sub: 'שלחו לי הודעה. בלי לחץ ובלי תסריטים: רק שיחה אמיתית על איפה שאתם נמצאים ולאן אתם רוצים להגיע.',
    name: 'שם',
    namePh: 'יוני כהן',
    email: 'אימייל',
    message: 'ספרו לי קצת איפה אתם עומדים',
    messagePh: 'כבר שנים שאני מדבר/ת אנגלית, אבל בפגישות עדיין יש תחושה שמשהו נשאר על השולחן...',
    send: 'שליחה',
    sending: 'שולחים...',
    doneTitle: 'קיבלתי. אחזור אליכם בקרוב.',
    doneSub: 'בדרך כלל תוך 24 שעות.',
    error: 'משהו השתבש. נסו שוב בבקשה.',
  },
  footer: { rights: 'סשה דניאל · Free & Clear English' },
}
