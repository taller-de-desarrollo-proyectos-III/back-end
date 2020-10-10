import { PostgresService } from "../../src/services";

const postgresService = new PostgresService();

export const setupDatabase = () => {
  beforeAll(() => postgresService.connect());
  afterAll(() => postgresService.closeConnection());
};
