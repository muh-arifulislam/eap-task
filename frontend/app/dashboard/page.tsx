/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import DashboardSkeleton from "@/components/skeleton/DashboardSkeleton";
import { useDashboard } from "@/hooks/useDashboard";

export default function DashboardPage() {
  const { data, isLoading } = useDashboard();

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Orders Today</p>
          <p className="text-2xl font-bold">{data.totalOrdersToday}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Pending Orders</p>
          <p className="text-2xl font-bold text-yellow-600">
            {data.pendingOrders}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Completed Orders</p>
          <p className="text-2xl font-bold text-green-600">
            {data.completedOrders}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Revenue Today</p>
          <p className="text-2xl font-bold text-blue-600">
            ${data.revenueToday}
          </p>
        </div>
      </div>

      {/* Low Stock Count */}
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-sm text-gray-500">Low Stock Items</p>
        <p className="text-2xl font-bold text-red-600">{data.lowStockItems}</p>
      </div>

      {/* Product Summary */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Product Summary</h2>

        <div className="space-y-3">
          {data.productSummary.map((product: any, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between border-b pb-2"
            >
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-gray-500">
                  {product.stock} available
                </p>
              </div>

              <span
                className={`text-xs px-2 py-1 rounded ${
                  product.status === "Low Stock"
                    ? "bg-red-100 text-red-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {product.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
