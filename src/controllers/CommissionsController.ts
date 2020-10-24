import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { commissionRepository } from "../models/Commission";

export const CommissionsController = {
  get: async (_: Request, response: Response) => {
    try {
      const commissions = await commissionRepository().findAll();
      response.status(StatusCodes.OK).json(commissions);
    } catch (error) {
      response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message);
    }
  }
};
