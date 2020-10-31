import { DeleteResult } from "typeorm";
import { volunteerCommissionRepository } from "../../../src/models/VolunteerCommission";
import { UuidGenerator } from "../../../src/models/UuidGenerator";
import { volunteerRepository } from "../../../src/models/Volunteer";
import { commissionRepository } from "../../../src/models/Commission";
import { Commission, Volunteer, VolunteerCommission } from "../../../src/models";
import { CommissionGenerator } from "../../Generators/Commission";

describe("VolunteerCommissionRepository", () => {
  beforeAll(async () => {
    await volunteerRepository().truncate();
    await commissionRepository().truncate();
  });

  const createVolunteer = async () => {
    const volunteer = new Volunteer({ dni: "12345678", name: "John", surname: "Doe" });
    await volunteerRepository().create(volunteer);
    return volunteer;
  };

  it("saves volunteer commissions on the database", async () => {
    const volunteer = await createVolunteer();
    const commissionA = await CommissionGenerator.instance();
    const commissionB = await CommissionGenerator.instance();
    const volunteerCommissionA = new VolunteerCommission({
      volunteerUuid: volunteer.uuid,
      commissionUuid: commissionA.uuid
    });
    const volunteerCommissionB = new VolunteerCommission({
      volunteerUuid: volunteer.uuid,
      commissionUuid: commissionB.uuid
    });
    await volunteerCommissionRepository().bulkCreate([volunteerCommissionA, volunteerCommissionB]);
    const commissions = await volunteerCommissionRepository().findByVolunteer(volunteer);
    expect(commissions).toEqual(
      expect.arrayContaining([volunteerCommissionA, volunteerCommissionB])
    );
  });

  it("does no save if given an empty array", async () => {
    const volunteerCommissions = await volunteerCommissionRepository().bulkCreate([]);
    expect(volunteerCommissions).toEqual([]);
  });

  describe("findByCommissions", () => {
    let firstVolunteer: Volunteer;
    let secondVolunteer: Volunteer;
    let firstCommission: Commission;
    let secondCommission: Commission;
    let firstVolunteerCommission: VolunteerCommission;
    let secondVolunteerCommission: VolunteerCommission;
    let thirdVolunteerCommission: VolunteerCommission;
    let fourthVolunteerCommission: VolunteerCommission;
    let allVolunteerCommissions: VolunteerCommission[];

    beforeAll(async () => {
      firstVolunteer = await createVolunteer();
      secondVolunteer = await createVolunteer();
      firstCommission = await CommissionGenerator.instance();
      secondCommission = await CommissionGenerator.instance();

      firstVolunteerCommission = new VolunteerCommission({
        volunteerUuid: firstVolunteer.uuid,
        commissionUuid: firstCommission.uuid
      });
      secondVolunteerCommission = new VolunteerCommission({
        volunteerUuid: firstVolunteer.uuid,
        commissionUuid: secondCommission.uuid
      });
      thirdVolunteerCommission = new VolunteerCommission({
        volunteerUuid: secondVolunteer.uuid,
        commissionUuid: firstCommission.uuid
      });
      fourthVolunteerCommission = new VolunteerCommission({
        volunteerUuid: secondVolunteer.uuid,
        commissionUuid: secondCommission.uuid
      });
      allVolunteerCommissions = [
        firstVolunteerCommission,
        secondVolunteerCommission,
        thirdVolunteerCommission,
        fourthVolunteerCommission
      ];
      await volunteerCommissionRepository().bulkCreate(allVolunteerCommissions);
    });

    it("finds by the all given commissions", async () => {
      const volunteerCommissions = await volunteerCommissionRepository().findByCommissions([
        firstCommission,
        secondCommission
      ]);
      expect(volunteerCommissions).toEqual(expect.arrayContaining(allVolunteerCommissions));
    });

    it("finds by the some of the given commissions", async () => {
      const volunteerCommissions = await volunteerCommissionRepository().findByCommissions([
        firstCommission
      ]);
      expect(volunteerCommissions).toEqual(
        expect.arrayContaining([firstVolunteerCommission, thirdVolunteerCommission])
      );
    });
  });

  it("throws an error if the volunteer commission is duplicated", async () => {
    const volunteer = await createVolunteer();
    const commission = await CommissionGenerator.instance();
    const volunteerCommission = new VolunteerCommission({
      volunteerUuid: volunteer.uuid,
      commissionUuid: commission.uuid
    });
    await expect(
      volunteerCommissionRepository().bulkCreate([volunteerCommission, volunteerCommission])
    ).rejects.toThrow("duplicate key value violates unique constraint");
  });

  it("throws an error if the volunteer does not exist", async () => {
    const commission = await CommissionGenerator.instance();
    const volunteerCommission = new VolunteerCommission({
      volunteerUuid: UuidGenerator.generate(),
      commissionUuid: commission.uuid
    });
    await expect(volunteerCommissionRepository().bulkCreate([volunteerCommission])).rejects.toThrow(
      'insert or update on table "VolunteerCommissions" violates foreign key constraint'
    );
  });

  it("throws an error if the commission does not exist", async () => {
    const volunteer = await createVolunteer();
    const volunteerCommission = new VolunteerCommission({
      volunteerUuid: volunteer.uuid,
      commissionUuid: UuidGenerator.generate()
    });
    await expect(volunteerCommissionRepository().bulkCreate([volunteerCommission])).rejects.toThrow(
      'insert or update on table "VolunteerCommissions" violates foreign key constraint'
    );
  });

  describe("Delete cascade", () => {
    const expectToDeleteAlEntries = async (truncate: () => Promise<DeleteResult>) => {
      const volunteer = await createVolunteer();
      const commission = await CommissionGenerator.instance();
      const volunteerCommission = new VolunteerCommission({
        volunteerUuid: volunteer.uuid,
        commissionUuid: commission.uuid
      });

      await volunteerCommissionRepository().bulkCreate([volunteerCommission]);
      expect(await volunteerCommissionRepository().findAll()).toEqual(
        expect.arrayContaining([volunteerCommission])
      );
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
