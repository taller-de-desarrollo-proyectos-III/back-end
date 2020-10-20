import { Entity, Column } from "typeorm";
import { UuidGenerator } from "../UuidGenerator";
import { isDefined, isUUID } from "class-validator";
import { AttributeNotDefinedError } from "./Errors/AttributeNotDefinedError";
import { InvalidAttributeFormatError } from "./Errors/InvalidAttributeFormatError";

@Entity({ name: "Volunteers" })
export class Volunteer {
  constructor({ dni, name, surname }: IVolunteerAttributes) {
    this.uuid = UuidGenerator.generate();
    this.dni = dni;
    this.name = name;
    this.surname = surname;
    this.validate();
  }

  @Column({
    type: "uuid",
    nullable: false,
    primary: true
  })
  uuid: string;

  @Column({ type: "varchar", nullable: false })
  dni: string;

  @Column({ type: "varchar", nullable: false })
  name: string;

  @Column({ type: "varchar", nullable: false })
  surname: string;

  public validate() {
    if (!isDefined(this.uuid)) throw new AttributeNotDefinedError("uuid");
    if (!isDefined(this.dni)) throw new AttributeNotDefinedError("dni");
    if (!isDefined(this.name)) throw new AttributeNotDefinedError("name");
    if (!isDefined(this.surname)) throw new AttributeNotDefinedError("surname");
    if (!isUUID(this.uuid)) throw new InvalidAttributeFormatError("uuid");
  }
}

interface IVolunteerAttributes {
  dni: string;
  name: string;
  surname: string;
}
