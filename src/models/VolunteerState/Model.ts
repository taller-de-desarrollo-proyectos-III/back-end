import { Entity, PrimaryColumn } from "typeorm";
import { isDefined, isUUID } from "class-validator";
import { AttributeNotDefinedError } from "../Errors";
import { InvalidAttributeFormatError } from "../Errors";

@Entity({ name: "VolunteerStates" })
export class VolunteerState {
  constructor({ volunteerUuid, stateUuid }: IVolunteerStateAttributes) {
    this.volunteerUuid = volunteerUuid;
    this.stateUuid = stateUuid;
    this.validate();
  }

  @PrimaryColumn()
  public volunteerUuid: string;

  @PrimaryColumn()
  public stateUuid: string;

  public validate() {
    if (!isDefined(this.volunteerUuid)) throw new AttributeNotDefinedError("volunteerUuid");
    if (!isDefined(this.stateUuid)) throw new AttributeNotDefinedError("stateUuid");
    if (!isUUID(this.volunteerUuid)) throw new InvalidAttributeFormatError("volunteerUuid");
    if (!isUUID(this.stateUuid)) throw new InvalidAttributeFormatError("stateUuid");
  }
}

interface IVolunteerStateAttributes {
  volunteerUuid: string;
  stateUuid: string;
}
