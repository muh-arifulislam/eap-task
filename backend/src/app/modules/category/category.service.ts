// src/modules/category/category.service.ts
import { Category } from "./category.model";
import { ICategory } from "./category.interface";
import slugify from "slugify";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const createCategory = async (payload: ICategory) => {
  const slug = slugify(payload.name, { lower: true, strict: true });

  // Check if slug already exists
  const existing = await Category.findOne({ slug });
  if (existing && existing.isDeleted === false)
    throw new Error("Category already exists");

  //If exist as soft deleted then restore and return it
  if (existing?.isDeleted) {
    existing.isDeleted = false;
    existing.isActive = true;
    await existing.save();
    return existing;
  }

  const category = await Category.create({
    name: payload.name,
    slug,
    isActive: true,
    isDeleted: false,
  });

  return category;
};

const updateCategory = async (id: string, data: Partial<ICategory>) => {
  const category = await Category.findById(id);
  if (!category) throw new AppError(httpStatus.NOT_FOUND, "Category not found");

  if (data?.name) {
    const slug = slugify(data.name, { lower: true, strict: true });
    // Check if slug already exists
    const existing = await Category.findOne({ slug });
    if (existing)
      throw new AppError(httpStatus.BAD_REQUEST, "Category already exists");

    category.name = data.name;
    category.slug = slug;
  }

  if (data.isActive === true || data.isActive === false) {
    category.isActive = data.isActive;
  }

  await category.save();
  return category;
};

const softDeleteCategory = async (id: string) => {
  const category = await Category.findById(id);
  if (!category) throw new AppError(httpStatus.NOT_FOUND, "Category not found");

  category.isDeleted = true;
  category.isActive = false;

  await category.save();
  return { message: "Category soft deleted successfully" };
};

const getCategoryById = async (id: string) => {
  const category = await Category.findById(id);
  if (!category || category.isDeleted)
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  return category;
};

const getAllCategories = async () => {
  const categories = await Category.find({ isDeleted: false }).sort({
    createdAt: -1,
  });
  return categories;
};

export const CategoryServices = {
  createCategory,
  updateCategory,
  softDeleteCategory,
  getCategoryById,
  getAllCategories,
};
