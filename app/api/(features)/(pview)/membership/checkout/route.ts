import { membershipController } from "../controller";

export const POST = (request: Request) => membershipController.checkout(request);
