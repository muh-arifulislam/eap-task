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
  if (payload?.category) {
    const category = await Category.findById(payload.category);
    if (!category || category?.isDeleted === true) {
      throw new AppError(httpStatus.BAD_REQUEST, "Category not found");
    }
  }
  const product = await Product.findByIdAndUpdate(
    id,
    {
      ...payload,
    },
    { runValidators: true, new: true },
  );

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found.");
  }

  return product;
};

const deleteProduct = async (id: string) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) throw new Error("Product doesn't exists");

  return null;
};

const getProduct = async (id: string) => {
  const product = await Product.findById(id);
  if (!product) throw new Error("Product doesn't exists");

  return product;
};

const getProducts = async () => {
  const products = await Product.find();

  return products;
};

export const ProductServices = {
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  getProducts,
};
