import { Request, Response } from "express";

export const PingController = {
  ping: (_: Request, response: Response) => response.send("pong")
};
