// Every rule of the free intro-call booking page lives here, so changing a
// rule is a one-line edit.

export const MEET = {
  timeZone: 'Asia/Jerusalem',
  durationMin: 20,
  // JS weekday numbers: 0 = Sunday ... 6 = Saturday. Monday to Thursday.
  weekdays: [1, 2, 3, 4],
  dayStart: '10:00',
  dayEnd: '18:00', // the last meeting must END by this time
  slotStepMin: 20,
  minNoticeHours: 12,
  maxDaysAhead: 7,
  // Gap kept free around anything already in the calendar.
  bufferMin: 30,
  // Gap when the calendar event means Sasha is out of the house.
  outOfHomeBufferMin: 60,
  outOfHomeWords: ['דיקור'],
  // Reminders: the morning one goes out from this Israel hour on the day itself,
  // the second one about an hour before.
  morningReminderHour: 8,
  hourBeforeMin: 60,
  calendarId: 'primary',
  notifyEmail: 'sasha@freeandclearenglish.com',
  title: 'שיחת היכרות 20 דקות',
} as const

export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_BASE_URL || 'https://www.freeandclearenglish.com').replace(/\/$/, '')
}
