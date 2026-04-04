export interface OrderItem {
  product: { name: string };
  quantity: number;
}

export interface Order {
  _id: string;
  customer: {
    name: string;
    email: string | null;
    mobile: string;
    address: string;
  };
  items: OrderItem[];
  totalPrice: number;
  status: string;
  createdAt: string;
}

export interface CreateOrderItem {
  product: string;
  quantity: number;
}
export interface CreateOrderPayload {
  customer: {
    name: string;
    mobile: string;
    address: string;
    email?: string;
  };
  items: CreateOrderItem[];
  totalPrice: number;
}

export interface UpdateOrderStatusPayload {
  status: string;
}
