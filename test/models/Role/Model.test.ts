import { Role } from "../../../src/models";
import { UUID_REGEX } from "../index";
import { UuidGenerator } from "../../../src/models/UuidGenerator";
import { AttributeNotDefinedError, InvalidAttributeFormatError } from "../../../src/models/Errors";

describe("Role", () => {
  it("creates a valid role model with its uuid generated", async () => {
    const attributes = { name: "Role A" };
    const role = new Role(attributes);
    expect(role).toEqual({
      uuid: expect.stringMatching(UUID_REGEX),
      ...attributes
    });
  });

  it("throws an error if no name is provided", async () => {
    expect(() => new Role({ name: undefined as any })).toThrow(AttributeNotDefinedError);
  });

  it("throws an error if name is an empty string", async () => {
    expect(() => new Role({ name: "" })).toThrow(AttributeNotDefinedError);
  });

  it("throws an error if no uuid is generated", () => {
    jest.spyOn(UuidGenerator, "generate").mockReturnValueOnce(undefined as any);
    expect(() => new Role({ name: "Role B" })).toThrow(AttributeNotDefinedError);
  });

  it("throws an error if uuid has invalid format", () => {
    jest.spyOn(UuidGenerator, "generate").mockReturnValueOnce("invalidUuidFormat");
    expect(() => new Role({ name: "Role C" })).toThrow(InvalidAttributeFormatError);
  });
});
