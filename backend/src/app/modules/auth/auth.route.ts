import { Router } from "express";
import { AuthControllers } from "./auth.controller";
import { USER_ROLE } from "../user/user.constant";
import validateAuth from "../../middlewares/validateAuth";
import { UserControllers } from "../user/user.controller";

const router = Router();

router.post("/login", AuthControllers.loginUser);

router.post("/register", UserControllers.addUser);

router.post(
  "/change-password",
  validateAuth(USER_ROLE.admin, USER_ROLE.manager),
  AuthControllers.changePassword,
);

export const AuthRoutes = router;
