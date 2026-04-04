/* eslint-disable @typescript-eslint/no-explicit-any */
// app/dashboard/users/create/page.tsx
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useCreateUserMutation } from "@/hooks/useUser";

// Define Zod schema
const createUserSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "manager"], "Select a valid role"),
  gender: z.enum(["male", "female", "third"], "Select a valid gender"),
  addressLine1: z.string().min(1, "Address Line 1 is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(1, "Postal code is required"),
});

// TypeScript type inferred from schema
type CreateUserInput = z.infer<typeof createUserSchema>;

const CreateUserPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
  });

  const createUserMutation = useCreateUserMutation();

  const onSubmit = async (data: CreateUserInput) => {
    try {
      await createUserMutation.mutateAsync(data);

      toast.success("User created successfully!");
      reset();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded mt-6">
      <h1 className="text-2xl font-bold mb-6">Create User</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block font-medium mb-1">Name</label>
          <input
            {...register("name")}
            className="w-full border rounded px-3 py-2"
            placeholder="Manager User"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            {...register("email")}
            className="w-full border rounded px-3 py-2"
            placeholder="manager@example.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block font-medium mb-1">Password</label>
          <input
            type="password"
            {...register("password")}
            className="w-full border rounded px-3 py-2"
            placeholder="manager123"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        {/* Role */}
        <div>
          <label className="block font-medium mb-1">Role</label>
          <select
            {...register("role")}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="user">User</option>
          </select>
          {errors.role && (
            <p className="text-red-500 text-sm">{errors.role.message}</p>
          )}
        </div>

        {/* Gender */}
        <div>
          <label className="block font-medium mb-1">Gender</label>
          <select
            {...register("gender")}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && (
            <p className="text-red-500 text-sm">{errors.gender.message}</p>
          )}
        </div>

        {/* Address Line 1 */}
        <div>
          <label className="block font-medium mb-1">Address Line 1</label>
          <input
            {...register("addressLine1")}
            className="w-full border rounded px-3 py-2"
            placeholder="456 Manager Avenue"
          />
          {errors.addressLine1 && (
            <p className="text-red-500 text-sm">
              {errors.addressLine1.message}
            </p>
          )}
        </div>

        {/* Address Line 2 */}
        <div>
          <label className="block font-medium mb-1">Address Line 2</label>
          <input
            {...register("addressLine2")}
            className="w-full border rounded px-3 py-2"
            placeholder="Block B"
          />
        </div>

        {/* City */}
        <div>
          <label className="block font-medium mb-1">City</label>
          <input
            {...register("city")}
            className="w-full border rounded px-3 py-2"
            placeholder="Dhaka"
          />
          {errors.city && (
            <p className="text-red-500 text-sm">{errors.city.message}</p>
          )}
        </div>

        {/* Postal Code */}
        <div>
          <label className="block font-medium mb-1">Postal Code</label>
          <input
            {...register("postalCode")}
            className="w-full border rounded px-3 py-2"
            placeholder="1216"
          />
          {errors.postalCode && (
            <p className="text-red-500 text-sm">{errors.postalCode.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Creating..." : "Create User"}
        </button>
      </form>
    </div>
  );
};

export default CreateUserPage;
