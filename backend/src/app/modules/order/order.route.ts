import { Router } from "express";
import { OrderControllers } from "./order.controller";

const router = Router();

router.get("/:orderId", OrderControllers.getOrder);

router.patch("/:orderId", OrderControllers.updateOrderStatus);

router.delete("/:orderId", OrderControllers.deleteOrder);

router.post("/", OrderControllers.createOrder);

router.get("/", OrderControllers.getAllOrders);

export const OrderRoutes = router;
