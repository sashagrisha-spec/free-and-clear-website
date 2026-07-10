// SEO target queries for the weekly auto-blog, in priority order.
// The generator (generate-post.mjs) picks the highest-priority query NOT yet
// covered by an existing post, and writes a post to rank for it.
//
// Strategy: Hebrew-first (our audience searches in Hebrew), informational
// intent (blog-appropriate), leaning into Sasha's niche: people who ALREADY
// know English but want confidence/fluency/pronunciation. We deliberately avoid
// the broad "קורס אנגלית / לימוד אנגלית" head terms owned by the big schools.
//
// To steer future posts: reorder, add, or remove entries here. `lang` sets the
// post language; `note` is the angle handed to the writer.

export const keywordTargets = [
  { q: 'איך לדבר אנגלית בביטחון', lang: 'he', note: 'הפחד/החסם הרגשי מול דיבור אנגלית, כלים מעשיים' },
  { q: 'למה אני לא מצליח לדבר אנגלית / מחסום דיבור באנגלית', lang: 'he', note: 'למה יודעים אנגלית אבל נתקעים בדיבור' },
  { q: 'איך להיפטר ממבטא ישראלי באנגלית', lang: 'he', note: 'הגייה ומבטא, לא להתבייש במבטא אבל להיות ברור' },
  { q: 'איך לחשוב באנגלית בלי לתרגם מעברית', lang: 'he', note: 'להפסיק לתרגם בראש, לחשוב ישירות באנגלית' },
  { q: 'טעויות נפוצות של ישראלים באנגלית', lang: 'he', note: 'טעויות אופייניות + איך לתקן' },
  { q: 'איך לעשות small talk באנגלית', lang: 'he', note: 'שיחות חולין בעבודה, לשבור את הקרח' },
  { q: 'איך להציג מצגת באנגלית', lang: 'he', note: 'presentation בעבודה, ביטחון מול קהל' },
  { q: 'שיחת טלפון או ישיבה באנגלית בעבודה', lang: 'he', note: 'טלפון/זום/ישיבות בינלאומיות' },
  { q: 'איך לשפר אנגלית מדוברת למבוגרים', lang: 'he', note: 'שיפור שטף בגיל מבוגר, ריאלי ומעשי' },
  { q: 'שיטת shadowing לתרגול אנגלית', lang: 'he', note: 'שיטת הצללה, איך מתרגלים לבד' },
  { q: 'אנגלית לראיון עבודה בהייטק', lang: 'he', note: 'ראיונות באנגלית, שאלות נפוצות' },
  { q: 'איך לתת פידבק באנגלית בעבודה', lang: 'he', note: 'פידבק/ביקורת בונה באנגלית מקצועית' },
  // English complementary (secondary, keeps some English presence for the hi-tech/global audience)
  { q: 'accent reduction for Hebrew speakers', lang: 'en', note: 'clarity over erasing the accent' },
  { q: 'how to think in English instead of translating', lang: 'en', note: 'stop translating from Hebrew' },
]
