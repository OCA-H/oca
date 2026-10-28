import "server-only";
import { HttpError, type FieldErrors } from "@/app/api/core/httpError";
import { Mailer } from "@/app/api/core/mailer";
import { isUniqueViolation } from "@/app/api/core/baseRepository";
import { hashPassword, verifyPassword } from "@/app/api/core/auth";
import { UserRepository } from "../../user/repository/userRepository";
import type { SignInMethod } from "@/app/api/core/session";
import type { User } from "../../user/schema/userSchema";
import type { LockedField, MemberProfile, ProfileAddress, ProfileUpdate } from "../schema/profileSchema";

const TITLES = ["Mr.", "Mrs.", "Ms.", "Miss", "Dr.", "Prof.", "Br.", "Fr."];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** Digits with an optional leading +, after spaces, dashes, dots and brackets are dropped. */
const MOBILE_PATTERN = /^\+?\d{7,15}$/;
/** The oldest batch the membership form offers. */
const FIRST_BATCH_YEAR = 1941;
const MIN_PASSWORD_LENGTH = 8;
const SECRETARIAT_EMAIL = process.env.SECRETARIAT_EMAIL || "info@oldcolumban.net";

const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");

/** "+91 98100-12345" → "+919810012345", so sign-in by mobile matches whatever format was typed here. */
const normalizeMobile = (value: string) => value.replace(/[\s\-().]/g, "");

/**
 * The identifier a member signed in with stays as it is, so they can always sign in the same
 * way again. Sessions from before the method was recorded lock both, to be safe.
 */
function lockedFieldsFor(method: SignInMethod | undefined): LockedField[] {
  if (method === "email") return ["email"];
  if (method === "mobile") return ["mobile"];
  if (method === "memberId") return [];
  return ["email", "mobile"];
}

type Metadata = Record<string, unknown>;

/** Name parts saved by the profile form, else split from fullName ("Mr. Aryan Kumar Mehra"). */
function nameParts(user: User) {
  const saved = (user.metadata?.name ?? {}) as Metadata;
  if (text(saved.firstName)) {
    return {
      title: text(saved.title),
      firstName: text(saved.firstName),
      middleName: text(saved.middleName),
      lastName: text(saved.lastName),
    };
  }

  const words = user.fullName.trim().split(/\s+/);
  const title = TITLES.includes(words[0]) ? words.shift()! : "";
  const firstName = words.shift() ?? "";
  const lastName = words.pop() ?? "";
  return { title, firstName, middleName: words.join(" "), lastName };
}

function toProfile(user: User, signInMethod: SignInMethod | undefined): MemberProfile {
  const address = (user.metadata?.address ?? {}) as Metadata;
  return {
    id: user.id,
    memberId: user.memberId,
    fullName: user.fullName,
    ...nameParts(user),
    email: user.email,
    mobile: user.mobile ?? "",
    batchYear: user.batchYear,
    house: user.house,
    membershipType: user.membershipType,
    status: user.status,
    avatarUrl: user.avatarUrl,
    address: {
      line1: text(address.line1),
      line2: text(address.line2),
      line3: text(address.line3),
      city: text(address.city),
      state: text(address.state),
      zip: text(address.zip),
      country: text(address.country) || "India",
    },
    lockedFields: lockedFieldsFor(signInMethod),
  };
}

export class ProfileService {
  constructor(private readonly users: UserRepository) {}

  async get(userId: number, signInMethod: SignInMethod | undefined): Promise<MemberProfile> {
    return toProfile(await this.findUser(userId), signInMethod);
  }

  /**
   * Saves the My Account form. Member ID and membership type are not editable here, and neither
   * is the email or mobile this session signed in with: those keep their saved value whatever is sent.
   */
  async update(userId: number, payload: Record<string, unknown>, signInMethod: SignInMethod | undefined): Promise<MemberProfile> {
    const user = await this.findUser(userId);
    const locked = lockedFieldsFor(signInMethod);
    const input = (payload.address ?? {}) as Metadata;
    const data: ProfileUpdate = {
      title: text(payload.title),
      firstName: text(payload.firstName),
      middleName: text(payload.middleName),
      lastName: text(payload.lastName),
      email: locked.includes("email") ? user.email : text(payload.email).toLowerCase(),
      mobile: locked.includes("mobile") ? (user.mobile ?? "") : normalizeMobile(text(payload.mobile)),
      batchYear: text(payload.batchYear),
      address: {
        line1: text(input.line1),
        line2: text(input.line2),
        line3: text(input.line3),
        city: text(input.city),
        state: text(input.state),
        zip: text(input.zip),
        country: text(input.country),
      },
    };

    const fields: FieldErrors = {};
    if (!data.firstName) fields.firstName = "First name is required.";
    if (!data.lastName) fields.lastName = "Last name is required.";
    if (!EMAIL_PATTERN.test(data.email)) fields.email = "Enter a valid email address.";
    if (!data.mobile) fields.mobile = "Mobile is required.";
    else if (!locked.includes("mobile") && !MOBILE_PATTERN.test(data.mobile)) {
      fields.mobile = "Enter a valid mobile number, with the country code if outside India.";
    }
    if (data.batchYear) {
      const year = Number(data.batchYear);
      if (!/^\d{4}$/.test(data.batchYear) || year < FIRST_BATCH_YEAR || year > new Date().getFullYear()) {
        fields.batchYear = "Choose your batch from the list.";
      }
    } else if (user.batchYear) {
      fields.batchYear = "Batch is required.";
    }
    const requiredAddress: Array<[keyof ProfileAddress, string]> = [
      ["line1", "Address line 1"],
      ["city", "City"],
      ["state", "State"],
      ["zip", "Zip"],
      ["country", "Country"],
    ];
    for (const [key, label] of requiredAddress) {
      if (!data.address[key]) fields[key] = `${label} is required.`;
    }
    // Mobile is a sign-in identifier, so two members sharing one would make sign-in ambiguous.
    if (!fields.mobile && data.mobile !== user.mobile) {
      const owner = await this.users.findByMobile(data.mobile);
      if (owner && owner.id !== userId) fields.mobile = "Another member already uses this mobile number.";
    }
    if (Object.keys(fields).length > 0) throw HttpError.badRequest("Some details need fixing.", fields);

    const { title, firstName, middleName, lastName } = data;
    try {
      const updated = await this.users.update(userId, {
        fullName: [title, firstName, middleName, lastName].filter(Boolean).join(" "),
        email: data.email,
        mobile: data.mobile,
        batchYear: data.batchYear || null,
        metadata: {
          ...user.metadata,
          name: { title, firstName, middleName, lastName },
          address: data.address,
        },
      });
      return toProfile(updated!, signInMethod);
    } catch (error) {
      if (isUniqueViolation(error, "users_email_unique")) {
        throw HttpError.badRequest("Some details need fixing.", {
          email: "Another member already uses this email address.",
        });
      }
      throw error;
    }
  }

  async changePassword(userId: number, current: string, next: string): Promise<void> {
    const user = await this.findUser(userId);

    if (!verifyPassword(current, user.passwordHash, user.passwordSalt)) {
      throw HttpError.badRequest("Some details need fixing.", { current: "Your current password is not correct." });
    }
    if (next.length < MIN_PASSWORD_LENGTH) {
      throw HttpError.badRequest("Some details need fixing.", {
        new: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
      });
    }

    const { hash, salt } = hashPassword(next);
    await this.users.update(userId, { passwordHash: hash, passwordSalt: salt });
  }

  /** Emails the suggestion to the Secretariat, with the member's details so they can reply. */
  async sendSuggestion(userId: number, subject: string, message: string): Promise<void> {
    const fields: FieldErrors = {};
    if (!subject) fields.subject = "Please add a subject.";
    if (!message) fields.message = "Please write your suggestion.";
    if (Object.keys(fields).length > 0) throw HttpError.badRequest("Some details need fixing.", fields);

    const user = await this.findUser(userId);
    const from = `${user.fullName} (${user.memberId}${user.batchYear ? `, Batch of ${user.batchYear}` : ""}) <${user.email}>`;
    const body = `Suggestion from ${from}\n\nSubject: ${subject}\n\n${message}`;
    const escape = (value: string) =>
      value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

    await Mailer.send({
      to: SECRETARIAT_EMAIL,
      subject: `Member suggestion: ${subject}`,
      text: body,
      html: `<pre style="font-family:inherit;white-space:pre-wrap">${escape(body)}</pre>`,
    });
  }

  private async findUser(userId: number): Promise<User> {
    const user = await this.users.findById(userId);
    if (!user) throw HttpError.notFound("Member not found.");
    return user;
  }
}
