import { Volunteer } from "../../models";
import { commissionRepository } from "../../models/Commission";
import { roleRepository } from "../../models/Role";
import { stateRepository } from "../../models/State";
import { omit } from "lodash";

export const VolunteerSerializer = {
  serialize: async (volunteer: Volunteer) => {
    const commissions = await commissionRepository().findByVolunteer(volunteer);
    const roles = await roleRepository().findByVolunteer(volunteer);
    const state = await stateRepository().findByUuid(volunteer.stateUuid);
    return {
      ...omit(volunteer, "stateUuid"),
      commissions,
      roles,
      state
    };
  }
};
