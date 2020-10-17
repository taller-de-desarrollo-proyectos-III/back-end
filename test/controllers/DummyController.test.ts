import { testClient } from "./TestClient";
import { StatusCodes } from "http-status-codes";
import { dummyRepository } from "../../src/models/Dummy";
import { DummyRoutes } from "../../src/routes/DummyRoutes";

describe("DummyController", () => {
  beforeAll(() => dummyRepository().truncate());

  it("creates a dummy model", async () => {
    const request = await testClient.post(DummyRoutes.path).send({
      welcomeMessage: "hello"
    });
    const dummy = await dummyRepository().findByUuid(request.body.uuid);
    expect(dummy).toEqual(request.body);
    expect(request.status).toEqual(StatusCodes.CREATED);
  });

  it("returns error if no payload is provided", async () => {
    const request = await testClient.post(DummyRoutes.path).send();
    expect(request.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
  });
});
