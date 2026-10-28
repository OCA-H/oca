import { userController } from "../controller";

export const POST = (request: Request) => userController.forgotPassword(request);
