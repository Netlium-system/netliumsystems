"use client";

import { useTransition } from "react";
import { LogOut } from "lucide-react";
import { adminSignOutAction } from "@/lib/actions/signOut";

export function AdminSignOutButton() {
  const [isPending, startTransition] = useTransition();

  function handleSignOut() {
    startTransition(async () => {
      await adminSignOutAction();
    });
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={isPending}
      className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[12px] text-text-muted hover:text-text-secondary hover:bg-[color:var(--color-surface-1)] transition-colors disabled:opacity-50"
    >
      <LogOut className="size-3.5" />
      {isPending ? "Signing out…" : "Sign out"}
    </button>
  );
}
