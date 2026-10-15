import "server-only";
import { SystemController } from "./systemController";
import { SystemRepository } from "./systemRepository";
import { SystemService } from "./systemService";

export const systemController = new SystemController(
  new SystemService(new SystemRepository())
);
