import { paymentCheckController } from "../controller";

// Each order is a call to CCAvenue; give a full batch time to finish.
export const maxDuration = 60;

export const GET = (request: Request) => paymentCheckController.check(request);
