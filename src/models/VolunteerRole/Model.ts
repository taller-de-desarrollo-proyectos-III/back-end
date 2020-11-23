import { Entity, PrimaryColumn } from "typeorm";
import { isDefined, isUUID } from "class-validator";
import { AttributeNotDefinedError } from "../Errors";
import { InvalidAttributeFormatError } from "../Errors";

@Entity({ name: "VolunteerRoles" })
export class VolunteerRole {
  constructor({ volunteerUuid, roleUuid }: IVolunteerRoleAttributes) {
    this.volunteerUuid = volunteerUuid;
    this.roleUuid = roleUuid;
    this.validate();
  }

  @PrimaryColumn()
  public volunteerUuid: string;

  @PrimaryColumn()
  public roleUuid: string;

  public validate() {
    if (!isDefined(this.volunteerUuid)) throw new AttributeNotDefinedError("volunteerUuid");
    if (!isDefined(this.roleUuid)) throw new AttributeNotDefinedError("roleUuid");
    if (!isUUID(this.volunteerUuid)) throw new InvalidAttributeFormatError("volunteerUuid");
    if (!isUUID(this.roleUuid)) throw new InvalidAttributeFormatError("roleUuid");
  }
}

interface IVolunteerRoleAttributes {
  volunteerUuid: string;
  roleUuid: string;
}
