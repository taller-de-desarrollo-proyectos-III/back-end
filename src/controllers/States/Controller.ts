import { Request, Response } from "express";
import { IPostRequest } from "../Request";
import { ICreateProps, IUpdateProps } from "./Interfaces";
import { State } from "../../models";
import { AttributeNotDefinedError, InvalidAttributeFormatError } from "../../models/Errors";
import { StatusCodes } from "http-status-codes";
import { stateRepository } from "../../models/State";

export const StatesController = {
  create: async (request: IPostRequest<ICreateProps>, response: Response) => {
    try {
      const { name } = request.body;
      const state = new State({ name });
      await stateRepository().insert(state);
      return response.status(StatusCodes.CREATED).json(state);
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
      const states = await stateRepository().findAll();
      response.status(StatusCodes.OK).json(states);
    } catch (error) {
      response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message);
    }
  },
  update: async (request: IPostRequest<IUpdateProps>, response: Response) => {
    try {
      const { uuid, name } = request.body;
      const state = await stateRepository().findByUuid(uuid);
      state.validateName(name);
      await stateRepository().save(state);
      return response.status(StatusCodes.CREATED).json(state);
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
