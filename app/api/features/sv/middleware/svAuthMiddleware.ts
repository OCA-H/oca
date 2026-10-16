import "server-only";
import { HttpError } from "@/app/api/core/httpError";
import {
  verifySessionToken,
  parseCookieHeader,
  SESSION_COOKIE_NAME,
  type SessionData,
} from "@/app/api/core/session";

export interface SvAuthOptions {
  /**
   * Allowed roles for authorization (e.g., ['member', 'admin', 'columban']).
   * If omitted, any authenticated user is allowed.
   */
  roles?: string[];
  /**
   * Custom message for unauthorized (401) responses.
   */
  unauthorizedMessage?: string;
  /**
   * Custom message for forbidden (403) responses.
   */
  forbiddenMessage?: string;
}

/**
 * Extracts and verifies the session from the incoming Request.
 * Inspects:
 * 1. HTTP cookie (oca_session)
 * 2. Authorization header (Bearer <token>)
 * 3. Forwarded proxy headers (x-user-id, x-user-email, x-user-role)
 */
export async function extractSvSession(request: Request): Promise<SessionData | null> {
  // 1. Try Cookie header
  const cookieHeader = request.headers.get("cookie");
  const cookies = parseCookieHeader(cookieHeader);
  const cookieToken = cookies[SESSION_COOKIE_NAME];

  if (cookieToken) {
    const session = await verifySessionToken(cookieToken);
    if (session) return session;
  }

  // 2. Try Authorization: Bearer <token>
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    const bearerToken = authHeader.slice(7).trim();
    if (bearerToken) {
      const session = await verifySessionToken(bearerToken);
      if (session) return session;
    }
  }

  // 3. Check for upstream verified proxy headers
  const userId = request.headers.get("x-user-id");
  const userEmail = request.headers.get("x-user-email");
  const userRole = request.headers.get("x-user-role");
  const userName = request.headers.get("x-user-name");

  if (userId && userEmail && userRole) {
    return {
      user: {
        id: Number(userId),
        memberId: `OCA-${userId}`,
        email: userEmail,
        fullName: userName ? decodeURIComponent(userName) : userEmail.split("@")[0],
        role: userRole,
        membershipType: "Regular",
      },
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
    };
  }

  return null;
}

/**
 * Validates authentication and authorization for Secure View (SV) APIs.
 * Throws HttpError(401) if unauthenticated, or HttpError(403) if unauthorized.
 */
export async function verifySvAuth(
  request: Request,
  options?: SvAuthOptions
): Promise<SessionData> {
  const session = await extractSvSession(request);

  if (!session) {
    throw HttpError.unauthorized(
      options?.unauthorizedMessage || "Authentication required to access this secure resource."
    );
  }

  // Check role-based authorization if required roles are configured
  if (options?.roles && options.roles.length > 0) {
    const userRole = session.user.role.toLowerCase();
    const hasRole = options.roles.some((r) => r.toLowerCase() === userRole);

    if (!hasRole) {
      throw HttpError.forbidden(
        options?.forbiddenMessage || "Access denied. Insufficient permissions to access this resource."
      );
    }
  }

  return session;
}

/**
 * Higher-Order Route Handler for SV APIs.
 * Wraps route handlers to enforce authentication and authorization.
 * If authentication fails, immediately halts execution and returns a 401/403 JSON response.
 */
export function withSvAuth<TContext = unknown>(
  handler: (request: Request, session: SessionData, context: TContext) => Promise<Response>,
  options?: SvAuthOptions
) {
  return async (request: Request, context: TContext): Promise<Response> => {
    try {
      const session = await verifySvAuth(request, options);
      return await handler(request, session, context);
    } catch (error) {
      if (error instanceof HttpError) {
        return Response.json(
          { ok: false, error: error.message, ...(error.fields && { fields: error.fields }) },
          { status: error.status }
        );
      }
      console.error("[SV Middleware Error]:", error);
      return Response.json(
        { ok: false, error: "Internal security authorization failure." },
        { status: 500 }
      );
    }
  };
}

/**
 * Middleware runner for SV API controllers.
 */
export async function svMiddleware(
  request: Request,
  next: (session: SessionData) => Promise<Response>,
  options?: SvAuthOptions
): Promise<Response> {
  try {
    const session = await verifySvAuth(request, options);
    return await next(session);
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(
        { ok: false, error: error.message, ...(error.fields && { fields: error.fields }) },
        { status: error.status }
      );
    }
    console.error("[SV Middleware Error]:", error);
    return Response.json(
      { ok: false, error: "Internal security authorization failure." },
      { status: 500 }
    );
  }
}
