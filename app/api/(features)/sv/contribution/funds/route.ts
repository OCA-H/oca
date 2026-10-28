import { contributionController } from "../controller";

export const GET = (request: Request) => contributionController.listFunds(request);
