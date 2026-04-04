import { useQuery } from "@tanstack/react-query";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

const fetchActivities = async () => {
  const res = await fetch(`${BASE_URL}/activities?limit=10`);
  const data = await res.json();
  return data.data;
};

export const useActivities = () => {
  return useQuery({
    queryKey: ["activities"],
    queryFn: fetchActivities,
    refetchInterval: 3000,
  });
};
