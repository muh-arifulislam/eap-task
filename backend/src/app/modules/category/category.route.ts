import { Router } from "express";
import { CategoryControllers } from "./category.controller";
import validateAuth from "../../middlewares/validateAuth";
import { USER_ROLE } from "../user/user.constant";
import validateRequest from "../../middlewares/validateRequest";
import { CategoryValidation } from "./category.validation";

const router = Router();

router.get(
  "/:categoryId",
  validateAuth(USER_ROLE.admin, USER_ROLE.manager),
  CategoryControllers.getCategory,
);

router.patch(
  "/:categoryId",
  validateAuth(USER_ROLE.admin, USER_ROLE.manager),
  validateRequest(CategoryValidation.updateCategorySchema),
  CategoryControllers.updateCategory,
);

router.delete(
  "/:categoryId",
  validateAuth(USER_ROLE.admin, USER_ROLE.manager),
  CategoryControllers.softDeleteCategory,
);

router.post(
  "/",
  validateAuth(USER_ROLE.admin, USER_ROLE.manager),
  validateRequest(CategoryValidation.createCategorySchema),
  CategoryControllers.createCategory,
);

router.get(
  "/",
  validateAuth(USER_ROLE.admin, USER_ROLE.manager),
  CategoryControllers.getAllCategories,
);

export const CategoryRoutes = router;
