import { EntityRepository, getManager, Any, Repository, EntityManager } from "typeorm";
import { Role } from "..";
import { RoleNotFoundError } from "./Errors/RoleNotFoundError";

@EntityRepository(Role)
export class RoleRepository {
  private readonly repository: Repository<Role>;

  constructor(manager: EntityManager) {
    this.repository = manager.getRepository(Role);
  }

  public create(role: Role) {
    return this.repository.insert(role);
  }

  public save(role: Role) {
    return this.repository.save(role);
  }

  public async findByUuid(uuid: string) {
    const role = await this.repository.findOne({ uuid });
    if (!role) throw new RoleNotFoundError();

    return role;
  }

  public findByUuids(uuids: string[]) {
    return this.repository.find({ where: { uuid: Any(uuids) } });
  }

  public findAll() {
    return this.repository.find();
  }

  public truncate() {
    return this.repository.delete({});
  }
}

export const roleRepository = () => new RoleRepository(getManager());
