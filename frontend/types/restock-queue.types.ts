import { Product } from "./product.types";

export interface RestockQueue {
  _id: string;
  product: Product;
  priority: "HIGH" | "MEDIUM" | "LOW";
}
