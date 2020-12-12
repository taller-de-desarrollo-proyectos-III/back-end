import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { IFetchRequest, IPostRequest } from "../Request";
import { ICreateProps, IGetProps, IUpdateProps } from "./Interfaces";

import { volunteerRepository, VolunteerRepository } from "../../models/Volunteer";
import { VolunteerCommissionRepository } from "../../models/VolunteerCommission";
import { VolunteerRoleRepository } from "../../models/VolunteerRole";
import { commissionRepository } from "../../models/Commission";
import { roleRepository } from "../../models/Role";
import { stateRepository } from "../../models/State";

import { AttributeNotDefinedError, InvalidAttributeFormatError } from "../../models/Errors";
import { VolunteerNotFoundError } from "../../models/Volunteer/Errors";
import { Volunteer, VolunteerCommission, VolunteerRole } from "../../models";

import { getManager } from "typeorm";
import { FilterParser } from "./FilterParser";

export const VolunteersController = {
  create: async (request: IPostRequest<ICreateProps>, response: Response) => {
    try {
      const { commissionUuids, roleUuids, ...attributes } = request.body;
      const commissions = await FilterParser.parseCommissions(commissionUuids);
      const roles = await FilterParser.parseRoles(roleUuids);
      const volunteer = new Volunteer({ ...attributes });
      await getManager().transaction(async manager => {
        await new VolunteerRepository(manager).insert(volunteer);
        const volunteerCommissions = commissions.map(
          ({ uuid: commissionUuid }) =>
            new VolunteerCommission({ commissionUuid, volunteerUuid: volunteer.uuid })
        );
        await new VolunteerCommissionRepository(manager).bulkCreate(volunteerCommissions);
        const volunteerRoles = roles.map(
          ({ uuid: roleUuid }) => new VolunteerRole({ roleUuid, volunteerUuid: volunteer.uuid })
        );
        await new VolunteerRoleRepository(manager).bulkCreate(volunteerRoles);
      });
      return response.status(StatusCodes.CREATED).json({ ...volunteer, roles, commissions });
    } catch (error) {
      if (error instanceof AttributeNotDefinedError) {
        return response.status(StatusCodes.BAD_REQUEST).json(error.message);
      }
      if (error instanceof InvalidAttributeFormatError) {
        return response.status(StatusCodes.BAD_REQUEST).json(error.message);
      }
      return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message);
    }
  },
  get: async (request: IFetchRequest<IGetProps>, response: Response) => {
    try {
      const filter = request.query;
      const volunteers = await volunteerRepository().find(await FilterParser.parse(filter));
      const jsonResponse = await Promise.all(
        volunteers.map(async volunteer => {
          const commissions = await commissionRepository().findByVolunteer(volunteer);
          const roles = await roleRepository().findByVolunteer(volunteer);
          const state = await stateRepository().findByUuid(volunteer.stateUuid);
          return { ...volunteer, commissions, roles, state };
        })
      );
      response.status(StatusCodes.OK).json(jsonResponse);
    } catch (error) {
      response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message);
    }
  },
  getByUuid: async (request: IFetchRequest<{ uuid: string }>, response: Response) => {
    try {
      const { uuid } = request.params;
      const volunteer = await volunteerRepository().findByUuid(uuid);
      const commissions = await commissionRepository().findByVolunteer(volunteer);
      const roles = await roleRepository().findByVolunteer(volunteer);
      return response.status(StatusCodes.OK).json({ ...volunteer, commissions, roles });
    } catch (error) {
      if (error instanceof VolunteerNotFoundError) {
        return response.status(StatusCodes.BAD_REQUEST).json(error.message);
      }
      return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message);
    }
  },
  update: async (request: IPostRequest<IUpdateProps>, response: Response) => {
    try {
      const { uuid, commissionUuids, roleUuids, ...attributes } = request.body;
      const commissions = await FilterParser.parseCommissions(commissionUuids);
      const roles = await FilterParser.parseRoles(roleUuids);
      const volunteer = new Volunteer({ uuid, ...attributes });
      await getManager().transaction(async manager => {
        await new VolunteerRepository(manager).save(volunteer);
        const volunteerCommissions = commissions.map(
          ({ uuid: commissionUuid }) =>
            new VolunteerCommission({ commissionUuid, volunteerUuid: uuid })
        );
        await new VolunteerCommissionRepository(manager).update(volunteerCommissions, volunteer);
        const volunteerRoles = roles.map(
          ({ uuid: roleUuid }) => new VolunteerRole({ roleUuid, volunteerUuid: uuid })
        );
        await new VolunteerRoleRepository(manager).update(volunteerRoles, volunteer);
      });
      return response.status(StatusCodes.CREATED).json({ ...volunteer, commissions, roles });
    } catch (error) {
      if (error instanceof AttributeNotDefinedError) {
        return response.status(StatusCodes.BAD_REQUEST).json(error.message);
      }
      if (error instanceof InvalidAttributeFormatError) {
        return response.status(StatusCodes.BAD_REQUEST).json(error.message);
      }
      return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message);
    }
  }
};
