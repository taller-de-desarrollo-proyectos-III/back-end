import { App } from "./App";
import { Environment } from "./config";
import { PostgresService } from "./services";

const app = new App(5000);
const postgresService = new PostgresService();

app.listen();
Environment.validate();
postgresService.connect();
