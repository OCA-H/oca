import { userController } from "@/app/api/features/user/userModule";

export const POST = (request: Request) => userController.signIn(request);
