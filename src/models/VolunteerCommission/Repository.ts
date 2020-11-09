import { EntityRepository, getManager, Repository, Any, EntityManager } from "typeorm";
import { Commission, Volunteer, VolunteerCommission } from "..";

@EntityRepository(VolunteerCommission)
export class VolunteerCommissionRepository {
  private readonly repository: Repository<VolunteerCommission>;

  constructor(manager: EntityManager) {
    this.repository = manager.getRepository(VolunteerCommission);
  }

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

export const volunteerCommissionRepository = () => new VolunteerCommissionRepository(getManager());
