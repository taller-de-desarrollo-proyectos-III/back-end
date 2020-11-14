import { Router } from "express";
import { RolesController } from "../controllers";

export const RolesRoutes = {
  path: "/roles",
  initialize: () => {
    const router = Router();
    router.get(RolesRoutes.path, RolesController.get);
    router.post(RolesRoutes.path, RolesController.create);
    router.put(RolesRoutes.path, RolesController.update);
    return router;
  }
};
