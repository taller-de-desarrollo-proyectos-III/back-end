import { EntityRepository, AbstractRepository, getCustomRepository } from "typeorm";
import { Volunteer } from "./Model";
import { VolunteerNotFoundError } from "./Errors/VolunteerNotFoundError";

@EntityRepository(Volunteer)
export class VolunteerRepository extends AbstractRepository<Volunteer> {
  public create(volunteer: Volunteer) {
    return this.repository.insert(volunteer);
  }

  public async findByUuid(uuid: string) {
    const volunteer = await this.repository.findOne({uuid});
    if (!volunteer) throw new VolunteerNotFoundError();

    return volunteer;
  }

  public findAll() {
    return this.repository.find();
  }

  public truncate() {
    return this.repository.delete({});
  }
}

export const volunteerRepository = () => getCustomRepository(VolunteerRepository);
