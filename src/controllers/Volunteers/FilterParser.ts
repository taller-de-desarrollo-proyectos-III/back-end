import { IGetProps, TCommissionUuids, TRoleUuids } from "./Interfaces";
import { commissionRepository } from "../../models/Commission";
import { roleRepository } from "../../models/Role";
import { flatten } from "lodash";

export const FilterParser = {
  parse: async ({ commissionUuids, roleUuids }: IGetProps) => {
    return {
      commissionUuids: await FilterParser.parseCommissions(commissionUuids),
      roleUuids: await FilterParser.parseRoles(roleUuids)
    };
  },
  parseCommissions: async (commissionUuids: TCommissionUuids = []) => {
    if (commissionUuids === "ALL") {
      const commissions = await commissionRepository().findAll();
      return commissions.map(commission => commission.uuid);
    }
    return flatten([commissionUuids]);
  },
  parseRoles: async (roleUuids: TRoleUuids = []) => {
    if (roleUuids === "ALL") {
      const roles = await roleRepository().findAll();
      return roles.map(role => role.uuid);
    }
    return flatten([roleUuids]);
  }
};
