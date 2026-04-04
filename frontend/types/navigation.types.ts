// types/navigation.ts
import { LucideIcon } from "lucide-react";

export interface NavSubItem {
  titleKey: string;
  title: string;
  url: string;
  roles?: string[]; // optional: restrict sub-item to roles
}

export interface NavItem {
  titleKey: string;
  title: string;
  icon?: LucideIcon;
  url: string;
  subItems?: NavSubItem[];
  roles?: string[]; // optional: restrict main item to roles
}

export interface NavGroup {
  groupKey: string;
  group: string;
  items: NavItem[];
  roles?: string[];
}
