/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

const editCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  isActive: z.boolean(),
});

type EditCategoryInput = z.infer<typeof editCategorySchema>;

interface Category {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id as string;

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EditCategoryInput>({
    resolver: zodResolver(editCategorySchema),
  });

  const isActive = watch("isActive");

  // Fetch category data
  const fetchCategory = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("access_token");
      const res = await fetch(`${BASE_URL}/categories/${categoryId}`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      const result = await res.json();
      if (!res.ok)
        throw new Error(result.message || "Failed to fetch category");

      const category: Category = result.data;
      setValue("name", category.name);
      setValue("isActive", category.isActive);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categoryId) fetchCategory();
  }, [categoryId]);

  // Submit updated data
  const onSubmit = async (data: EditCategoryInput) => {
    try {
      const token = Cookies.get("access_token");
      const res = await fetch(`${BASE_URL}/categories/${categoryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok)
        throw new Error(result.message || "Failed to update category");

      toast.success("Category updated successfully!");
      router.push("/dashboard/categories");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <h2 className="text-2xl font-medium mb-6">Edit Category</h2>

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 max-w-xl space-y-4"
        >
          {/* Name */}
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-slate-700">
              Category Name
            </label>
            <input
              {...register("name")}
              type="text"
              placeholder="Category name"
              className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* isActive */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700">
              Active
            </label>
            <Switch
              {...register("isActive")}
              checked={isActive}
              onCheckedChange={(val) => setValue("isActive", val)}
            />
          </div>

          <Button
            type="submit"
            className="w-full text-white py-2 mt-4"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Category"}
          </Button>
        </form>
      )}
    </div>
  );
}

const LoadingSkeleton = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 max-w-xl space-y-4 animate-pulse">
      {/* Name */}
      <div className="space-y-1">
        <div className="h-4 w-32 bg-gray-200 rounded"></div>
        <div className="h-10 w-full bg-gray-100 rounded border border-gray-200"></div>
      </div>

      {/* isActive */}
      <div className="flex items-center justify-between">
        <div className="h-4 w-16 bg-gray-200 rounded"></div>
        <div className="h-6 w-12 bg-gray-100 rounded-full border border-gray-200"></div>
      </div>

      {/* Button */}
      <div className="h-10 w-full bg-gray-300 rounded mt-4"></div>
    </div>
  );
};
