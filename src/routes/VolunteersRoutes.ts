import { Router } from "express";
import { VolunteersController } from "../controllers";

export const VolunteersRoutes = {
  path: "/volunteers",
  initialize: () => {
    const router = Router();
    router.get(VolunteersRoutes.path, VolunteersController.get);
    router.post(VolunteersRoutes.path, VolunteersController.create);
    return router;
  }
};
