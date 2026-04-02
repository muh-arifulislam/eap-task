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
