"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { CTAButton } from "@/components/ui/CTAButton";
import { Logo } from "@/components/ui/Logo";
import { MegaMenu } from "@/components/nav/MegaMenu";
import { MobileAccordionNav } from "@/components/nav/MobileAccordionNav";
import { APP_URLS, NAV_ENTRIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const pathname = usePathname();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!openMenu) return;
    const handler = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [openMenu]);

  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpenMenu(null); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 220);
  };
  const cancelClose = () => {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
  };

  const activeEntry = NAV_ENTRIES.find((e) => e.label === openMenu);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 border-b border-border"
      style={{
        background: "hsl(var(--background)/0.94)",
        backdropFilter: "blur(20px) saturate(1.4)",
        WebkitBackdropFilter: "blur(20px) saturate(1.4)",
        boxShadow: "0 1px 0 rgba(255,255,255,0.04) inset, 0 8px 24px -12px rgba(0,0,0,0.8)",
      }}
    >
      <div className="container-wide flex h-[68px] items-center justify-between gap-6">
        {/* Wordmark */}
        <Link href="/" aria-label="Neptlium home" className="flex-shrink-0">
          <Logo size={30} />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 lg:flex" onMouseLeave={scheduleClose}>
          {NAV_ENTRIES.map((entry) => {
            const hasMega = Boolean(entry.mega);
            const isOpen = openMenu === entry.label;
            const isActive =
              pathname === entry.to || (entry.to !== "/" && pathname.startsWith(entry.to));

            if (!hasMega) {
              return (
                <Link
                  key={entry.to}
                  href={entry.to}
                  onMouseEnter={() => { cancelClose(); setOpenMenu(null); }}
                  className={cn(
                    "relative rounded-md px-3.5 py-2 text-[0.9375rem] font-medium tracking-tight transition-colors duration-150",
                    "after:absolute after:inset-x-3.5 after:-bottom-px after:h-px after:origin-left after:scale-x-0 after:transition-transform after:duration-200",
                    "hover:after:scale-x-100",
                    isActive
                      ? "text-[hsl(var(--primary))] after:scale-x-100 after:bg-[hsl(var(--primary))]"
                      : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] after:bg-[hsl(var(--primary))]"
                  )}
                >
                  {entry.label}
                </Link>
              );
            }

            return (
              <div
                key={entry.label}
                className="relative"
                onMouseEnter={() => { cancelClose(); setOpenMenu(entry.label); }}
              >
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={isOpen}
                  onClick={() => setOpenMenu(isOpen ? null : entry.label)}
                  onFocus={() => { cancelClose(); setOpenMenu(entry.label); }}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-md px-3.5 py-2 text-[0.9375rem] font-medium tracking-tight transition-colors duration-150",
                    isOpen || isActive
                      ? "text-[hsl(var(--primary))]"
                      : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                  )}
                >
                  {entry.label}
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 opacity-60 transition-transform duration-200",
                      isOpen && "rotate-180 opacity-100"
                    )}
                  />
                </button>
              </div>
            );
          })}
        </nav>

        {/* Desktop auth CTAs */}
        <div className="hidden items-center gap-2.5 lg:flex">
          <CTAButton href={APP_URLS.signIn} variant="ghost" size="sm">
            Sign in
          </CTAButton>
          <CTAButton href={APP_URLS.signUp} variant="primary" size="sm">
            Sign up
          </CTAButton>
        </div>

        {/* Mobile toggle */}
        <button
          aria-label="Toggle navigation"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-border text-foreground lg:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Desktop mega menu panel */}
      {activeEntry?.mega && (
        <div
          className="absolute inset-x-0 top-full z-40 hidden lg:block"
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          <div className="h-2 w-full" />
          <div className="container-wide">
            <div key={activeEntry.label} className="animate-fade-up [animation-duration:160ms]">
              <MegaMenu entry={activeEntry} onNavigate={() => setOpenMenu(null)} />
            </div>
          </div>
        </div>
      )}

      {/* Mobile slide-over drawer */}
      <div
        className={cn(
          "fixed inset-0 z-[60] lg:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!mobileOpen}
      >
        <div
          onClick={() => setMobileOpen(false)}
          className={cn(
            "absolute inset-0 transition-opacity duration-300",
            mobileOpen ? "opacity-100" : "opacity-0"
          )}
          style={{ background: "hsl(var(--background)/0.7)", backdropFilter: "blur(8px)" }}
        />
        <div
          className={cn(
            "absolute right-0 top-0 h-[100dvh] w-[88%] max-w-sm transform transition-transform duration-300 ease-out",
            mobileOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <MobileAccordionNav
            onNavigate={() => setMobileOpen(false)}
            onClose={() => setMobileOpen(false)}
          />
        </div>
      </div>
    </header>
  );
};
