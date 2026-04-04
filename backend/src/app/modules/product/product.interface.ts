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

export interface CreateProduct {
  name: string;
  image: string;
  rating: string;
  category: Types.ObjectId;
  price: number;
  stock: number;
  minStock: number;
}

export interface IGetProductsQuery {
  page?: number;
  limit?: number;
  id?: string;
  status: string;
  isActive: string;
}
