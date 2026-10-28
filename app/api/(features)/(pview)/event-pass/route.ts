import { eventPassController } from "./controller";

export const GET = (request: Request) => eventPassController.listPasses(request);
export const POST = (request: Request) => eventPassController.createPass(request);
