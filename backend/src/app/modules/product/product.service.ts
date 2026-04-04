import slugify from "slugify";
import {
  CreateProduct,
  IGetProductsQuery,
  IProduct,
} from "./product.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { Product } from "./product.model";
import { Category } from "../category/category.model";
import { RestockQueue } from "../restock/restock.model";
import { startSession } from "mongoose";
import { buildQueryFilter } from "../../utils/buildQueryFilter";
import { Activity } from "../activity/activity.model";

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

    await Activity.create(
      [{ message: `Stock updated for “${product.name}”` }],
      {
        session,
      },
    );

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

const getProducts = async (query: IGetProductsQuery) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  let filter: any = {};

  // filter by stock status
  if (query.status) {
    filter.status = query.status;
  }

  // filter by active status
  if (query.isActive) {
    if (query.isActive === "1") {
      filter.isActive = true;
    }
    if (query.isActive === "0") {
      filter.isActive = false;
    }
  }

  // filter by id
  if (query.id) {
    filter = {};
    filter._id = query.id;
  }

  const products = await Product.find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Product.countDocuments(filter);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
    data: products,
  };
};

const getSearchProducts = async (query: Record<string, unknown>) => {
  const searchableFields = ["name"];

  const filter = buildQueryFilter(query, searchableFields);

  const products = await Product.find(filter)
    .select("_id name")
    .limit(10)
    .sort({ name: 1 });

  return products;
};

export const ProductServices = {
  createProduct,
  updateProduct,
  updateProductStock,
  deleteProduct,
  getProduct,
  getProducts,
  getSearchProducts,
};
