import { contributionController } from "../controller";

export const POST = (request: Request) => contributionController.checkout(request);
