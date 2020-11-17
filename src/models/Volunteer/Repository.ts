import { EntityRepository, getManager, EntityManager, Repository } from "typeorm";
import { Commission, Volunteer } from "..";
import { IVolunteerAttributes } from "../Volunteer/Model";
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

  public insert(volunteer: Volunteer) {
    return this.manager.insert(Volunteer, volunteer);
  }

  public save(volunteer: Volunteer) {
    return this.repository.save(volunteer);
  }

  public async findByCommissions(commissions: Commission[]) {
    if (commissions.length === 0) return [];

    const commissionUuids = commissions.map(({ uuid }) => `'${uuid}'`).join(",");
    const results: IVolunteerAttributes[] = await this.repository.query(`
      SELECT DISTINCT "Volunteers".uuid as uuid, "Volunteers".*
      FROM "Volunteers" JOIN "VolunteerCommissions"
      ON "VolunteerCommissions"."volunteerUuid" = "Volunteers"."uuid"
      WHERE "VolunteerCommissions"."commissionUuid" IN (${commissionUuids})
    `);
    return results.map(result => new Volunteer(result));
  }

  public async findByUuid(uuid: string) {
    if (!uuid) throw new AttributeNotDefinedError("uuid");

    const volunteer = await this.repository.findOne({ uuid });
    if (!volunteer) throw new VolunteerNotFoundError();

    return volunteer;
  }

  public async findAll() {
    return this.repository.find();
  }

  public truncate() {
    return this.repository.delete({});
  }
}

export const volunteerRepository = () => new VolunteerRepository(getManager());
