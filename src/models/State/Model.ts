import { Entity, Column } from "typeorm";
import { UuidGenerator } from "../UuidGenerator";
import { isDefined, isUUID, isEmpty } from "class-validator";
import { AttributeNotDefinedError, InvalidAttributeFormatError } from "../Errors";

@Entity({ name: "States" })
export class State {
  @Column({ primary: true })
  public uuid: string;

  @Column()
  public name: string;

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
  }

  public setName(name: string) {
    this.validateName(name);
    this.name = name;
  }
}

interface IStateAttributes {
  uuid?: string;
  name: string;
}
