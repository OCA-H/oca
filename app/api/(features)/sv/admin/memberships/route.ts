import { paymentCheckController } from "@/app/api/(features)/(pview)/payments/controller";
import { membershipAdminController } from "../controller";

// Opening the list also settles, in the background, orders whose browser never came back.
export const GET = (request: Request) => {
  paymentCheckController.checkSoon(request);
  return membershipAdminController.listMemberships(request, undefined);
};
