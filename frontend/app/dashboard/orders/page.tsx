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
import { Trash2 } from "lucide-react";

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
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [filterStatus, setFilterStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);

    try {
      const token = Cookies.get("access_token");

      const query: string[] = [];

      if (filterStatus) query.push(`status=${filterStatus}`);
      if (startDate) query.push(`startDate=${startDate}`);
      if (endDate) query.push(`endDate=${endDate}`);

      const queryString = query.length ? `?${query.join("&")}` : "";

      const res = await fetch(`${BASE_URL}/orders${queryString}`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message);

      setOrders(result.data || []);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filterStatus, startDate, endDate]);

  const handleDelete = async (id: string) => {
    try {
      const token = Cookies.get("access_token");

      const res = await fetch(`${BASE_URL}/orders/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `${token}`,
        },
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message);

      toast.success("Order deleted");

      setOrders(orders.filter((o) => o._id !== id));

      setModalOpen(false);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const token = Cookies.get("access_token");

      const res = await fetch(`${BASE_URL}/orders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message);

      toast.success("Status updated");

      setOrders(orders.map((o) => (o._id === id ? { ...o, status } : o)));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const totalPages = Math.ceil(orders.length / itemsPerPage);

  const currentItems = orders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">All Orders</h2>

      {/* Filters */}

      <div className="flex gap-4 mb-6 flex-wrap items-end">
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

        <Button onClick={fetchOrders}>Filter</Button>
      </div>

      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <div className="bg-white rounded-xl border shadow-sm overflow-x-auto">
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
              onClick={() => deleteId && handleDelete(deleteId)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
