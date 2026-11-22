import "server-only";
import { HttpError } from "@/app/api/core/httpError";
import type { SessionData } from "@/app/api/core/session";
import { withSvAuth } from "../../middleware/svAuthMiddleware";
import { userRepository } from "@/app/api/(features)/(pview)/auth/controller/userController";
import { STAFF_ROLES, isStaffRole, type User } from "@/app/api/(features)/(pview)/auth/schema/userSchema";

const FORBIDDEN = "Only OCA super admins and admins can do this.";

/**
 * Wraps an OCA admin console API route. The session must say super admin or admin, and so must
 * the database: sessions last a week, so an admin removed since signing in loses access here
 * straight away rather than when the cookie expires.
 */
export function withStaffAuth<TContext = unknown>(
  handler: (request: Request, staff: User, session: SessionData, context: TContext) => Promise<Response>
) {
  return withSvAuth<TContext>(
    async (request, session, context) => {
      const staff = await userRepository.findById(session.user.id);
      if (!staff || staff.status !== "active" || !isStaffRole(staff.role)) throw HttpError.forbidden(FORBIDDEN);
      return handler(request, staff, session, context);
    },
    { roles: [...STAFF_ROLES], forbiddenMessage: FORBIDDEN }
  );
}
