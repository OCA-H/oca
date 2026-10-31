import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "./app/api/core/session";
import { USER_ROLES } from "./app/api/(features)/(pview)/auth/schema/userSchema";

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

/** The admin panel. Its APIs (/api/sv/admin) check the role again, against the database. */
const ADMIN_ROUTE = "/sv/admin";

/**
 * List of API routes that require authenticated session
 */
const PROTECTED_API_ROUTES = [
  "/api/member",
  "/api/sv",
];

/**
 * Payment gateway callbacks under /api/sv. CCAvenue posts the member's browser back from its own
 * site, a cross-site POST that does not carry the (SameSite=Lax) session cookie. The response is
 * trusted because only CCAvenue can encrypt it with our working key, not because of a session.
 */
const GATEWAY_CALLBACK_ROUTES = [
  "/api/sv/contribution/payment/response",
];

/**
 * A ?redirect= target as a path on this site, or null. Resolving it against the site's origin
 * catches every form a browser would send elsewhere ("//evil.com", "/\evil.com", "https:...").
 */
function sameSiteRedirect(redirect: string | null, origin: string): string | null {
  if (!redirect) return null;
  try {
    const url = new URL(redirect, origin);
    return url.origin === origin ? `${url.pathname}${url.search}${url.hash}` : null;
  } catch {
    return null;
  }
}

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

  const isProtectedApiRoute =
    !GATEWAY_CALLBACK_ROUTES.includes(pathname) &&
    PROTECTED_API_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));

  const isAuthPage = AUTH_PAGES.some((page) => pathname === page);

  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = sessionCookie ? await verifySessionToken(sessionCookie) : null;

  // 1. If already authenticated and navigating to login/signin page, go where sign-in would have
  //    sent them: a same-site ?redirect=, else the member's profile
  if (isAuthPage && session) {
    const target = sameSiteRedirect(request.nextUrl.searchParams.get("redirect"), request.nextUrl.origin) ?? "/sv/profile";
    return NextResponse.redirect(new URL(target, request.url));
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

  // 5. The admin panel is for admins: anyone else goes to their own profile
  if (session && (pathname === ADMIN_ROUTE || pathname.startsWith(`${ADMIN_ROUTE}/`)) && session.user.role !== USER_ROLES.admin) {
    return NextResponse.redirect(new URL("/sv/profile", request.url));
  }

  // 6. If authenticated, pass session context via request headers to downstream pages/components
  const requestHeaders = new Headers(request.headers);
  // Never pass on identity headers the caller made up; only the verified session sets them.
  for (const name of ["x-user-id", "x-user-email", "x-user-role", "x-user-name"]) requestHeaders.delete(name);
  if (session) {
    requestHeaders.set("x-user-id", String(session.user.id));
    if (session.user.email) requestHeaders.set("x-user-email", session.user.email);
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
