import { Entity, Column } from "typeorm";
import { UuidGenerator } from "../UuidGenerator";
import { isDefined, isUUID, isEmail, length, isNumberString } from "class-validator";
import { AttributeNotDefinedError } from "../Errors/AttributeNotDefinedError";
import { InvalidAttributeFormatError } from "../Errors/InvalidAttributeFormatError";

@Entity({ name: "Volunteers" })
export class Volunteer {
  @Column({ primary: true })
  public uuid: string;

  @Column()
  public dni: string;

  @Column()
  public name: string;

  @Column()
  public surname: string;

  @Column()
  public email: string;

  @Column()
  public linkedin?: string;

  @Column()
  public phoneNumber: string;

  @Column()
  public telegram?: string;

  @Column()
  public admissionYear?: string;

  @Column()
  public graduationYear?: string;

  @Column()
  public country?: string;

  @Column()
  public notes?: string;

  @Column()
  public stateUuid: string;

  constructor(attributes: IVolunteerAttributes) {
    this.setUuid(attributes.uuid || UuidGenerator.generate());
    this.setDni(attributes.dni);
    this.setName(attributes.name);
    this.setSurname(attributes.surname);
    this.setEmail(attributes.email);
    this.linkedin = attributes.linkedin;
    this.setPhoneNumber(attributes.phoneNumber);
    this.telegram = attributes.telegram;
    this.setAdmissionYear(attributes.admissionYear);
    this.setGraduationYear(attributes.graduationYear);
    this.country = attributes.country;
    this.notes = attributes.notes;
    this.setStateUuid(attributes.stateUuid);
  }

  private setUuid(uuid: string) {
    if (!isDefined(uuid)) throw new AttributeNotDefinedError("uuid");
    if (!isUUID(uuid)) throw new InvalidAttributeFormatError("uuid");
    this.uuid = uuid;
  }

  private setDni(dni: string) {
    if (!isDefined(dni)) throw new AttributeNotDefinedError("dni");
    this.dni = dni;
  }

  private setName(name: string) {
    if (!isDefined(name)) throw new AttributeNotDefinedError("name");
    this.name = name;
  }

  private setSurname(surname: string) {
    if (!isDefined(surname)) throw new AttributeNotDefinedError("surname");
    this.surname = surname;
  }

  private setEmail(email: string) {
    if (!isDefined(email)) throw new AttributeNotDefinedError("email");
    if (!isEmail(email)) throw new InvalidAttributeFormatError("email");
    this.email = email;
  }

  private setPhoneNumber(phoneNumber: string) {
    if (!isDefined(phoneNumber)) throw new AttributeNotDefinedError("phoneNumber");
    this.phoneNumber = phoneNumber;
  }

  private setAdmissionYear(admissionYear?: string) {
    if (!isDefined(admissionYear)) return;
    if (!isNumberString(admissionYear)) throw new InvalidAttributeFormatError("admissionYear");
    if (!length(admissionYear, 4, 4)) throw new InvalidAttributeFormatError("admissionYear");
    this.admissionYear = admissionYear;
  }

  private setGraduationYear(graduationYear?: string) {
    if (!isDefined(graduationYear)) return;
    if (!isNumberString(graduationYear)) throw new InvalidAttributeFormatError("graduationYear");
    if (!length(graduationYear, 4, 4)) throw new InvalidAttributeFormatError("graduationYear");
    this.graduationYear = graduationYear;
  }

  private setStateUuid(stateUuid: string) {
    if (!isDefined(stateUuid)) throw new AttributeNotDefinedError("stateUuid");
    if (!isUUID(stateUuid)) throw new InvalidAttributeFormatError("stateUuid");
    this.stateUuid = stateUuid;
  }
}

export interface IVolunteerAttributes {
  uuid?: string;
  dni: string;
  name: string;
  surname: string;
  email: string;
  linkedin?: string;
  phoneNumber: string;
  telegram?: string;
  admissionYear?: string;
  graduationYear?: string;
  country?: string;
  notes?: string;
  stateUuid: string;
}
