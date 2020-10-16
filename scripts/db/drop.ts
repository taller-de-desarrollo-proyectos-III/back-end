import { PostgresService } from "../../src/services";
import { DatabaseConfig } from "../../src/config";
import { executePromise } from "./executePromise";

const drop = async () => {
  const postgresService = new PostgresService(DatabaseConfig);
  await postgresService.dropDatabase();
};

executePromise(drop());
