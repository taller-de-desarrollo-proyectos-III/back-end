import { Router } from "express";
import { StatesController } from "../controllers";

export const StatesRoutes = {
  path: "/states",
  initialize: () => {
    const router = Router();
    router.get(StatesRoutes.path, StatesController.get);
    router.post(StatesRoutes.path, StatesController.create);
    router.put(StatesRoutes.path, StatesController.update);
    return router;
  }
};
