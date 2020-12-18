import { roleRepository } from "../../../src/models/Role";
import { Role } from "../../../src/models";

export const RoleGenerator = {
  index: 0,
  getIndex: () => {
    RoleGenerator.index += 1;
    return RoleGenerator.index;
  },
  instance: async () => {
    const role = new Role({ name: `name${RoleGenerator.getIndex()}`, description: "Role A" });
    await roleRepository().insert(role);
    return role;
  }
};
