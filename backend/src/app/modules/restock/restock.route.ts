import { Router } from "express";
import { RestockQueueControllers } from "./restock.controller";

const router = Router();

router.get("/", RestockQueueControllers.getAllRestockQueues);

export const RestockQueueRoutes = router;
