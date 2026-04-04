import { Router } from "express";
import { OrderControllers } from "./order.controller";
import validateAuth from "../../middlewares/validateAuth";
import { USER_ROLE } from "../user/user.constant";

const router = Router();

router.get("/:orderId", OrderControllers.getOrder);

router.patch("/:orderId", OrderControllers.updateOrderStatus);

router.delete("/:orderId", OrderControllers.deleteOrder);

router.post(
  "/",
  validateAuth(USER_ROLE.admin, USER_ROLE.manager),
  OrderControllers.createOrder,
);

router.get("/", OrderControllers.getAllOrders);

export const OrderRoutes = router;
