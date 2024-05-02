//middleware.ts

// import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_TOKEN_KEY, URL as url } from "./config";

const authRoutes = ["/auth/login", "/auth/signup", "/"];

export default function middleware(req: NextRequest) {
  const token = req.cookies.get(AUTH_TOKEN_KEY || "")?.value;

  const isAuthRoute = authRoutes.some((route) =>
    route.includes(req.nextUrl.pathname)
  );

  //   user is unauthenticated tried to access protected route we redirect them to "/"
  if (!token && !isAuthRoute) {
    const absoluteURL = new URL("/auth/signup", url);
    return NextResponse.redirect(absoluteURL);
  }
  //   user is authenticated and tries to access auth routes we redirect them to previous path
  else if (token && isAuthRoute) {
    const absoluteURL = new URL("/dashboard", url);
    return NextResponse.redirect(absoluteURL);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public images
     */
    // "/((?!api|_next/static|_next/image|favicon.ico).*)",
    "/((?!api|_next/static|_next/image|images|favicon.ico|templates|team|public).*)",
    // "/((?!_next).*)(.+)",
  ],
};
