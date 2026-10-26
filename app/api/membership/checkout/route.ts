import { membershipController } from "@/app/api/features/(pview)/membership";

export const POST = (request: Request) => membershipController.checkout(request);
