import { ShieldCheck, Lock, KeyRound } from "lucide-react";

const items = [
  { icon: Lock, label: "Encrypted" },
  { icon: KeyRound, label: "Verified" },
  { icon: ShieldCheck, label: "Protected" }
] as const;

export function TrustFooter() {
  return (
    <ul className="flex items-center justify-center gap-0 text-[11px] tracking-wide text-text-disabled">
      {items.map(({ icon: Icon, label }, index) => (
        <li key={label} className="flex items-center">
          {index > 0 && (
            <span className="mx-4 select-none text-[color:var(--color-border-default)]" aria-hidden="true">
              |
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Icon className="size-3" aria-hidden="true" />
            {label}
          </span>
        </li>
      ))}
    </ul>
  );
}

