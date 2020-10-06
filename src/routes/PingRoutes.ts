import { Router } from "express";
import { PingController } from "../controllers";

export const PingRoutes = {
  initialize: () => {
    const router = Router();
    const path = "/ping";
    router.get(path, PingController.ping);
    return router;
  }
};
