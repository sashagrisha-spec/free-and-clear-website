import { NextResponse, type NextRequest } from 'next/server'
import { getSlots } from '@/lib/meet/availability'
import { verifyEventId } from '@/lib/meet/token'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  // When rescheduling, the guest's own meeting is left out of the busy times.
  const id = req.nextUrl.searchParams.get('exclude') || ''
  const t = req.nextUrl.searchParams.get('t') || ''
  const exclude = id && verifyEventId(id, t) ? id : undefined
  try {
    const slots = await getSlots(exclude)
    return NextResponse.json({ slots })
  } catch (e) {
    console.error('meet slots', e)
    return NextResponse.json({ error: 'לא הצלחנו לטעון את השעות, נסו שוב בעוד רגע' }, { status: 500 })
  }
}
