import { z } from "zod";

const createProductSchema = z.object({
  body: z.object({
    name: z.string("Name is required"),
    image: z.string("Image is required"),
    rating: z.string("Rating is required"),
    price: z.number("Price is required"),
    stock: z.number("Stock is required"),
    minStock: z.number("Min-stock is required"),
    category: z.string("Category is required"),
  }),
});

const updateProductchema = z.object({
  body: z.object({
    name: z.string("name is required").optional(),
    image: z.string("Image is required").optional(),
    rating: z.string("rating is required").optional(),
    price: z.number("price is required").optional(),
    stock: z.number("Stock is required").optional(),
    minStock: z.number("Minstock is required").optional(),
    isActive: z.boolean().optional(),
    status: z.enum(["IN_STOCK", "OUT_OF_STOCK"]).optional(),
    category: z.string("name is required").optional(),
  }),
});

export const ProductValidation = {
  createProductSchema,
  updateProductchema,
};
