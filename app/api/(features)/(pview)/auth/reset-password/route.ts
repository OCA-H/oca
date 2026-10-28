import { userController } from "../controller";

export const POST = (request: Request) => userController.resetPassword(request);
