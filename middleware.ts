import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Users can access all pages without login (demo mode)
  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/login", "/search/:path*", "/player/:path*"],
}
