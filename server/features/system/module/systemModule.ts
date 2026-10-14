// Wires the system feature together. The route handler in app/api/system uses systemController.

import "server-only";
import { SystemController } from "../controller/systemController";
import { SystemRepository } from "../repository/systemRepository";
import { SystemService } from "../service/systemService";

export const systemController = new SystemController(
  new SystemService(new SystemRepository())
);
