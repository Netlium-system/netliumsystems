"use client";

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  withWordmark?: boolean;
  size?: number;
}

/**
 * Neptlium logomark — SVG-based, no image file dependency.
 * Matches the brand identity used across apps/app.
 */
export const Logo = ({ className, withWordmark = true, size = 28 }: LogoProps) => (
  <span className={cn("inline-flex items-center gap-2.5", className)}>
    <NeptliumMark size={size} />
    {withWordmark && (
      <span
        className="font-display text-lg font-semibold tracking-tight"
        style={{ color: "var(--color-text-primary, #f7fafc)" }}
      >
        Neptlium
      </span>
    )}
  </span>
);

export const NeptliumMark = ({ size = 28 }: { size?: number }) => (
  <svg
    viewBox="0 0 32 32"
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <defs>
      <linearGradient id="nlm-bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#0B1420" />
        <stop offset="100%" stopColor="#080E16" />
      </linearGradient>
      <linearGradient id="nlm-border-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
        <stop offset="50%" stopColor="rgba(11,140,255,0.22)" />
        <stop offset="100%" stopColor="rgba(8,14,22,0)" />
      </linearGradient>
      <linearGradient id="nlm-n" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#4aaeff" />
        <stop offset="55%" stopColor="#0B8CFF" />
        <stop offset="100%" stopColor="#1769F4" />
      </linearGradient>
    </defs>
    {/* Background square */}
    <rect width="32" height="32" rx="7" fill="url(#nlm-bg)" />
    {/* Gradient border */}
    <rect x="0.5" y="0.5" width="31" height="31" rx="6.5" stroke="url(#nlm-border-grad)" strokeWidth="1" />
    {/* N letterform */}
    <path
      d="M7 7 L7 25 L13 25 L13 17 L19 25 L25 25 L25 7 L19 7 L19 15 L13 7 Z"
      fill="url(#nlm-n)"
    />
  </svg>
);

export default Logo;
