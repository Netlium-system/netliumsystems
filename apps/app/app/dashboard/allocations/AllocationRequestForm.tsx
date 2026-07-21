"use client";

import { useActionState, useMemo, useState } from "react";
import { Button, Field, FieldError, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@netlium/ui";
import { requestCapitalAllocationAction, type AllocationRequestResult } from "./actions";

interface Option { readonly id: string; readonly label: string; }
interface BalanceOption { readonly asset: string; readonly network: string; readonly amount: number; }

export function AllocationRequestForm({ wallets, portfolios, balances }: { readonly wallets: readonly Option[]; readonly portfolios: readonly Option[]; readonly balances: readonly BalanceOption[] }) {
  const [state, action, isPending] = useActionState(requestCapitalAllocationAction, null as AllocationRequestResult | null);
  const [selectedBalance, setSelectedBalance] = useState(balances[0] ? `${balances[0].asset}::${balances[0].network}` : "");
  const [amount, setAmount] = useState("");
  const idempotencyKey = useMemo(() => globalThis.crypto.randomUUID(), []);
  const balance = balances.find((item) => `${item.asset}::${item.network}` === selectedBalance);
  const remaining = balance ? balance.amount - (Number(amount) || 0) : 0;
  const [asset, network] = selectedBalance.split("::");

  if (!wallets.length || !portfolios.length || !balances.length) return <p className="text-sm text-text-secondary">A verified wallet, portfolio, and available balance are required before capital can be allocated.</p>;

  return <form action={action} className="grid gap-4 md:grid-cols-2"><input type="hidden" name="asset" value={asset} /><input type="hidden" name="network" value={network} /><input type="hidden" name="idempotencyKey" value={idempotencyKey} /><Field><Label htmlFor="walletId">Funding wallet</Label><select id="walletId" name="walletId" className="h-10 rounded-md border border-border-default bg-surface-2 px-3 text-sm text-text-primary">{wallets.map((wallet) => <option key={wallet.id} value={wallet.id}>{wallet.label}</option>)}</select></Field><Field><Label htmlFor="portfolioId">Destination portfolio</Label><select id="portfolioId" name="portfolioId" className="h-10 rounded-md border border-border-default bg-surface-2 px-3 text-sm text-text-primary">{portfolios.map((portfolio) => <option key={portfolio.id} value={portfolio.id}>{portfolio.label}</option>)}</select></Field><Field><Label htmlFor="assetNetwork">Asset and network</Label><Select value={selectedBalance} onValueChange={setSelectedBalance}><SelectTrigger id="assetNetwork"><SelectValue /></SelectTrigger><SelectContent>{balances.map((item) => <SelectItem key={`${item.asset}::${item.network}`} value={`${item.asset}::${item.network}`}>{item.asset} · {item.network}</SelectItem>)}</SelectContent></Select><p className="text-xs text-text-muted">Available: {balance ? balance.amount.toFixed(2) : "0.00"} {balance?.asset}</p></Field><Field><Label htmlFor="amount">Amount</Label><Input id="amount" name="amount" type="number" min="0" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} /><p className="text-xs text-text-muted">Remaining after request: {Math.max(0, remaining).toFixed(2)} {balance?.asset}</p><FieldError>{state && !state.ok ? state.error : null}</FieldError></Field><div className="md:col-span-2"><p className="mb-3 rounded-md border border-warning/30 bg-warning/10 p-3 text-xs leading-5 text-text-secondary">Allocation requests enter pending review. Capital is not marked executed until the approved business process completes.</p>{state?.ok && <p className="mb-3 text-sm text-accent-primary">Allocation request submitted for review.</p>}<Button type="submit" loading={isPending}>Submit allocation request</Button></div></form>;
}
