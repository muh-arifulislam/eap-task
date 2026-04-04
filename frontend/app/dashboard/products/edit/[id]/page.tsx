/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";
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

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ProductData extends ProductFormValues {}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
  });

  const imageValue = watch("image");
  const stockValue = watch("stock");

  // Update image preview whenever image URL changes
  useEffect(() => {
    setImagePreview(imageValue || "");
  }, [imageValue]);

  // Fetch categories
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
      toast.error(error.message || "Failed to fetch categories");
    }
  };

  // Fetch product by ID
  const fetchProduct = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("access_token");
      const res = await fetch(`${BASE_URL}/products/${productId}`, {
        headers: { Authorization: `${token}` },
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to fetch product");

      const product: ProductData & { status: string } = result.data;
      reset({
        name: product.name,
        image: product.image,
        rating: product.rating,
        price: product.price,
        stock: product.stock,
        minStock: product.minStock,
        category: product.category,
      });
      setImagePreview(product.image || "");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProduct();
  }, [productId]);

  const onSubmit = async (data: ProductFormValues) => {
    setLoading(true);
    try {
      const token = Cookies.get("access_token");

      // Determine status based on stock value
      const status = data.stock > 0 ? "IN_STOCK" : "OUT_OF_STOCK";

      const res = await fetch(`${BASE_URL}/products/${productId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({ ...data, status }),
      });

      const result = await res.json();
      if (!res.ok)
        throw new Error(result.message || "Failed to update product");

      toast.success("Product updated successfully!");
      router.push("/dashboard/products");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <h2 className="text-2xl font-medium mb-6">Edit Product</h2>
      {loading && <LoadingSkeleton />}
      {!loading && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 bg-white p-6 rounded-xl shadow-xs border border-slate-200 max-w-2xl"
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
            <p className="text-sm text-gray-500 mt-1">
              Status will be automatically set based on stock:{" "}
              <span className="font-medium">
                {stockValue > 0 ? "IN_STOCK" : "OUT_OF_STOCK"}
              </span>
            </p>
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
            {loading ? "Updating..." : "Update Product"}
          </Button>
        </form>
      )}
    </div>
  );
}

const LoadingSkeleton = () => {
  return (
    <div className="space-y-5 bg-white p-6 rounded-xl shadow-xs border border-slate-200 max-w-2xl animate-pulse">
      {/* Name */}
      <div className="space-y-1">
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
        <div className="h-10 w-full bg-gray-100 rounded border border-gray-200"></div>
      </div>

      {/* Image URL */}
      <div className="space-y-1">
        <div className="h-4 w-28 bg-gray-200 rounded"></div>
        <div className="h-10 w-full bg-gray-100 rounded border border-gray-200"></div>
        <div className="h-40 w-full bg-gray-100 rounded border border-gray-200 mt-2"></div>
      </div>

      {/* Rating */}
      <div className="space-y-1">
        <div className="h-4 w-20 bg-gray-200 rounded"></div>
        <div className="h-10 w-24 bg-gray-100 rounded border border-gray-200"></div>
      </div>

      {/* Price */}
      <div className="space-y-1">
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
        <div className="h-10 w-32 bg-gray-100 rounded border border-gray-200"></div>
      </div>

      {/* Stock */}
      <div className="space-y-1">
        <div className="h-4 w-20 bg-gray-200 rounded"></div>
        <div className="h-10 w-32 bg-gray-100 rounded border border-gray-200"></div>
        <div className="h-4 w-64 bg-gray-100 rounded mt-1"></div>
      </div>

      {/* Min Stock */}
      <div className="space-y-1">
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
        <div className="h-10 w-32 bg-gray-100 rounded border border-gray-200"></div>
      </div>

      {/* Category */}
      <div className="space-y-1">
        <div className="h-4 w-28 bg-gray-200 rounded"></div>
        <div className="h-10 w-full bg-gray-100 rounded border border-gray-200"></div>
      </div>

      {/* Button */}
      <div className="h-10 w-36 bg-gray-300 rounded mt-4"></div>
    </div>
  );
};
