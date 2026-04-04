import { CreateOrderPayload, Order, UpdateOrderStatusPayload } from "@/types";
import Cookies from "js-cookie";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

type GetOrdersResponse = {
  data: Order[];
  meta: { page: number; limit: number; total: number; totalPage: number };
};

export const getOrders = async (query: string): Promise<GetOrdersResponse> => {
  const token = Cookies.get("access_token");

  const res = await fetch(`${BASE_URL}/orders?${query}`, {
    headers: {
      Authorization: `${token}`,
    },
    cache: "no-store",
  });

  const data = await res.json();

  return data;
};

export const createOrder = async (payload: CreateOrderPayload) => {
  const token = Cookies.get("access_token");

  const res = await fetch(`${BASE_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
    body: JSON.stringify(payload),
  });

  return res.json();
};

export const updateOrderStatus = async (payload: {
  id: string;
  data: UpdateOrderStatusPayload;
}) => {
  const token = Cookies.get("access_token");

  const res = await fetch(`${BASE_URL}/orders/${payload.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
    body: JSON.stringify(payload.data),
  });

  return res.json();
};

export const deleteOrder = async (id: string) => {
  const token = Cookies.get("access_token");

  const res = await fetch(`${BASE_URL}/orders/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Failed to delete category");
  }

  return data;
};

export const getSearchOrders = async (
  query: string,
): Promise<
  {
    orderId: string;
    customer: {
      name: string;
      email: string;
    };
  }[]
> => {
  const token = Cookies.get("access_token");

  const res = await fetch(`${BASE_URL}/orders/search?${query}`, {
    headers: {
      Authorization: `${token}`,
    },
    cache: "no-store",
  });

  const data = await res.json();

  return data?.data || [];
};
