import { userController } from "@/app/api/features/user/userModule";

export const GET = (request: Request) => userController.me(request);
