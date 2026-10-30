import "server-only";
import { BaseController } from "@/app/api/core/baseController";
import { IMAGE_KINDS, VIDEO_KINDS, readUploadedFile } from "@/app/api/core/fileUpload";
import { HttpError } from "@/app/api/core/httpError";
import { siteContentService, type SiteContentService } from "@/app/api/(features)/(pview)/site";
import { withAdminAuth } from "../middleware/adminAuth";

/** Section images: JPG, PNG or WebP, up to 10 MB. */
export const SITE_IMAGE_RULES = { maxBytes: 10 * 1024 * 1024, kinds: IMAGE_KINDS, label: "image" };
/** Section videos (OCA Hangout posts): MP4, MOV or WebM, up to 20 MB. */
export const SITE_VIDEO_RULES = { maxBytes: 20 * 1024 * 1024, kinds: VIDEO_KINDS, label: "video" };

type SectionContext = { params: Promise<{ key: string }> };

// Every action runs behind withAdminAuth: signed in, and an admin in the database.
export class AdminController extends BaseController {
  constructor(private readonly content: SiteContentService) {
    super();
  }

  /** GET /api/sv/admin/me: the signed-in admin, for the admin panel's menu. */
  me = withAdminAuth((_request, admin) =>
    this.handle(async () =>
      this.ok({ data: { id: admin.id, memberId: admin.memberId, fullName: admin.fullName, email: admin.email, role: admin.role } })
    )
  );

  /** GET /api/sv/admin/content: when each editable section was last saved. */
  listSections = withAdminAuth(() => this.handle(async () => this.ok({ data: await this.content.listSections() })));

  /** GET /api/sv/admin/content/{key} */
  getSection = withAdminAuth<SectionContext>((_request, _admin, _session, context) =>
    this.handle(async () => {
      const { key } = await context.params;
      return this.ok({ data: await this.content.getSection(key) });
    })
  );

  /** PUT /api/sv/admin/content/{key}: replaces the section's content. */
  saveSection = withAdminAuth<SectionContext>((request, admin, _session, context) =>
    this.handle(async () => {
      const { key } = await context.params;
      const body = await this.readJson(request);
      const saved = await this.content.saveSection(key, body, admin.id);
      return this.ok({ message: "Saved. The website now shows your changes.", data: saved });
    })
  );

  /**
   * POST /api/sv/admin/media (multipart: "section", and "image" or "video"): stores the file and
   * returns its address. Each kind is held to its own size limit and file types.
   */
  uploadMedia = withAdminAuth((request) =>
    this.handle(async () => {
      const form = await this.readForm(request);
      const section = form.get("section");
      if (typeof section !== "string" || !section) throw HttpError.badRequest("Say which section the file is for.");
      const file = form.has("video")
        ? await readUploadedFile(form, "video", SITE_VIDEO_RULES)
        : await readUploadedFile(form, "image", SITE_IMAGE_RULES);
      return this.ok({ data: await this.content.uploadMedia(section, file) }, 201);
    })
  );
}

export const adminController = new AdminController(siteContentService);
