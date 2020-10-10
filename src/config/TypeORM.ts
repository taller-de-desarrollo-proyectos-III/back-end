import { DatabaseConfig } from "./database";

export = {
  ...DatabaseConfig,
  migrations: ["src/migrations/*.ts"],
  cli: {
    migrationsDir: "src/migrations"
  }
};
