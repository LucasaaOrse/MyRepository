// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const token = req.cookies.get('session')?.value

  if (!token) {
    // sem token, volta para login
    return NextResponse.redirect(new URL('/', req.url))
  }

  // se tiver token, deixa passar
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
