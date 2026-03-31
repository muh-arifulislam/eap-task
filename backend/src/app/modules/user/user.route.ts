import { Router } from "express";
import validateAuth from "../../middlewares/validateAuth";
import { USER_ROLE } from "./user.constant";
import { UserControllers } from "./user.controller";

const router = Router();

router.get(
  "/me",
  validateAuth(USER_ROLE.admin, USER_ROLE.manager),
  UserControllers.getUser,
);

router.put(
  "/:id",
  validateAuth(USER_ROLE.admin, USER_ROLE.admin, USER_ROLE.manager),
  UserControllers.updateUser,
);

router.post("/", validateAuth(USER_ROLE.admin), UserControllers.addUser);

router.delete(
  "/:id",
  validateAuth(USER_ROLE.admin),
  UserControllers.deleteUser,
);

export const UserRoutes = router;
