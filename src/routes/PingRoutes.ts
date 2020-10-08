import { Router } from "express";
import { PingController } from "../controllers";

export const PingRoutes = {
  path: "/ping",
  initialize: () => {
    const router = Router();
    router.get(PingRoutes.path, PingController.ping);
    return router;
  }
};
