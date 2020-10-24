import { EntityRepository, AbstractRepository, getCustomRepository } from "typeorm";
import { Volunteer, VolunteerCommission } from "..";
import { VolunteerCommissionRepository } from "../VolunteerCommission";
import { volunteerCommissionRepository } from "../VolunteerCommission";
import { commissionRepository } from "../Commission";
import { VolunteerNotFoundError } from "./Errors/VolunteerNotFoundError";

@EntityRepository(Volunteer)
export class VolunteerRepository extends AbstractRepository<Volunteer> {
  public create(volunteer: Volunteer) {
    return this.manager.transaction(async manager => {
      await manager.insert(Volunteer, volunteer);
      const volunteerCommissions = volunteer.commissions.map(commission => new VolunteerCommission({
        volunteerUuid: volunteer.uuid,
        commissionUuid: commission.uuid
      }));
      await manager
        .getCustomRepository(VolunteerCommissionRepository)
        .bulkCreate(volunteerCommissions);
      return volunteer;
    });
  }

  public async findByUuid(uuid: string) {
    const volunteer = await this.repository.findOne({ uuid });
    if (!volunteer) throw new VolunteerNotFoundError();

    volunteer.commissions = await this.loadCommissions(volunteer);
    return volunteer;
  }

  public async findAll() {
    return (await this.repository.find()).map(volunteer => {
      volunteer.commissions = [];
      return volunteer;
    });
  }

  public truncate() {
    return this.repository.delete({});
  }

  private async loadCommissions(volunteer: Volunteer) {
    const volunteerCommissions = await volunteerCommissionRepository().findByVolunteer(volunteer);
    const commissionUuids = volunteerCommissions.map(({ commissionUuid }) => commissionUuid);
    return commissionRepository().findByUuids(commissionUuids);
  }
}

export const volunteerRepository = () => getCustomRepository(VolunteerRepository);
