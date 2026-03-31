import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CategoryServices } from "./category.service";
import httpStatus from "http-status";

const createCategory = catchAsync(async (req, res) => {
  const categoryData = req.body;
  const data = await CategoryServices.createCategory(categoryData);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category is created successfully",
    data: data,
  });
});

const updateCategory = catchAsync(async (req, res) => {
  const categoryData = req.body;
  const { categoryId } = req.params;

  const data = await CategoryServices.updateCategory(
    categoryId as string,
    categoryData,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category is updated successfully",
    data: data,
  });
});

const softDeleteCategory = catchAsync(async (req, res) => {
  const { categoryId } = req.params;

  const data = await CategoryServices.softDeleteCategory(categoryId as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category is deleted successfully",
    data: data,
  });
});

const getCategory = catchAsync(async (req, res) => {
  const { categoryId } = req.params;

  const data = await CategoryServices.getCategoryById(categoryId as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category data is fetched successfully",
    data: data,
  });
});

const getAllCategories = catchAsync(async (req, res) => {
  const data = await CategoryServices.getAllCategories();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Categories data is fetched successfully",
    data: data,
  });
});

export const CategoryControllers = {
  createCategory,
  updateCategory,
  softDeleteCategory,
  getCategory,
  getAllCategories,
};
