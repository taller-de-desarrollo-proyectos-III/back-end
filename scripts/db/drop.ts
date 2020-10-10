import { PostgresService } from "../../src/services";
import { executePromise } from "./executePromise";

const drop = async () => {
  const postgresService = new PostgresService();
  await postgresService.dropDatabase();
};

executePromise(drop());
