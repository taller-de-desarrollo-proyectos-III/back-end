import { EntityRepository, AbstractRepository, getCustomRepository } from "typeorm";
import { Volunteer, VolunteerCommission } from "..";

@EntityRepository(VolunteerCommission)
export class VolunteerCommissionRepository extends AbstractRepository<VolunteerCommission> {
  public bulkCreate(volunteerCommissions: VolunteerCommission[]) {
    if (volunteerCommissions.length === 0) return [];

    return this.repository.insert(volunteerCommissions);
  }

  public findByVolunteer(volunteer: Volunteer) {
    return this.repository.find({ where: { volunteerUuid: volunteer.uuid } });
  }

  public findAll() {
    return this.repository.find();
  }

  public truncate() {
    return this.repository.delete({});
  }
}

export const volunteerCommissionRepository = () =>
  getCustomRepository(VolunteerCommissionRepository);
