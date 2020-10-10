import { PostgresService } from "../../src/services";
import { executePromise } from "./executePromise";

const create = async () => {
  const postgresService = new PostgresService();
  await postgresService.createDatabase();
};

executePromise(create());
