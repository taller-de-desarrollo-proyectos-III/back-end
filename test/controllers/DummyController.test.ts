import { testClient } from "./TestClient";
import { StatusCodes } from "http-status-codes";
import { getCustomRepository } from "typeorm";
import { DummyRepository } from "../../src/models/Dummy";
import { DummyRoutes } from "../../src/routes/DummyRoutes";

describe("DummyController", () => {
  beforeAll(() => getCustomRepository(DummyRepository).truncate());

  it("creates a dummy model", async () => {
    const request = await testClient.post(DummyRoutes.path).send({
      welcomeMessage: "hello"
    });
    const dummyRepository = getCustomRepository(DummyRepository);
    const dummy = await dummyRepository.findByUuid(request.body);
    expect(dummy.welcomeMessage).toEqual("hello");
    expect(request.status).toEqual(StatusCodes.CREATED);
  });
});
