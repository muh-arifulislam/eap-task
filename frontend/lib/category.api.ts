import { Category } from "@/types";
import Cookies from "js-cookie";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

export const getCategories = async (): Promise<Category[]> => {
  const token = Cookies.get("access_token");

  const res = await fetch(`${BASE_URL}/categories`, {
    headers: {
      Authorization: `${token}`,
    },
    cache: "no-store",
  });

  const data = await res.json();

  return data?.data || [];
};

export const createCategory = async (payload: { name: string }) => {
  const token = Cookies.get("access_token");

  const res = await fetch(`${BASE_URL}/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
    body: JSON.stringify(payload),
  });

  return res.json();
};

export const deleteCategory = async (id: string) => {
  const token = Cookies.get("access_token");

  const res = await fetch(`${BASE_URL}/categories/${id}`, {
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
