import { PostgresService } from "../../src/services";
import { DatabaseConfig } from "../../src/config";

const postgresService = new PostgresService(DatabaseConfig);

export const setupDatabase = () => {
  beforeAll(() => postgresService.connect());
  afterAll(() => postgresService.closeConnection());
};
