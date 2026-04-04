"use client";

import Cookies from "js-cookie";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ChevronRight, LucideIcon } from "lucide-react";

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
import { filterNavByRole } from "@/utils/navigation";
import { navConfig } from "@/config/navigation";

export function AppSidebar() {
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const role = Cookies.get("role");

  const navItems = React.useMemo(
    () => filterNavByRole(navConfig, role as string),
    [role],
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
        {navItems
          .filter((group) => {
            if (group.groupKey === "user_management" && role !== "admin") {
              return false;
            }
            return true;
          })
          .map((group) => (
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
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.url}
                      >
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
