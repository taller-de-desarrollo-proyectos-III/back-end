import { EntityRepository, getManager, Repository, Any, EntityManager } from "typeorm";
import { Role, Volunteer } from "..";
import { VolunteerRole } from "./Model";

@EntityRepository(VolunteerRole)
export class VolunteerRoleRepository {
  private readonly repository: Repository<VolunteerRole>;

  constructor(manager: EntityManager) {
    this.repository = manager.getRepository(VolunteerRole);
  }

  public bulkCreate(volunteerRoles: VolunteerRole[]) {
    if (volunteerRoles.length === 0) return [];

    return this.repository.insert(volunteerRoles);
  }

  public async update(volunteerRoles: VolunteerRole[], volunteer: Volunteer) {
    await this.repository.delete({ volunteerUuid: volunteer.uuid });
    return this.bulkCreate(volunteerRoles);
  }

  public findByVolunteer(volunteer: Volunteer) {
    return this.repository.find({ where: { volunteerUuid: volunteer.uuid } });
  }

  public findByRoles(roles: Role[]) {
    const roleUuids = roles.map(({ uuid }) => uuid);
    return this.repository.find({ where: { roleUuid: Any(roleUuids) } });
  }

  public findAll() {
    return this.repository.find();
  }

  public truncate() {
    return this.repository.delete({});
  }
}

export const volunteerRoleRepository = () => new VolunteerRoleRepository(getManager());
