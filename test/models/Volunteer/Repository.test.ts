import { volunteerRepository } from "../../../src/models/Volunteer";
import { commissionRepository } from "../../../src/models/Commission";
import { Commission, Role } from "../../../src/models";
import { QueryFailedError } from "typeorm";
import { VolunteerNotFoundError } from "../../../src/models/Volunteer/Errors";
import { AttributeNotDefinedError } from "../../../src/models/Errors";
import { VolunteerGenerator } from "../../Generators/Volunteer";
import { roleRepository } from "../../../src/models/Role";

describe("VolunteerRepository", () => {
  const commissionA = new Commission({ name: "Commission A" });
  const commissionB = new Commission({ name: "Commission B" });
  const commissionC = new Commission({ name: "Commission C" });
  const commissionD = new Commission({ name: "Commission D" });

  const roleA = new Role({ name: "Role A" });
  const roleB = new Role({ name: "Role B" });
  const roleC = new Role({ name: "Role C" });
  const roleD = new Role({ name: "Role D" });

  beforeEach(async () => {
    await volunteerRepository().truncate();
    await commissionRepository().truncate();
    await roleRepository().truncate();

    await commissionRepository().create(commissionA);
    await commissionRepository().create(commissionB);
    await commissionRepository().create(commissionC);
    await commissionRepository().create(commissionD);
    await roleRepository().insert(roleA);
    await roleRepository().insert(roleB);
    await roleRepository().insert(roleC);
    await roleRepository().insert(roleD);
  });

  it("saves a volunteer model on the database", async () => {
    const volunteer = VolunteerGenerator.getVolunteer();
    await volunteerRepository().insert(volunteer);
    expect(await volunteerRepository().findByUuid(volunteer.uuid)).toEqual(volunteer);
  });

  describe("update", () => {
    const expectToUpdateAttribute = async (attributeName: string, value: string | number) => {
      const volunteer = VolunteerGenerator.getVolunteer();
      await volunteerRepository().insert(volunteer);
      volunteer[attributeName] = value;
      await volunteerRepository().save(volunteer);
      const updatedVolunteer = await volunteerRepository().findByUuid(volunteer.uuid);
      expect(updatedVolunteer[attributeName]).toEqual(value);
    };

    it("updates volunteer name", async () => {
      await expectToUpdateAttribute("name", "newName");
    });

    it("updates volunteer surname", async () => {
      await expectToUpdateAttribute("surname", "newSurname");
    });

    it("updates volunteer dni", async () => {
      await expectToUpdateAttribute("dni", "123456");
    });

    it("updates volunteer email", async () => {
      await expectToUpdateAttribute("email", "newEmail@gmail.com");
    });

    it("updates volunteer linkedin", async () => {
      await expectToUpdateAttribute("linkedin", "newLinkedin");
    });

    it("updates volunteer phoneNumber", async () => {
      await expectToUpdateAttribute("phoneNumber", "43000000");
    });

    it("updates volunteer telegram", async () => {
      await expectToUpdateAttribute("telegram", "newTelegram");
    });

    it("updates volunteer admissionYear", async () => {
      await expectToUpdateAttribute("admissionYear", "2050");
    });

    it("updates volunteer graduationYear", async () => {
      await expectToUpdateAttribute("graduationYear", "2001");
    });

    it("updates volunteer country", async () => {
      await expectToUpdateAttribute("country", "Croatia");
    });

    it("updates volunteer notes", async () => {
      await expectToUpdateAttribute("notes", "New notes");
    });
  });

  describe("find", () => {
    it("returns volunteers with no commissions and no roles if no filter is passed", async () => {
      const volunteer = VolunteerGenerator.getVolunteer();
      await volunteerRepository().insert(volunteer);
      expect(await volunteerRepository().find()).toEqual([volunteer]);
    });

    it("returns all the volunteers with commissions and no roles", async () => {
      const commissions = [commissionA, commissionB];
      const commissionUuids = commissions.map(({ uuid }) => uuid);
      const volunteerA = await VolunteerGenerator.instance.with({ commissions });
      const volunteerB = await VolunteerGenerator.instance.with({ commissions });
      const foundVolunteers = await volunteerRepository().find({ commissionUuids });
      expect(foundVolunteers).toHaveLength(2);
      expect(foundVolunteers).toEqual(expect.arrayContaining([volunteerA, volunteerB]));
    });

    it("returns all the volunteers with only roles and no commissions", async () => {
      const roles = [roleA, roleB];
      const roleUuids = roles.map(({ uuid }) => uuid);
      const volunteerA = await VolunteerGenerator.instance.with({ roles });
      const volunteerB = await VolunteerGenerator.instance.with({ roles });
      const foundVolunteers = await volunteerRepository().find({ roleUuids });
      expect(foundVolunteers).toHaveLength(2);
      expect(foundVolunteers).toEqual(expect.arrayContaining([volunteerA, volunteerB]));
    });

    it("returns volunteers even if additional non-matching commissions are given", async () => {
      const commissions = [commissionA, commissionB, commissionC, commissionD];
      const commissionUuids = commissions.map(({ uuid }) => uuid);
      const volunteerA = await VolunteerGenerator.instance.with({ commissions: [commissionA] });
      const volunteerB = await VolunteerGenerator.instance.with({ commissions: [commissionA] });
      const foundVolunteers = await volunteerRepository().find({ commissionUuids });
      expect(foundVolunteers).toHaveLength(2);
      expect(foundVolunteers).toEqual(expect.arrayContaining([volunteerA, volunteerB]));
    });

    it("returns volunteers even if additional non-matching roles are given", async () => {
      const roles = [roleA, roleB, roleC, roleD];
      const roleUuids = roles.map(({ uuid }) => uuid);
      const volunteerA = await VolunteerGenerator.instance.with({ roles: [roleA] });
      const volunteerB = await VolunteerGenerator.instance.with({ roles: [roleB] });
      const foundVolunteers = await volunteerRepository().find({ roleUuids });
      expect(foundVolunteers).toHaveLength(2);
      expect(foundVolunteers).toEqual(expect.arrayContaining([volunteerA, volunteerB]));
    });

    it("returns all the volunteers with more than one commission and role", async () => {
      const commissions = [commissionA, commissionB, commissionC, commissionD];
      const commissionUuids = commissions.map(({ uuid }) => uuid);

      const roles = [roleA, roleB];
      const roleUuids = roles.map(({ uuid }) => uuid);

      const volunteerA = await VolunteerGenerator.instance.with({ commissions, roles });
      const volunteerB = await VolunteerGenerator.instance.with({ commissions, roles });
      const foundVolunteers = await volunteerRepository().find({ commissionUuids, roleUuids });
      expect(foundVolunteers).toHaveLength(2);
      expect(foundVolunteers).toEqual(expect.arrayContaining([volunteerA, volunteerB]));
    });
  });

  it("throws an error if the volunteer does not exist", async () => {
    const volunteer = VolunteerGenerator.getVolunteer();
    await expect(volunteerRepository().findByUuid(volunteer.uuid)).rejects.toThrow(
      VolunteerNotFoundError
    );
  });

  it("throws an error if the uuid is undefined", async () => {
    await expect(volunteerRepository().findByUuid(undefined as any)).rejects.toThrow(
      AttributeNotDefinedError
    );
  });

  it("throws an error when trying to insert a duplicated volunteer", async () => {
    const volunteer = VolunteerGenerator.getVolunteer();
    await volunteerRepository().insert(volunteer);
    await expect(volunteerRepository().insert(volunteer)).rejects.toThrow(QueryFailedError);
  });

  it("removes all entries from Volunteers table", async () => {
    const firstVolunteer = VolunteerGenerator.getVolunteer();
    const secondVolunteer = VolunteerGenerator.getVolunteer();
    await volunteerRepository().insert(firstVolunteer);
    await volunteerRepository().insert(secondVolunteer);

    expect(await volunteerRepository().findAll()).toEqual(
      expect.arrayContaining([firstVolunteer, secondVolunteer])
    );

    await volunteerRepository().truncate();
    expect(await volunteerRepository().findAll()).toHaveLength(0);
  });
});
