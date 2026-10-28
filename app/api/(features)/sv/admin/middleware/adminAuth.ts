import "server-only";
import { HttpError } from "@/app/api/core/httpError";
import type { SessionData } from "@/app/api/core/session";
import { withSvAuth } from "../../middleware/svAuthMiddleware";
import { userRepository } from "@/app/api/(features)/(pview)/auth/controller/userController";
import { USER_ROLES, type User } from "@/app/api/(features)/(pview)/auth/schema/userSchema";

const FORBIDDEN = "Only OCA administrators can do this.";

/**
 * Wraps an admin API route. The session must say admin, and so must the database: sessions are
 * signed cookies that last a week, so this is where an admin removed since signing in loses
 * access straight away rather than when the cookie expires.
 */
export function withAdminAuth<TContext = unknown>(
  handler: (request: Request, admin: User, session: SessionData, context: TContext) => Promise<Response>
) {
  return withSvAuth<TContext>(
    async (request, session, context) => {
      const admin = await userRepository.findById(session.user.id);
      if (!admin || admin.status !== "active" || admin.role !== USER_ROLES.admin) throw HttpError.forbidden(FORBIDDEN);
      return handler(request, admin, session, context);
    },
    { roles: [USER_ROLES.admin], forbiddenMessage: FORBIDDEN }
  );
}
