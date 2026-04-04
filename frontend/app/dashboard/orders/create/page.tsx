/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateOrder } from "@/hooks/userOrder";
import { useRouter } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const orderSchema = z.object({
  customer: z.object({
    name: z.string().min(1, "Name required"),
    email: z.string().optional(),
    mobile: z.string().min(5),
    address: z.string().min(1),
  }),

  items: z.array(
    z.object({
      product: z.string().min(1),
      quantity: z.number().min(1),
    }),
  ),
});

type FormValues = z.infer<typeof orderSchema>;

interface Product {
  _id: string;
  name: string;
  price: number;
  image?: string;
}

export default function CreateOrderPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const createOrderMutation = useCreateOrder();

  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customer: {
        name: "",
        mobile: "",
        address: "",
        email: "",
      },
      items: [{ product: "", quantity: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchItems = watch("items");

  // fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      const token = Cookies.get("access_token");

      const res = await fetch(`${BASE_URL}/products`, {
        headers: {
          Authorization: token || "",
        },
      });

      const data = await res.json();
      setProducts(data.data || []);
    };

    fetchProducts();
  }, []);

  // calculate total price
  useEffect(() => {
    let total = 0;

    watchItems.forEach((item) => {
      const product = products.find((p) => p._id === item.product);
      if (product) {
        total += product.price * item.quantity;
      }
    });

    setTotalPrice(total);
  }, [watchItems, products]);

  const onSubmit = async (data: FormValues) => {
    try {
      const payload = {
        ...data,
        totalPrice,
      };

      const res = await createOrderMutation.mutateAsync(payload);
      toast.success(res?.message ?? "Order created successfully");
      reset();
    } catch (error: any) {
      toast.error(error?.message);
    } finally {
      router.push("/dashboard/orders");
    }
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Create Order</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 p-6 border bg-white shadow-xs rounded-lg"
      >
        {/* CUSTOMER INFO */}

        <div className="grid grid-cols-2 gap-4">
          <Input placeholder="Customer Name" {...register("customer.name")} />

          <Input placeholder="Email" {...register("customer.email")} />

          <Input placeholder="Mobile" {...register("customer.mobile")} />

          <Input placeholder="Address" {...register("customer.address")} />
        </div>

        {/* ORDER ITEMS */}

        <div className="space-y-4">
          <h2 className="font-semibold">Order Items</h2>

          {fields.map((field, index) => {
            const selectedProduct = products.find(
              (p) => p._id === watchItems[index]?.product,
            );

            return (
              <div
                key={field.id}
                className="flex items-center gap-4 border p-4 rounded"
              >
                {/* product select */}

                <Select
                  onValueChange={(value) =>
                    setValue(`items.${index}.product`, value)
                  }
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>

                  <SelectContent>
                    {products
                      .filter(
                        (product) =>
                          !watchItems.some(
                            (item, i) =>
                              item.product === product._id && i !== index,
                          ),
                      )
                      .map((product) => (
                        <SelectItem key={product._id} value={product._id}>
                          {product.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>

                {/* quantity */}

                <Input
                  type="number"
                  min={1}
                  {...register(`items.${index}.quantity`, {
                    valueAsNumber: true,
                  })}
                />

                {/* remove */}

                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => remove(index)}
                >
                  Remove
                </Button>
              </div>
            );
          })}

          <Button
            type="button"
            onClick={() => append({ product: "", quantity: 1 })}
          >
            Add Item
          </Button>
        </div>

        {/* TOTAL */}

        <div className="text-xl font-bold">Total: ${totalPrice}</div>

        <Button type="submit">Create Order</Button>
      </form>
    </div>
  );
}
