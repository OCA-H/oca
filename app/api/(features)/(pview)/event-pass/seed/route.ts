import { eventPassController } from "../controller";

export const POST = (request: Request) => eventPassController.seedPasses(request);
