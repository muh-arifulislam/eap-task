import {
  createProduct,
  getProducts,
  getSearchProducts,
} from "@/lib/product.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["search-products"] });
    },
  });
};
