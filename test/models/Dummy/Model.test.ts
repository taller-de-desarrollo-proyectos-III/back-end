import { Dummy } from "../../../src/models";
import { UuidGenerator } from "../../../src/models/UuidGenerator";
import { UUID_REGEX } from "../index";

describe("Dummy", () => {
  it("creates a valid dummy model with its uuid generated", async () => {
    const attributes = {
      welcomeMessage: "hello"
    };
    const dummy = new Dummy(attributes);
    expect(dummy).toEqual({
      uuid: expect.stringMatching(UUID_REGEX),
      ...attributes
    });
  });

  it("throws an error if no welcomeMessage is provided", async () => {
    expect(
      () => new Dummy({ welcomeMessage: undefined as any })
    ).toThrow("welcomeMessage must be defined");
  });

  it("throws an error if no uuid is generated", async () => {
    jest.spyOn(UuidGenerator, "generate").mockReturnValueOnce(undefined as any);
    expect(
      () => new Dummy({ welcomeMessage: "hello" })
    ).toThrow("uuid must be defined");
  });

  it("throws an error if uuid has invalid format", async () => {
    jest.spyOn(UuidGenerator, "generate").mockReturnValueOnce("invalidUuidFormat");
    expect(
      () => new Dummy({ welcomeMessage: "hello" })
    ).toThrow("uuid must have uuid format");
  });
});
