import { EntityRepository, getManager, Any, EntityManager, Repository } from "typeorm";
import { Commission, Volunteer, VolunteerCommission } from "..";
import { VolunteerCommissionRepository } from "../VolunteerCommission";
import { volunteerCommissionRepository } from "../VolunteerCommission";
import { commissionRepository } from "../Commission";
import { VolunteerNotFoundError } from "./Errors/VolunteerNotFoundError";
import { AttributeNotDefinedError } from "../Errors";

@EntityRepository(Volunteer)
export class VolunteerRepository {
  private readonly repository: Repository<Volunteer>;
  private readonly manager: EntityManager;

  constructor(manager: EntityManager) {
    this.manager = manager;
    this.repository = manager.getRepository(Volunteer);
  }

  public create(volunteer: Volunteer) {
    return this.manager.transaction(async manager => {
      await manager.insert(Volunteer, volunteer);
      const volunteerCommissions = this.getVolunteerCommissions(volunteer);
      await new VolunteerCommissionRepository(manager).bulkCreate(volunteerCommissions);
      return volunteer;
    });
  }

  public async save(volunteer: Volunteer) {
    return this.repository.save(volunteer);
  }

  public async findByCommissions(commissions: Commission[]) {
    const repository = new VolunteerCommissionRepository(getManager());
    const volunteerCommission = await repository.findByCommissions(commissions);
    const uuids = volunteerCommission.map(({ volunteerUuid }) => volunteerUuid);
    const volunteers = await this.repository.find({ where: { uuid: Any(uuids) } });
    return Promise.all(
      volunteers.map(async volunteer => {
        volunteer.commissions = await VolunteerRepository.loadCommissions(volunteer);
        return volunteer;
      })
    );
  }

  public async findByUuid(uuid: string) {
    if (!uuid) throw new AttributeNotDefinedError("uuid");

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

  private getVolunteerCommissions({ uuid: volunteerUuid, commissions }: Volunteer) {
    return commissions.map(
      ({ uuid: commissionUuid }) => new VolunteerCommission({ volunteerUuid, commissionUuid })
    );
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

export const volunteerRepository = () => new VolunteerRepository(getManager());
