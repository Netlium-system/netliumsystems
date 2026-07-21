"use client";

import { useState } from "react";
import { Check, Copy, Eye, EyeOff } from "lucide-react";
import { Badge, Button } from "@netlium/ui";
import type { CustodyAddress } from "@netlium/lib";

function shortenAddress(address: string): string {
  if (address.length <= 18) return address;
  return `${address.slice(0, 10)}...${address.slice(-8)}`;
}

export function DepositAddressCard({ address }: { readonly address: CustodyAddress }) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(address.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <article className="rounded-lg border border-border-default bg-surface-2/45 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-3">
          <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <div>
              <p className="text-xs text-text-muted">Asset</p>
              <p className="font-medium text-text-primary">{address.asset}</p>
            </div>
            <div>
              <p className="text-xs text-text-muted">Network</p>
              <p className="font-medium text-text-primary">{address.network}</p>
            </div>
            <div>
              <p className="text-xs text-text-muted">Status</p>
              <Badge tone={address.status === "active" ? "success" : "neutral"}>{address.status}</Badge>
            </div>
            <div>
              <p className="text-xs text-text-muted">Verification</p>
              <p className="font-medium capitalize text-text-primary">{address.verificationState ?? "unverified"}</p>
            </div>
          </div>

          <div>
            <p className="text-xs text-text-muted">Deposit address</p>
            <p className="mt-1 break-all font-mono text-sm text-text-primary">{revealed ? address.address : shortenAddress(address.address)}</p>
            {address.memo && <p className="mt-1 text-xs text-text-secondary">Memo/tag: <span className="font-mono">{address.memo}</span></p>}
          </div>

          <p className="rounded-md border border-warning/30 bg-warning/10 p-3 text-xs leading-5 text-text-secondary">
            Only send {address.asset} using the {address.network} network to this address. Assets sent using an unsupported network may not be recoverable.
          </p>
        </div>

        <div className="flex shrink-0 gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => setRevealed((current) => !current)}>
            {revealed ? <EyeOff className="size-3.5" aria-hidden="true" /> : <Eye className="size-3.5" aria-hidden="true" />}
            {revealed ? "Hide" : "Reveal"}
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={handleCopy}>
            {copied ? <Check className="size-3.5" aria-hidden="true" /> : <Copy className="size-3.5" aria-hidden="true" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </div>
    </article>
  );
}
