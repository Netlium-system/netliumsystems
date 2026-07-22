import type { ReactElement } from "react";

export interface NeptliumMarkProps {
  readonly size?: number;
  readonly variant?: "badge" | "glyph";
}

export function NeptliumMark({ size = 22, variant = "badge" }: NeptliumMarkProps): ReactElement {
  if (variant === "glyph") {
    return (
      <svg
        viewBox="0 0 54 46"
        width={size}
        height={(size * 46) / 54}
        role="img"
        aria-label="Neptlium"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polygon points="0,0 36,0 28,17 0,17" fill="#0B8CFF" />
        <circle cx="32" cy="21" r="8" stroke="#0B8CFF" strokeWidth="3" />
        <polygon points="18,29 54,29 54,46 26,46" fill="#0B8CFF" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" aria-hidden>
      <defs>
        <linearGradient id="am-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0B1420" />
          <stop offset="100%" stopColor="#080E16" />
        </linearGradient>
        <linearGradient id="am-border" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.16)" />
          <stop offset="60%" stopColor="rgba(11,140,255,0.18)" />
          <stop offset="100%" stopColor="rgba(8,14,22,0)" />
        </linearGradient>
        <linearGradient id="am-n" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4aaeff" />
          <stop offset="55%" stopColor="#0B8CFF" />
          <stop offset="100%" stopColor="#1769F4" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="7" fill="url(#am-bg)" />
      <rect x="0.5" y="0.5" width="31" height="31" rx="6.5" stroke="url(#am-border)" strokeWidth="1" />
      <path d="M7 7 L7 25 L13 25 L13 17 L19 25 L25 25 L25 7 L19 7 L19 15 L13 7 Z" fill="url(#am-n)" />
    </svg>
  );
}
