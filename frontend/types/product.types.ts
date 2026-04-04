export interface Product {
  _id: string;
  name: string;
  slug: string;
  rating: string;
  price: number;
  stock: number;
  minStock: number;
  status: "IN_STOCK" | "OUT_OF_STOCK";
  category?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductPayload {
  name: string;
  image?: string;
  rating: string;
  price: number;
  stock: number;
  minStock: number;
  category: string;
}

export interface UpdateProductPayload {
  name: string;
  image?: string;
  rating: string;
  price: number;
  stock: number;
  minStock: number;
  category: string;
}
