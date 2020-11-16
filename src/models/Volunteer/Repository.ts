import { EntityRepository, getManager, EntityManager, Repository } from "typeorm";
import { Commission, Volunteer } from "..";
import { IVolunteerAttributes } from "../Volunteer/Model";
import { volunteerCommissionRepository } from "../VolunteerCommission";
import { commissionRepository } from "../Commission";
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
      SELECT *
      FROM "Volunteers" JOIN "VolunteerCommissions"
      ON "VolunteerCommissions"."volunteerUuid" = "Volunteers"."uuid"
      WHERE "VolunteerCommissions"."commissionUuid" IN (${commissionUuids})
    `);
    return results.map(result => {
      const volunteer = new Volunteer(result);
      volunteer.commissions = undefined as any;
      return volunteer;
    });
  }

  public async findByUuid(uuid: string) {
    if (!uuid) throw new AttributeNotDefinedError("uuid");

    const volunteer = await this.repository.findOne({ uuid });
    if (!volunteer) throw new VolunteerNotFoundError();

    volunteer.commissions = await VolunteerRepository.loadCommissions(volunteer);
    return volunteer;
  }

  public async findAll() {
    const volunteers = await this.repository.find();
    volunteers.forEach(volunteer => (volunteer.commissions = []));
    return volunteers;
  }

  public truncate() {
    return this.repository.delete({});
  }

  private static async loadCommissions(volunteer: Volunteer) {
    const volunteerCommissions = await volunteerCommissionRepository().findByVolunteer(volunteer);
    const commissionUuids = volunteerCommissions.map(({ commissionUuid }) => commissionUuid);
    return commissionRepository().findByUuids(commissionUuids);
  }
}

export const volunteerRepository = () => new VolunteerRepository(getManager());
