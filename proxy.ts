import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "./app/api/core/session";

/**
 * Check if the requested route is a secure view (/sv/...) or protected route
 */
function isSecureViewRoute(pathname: string): boolean {
  return (
    pathname === "/sv" ||
    pathname.startsWith("/sv/") ||
    pathname === "/member-portal" ||
    pathname.startsWith("/member-portal/")
  );
}

/**
 * List of API routes that require authenticated session
 */
const PROTECTED_API_ROUTES = [
  "/api/member",
  "/api/sv",
];

/**
 * Public auth pages that should redirect to home if user is already authenticated
 */
const AUTH_PAGES = [
  "/member-signin",
  "/partner-organization",
];

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const isProtectedRoute = isSecureViewRoute(pathname);

  const isProtectedApiRoute = PROTECTED_API_ROUTES.some((route) =>
    pathname === route || pathname.startsWith(`${route}/`)
  );

  const isAuthPage = AUTH_PAGES.some((page) => pathname === page);

  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = sessionCookie ? await verifySessionToken(sessionCookie) : null;

  // 1. If already authenticated and navigating to login/signin page, redirect to the member's profile
  if (isAuthPage && session) {
    return NextResponse.redirect(new URL("/sv/profile", request.url));
  }

  // 2. Legacy /member-portal redirect to /sv/member-portal
  if (pathname === "/member-portal" || pathname.startsWith("/member-portal/")) {
    const newPath = pathname.replace(/^\/member-portal/, "/sv/member-portal");
    if (!session) {
      const signInUrl = new URL("/member-signin", request.url);
      signInUrl.searchParams.set("redirect", `${newPath}${search}`);
      return NextResponse.redirect(signInUrl);
    }
    return NextResponse.redirect(new URL(`${newPath}${search}`, request.url));
  }

  // 3. If accessing a protected API route without session, return 401 Unauthorized
  if (isProtectedApiRoute && !session) {
    return NextResponse.json(
      { ok: false, error: "Authentication required to access this resource." },
      { status: 401 }
    );
  }

  // 4. If accessing any /sv route without session, redirect to member sign-in
  if (isProtectedRoute && !session) {
    const signInUrl = new URL("/member-signin", request.url);
    signInUrl.searchParams.set("redirect", `${pathname}${search}`);
    return NextResponse.redirect(signInUrl);
  }

  // 4. If authenticated, pass session context via request headers to downstream pages/components
  const requestHeaders = new Headers(request.headers);
  if (session) {
    requestHeaders.set("x-user-id", String(session.user.id));
    requestHeaders.set("x-user-email", session.user.email);
    requestHeaders.set("x-user-role", session.user.role);
    requestHeaders.set("x-user-name", encodeURIComponent(session.user.fullName));
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const middleware = proxy;

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    "/((?!_next/static|_next/image|images|favicon.ico).*)",
  ],
};

export default proxy;
