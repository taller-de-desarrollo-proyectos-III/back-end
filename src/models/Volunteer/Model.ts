import { Entity, Column } from "typeorm";
import { UuidGenerator } from "../UuidGenerator";
import { isDefined, isUUID, isEmail, length, isNumberString } from "class-validator";
import { AttributeNotDefinedError } from "../Errors/AttributeNotDefinedError";
import { InvalidAttributeFormatError } from "../Errors/InvalidAttributeFormatError";
import { Commission } from "..";

@Entity({ name: "Volunteers" })
export class Volunteer {
  constructor({
    dni,
    name,
    surname,
    email,
    linkedin,
    phoneNumber,
    telegram,
    admissionYear,
    graduationYear,
    country,
    commissions
  }: IVolunteerAttributes) {
    this.uuid = UuidGenerator.generate();
    this.dni = dni;
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.linkedin = linkedin;
    this.phoneNumber = phoneNumber;
    this.telegram = telegram;
    this.admissionYear = admissionYear;
    this.graduationYear = graduationYear;
    this.country = country;
    this.commissions = commissions || [];
    this.validate();
  }

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

  public commissions: Commission[];

  public validate() {
    if (!isDefined(this.uuid)) throw new AttributeNotDefinedError("uuid");
    if (!isDefined(this.dni)) throw new AttributeNotDefinedError("dni");
    if (!isDefined(this.name)) throw new AttributeNotDefinedError("name");
    if (!isDefined(this.surname)) throw new AttributeNotDefinedError("surname");
    if (!isDefined(this.email)) throw new AttributeNotDefinedError("mail");
    if (!isDefined(this.phoneNumber)) throw new AttributeNotDefinedError("phoneNumber");
    if (!isUUID(this.uuid)) throw new InvalidAttributeFormatError("uuid");
    if (!isEmail(this.email)) throw new InvalidAttributeFormatError("mail");
    if (isDefined(this.admissionYear) && !isNumberString(this.admissionYear)) {
      throw new InvalidAttributeFormatError("admissionYear");
    }
    if (isDefined(this.graduationYear) && !isNumberString(this.graduationYear)) {
      throw new InvalidAttributeFormatError("graduationYear");
    }
    if (isDefined(this.admissionYear) && !length(this.admissionYear, 4, 4)) {
      throw new InvalidAttributeFormatError("admissionYear");
    }
    if (isDefined(this.graduationYear) && !length(this.graduationYear, 4, 4)) {
      throw new InvalidAttributeFormatError("graduationYear");
    }
  }
}

interface IVolunteerAttributes {
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
  commissions?: Commission[];
}
