import slugify from "slugify";
import { CreateProduct, IProduct } from "./product.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { Product } from "./product.model";
import { Category } from "../category/category.model";
import { RestockQueue } from "../restock/restock.model";
import { startSession } from "mongoose";

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

const updateProductStock = async (productId: string, quantity: number) => {
  const session = await startSession();

  try {
    session.startTransaction();

    const product = await Product.findById(productId).session(session);

    if (!product) {
      throw new AppError(httpStatus.NOT_FOUND, "Product not found");
    }

    // Update stock
    product.stock += quantity;
    await product.save({ session });

    /** -------------------------
     * RESTOCK QUEUE SYNC
     * ------------------------- */

    const existingQueue = await RestockQueue.findOne({
      product: product._id,
    }).session(session);

    if (product.stock <= product.minStock) {
      let priority: "HIGH" | "MEDIUM" | "LOW" = "LOW";

      const ratio = product.stock / product.minStock;

      if (ratio <= 0.3) priority = "HIGH";
      else if (ratio <= 0.7) priority = "MEDIUM";

      if (!existingQueue) {
        await RestockQueue.create(
          [
            {
              product: product._id,
              priority,
            },
          ],
          { session },
        );
      } else {
        existingQueue.priority = priority;
        await existingQueue.save({ session });
      }
    } else {
      // stock is healthy → remove from queue
      if (existingQueue) {
        await RestockQueue.deleteOne({ _id: existingQueue._id }).session(
          session,
        );
      }
    }

    await session.commitTransaction();
    await session.endSession();

    return product;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
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
  updateProductStock,
  deleteProduct,
  getProduct,
  getProducts,
};
