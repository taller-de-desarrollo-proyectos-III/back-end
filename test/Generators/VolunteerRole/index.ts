import { VolunteerRole } from "../../../src/models";
import { VolunteerGenerator } from "../Volunteer";
import { RoleGenerator } from "../Role";
import { volunteerRoleRepository } from "../../../src/models/VolunteerRole";

export const VolunteerRoleGenerator = {
  instance: async () => {
    const volunteer = await VolunteerGenerator.instance.with();
    const firstRole = await RoleGenerator.instance();
    const volunteerRole = new VolunteerRole({
      volunteerUuid: volunteer.uuid,
      roleUuid: firstRole.uuid
    });
    await volunteerRoleRepository().bulkCreate([volunteerRole]);
    return volunteerRole;
  }
};
