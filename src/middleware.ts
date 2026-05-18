// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to login page and API routes (or adjust as needed)
  if (pathname === "/login" || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Apply to routes that need authentication
  if (
    pathname.startsWith("/applications") ||
    pathname.startsWith("/add") ||
    pathname.startsWith("/interviews") ||
    pathname === "/"
  ) {
    const sessionCookie = request.cookies.get("job_tracker_session");

    if (!sessionCookie) {
      const url = new URL("/login", request.url);
      url.searchParams.set("error", "login_required");
      return NextResponse.redirect(url);
    }
  }

  const response = NextResponse.next();
  response.headers.set("X-Visited-At", Date.now().toString());

  console.log(`[${new Date().toISOString()}] ${request.method} ${pathname}`);

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
