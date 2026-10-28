import "server-only";
import { BaseController } from "@/app/api/core/baseController";
import type { SessionData } from "@/app/api/core/session";
import { IMAGE_KINDS, readUploadedFile } from "@/app/api/core/fileUpload";
import { HttpError } from "@/app/api/core/httpError";
import { withSvAuth } from "../../middleware/svAuthMiddleware";
import { MembershipRepository } from "@/app/api/(features)/(pview)/membership/repository";
import { userRepository } from "@/app/api/(features)/(pview)/auth/controller/userController";
import { ProfileService } from "../services/profileService";

const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");

/** Profile photos: JPG, PNG or WebP, up to 10 MB. */
export const PROFILE_PHOTO_RULES = { maxBytes: 10 * 1024 * 1024, kinds: IMAGE_KINDS, label: "photo" };

// Every action runs behind withSvAuth, so it only ever touches the signed-in member's own row.
export class ProfileController extends BaseController {
  constructor(private readonly service: ProfileService) {
    super();
  }

  /** GET /api/sv/profile */
  get = withSvAuth((_request: Request, session: SessionData) =>
    this.handle(async () => this.ok({ data: await this.service.get(session.user.id, session.user.signInMethod) }))
  );

  /** GET /api/sv/profile/card */
  getCard = withSvAuth((_request: Request, session: SessionData) =>
    this.handle(async () => this.ok({ data: await this.service.getCard(session.user.id) }))
  );

  /** GET /api/sv/profile/photo: the member's own photo, streamed from storage. */
  getPhoto = withSvAuth((_request: Request, session: SessionData) =>
    this.handle(async () => {
      const photo = await this.service.getPhoto(session.user.id);
      if (!photo) throw HttpError.notFound("No photo yet.");
      return new Response(photo.body, {
        headers: {
          "Content-Type": photo.contentType,
          ...(photo.size !== null && { "Content-Length": String(photo.size) }),
          // Private to this member; the ?v= in the URL changes with each upload, so it can be kept.
          "Cache-Control": "private, max-age=86400",
          "X-Content-Type-Options": "nosniff",
        },
      });
    })
  );

  /** POST /api/sv/profile/photo (multipart, field "photo") */
  uploadPhoto = withSvAuth((request: Request, session: SessionData) =>
    this.handle(async () => {
      const photo = await readUploadedFile(await this.readForm(request), "photo", PROFILE_PHOTO_RULES);
      const profile = await this.service.setPhoto(session.user.id, photo, session.user.signInMethod);
      return this.ok({ message: "Your photo has been updated.", data: profile });
    })
  );

  /** PATCH /api/sv/profile */
  update = withSvAuth((request: Request, session: SessionData) =>
    this.handle(async () => {
      const body = await this.readJson(request);
      const profile = await this.service.update(session.user.id, body, session.user.signInMethod);
      return this.ok({ message: "Your details have been saved.", data: profile });
    })
  );

  /** POST /api/sv/profile/password */
  changePassword = withSvAuth((request: Request, session: SessionData) =>
    this.handle(async () => {
      const body = await this.readJson(request);
      const current = typeof body.current === "string" ? body.current : "";
      const next = typeof body.new === "string" ? body.new : "";
      await this.service.changePassword(session.user.id, current, next);
      return this.ok({ message: "Your password has been updated." });
    })
  );

  /** POST /api/sv/profile/suggestion */
  sendSuggestion = withSvAuth((request: Request, session: SessionData) =>
    this.handle(async () => {
      const body = await this.readJson(request);
      await this.service.sendSuggestion(session.user.id, text(body.subject), text(body.message));
      return this.ok({ message: "Your suggestion has been sent." });
    })
  );
}

export const profileController = new ProfileController(new ProfileService(userRepository, new MembershipRepository()));
