import { DeleteResult } from "typeorm";
import { UuidGenerator } from "../../../src/models/UuidGenerator";
import { volunteerRepository } from "../../../src/models/Volunteer";
import { Role, Volunteer, VolunteerRole } from "../../../src/models";
import { VolunteerGenerator } from "../../Generators/Volunteer";
import { roleRepository } from "../../../src/models/Role";
import { RoleGenerator } from "../../Generators/Role";
import { volunteerRoleRepository } from "../../../src/models/VolunteerRole";
import { VolunteerRoleGenerator } from "../../Generators/VolunteerRole";

describe("VolunteerRoleRepository", () => {
  beforeEach(async () => {
    await volunteerRepository().truncate();
    await roleRepository().truncate();
  });

  it("saves volunteer roles on the database", async () => {
    const volunteer = await VolunteerGenerator.instance.with();
    const roleA = await RoleGenerator.instance();
    const roleB = await RoleGenerator.instance();
    const volunteerRoleA = new VolunteerRole({
      volunteerUuid: volunteer.uuid,
      roleUuid: roleA.uuid
    });
    const volunteerRoleB = new VolunteerRole({
      volunteerUuid: volunteer.uuid,
      roleUuid: roleB.uuid
    });
    await volunteerRoleRepository().bulkCreate([volunteerRoleA, volunteerRoleB]);
    const roles = await volunteerRoleRepository().findByVolunteer(volunteer);
    expect(roles).toEqual(expect.arrayContaining([volunteerRoleA, volunteerRoleB]));
  });

  it("does no save if given an empty array", async () => {
    const volunteerRoles = await volunteerRoleRepository().bulkCreate([]);
    expect(volunteerRoles).toEqual([]);
  });

  describe("update", () => {
    const createVolunteerRole = (volunteerUuid: string, roleUuid: string) =>
      new VolunteerRole({ volunteerUuid, roleUuid });

    it("deletes all volunteerRoles if given an empty array", async () => {
      const volunteerRole = await VolunteerRoleGenerator.instance();
      const volunteer = await volunteerRepository().findByUuid(volunteerRole.volunteerUuid);

      expect(await volunteerRoleRepository().findAll()).toHaveLength(1);
      await volunteerRoleRepository().update([], volunteer);
      expect(await volunteerRoleRepository().findAll()).toHaveLength(0);
    });

    it("updates volunteer roles", async () => {
      const repository = volunteerRoleRepository();
      const volunteer = await VolunteerGenerator.instance.with();
      const volunteerUuid = volunteer.uuid;
      const roleA = await RoleGenerator.instance();
      const roleB = await RoleGenerator.instance();
      const volunteerRoleA = createVolunteerRole(volunteerUuid, roleA.uuid);
      await repository.bulkCreate([volunteerRoleA]);

      expect(await repository.findByVolunteer(volunteer)).toEqual([volunteerRoleA]);
      const volunteerRoleB = createVolunteerRole(volunteerUuid, roleB.uuid);
      await repository.update([volunteerRoleB], volunteer);
      expect(await repository.findByVolunteer(volunteer)).toEqual([volunteerRoleB]);
    });
  });

  describe("findByRoles", () => {
    let volunteerA: Volunteer;
    let volunteerB: Volunteer;
    let roleA: Role;
    let roleB: Role;
    let volunteerRoleAA: VolunteerRole;
    let volunteerRoleAB: VolunteerRole;
    let volunteerRoleBA: VolunteerRole;
    let volunteerRoleBB: VolunteerRole;
    let allVolunteerRoles: VolunteerRole[];

    beforeEach(async () => {
      volunteerA = await VolunteerGenerator.instance.with();
      volunteerB = await VolunteerGenerator.instance.with();
      roleA = await RoleGenerator.instance();
      roleB = await RoleGenerator.instance();

      volunteerRoleAA = new VolunteerRole({
        volunteerUuid: volunteerA.uuid,
        roleUuid: roleA.uuid
      });
      volunteerRoleAB = new VolunteerRole({
        volunteerUuid: volunteerA.uuid,
        roleUuid: roleB.uuid
      });
      volunteerRoleBA = new VolunteerRole({
        volunteerUuid: volunteerB.uuid,
        roleUuid: roleA.uuid
      });
      volunteerRoleBB = new VolunteerRole({
        volunteerUuid: volunteerB.uuid,
        roleUuid: roleB.uuid
      });
      allVolunteerRoles = [volunteerRoleAA, volunteerRoleAB, volunteerRoleBA, volunteerRoleBB];
      await volunteerRoleRepository().bulkCreate(allVolunteerRoles);
    });

    it("finds by all given roles", async () => {
      const volunteerRoles = await volunteerRoleRepository().findByRoles([roleA, roleB]);
      expect(volunteerRoles).toEqual(expect.arrayContaining(allVolunteerRoles));
    });

    it("finds by some given roles", async () => {
      const volunteerRoles = await volunteerRoleRepository().findByRoles([roleA]);
      expect(volunteerRoles).toEqual(expect.arrayContaining([volunteerRoleAA, volunteerRoleBA]));
    });
  });

  it("throws an error if the volunteer role is duplicated", async () => {
    const volunteer = await VolunteerGenerator.instance.with();
    const role = await RoleGenerator.instance();
    const volunteerRole = new VolunteerRole({
      volunteerUuid: volunteer.uuid,
      roleUuid: role.uuid
    });
    await expect(
      volunteerRoleRepository().bulkCreate([volunteerRole, volunteerRole])
    ).rejects.toThrow("duplicate key value violates unique constraint");
  });

  it("throws an error if the volunteer does not exist", async () => {
    const role = await RoleGenerator.instance();
    const volunteerRole = new VolunteerRole({
      volunteerUuid: UuidGenerator.generate(),
      roleUuid: role.uuid
    });
    await expect(volunteerRoleRepository().bulkCreate([volunteerRole])).rejects.toThrow(
      'insert or update on table "VolunteerRoles" violates foreign key constraint'
    );
  });

  it("throws an error if the role does not exist", async () => {
    const volunteer = await VolunteerGenerator.instance.with();
    const volunteerRole = new VolunteerRole({
      volunteerUuid: volunteer.uuid,
      roleUuid: UuidGenerator.generate()
    });
    await expect(volunteerRoleRepository().bulkCreate([volunteerRole])).rejects.toThrow(
      'insert or update on table "VolunteerRoles" violates foreign key constraint'
    );
  });

  describe("Delete cascade", () => {
    const expectToDeleteAlEntries = async (truncate: () => Promise<DeleteResult>) => {
      const volunteer = await VolunteerGenerator.instance.with();
      const role = await RoleGenerator.instance();
      const volunteerRole = new VolunteerRole({
        volunteerUuid: volunteer.uuid,
        roleUuid: role.uuid
      });

      await volunteerRoleRepository().bulkCreate([volunteerRole]);
      expect(await volunteerRoleRepository().findAll()).toEqual(
        expect.arrayContaining([volunteerRole])
      );
      await truncate();
      expect(await volunteerRoleRepository().findAll()).toHaveLength(0);
    };

    it("removes all entries from VolunteerRoles table", async () => {
      await expectToDeleteAlEntries(() => volunteerRoleRepository().truncate());
    });

    it("removes all entries if volunteers is truncated", async () => {
      await expectToDeleteAlEntries(() => volunteerRepository().truncate());
    });

    it("removes all entries if roles is truncated", async () => {
      await expectToDeleteAlEntries(() => roleRepository().truncate());
    });
  });
});
