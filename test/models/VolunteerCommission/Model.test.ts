import { VolunteerCommission } from "../../../src/models";
import { UuidGenerator } from "../../../src/models/UuidGenerator";
import { AttributeNotDefinedError, InvalidAttributeFormatError } from "../../../src/models/Errors";

describe("VolunteerCommission", () => {
  it("creates a valid model", async () => {
    const attributes = {
      volunteerUuid: UuidGenerator.generate(),
      commissionUuid: UuidGenerator.generate()
    };
    const volunteerCommission = new VolunteerCommission(attributes);
    expect(volunteerCommission).toEqual(attributes);
  });

  it("throws an error if no volunteerUuid is provided", async () => {
    expect(
      () =>
        new VolunteerCommission({
          volunteerUuid: undefined as any,
          commissionUuid: UuidGenerator.generate()
        })
    ).toThrow(AttributeNotDefinedError);
  });

  it("throws an error if no commissionUuid is provided", async () => {
    expect(
      () =>
        new VolunteerCommission({
          volunteerUuid: UuidGenerator.generate(),
          commissionUuid: undefined as any
        })
    ).toThrow(AttributeNotDefinedError);
  });

  it("throws an error if volunteerUuid has invalid format", async () => {
    expect(
      () =>
        new VolunteerCommission({
          volunteerUuid: "invalidUuidFormat",
          commissionUuid: UuidGenerator.generate()
        })
    ).toThrow(InvalidAttributeFormatError);
  });

  it("throws an error if commissionUuid has invalid format", async () => {
    expect(
      () =>
        new VolunteerCommission({
          volunteerUuid: UuidGenerator.generate(),
          commissionUuid: "invalidUuidFormat"
        })
    ).toThrow(InvalidAttributeFormatError);
  });
});
