import { Response } from "express";
import { flatten } from "lodash";
import { StatusCodes } from "http-status-codes";
import { IFetchRequest } from "./Request";
import { volunteerRepository } from "../models/Volunteer";
import { commissionRepository } from "../models/Commission";

export const VolunteersController = {
  get: async (request: IFetchRequest<IGetProps>, response: Response) => {
    try {
      const { commissionUuids } = request.query;
      const commissions = await commissionRepository().findByUuids(flatten([commissionUuids]));
      const volunteers = await volunteerRepository().findByCommissions(commissions);
      response.status(StatusCodes.OK).json(volunteers);
    } catch (error) {
      response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message);
    }
  }
};

interface IGetProps {
  commissionUuids: string[];
}
