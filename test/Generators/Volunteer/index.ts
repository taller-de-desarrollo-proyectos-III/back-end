import { volunteerRepository } from "../../../src/models/Volunteer";
import { Commission, Volunteer, VolunteerCommission } from "../../../src/models";
import { VolunteerCommissionRepository } from "../../../src/models/VolunteerCommission";
import { getManager } from "typeorm";

export const VolunteerGenerator = {
  index: 0,
  getIndex: () => {
    VolunteerGenerator.index += 1;
    return VolunteerGenerator.index;
  },
  instance: {
    withNoCommissions: async () => VolunteerGenerator.instance.withCommissions([]),
    withCommissions: async (commissions: Commission[] = []) => {
      const index = VolunteerGenerator.getIndex();
      const volunteer = new Volunteer({
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
      return getManager().transaction(async manager => {
        await volunteerRepository().insert(volunteer);
        const volunteerCommissions = commissions.map(
          ({ uuid: commissionUuid }) =>
            new VolunteerCommission({ commissionUuid, volunteerUuid: volunteer.uuid })
        );
        await new VolunteerCommissionRepository(manager).bulkCreate(volunteerCommissions);
        return volunteer;
      });
    }
  }
};
