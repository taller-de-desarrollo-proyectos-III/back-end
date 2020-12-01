import { EntityRepository, getManager, Repository, Any, EntityManager } from "typeorm";
import { State, Volunteer } from "..";
import { VolunteerState } from "./Model";

@EntityRepository(VolunteerState)
export class VolunteerStateRepository {
  private readonly repository: Repository<VolunteerState>;

  constructor(manager: EntityManager) {
    this.repository = manager.getRepository(VolunteerState);
  }

  public bulkCreate(volunteerStates: VolunteerState[]) {
    if (volunteerStates.length === 0) return [];

    return this.repository.insert(volunteerStates);
  }

  public async update(volunteerStates: VolunteerState[], volunteer: Volunteer) {
    await this.repository.delete({ volunteerUuid: volunteer.uuid });
    return this.bulkCreate(volunteerStates);
  }

  public findByVolunteer(volunteer: Volunteer) {
    return this.repository.find({ where: { volunteerUuid: volunteer.uuid } });
  }

  public findByStates(states: State[]) {
    const stateUuids = states.map(({ uuid }) => uuid);
    return this.repository.find({ where: { stateUuid: Any(stateUuids) } });
  }

  public findAll() {
    return this.repository.find();
  }

  public truncate() {
    return this.repository.delete({});
  }
}

export const volunteerStateRepository = () => new VolunteerStateRepository(getManager());
