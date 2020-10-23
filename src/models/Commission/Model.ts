import { Entity, Column } from "typeorm";
import { UuidGenerator } from "../UuidGenerator";
import { isDefined, isUUID } from "class-validator";
import { AttributeNotDefinedError } from "../Errors/AttributeNotDefinedError";
import { InvalidAttributeFormatError } from "../Errors/InvalidAttributeFormatError";

@Entity({ name: "Commission" })
export class Commission {
  constructor({ name }: ICommissionAttributes) {
    this.uuid = UuidGenerator.generate();
    this.name = name;
    this.validate();
  }

  @Column({
    type: "uuid",
    nullable: false,
    primary: true
  })
  uuid: string;

  @Column({ type: "varchar", nullable: false })
  name: string;

  public validate() {
    if (!isDefined(this.uuid)) throw new AttributeNotDefinedError("uuid");
    if (!isDefined(this.name)) throw new AttributeNotDefinedError("name");
    if (!isUUID(this.uuid)) throw new InvalidAttributeFormatError("uuid");
  }
}

interface ICommissionAttributes {
  name: string;
}
