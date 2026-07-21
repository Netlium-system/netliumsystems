import { Badge } from "@netlium/ui";

function timeOfDayGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
}

export interface PortfolioGreetingProps {
  readonly name: string | null;
  readonly complianceActive: boolean;
}

export function PortfolioGreeting({ name, complianceActive }: PortfolioGreetingProps) {
  return (
    <div className="space-y-4">
      <h1 className="text-[1.35rem] font-semibold leading-tight tracking-tight text-text-primary sm:text-2xl">
        {timeOfDayGreeting()}
        {name ? `, ${name}` : ""}.
      </h1>
      <div className="flex flex-wrap gap-2">
        <Badge tone={complianceActive ? "success" : "warning"}>
          {complianceActive ? "Compliance Active" : "Compliance Pending"}
        </Badge>
      </div>
    </div>
  );
}
