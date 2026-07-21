import { requireRole } from "@/lib/auth";
import { TreasuryView } from "./TreasuryView";

export default async function TreasuryPage() {
  await requireRole("operator");
  return <TreasuryView />;
}
