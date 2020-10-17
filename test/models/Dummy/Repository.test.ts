import { dummyRepository } from "../../../src/models/Dummy";
import { Dummy } from "../../../src/models";

describe("dummyRepository", () => {

  beforeAll(async () => {
    await dummyRepository().truncate();
  });

  it("saves a dummy model to the database", async () => {
    const dummy = new Dummy({ welcomeMessage: "Hello" });
    await dummyRepository().create(dummy);
    expect(await dummyRepository().findByUuid(dummy.uuid)).toEqual(dummy);
  });

  it("throws an error if the dummy does not exists", async () => {
    const dummy = new Dummy({ welcomeMessage: "Hello" });
    await expect(dummyRepository().findByUuid(dummy.uuid)).rejects.toThrow("DummyNotFoundError");
  });

  it("removes all entries form Dummies table", async () => {
    const firstDummy = new Dummy({ welcomeMessage: "firstDummy" });
    const secondDummy = new Dummy({ welcomeMessage: "secondDummy" });
    await dummyRepository().create(firstDummy);
    await dummyRepository().create(secondDummy);

    expect(
      await dummyRepository().findAll()
    ).toEqual(expect.arrayContaining([firstDummy, secondDummy]));

    await dummyRepository().truncate();
    expect(await dummyRepository().findAll()).toHaveLength(0);
  });
});
