"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Layers,
  Tag,
  FileText,
  MessageSquare,
  BookOpen,
  Settings,
  ChevronRight,
  LucideIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// --- TypeScript Interfaces ---
interface SubItem {
  titleKey: string;
  title: string;
  url: string;
}

interface NavItem {
  titleKey: string;
  title: string;
  icon: LucideIcon;
  url: string;
  subItems?: SubItem[];
}

interface NavGroup {
  groupKey: string;
  group: string;
  items: NavItem[];
}

export function AppSidebar() {
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const navItems: NavGroup[] = React.useMemo(
    () => [
      {
        groupKey: "general",
        group: "General",
        items: [
          {
            titleKey: "dashboard",
            title: "Dashboard",
            icon: LayoutDashboard,
            url: "/dashboard",
          },
        ],
      },
      {
        groupKey: "content_management",
        group: "Content Management",
        items: [
          {
            titleKey: "orders",
            title: "Orders",
            icon: FileText,
            url: "/dashboard/orders",
            subItems: [
              {
                titleKey: "all_orders",
                title: "All Orders",
                url: "/dashboard/orders",
              },
              {
                titleKey: "create_order",
                title: "Create Order",
                url: "/dashboard/orders/create",
              },
            ],
          },
          {
            titleKey: "categories",
            title: "Categories",
            icon: FileText,
            url: "/dashboard/posts",
            subItems: [
              {
                titleKey: "all_categories",
                title: "All Categories",
                url: "/dashboard/categories",
              },
              {
                titleKey: "create_category",
                title: "Create Category",
                url: "/dashboard/categories/create",
              },
            ],
          },
          {
            titleKey: "products",
            title: "Products",
            icon: FileText,
            url: "/dashboard/products",
            subItems: [
              {
                titleKey: "all_products",
                title: "All Products",
                url: "/dashboard/products",
              },
              {
                titleKey: "create_product",
                title: "Create Product",
                url: "/dashboard/products/create",
              },
            ],
          },
          {
            titleKey: "restock_queue",
            title: "Restock Queue",
            icon: FileText,
            url: "/dashboard/restock-queue",
            subItems: [
              {
                titleKey: "restock_queue",
                title: "Restock Queue",
                url: "/dashboard/restock-queue",
              },
            ],
          },
        ],
      },
      {
        groupKey: "user_management",
        group: "User Management",
        items: [
          {
            titleKey: "users",
            title: "Users",
            icon: FileText,
            url: "/dashboard/users",
            subItems: [
              {
                titleKey: "all_users",
                title: "All Users",
                url: "/dashboard/users",
              },
              {
                titleKey: "create_user",
                title: "Create User",
                url: "/dashboard/users/create",
              },
            ],
          },
        ],
      },
    ],
    [],
  );

  if (!mounted) return null;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-16 flex items-center border-b px-2 group-data-[collapsible=icon]:px-0">
        <Link
          href="/dashboard"
          className="flex items-center justify-center w-full gap-3 px-4 group-data-[collapsible=icon]:px-0"
        >
          <div className="hidden group-data-[collapsible=icon]:flex size-8 items-center justify-center rounded-lg bg-PrimaryColor text-white font-bold shrink-0">
            E
          </div>
          <div className="flex items-center group-data-[collapsible=icon]:hidden w-full h-10 relative">
            <span className="font-bold text-xl uppercase tracking-tight">
              EAP-3.00
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {navItems.map((group) => (
          <SidebarGroup key={group.groupKey}>
            <SidebarGroupLabel className="px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
              {group.group}
            </SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => {
                const hasSubs = !!item?.subItems?.length;
                const isActive = pathname.startsWith(item.url);

                if (hasSubs) {
                  return (
                    <Collapsible
                      key={item.titleKey}
                      asChild
                      defaultOpen={isActive}
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            className="data-[active=true]:text-PrimaryColor data-[active=true]:font-semibold"
                            isActive={isActive}
                          >
                            {item.icon && <item.icon className="size-4" />}
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.subItems!.map((sub) => (
                              <SidebarMenuSubItem key={sub.titleKey}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={pathname === sub.url}
                                >
                                  <Link href={sub.url}>
                                    <span>{sub.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                return (
                  <SidebarMenuItem key={item.titleKey}>
                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                      <Link href={item.url}>
                        {item.icon && <item.icon className="size-4" />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
