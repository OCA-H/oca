import "server-only";
import { EventPassController } from "./eventPassController";
import { EventPassRepository } from "./eventPassRepository";
import { EventPassService } from "./eventPassService";

export const eventPassRepository = new EventPassRepository();
export const eventPassService = new EventPassService(eventPassRepository);
export const eventPassController = new EventPassController(eventPassService);
