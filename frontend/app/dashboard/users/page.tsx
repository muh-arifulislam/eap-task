/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { toast } from "sonner";

import { useRouter } from "next/navigation";
import { Edit, RefreshCcw, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDeleteCategory } from "@/hooks/useCategory";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { useUsers } from "@/hooks/useUser";
import { cn } from "@/lib/utils";

export default function CategoriesPage() {
  const router = useRouter();

  const {
    data: users = [],
    isLoading,
    error,
    refetch,
    isFetching,
  } = useUsers();

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
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const currentItems = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-medium">All Users</h2>
        <Button
          onClick={() => refetch()}
          disabled={isFetching || isLoading}
          className="flex gap-2"
        >
          <RefreshCcw size={16} className={isFetching ? "animate-spin" : ""} />
          Refresh
        </Button>
      </div>

      {isLoading || isFetching ? (
        <LoadingSkeleton />
      ) : (
        <div className="overflow-x-auto bg-white rounded-2xl shadow-xs p-4 border border-slate-200">
          <table className="w-full table-auto border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Created At</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((user) => (
                <tr key={user._id} className="border-b hover:bg-slate-50">
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.role}</td>
                  <td className="p-3">
                    <Button
                      size={"xs"}
                      className={cn(
                        user.isDisabled ? "bg-red-400" : "bg-green-600",
                      )}
                    >
                      {!user.isDisabled ? "Active" : "Disabled"}
                    </Button>
                  </td>
                  <td className="p-3">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      disabled={user.role === "admin"}
                      onClick={() => confirmDelete(user._id)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded flex items-center gap-1"
                    >
                      <Trash2 size={16} />
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
