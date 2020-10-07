import client from "supertest";
import { App } from "../../src/App";
import { PingRoutes } from "../../src/routes/PingRoutes";

describe("PingController", () => {
  const app = new App(5000).app;

  it("returns a message", async () => {
    const request = await client(app).get(PingRoutes.path);
    expect(request.text).toEqual("pong");
    expect(request.status).toEqual(200);
  });
});
