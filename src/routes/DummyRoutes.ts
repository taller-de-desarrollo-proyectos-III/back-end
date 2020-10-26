import { Router } from "express";
import { DummiesController } from "../controllers";

export const DummyRoutes = {
  path: "/dummies",
  initialize: () => {
    const router = Router();
    router.post(DummyRoutes.path, DummiesController.create);
    return router;
  }
};
