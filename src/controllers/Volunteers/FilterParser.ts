import { IGetProps, TCommissionUuids, TRoleUuids } from "./Interfaces";
import { commissionRepository } from "../../models/Commission";
import { roleRepository } from "../../models/Role";
import { flatten } from "lodash";

export const FilterParser = {
  parse: async ({ commissionUuids, roleUuids }: IGetProps) => {
    const commissions = await FilterParser.parseCommissions(commissionUuids);
    const roles = await FilterParser.parseRoles(roleUuids);
    return {
      commissionUuids: commissions.map(role => role.uuid),
      roleUuids: roles.map(role => role.uuid)
    };
  },
  parseCommissions: async (commissionUuids: TCommissionUuids = []) => {
    if (commissionUuids === "ALL") return commissionRepository().findAll();
    return commissionRepository().findByUuids(flatten([commissionUuids]));
  },
  parseRoles: async (roleUuids: TRoleUuids = []) => {
    if (roleUuids === "ALL") return roleRepository().findAll();
    return roleRepository().findByUuids(flatten([roleUuids]));
  }
};
