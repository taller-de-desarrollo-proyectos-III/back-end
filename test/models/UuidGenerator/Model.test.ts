import { UuidGenerator } from "../../../src/models/UuidGenerator";
import { UUID_REGEX } from "../index";

describe("UuidGenerator", () => {
  it("generates an uuid", async () => {
    expect(UuidGenerator.generate()).toEqual(expect.stringMatching(UUID_REGEX));
  });
});
