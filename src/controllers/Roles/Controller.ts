import { Request, Response } from "express";
import { IPostRequest } from "../Request";
import { ICreateProps, IUpdateProps } from "./Interfaces";
import { Role } from "../../models";
import { AttributeNotDefinedError, InvalidAttributeFormatError } from "../../models/Errors";
import { StatusCodes } from "http-status-codes";
import { roleRepository } from "../../models/Role";

export const RolesController = {
  create: async (request: IPostRequest<ICreateProps>, response: Response) => {
    try {
      const { name, description } = request.body;
      const role = new Role({ name, description });
      await roleRepository().insert(role);
      return response.status(StatusCodes.CREATED).json(role);
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
      const roles = await roleRepository().findAll();
      response.status(StatusCodes.OK).json(roles);
    } catch (error) {
      response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message);
    }
  },
  update: async (request: IPostRequest<IUpdateProps>, response: Response) => {
    try {
      const { uuid, name, description } = request.body;
      const role = new Role({ uuid, name, description });
      await roleRepository().save(role);
      return response.status(StatusCodes.CREATED).json(role);
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
