import { paymentCheckController } from "@/app/api/(features)/(pview)/payments/controller";
import { contributionAdminController } from "../controller";

// Opening the list also settles, in the background, orders whose browser never came back.
export const GET = (request: Request) => {
  paymentCheckController.checkSoon(request);
  return contributionAdminController.listContributions(request, undefined);
};
