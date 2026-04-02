/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

// Zod validation schema
const productSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  image: z.string().url("Enter a valid image URL").optional(),
  rating: z.string().min(1, "Rating is required"),
  price: z.number().min(0, "Price must be positive"),
  stock: z.number().min(0, "Stock must be positive"),
  minStock: z.number().min(0, "Min stock must be positive"),
  category: z.string().min(1, "Please select a category"),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface Category {
  _id: string;
  name: string;
}

export default function CreateProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
  });

  const imageValue = watch("image");

  useEffect(() => {
    setImagePreview(imageValue || "");
  }, [imageValue]);

  const fetchCategories = async () => {
    try {
      const token = Cookies.get("access_token");
      const res = await fetch(`${BASE_URL}/categories`, {
        headers: { Authorization: `${token}` },
      });
      const result = await res.json();
      if (!res.ok)
        throw new Error(result.message || "Failed to fetch categories");
      setCategories(result.data);
    } catch (error: any) {
      toast.error(
        error.message || "Something went wrong while fetching categories",
      );
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const onSubmit = async (data: ProductFormValues) => {
    setLoading(true);
    try {
      const token = Cookies.get("access_token");
      const res = await fetch(`${BASE_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok)
        throw new Error(result.message || "Failed to create product");

      toast.success("Product created successfully!");
      router.push("/dashboard/products");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Create Product</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 bg-white p-6 rounded-xl shadow-lg border border-slate-200 max-w-2xl"
      >
        {/* Name */}
        <div className="space-y-1">
          <Label>Name</Label>
          <Input
            {...register("name")}
            placeholder="Wireless Mechanical Keyboard"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* Image URL */}
        <div className="space-y-1">
          <Label>Image URL</Label>
          <Input
            {...register("image")}
            placeholder="https://example.com/image.jpg"
          />
          {errors.image && (
            <p className="text-red-500 text-sm">{errors.image.message}</p>
          )}
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-2 max-h-40 rounded-md border border-slate-200"
            />
          )}
        </div>

        {/* Rating */}
        <div className="space-y-1">
          <Label>Rating</Label>
          <Input {...register("rating")} placeholder="4.6" />
          {errors.rating && (
            <p className="text-red-500 text-sm">{errors.rating.message}</p>
          )}
        </div>

        {/* Price */}
        <div className="space-y-1">
          <Label>Price ($)</Label>
          <Input
            type="number"
            {...register("price", { valueAsNumber: true })}
            placeholder="120"
          />
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price.message}</p>
          )}
        </div>

        {/* Stock */}
        <div className="space-y-1">
          <Label>Stock</Label>
          <Input
            type="number"
            {...register("stock", { valueAsNumber: true })}
            placeholder="20"
          />
          {errors.stock && (
            <p className="text-red-500 text-sm">{errors.stock.message}</p>
          )}
        </div>

        {/* Min Stock */}
        <div className="space-y-1">
          <Label>Min Stock</Label>
          <Input
            type="number"
            {...register("minStock", { valueAsNumber: true })}
            placeholder="10"
          />
          {errors.minStock && (
            <p className="text-red-500 text-sm">{errors.minStock.message}</p>
          )}
        </div>

        {/* Category */}
        <div className="space-y-1">
          <Label>Category</Label>
          <Select
            value={watch("category")}
            onValueChange={(value) => setValue("category", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat._id} value={cat._id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-red-500 text-sm">{errors.category.message}</p>
          )}
        </div>

        <Button type="submit" className="mt-4" disabled={loading}>
          {loading ? "Creating..." : "Create Product"}
        </Button>
      </form>
    </div>
  );
}
