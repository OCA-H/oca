import "server-only";
import { BaseController } from "@/app/api/core/baseController";
import { UserRepository } from "@/app/api/(features)/(pview)/auth/repository/userRepository";
import { verifySvAuth } from "../../middleware/svAuthMiddleware";
import { ContributionService } from "../services/contributionService";
import { ContributionRepository } from "../repository/contributionRepository";

const PAYMENT_STATUS_PATH = "/sv/contribution/payment-status";
const SIGN_IN_MESSAGE = "Please sign in to make a contribution.";

// Contributions can be made by signed-in members, but no endpoint here reads them back: the only
// GET is the list of funds. Reading contributions is for a future admin-only area.
export class ContributionController extends BaseController {
  constructor(private readonly service: ContributionService) {
    super();
  }

  /**
   * GET /api/sv/contribution/funds
   * The funds the contribution form offers. Signed-in members only, like the form itself.
   */
  async listFunds(request: Request): Promise<Response> {
    return this.handle(async () => {
      await verifySvAuth(request, { unauthorizedMessage: SIGN_IN_MESSAGE });
      return this.ok({ data: await this.service.listFunds() });
    });
  }

  /**
   * POST /api/sv/contribution/checkout
   * Multipart form (it may carry the 80G documents). Signed-in members only. Stores the
   * contribution and returns what the browser posts to CCAvenue.
   */
  async checkout(request: Request): Promise<Response> {
    return this.handle(async () => {
      const session = await verifySvAuth(request, { unauthorizedMessage: SIGN_IN_MESSAGE });
      const form = await this.readForm(request);
      const checkout = await this.service.checkout(session, form, this.baseUrl(request));
      return this.ok({ data: checkout }, 201);
    });
  }

  /**
   * POST /api/sv/contribution/payment/response
   * CCAvenue's redirect_url and cancel_url. The browser arrives here from CCAvenue's site, which
   * does not carry the session cookie, so proxy.ts lets this one through: the response is
   * trusted because only CCAvenue can encrypt it with our working key. Always redirects to the
   * (signed-in) payment status page instead of returning JSON.
   */
  async paymentResponse(request: Request): Promise<Response> {
    const statusUrl = new URL(PAYMENT_STATUS_PATH, this.baseUrl(request));
    let form: FormData | null = null;
    try {
      form = await this.readForm(request);
      const contribution = await this.service.handleGatewayResponse(
        String(form.get("encResp") ?? ""),
        this.baseUrl(request)
      );
      statusUrl.searchParams.set("r", await this.service.resultToken(contribution));
    } catch (error) {
      console.error("CCAvenue contribution response failed:", error);
      const orderNo = form?.get("orderNo");
      if (typeof orderNo === "string" && orderNo) statusUrl.searchParams.set("order", orderNo);
      statusUrl.searchParams.set("error", "1");
    }
    return Response.redirect(statusUrl, 303);
  }
}

export const contributionRepository = new ContributionRepository();
export const contributionService = new ContributionService(contributionRepository, new UserRepository());
export const contributionController = new ContributionController(contributionService);
