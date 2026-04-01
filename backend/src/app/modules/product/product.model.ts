import { model, Schema } from "mongoose";
import { IProduct } from "./product.interface";

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },
    rating: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    minStock: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["IN_STOCK", "OUT_OF_STOCK"],
      default: "IN_STOCK",
    },

    category: {
      type: Schema.Types.ObjectId,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export const Product = model<IProduct>("Product", productSchema);
