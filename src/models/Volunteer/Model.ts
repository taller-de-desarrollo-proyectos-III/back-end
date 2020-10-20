import { Entity, Column } from "typeorm";
import { UuidGenerator } from "../UuidGenerator";
import { isDefined, isUUID } from "class-validator";

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
    if (!isDefined(this.uuid)) throw new Error("uuid must be defined");
    if (!isDefined(this.dni)) throw new Error("dni must be defined");
    if (!isDefined(this.name)) throw new Error("name must be defined");
    if (!isDefined(this.surname)) throw new Error("surname must be defined");
    if (!isUUID(this.uuid)) throw new Error("uuid must have uuid format");
  }
}

interface IVolunteerAttributes {
  dni: string;
  name: string;
  surname: string;
}