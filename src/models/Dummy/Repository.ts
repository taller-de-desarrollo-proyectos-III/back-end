import { EntityRepository, AbstractRepository, getCustomRepository } from "typeorm";
import { Dummy } from "../../models";

@EntityRepository(Dummy)
export class DummyRepository extends AbstractRepository<Dummy> {
  public create(dummy: Dummy) {
    return this.repository.save(dummy);
  }

  public async findByUuid(uuid: string) {
    const dummy = await this.repository.findOne({ uuid });
    if (!dummy) throw new Error("DummyNotFoundError");

    return dummy;
  }

  public findAll() {
    return this.repository.find();
  }

  public truncate() {
    return this.repository.delete({});
  }
}

export const dummyRepository = () => getCustomRepository(DummyRepository);
