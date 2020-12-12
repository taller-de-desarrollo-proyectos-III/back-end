import { Volunteer, IVolunteerAttributes } from "../../../src/models";
import { UUID_REGEX } from "../index";
import { UuidGenerator } from "../../../src/models/UuidGenerator";
import { AttributeNotDefinedError, InvalidAttributeFormatError } from "../../../src/models/Errors";
import { VolunteerGenerator } from "../../Generators/Volunteer";
import { omit } from "lodash";

describe("Volunteer", () => {
  it("creates a valid volunteer model with its uuid generated", async () => {
    const attributes = VolunteerGenerator.attributes();
    const volunteer = new Volunteer(attributes);
    expect(volunteer).toEqual({
      uuid: expect.stringMatching(UUID_REGEX),
      ...attributes
    });
  });

  it("creates a valid volunteer model with only mandatory attributes", async () => {
    const attributes = {
      dni: "12345678",
      name: "John",
      surname: "Doe",
      email: "johndoe@gmail.com",
      phoneNumber: "1165287676",
      stateUuid: UuidGenerator.generate()
    };
    const volunteer = new Volunteer(attributes);
    expect(volunteer).toEqual({
      uuid: expect.stringMatching(UUID_REGEX),
      ...attributes
    });
  });

  it("throws an error if no dni is provided", async () => {
    const attributes = omit(VolunteerGenerator.attributes(), "dni") as IVolunteerAttributes;
    expect(() => new Volunteer(attributes)).toThrow(AttributeNotDefinedError);
  });

  it("throws an error if no name is provided", async () => {
    const attributes = omit(VolunteerGenerator.attributes(), "name") as IVolunteerAttributes;
    const matcher = expect(() => new Volunteer(attributes));
    matcher.toThrowError(AttributeNotDefinedError);
    matcher.toThrowError(AttributeNotDefinedError.buildMessage("name"));
  });

  it("throws an error if no surname is provided", async () => {
    const attributes = omit(VolunteerGenerator.attributes(), "surname") as IVolunteerAttributes;
    const matcher = expect(() => new Volunteer(attributes));
    matcher.toThrowError(AttributeNotDefinedError);
    matcher.toThrowError(AttributeNotDefinedError.buildMessage("surname"));
  });

  it("throws an error if no email is provided", async () => {
    const attributes = omit(VolunteerGenerator.attributes(), "email") as IVolunteerAttributes;
    const matcher = expect(() => new Volunteer(attributes));
    matcher.toThrowError(AttributeNotDefinedError);
    matcher.toThrowError(AttributeNotDefinedError.buildMessage("email"));
  });

  it("throws an error if phoneNumber is not defined", async () => {
    const attributes = omit(VolunteerGenerator.attributes(), "phoneNumber") as IVolunteerAttributes;
    const matcher = expect(() => new Volunteer(attributes));
    matcher.toThrowError(AttributeNotDefinedError);
    matcher.toThrowError(AttributeNotDefinedError.buildMessage("phoneNumber"));
  });

  it("throws an error if stateUuid is not defined", async () => {
    const attributes = omit(VolunteerGenerator.attributes(), "stateUuid") as IVolunteerAttributes;
    const matcher = expect(() => new Volunteer(attributes));
    matcher.toThrowError(AttributeNotDefinedError);
    matcher.toThrowError(AttributeNotDefinedError.buildMessage("stateUuid"));
  });

  it("throws an error if stateUuid has invalid format", async () => {
    const attributes = VolunteerGenerator.attributes();
    attributes.stateUuid = "invalidFormat";
    const matcher = expect(() => new Volunteer(attributes));
    matcher.toThrowError(InvalidAttributeFormatError);
    matcher.toThrowError(InvalidAttributeFormatError.buildMessage("stateUuid"));
  });

  it("throws an error if email has invalid format", async () => {
    const attributes = VolunteerGenerator.attributes();
    attributes.email = "john@";
    const matcher = expect(() => new Volunteer(attributes));
    matcher.toThrowError(InvalidAttributeFormatError);
    matcher.toThrowError(InvalidAttributeFormatError.buildMessage("email"));
  });

  it("throws an error if admissionYear has invalid characters", async () => {
    const attributes = VolunteerGenerator.attributes();
    attributes.admissionYear = "20I6";
    const matcher = expect(() => new Volunteer(attributes));
    matcher.toThrowError(InvalidAttributeFormatError);
    matcher.toThrowError(InvalidAttributeFormatError.buildMessage("admissionYear"));
  });

  it("throws an error if graduationYear has invalid characters", async () => {
    const attributes = VolunteerGenerator.attributes();
    attributes.graduationYear = "20A6";
    const matcher = expect(() => new Volunteer(attributes));
    matcher.toThrowError(InvalidAttributeFormatError);
    matcher.toThrowError(InvalidAttributeFormatError.buildMessage("graduationYear"));
  });

  it("throws an error if graduationYear has more than four characters", async () => {
    const attributes = VolunteerGenerator.attributes();
    attributes.graduationYear = "201226";
    const matcher = expect(() => new Volunteer(attributes));
    matcher.toThrowError(InvalidAttributeFormatError);
    matcher.toThrowError(InvalidAttributeFormatError.buildMessage("graduationYear"));
  });

  it("throws an error if admissionYear has more than four characters", async () => {
    const attributes = VolunteerGenerator.attributes();
    attributes.admissionYear = "201226";
    const matcher = expect(() => new Volunteer(attributes));
    matcher.toThrowError(InvalidAttributeFormatError);
    matcher.toThrowError(InvalidAttributeFormatError.buildMessage("admissionYear"));
  });

  it("throws an error if no uuid is generated", () => {
    const attributes = VolunteerGenerator.attributes();
    jest.spyOn(UuidGenerator, "generate").mockImplementation(undefined as any);
    const matcher = expect(() => new Volunteer(attributes));
    matcher.toThrowError(AttributeNotDefinedError);
    matcher.toThrowError(AttributeNotDefinedError.buildMessage("uuid"));
  });

  it("throws an error if uuid has invalid format", () => {
    const attributes = VolunteerGenerator.attributes();
    jest.spyOn(UuidGenerator, "generate").mockImplementation(() => "invalidUuidFormat");
    const matcher = expect(() => new Volunteer(attributes));
    matcher.toThrowError(InvalidAttributeFormatError);
    matcher.toThrowError(InvalidAttributeFormatError.buildMessage("uuid"));
  });
});
