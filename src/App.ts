import express from "express";
import { routes } from "./routes";

export class App {
  public app: express.Application;
  private readonly port: number;

  constructor(port: number) {
    this.app = express();
    this.port = port;
    this.initializeRoutes();
  }

  private initializeRoutes() {
    routes.forEach(route => this.app.use('/', route.initialize()));
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}
