import "server-only";
import { BaseController } from "@/app/api/core/baseController";
import { UserRepository } from "@/app/api/features/sv/user/repository/userRepository";
import { MembershipService } from "../services/membershipService";
import { MembershipRepository } from "../repository/membershipRepository";

const PAYMENT_STATUS_PATH = "/membership/payment-status";

export class MembershipController extends BaseController {
  constructor(private readonly service: MembershipService) {
    super();
  }

  /**
   * POST /api/membership/checkout
   * Stores the application and returns what the browser posts to CCAvenue.
   */
  async checkout(request: Request): Promise<Response> {
    return this.handle(async () => {
      const body = await this.readJson(request);
      const checkout = await this.service.checkout(body, this.baseUrl(request));
      return this.ok({ data: checkout }, 201);
    });
  }

  /**
   * POST /api/membership/payment/response
   * CCAvenue's redirect_url and cancel_url. The browser arrives here from the gateway, so this
   * always redirects to the payment status page instead of returning JSON.
   */
  async paymentResponse(request: Request): Promise<Response> {
    const statusUrl = new URL(PAYMENT_STATUS_PATH, this.baseUrl(request));
    let form: FormData | null = null;
    try {
      form = await this.readForm(request);
      const application = await this.service.handleGatewayResponse(String(form.get("encResp") ?? ""));
      statusUrl.searchParams.set("order", application.orderId);
    } catch (error) {
      console.error("CCAvenue membership response failed:", error);
      const orderNo = form?.get("orderNo");
      if (typeof orderNo === "string" && orderNo) statusUrl.searchParams.set("order", orderNo);
      statusUrl.searchParams.set("error", "1");
    }
    return Response.redirect(statusUrl, 303);
  }

  /**
   * GET /api/membership/orders/[orderId]
   * Payment result shown on the status page.
   */
  async getOrder(_request: Request, orderId: string): Promise<Response> {
    return this.handle(async () => {
      const order = await this.service.getOrderSummary(orderId);
      return this.ok({ data: order });
    });
  }
}

export const membershipRepository = new MembershipRepository();
export const membershipService = new MembershipService(membershipRepository, new UserRepository());
export const membershipController = new MembershipController(membershipService);
