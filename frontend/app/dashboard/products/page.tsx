/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Edit, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("access_token");
      const res = await fetch(`${BASE_URL}/products`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      const result = await res.json();
      if (!res.ok)
        throw new Error(result.message || "Failed to fetch products");
      setProducts(result.data);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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
      setProducts(products.filter((p) => p._id !== deleteProductId));
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setShowDeleteModal(false);
      setDeleteProductId(null);
    }
  };

  // Pagination calculation
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const currentItems = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">All Products</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-2xl shadow-lg p-4 border border-slate-200">
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
              {currentItems.map((product) => (
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
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1"
                    >
                      <Edit size={16} /> Edit
                    </button>
                    <button
                      onClick={() => confirmDelete(product._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
              {currentItems.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-3 text-center text-slate-500">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-end mt-4 gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? "bg-PrimaryColor text-white"
                    : "bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
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
