import { contactController } from "./controller";

export const POST = (request: Request) => contactController.submit(request);
