import express from "express";
import { routes } from "./routes";
import { middlewares } from "./middlewares";
import { Logger } from "./libs";

export class App {
  public app: express.Application;
  private readonly port: number;

  constructor(port: number) {
    this.app = express();
    this.port = port;
    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  private initializeMiddlewares() {
    middlewares.forEach(middleware => this.app.use(middleware));
  }

  private initializeRoutes() {
    routes.forEach(route => this.app.use("/", route.initialize()));
  }

  public listen() {
    this.app.listen(this.port, () => {
      Logger.info(`App listening on the port ${this.port}`);
    });
  }
}
