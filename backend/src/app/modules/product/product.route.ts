import { Router } from "express";
import { ProductControllers } from "./product.controller";
import validateRequest from "../../middlewares/validateRequest";
import { ProductValidation } from "./product.validation";

const router = Router();

router.get("/:productId", ProductControllers.getProduct);

router.patch(
  "/:productId",
  validateRequest(ProductValidation.updateProductchema),
  ProductControllers.updateProduct,
);

router.delete("/:productId", ProductControllers.deleteProduct);

router.post(
  "/",
  validateRequest(ProductValidation.createProductSchema),
  ProductControllers.createProduct,
);

router.get("/", ProductControllers.getAllProducts);

export const ProductRoutes = router;
