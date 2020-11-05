import { Response } from "express";
import { flatten } from "lodash";
import { StatusCodes } from "http-status-codes";
import { IFetchRequest, IPostRequest } from "../Request";
import { volunteerRepository } from "../../models/Volunteer";
import { volunteerCommissionRepository } from "../../models/VolunteerCommission";
import { commissionRepository } from "../../models/Commission";
import { Volunteer, VolunteerCommission } from "../../models";
import { ICreateProps, IGetProps, IUpdateProps } from "./Interfaces";
import { AttributeNotDefinedError, InvalidAttributeFormatError } from "../../models/Errors";
import { VolunteerNotFoundError } from "../../models/Volunteer/Errors";

export const VolunteersController = {
  create: async (request: IPostRequest<ICreateProps>, response: Response) => {
    try {
      const { commissionUuids, ...attributes } = request.body;
      const commissions = await commissionRepository().findByUuids(commissionUuids || []);
      const volunteer = new Volunteer({ ...attributes, commissions });
      await volunteerRepository().create(volunteer);
      return response.status(StatusCodes.CREATED).json(volunteer);
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
      const { commissionUuids } = request.query;
      const commissions = await commissionRepository().findByUuids(flatten([commissionUuids]));
      const volunteers = await volunteerRepository().findByCommissions(commissions);
      response.status(StatusCodes.OK).json(volunteers);
    } catch (error) {
      response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message);
    }
  },
  getByUuid: async (request: IFetchRequest<{ uuid: string }>, response: Response) => {
    try {
      const { uuid } = request.params;
      const volunteer = await volunteerRepository().findByUuid(uuid);
      return response.status(StatusCodes.OK).json(volunteer);
    } catch (error) {
      if (error instanceof VolunteerNotFoundError) {
        return response.status(StatusCodes.BAD_REQUEST).json(error.message);
      }
      return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message);
    }
  },
  update: async (request: IPostRequest<IUpdateProps>, response: Response) => {
    try {
      const { uuid, commissionUuids, ...attributes } = request.body;
      const commissions = await commissionRepository().findByUuids(commissionUuids || []);
      const volunteer = new Volunteer({ ...attributes, uuid });
      const attributeNames = Object.keys(attributes);
      attributeNames.map(attributeName => (volunteer[attributeName] = attributes[attributeName]));
      await volunteerRepository().save(volunteer);
      const volunteerCommissions = commissions.map(
        ({ uuid: commissionUuid }) =>
          new VolunteerCommission({ commissionUuid, volunteerUuid: uuid })
      );
      volunteer.commissions = commissions;
      await volunteerCommissionRepository().update(volunteerCommissions, volunteer);
      return response.status(StatusCodes.CREATED).json(volunteer);
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
