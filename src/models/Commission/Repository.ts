import { EntityRepository, AbstractRepository, getCustomRepository, Any } from "typeorm";
import { Commission } from "./Model";
import { CommissionNotFoundError } from "./Errors/CommissionNotFoundError";

@EntityRepository(Commission)
export class CommissionRepository extends AbstractRepository<Commission> {
  public create(commission: Commission) {
    return this.repository.insert(commission);
  }

  public async findByUuid(uuid: string) {
    const commission = await this.repository.findOne({uuid});
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

export const commissionRepository = () => getCustomRepository(CommissionRepository);
