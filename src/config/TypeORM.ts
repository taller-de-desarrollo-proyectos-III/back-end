import { PostgresService } from "../services";
import { DatabaseConfig } from "../config";

const postgresService = new PostgresService(DatabaseConfig);

export = {
  ...postgresService.loadConfig(),
  migrations: ["src/migrations/*.ts"],
  cli: {
    migrationsDir: "src/migrations"
  }
};
