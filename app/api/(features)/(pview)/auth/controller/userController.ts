import "server-only";
import { after } from "next/server";
import { BaseController } from "@/app/api/core/baseController";
import { HttpError } from "@/app/api/core/httpError";
import { Mailer } from "@/app/api/core/mailer";
import { UserService } from "../services/userService";
import { UserRepository } from "../repository/userRepository";
import { PasswordResetRepository } from "../repository/passwordResetRepository";
import {
  buildSessionCookieHeader,
  buildClearSessionCookieHeader,
  verifySessionToken,
  parseCookieHeader,
  SESSION_COOKIE_NAME,
} from "@/app/api/core/auth";

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
        throw HttpError.badRequest("Please enter your Member ID, User ID, Email ID, or Mobile number.");
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
   * POST /api/auth/forgot-password
   * Emails a reset link if the email / member ID / mobile matches an active account. The answer
   * is the same either way, and the work runs after the response so its timing gives nothing away.
   */
  async forgotPassword(request: Request): Promise<Response> {
    return this.handle(async () => {
      const body = await this.readJson(request);
      const identifier = typeof body.identifier === "string" ? body.identifier.trim() : "";
      if (!identifier) {
        throw HttpError.badRequest("Please enter your Member ID, User ID, Email ID, or Mobile number.", {
          identifier: "Please enter your Member ID, User ID, Email ID, or Mobile number.",
        });
      }

      // Same for every identifier, so a broken mailbox fails visibly without revealing who is a member.
      await Mailer.ensureReady();

      const baseUrl = this.baseUrl(request);
      after(() =>
        this.service.requestPasswordReset(identifier, baseUrl).catch((error) => {
          console.error("Password reset email failed:", error);
        })
      );

      return this.ok({
        message: "If an account matches those details, we have emailed a link to reset your password.",
      });
    });
  }

  /**
   * POST /api/auth/reset-password
   * Sets a new password from the token in a reset link.
   */
  async resetPassword(request: Request): Promise<Response> {
    return this.handle(async () => {
      const body = await this.readJson(request);
      const token = typeof body.token === "string" ? body.token.trim() : "";
      const password = typeof body.password === "string" ? body.password : "";
      await this.service.resetPassword(token, password);
      return this.ok({ message: "Your password has been changed. You can now sign in with it." });
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

export const userRepository = new UserRepository();
export const userService = new UserService(userRepository, new PasswordResetRepository());
export const userController = new UserController(userService);

