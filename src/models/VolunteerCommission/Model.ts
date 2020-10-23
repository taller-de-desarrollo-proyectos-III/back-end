import { Entity, Column } from "typeorm";
import { isDefined, isUUID } from "class-validator";
import { AttributeNotDefinedError } from "../Errors/AttributeNotDefinedError";
import { InvalidAttributeFormatError } from "../Errors/InvalidAttributeFormatError";

@Entity({ name: "VolunteerCommissions" })
export class VolunteerCommission {
  constructor({ volunteerUuid, commissionUuid }: IVolunteerCommissionAttributes) {
    this.volunteerUuid = volunteerUuid;
    this.commissionUuid = commissionUuid;
    this.validate();
  }

  @Column()
  public volunteerUuid: string;

  @Column()
  public commissionUuid: string;

  public validate() {
    if (!isDefined(this.volunteerUuid)) throw new AttributeNotDefinedError("volunteerUuid");
    if (!isDefined(this.commissionUuid)) throw new AttributeNotDefinedError("commissionUuid");
    if (!isUUID(this.volunteerUuid)) throw new InvalidAttributeFormatError("volunteerUuid");
    if (!isUUID(this.commissionUuid)) throw new InvalidAttributeFormatError("commissionUuid");
  }
}

interface IVolunteerCommissionAttributes {
  volunteerUuid: string;
  commissionUuid: string;
}
