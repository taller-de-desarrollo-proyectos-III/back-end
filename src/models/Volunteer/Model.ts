import { Entity, Column, ManyToMany } from "typeorm";
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
    mail,
    linkedin,
    celular,
    telegram,
    entryDate,
    graduationDate,
    country,
    commissions
  }: IVolunteerAttributes) {
    this.uuid = UuidGenerator.generate();
    this.dni = dni;
    this.name = name;
    this.surname = surname;
    this.mail = mail;
    this.linkedin = linkedin;
    this.celular = celular;
    this.telegram = telegram;
    this.entryDate = entryDate;
    this.graduationDate = graduationDate;
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
  public mail: string;

  @Column()
  public linkedin: string;

  @Column()
  public celular: string;

  @Column()
  public telegram: string;

  @Column()
  public entryDate: string;

  @Column()
  public graduationDate: string;

  @Column()
  public country: string;

  @ManyToMany(() => Commission)
  public commissions: Commission[];

  public validate() {
    if (!isDefined(this.uuid)) throw new AttributeNotDefinedError("uuid");
    if (!isDefined(this.dni)) throw new AttributeNotDefinedError("dni");
    if (!isDefined(this.name)) throw new AttributeNotDefinedError("name");
    if (!isDefined(this.surname)) throw new AttributeNotDefinedError("surname");
    if (!isDefined(this.mail)) throw new AttributeNotDefinedError("mail");
    if (!isDefined(this.celular)) throw new AttributeNotDefinedError("celular");
    if (!isUUID(this.uuid)) throw new InvalidAttributeFormatError("uuid");
    if (!isEmail(this.mail)) throw new InvalidAttributeFormatError("mail");
    if (isDefined(this.entryDate) && !isNumberString(this.entryDate)) {
      throw new InvalidAttributeFormatError("entryDate");
    }
    if (isDefined(this.graduationDate) && !isNumberString(this.graduationDate)) {
      throw new InvalidAttributeFormatError("graduationDate");
    }
    if (isDefined(this.entryDate) && !length(this.entryDate, 4, 4)) {
      throw new InvalidAttributeFormatError("entryDate");
    }
    if (isDefined(this.graduationDate) && !length(this.graduationDate, 4, 4)) {
      throw new InvalidAttributeFormatError("graduationDate");
    }
  }
}

interface IVolunteerAttributes {
  dni: string;
  name: string;
  surname: string;
  mail: string;
  linkedin: string;
  celular: string;
  telegram: string;
  entryDate: string;
  graduationDate: string;
  country: string;
  commissions?: Commission[];
}
