/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { RefreshCcw, Trash2 } from "lucide-react";
import {
  useDeleteOrder,
  useOrders,
  useSearchOrders,
  useUpdateOrderStatus,
} from "@/hooks/userOrder";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import SearchWithSuggestion from "@/components/SearchWithSuggestion";
import { useSearchProducts } from "@/hooks/useProduct";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

interface OrderItem {
  product: { name: string };
  quantity: number;
}

interface Order {
  _id: string;
  customer: {
    name: string;
    email: string | null;
    mobile: string;
    address: string;
  };
  items: OrderItem[];
  totalPrice: number;
  status: string;
  createdAt: string;
}

const statuses = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

/* Order status transition rules */
const statusTransitions: Record<string, string[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};

export default function OrdersPage() {
  const [queryParams, setQueryParams] = useState("");

  const { data, isLoading, error, refetch, isFetching } =
    useOrders(queryParams);

  const orders = data?.data || [];
  const meta = data?.meta;

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const updateOrderStatusMutation = useUpdateOrderStatus();
  const deleteOrderMutation = useDeleteOrder();

  const [loading, setLoading] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleDelete = async (id: string) => {
    const toastId = toast.loading("Order is deleting...");
    try {
      await deleteOrderMutation.mutateAsync(id);
      toast.success("Order has been deleted successfully.", { id: toastId });
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    const toastId = toast.loading("Order status is updating...");
    try {
      await updateOrderStatusMutation.mutateAsync({ id, data: { status } });
      toast.success("Order status updated successfully.", { id: toastId });
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    }
  };

  const [filterOrderId, setFilterOderId] = useState<null | string>(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    params.append("page", currentPage.toString());
    params.append("limit", itemsPerPage.toString());

    if (filterStatus) {
      params.append("status", filterStatus);
    }

    if (startDate) {
      params.append("startDate", startDate);
    }
    if (endDate) {
      params.append("endDate", endDate);
    }
    if (filterOrderId) {
      params.append("orderId", filterOrderId);
    }

    setQueryParams(params.toString());
  }, [currentPage, filterStatus, startDate, endDate, filterOrderId]);

  const handleReset = () => {
    setFilterStatus("");
    setStartDate("");
    setEndDate("");
    setFilterOderId(null);
  };

  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-medium">All Orders</h2>
        <Button
          onClick={() => refetch()}
          disabled={isLoading || isFetching}
          className="flex gap-2"
        >
          <RefreshCcw size={16} className={isFetching ? "animate-spin" : ""} />{" "}
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6 flex-wrap items-end bg-white p-6 rounded-lg shadow-xs border">
        <SearchWithSuggestion
          placeholder="Search Orders..."
          searchFn={useSearchOrders}
          labelKey="orderId"
          idKey="orderId"
          onSelect={(order) => setFilterOderId(order.orderId)}
        />

        <div className="flex flex-col">
          <label className="text-sm mb-1">Status</label>

          <Select
            value={filterStatus || "ALL"}
            onValueChange={(v) => setFilterStatus(v === "ALL" ? "" : v)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>

              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm mb-1">Start Date</label>

          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm mb-1">End Date</label>

          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="space-x-4">
          <Button
            variant={
              filterOrderId || filterStatus || startDate || endDate
                ? "destructive"
                : "secondary"
            }
            onClick={handleReset}
          >
            Reset
          </Button>
        </div>
      </div>

      {loading || isFetching ? (
        <LoadingSkeleton />
      ) : (
        <div className="bg-white rounded-xl border shadow-xs p-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="p-3 text-left">Order ID</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Mobile</th>
                <th className="p-3 text-left">Address</th>
                <th className="p-3 text-left">Items</th>
                <th className="p-3 text-left">Total</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.length &&
                orders.map((order) => (
                  <tr key={order._id} className="border-b">
                    <td className="p-3">#{order.orderId}</td>
                    <td className="p-3">{order.customer.name}</td>

                    <td className="p-3">{order.customer.mobile}</td>

                    <td className="p-3">{order.customer.address}</td>

                    <td className="p-3">
                      {order.items.map((item, i) => (
                        <div key={i}>
                          {item.product?.name} × {item.quantity}
                        </div>
                      ))}
                    </td>

                    <td className="p-3">${order.totalPrice}</td>

                    <td className="p-3">
                      <Select
                        disabled={statusTransitions[order.status].length === 0}
                        value={order.status}
                        onValueChange={(value) =>
                          handleStatusChange(order._id, value)
                        }
                      >
                        <SelectTrigger className="w-[160px]">
                          <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value={order.status}>
                            {order.status}
                          </SelectItem>

                          {statusTransitions[order.status].map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>

                    <td className="p-3">
                      <Button
                        disabled={order.status === "DELIVERED"}
                        className="bg-red-500 hover:bg-red-600 text-white"
                        onClick={() => {
                          setDeleteId(order._id);
                          setModalOpen(true);
                        }}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-3 text-center text-slate-500">
                    No orders found
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

      {/* Delete Modal */}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Order</DialogTitle>
          </DialogHeader>

          <p>Are you sure you want to delete this order?</p>

          <DialogFooter className="mt-4">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={() => {
                if (deleteId) {
                  handleDelete(deleteId);
                  setModalOpen(false);
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
