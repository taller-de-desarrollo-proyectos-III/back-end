import { DatabaseConfig } from "./database";

export = {
  ...DatabaseConfig,
  entities: ["src/**/**.entity{.ts,.js}"],
  migrations: ["src/migrations/*.ts"],
  cli: {
    migrationsDir: "src/migrations"
  }
};
