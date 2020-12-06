import { EntityRepository, getManager, EntityManager, Repository } from "typeorm";
import { Volunteer } from "..";
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

  public async find({ commissionUuids = [], roleUuids = [] }: IFindOptions = defaultFindOptions) {
    const formattedCommissionUuids = commissionUuids.map(uuid => `'${uuid}'`).join(",");
    const formattedRoleUuids = roleUuids.map(uuid => `'${uuid}'`).join(",");

    const commissionsWhereClause =
      commissionUuids.length === 0 ? "IS NULL" : `IN (${formattedCommissionUuids})`;

    const rolesWhereClause = roleUuids.length === 0 ? "IS NULL" : `IN (${formattedRoleUuids})`;

    const query = `
      SELECT DISTINCT "Volunteers".uuid as uuid, "Volunteers".*
      FROM "Volunteers"
      LEFT JOIN "VolunteerCommissions" ON "VolunteerCommissions"."volunteerUuid" = "Volunteers"."uuid"
      LEFT JOIN "VolunteerRoles" ON "VolunteerRoles"."volunteerUuid" = "Volunteers"."uuid"
      WHERE "VolunteerCommissions"."commissionUuid" ${commissionsWhereClause}
      AND "VolunteerRoles"."roleUuid" ${rolesWhereClause}
    `;

    const results: IVolunteerAttributes[] = await this.repository.query(query);
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

const defaultFindOptions = { commissionUuids: [], roleUuids: [] };

interface IFindOptions {
  commissionUuids?: string[];
  roleUuids?: string[];
}

export const volunteerRepository = () => new VolunteerRepository(getManager());
