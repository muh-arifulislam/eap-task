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
  useUpdateOrderStatus,
} from "@/hooks/userOrder";

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

  const {
    data: orders = [],
    isLoading,
    error,
    refetch,
    isFetching,
  } = useOrders(queryParams);

  const updateOrderStatusMutation = useUpdateOrderStatus();
  const deleteOrderMutation = useDeleteOrder();

  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [filterStatus, setFilterStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    refetch();
  }, [filterStatus, startDate, endDate]);

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

  const totalPages = Math.ceil(orders.length / itemsPerPage);

  const currentItems = orders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

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

        <Button onClick={() => refetch()} disabled={isLoading || isFetching}>
          Filter
        </Button>
      </div>

      {loading || isFetching ? (
        <p>Loading orders...</p>
      ) : (
        <div className="bg-white rounded-xl border shadow-xs p-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-100">
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
              {currentItems.map((order) => (
                <tr key={order._id} className="border-b">
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
            </tbody>
          </table>

          {/* Pagination */}

          <div className="flex justify-end gap-2 p-4">
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Prev
            </Button>

            {[...Array(totalPages)].map((_, i) => (
              <Button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={
                  currentPage === i + 1 ? "bg-blue-600 text-white" : ""
                }
              >
                {i + 1}
              </Button>
            ))}

            <Button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </Button>
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
