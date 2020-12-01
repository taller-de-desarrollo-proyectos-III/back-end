import { State } from "../../../src/models";
import { UUID_REGEX } from "../index";
import { UuidGenerator } from "../../../src/models/UuidGenerator";
import { AttributeNotDefinedError, InvalidAttributeFormatError } from "../../../src/models/Errors";

describe("State", () => {
  it("creates a valid state model with its uuid generated", async () => {
    const attributes = { name: "State A" };
    const state = new State(attributes);
    expect(state).toEqual({
      uuid: expect.stringMatching(UUID_REGEX),
      ...attributes
    });
  });

  it("throws an error if no name is provided", async () => {
    expect(() => new State({ name: undefined as any })).toThrow(AttributeNotDefinedError);
  });

  it("throws an error if no uuid is generated", () => {
    jest.spyOn(UuidGenerator, "generate").mockReturnValueOnce(undefined as any);
    expect(() => new State({ name: "State B" })).toThrow(AttributeNotDefinedError);
  });

  it("throws an error if uuid has invalid format", () => {
    jest.spyOn(UuidGenerator, "generate").mockReturnValueOnce("invalidUuidFormat");
    expect(() => new State({ name: "State C" })).toThrow(InvalidAttributeFormatError);
  });
});
