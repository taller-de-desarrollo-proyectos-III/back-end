import { EntityRepository, getManager, Any, Repository, EntityManager } from "typeorm";
import { State } from "..";
import { StateNotFoundError } from "./Errors/StateNotFoundError";

@EntityRepository(State)
export class StateRepository {
  private readonly repository: Repository<State>;

  constructor(manager: EntityManager) {
    this.repository = manager.getRepository(State);
  }

  public insert(state: State) {
    return this.repository.insert(state);
  }

  public save(state: State) {
    return this.repository.save(state);
  }

  public async findByUuid(uuid: string) {
    const state = await this.repository.findOne({ uuid });
    if (!state) throw new StateNotFoundError();

    return state;
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

export const stateRepository = () => new StateRepository(getManager());
