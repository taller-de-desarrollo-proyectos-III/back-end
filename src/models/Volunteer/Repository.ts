import { EntityManager, EntityRepository, getManager, In, Repository } from "typeorm";
import { Commission, Role, Volunteer } from "..";
import { VolunteerNotFoundError } from "./Errors";
import { AttributeNotDefinedError } from "../Errors";
import { volunteerRoleRepository } from "../VolunteerRole";
import { volunteerCommissionRepository } from "../VolunteerCommission";

@EntityRepository(Volunteer)
export class VolunteerRepository {
  private readonly repository: Repository<Volunteer>;
  private readonly manager: EntityManager;

  constructor(manager: EntityManager) {
    this.manager = manager;
    this.repository = manager.getRepository(Volunteer);
  }

  public insert(volunteer: Volunteer) {
    return this.manager.insert(Volunteer, volunteer);
  }

  public save(volunteer: Volunteer) {
    return this.repository.save(volunteer);
  }

  public async findByCommissions(commissions: Commission[]) {
    if (commissions.length === 0) return [];

    const volunteerCommissions = await volunteerCommissionRepository().findByCommissions(
      commissions
    );
    return volunteerRepository().findByUuids(
      volunteerCommissions.map(volunteerCommission => volunteerCommission.volunteerUuid)
    );
  }

  public async findByRoles(roles: Role[]) {
    if (roles.length === 0) return [];

    const volunteerRoles = await volunteerRoleRepository().findByRoles(roles);
    return volunteerRepository().findByUuids(
      volunteerRoles.map(volunteerRole => volunteerRole.volunteerUuid)
    );
  }

  public async findByUuid(uuid: string) {
    if (!uuid) throw new AttributeNotDefinedError("uuid");

    const volunteer = await this.repository.findOne({ uuid });
    if (!volunteer) throw new VolunteerNotFoundError();

    return volunteer;
  }

  public async findByUuids(uuids: string[]) {
    if (uuids.length === 0) return [];

    return await this.repository.find({
      uuid: In(uuids)
    });
  }

  public async findAll() {
    return this.repository.find();
  }

  public truncate() {
    return this.repository.delete({});
  }
}

export const volunteerRepository = () => new VolunteerRepository(getManager());
