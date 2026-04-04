// utils/navigation.ts

import { NavGroup } from "@/types";

export function filterNavByRole(nav: NavGroup[], role: string): NavGroup[] {
  return nav
    .map((group) => {
      // Skip group if group-level roles exist and role is not included
      if (group.roles && !group.roles.includes(role)) return null;

      const items = group.items
        .map((item) => {
          // Skip item if roles exist and role is not included
          if (item.roles && !item.roles.includes(role)) return null;

          // Filter subItems by role
          const subItems = item.subItems?.filter(
            (sub) => !sub.roles || sub.roles.includes(role),
          );

          return { ...item, subItems };
        })
        .filter(Boolean) as typeof group.items;

      if (!items.length) return null;
      return { ...group, items };
    })
    .filter(Boolean) as NavGroup[];
}
