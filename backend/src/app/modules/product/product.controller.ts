import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ProductServices } from "./product.service";
import httpStatus from "http-status";

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
    message: "Category is updated successfully",
    data: data,
  });
});

const deleteProduct = catchAsync(async (req, res) => {
  const { categoryId } = req.params;

  const data = await ProductServices.deleteProduct(categoryId as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category is deleted successfully",
    data: data,
  });
});

const getProduct = catchAsync(async (req, res) => {
  const { categoryId } = req.params;

  const data = await ProductServices.getCategoryById(categoryId as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category data is fetched successfully",
    data: data,
  });
});

const getAllProducts = catchAsync(async (req, res) => {
  const data = await ProductServices.getAllCategories();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Categories data is fetched successfully",
    data: data,
  });
});

export const ProductControllers = { createProduct };
