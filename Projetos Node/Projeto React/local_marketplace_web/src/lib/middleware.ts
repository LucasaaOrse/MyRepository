// middleware.ts
import { auth } from "./auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { nextUrl, auth } = req

  const isAuth = !!auth?.user
  const role = auth?.user?.role

  if (!isAuth) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  const pathname = nextUrl.pathname

  if (pathname.startsWith("/market") && role !== "MARKET") {
    return NextResponse.redirect(new URL("/", req.url))
  }

  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url))
  }

  return NextResponse.next()
})
