import { PostgresService } from "../../src/services";
import { DatabaseConfig } from "../../src/config";
import { executePromise } from "./executePromise";

const create = async () => {
  const postgresService = new PostgresService(DatabaseConfig);
  await postgresService.createDatabase();
};

executePromise(create());
