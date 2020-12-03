import { commissionRepository } from "../../../src/models/Commission";
import { volunteerRepository } from "../../../src/models/Volunteer";
import { Commission, Volunteer } from "../../../src/models";
import { QueryFailedError } from "typeorm";
import { CommissionNotFoundError } from "../../../src/models/Commission/Errors";
import { VolunteerGenerator } from "../../Generators/Volunteer";

describe("CommissionRepository", () => {
  beforeEach(async () => {
    await commissionRepository().truncate();
    await volunteerRepository().truncate();
  });

  it("saves a commission model on the database", async () => {
    const commission = new Commission({ name: "Commission A" });
    await commissionRepository().create(commission);
    expect(await commissionRepository().findByUuid(commission.uuid)).toEqual(commission);
  });

  it("finds all commissions by a list of uuids", async () => {
    const firstCommission = new Commission({ name: "Commission A" });
    const secondCommission = new Commission({ name: "Commission B" });
    await commissionRepository().create(firstCommission);
    await commissionRepository().create(secondCommission);
    const commissions = [firstCommission, secondCommission];
    const uuids = commissions.map(({ uuid }) => uuid);
    expect(await commissionRepository().findByUuids(uuids)).toEqual(
      expect.arrayContaining(commissions)
    );
  });

  it("throws an error if the commission does not exist", async () => {
    const commission = new Commission({ name: "Commission B" });
    await expect(commissionRepository().findByUuid(commission.uuid)).rejects.toThrow(
      CommissionNotFoundError
    );
  });

  it("throws an error when trying to insert a duplicated commission", async () => {
    const commission = new Commission({ name: "Commission C" });
    await commissionRepository().create(commission);
    await expect(commissionRepository().create(commission)).rejects.toThrow(QueryFailedError);
  });

  it("throws an error when trying to insert a commission with an existing name", async () => {
    const commission = new Commission({ name: "Commission C" });
    const anotherCommission = new Commission({ name: "Commission C" });
    await commissionRepository().create(commission);
    const matcher = expect(commissionRepository().create(anotherCommission));
    await matcher.rejects.toThrow(QueryFailedError);
    await matcher.rejects.toThrow(
      'duplicate key value violates unique constraint "CommissionsNameKey"'
    );
  });

  it("removes all entries from Commission table", async () => {
    const firstCommission = new Commission({ name: "Commission A" });
    const secondCommission = new Commission({ name: "Commission B" });
    await commissionRepository().create(firstCommission);
    await commissionRepository().create(secondCommission);

    expect(await commissionRepository().findAll()).toEqual(
      expect.arrayContaining([firstCommission, secondCommission])
    );

    await commissionRepository().truncate();
    expect(await commissionRepository().findAll()).toHaveLength(0);
  });

  describe("findByVolunteer", () => {
    it("finds all commission from the given volunteer", async () => {
      const firstCommission = new Commission({ name: "first" });
      const secondCommission = new Commission({ name: "second" });
      await commissionRepository().create(firstCommission);
      await commissionRepository().create(secondCommission);
      const commissions = [firstCommission, secondCommission];
      const volunteer = await VolunteerGenerator.instance.with({ commissions });
      const foundCommissions = await commissionRepository().findByVolunteer(volunteer);
      expect(foundCommissions).toEqual(expect.arrayContaining(commissions));
    });

    it("returns an empty array if the volunteer has no commissions", async () => {
      const volunteer = await VolunteerGenerator.instance.with();
      const foundCommissions = await commissionRepository().findByVolunteer(volunteer);
      expect(foundCommissions).toEqual([]);
    });

    it("returns an empty array if the volunteer is not persisted", async () => {
      const volunteer = new Volunteer({
        dni: "1234",
        name: "name",
        surname: "surname",
        email: "email@gamil.com",
        phoneNumber: "1234"
      });
      const foundCommissions = await commissionRepository().findByVolunteer(volunteer);
      expect(foundCommissions).toEqual([]);
    });
  });

  describe("update", () => {
    it("updates commission name", async () => {
      const commission = new Commission({ name: "Communication" });
      const attributeName = "name";
      const value = "newName";
      await commissionRepository().create(commission);
      commission[attributeName] = value;
      await commissionRepository().save(commission);
      const updatedCommission = await commissionRepository().findByUuid(commission.uuid);
      expect(updatedCommission[attributeName]).toEqual(value);
    });
  });
});
