import { EntityRepository, AbstractRepository, getCustomRepository, Any } from "typeorm";
import { Commission, Volunteer, VolunteerCommission } from "..";
import { VolunteerCommissionRepository } from "../VolunteerCommission";
import { volunteerCommissionRepository } from "../VolunteerCommission";
import { commissionRepository } from "../Commission";
import { VolunteerNotFoundError } from "./Errors/VolunteerNotFoundError";

@EntityRepository(Volunteer)
export class VolunteerRepository extends AbstractRepository<Volunteer> {
  public create(volunteer: Volunteer) {
    return this.manager.transaction(async manager => {
      await manager.insert(Volunteer, volunteer);
      const volunteerCommissions = volunteer.commissions.map(commission =>
        new VolunteerCommission({
          volunteerUuid: volunteer.uuid,
          commissionUuid: commission.uuid
        })
      );
      await manager
        .getCustomRepository(VolunteerCommissionRepository)
        .bulkCreate(volunteerCommissions);
      return volunteer;
    });
  }

  public async findByCommissions(commissions: Commission[]) {
    const repository = volunteerCommissionRepository();
    const volunteerCommission = await repository.findByCommissions(commissions);
    const uuids = volunteerCommission.map(({ volunteerUuid }) => volunteerUuid);
    const volunteers = await this.repository.find({ where: { uuid: Any(uuids) } });
    return Promise.all(volunteers.map(async volunteer => {
      volunteer.commissions = await VolunteerRepository.loadCommissions(volunteer);
      return volunteer;
    }));
  }

  public async findByUuid(uuid: string) {
    const volunteer = await this.repository.findOne({ uuid });
    if (!volunteer) throw new VolunteerNotFoundError();

    volunteer.commissions = await VolunteerRepository.loadCommissions(volunteer);
    return volunteer;
  }

  public async findAll() {
    const volunteers = await this.repository.find();
    return VolunteerRepository.setEmptyCommission(volunteers);
  }

  public truncate() {
    return this.repository.delete({});
  }

  private static setEmptyCommission(volunteers: Volunteer[]) {
    return volunteers.map(volunteer => {
      volunteer.commissions = [];
      return volunteer;
    });
  }

  private static async loadCommissions(volunteer: Volunteer) {
    const volunteerCommissions = await volunteerCommissionRepository().findByVolunteer(volunteer);
    const commissionUuids = volunteerCommissions.map(({ commissionUuid }) => commissionUuid);
    return commissionRepository().findByUuids(commissionUuids);
  }
}

export const volunteerRepository = () => getCustomRepository(VolunteerRepository);
