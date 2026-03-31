import { z } from "zod";

const createCategorySchema = z.object({
  body: z.object({
    name: z.string("name is required"),
  }),
});

const updateCategorySchema = z.object({
  body: z.object({
    name: z.string("name is required").optional(),
    isActive: z.boolean().optional(),
  }),
});

export const CategoryValidation = {
  createCategorySchema,
  updateCategorySchema,
};
