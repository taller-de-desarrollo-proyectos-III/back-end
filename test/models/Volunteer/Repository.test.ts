import { volunteerRepository } from "../../../src/models/Volunteer";
import { Volunteer } from "../../../src/models";
import { QueryFailedError } from "typeorm";
import { VolunteerNotFoundError } from "../../../src/models/Errors";

describe("volunteerRepository", () => {
  beforeAll(async () => {
    await volunteerRepository().truncate();
  });

  it("saves a volunteer model on the database", async () => {
    const volunteer = new Volunteer({
      dni: "12345678",
      name: "John",
      surname: "Doe"
    });
    await volunteerRepository().create(volunteer);
    expect(await volunteerRepository().findByUuid(volunteer.uuid)).toEqual(volunteer);
  });

  it("throws an error if the volunteer does not exist", async () => {
    const volunteer = new Volunteer({
      dni: "12345678",
      name: "John",
      surname: "Doe"
    });
    await expect(volunteerRepository().findByUuid(volunteer.uuid))
      .rejects.toThrow(VolunteerNotFoundError);
  });

  it("throws an error when trying to insert a duplicated volunteer", async () => {
    const volunteer = new Volunteer({
      dni: "12345678",
      name: "John",
      surname: "Doe"
    });
    await volunteerRepository().create(volunteer);
    await expect(volunteerRepository().create(volunteer)).rejects.toThrow(QueryFailedError);
  });

  it("removes all entries from Volunteers table", async () => {
    const firstVolunteer = new Volunteer({
      dni: "12345678",
      name: "John",
      surname: "Doe"
    });
    const secondVolunteer = new Volunteer({
      dni: "87654321",
      name: "Jane",
      surname: "Doe"
    });
    await volunteerRepository().create(firstVolunteer);
    await volunteerRepository().create(secondVolunteer);

    expect(
      await volunteerRepository().findAll()
    ).toEqual(expect.arrayContaining([firstVolunteer, secondVolunteer]));

    await volunteerRepository().truncate();
    expect(await volunteerRepository().findAll()).toHaveLength(0);
  });
});
