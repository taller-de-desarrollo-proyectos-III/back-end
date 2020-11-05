import { EntityRepository, AbstractRepository, getCustomRepository, Any } from "typeorm";
import { Commission, Volunteer, VolunteerCommission } from "..";

@EntityRepository(VolunteerCommission)
export class VolunteerCommissionRepository extends AbstractRepository<VolunteerCommission> {
  public bulkCreate(volunteerCommissions: VolunteerCommission[]) {
    if (volunteerCommissions.length === 0) return [];

    return this.repository.insert(volunteerCommissions);
  }

  public async update(volunteerCommissions: VolunteerCommission[], volunteer: Volunteer) {
    await this.repository.delete({ volunteerUuid: volunteer.uuid });
    return this.bulkCreate(volunteerCommissions);
  }

  public findByVolunteer(volunteer: Volunteer) {
    return this.repository.find({ where: { volunteerUuid: volunteer.uuid } });
  }

  public findByCommissions(commissions: Commission[]) {
    const commissionsUuids = commissions.map(({ uuid }) => uuid);
    return this.repository.find({ where: { commissionUuid: Any(commissionsUuids) } });
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
