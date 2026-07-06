import { NextResponse, type NextRequest } from 'next/server'

// Forward the current pathname to Server Components via a request header,
// so the root layout can set <html lang> / dir per page.
export function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', request.nextUrl.pathname)
  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  // Run on pages only; skip API routes, Next internals and static files.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|.*\\..*).*)'],
}
