import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { NavEntry } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface MegaMenuProps {
  entry: NavEntry;
  onNavigate?: () => void;
}

/**
 * Coinbase-style institutional mega menu.
 *
 * Layout:
 *  ┌──────────────────────────────┬──────────────────┐
 *  │  eyebrow + description       │  featured panel  │
 *  │  ─────────────────────────   │  (grid pattern)  │
 *  │  [col 1 items] [col 2 items] │                  │
 *  ├──────────────────────────────┴──────────────────┤
 *  │  footer strip: quick links                      │
 *  └─────────────────────────────────────────────────┘
 */
export const MegaMenu = ({ entry, onNavigate }: MegaMenuProps) => {
  if (!entry.mega) return null;
  const { mega } = entry;

  return (
    <div
      className="overflow-hidden rounded-xl border border-border"
      style={{
        background: "hsl(var(--panel))",
        boxShadow:
          "0 24px 64px -24px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.04) inset",
        backdropFilter: "blur(24px)",
      }}
      role="menu"
    >
      <div className={cn("grid", mega.footer ? "lg:grid-cols-[1fr,280px]" : "lg:grid-cols-1")}>
        {/* ── Left: groups ─────────────────────────── */}
        <div className="p-7 sm:p-8">
          {/* Eyebrow */}
          <div className="mb-5">
            <div
              className="text-[10px] font-bold uppercase tracking-[0.22em]"
              style={{ color: "hsl(var(--primary))" }}
            >
              {mega.title}
            </div>
            <p
              className="mt-0.5 text-[13px] leading-relaxed"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              {mega.description}
            </p>
          </div>

          {/* Item grid */}
          <div className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
            {mega.groups.map((group, gi) => (
              <div key={gi}>
                {group.heading && (
                  <div
                    className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em]"
                    style={{ color: "hsl(var(--muted-foreground)/0.55)" }}
                  >
                    {group.heading}
                  </div>
                )}
                <ul className="space-y-0.5">
                  {group.items.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.to}
                        onClick={onNavigate}
                        role="menuitem"
                        className="group/item flex items-start gap-3.5 rounded-lg p-3 transition-colors duration-150 hover:bg-elevated"
                      >
                        {/* Icon */}
                        <span
                          className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-border transition-colors duration-150 group-hover/item:border-[hsl(var(--primary)/0.3)] group-hover/item:bg-[hsl(var(--primary)/0.08)]"
                          style={{ background: "hsl(var(--elevated))" }}
                        >
                          <item.icon
                            className="h-4 w-4 transition-colors duration-150 group-hover/item:text-[hsl(var(--primary))]"
                            style={{ color: "hsl(var(--muted-foreground))" }}
                          />
                        </span>
                        {/* Text */}
                        <span className="min-w-0 pt-0.5">
                          <span
                            className="block text-[0.9rem] font-medium leading-tight"
                            style={{ color: "hsl(var(--foreground))" }}
                          >
                            {item.label}
                          </span>
                          <span
                            className="mt-1 block text-[0.8125rem] leading-snug"
                            style={{ color: "hsl(var(--muted-foreground))" }}
                          >
                            {item.description}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: featured panel ─────────────────── */}
        {mega.footer && (
          <div
            className="relative flex flex-col border-l border-border p-7 sm:p-8"
            style={{ background: "hsl(var(--elevated))" }}
          >
            {/* Blueprint grid overlay */}
            <div className="ds-grid-pattern absolute inset-0 rounded-r-xl opacity-30" />
            {/* Glow */}
            <div
              className="pointer-events-none absolute -top-10 right-0 h-40 w-40 rounded-full blur-3xl"
              style={{ background: "hsl(var(--primary)/0.10)" }}
            />

            <div className="relative flex h-full flex-col">
              <div
                className="text-[10px] font-bold uppercase tracking-[0.22em]"
                style={{ color: "hsl(var(--muted-foreground)/0.6)" }}
              >
                Featured
              </div>
              <h4
                className="mt-2 text-[1.0625rem] font-semibold leading-snug"
                style={{ color: "hsl(var(--foreground))" }}
              >
                {mega.footer.title}
              </h4>
              <p
                className="mt-2.5 text-[0.8125rem] leading-relaxed"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                {mega.footer.description}
              </p>

              <div className="mt-auto pt-8">
                <Link
                  href={mega.footer.to}
                  onClick={onNavigate}
                  className="group/feat inline-flex items-center gap-2 text-[0.9rem] font-semibold transition-colors duration-150 hover:text-[hsl(var(--primary))]"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  {mega.footer.cta}
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/feat:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom strip: quick links ─────────────── */}
      <div
        className="flex items-center gap-1 border-t border-border px-7 py-3"
        style={{ background: "hsl(var(--background)/0.5)" }}
      >
        <span
          className="text-[11px] font-medium uppercase tracking-widest"
          style={{ color: "hsl(var(--muted-foreground)/0.45)" }}
        >
          Quick links
        </span>
        <div className="mx-3 h-px flex-1" style={{ background: "hsl(var(--border))" }} />
        {mega.groups
          .flatMap((g) => g.items)
          .slice(0, 3)
          .map((item) => (
            <Link
              key={item.label}
              href={item.to}
              onClick={onNavigate}
              className="rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors duration-150 hover:bg-elevated hover:text-[hsl(var(--foreground))]"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              {item.label}
            </Link>
          ))}
      </div>
    </div>
  );
};
