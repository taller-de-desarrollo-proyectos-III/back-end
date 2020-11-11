import { Router } from "express";
import { CommissionsController } from "../controllers";

export const CommissionsRoutes = {
  path: "/commissions",
  initialize: () => {
    const router = Router();
    router.get(CommissionsRoutes.path, CommissionsController.get);
    router.post(CommissionsRoutes.path, CommissionsController.create);
    router.put(CommissionsRoutes.path, CommissionsController.update);
    return router;
  }
};
