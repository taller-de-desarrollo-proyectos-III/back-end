import { DummyRepository } from "../../../src/models/Dummy";
import { getCustomRepository } from "typeorm";
import { PostgresService } from "../../../src/services";
import { Dummy } from "../../../src/models";

describe("DummyRepository", () => {
  it("saves a dummy model to the database", async () => {
    const postgresService = new PostgresService();
    await postgresService.connect();
    const dummy = new Dummy({ welcomeMessage: "Hello" });
    const dummyRepository = getCustomRepository(DummyRepository);
    await dummyRepository.create(dummy);
    expect(await dummyRepository.findByUuid(dummy.uuid)).toEqual(dummy);
    await postgresService.closeConnection();
  });

  it("throws an error if the dummy does not exists", async () => {
    const postgresService = new PostgresService();
    await postgresService.connect();
    const dummy = new Dummy({ welcomeMessage: "Hello" });
    const dummyRepository = getCustomRepository(DummyRepository);
    await expect(dummyRepository.findByUuid(dummy.uuid)).rejects.toThrow("DummyNotFoundError");
    await postgresService.closeConnection();
  });
});
