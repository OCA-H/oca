import { userController } from "../controller";

export const POST = (request: Request) => userController.seed(request);
export const GET = (request: Request) => userController.seed(request);
