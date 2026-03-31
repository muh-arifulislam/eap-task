import { model, Schema } from "mongoose";
import { IRestock } from "./restock.interface";

const restockSchema = new Schema<IRestock>({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },

  priority: {
    type: String,
    enum: ["HIGH", "MEDIUM", "LOW"],
  },
});

export const RestockQueue = model("RestockQueue", restockSchema);
