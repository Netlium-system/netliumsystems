"use client";

import { useActionState, useState } from "react";
import {
  Button,
  Field,
  FieldError,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@netlium/ui";
import { requestWithdrawalAction, type WithdrawalResult } from "./actions";
import type { AssetNetworkPair } from "./GenerateAddressButton";

export interface WithdrawalFormProps {
  readonly pairs: readonly AssetNetworkPair[];
}

const initialState: WithdrawalResult | null = null;

export function WithdrawalForm({ pairs }: WithdrawalFormProps) {
  const [state, formAction, isPending] = useActionState(requestWithdrawalAction, initialState);
  const [selectedKey, setSelectedKey] = useState(pairs[0] ? `${pairs[0].assetCode}::${pairs[0].networkCode}` : "");

  if (pairs.length === 0) {
    return <p className="text-body-sm text-text-secondary">No supported assets are configured yet.</p>;
  }

  const [selectedAsset, selectedNetwork] = selectedKey.split("::");

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="asset" value={selectedAsset} />
      <input type="hidden" name="network" value={selectedNetwork} />

      <Field>
        <Label htmlFor="withdrawal-asset">Asset and network</Label>
        <Select value={selectedKey} onValueChange={setSelectedKey}>
          <SelectTrigger id="withdrawal-asset">
            <SelectValue placeholder="Select asset and network" />
          </SelectTrigger>
          <SelectContent>
            {pairs.map((pair) => (
              <SelectItem key={`${pair.assetCode}::${pair.networkCode}`} value={`${pair.assetCode}::${pair.networkCode}`}>
                {pair.assetLabel} &middot; {pair.networkLabel}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field>
        <Label htmlFor="withdrawal-amount">Amount</Label>
        <Input id="withdrawal-amount" name="amount" type="number" min="0" step="0.01" placeholder="0.00" />
      </Field>

      <Field>
        <Label htmlFor="withdrawal-destination">Destination</Label>
        <Input id="withdrawal-destination" name="destination" placeholder="Receiving account reference" />
        <FieldError>{state && !state.ok ? state.error : null}</FieldError>
      </Field>

      {state?.ok && <p className="text-body-sm text-accent-emerald">Withdrawal request submitted.</p>}

      <Button type="submit" variant="accent" size="sm" className="w-fit" loading={isPending}>
        Request withdrawal
      </Button>
    </form>
  );
}
