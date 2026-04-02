/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Edit, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCategories, useDeleteCategory } from "@/hooks/useCategory";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

interface Category {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function CategoriesPage() {
  const router = useRouter();

  const { data: categories = [], isLoading, error } = useCategories();

  const deleteCategoryMutation = useDeleteCategory();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);

  // Open delete modal
  const confirmDelete = (id: string) => {
    setDeleteCategoryId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!deleteCategoryId) return;

    try {
      await deleteCategoryMutation.mutateAsync(deleteCategoryId);
      toast.success("Category deleted successfully");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setShowDeleteModal(false);
      setDeleteCategoryId(null);
    }
  };

  // Pagination calculation
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const currentItems = categories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">All Categories</h2>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-2xl shadow-lg p-4 border border-slate-200">
          <table className="w-full table-auto border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Slug</th>
                <th className="p-3 text-left">Active</th>
                <th className="p-3 text-left">Created At</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((cat) => (
                <tr key={cat._id} className="border-b hover:bg-slate-50">
                  <td className="p-3">{cat.name}</td>
                  <td className="p-3">{cat.slug}</td>
                  <td className="p-3">{cat.isActive ? "Yes" : "No"}</td>
                  <td className="p-3">
                    {new Date(cat.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() =>
                        router.push(`/dashboard/categories/edit/${cat._id}`)
                      }
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1"
                    >
                      <Edit size={16} /> Edit
                    </button>
                    <button
                      onClick={() => confirmDelete(cat._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
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
              Are you sure you want to delete this category? This action cannot
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
