import { IGetProps, TCommissionUuids, TRoleUuids, TStateUuids } from "./Interfaces";
import { commissionRepository } from "../../models/Commission";
import { roleRepository } from "../../models/Role";
import { stateRepository } from "../../models/State";
import { flatten } from "lodash";

export const FilterParser = {
  parse: async ({ commissionUuids, roleUuids, stateUuids }: IGetProps) => {
    const commissions = await FilterParser.parseCommissions(commissionUuids);
    const roles = await FilterParser.parseRoles(roleUuids);
    const states = await FilterParser.parseStates(stateUuids);
    return {
      commissionUuids: commissions.map(role => role.uuid),
      roleUuids: roles.map(role => role.uuid),
      stateUuids: states.map(role => role.uuid)
    };
  },
  parseCommissions: async (commissionUuids: TCommissionUuids = []) => {
    if (commissionUuids === "ALL") return commissionRepository().findAll();
    return commissionRepository().findByUuids(flatten([commissionUuids]));
  },
  parseRoles: async (roleUuids: TRoleUuids = []) => {
    if (roleUuids === "ALL") return roleRepository().findAll();
    return roleRepository().findByUuids(flatten([roleUuids]));
  },
  parseStates: async (stateUuids: TStateUuids = []) => {
    if (stateUuids === "ALL") return stateRepository().findAll();
    return stateRepository().findByUuids(flatten([stateUuids]));
  }
};
