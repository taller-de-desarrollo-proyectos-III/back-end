import { volunteerCommissionRepository } from "../../../src/models/VolunteerCommission";
import { VolunteerCommission } from "../../../src/models";
import { VolunteerGenerator } from "../Volunteer";
import { CommissionGenerator } from "../Commission";

export const VolunteerCommissionGenerator = {
  instance: async () => {
    const volunteer = await VolunteerGenerator.instance.withNoCommissions();
    const firstCommission = await CommissionGenerator.instance();
    const volunteerCommission = new VolunteerCommission({
      volunteerUuid: volunteer.uuid,
      commissionUuid: firstCommission.uuid
    });
    await volunteerCommissionRepository().bulkCreate([volunteerCommission]);
    return volunteerCommission;
  }
};
