import "server-only";
import { BaseController } from "../../../core/baseController";
import { HttpError } from "../../../core/httpError";
import { UserService } from "../services/userService";
import {
  buildSessionCookieHeader,
  buildClearSessionCookieHeader,
  verifySessionToken,
  parseCookieHeader,
  SESSION_COOKIE_NAME,
} from "../../../core/auth";

export class UserController extends BaseController {
  constructor(private readonly service: UserService) {
    super();
  }

  /**
   * POST /api/auth/sign-in
   * Authenticates user and sets HTTP-only session cookie.
   */
  async signIn(request: Request): Promise<Response> {
    return this.handle(async () => {
      const body = await this.readJson(request);

      const userIdentifier = (
        (body.user as string) ||
        (body.identifier as string) ||
        (body.email as string) ||
        ""
      ).trim();

      const password = ((body.pass as string) || (body.password as string) || "").trim();

      if (!userIdentifier) {
        throw HttpError.badRequest("Please enter your User ID, Email ID, or Mobile number.");
      }
      if (!password) {
        throw HttpError.badRequest("Please enter your password.");
      }

      const { user, token } = await this.service.signIn(userIdentifier, password);

      const cookieHeader = buildSessionCookieHeader(token);

      return new Response(
        JSON.stringify({
          ok: true,
          message: "Signed in successfully.",
          data: user,
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Set-Cookie": cookieHeader,
          },
        }
      );
    });
  }

  /**
   * POST /api/auth/sign-out
   * Clears the session cookie.
   */
  async signOut(_request: Request): Promise<Response> {
    return this.handle(async () => {
      const clearCookie = buildClearSessionCookieHeader();
      return new Response(
        JSON.stringify({
          ok: true,
          message: "Signed out successfully.",
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Set-Cookie": clearCookie,
          },
        }
      );
    });
  }

  /**
   * GET /api/auth/me
   * Returns current authenticated user based on session cookie.
   */
  async me(request: Request): Promise<Response> {
    return this.handle(async () => {
      const cookieHeader = request.headers.get("cookie");
      const cookies = parseCookieHeader(cookieHeader);
      const token = cookies[SESSION_COOKIE_NAME];

      if (!token) {
        throw HttpError.unauthorized("Authentication required.");
      }

      const session = await verifySessionToken(token);
      if (!session) {
        throw HttpError.unauthorized("Session expired or invalid.");
      }

      const user = await this.service.getProfile(session.user.id);
      return this.ok({ data: user });
    });
  }

  /**
   * POST /api/auth/seed
   * Populates default demo members if empty.
   */
  async seed(_request: Request): Promise<Response> {
    return this.handle(async () => {
      const seeded = await this.service.seedDemoUsers();
      return this.ok({
        message: "Demo users checked/seeded successfully.",
        data: seeded,
      });
    });
  }
}
