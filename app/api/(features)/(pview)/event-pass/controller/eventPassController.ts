import "server-only";
import { BaseController } from "@/app/api/core/baseController";
import { HttpError } from "@/app/api/core/httpError";
import { verifySvAuth } from "@/app/api/(features)/sv/middleware/svAuthMiddleware";
import { UserRepository } from "@/app/api/(features)/(pview)/auth/repository/userRepository";
import { EventPassService } from "../services/eventPassService";
import { EventPassBookingService } from "../services/eventPassBookingService";
import { EventPassRepository } from "../repository/eventPassRepository";
import { EventPassBookingRepository } from "../repository/eventPassBookingRepository";

const PAYMENT_STATUS_PATH = "/annual-dinner/payment-status";

/** Prices are charged from event_passes, so only admins may change them. */
const requireAdmin = (request: Request) =>
  verifySvAuth(request, { roles: ["admin"], forbiddenMessage: "Only administrators can manage passes." });

export class EventPassController extends BaseController {
  constructor(private readonly service: EventPassService) {
    super();
  }

  async listPasses(request: Request): Promise<Response> {
    return this.handle(async () => {
      const url = new URL(request.url);
      const eventName = url.searchParams.get("eventName") || url.searchParams.get("event_name") || undefined;
      const status = url.searchParams.get("status") || undefined;
      const tierGroup = url.searchParams.get("tierGroup") || url.searchParams.get("tier_group") || undefined;

      const passes = await this.service.list({ eventName, status, tierGroup });
      return this.ok({ count: passes.length, data: passes });
    });
  }

  async getPass(request: Request, idOrPassId: string): Promise<Response> {
    return this.handle(async () => {
      const url = new URL(request.url);
      const eventName = url.searchParams.get("eventName") || url.searchParams.get("event_name") || undefined;

      const pass = await this.service.get(idOrPassId, eventName);
      return this.ok({ data: pass });
    });
  }

  async createPass(request: Request): Promise<Response> {
    return this.handle(async () => {
      await requireAdmin(request);
      const body = await this.readJson(request);
      const pass = await this.service.create(body);
      return this.ok({ data: pass }, 201);
    });
  }

  async updatePass(request: Request, id: string): Promise<Response> {
    return this.handle(async () => {
      await requireAdmin(request);
      const numericId = Number(id);
      if (Number.isNaN(numericId) || numericId <= 0) {
        throw HttpError.badRequest("Invalid pass id.");
      }
      const body = await this.readJson(request);
      const pass = await this.service.update(numericId, body);
      return this.ok({ data: pass });
    });
  }

  async deletePass(request: Request, id: string): Promise<Response> {
    return this.handle(async () => {
      await requireAdmin(request);
      const numericId = Number(id);
      if (Number.isNaN(numericId) || numericId <= 0) {
        throw HttpError.badRequest("Invalid pass id.");
      }
      await this.service.delete(numericId);
      return this.ok({ message: `Pass with id ${numericId} deleted successfully.` });
    });
  }

  async seedPasses(request: Request): Promise<Response> {
    return this.handle(async () => {
      await requireAdmin(request);
      const url = new URL(request.url);
      const eventName = url.searchParams.get("eventName") || url.searchParams.get("event_name") || "annual-dinner";
      const passes = await this.service.seed(eventName);
      return this.ok({ message: `Default passes for "${eventName}" seeded successfully.`, count: passes.length, data: passes });
    });
  }
}

export class EventPassBookingController extends BaseController {
  constructor(private readonly service: EventPassBookingService) {
    super();
  }

  /**
   * POST /api/event-pass/checkout
   * Signed-in members only. Stores the booking and returns what the browser posts to CCAvenue.
   */
  async checkout(request: Request): Promise<Response> {
    return this.handle(async () => {
      const session = await verifySvAuth(request, { unauthorizedMessage: "Please sign in to buy a pass." });
      const body = await this.readJson(request);
      const checkout = await this.service.checkout(session, body, this.baseUrl(request));
      return this.ok({ data: checkout }, 201);
    });
  }

  /**
   * POST /api/event-pass/payment/response
   * CCAvenue's redirect_url and cancel_url. The browser arrives here from the gateway, so this
   * always redirects to the payment status page instead of returning JSON.
   */
  async paymentResponse(request: Request): Promise<Response> {
    const statusUrl = new URL(PAYMENT_STATUS_PATH, this.baseUrl(request));
    let form: FormData | null = null;
    try {
      form = await this.readForm(request);
      const booking = await this.service.handleGatewayResponse(String(form.get("encResp") ?? ""), this.baseUrl(request));
      statusUrl.searchParams.set("order", booking.orderId);
    } catch (error) {
      console.error("CCAvenue pass response failed:", error);
      const orderNo = form?.get("orderNo");
      if (typeof orderNo === "string" && orderNo) statusUrl.searchParams.set("order", orderNo);
      statusUrl.searchParams.set("error", "1");
    }
    return Response.redirect(statusUrl, 303);
  }

  /**
   * GET /api/event-pass/orders/[orderId]
   * Payment result shown on the status page.
   */
  async getOrder(_request: Request, orderId: string): Promise<Response> {
    return this.handle(async () => {
      const order = await this.service.getOrderSummary(orderId);
      return this.ok({ data: order });
    });
  }
}

export const eventPassRepository = new EventPassRepository();
export const eventPassService = new EventPassService(eventPassRepository);
export const eventPassController = new EventPassController(eventPassService);

export const eventPassBookingService = new EventPassBookingService(
  eventPassRepository,
  new EventPassBookingRepository(),
  new UserRepository()
);
export const eventPassBookingController = new EventPassBookingController(eventPassBookingService);

