import "server-only";
import type { SystemRepository, DatabaseStatus } from "../repository/systemRepository";

export interface ServerStatusResult {
  status: "healthy" | "degraded";
  uptimeSeconds: number;
  timestamp: string;
  environment: string;
  app: {
    name: string;
    version: string;
  };
  database: DatabaseStatus;
}

const startTime = Date.now();

export class SystemService {
  private readonly repository: SystemRepository;

  constructor(repository: SystemRepository) {
    this.repository = repository;
  }

  async getServerStatus(): Promise<ServerStatusResult> {
    const dbStatus = await this.repository.checkConnection();
    const isHealthy = dbStatus.connected;

    return {
      status: isHealthy ? "healthy" : "degraded",
      uptimeSeconds: Math.floor((Date.now() - startTime) / 1000),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      app: {
        name: "OCA Hub",
        version: "0.1.0",
      },
      database: dbStatus,
    };
  }
}
