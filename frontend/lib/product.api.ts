import { Product } from "@/types";
import Cookies from "js-cookie";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

type GetProductsResponse = {
  data: Product[];
  meta: { page: number; limit: number; total: number; totalPage: number };
};

export const getProducts = async (
  query: string,
): Promise<GetProductsResponse> => {
  const token = Cookies.get("access_token");

  const res = await fetch(`${BASE_URL}/products?${query}`, {
    headers: {
      Authorization: `${token}`,
    },
    cache: "no-store",
  });

  const data = await res.json();

  return data;
};

export const getSearchProducts = async (
  query: string,
): Promise<{ _id: string; name: string }[]> => {
  const token = Cookies.get("access_token");

  const res = await fetch(`${BASE_URL}/products/search?${query}`, {
    headers: {
      Authorization: `${token}`,
    },
    cache: "no-store",
  });

  const data = await res.json();

  return data?.data || [];
};
