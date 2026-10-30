import "server-only";
import crypto from "node:crypto";
import { cacheLife, cacheTag, revalidateTag } from "next/cache";
import { HttpError } from "@/app/api/core/httpError";
import { storage, type StoredFile } from "@/app/api/core/storage";
import type { UploadedFile } from "@/app/api/core/fileUpload";
import { SiteContentRepository } from "../repository/siteContentRepository";
import { SECTION_SPECS, SITE_SECTION_KEYS, sectionSpec, type ContactDetailsContent, type EmailSettingsContent, type EventDinnerContent, type MembershipFeeContent, type EventLunchContent, type EventSportsContent, type HomeCommitteeContent, type HomeContent, type SectionSpec, type SiteSectionKey } from "../schema/sectionSpecs";
import { MEMBERSHIP_FEE_DEFAULTS, SECTION_DEFAULTS } from "./siteDefaults";
import { splitEmails, validateSection } from "./sectionValidator";

/** Every cached read of site content carries this tag, so a save refreshes the pages showing it. */
export const SITE_CONTENT_TAG = "site-content";

/** Uploaded section images live in storage under site/, e.g. site/home/events/<random>.jpg. */
const MEDIA_FOLDER = "site";
/** The public address that serves those files; see /api/site/media. */
const MEDIA_URL = "/api/site/media";
const SAFE_SEGMENT = /^[a-z0-9][a-z0-9._-]{0,99}$/i;

export interface SectionContent {
  key: SiteSectionKey;
  data: Record<string, unknown>;
  /** ISO time of the last save, or null while the section still shows its defaults. */
  updatedAt: string | null;
  isDefault: boolean;
}

/**
 * Hangout posts saved before a post could hold several photos or an uploaded video had a single
 * `image`; it becomes the post's only photo. For a video post it is kept as a still to show
 * until a video is uploaded (the editor hides it, and the next save drops it).
 */
function upgradeHangout(data: Record<string, unknown>): Record<string, unknown> {
  if (!Array.isArray(data.posts)) return data;
  const posts = data.posts.map((post: Record<string, unknown>) => {
    if (Array.isArray(post.images)) return post;
    const { image, imageAlt, ...rest } = post;
    return {
      ...rest,
      video: rest.video ?? "",
      images: typeof image === "string" && image ? [{ image, imageAlt: typeof imageAlt === "string" ? imageAlt : "" }] : [],
    };
  });
  return { ...data, posts };
}

/** Saved content over the defaults, so a field added to a spec later still has a value. */
const withDefaults = (key: SiteSectionKey, saved: Record<string, unknown> | undefined) => {
  const data = { ...SECTION_DEFAULTS[key], ...saved };
  return key === SITE_SECTION_KEYS.homeHangout ? upgradeHangout(data) : data;
};

/**
 * The home page's editable sections, cached until an admin saves one. Falls back to the defaults
 * if the database cannot be read, so the home page never fails because of it.
 */
export async function getHomeContent(): Promise<HomeContent> {
  "use cache";
  cacheTag(SITE_CONTENT_TAG);

  const keys = {
    ticker: SITE_SECTION_KEYS.homeTicker,
    events: SITE_SECTION_KEYS.homeEvents,
    notices: SITE_SECTION_KEYS.homeNotices,
    spotlight: SITE_SECTION_KEYS.homeSpotlight,
    hangout: SITE_SECTION_KEYS.homeHangout,
    social: SITE_SECTION_KEYS.homeSocial,
    gallery: SITE_SECTION_KEYS.homeGallery,
    committee: SITE_SECTION_KEYS.aboutCommittee,
  } satisfies Record<keyof HomeContent, SiteSectionKey>;

  const saved = new Map<string, Record<string, unknown>>();
  try {
    for (const row of await new SiteContentRepository().findByKeys(Object.values(keys))) saved.set(row.key, row.data);
  } catch (error) {
    console.error("Could not load site content; the home page is showing its defaults.", error);
    // Keep the fallback briefly, so the saved content returns within a minute or so of the database.
    cacheLife("minutes");
  }

  return Object.fromEntries(
    Object.entries(keys).map(([name, key]) => [name, withDefaults(key, saved.get(key))])
  ) as unknown as HomeContent;
}

/** One section's content (an event page's, say), cached and refreshed on save like the home page's. */
async function getSectionContent(key: SiteSectionKey): Promise<Record<string, unknown>> {
  "use cache";
  cacheTag(SITE_CONTENT_TAG);
  try {
    return withDefaults(key, (await new SiteContentRepository().findByKey(key))?.data);
  } catch (error) {
    console.error(`Could not load site content "${key}"; the page is showing its defaults.`, error);
    cacheLife("minutes");
    return withDefaults(key, undefined);
  }
}

export const getDinnerContent = async () => (await getSectionContent(SITE_SECTION_KEYS.eventsDinner)) as unknown as EventDinnerContent;
export const getLunchContent = async () => (await getSectionContent(SITE_SECTION_KEYS.eventsLunch)) as unknown as EventLunchContent;
export const getSportsContent = async () => (await getSectionContent(SITE_SECTION_KEYS.eventsSports)) as unknown as EventSportsContent;
/** The current office bearers, as set in the admin panel (About → Executive Committee). */
export const getCommitteeContent = async () => (await getSectionContent(SITE_SECTION_KEYS.aboutCommittee)) as unknown as HomeCommitteeContent;

/** The Life Membership fee in rupees, as set in the admin panel (Membership → Membership fee). */
export async function getMembershipFee(): Promise<number> {
  const { fee } = (await getSectionContent(SITE_SECTION_KEYS.membershipFee)) as unknown as MembershipFeeContent;
  return Number.isInteger(fee) && fee > 0 ? fee : MEMBERSHIP_FEE_DEFAULTS.fee;
}

/** The addresses to copy on every email the website sends (except password resets), as set in the admin panel. */
export async function getRegistrationCcEmails(): Promise<string[]> {
  const settings = (await getSectionContent(SITE_SECTION_KEYS.settingsEmails)) as unknown as EmailSettingsContent;
  return splitEmails(settings.registrationCc ?? "");
}

/** The Association's contact details, as set in the admin panel (Settings → Contact details). */
export const getContactDetails = async () => (await getSectionContent(SITE_SECTION_KEYS.settingsContact)) as unknown as ContactDetailsContent;

export class SiteContentService {
  constructor(private readonly repository: SiteContentRepository) {}

  /** When each section was last saved, for the admin dashboard. */
  async listSections(): Promise<Array<Omit<SectionContent, "data">>> {
    const rows = await this.repository.findByKeys(SECTION_SPECS.map((spec) => spec.key));
    return SECTION_SPECS.map((spec) => {
      const row = rows.find((r) => r.key === spec.key);
      return { key: spec.key, updatedAt: row?.updatedAt.toISOString() ?? null, isDefault: !row };
    });
  }

  async getSection(key: string): Promise<SectionContent> {
    const spec = this.findSpec(key);
    const row = await this.repository.findByKey(spec.key);
    return {
      key: spec.key,
      data: withDefaults(spec.key, row?.data),
      updatedAt: row?.updatedAt.toISOString() ?? null,
      isDefault: !row,
    };
  }

  /** Validates and saves a section, then refreshes every page that shows site content. */
  async saveSection(key: string, payload: Record<string, unknown>, userId: number): Promise<SectionContent> {
    const spec = this.findSpec(key);
    const { data, errors } = validateSection(spec, payload);
    if (Object.keys(errors).length > 0) throw HttpError.badRequest("Some details need fixing.", errors);

    const row = await this.repository.save(spec.key, data, userId);
    // expire: 0, so the next visit gets the new content instead of one more stale copy.
    revalidateTag(SITE_CONTENT_TAG, { expire: 0 });
    return { key: spec.key, data: row.data, updatedAt: row.updatedAt.toISOString(), isDefault: false };
  }

  /**
   * Stores an image or video for a section under a new random name, and returns its public address.
   * Names are never reused, so the address can be cached for good. Replaced files are kept:
   * a page cached elsewhere may still show them for a while.
   */
  async uploadMedia(key: string, file: UploadedFile): Promise<{ url: string }> {
    const spec = this.findSpec(key);
    const folder = spec.key.replace(/\./g, "/");
    const name = `${crypto.randomBytes(12).toString("hex")}.${file.extension}`;
    await storage.upload(`${MEDIA_FOLDER}/${folder}/${name}`, file.bytes, {
      contentType: file.contentType,
      upsert: false,
      cacheControl: "public, max-age=31536000, immutable",
    });
    return { url: `${MEDIA_URL}/${folder}/${name}` };
  }

  /** An uploaded section file, by the path after /api/site/media/, or null if there is none; `range` asks for part of it. */
  async getMedia(segments: string[], range?: string | null): Promise<StoredFile | null> {
    if (segments.length < 2 || segments.length > 4 || !segments.every((s) => SAFE_SEGMENT.test(s) && !s.includes(".."))) {
      return null;
    }
    return storage.download(`${MEDIA_FOLDER}/${segments.join("/")}`, range);
  }

  private findSpec(key: string): SectionSpec {
    const spec = sectionSpec(key);
    if (!spec) throw HttpError.notFound("There is no such section.");
    return spec;
  }
}
