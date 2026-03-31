import { z } from "zod";

const createUserSchema = z.object({
  body: z.object({}),
});

export const UserValidation = { createUserSchema };
