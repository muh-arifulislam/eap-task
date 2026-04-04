"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RefreshCcw, AlertTriangle } from "lucide-react";
import UpdateStockModal from "./UpdateStockModal";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

interface Product {
  _id: string;
  name: string;
  image?: string;
  stock: number;
  minStock: number;
}

interface RestockItem {
  _id: string;
  product: Product;
  priority: "HIGH" | "MEDIUM" | "LOW";
}

const priorityOrder = {
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
};

export default function RestockQueuePage() {
  const [queues, setQueues] = useState<RestockItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchQueues = async () => {
    setLoading(true);

    try {
      const token = Cookies.get("access_token");

      const res = await fetch(`${BASE_URL}/restock-queue`, {
        headers: {
          Authorization: token || "",
        },
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message);

      const sorted = result.data.sort(
        (a: RestockItem, b: RestockItem) =>
          priorityOrder[a.priority] - priorityOrder[b.priority],
      );

      setQueues(sorted);
    } catch (error: any) {
      toast.error(error.message || "Failed to load restock queue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueues();

    const interval = setInterval(fetchQueues, 60000);
    return () => clearInterval(interval);
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-700 border-red-200";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "LOW":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "";
    }
  };

  const openRestockModal = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-medium">Restock Queue</h1>

        <Button onClick={fetchQueues} className="flex gap-2">
          <RefreshCcw size={16} />
          Refresh
        </Button>
      </div>

      {loading ? (
        <p>Loading restock queue...</p>
      ) : queues.length === 0 ? (
        <div className="text-center py-24 text-gray-500">
          No restock alerts 🎉
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {queues.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl border p-6 shadow-sm hover:shadow-md transition"
            >
              {/* Priority Badge */}

              <div
                className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border mb-4 ${getPriorityColor(
                  item.priority,
                )}`}
              >
                {item.priority} PRIORITY
              </div>

              {/* Product Info */}

              <div className="flex gap-4 items-center">
                <div>
                  <h3 className="font-semibold text-lg">
                    {item.product?.name}
                  </h3>

                  <p className="text-xs text-gray-500">
                    Product ID: {item.product?._id}
                  </p>
                </div>
              </div>

              {/* Stock Section */}

              <div className="mt-5 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Current Stock</span>
                  <span className="font-semibold text-red-600">
                    {item.product?.stock}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Minimum Stock</span>
                  <span className="font-semibold">
                    {item.product?.minStock}
                  </span>
                </div>
              </div>

              {/* Warning */}

              <div className="flex items-center gap-2 mt-5 text-red-600 text-sm font-medium">
                <AlertTriangle size={16} />
                Needs restocking
              </div>

              {/* Restock Button */}

              <Button
                className="mt-5 w-full"
                onClick={() => openRestockModal(item.product)}
              >
                Restock Product
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Restock Modal */}

      {selectedProduct && (
        <UpdateStockModal
          open={modalOpen}
          product={selectedProduct}
          onClose={() => setModalOpen(false)}
          onSuccess={fetchQueues}
        />
      )}
    </div>
  );
}
