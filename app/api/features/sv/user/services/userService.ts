import "server-only";
import crypto from "node:crypto";
import { HttpError } from "@/app/api/core/httpError";
import { Mailer } from "@/app/api/core/mailer";
import { UserRepository } from "../repository/userRepository";
import { PasswordResetRepository } from "../repository/passwordResetRepository";
import type { User, SafeUser } from "../schema/userSchema";
import { passwordResetEmail } from "./passwordResetEmail";
import { verifyPassword, hashPassword, createSessionToken, type SessionUser } from "@/app/api/core/auth";

const RESET_LINK_TTL_MINUTES = 30;
/** Stops the form being used to flood a member's inbox. */
const RESET_EMAIL_COOLDOWN_SECONDS = 60;
const MIN_PASSWORD_LENGTH = 8;

const hashResetToken = (token: string) => crypto.createHash("sha256").update(token).digest("hex");

export function toSafeUser(user: User): SafeUser {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, passwordSalt, ...safe } = user;
  return safe;
}

export function toSessionUser(user: User): SessionUser {
  return {
    id: user.id,
    memberId: user.memberId,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    batchYear: user.batchYear,
    house: user.house,
    membershipType: user.membershipType,
  };
}

export class UserService {
  constructor(
    private readonly repository: UserRepository,
    private readonly resets: PasswordResetRepository
  ) {}

  /**
   * Authenticates user with memberId/email/mobile and password.
   * Automatically initializes demo seed data if DB table is currently empty.
   */
  async signIn(identifier: string, pass: string): Promise<{ user: SafeUser; token: string }> {
    const trimmedId = identifier?.trim();
    if (!trimmedId) {
      throw HttpError.badRequest("Please enter your User ID, Email ID, or Mobile number.");
    }
    if (!pass) {
      throw HttpError.badRequest("Please enter your password.");
    }

    // Auto seed demo users if table is empty so sign-in works immediately
    const count = await this.repository.count();
    if (count === 0) {
      await this.repository.seedDefaultUsers();
    }

    const user = await this.repository.findByIdentifier(trimmedId);
    if (!user) {
      throw HttpError.unauthorized("Invalid User ID/Email/Mobile or Password.");
    }

    if (user.status === "pending") {
      throw HttpError.forbidden("Your membership is awaiting verification by the OCA Secretariat. We will email you once it is approved.");
    }
    if (user.status !== "active") {
      throw HttpError.forbidden("Your account is currently inactive. Please contact the OCA Secretariat.");
    }

    const isValid = verifyPassword(pass, user.passwordHash, user.passwordSalt);
    if (!isValid) {
      throw HttpError.unauthorized("Invalid User ID/Email/Mobile or Password.");
    }

    // Update last login timestamp asynchronously
    await this.repository.updateLastLogin(user.id);

    const sessionUser = toSessionUser(user);
    const token = await createSessionToken(sessionUser);

    return {
      user: toSafeUser(user),
      token,
    };
  }

  async getProfile(userId: number): Promise<SafeUser> {
    const user = await this.repository.findById(userId);
    if (!user) {
      throw HttpError.notFound("User not found.");
    }
    return toSafeUser(user);
  }

  /**
   * Emails a one-time reset link to the account matching the email, member ID or mobile.
   * Does nothing, silently, for unknown or inactive accounts, so callers can always answer the
   * same way and the form cannot be used to discover who is a member.
   */
  async requestPasswordReset(identifier: string, baseUrl: string): Promise<void> {
    const user = await this.repository.findByIdentifier(identifier);
    if (!user || user.status !== "active") return;

    const latest = await this.resets.findLatestForUser(user.id);
    if (latest && Date.now() - latest.createdAt.getTime() < RESET_EMAIL_COOLDOWN_SECONDS * 1000) return;

    const token = crypto.randomBytes(32).toString("hex");
    await this.resets.createForUser(
      user.id,
      hashResetToken(token),
      new Date(Date.now() + RESET_LINK_TTL_MINUTES * 60 * 1000)
    );

    const resetUrl = `${baseUrl}/member-signin/reset-password?token=${token}`;
    await Mailer.send(
      passwordResetEmail({
        to: user.email,
        name: user.fullName,
        resetUrl,
        expiresInMinutes: RESET_LINK_TTL_MINUTES,
        baseUrl,
      })
    );
  }

  /** Sets a new password from a reset link. The link stops working once used. */
  async resetPassword(token: string, password: string): Promise<void> {
    if (password.length < MIN_PASSWORD_LENGTH) {
      throw HttpError.badRequest("Some details need fixing.", {
        password: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
      });
    }

    const invalidLink = HttpError.badRequest("This reset link is invalid or has expired. Please request a new one.");
    if (!/^[0-9a-f]{64}$/.test(token)) throw invalidLink;

    const reset = await this.resets.findUsable(hashResetToken(token));
    if (!reset) throw invalidLink;

    const { hash, salt } = hashPassword(password);
    if (!(await this.resets.consume(reset, hash, salt))) throw invalidLink;
  }

  async seedDemoUsers(): Promise<SafeUser[]> {
    const seeded = await this.repository.seedDefaultUsers();
    return seeded.map(toSafeUser);
  }
}
