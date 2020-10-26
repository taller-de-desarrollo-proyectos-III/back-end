import { Request, Response } from "express";
import { IPostRequest } from "../Request";
import { ICreateProps } from "./Interfaces";
import { Commission } from "../../models";
import { AttributeNotDefinedError, InvalidAttributeFormatError } from "../../models/Errors";
import { StatusCodes } from "http-status-codes";
import { commissionRepository } from "../../models/Commission";

export const CommissionsController  = {
  create: async (request: IPostRequest<ICreateProps>, response: Response) => {
    try {
      const { name } = request.body;
      const commission = new Commission({ name });
      await commissionRepository().create(commission);
      return response.status(StatusCodes.CREATED).json(commission);
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
  get: async (_: Request, response: Response) => {
    try {
      const commissions = await commissionRepository().findAll();
      response.status(StatusCodes.OK).json(commissions);
    } catch (error) {
      response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message);
    }
  }
};
