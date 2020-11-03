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
      email: "johndoe@gmail.com",
      linkedin: "John Doe",
      phoneNumber: "1165287676",
      telegram: "@JohnD",
      admissionYear: "2016",
      graduationYear: undefined as any,
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
          email: "johndoe@gmail.com",
          linkedin: "John Doe",
          phoneNumber: "1165287676",
          telegram: "@JohnD",
          admissionYear: "2016",
          graduationYear: "2016",
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
          email: "johndoe@gmail.com",
          linkedin: "John Doe",
          phoneNumber: "1165287676",
          telegram: "@JohnD",
          admissionYear: "2016",
          graduationYear: "2016",
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
          email: "johndoe@gmail.com",
          linkedin: "John Doe",
          phoneNumber: "1165287676",
          telegram: "@JohnD",
          admissionYear: "2016",
          graduationYear: "2016",
          country: "Argentina"
        })
    ).toThrow(AttributeNotDefinedError);
  });

  it("throws an error if no email is provided", async () => {
    expect(
      () =>
        new Volunteer({
          dni: "12345678",
          name: "John",
          surname: "Doe",
          email: undefined as any,
          linkedin: "John Doe",
          phoneNumber: "1165287676",
          telegram: "@JohnD",
          admissionYear: "2016",
          graduationYear: "2016",
          country: "Argentina"
        })
    ).toThrow(AttributeNotDefinedError);
  });

  it("throws an error if no email is provided", async () => {
    expect(
      () =>
        new Volunteer({
          dni: "12345678",
          name: "John",
          surname: "Doe",
          email: undefined as any,
          linkedin: "John Doe",
          phoneNumber: "1165287676",
          telegram: "@JohnD",
          admissionYear: undefined as any,
          graduationYear: "2016",
          country: "Argentina"
        })
    ).toThrow(AttributeNotDefinedError);
  });

  it("throws an error if email has invalid format", async () => {
    expect(
      () =>
        new Volunteer({
          dni: "12345678",
          name: "John",
          surname: "Doe",
          email: "john@",
          linkedin: "John Doe",
          phoneNumber: "1165287676",
          telegram: "@JohnD",
          admissionYear: "2016",
          graduationYear: "2016",
          country: "Argentina"
        })
    ).toThrow(InvalidAttributeFormatError);
  });

  it("throws an error if admissionYear has invalid format", async () => {
    expect(
      () =>
        new Volunteer({
          dni: "12345678",
          name: "John",
          surname: "Doe",
          email: "john@gmail.com",
          linkedin: "John Doe",
          phoneNumber: "1165287676",
          telegram: "@JohnD",
          admissionYear: "20I6",
          graduationYear: "2016",
          country: "Argentina"
        })
    ).toThrow(InvalidAttributeFormatError);
  });

  it("throws an error if graduationYear has invalid format", async () => {
    expect(
      () =>
        new Volunteer({
          dni: "12345678",
          name: "John",
          surname: "Doe",
          email: "john@gmail.com",
          linkedin: "John Doe",
          phoneNumber: "1165287676",
          telegram: "@JohnD",
          admissionYear: "2016",
          graduationYear: "20A6",
          country: "Argentina"
        })
    ).toThrow(InvalidAttributeFormatError);
  });

  it("throws an error if graduationYear has invalid format", async () => {
    expect(
      () =>
        new Volunteer({
          dni: "12345678",
          name: "John",
          surname: "Doe",
          email: "john@gmail.com",
          linkedin: "John Doe",
          phoneNumber: "1165287676",
          telegram: "@JohnD",
          admissionYear: "2016",
          graduationYear: "201226",
          country: "Argentina"
        })
    ).toThrow(InvalidAttributeFormatError);
  });

  it("throws an error if admissionYear has invalid format", async () => {
    expect(
      () =>
        new Volunteer({
          dni: "12345678",
          name: "John",
          surname: "Doe",
          email: "john@gmail.com",
          linkedin: "John Doe",
          phoneNumber: "1165287676",
          telegram: "@JohnD",
          admissionYear: "201226",
          graduationYear: "2010",
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
          email: "johndoe@gmail.com",
          linkedin: "John Doe",
          phoneNumber: "1165287676",
          telegram: "@JohnD",
          admissionYear: "2016",
          graduationYear: "2016",
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
          email: "johndoe@gmail.com",
          linkedin: "John Doe",
          phoneNumber: "1165287676",
          telegram: "@JohnD",
          admissionYear: "2016",
          graduationYear: "2016",
          country: "Argentina"
        })
    ).toThrow(InvalidAttributeFormatError);
  });
});
