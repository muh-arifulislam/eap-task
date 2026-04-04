import { getProducts, getSearchProducts } from "@/lib/product.api";
import { useQuery } from "@tanstack/react-query";

export const useProducts = (query: string) => {
  return useQuery({
    queryKey: ["products", query],
    queryFn: () => getProducts(query),
  });
};

export const useSearchProducts = (query: string) => {
  return useQuery({
    queryKey: ["search-products", query],
    queryFn: () => getSearchProducts(query),
  });
};
