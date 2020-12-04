import { Entity, Column } from "typeorm";
import { UuidGenerator } from "../UuidGenerator";
import { isDefined, isUUID, isEmpty } from "class-validator";
import { AttributeNotDefinedError } from "../Errors/AttributeNotDefinedError";
import { InvalidAttributeFormatError } from "../Errors/InvalidAttributeFormatError";

@Entity({ name: "States" })
export class State {
  constructor({ uuid, name }: IStateAttributes) {
    this.uuid = uuid || UuidGenerator.generate();
    this.name = name;
    this.validateUuid();
    this.validateName(this.name);
  }

  private validateUuid() {
    if (!isDefined(this.uuid)) throw new AttributeNotDefinedError("uuid");
    if (!isUUID(this.uuid)) throw new InvalidAttributeFormatError("uuid");
  }

  public validateName(name: string) {
    if (!isDefined(name)) throw new AttributeNotDefinedError("name");
    if (isEmpty(name)) throw new AttributeNotDefinedError("name");
    this.name = name;
  }
  @Column({ primary: true })
  public uuid: string;

  @Column()
  public name: string;
}

interface IStateAttributes {
  uuid?: string;
  name: string;
}
