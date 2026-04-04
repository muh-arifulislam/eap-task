import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { IGetProductsQuery } from "./product.interface";
import { ProductServices } from "./product.service";
import httpStatus from "http-status";
import { parseQueryParams } from "./product.utils";

const createProduct = catchAsync(async (req, res) => {
  const productData = req.body;
  const data = await ProductServices.createProduct(productData);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Product is created successfully",
    data: data,
  });
});

const updateProduct = catchAsync(async (req, res) => {
  const productData = req.body;
  const { productId } = req.params;

  const data = await ProductServices.updateProduct(
    productId as string,
    productData,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Product is updated successfully",
    data: data,
  });
});

const updateProductInventory = catchAsync(async (req, res) => {
  const { quantity } = req.body;
  const { productId } = req.params;

  const data = await ProductServices.updateProductStock(
    productId as string,
    quantity,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Product inventory is updated successfully",
    data: data,
  });
});

const deleteProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;

  const data = await ProductServices.deleteProduct(productId as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Product is deleted successfully",
    data: data,
  });
});

const getProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;

  const data = await ProductServices.getProduct(productId as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Product data is fetched successfully",
    data: data,
  });
});

const getAllProducts = catchAsync(async (req, res) => {
  const { data, meta } = await ProductServices.getProducts(
    parseQueryParams(req.query),
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Products data are fetched successfully",
    data: data,
    meta,
  });
});

const getSearchProducts = catchAsync(async (req, res) => {
  const data = await ProductServices.getSearchProducts(req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Search products data are fetched successfully",
    data: data,
  });
});

export const ProductControllers = {
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  getAllProducts,
  updateProductInventory,
  getSearchProducts,
};
