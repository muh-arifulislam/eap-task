/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Edit, RefreshCcw, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import SearchWithSuggestion from "@/components/SearchWithSuggestion";
import { useProducts, useSearchProducts } from "@/hooks/useProduct";
import LoadingSkeleton from "@/components/LoadingSkeleton";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

interface Product {
  _id: string;
  name: string;
  slug: string;
  rating: string;
  price: number;
  stock: number;
  minStock: number;
  status: "IN_STOCK" | "OUT_OF_STOCK";
  category?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ProductsPage() {
  const router = useRouter();

  const [queryParams, setQueryParams] = useState("");
  const { data, isLoading, error, refetch, isFetching } =
    useProducts(queryParams);

  const products = data?.data || [];
  const meta = data?.meta;

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);

  // Open delete modal
  const confirmDelete = (id: string) => {
    setDeleteProductId(id);
    setShowDeleteModal(true);
  };

  // Delete product
  const handleDelete = async () => {
    if (!deleteProductId) return;
    try {
      const token = Cookies.get("access_token");
      const res = await fetch(`${BASE_URL}/products/${deleteProductId}`, {
        method: "DELETE",
        headers: {
          Authorization: `${token}`,
        },
      });
      const result = await res.json();
      if (!res.ok)
        throw new Error(result.message || "Failed to delete product");

      toast.success("Product deleted successfully!");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setShowDeleteModal(false);
      setDeleteProductId(null);
    }
  };

  const [filterProductId, setFilterProductId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterActiveStatus, setFilterActiveStatus] = useState<
    "1" | "0" | null
  >(null);

  useEffect(() => {
    const params = new URLSearchParams();

    params.append("page", currentPage.toString());
    params.append("limit", itemsPerPage.toString());

    if (filterStatus) {
      params.append("status", filterStatus);
    }

    if (filterActiveStatus !== null) {
      params.append("isActive", String(filterActiveStatus));
    }

    if (filterProductId) {
      params.append("id", filterProductId);
    }

    setQueryParams(params.toString());
  }, [currentPage, filterStatus, filterActiveStatus, filterProductId]);

  const handleReset = () => {
    setFilterStatus("");
    setFilterActiveStatus(null);
    setFilterProductId(null);
  };

  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-medium">All Products</h2>
        <Button onClick={() => refetch()} className="flex gap-2">
          <RefreshCcw size={16} className={isFetching ? "animate-spin" : ""} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6 flex-wrap items-end bg-white p-6 rounded-lg shadow-xs border">
        <SearchWithSuggestion
          placeholder="Search products..."
          searchFn={useSearchProducts}
          labelKey="name"
          idKey="_id"
          onSelect={(product) => setFilterProductId(product._id)}
        />

        {/* Product Status */}
        <div className="flex flex-col">
          <label className="text-sm mb-1">Stock</label>

          <Select
            value={filterStatus || "ALL"}
            onValueChange={(v) => setFilterStatus(v === "ALL" ? "" : v)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>

              <SelectItem value={"IN_STOCK"}>In Stock</SelectItem>
              <SelectItem value={"OUT_OF_STOCK"}>Out Of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Active Status */}
        <div className="flex flex-col">
          <label className="text-sm mb-1">Status</label>

          <Select
            value={filterActiveStatus === null ? "ALL" : filterActiveStatus}
            onValueChange={(v) => {
              if (v === "ALL") {
                setFilterActiveStatus(null);
              } else {
                setFilterActiveStatus(v as "1" | "0");
              }
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="1">Active</SelectItem>
              <SelectItem value="0">Disabled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-x-4">
          <Button
            variant={
              filterProductId || filterStatus || filterActiveStatus
                ? "destructive"
                : "secondary"
            }
            onClick={handleReset}
          >
            Reset
          </Button>
        </div>
      </div>

      {isLoading || isFetching ? (
        <LoadingSkeleton />
      ) : (
        <div className="overflow-x-auto bg-white rounded-2xl shadow-xs p-4 border border-slate-200">
          <table className="w-full table-auto border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Stock</th>
                <th className="p-3 text-left">Min Stock</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Active</th>
                <th className="p-3 text-left">Created At</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products &&
                products.map((product) => (
                  <tr key={product._id} className="border-b hover:bg-slate-50">
                    <td className="p-3">{product.name}</td>
                    <td className="p-3">${product.price}</td>
                    <td className="p-3">{product.stock}</td>
                    <td className="p-3">{product.minStock}</td>
                    <td className="p-3">{product.status}</td>
                    <td className="p-3">{product.isActive ? "Yes" : "No"}</td>
                    <td className="p-3">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() =>
                          router.push(`/dashboard/products/edit/${product._id}`)
                        }
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded flex items-center gap-1"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => confirmDelete(product._id)}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded flex items-center gap-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-3 text-center text-slate-500">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-end mt-4 gap-2 flex-wrap items-center">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>

            <div className="text-sm text-gray-700">
              <span>
                Page {meta?.page} of {meta?.totalPage}
              </span>
            </div>

            <button
              disabled={currentPage === meta?.totalPage}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
            {/* Go to First Page */}
            {currentPage !== 1 && (
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                First
              </button>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[320px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Confirm Delete</h3>
              <button onClick={() => setShowDeleteModal(false)}>
                <X size={20} />
              </button>
            </div>
            <p className="mb-6">
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
