import { Router } from "express";
import { VolunteersController } from "../controllers";

export const VolunteersRoutes = {
  path: "/volunteers",
  initialize: () => {
    const router = Router();
    router.get(VolunteersRoutes.path, VolunteersController.get);
    router.get(`${VolunteersRoutes.path}/:uuid`, VolunteersController.getByUuid);
    router.post(VolunteersRoutes.path, VolunteersController.create);
    router.put(VolunteersRoutes.path, VolunteersController.update);
    return router;
  }
};
