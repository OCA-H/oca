import { contributionController } from "../../controller";

// CCAvenue posts both successful and cancelled payments here.
export const POST = (request: Request) => contributionController.paymentResponse(request);
