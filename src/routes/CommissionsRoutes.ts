import { Router } from "express";
import { CommissionsController } from "../controllers";

export const CommissionsRoutes = {
  path: "/commissions",
  initialize: () => {
    const router = Router();
    router.get(CommissionsRoutes.path, CommissionsController.get);
    return router;
  }
};
