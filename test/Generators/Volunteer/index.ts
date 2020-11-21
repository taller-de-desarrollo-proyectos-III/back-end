import { volunteerRepository } from "../../../src/models/Volunteer";
import {
  Commission,
  Role,
  Volunteer,
  VolunteerCommission,
  VolunteerRole
} from "../../../src/models";
import { VolunteerCommissionRepository } from "../../../src/models/VolunteerCommission";
import { getManager } from "typeorm";
import { VolunteerRoleRepository } from "../../../src/models/VolunteerRole";

export const VolunteerGenerator = {
  index: 0,
  getIndex: () => {
    VolunteerGenerator.index += 1;
    return VolunteerGenerator.index;
  },
  getVolunteer: () => {
    const index = VolunteerGenerator.getIndex();
    return new Volunteer({
      dni: `${index}`,
      name: `John${index}`,
      surname: `Doe${index}`,
      email: `johnDoe${index}@gmail.com`,
      linkedin: "John Doe ${index}",
      phoneNumber: `116528767${index}`,
      telegram: "@JohnD${index}",
      admissionYear: "2016",
      graduationYear: "2016",
      country: "Argentina"
    });
  },
  instance: {
    withNoCommissions: async () => VolunteerGenerator.instance.withCommissions([]),
    withCommissions: async (commissions: Commission[] = []) => {
      return getManager().transaction(async manager => {
        const volunteer = VolunteerGenerator.getVolunteer();
        await volunteerRepository().insert(volunteer);
        const volunteerCommissions = commissions.map(
          ({ uuid: commissionUuid }) =>
            new VolunteerCommission({ commissionUuid, volunteerUuid: volunteer.uuid })
        );
        await new VolunteerCommissionRepository(manager).bulkCreate(volunteerCommissions);
        return volunteer;
      });
    },
    withRoles: async (roles: Role[] = []) => {
      return getManager().transaction(async manager => {
        const volunteer = VolunteerGenerator.getVolunteer();
        await volunteerRepository().insert(volunteer);
        const volunteerRoles = roles.map(
          ({ uuid: roleUuid }) => new VolunteerRole({ roleUuid, volunteerUuid: volunteer.uuid })
        );
        await new VolunteerRoleRepository(manager).bulkCreate(volunteerRoles);
        return volunteer;
      });
    }
  }
};
