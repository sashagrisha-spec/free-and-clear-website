// ערכת הדיבור באנגלית: the bundle of three courses (2026-10-27).
// Shared by the checkout and the completion route so the price and the course
// list can never drift apart between the two.

export const KIT_SLUG = 'speaking-kit'
export const KIT_NAME = 'ערכת הדיבור באנגלית'

export const ALL_PRICE = 397
export const TWO_PRICE = 315

export const KIT_COURSES = ['soe', 'smallTalk', 'yalla'] as const
export type KitCourse = (typeof KIT_COURSES)[number]

export const COURSE_LABEL: Record<KitCourse, string> = {
  soe: 'צלילי אנגלית',
  smallTalk: 'סמול טוק, קטן עליי',
  yalla: 'יאללה, לחזור אחרי',
}

// One letter per course travels inside Cardcom's ReturnValue.
export const COURSE_CODE: Record<KitCourse, string> = { soe: 'S', smallTalk: 'T', yalla: 'Y' }

// A valid order is all three courses, or exactly two different ones.
export function parseCourses(input: unknown): KitCourse[] | null {
  if (!Array.isArray(input)) return null
  const picked = [...new Set(input)].filter((c): c is KitCourse => KIT_COURSES.includes(c as KitCourse))
  if (picked.length !== input.length) return null
  if (picked.length !== 2 && picked.length !== 3) return null
  return KIT_COURSES.filter((c) => picked.includes(c))
}

export function coursesFromCodes(codes: string): KitCourse[] | null {
  const picked = KIT_COURSES.filter((c) => codes.includes(COURSE_CODE[c]))
  if (picked.length !== 2 && picked.length !== 3) return null
  return picked
}

export function kitPrice(courses: KitCourse[]): number {
  return courses.length === 3 ? ALL_PRICE : TWO_PRICE
}
