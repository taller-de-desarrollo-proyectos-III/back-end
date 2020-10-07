import { testClient } from "./TestClient";
import { PingRoutes } from "../../src/routes/PingRoutes";

describe("PingController", () => {
  it("returns a message", async () => {
    const request = await testClient.get(PingRoutes.path);
    expect(request.text).toEqual("pong");
    expect(request.status).toEqual(200);
  });
});
