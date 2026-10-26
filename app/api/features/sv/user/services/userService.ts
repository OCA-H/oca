import "server-only";
import { HttpError } from "@/app/api/core/httpError";
import { UserRepository } from "../repository/userRepository";
import type { User, SafeUser } from "../schema/userSchema";
import { verifyPassword, createSessionToken, type SessionUser } from "@/app/api/core/auth";

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
  constructor(private readonly repository: UserRepository) {}

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

  async seedDemoUsers(): Promise<SafeUser[]> {
    const seeded = await this.repository.seedDefaultUsers();
    return seeded.map(toSafeUser);
  }
}
