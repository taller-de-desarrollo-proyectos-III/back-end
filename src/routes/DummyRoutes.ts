import { Router } from "express";
import { DummyController } from "../controllers";

export const DummyRoutes = {
  path: "/dummies",
  initialize: () => {
    const router = Router();
    router.post(DummyRoutes.path, DummyController.create);
    return router;
  }
};
