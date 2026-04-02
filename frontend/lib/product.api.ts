import { Product } from "@/types";
import Cookies from "js-cookie";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

export const getProducts = async (): Promise<Product[]> => {
  const token = Cookies.get("access_token");

  const res = await fetch(`${BASE_URL}/products`, {
    headers: {
      Authorization: `${token}`,
    },
    cache: "no-store",
  });

  const data = await res.json();

  return data?.data || [];
};
