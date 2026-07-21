import type { ReactNode } from "react";
import { Bell } from "lucide-react";
import { AppShell, Header, MobileNavigation, Sidebar } from "@netlium/ui";
import { dashboardNavItems } from "@/components/navigation/dashboardNav";
import { filterNavByRole } from "@/components/security/filterNavByRole";
import { resolveRole } from "@/components/security/resolveRole";
import { SignOutButton } from "@/components/security/SignOutButton";
import { requireProvisionedUser } from "@/lib/auth";

const MOBILE_PRIMARY_HREFS = ["/dashboard", "/dashboard/portfolio", "/dashboard/wallet", "/dashboard/transactions"];

export default async function DashboardLayout({ children }: { readonly children: ReactNode }) {
  const { user, profile } = await requireProvisionedUser();
  const role = await resolveRole(user.id);
  const navItems = filterNavByRole(dashboardNavItems, role);
  const primaryItems = navItems.filter((item) => MOBILE_PRIMARY_HREFS.includes(item.href));
  const menuItems = navItems.filter((item) => !primaryItems.some((primary) => primary.href === item.href));
  const name = profile.fullName ?? profile.displayName ?? user.email ?? "Account";

  const accountFooter = (
    <div className="space-y-3">
      <div className="min-w-0 px-1">
        <p className="truncate text-sm font-medium text-text-primary">{name}</p>
        <p className="truncate text-xs capitalize text-text-muted">{role}</p>
      </div>
      <SignOutButton />
    </div>
  );

  return (
    <AppShell
      sidebar={<Sidebar items={navItems} footer={accountFooter} />}
      header={
        <Header
          title="Neptlium"
          subtitle="Authenticated capital workspace"
          leading={
            <span className="flex size-8 items-center justify-center rounded-lg border border-border-default bg-surface-2 text-sm font-semibold text-accent-primary lg:hidden">
              N
            </span>
          }
          actions={
            <a
              href="/dashboard/notifications"
              aria-label="Notifications"
              className="flex size-9 items-center justify-center rounded-lg border border-border-default text-text-muted hover:bg-surface-2 hover:text-text-primary focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus-ring)]"
            >
              <Bell className="size-4" />
            </a>
          }
        />
      }
      mobileNavigation={<MobileNavigation primaryItems={primaryItems} menuItems={menuItems} footer={accountFooter} />}
    >
      {children}
    </AppShell>
  );
}
