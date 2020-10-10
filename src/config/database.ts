import { Environment } from "./Environment";

const env = Environment.NODE_ENV();

export const DatabaseConfig = {
  production: {
    type: "postgres" as "postgres",
    url: "DATABASE_URL"
  },
  development: {
    url: "postgres://postgres:postgres@localhost:5433/development",
    type: "postgres" as "postgres"
  },
  test: {
    url: "postgres://postgres:postgres@localhost:5433/test",
    type: "postgres" as "postgres"
  }
}[env];
