import { EntityRepository, getManager, Any, Repository, EntityManager } from "typeorm";
import { Commission } from "..";
import { CommissionNotFoundError } from "./Errors/CommissionNotFoundError";

@EntityRepository(Commission)
export class CommissionRepository {
  private readonly repository: Repository<Commission>;

  constructor(manager: EntityManager) {
    this.repository = manager.getRepository(Commission);
  }

  public create(commission: Commission) {
    return this.repository.insert(commission);
  }

  public save(commission: Commission) {
    return this.repository.save(commission);
  }

  public async findByUuid(uuid: string) {
    const commission = await this.repository.findOne({ uuid });
    if (!commission) throw new CommissionNotFoundError();

    return commission;
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

export const commissionRepository = () => new CommissionRepository(getManager());
