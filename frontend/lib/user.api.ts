import { CreateUserPayload, User } from "@/types";
import Cookies from "js-cookie";

// services/userService.ts
export const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

// Get all users
export const getUsers = async (): Promise<User[]> => {
  const token = Cookies.get("access_token");
  const res = await fetch(`${BASE_URL}/users`, {
    headers: {
      Authorization: `${token}`,
    },
    cache: "no-store",
  });

  const data = await res.json();

  return data?.data || [];
};

// Create user
export const createUser = async (data: CreateUserPayload): Promise<User> => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create user");
  return res.json();
};

// Update user
export const updateUser = async (payload: {
  id: string;
  data: Partial<User>;
}): Promise<User> => {
  const res = await fetch(`${BASE_URL}/users/${payload.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload.data),
  });
  if (!res.ok) throw new Error("Failed to update user");
  return res.json();
};
