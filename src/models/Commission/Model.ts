import { Entity, Column } from "typeorm";
import { UuidGenerator } from "../UuidGenerator";
import { isDefined, isEmpty, isUUID } from "class-validator";
import { AttributeNotDefinedError } from "../Errors/AttributeNotDefinedError";
import { InvalidAttributeFormatError } from "../Errors/InvalidAttributeFormatError";

@Entity({ name: "Commissions" })
export class Commission {
  constructor({ uuid, name, description }: ICommissionAttributes) {
    this.uuid = uuid || UuidGenerator.generate();
    this.name = name;
    this.description = description;
    this.validate();
  }

  @Column({ primary: true })
  public uuid: string;

  @Column()
  public name: string;

  @Column()
  public description: string;

  public validate() {
    if (!isDefined(this.uuid)) throw new AttributeNotDefinedError("uuid");
    if (!isDefined(this.name)) throw new AttributeNotDefinedError("name");
    if (!isUUID(this.uuid)) throw new InvalidAttributeFormatError("uuid");
    if (isEmpty(this.name)) throw new AttributeNotDefinedError("name");
  }
}

interface ICommissionAttributes {
  uuid?: string;
  name: string;
  description: string;
}
