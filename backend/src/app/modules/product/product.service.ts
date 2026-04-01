import slugify from "slugify";
import { CreateProduct, IProduct } from "./product.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { Product } from "./product.model";
import { Category } from "../category/category.model";

const createProduct = async (payload: CreateProduct) => {
  const slug = slugify(payload.name, { lower: true, strict: true });

  // Check if slug already exists
  const existing = await Product.findOne({ slug });
  if (existing) throw new Error("Product already exists");

  const category = await Category.findById(payload.category);
  if (!category || category?.isDeleted === true) {
    throw new AppError(httpStatus.BAD_REQUEST, "Category not found");
  }

  const product = await Product.create({
    ...payload,
    slug,
  });

  return product;
};

const updateProduct = async (id: string, payload: CreateProduct) => {
  const slug = slugify(payload.name, { lower: true, strict: true });

  // Check if slug already exists
  const existing = await Product.findOne({ slug });
  if (existing) throw new Error("Product already exists");

  const category = await Category.findById(payload.category);
  if (!category || category?.isDeleted === true) {
    throw new AppError(httpStatus.BAD_REQUEST, "Category not found");
  }

  const product = await Product.create({
    ...payload,
    slug,
  });

  return product;
};

const deleteProduct = async (payload: CreateProduct) => {
  const slug = slugify(payload.name, { lower: true, strict: true });

  // Check if slug already exists
  const existing = await Product.findOne({ slug });
  if (existing) throw new Error("Product already exists");

  const category = await Category.findById(payload.category);
  if (!category || category?.isDeleted === true) {
    throw new AppError(httpStatus.BAD_REQUEST, "Category not found");
  }

  const product = await Product.create({
    ...payload,
    slug,
  });

  return product;
};

const getProduct = async (payload: CreateProduct) => {
  const slug = slugify(payload.name, { lower: true, strict: true });

  // Check if slug already exists
  const existing = await Product.findOne({ slug });
  if (existing) throw new Error("Product already exists");

  const category = await Category.findById(payload.category);
  if (!category || category?.isDeleted === true) {
    throw new AppError(httpStatus.BAD_REQUEST, "Category not found");
  }

  const product = await Product.create({
    ...payload,
    slug,
  });

  return product;
};

const getProducts = async (payload: CreateProduct) => {
  const slug = slugify(payload.name, { lower: true, strict: true });

  // Check if slug already exists
  const existing = await Product.findOne({ slug });
  if (existing) throw new Error("Product already exists");

  const category = await Category.findById(payload.category);
  if (!category || category?.isDeleted === true) {
    throw new AppError(httpStatus.BAD_REQUEST, "Category not found");
  }

  const product = await Product.create({
    ...payload,
    slug,
  });

  return product;
};

export const ProductServices = {
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  getProducts,
};
