import { App } from "./App";
import { DatabaseConfig, Environment } from "./config";
import { PostgresService } from "./services";

const app = new App(Environment.PORT());
const postgresService = new PostgresService(DatabaseConfig);

app.listen();
Environment.validate();
postgresService.connect();
