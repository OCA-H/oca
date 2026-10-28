import "server-only";
import { BaseController } from "@/app/api/core/baseController";
import type { SessionData } from "@/app/api/core/session";
import { withSvAuth } from "../../middleware/svAuthMiddleware";
import { MembershipRepository } from "@/app/api/features/(pview)/membership/repository";
import { userRepository } from "../../user/controller/userController";
import { ProfileService } from "../services/profileService";

const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");

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
