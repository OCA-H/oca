import { membershipController } from "@/app/api/features/(pview)/membership";

// CCAvenue posts both successful and cancelled payments here.
export const POST = (request: Request) => membershipController.paymentResponse(request);
