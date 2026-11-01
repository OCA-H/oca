import "server-only";
import crypto from "node:crypto";
import { cacheLife, cacheTag, revalidateTag } from "next/cache";
import { HttpError } from "@/app/api/core/httpError";
import { storage, type StoredFile } from "@/app/api/core/storage";
import { assertUploadSize, detectUploadKind, wrongUploadKind, type FileKind, type UploadRules } from "@/app/api/core/fileUpload";
import { SiteContentRepository } from "../repository/siteContentRepository";
import { SECTION_SPECS, SITE_SECTION_KEYS, sectionSpec, type CommitteeContent, type ContactDetailsContent, type EmailSettingsContent, type EventDinnerContent, type MembershipFeeContent, type EventLunchContent, type EventSportsContent, type HomeContent, type SectionSpec, type SiteSectionKey } from "../schema/sectionSpecs";
import { MEMBERSHIP_FEE_DEFAULTS, SECTION_DEFAULTS } from "./siteDefaults";
import { splitEmails, validateSection } from "./sectionValidator";

/** Every cached read of site content carries this tag, so a save refreshes the pages showing it. */
export const SITE_CONTENT_TAG = "site-content";

/** Uploaded section images live in storage under site/, e.g. site/home/events/<random>.jpg. */
const MEDIA_FOLDER = "site";
/** The public address that serves those files; see /api/site/media. */
const MEDIA_URL = "/api/site/media";
const SAFE_SEGMENT = /^[a-z0-9][a-z0-9._-]{0,99}$/i;
/** A name startMediaUpload gives: 24 hex characters and an extension. */
const UPLOAD_NAME = /^[0-9a-f]{24}\.[a-z0-9]{2,5}$/;
/**
 * How long an upload no save uses is kept before a save may delete it: longer than an upload can
 * take (its signed address lasts two hours), so a save never deletes another admin's upload in progress.
 */
const UNSAVED_UPLOAD_GRACE_MS = 3 * 60 * 60 * 1000;

/** The uploaded files `data` uses, as paths under site/ ("home/hangout/<name>"), found at any depth. */
function mediaPaths(data: unknown, found = new Set<string>()): Set<string> {
  if (typeof data === "string") {
    if (data.startsWith(`${MEDIA_URL}/`)) found.add(data.slice(MEDIA_URL.length + 1));
  } else if (Array.isArray(data)) {
    for (const value of data) mediaPaths(value, found);
  } else if (data && typeof data === "object") {
    for (const value of Object.values(data)) mediaPaths(value, found);
  }
  return found;
}

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

/**
 * The committee saved before it held every term had only the current office bearers, as `members`
 * (photo, name, role, initials). They become the current term's office bearers, keeping the batch,
 * email and profession of the default bearer of the same name; their photos stay where they are,
 * since the section and its storage folder are the same. The next save drops `members`.
 */
function upgradeCommittee(data: Record<string, unknown>, saved: Record<string, unknown> | undefined): Record<string, unknown> {
  const { members, ...rest } = data;
  if (!saved || "terms" in saved || !Array.isArray(members) || members.length === 0) return rest;
  const [current, ...previous] = (rest.terms as CommitteeContent["terms"]) ?? [];
  if (!current) return rest;
  const text = (value: unknown) => (typeof value === "string" ? value : "");
  const officeBearers = members.map((member: Record<string, unknown>) => {
    const name = text(member.name);
    const known = current.officeBearers.find((b) => b.name.trim().toLowerCase() === name.trim().toLowerCase());
    return {
      roleSub: "",
      batch: "",
      profession: "",
      email: "",
      ...known,
      image: text(member.image),
      imageAlt: text(member.imageAlt),
      initials: text(member.initials),
      name,
      role: text(member.role).toUpperCase(),
    };
  });
  return { ...rest, terms: [{ ...current, officeBearers }, ...previous] };
}

/** Saved content over the defaults, so a field added to a spec later still has a value. */
const withDefaults = (key: SiteSectionKey, saved: Record<string, unknown> | undefined) => {
  const data = { ...SECTION_DEFAULTS[key], ...saved };
  if (key === SITE_SECTION_KEYS.homeHangout) return upgradeHangout(data);
  if (key === SITE_SECTION_KEYS.aboutCommittee) return upgradeCommittee(data, saved);
  return data;
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
/** Every committee term, the current one first, as set in the admin panel (About → Executive Committee). */
export const getCommitteeContent = async () => (await getSectionContent(SITE_SECTION_KEYS.aboutCommittee)) as unknown as CommitteeContent;

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

    const previous = await this.repository.findByKey(spec.key);
    const row = await this.repository.save(spec.key, data, userId);
    // expire: 0, so the next visit gets the new content instead of one more stale copy.
    revalidateTag(SITE_CONTENT_TAG, { expire: 0 });
    // The save stands even if storage cannot be tidied now; the next save tries again.
    await this.pruneMedia(spec.key, previous?.data).catch((error) => console.error(`Could not prune media for "${spec.key}":`, error));
    return { key: spec.key, data: row.data, updatedAt: row.updatedAt.toISOString(), isDefault: false };
  }

  /**
   * Starts an upload of an image or video for a section: picks a new random name for it and returns
   * an address the browser sends the file to directly, since files this big cannot pass through
   * our own API on Vercel. Names are never reused, so the file's address can be cached for good.
   * The upload counts only once finishMediaUpload has checked it, and stays only once a save
   * uses it: saving deletes the section's files nothing uses any more (see pruneMedia).
   */
  async startMediaUpload(key: string, kind: FileKind): Promise<{ uploadUrl: string; name: string; contentType: string }> {
    const folder = this.mediaFolder(key);
    const name = `${crypto.randomBytes(12).toString("hex")}.${kind.extension}`;
    const uploadUrl = await storage.createSignedUploadUrl(`${MEDIA_FOLDER}/${folder}/${name}`);
    return { uploadUrl, name, contentType: kind.contentType };
  }

  /**
   * Checks a file the browser uploaded after startMediaUpload, by its real size and first bytes
   * against `rules`, and returns its public address. A file that fails is deleted; the problem
   * comes back as a 400 on `field`.
   */
  async finishMediaUpload(key: string, name: string, field: string, rules: UploadRules): Promise<{ url: string }> {
    const folder = this.mediaFolder(key);
    const extension = name.split(".").pop();
    if (!UPLOAD_NAME.test(name) || !rules.kinds.some((k) => k.extension === extension)) {
      throw HttpError.badRequest("That upload is not one we started.");
    }
    const path = `${MEDIA_FOLDER}/${folder}/${name}`;
    const head = await storage.download(path, "bytes=0-15");
    if (!head) throw HttpError.badRequest(`The ${rules.label} did not finish uploading. Please try again.`, { [field]: "Upload failed." });

    const bytes = new Uint8Array(await new Response(head.body).arrayBuffer());
    const total = head.contentRange?.match(/\/(\d+)$/)?.[1];
    try {
      assertUploadSize(total ? Number(total) : (head.size ?? bytes.length), field, rules);
      // Its bytes must be the kind its name says, so it is served with the right type.
      if (detectUploadKind(bytes, field, rules).extension !== extension) throw wrongUploadKind(field, rules);
    } catch (error) {
      await storage.remove([path]).catch(() => {});
      throw error;
    }
    return { url: `${MEDIA_URL}/${folder}/${name}` };
  }

  /**
   * Deletes files uploaded for a save that then failed, so they are not left behind. Only files of
   * this section's that no saved section uses are deleted; anything else in `urls` is ignored.
   */
  async discardMedia(key: string, urls: string[]): Promise<void> {
    const folder = this.mediaFolder(key);
    const names = urls.flatMap((url) => {
      const name = url.startsWith(`${MEDIA_URL}/${folder}/`) ? url.slice(`${MEDIA_URL}/${folder}/`.length) : "";
      return UPLOAD_NAME.test(name) ? [`${folder}/${name}`] : [];
    });
    if (names.length === 0) return;
    const used = await this.usedMedia();
    await storage.remove(names.filter((name) => !used.has(name)).map((name) => `${MEDIA_FOLDER}/${name}`));
  }

  /**
   * After a save, deletes the section's uploaded files that no saved section uses any more: the
   * ones its previous content used (replaced or removed) at once, and any others (uploads never
   * saved, e.g. a tab closed mid-save) once they are old enough that no upload can still be
   * waiting for its save.
   */
  private async pruneMedia(key: string, previous: Record<string, unknown> | undefined): Promise<void> {
    const folder = this.mediaFolder(key);
    const used = await this.usedMedia();
    const replaced = previous ? mediaPaths(previous) : new Set<string>();
    const cutoff = Date.now() - UNSAVED_UPLOAD_GRACE_MS;
    const unused = (await storage.listFiles(`${MEDIA_FOLDER}/${folder}`)).filter(({ name, createdAt }) => {
      const path = `${folder}/${name}`;
      if (!UPLOAD_NAME.test(name) || used.has(path)) return false;
      return replaced.has(path) || (createdAt !== null && createdAt.getTime() < cutoff);
    });
    await storage.remove(unused.map(({ name }) => `${MEDIA_FOLDER}/${folder}/${name}`));
  }

  /** Every uploaded file any saved section uses, as "home/hangout/<name>". Across sections, in case one links another's file. */
  private async usedMedia(): Promise<Set<string>> {
    const rows = await this.repository.findByKeys(SECTION_SPECS.map((spec) => spec.key));
    return new Set(rows.flatMap((row) => [...mediaPaths(row.data)]));
  }

  /** Where a section's uploads live under site/, e.g. "home/hangout" for home.hangout. */
  private mediaFolder(key: string): string {
    return this.findSpec(key).key.replace(/\./g, "/");
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
