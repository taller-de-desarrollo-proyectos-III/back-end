import { Volunteer } from "../../../src/models/Volunteer/Model";
import { UUID_REGEX } from "../index";
import { UuidGenerator } from "../../../src/models/UuidGenerator";
import { AttributeNotDefinedError } from "../../../src/models/Volunteer/Errors/AttributeNotDefinedError";
import { InvalidAttributeFormatError } from "../../../src/models/Volunteer/Errors/InvalidAttributeFormatError";

describe("Volunteer", () => {
  it("creates a valid volunteer model with its uuid generated", async () => {
    const attributes = {
      dni: "12345678",
      name: "John",
      surname: "Doe"
    };
    const volunteer = new Volunteer(attributes);
    expect(volunteer).toEqual({
      uuid: expect.stringMatching(UUID_REGEX),
      ...attributes
    });
  });

  it("throws an error if no dni is provided", async () => {
    expect(
      () => new Volunteer({
        dni: undefined as any,
        name: "John",
        surname: "Doe"
      })
    ).toThrow(AttributeNotDefinedError);
  });

  it("throws an error if no name is provided", async () => {
    expect(
      () => new Volunteer({
        dni: "12345678",
        name: undefined as any,
        surname: "Doe"
      })
    ).toThrow(AttributeNotDefinedError);
  });

  it("throws an error if no surname is provided", async () => {
    expect(
      () => new Volunteer({
        dni: "12345678",
        name: "John",
        surname: undefined as any
      })
    ).toThrow(AttributeNotDefinedError);
  });

  it("throws an error if no uuid is generated", () => {
    jest.spyOn(UuidGenerator, "generate").mockReturnValueOnce(undefined as any);
    expect(
      () => new Volunteer({
        dni: "12345678",
        name: "John",
        surname: "Doe"
      })
    ).toThrow(AttributeNotDefinedError);
  });

  it("throws an error if uuid has invalid format", () => {
    jest.spyOn(UuidGenerator, "generate").mockReturnValueOnce("invalidUuidFormat");
    expect(
      () => new Volunteer({
        dni: "12345678",
        name: "John",
        surname: "Doe"
      })
    ).toThrow(InvalidAttributeFormatError);
  });
});
