"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

interface Product {
  _id: string;
  name: string;
  stock: number;
}

interface Props {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UpdateStockModal({
  open,
  product,
  onClose,
  onSuccess,
}: Props) {
  const [quantity, setQuantity] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!product) return;

    if (!quantity || quantity <= 0) {
      toast.error("Enter valid quantity");
      return;
    }

    try {
      setLoading(true);

      const token = Cookies.get("access_token");

      const res = await fetch(`${BASE_URL}/products/inventory/${product._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token || "",
        },
        body: JSON.stringify({ quantity }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message);

      toast.success("Stock updated successfully");

      onSuccess();
      onClose();
      setQuantity(0);
    } catch (error: any) {
      toast.error(error.message || "Stock update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Restock Product</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Product</p>
            <p className="font-semibold">{product.name}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Current Stock</p>
            <p className="font-semibold">{product.stock}</p>
          </div>

          <Input
            type="number"
            placeholder="Enter quantity to add"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />

          <Button onClick={handleUpdate} className="w-full" disabled={loading}>
            {loading ? "Updating..." : "Update Stock"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
