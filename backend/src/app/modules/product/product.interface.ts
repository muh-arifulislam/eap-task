import { Types } from "mongoose";

export interface IProduct {
  name: string;
  slug: string;
  image: string;
  rating: string;
  category: Types.ObjectId;
  price: number;
  stock: number;
  minStock: number;
  status: "IN_STOCK" | "OUT_OF_STOCK";

  isActive: boolean;
}
