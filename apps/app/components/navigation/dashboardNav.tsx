import {
  ArrowLeftRight,
  Bell,
  Briefcase,
  FileBarChart2,
  FileText,
  Landmark,
  Newspaper,
  Settings as SettingsIcon,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  Wallet
} from "lucide-react";
import type { Role } from "@netlium/lib";
import type { NavItem } from "@netlium/ui";

export interface RoleAwareNavItem extends NavItem {
  readonly minRole: Role;
}

export const dashboardNavItems: readonly RoleAwareNavItem[] = [
  { label: "Dashboard", href: "/dashboard", minRole: "user", group: "Overview", icon: <Briefcase className="size-4" /> },
  { label: "Portfolio", href: "/dashboard/portfolio", minRole: "user", group: "Capital", icon: <Briefcase className="size-4" /> },
  { label: "Allocate Capital", href: "/dashboard/allocations", minRole: "analyst", group: "Capital", icon: <SlidersHorizontal className="size-4" /> },
  { label: "Wallet", href: "/dashboard/wallet", minRole: "user", group: "Capital", icon: <Wallet className="size-4" /> },
  { label: "Transactions", href: "/dashboard/transactions", minRole: "user", group: "Operations", icon: <ArrowLeftRight className="size-4" /> },
  { label: "Treasury", href: "/dashboard/treasury", minRole: "operator", group: "Operations", icon: <Landmark className="size-4" /> },
  { label: "Risk", href: "/dashboard/risk", minRole: "manager", group: "Operations", icon: <ShieldAlert className="size-4" /> },
  { label: "Documents", href: "/dashboard/documents", minRole: "user", group: "Records", icon: <FileText className="size-4" /> },
  { label: "Reports", href: "/dashboard/reports", minRole: "analyst", group: "Records", icon: <FileBarChart2 className="size-4" /> },
  { label: "Research", href: "/dashboard/research", minRole: "user", group: "Records", icon: <Newspaper className="size-4" /> },
  { label: "Notifications", href: "/dashboard/notifications", minRole: "user", group: "Account", icon: <Bell className="size-4" /> },
  { label: "Settings", href: "/dashboard/settings", minRole: "user", group: "Account", icon: <SettingsIcon className="size-4" /> },
  { label: "Administration", href: "/dashboard/administration", minRole: "admin", group: "Admin", icon: <ShieldCheck className="size-4" /> }
];
