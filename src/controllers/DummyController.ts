import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { dummyRepository } from "../models/Dummy";
import { Dummy } from "../models";

export const DummyController = {
  create: async (request: Request, response: Response) => {
    try {
      const { welcomeMessage } = request.body;
      const dummy = new Dummy({ welcomeMessage });
      await dummyRepository().create(dummy);
      response.status(StatusCodes.CREATED).json(dummy);
    } catch (error) {
      response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message);
    }
  }
};
