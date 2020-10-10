import { Entity, Column } from "typeorm";
import { UuidGenerator } from "../UuidGenerator";
import { isDefined, isUUID } from "class-validator";

@Entity()
export class Dummy {
  constructor({ welcomeMessage }: IDummyAttributes) {
    this.welcomeMessage = welcomeMessage;
    this.uuid = UuidGenerator.generate();
    this.validate();
  }

  @Column({
    type: "uuid",
    nullable: false,
    primary: true
  })
  uuid: string;

  @Column({ nullable: false, type: "varchar" })
  welcomeMessage: string;

  public validate() {
    if (!isDefined(this.uuid)) throw new Error("uuid must be defined");
    if (!isDefined(this.welcomeMessage)) throw new Error("welcomeMessage must be defined");
    if (!isUUID(this.uuid)) throw new Error("uuid must have uuid format");
  }
}


interface IDummyAttributes {
  welcomeMessage: string;
}
