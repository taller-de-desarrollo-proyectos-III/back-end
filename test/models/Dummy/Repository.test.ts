import { DummyRepository } from "../../../src/models/Dummy";
import { getCustomRepository } from "typeorm";
import { Dummy } from "../../../src/models";

describe("DummyRepository", () => {

  beforeAll(async () => {
    const dummyRepository = getCustomRepository(DummyRepository);
    await dummyRepository.truncate();
  });

  it("saves a dummy model to the database", async () => {
    const dummy = new Dummy({ welcomeMessage: "Hello" });
    const dummyRepository = getCustomRepository(DummyRepository);
    await dummyRepository.create(dummy);
    expect(await dummyRepository.findByUuid(dummy.uuid)).toEqual(dummy);
  });

  it("throws an error if the dummy does not exists", async () => {
    const dummy = new Dummy({ welcomeMessage: "Hello" });
    const dummyRepository = getCustomRepository(DummyRepository);
    await expect(dummyRepository.findByUuid(dummy.uuid)).rejects.toThrow("DummyNotFoundError");
  });

  it("removes all entries form Dummies table", async () => {
    const firstDummy = new Dummy({ welcomeMessage: "firstDummy" });
    const secondDummy = new Dummy({ welcomeMessage: "secondDummy" });
    const dummyRepository = getCustomRepository(DummyRepository);
    await dummyRepository.create(firstDummy);
    await dummyRepository.create(secondDummy);

    expect(
      await dummyRepository.findAll()
    ).toEqual(expect.arrayContaining([firstDummy, secondDummy]));

    await dummyRepository.truncate();
    expect(await dummyRepository.findAll()).toHaveLength(0);
  });
});
