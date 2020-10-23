import { Commission } from "../../../src/models";
import { UUID_REGEX } from "../index";
import { UuidGenerator } from "../../../src/models/UuidGenerator";
import { AttributeNotDefinedError, InvalidAttributeFormatError } from "../../../src/models/Errors";

describe("Commission", () => {
  it("creates a valid commission model with its uuid generated", async () => {
    const attributes = {
      name: "Comision A"
    };
    const commission = new Commission(attributes);
    expect(commission).toEqual({
      uuid: expect.stringMatching(UUID_REGEX),
      ...attributes
    });
  });

  it("throws an error if no name is provided", async () => {
    expect(
      () => new Commission({
        name: undefined as any
      })
    ).toThrow(AttributeNotDefinedError);
  });

  it("throws an error if no uuid is generated", () => {
    jest.spyOn(UuidGenerator, "generate").mockReturnValueOnce(undefined as any);
    expect(
      () => new Commission({
        name: "Comision B"
      })
    ).toThrow(AttributeNotDefinedError);
  });

  it("throws an error if uuid has invalid format", () => {
    jest.spyOn(UuidGenerator, "generate").mockReturnValueOnce("invalidUuidFormat");
    expect(
      () => new Commission({
        name: "Comision C"
      })
    ).toThrow(InvalidAttributeFormatError);
  });
});
