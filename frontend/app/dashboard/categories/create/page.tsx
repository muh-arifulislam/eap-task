/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useCreateCategory } from "@/hooks/useCategory";

export default function CreateCategoryPage() {
  const router = useRouter();

  const createCategoryMutation = useCreateCategory();

  const [name, setName] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      await createCategoryMutation.mutateAsync({ name });
      toast.success("Category deleted successfully");
    } catch (err: any) {
      toast.error(err?.message);
    } finally {
      setLoading(false);
      router.push("/dashboard/categories");
    }
  };

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">Create Category</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm">Name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category name"
            required
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Category"}
        </Button>
      </form>
    </div>
  );
}
