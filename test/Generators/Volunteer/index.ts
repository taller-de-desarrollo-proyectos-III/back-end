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
import { UuidGenerator } from "../../../src/models/UuidGenerator";

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
      country: "Argentina",
      notes: "Notes",
      stateUuid: UuidGenerator.generate()
    });
  },
  instance: {
    with: async ({ commissions = [], roles = [] }: IAttributes = defaultAttributes) => {
      return getManager().transaction(async manager => {
        const volunteer = VolunteerGenerator.getVolunteer();
        await volunteerRepository().insert(volunteer);
        const volunteerCommissions = commissions?.map(
          ({ uuid: commissionUuid }) =>
            new VolunteerCommission({ commissionUuid, volunteerUuid: volunteer.uuid })
        );
        await new VolunteerCommissionRepository(manager).bulkCreate(volunteerCommissions);
        const volunteerRoles = roles?.map(
          ({ uuid: roleUuid }) => new VolunteerRole({ roleUuid, volunteerUuid: volunteer.uuid })
        );
        await new VolunteerRoleRepository(manager).bulkCreate(volunteerRoles);
        return volunteer;
      });
    }
  }
};

const defaultAttributes = { commissions: [], roles: [] };

interface IAttributes {
  commissions?: Commission[];
  roles?: Role[];
}
