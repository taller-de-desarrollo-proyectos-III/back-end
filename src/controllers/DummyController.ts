import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { StatusCodes } from "http-status-codes";
import { DummyRepository } from "../models/Dummy";
import { Dummy } from "../models";

export const DummyController = {
  create: async (request: Request, response: Response) => {
    const { welcomeMessage } = request.body;
    const dummy = new Dummy({ welcomeMessage });
    const dummyRepository = getCustomRepository(DummyRepository);
    await dummyRepository.create(dummy);
    response.status(StatusCodes.OK).json(dummy.uuid);
  }
};
