import "server-only";
import { HttpError, type FieldErrors } from "@/app/api/core/httpError";
import { Mailer } from "@/app/api/core/mailer";
import { getContactDetails, getRegistrationCcEmails } from "@/app/api/(features)/(pview)/site/services/siteContentService";
import { isUniqueViolation } from "@/app/api/core/baseRepository";
import { hashPassword, verifyPassword } from "@/app/api/core/auth";
import { dateOfBirthError } from "@/app/api/core/dateOfBirth";
import { storage, type StoredFile } from "@/app/api/core/storage";
import type { UploadedFile } from "@/app/api/core/fileUpload";
import { MembershipRepository } from "@/app/api/(features)/(pview)/membership/repository";
import { UserRepository } from "@/app/api/(features)/(pview)/auth/repository/userRepository";
import type { SignInMethod } from "@/app/api/core/session";
import type { User } from "@/app/api/(features)/(pview)/auth/schema/userSchema";
import type { LockedField, MemberProfile, MembershipCard, ProfileAddress, ProfileUpdate } from "../schema/profileSchema";

const TITLES = ["Mr.", "Mrs.", "Ms.", "Miss", "Dr.", "Prof.", "Br.", "Fr."];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** Digits with an optional leading +, after spaces, dashes, dots and brackets are dropped. */
const MOBILE_PATTERN = /^\+?\d{7,15}$/;
/** The oldest batch the membership form offers. */
const FIRST_BATCH_YEAR = 1941;
/** Longest value each My Account field takes, in line with the columns the membership form fills. */
const MAX_LENGTH: Record<string, number> = {
  title: 20,
  firstName: 80,
  middleName: 80,
  lastName: 80,
  email: 255,
  mobile: 20,
  line1: 200,
  line2: 200,
  line3: 200,
  city: 100,
  state: 100,
  zip: 20,
  country: 100,
};

/** Where a member's photo lives in storage. There is only ever one: a new upload replaces it. */
const photoFolder = (userId: number) => `users/${userId}/profile`;

/**
 * The photo's address for the browser: our own API, never the bucket. The version changes with
 * every upload, so a new photo is never served from a cached copy of the old one.
 */
function photoUrl(user: User): string | null {
  if (!user.avatarUrl) return null;
  const version = Number(user.metadata?.avatarVersion) || user.updatedAt.getTime();
  return `/api/sv/profile/photo?v=${version}`;
}

/** Membership types that never lapse, so the card reads "Valid: For life". */
const LIFETIME_TYPES = ["Life Member", "Honorary Member"];
const MIN_PASSWORD_LENGTH = 8;
/** Hashing cost grows with length, so very long input could be used to tie up the server. */
const MAX_PASSWORD_LENGTH = 128;

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
  if (method === "memberId" || method === "username") return [];
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
    username: user.username,
    fullName: user.fullName,
    ...nameParts(user),
    email: user.email ?? "",
    mobile: user.mobile ?? "",
    batchYear: user.batchYear,
    dateOfBirth: user.dateOfBirth,
    house: user.house,
    membershipType: user.membershipType,
    status: user.status,
    role: user.role,
    avatarUrl: photoUrl(user),
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
  constructor(
    private readonly users: UserRepository,
    private readonly memberships: MembershipRepository
  ) {}

  async get(userId: number, signInMethod: SignInMethod | undefined): Promise<MemberProfile> {
    return toProfile(await this.findUser(userId), signInMethod);
  }

  /** The e-Membership Card: the member's own record, plus the membership they paid for, if any. */
  async getCard(userId: number): Promise<MembershipCard> {
    const user = await this.findUser(userId);
    const paid = await this.memberships.findPaidByUserId(userId);
    const { firstName, lastName } = nameParts(user);

    return {
      memberId: user.memberId,
      name: [firstName, lastName].filter(Boolean).join(" ") || user.fullName,
      membershipType: user.membershipType,
      batchYear: user.batchYear,
      house: user.house,
      status: user.status,
      validity: LIFETIME_TYPES.includes(user.membershipType) ? "For life" : null,
      memberSince: (paid?.paidAt ?? user.createdAt).toISOString(),
      payment: paid && {
        orderId: paid.orderId,
        amount: paid.amount,
        currency: paid.currency,
        paidAt: paid.paidAt?.toISOString() ?? null,
        // CCAvenue sends the text "null" for fields it leaves empty.
        paymentMode: paid.paymentMode && paid.paymentMode !== "null" ? paid.paymentMode : null,
      },
    };
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
      email: locked.includes("email") ? (user.email ?? "") : text(payload.email).toLowerCase(),
      mobile: locked.includes("mobile") ? (user.mobile ?? "") : normalizeMobile(text(payload.mobile)),
      batchYear: text(payload.batchYear),
      dateOfBirth: text(payload.dateOfBirth),
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
    const { address, ...rest } = data;
    for (const [key, value] of Object.entries({ ...rest, ...address })) {
      const max = MAX_LENGTH[key];
      if (max && value.length > max) fields[key] = `Please keep this under ${max} characters.`;
    }
    if (!TITLES.includes(data.title) && data.title) fields.title = "Choose a title from the list.";
    if (!data.firstName) fields.firstName = "First name is required.";
    // Optional, as some members from the old site have none; once given it must be valid.
    if (data.email && !EMAIL_PATTERN.test(data.email)) fields.email = "Enter a valid email address.";
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
    // Optional for members who joined before it was asked, but once given it stays.
    if (data.dateOfBirth) {
      const dobError = dateOfBirthError(data.dateOfBirth);
      if (dobError) fields.dateOfBirth = dobError;
    } else if (user.dateOfBirth) {
      fields.dateOfBirth = "Date of birth is required.";
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
    const fullName = [title, firstName, middleName, lastName].filter(Boolean).join(" ");
    try {
      const updated = await this.users.update(userId, {
        fullName: fullName.slice(0, 150),
        email: data.email || null,
        mobile: data.mobile,
        batchYear: data.batchYear || null,
        dateOfBirth: data.dateOfBirth || null,
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

  /** Stores the member's photo as users/{id}/profile/profile.{ext}, replacing any earlier one. */
  async setPhoto(userId: number, photo: UploadedFile, signInMethod: SignInMethod | undefined): Promise<MemberProfile> {
    const user = await this.findUser(userId);
    const path = await storage.replaceIn(photoFolder(userId), `profile.${photo.extension}`, photo.bytes, {
      contentType: photo.contentType,
    });
    const updated = await this.users.update(userId, {
      avatarUrl: path,
      metadata: { ...user.metadata, avatarVersion: Date.now() },
    });
    return toProfile(updated!, signInMethod);
  }

  /** The member's own photo, or null if they have none. */
  async getPhoto(userId: number): Promise<StoredFile | null> {
    const user = await this.findUser(userId);
    // Only ever a file inside this member's own folder, whatever the column holds.
    if (!user.avatarUrl?.startsWith(`${photoFolder(userId)}/`)) return null;
    return storage.download(user.avatarUrl);
  }

  async changePassword(userId: number, current: string, next: string): Promise<void> {
    const user = await this.findUser(userId);

    if (!current || current.length > MAX_PASSWORD_LENGTH || !verifyPassword(current, user.passwordHash, user.passwordSalt)) {
      throw HttpError.badRequest("Some details need fixing.", { current: "Your current password is not correct." });
    }
    if (next.length < MIN_PASSWORD_LENGTH) {
      throw HttpError.badRequest("Some details need fixing.", {
        new: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
      });
    }
    if (next.length > MAX_PASSWORD_LENGTH) {
      throw HttpError.badRequest("Some details need fixing.", {
        new: `Password must be at most ${MAX_PASSWORD_LENGTH} characters.`,
      });
    }
    if (next === current) {
      throw HttpError.badRequest("Some details need fixing.", {
        new: "Choose a password different from your current one.",
      });
    }

    const { hash, salt } = hashPassword(next);
    await this.users.update(userId, { passwordHash: hash, passwordSalt: salt });
  }

  /**
   * Emails the suggestion to the Secretariat (the email under Contact details in the admin panel),
   * with the member's details so they can reply, copying the addresses set under Email settings.
   */
  async sendSuggestion(userId: number, subject: string, message: string): Promise<void> {
    const fields: FieldErrors = {};
    if (!subject) fields.subject = "Please add a subject.";
    if (!message) fields.message = "Please write your suggestion.";
    if (Object.keys(fields).length > 0) throw HttpError.badRequest("Some details need fixing.", fields);

    const user = await this.findUser(userId);
    const reach = user.email ? `<${user.email}>` : user.mobile ? `mobile ${user.mobile}` : "no email or mobile on file";
    const from = `${user.fullName} (${user.memberId}${user.batchYear ? `, Batch of ${user.batchYear}` : ""}) ${reach}`;
    const body = `Suggestion from ${from}\n\nSubject: ${subject}\n\n${message}`;
    const escape = (value: string) =>
      value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

    const [ccEmails, { email: secretariatEmail }] = await Promise.all([getRegistrationCcEmails(), getContactDetails()]);
    const cc = ccEmails.filter((email) => email !== secretariatEmail);
    await Mailer.send({
      to: secretariatEmail,
      ...(cc.length > 0 && { cc }),
      subject: `Member suggestion: ${subject}`,
      text: body,
      html: `<pre style="font-family:inherit;white-space:pre-wrap">${escape(body)}</pre>`,
    });
  }

  /**
   * The signed-in member's row. Sessions are signed cookies that last a week, so this is where
   * an account deactivated since sign-in stops working instead of waiting for the cookie to expire.
   */
  private async findUser(userId: number): Promise<User> {
    const user = await this.users.findById(userId);
    if (!user) throw HttpError.unauthorized("Your session is no longer valid. Please sign in again.");
    if (user.status !== "active") {
      throw HttpError.forbidden("Your account is currently inactive. Please contact the OCA Secretariat.");
    }
    return user;
  }
}
