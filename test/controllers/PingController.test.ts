import { client } from "./client";
import { PingRoutes } from "../../src/routes/PingRoutes";

describe("PingController", () => {

  it("returns a message", async () => {
    const request = await client.get(PingRoutes.path);
    expect(request.text).toEqual("pong");
    expect(request.status).toEqual(200);
  });
});
