// config/navigation.ts
import { NavGroup } from "@/types";
import {
  LayoutDashboard,
  ShoppingCart,
  Tag,
  Package,
  Boxes,
  Users,
} from "lucide-react";

export const navConfig: NavGroup[] = [
  {
    groupKey: "general",
    group: "General",
    roles: ["admin", "manager"],
    items: [
      {
        titleKey: "dashboard",
        title: "Dashboard",
        icon: LayoutDashboard,
        url: "/dashboard",
        roles: ["admin", "manager"],
      },
    ],
  },
  {
    groupKey: "content_management",
    group: "Content Management",
    roles: ["admin", "manager"],
    items: [
      {
        titleKey: "orders",
        title: "Orders",
        icon: ShoppingCart,
        url: "/dashboard/orders",
        roles: ["admin", "manager"],
        subItems: [
          {
            titleKey: "all_orders",
            title: "All Orders",
            url: "/dashboard/orders",
            roles: ["admin", "manager"],
          },
          {
            titleKey: "create_order",
            title: "Create Order",
            url: "/dashboard/orders/create",
            roles: ["admin", "manager"],
          },
        ],
      },
      {
        titleKey: "categories",
        title: "Categories",
        icon: Tag,
        url: "/dashboard/categories",
        roles: ["admin", "manager"],
        subItems: [
          {
            titleKey: "all_categories",
            title: "All Categories",
            url: "/dashboard/categories",
            roles: ["admin", "manager"],
          },
          {
            titleKey: "create_category",
            title: "Create Category",
            url: "/dashboard/categories/create",
            roles: ["admin", "manager"],
          },
        ],
      },
      {
        titleKey: "products",
        title: "Products",
        icon: Package,
        url: "/dashboard/products",
        roles: ["admin", "manager"],
        subItems: [
          {
            titleKey: "all_products",
            title: "All Products",
            url: "/dashboard/products",
            roles: ["admin", "manager"],
          },
          {
            titleKey: "create_product",
            title: "Create Product",
            url: "/dashboard/products/create",
            roles: ["admin", "manager"],
          },
        ],
      },
      {
        titleKey: "restock_queue",
        title: "Restock Queue",
        icon: Boxes,
        url: "/dashboard/restock-queue",
        roles: ["admin", "manager"],
        subItems: [
          {
            titleKey: "restock_queue",
            title: "Restock Queue",
            url: "/dashboard/restock-queue",
            roles: ["admin", "manager"],
          },
        ],
      },
    ],
  },
  {
    groupKey: "user_management",
    group: "User Management",
    roles: ["admin"],
    items: [
      {
        titleKey: "users",
        title: "Users",
        icon: Users,
        url: "/dashboard/users",
        roles: ["admin"],
        subItems: [
          {
            titleKey: "all_users",
            title: "All Users",
            url: "/dashboard/users",
            roles: ["admin"],
          },
          {
            titleKey: "create_user",
            title: "Create User",
            url: "/dashboard/users/create",
            roles: ["admin"],
          },
        ],
      },
    ],
  },
];
