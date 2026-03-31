import { Types } from "mongoose";

export interface IRestock {
  product: Types.ObjectId;
  priority: "HIGH" | "MEDIUM" | "LOW";
}
