import { Router } from "express";
import { ActivityControllers } from "./activity.controller";

const router = Router();

router.get("/", ActivityControllers.getActivities);

export const ActivityRoutes = router;
