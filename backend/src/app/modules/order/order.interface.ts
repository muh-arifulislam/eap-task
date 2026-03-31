import { Types } from "mongoose";

export interface IOrderItem {
  product: Types.ObjectId;
  quantity: number;
}

export interface IOrder {
  customer: {
    name: string;
    email?: string;
    mobile: string;
    address: string;
  };

  items: IOrderItem[];
  totalPrice: number;
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
}
