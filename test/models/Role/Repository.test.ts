import { roleRepository } from "../../../src/models/Role";
import { Role } from "../../../src/models";
import { QueryFailedError } from "typeorm";
import { RoleNotFoundError } from "../../../src/models/Role/Errors";

describe("RoleRepository", () => {
  beforeEach(() => roleRepository().truncate());

  it("saves a role model on the database", async () => {
    const role = new Role({ name: "Role A" });
    await roleRepository().create(role);
    expect(await roleRepository().findByUuid(role.uuid)).toEqual(role);
  });

  it("finds all roles by a list of uuids", async () => {
    const firstRoles = new Role({ name: "Role A" });
    const secondRoles = new Role({ name: "Role B" });
    await roleRepository().create(firstRoles);
    await roleRepository().create(secondRoles);
    const roles = [firstRoles, secondRoles];
    const uuids = roles.map(({ uuid }) => uuid);
    expect(await roleRepository().findByUuids(uuids)).toEqual(expect.arrayContaining(roles));
  });

  it("throws an error if the role does not exist", async () => {
    const role = new Role({ name: "Role B" });
    await expect(roleRepository().findByUuid(role.uuid)).rejects.toThrow(RoleNotFoundError);
  });

  it("throws an error when trying to insert a duplicated role", async () => {
    const role = new Role({ name: "Role C" });
    await roleRepository().create(role);
    await expect(roleRepository().create(role)).rejects.toThrow(QueryFailedError);
  });

  it("throws an error when trying to insert a role with an existing name", async () => {
    const role = new Role({ name: "Role C" });
    const anotherRole = new Role({ name: "Role C" });
    await roleRepository().create(role);
    const matcher = expect(roleRepository().create(anotherRole));
    await matcher.rejects.toThrow(QueryFailedError);
    await matcher.rejects.toThrow('duplicate key value violates unique constraint "RolesNameKey"');
  });

  it("removes all entries from Role table", async () => {
    const firstRole = new Role({ name: "Role A" });
    const secondRole = new Role({ name: "Role B" });
    await roleRepository().create(firstRole);
    await roleRepository().create(secondRole);

    expect(await roleRepository().findAll()).toEqual(
      expect.arrayContaining([firstRole, secondRole])
    );

    await roleRepository().truncate();
    expect(await roleRepository().findAll()).toHaveLength(0);
  });

  describe("update", () => {
    it("updates roles name", async () => {
      const role = new Role({ name: "Administrator" });
      const attributeName = "name";
      const value = "newName";
      await roleRepository().create(role);
      role[attributeName] = value;
      await roleRepository().save(role);
      const updatedRole = await roleRepository().findByUuid(role.uuid);
      expect(updatedRole[attributeName]).toEqual(value);
    });
  });
});
