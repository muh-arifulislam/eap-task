"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createOrder,
  deleteOrder,
  getOrders,
  updateOrderStatus,
} from "@/lib/order.api";

export const useOrders = (query: string) => {
  return useQuery({
    queryKey: ["orders", query],
    queryFn: () => getOrders(query),
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
