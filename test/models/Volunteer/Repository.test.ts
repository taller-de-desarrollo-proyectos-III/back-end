import { volunteerRepository } from "../../../src/models/Volunteer";
import { commissionRepository } from "../../../src/models/Commission";
import { stateRepository } from "../../../src/models/State";
import { Commission, Role, State } from "../../../src/models";
import { QueryFailedError } from "typeorm";
import { VolunteerNotFoundError } from "../../../src/models/Volunteer/Errors";
import { AttributeNotDefinedError } from "../../../src/models/Errors";
import { VolunteerGenerator } from "../../Generators/Volunteer";
import { roleRepository } from "../../../src/models/Role";
import { UuidGenerator } from "../../../src/models/UuidGenerator";

describe("VolunteerRepository", () => {
  const commissionA = new Commission({ name: "Commission A" });
  const commissionB = new Commission({ name: "Commission B" });
  const commissionC = new Commission({ name: "Commission C" });
  const commissionD = new Commission({ name: "Commission D" });

  const roleA = new Role({ name: "Role A" });
  const roleB = new Role({ name: "Role B" });
  const roleC = new Role({ name: "Role C" });
  const roleD = new Role({ name: "Role D" });

  const stateA = new State({ name: "State A" });
  const stateB = new State({ name: "State B" });
  const stateC = new State({ name: "State C" });
  const stateD = new State({ name: "State D" });

  const states = [stateA, stateB, stateC, stateD];
  const stateUuids = states.map(({ uuid }) => uuid);

  beforeEach(async () => {
    await volunteerRepository().truncate();
    await commissionRepository().truncate();
    await roleRepository().truncate();
    await stateRepository().truncate();

    await commissionRepository().create(commissionA);
    await commissionRepository().create(commissionB);
    await commissionRepository().create(commissionC);
    await commissionRepository().create(commissionD);

    await roleRepository().insert(roleA);
    await roleRepository().insert(roleB);
    await roleRepository().insert(roleC);
    await roleRepository().insert(roleD);

    await stateRepository().insert(stateA);
    await stateRepository().insert(stateB);
    await stateRepository().insert(stateC);
    await stateRepository().insert(stateD);
  });

  it("saves a volunteer model on the database", async () => {
    const volunteer = VolunteerGenerator.getVolunteer({ stateUuid: stateA.uuid });
    await volunteerRepository().insert(volunteer);
    expect(await volunteerRepository().findByUuid(volunteer.uuid)).toEqual(volunteer);
  });

  it("throws an error if the stateUuid does not belong to a persisted state", async () => {
    const volunteer = VolunteerGenerator.getVolunteer({ stateUuid: UuidGenerator.generate() });
    const matcher = expect(volunteerRepository().insert(volunteer));
    await matcher.rejects.toThrowError(QueryFailedError);
    await matcher.rejects.toThrowError(
      'insert or update on table "Volunteers" violates foreign key constraint'
    );
  });

  it("throws an error when trying to insert a duplicated volunteer", async () => {
    const volunteer = VolunteerGenerator.getVolunteer({ stateUuid: stateA.uuid });
    await volunteerRepository().insert(volunteer);
    await expect(volunteerRepository().insert(volunteer)).rejects.toThrow(QueryFailedError);
  });

  describe("update", () => {
    const expectToUpdateAttribute = async (attributeName: string, value: string | number) => {
      const volunteer = VolunteerGenerator.getVolunteer({ stateUuid: stateB.uuid });
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
    it("returns no volunteers if no filter is passed", async () => {
      const volunteer = VolunteerGenerator.getVolunteer({ stateUuid: stateC.uuid });
      await volunteerRepository().insert(volunteer);
      expect(await volunteerRepository().find()).toEqual([]);
    });

    it("returns no volunteers if the given states does not match with the volunteers", async () => {
      await VolunteerGenerator.instance.with({ state: stateA });
      await VolunteerGenerator.instance.with({ state: stateB });
      const uuids = [stateC, stateD].map(({ uuid }) => uuid);
      const foundVolunteers = await volunteerRepository().find({ stateUuids: uuids });
      expect(foundVolunteers).toEqual([]);
    });

    it("returns all volunteers with the given states", async () => {
      const volunteerA = await VolunteerGenerator.instance.with({ state: stateA });
      const volunteerB = await VolunteerGenerator.instance.with({ state: stateB });
      const uuids = [stateA, stateB].map(({ uuid }) => uuid);
      const foundVolunteers = await volunteerRepository().find({ stateUuids: uuids });
      expect(foundVolunteers).toHaveLength(2);
      expect(foundVolunteers).toEqual(expect.arrayContaining([volunteerA, volunteerB]));
    });

    it("returns volunteers with no commissions and no roles and states", async () => {
      const volunteer = VolunteerGenerator.getVolunteer({ stateUuid: stateC.uuid });
      await volunteerRepository().insert(volunteer);
      expect(await volunteerRepository().find({ stateUuids })).toEqual([volunteer]);
    });

    it("returns all the volunteers with commissions and no roles", async () => {
      const commissions = [commissionA, commissionB];
      const commissionUuids = commissions.map(({ uuid }) => uuid);
      const volunteerA = await VolunteerGenerator.instance.with({ commissions, state: stateA });
      const volunteerB = await VolunteerGenerator.instance.with({ commissions, state: stateB });
      const foundVolunteers = await volunteerRepository().find({ commissionUuids, stateUuids });
      expect(foundVolunteers).toHaveLength(2);
      expect(foundVolunteers).toEqual(expect.arrayContaining([volunteerA, volunteerB]));
    });

    it("returns all the volunteers with only roles and no commissions", async () => {
      const roles = [roleA, roleB];
      const roleUuids = roles.map(({ uuid }) => uuid);
      const volunteerA = await VolunteerGenerator.instance.with({ roles, state: stateA });
      const volunteerB = await VolunteerGenerator.instance.with({ roles, state: stateB });
      const foundVolunteers = await volunteerRepository().find({ roleUuids, stateUuids });
      expect(foundVolunteers).toHaveLength(2);
      expect(foundVolunteers).toEqual(expect.arrayContaining([volunteerA, volunteerB]));
    });

    it("returns volunteers even if additional non-matching commissions are given", async () => {
      const commissions = [commissionA, commissionB, commissionC, commissionD];
      const commissionUuids = commissions.map(({ uuid }) => uuid);
      const generator = VolunteerGenerator.instance.with;
      const volunteerA = await generator({ commissions: [commissionA], state: stateA });
      const volunteerB = await generator({ commissions: [commissionA], state: stateB });
      const foundVolunteers = await volunteerRepository().find({ commissionUuids, stateUuids });
      expect(foundVolunteers).toHaveLength(2);
      expect(foundVolunteers).toEqual(expect.arrayContaining([volunteerA, volunteerB]));
    });

    it("returns volunteers even if additional non-matching roles are given", async () => {
      const roles = [roleA, roleB, roleC, roleD];
      const roleUuids = roles.map(({ uuid }) => uuid);
      const volunteerA = await VolunteerGenerator.instance.with({ roles: [roleA], state: stateC });
      const volunteerB = await VolunteerGenerator.instance.with({ roles: [roleB], state: stateB });
      const foundVolunteers = await volunteerRepository().find({ roleUuids, stateUuids });
      expect(foundVolunteers).toHaveLength(2);
      expect(foundVolunteers).toEqual(expect.arrayContaining([volunteerA, volunteerB]));
    });

    it("returns all the volunteers with more than one commission and role", async () => {
      const commissions = [commissionA, commissionB, commissionC, commissionD];
      const commissionUuids = commissions.map(({ uuid }) => uuid);

      const roles = [roleA, roleB];
      const roleUuids = roles.map(({ uuid }) => uuid);

      const generator = VolunteerGenerator.instance.with;
      const volunteerA = await generator({ commissions, roles, state: stateB });
      const volunteerB = await generator({ commissions, roles, state: stateD });
      const foundVolunteers = await volunteerRepository().find({
        commissionUuids,
        roleUuids,
        stateUuids
      });
      expect(foundVolunteers).toHaveLength(2);
      expect(foundVolunteers).toEqual(expect.arrayContaining([volunteerA, volunteerB]));
    });
  });

  it("throws an error if the volunteer does not exist", async () => {
    const volunteer = VolunteerGenerator.getVolunteer({ stateUuid: stateD.uuid });
    await expect(volunteerRepository().findByUuid(volunteer.uuid)).rejects.toThrow(
      VolunteerNotFoundError
    );
  });

  it("throws an error if the uuid is undefined", async () => {
    await expect(volunteerRepository().findByUuid(undefined as any)).rejects.toThrow(
      AttributeNotDefinedError
    );
  });

  it("removes all entries from Volunteers table", async () => {
    const firstVolunteer = VolunteerGenerator.getVolunteer({ stateUuid: stateA.uuid });
    const secondVolunteer = VolunteerGenerator.getVolunteer({ stateUuid: stateB.uuid });
    await volunteerRepository().insert(firstVolunteer);
    await volunteerRepository().insert(secondVolunteer);

    expect(await volunteerRepository().findAll()).toEqual(
      expect.arrayContaining([firstVolunteer, secondVolunteer])
    );

    await volunteerRepository().truncate();
    expect(await volunteerRepository().findAll()).toHaveLength(0);
  });
});
