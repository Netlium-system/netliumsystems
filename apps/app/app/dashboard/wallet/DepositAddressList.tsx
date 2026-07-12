"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Badge, Button } from "@netlium/ui";
import type { CustodyAddress } from "@netlium/lib";

export interface DepositAddressListProps {
  readonly addresses: readonly CustodyAddress[];
}

export function DepositAddressList({ addresses }: DepositAddressListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function handleCopy(address: CustodyAddress) {
    await navigator.clipboard.writeText(address.address);
    setCopiedId(address.id);
    setTimeout(() => setCopiedId((current) => (current === address.id ? null : current)), 2000);
  }

  return (
    <ul className="flex flex-col gap-3">
      {addresses.map((address) => (
        <li
          key={address.id}
          className="flex items-center justify-between rounded-md border border-border-default p-4"
        >
          <div className="flex flex-col gap-1">
            <span className="font-mono text-body text-text-primary">{address.address}</span>
            <span className="text-body-sm text-text-secondary">
              {address.asset} &middot; {address.network}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Badge tone={address.status === "active" ? "success" : "neutral"}>{address.status}</Badge>
            <Button type="button" variant="outline" size="sm" onClick={() => handleCopy(address)}>
              {copiedId === address.id ? (
                <>
                  <Check className="size-3.5" aria-hidden="true" /> Copied
                </>
              ) : (
                <>
                  <Copy className="size-3.5" aria-hidden="true" /> Copy
                </>
              )}
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
