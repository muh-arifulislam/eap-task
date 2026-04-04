"use client";

import { useQuery } from "@tanstack/react-query";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

const fetchDashboard = async () => {
  const res = await fetch(`${BASE_URL}/dashboard`);
  const data = await res.json();
  return data.data;
};

export const useDashboard = () => {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
    refetchInterval: 15000,
    refetchOnWindowFocus: true,
  });
};
