import { VolunteerRole } from "../../../src/models";
import { UuidGenerator } from "../../../src/models/UuidGenerator";
import { AttributeNotDefinedError, InvalidAttributeFormatError } from "../../../src/models/Errors";

describe("VolunteerRole", () => {
  it("creates a valid model", async () => {
    const attributes = {
      volunteerUuid: UuidGenerator.generate(),
      roleUuid: UuidGenerator.generate()
    };
    const volunteerRole = new VolunteerRole(attributes);
    expect(volunteerRole).toEqual(attributes);
  });

  it("throws an error if no volunteerUuid is provided", async () => {
    expect(
      () =>
        new VolunteerRole({
          volunteerUuid: undefined as any,
          roleUuid: UuidGenerator.generate()
        })
    ).toThrow(AttributeNotDefinedError);
  });

  it("throws an error if no roleUuid is provided", async () => {
    expect(
      () =>
        new VolunteerRole({
          volunteerUuid: UuidGenerator.generate(),
          roleUuid: undefined as any
        })
    ).toThrow(AttributeNotDefinedError);
  });

  it("throws an error if volunteerUuid has invalid format", async () => {
    expect(
      () =>
        new VolunteerRole({
          volunteerUuid: "invalidUuidFormat",
          roleUuid: UuidGenerator.generate()
        })
    ).toThrow(InvalidAttributeFormatError);
  });

  it("throws an error if roleUuid has invalid format", async () => {
    expect(
      () =>
        new VolunteerRole({
          volunteerUuid: UuidGenerator.generate(),
          roleUuid: "invalidUuidFormat"
        })
    ).toThrow(InvalidAttributeFormatError);
  });
});
