import { DeleteResult } from "typeorm";
import { volunteerCommissionRepository } from "../../../src/models/VolunteerCommission";
import { UuidGenerator } from "../../../src/models/UuidGenerator";
import { volunteerRepository } from "../../../src/models/Volunteer";
import { commissionRepository } from "../../../src/models/Commission";
import { Commission, Volunteer, VolunteerCommission } from "../../../src/models";

describe("volunteerCommissionRepository", () => {
  beforeAll(async () => {
    await volunteerRepository().truncate();
    await commissionRepository().truncate();
  });

  const createVolunteer = async () => {
    const volunteer = new Volunteer({ dni: "12345678", name: "John", surname: "Doe" });
    await volunteerRepository().create(volunteer);
    return volunteer;
  };

  const createCommission = async () => {
    const commission = new Commission({ name: "name" });
    await commissionRepository().create(commission);
    return commission;
  };

  it("saves volunteer commissions on the database", async () => {
    const volunteer = await createVolunteer();
    const commissionA = await createCommission();
    const commissionB = await createCommission();
    const volunteerCommissionA = new VolunteerCommission({
      volunteerUuid: volunteer.uuid,
      commissionUuid: commissionA.uuid
    });
    const volunteerCommissionB = new VolunteerCommission({
      volunteerUuid: volunteer.uuid,
      commissionUuid: commissionB.uuid
    });
    await volunteerCommissionRepository().bulkCreate([
      volunteerCommissionA,
      volunteerCommissionB
    ]);
    const commissions = await volunteerCommissionRepository().findByVolunteer(volunteer);
    expect(commissions).toEqual(expect.arrayContaining([
      volunteerCommissionA,
      volunteerCommissionB
    ]));
  });

  it("does no save if given an empty array", async () => {
    const volunteerCommissions = await volunteerCommissionRepository().bulkCreate([]);
    expect(volunteerCommissions).toEqual([]);
  });

  it("throws an error if the volunteer commission is duplicated", async () => {
    const volunteer = await createVolunteer();
    const commission = await createCommission();
    const volunteerCommission = new VolunteerCommission({
      volunteerUuid: volunteer.uuid,
      commissionUuid: commission.uuid
    });
    await expect(
      volunteerCommissionRepository().bulkCreate([volunteerCommission, volunteerCommission])
    ).rejects.toThrow("duplicate key value violates unique constraint");
  });

  it("throws an error if the volunteer does not exist", async () => {
    const commission = await createCommission();
    const volunteerCommission = new VolunteerCommission({
      volunteerUuid: UuidGenerator.generate(),
      commissionUuid: commission.uuid
    });
    await expect(
      volunteerCommissionRepository().bulkCreate([volunteerCommission])
    ).rejects.toThrow(
      "insert or update on table \"VolunteerCommissions\" violates foreign key constraint"
    );
  });

  it("throws an error if the commission does not exist", async () => {
    const volunteer = await createVolunteer();
    const volunteerCommission = new VolunteerCommission({
      volunteerUuid: volunteer.uuid,
      commissionUuid: UuidGenerator.generate()
    });
    await expect(
      volunteerCommissionRepository().bulkCreate([volunteerCommission])
    ).rejects.toThrow(
      "insert or update on table \"VolunteerCommissions\" violates foreign key constraint"
    );
  });

  describe("Delete cascade", () => {
    const expectToDeleteAlEntries = async (truncate: () => Promise<DeleteResult>) => {
      const volunteer = await createVolunteer();
      const commission = await createCommission();
      const volunteerCommission = new VolunteerCommission({
        volunteerUuid: volunteer.uuid,
        commissionUuid: commission.uuid
      });

      await volunteerCommissionRepository().bulkCreate([volunteerCommission]);
      expect(
        await volunteerCommissionRepository().findAll()
      ).toEqual(expect.arrayContaining([volunteerCommission]));
      await truncate();
      expect(await volunteerCommissionRepository().findAll()).toHaveLength(0);
    };

    it("removes all entries from VolunteerCommission table", async () => {
      await expectToDeleteAlEntries(() => volunteerCommissionRepository().truncate());
    });

    it("removes all entries if volunteers is truncated", async () => {
      await expectToDeleteAlEntries(() => volunteerRepository().truncate());
    });

    it("removes all entries if commissions is truncated", async () => {
      await expectToDeleteAlEntries(() => commissionRepository().truncate());
    });
  });
});
