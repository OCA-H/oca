import "server-only";
import { after } from "next/server";
import { BaseController } from "@/app/api/core/baseController";
import { clientIp } from "@/app/api/core/rateLimit";
import { ContactService } from "../services/contactService";

const SENT_MESSAGE = "Thank you. Your message has been sent to the OCA Secretariat, and a copy is on its way to your inbox.";

export class ContactController extends BaseController {
  constructor(private readonly service: ContactService) {
    super();
  }

  /**
   * POST /api/contact
   * Public: the "Get in touch" form on the home page. Emails the message to the Secretariat, then
   * sends the visitor a copy once the response has gone.
   */
  submit = (request: Request) =>
    this.handle(async () => {
      const body = await this.readJson(request);
      // A field people never see: only bots fill it. They are told it worked, and nothing is sent.
      if (typeof body.website === "string" && body.website.trim()) return this.ok({ message: SENT_MESSAGE });

      const inquiry = this.service.validate(body);
      const baseUrl = this.baseUrl(request);
      const receivedAt = await this.service.sendInquiry(inquiry, clientIp(request), baseUrl);
      after(() => this.service.sendAcknowledgement(inquiry, receivedAt, baseUrl));

      return this.ok({ message: SENT_MESSAGE });
    });
}

export const contactController = new ContactController(new ContactService());
