import { userController } from "../controller";

export const GET = (request: Request) => userController.me(request);

