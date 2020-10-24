import { volunteerRepository } from "../../../src/models/Volunteer";
import { commissionRepository } from "../../../src/models/Commission";
import { Commission, Volunteer } from "../../../src/models";
import { QueryFailedError } from "typeorm";
import { VolunteerNotFoundError } from "../../../src/models/Volunteer/Errors";

describe("VolunteerRepository", () => {
  const attributes = {
    dni: "12345678",
    name: "John",
    surname: "Doe"
  };

  const commissionA = new Commission({ name: "Commission A" });
  const commissionB = new Commission({ name: "Commission B" });

  beforeAll(async () => {
    await volunteerRepository().truncate();
  });

  it("saves a volunteer model on the database", async () => {
    const volunteer = new Volunteer(attributes);
    await volunteerRepository().create(volunteer);
    expect(await volunteerRepository().findByUuid(volunteer.uuid)).toEqual(volunteer);
  });

  it("saves a volunteer with commissions", async () => {
    const volunteer = new Volunteer({ commissions: [commissionA, commissionB], ...attributes });
    await commissionRepository().create(commissionA);
    await commissionRepository().create(commissionB);
    await volunteerRepository().create(volunteer);
    await volunteerRepository().findByUuid(volunteer.uuid);
    const commissions = (await volunteerRepository().findByUuid(volunteer.uuid)).commissions;
    expect(commissions).toEqual(expect.arrayContaining([commissionA, commissionB]));
  });

  it("throws an error if the volunteer does not exist", async () => {
    const volunteer = new Volunteer(attributes);
    await expect(volunteerRepository().findByUuid(volunteer.uuid))
      .rejects.toThrow(VolunteerNotFoundError);
  });

  it("throws an error when trying to insert a duplicated volunteer", async () => {
    const volunteer = new Volunteer(attributes);
    await volunteerRepository().create(volunteer);
    await expect(volunteerRepository().create(volunteer)).rejects.toThrow(QueryFailedError);
  });

  it("removes all entries from Volunteers table", async () => {
    const firstVolunteer = new Volunteer(attributes);
    const secondVolunteer = new Volunteer(attributes);
    await volunteerRepository().create(firstVolunteer);
    await volunteerRepository().create(secondVolunteer);

    expect(
      await volunteerRepository().findAll()
    ).toEqual(expect.arrayContaining([firstVolunteer, secondVolunteer]));

    await volunteerRepository().truncate();
    expect(await volunteerRepository().findAll()).toHaveLength(0);
  });
});
