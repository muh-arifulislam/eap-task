import { Types } from "mongoose";

export interface IOrderItem {
  product: Types.ObjectId;
  quantity: number;
}

export type TOrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface IOrder {
  orderId: string;
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

export interface GetOrdersQuery {
  page?: number;
  limit?: number;
  orderId?: string;
  status?: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  startDate?: string;
  endDate?: string;
}
