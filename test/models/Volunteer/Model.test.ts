import { Volunteer } from "../../../src/models";
import { UUID_REGEX } from "../index";
import { UuidGenerator } from "../../../src/models/UuidGenerator";
import { AttributeNotDefinedError, InvalidAttributeFormatError } from "../../../src/models/Errors";

describe("Volunteer", () => {
  it("creates a valid volunteer model with its uuid generated", async () => {
    const attributes = {
      dni: "12345678",
      name: "John",
      surname: "Doe",
      mail: "johndoe@gmail.com",
      linkedin: "John Doe",
      celular: "1165287676",
      telegram: "@JohnD",
      entryDate: "2016",
      graduationDate: undefined as any,
      country: "Argentina"
    };
    const volunteer = new Volunteer(attributes);
    expect(volunteer).toEqual({
      uuid: expect.stringMatching(UUID_REGEX),
      commissions: [],
      ...attributes
    });
  });

  it("throws an error if no dni is provided", async () => {
    expect(
      () =>
        new Volunteer({
          dni: undefined as any,
          name: "John",
          surname: "Doe",
          mail: "johndoe@gmail.com",
          linkedin: "John Doe",
          celular: "1165287676",
          telegram: "@JohnD",
          entryDate: "2016",
          graduationDate: "2016",
          country: "Argentina"
        })
    ).toThrow(AttributeNotDefinedError);
  });

  it("throws an error if no name is provided", async () => {
    expect(
      () =>
        new Volunteer({
          dni: "12345678",
          name: undefined as any,
          surname: "Doe",
          mail: "johndoe@gmail.com",
          linkedin: "John Doe",
          celular: "1165287676",
          telegram: "@JohnD",
          entryDate: "2016",
          graduationDate: "2016",
          country: "Argentina"
        })
    ).toThrow(AttributeNotDefinedError);
  });

  it("throws an error if no surname is provided", async () => {
    expect(
      () =>
        new Volunteer({
          dni: "12345678",
          name: "John",
          surname: undefined as any,
          mail: "johndoe@gmail.com",
          linkedin: "John Doe",
          celular: "1165287676",
          telegram: "@JohnD",
          entryDate: "2016",
          graduationDate: "2016",
          country: "Argentina"
        })
    ).toThrow(AttributeNotDefinedError);
  });

  it("throws an error if no mail is provided", async () => {
    expect(
      () =>
        new Volunteer({
          dni: "12345678",
          name: "John",
          surname: "Doe",
          mail: undefined as any,
          linkedin: "John Doe",
          celular: "1165287676",
          telegram: "@JohnD",
          entryDate: "2016",
          graduationDate: "2016",
          country: "Argentina"
        })
    ).toThrow(AttributeNotDefinedError);
  });

  it("throws an error if no mail is provided", async () => {
    expect(
      () =>
        new Volunteer({
          dni: "12345678",
          name: "John",
          surname: "Doe",
          mail: undefined as any,
          linkedin: "John Doe",
          celular: "1165287676",
          telegram: "@JohnD",
          entryDate: undefined as any,
          graduationDate: "2016",
          country: "Argentina"
        })
    ).toThrow(AttributeNotDefinedError);
  });

  it("throws an error if mail has invalid format", async () => {
    expect(
      () =>
        new Volunteer({
          dni: "12345678",
          name: "John",
          surname: "Doe",
          mail: "john@",
          linkedin: "John Doe",
          celular: "1165287676",
          telegram: "@JohnD",
          entryDate: "2016",
          graduationDate: "2016",
          country: "Argentina"
        })
    ).toThrow(InvalidAttributeFormatError);
  });

  it("throws an error if entryDate has invalid format", async () => {
    expect(
      () =>
        new Volunteer({
          dni: "12345678",
          name: "John",
          surname: "Doe",
          mail: "john@gmail.com",
          linkedin: "John Doe",
          celular: "1165287676",
          telegram: "@JohnD",
          entryDate: "20I6",
          graduationDate: "2016",
          country: "Argentina"
        })
    ).toThrow(InvalidAttributeFormatError);
  });

  it("throws an error if graduationDate has invalid format", async () => {
    expect(
      () =>
        new Volunteer({
          dni: "12345678",
          name: "John",
          surname: "Doe",
          mail: "john@gmail.com",
          linkedin: "John Doe",
          celular: "1165287676",
          telegram: "@JohnD",
          entryDate: "2016",
          graduationDate: "20A6",
          country: "Argentina"
        })
    ).toThrow(InvalidAttributeFormatError);
  });

  it("throws an error if graduationDate has invalid format", async () => {
    expect(
      () =>
        new Volunteer({
          dni: "12345678",
          name: "John",
          surname: "Doe",
          mail: "john@gmail.com",
          linkedin: "John Doe",
          celular: "1165287676",
          telegram: "@JohnD",
          entryDate: "2016",
          graduationDate: "201226",
          country: "Argentina"
        })
    ).toThrow(InvalidAttributeFormatError);
  });

  it("throws an error if entryDate has invalid format", async () => {
    expect(
      () =>
        new Volunteer({
          dni: "12345678",
          name: "John",
          surname: "Doe",
          mail: "john@gmail.com",
          linkedin: "John Doe",
          celular: "1165287676",
          telegram: "@JohnD",
          entryDate: "201226",
          graduationDate: "2010",
          country: "Argentina"
        })
    ).toThrow(InvalidAttributeFormatError);
  });

  it("throws an error if no uuid is generated", () => {
    jest.spyOn(UuidGenerator, "generate").mockReturnValueOnce(undefined as any);
    expect(
      () =>
        new Volunteer({
          dni: "12345678",
          name: "John",
          surname: "Doe",
          mail: "johndoe@gmail.com",
          linkedin: "John Doe",
          celular: "1165287676",
          telegram: "@JohnD",
          entryDate: "2016",
          graduationDate: "2016",
          country: "Argentina"
        })
    ).toThrow(AttributeNotDefinedError);
  });

  it("throws an error if uuid has invalid format", () => {
    jest.spyOn(UuidGenerator, "generate").mockReturnValueOnce("invalidUuidFormat");
    expect(
      () =>
        new Volunteer({
          dni: "12345678",
          name: "John",
          surname: "Doe",
          mail: "johndoe@gmail.com",
          linkedin: "John Doe",
          celular: "1165287676",
          telegram: "@JohnD",
          entryDate: "2016",
          graduationDate: "2016",
          country: "Argentina"
        })
    ).toThrow(InvalidAttributeFormatError);
  });
});
