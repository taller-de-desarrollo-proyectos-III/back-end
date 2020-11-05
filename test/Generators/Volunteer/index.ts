import { volunteerRepository } from "../../../src/models/Volunteer";
import { Commission, Volunteer } from "../../../src/models";

export const VolunteerGenerator = {
  index: 0,
  getIndex: () => {
    VolunteerGenerator.index += 1;
    return VolunteerGenerator.index;
  },
  instance: {
    withNoCommissions: async () => VolunteerGenerator.instance.withCommissions([]),
    withCommissions: async (commissions?: Commission[]) => {
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
        country: "Argentina",
        commissions
      });
      await volunteerRepository().create(volunteer);
      return volunteer;
    }
  }
};
