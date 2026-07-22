import { requireAdminUser } from "@/lib/auth";
import { getLoginHistory, getTrustedDevices } from "@/lib/data/security";
import { PageHeader } from "@/components/layout/PageHeader";
import Link from "next/link";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function eventLabel(eventType: string): string {
  return eventType.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function SecurityPage() {
  await requireAdminUser();

  const [loginHistory, devices] = await Promise.all([
    getLoginHistory({ limit: 100 }),
    getTrustedDevices()
  ]);

  return (
    <div>
      <PageHeader
        title="Security"
        description="Platform-wide login activity and trusted devices"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Login history */}
        <div className="rounded-lg border border-border-default bg-surface-card overflow-hidden">
          <div className="border-b border-border-hairline px-5 py-4">
            <h2 className="text-[14px] font-semibold text-text-primary">
              Login History
              <span className="ml-2 text-[12px] font-normal text-text-muted">last 100 events</span>
            </h2>
          </div>
          {loginHistory.length === 0 ? (
            <p className="py-8 text-center text-[13px] text-text-muted">No events recorded.</p>
          ) : (
            <div className="divide-y divide-border-hairline overflow-y-auto max-h-[600px]">
              {loginHistory.map((event) => (
                <div key={event.id} className="px-4 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <Link
                        href={`/dashboard/users/${event.user_id}`}
                        className="text-[12px] text-accent-primary hover:brightness-110 truncate block"
                      >
                        {event.user_email ?? event.user_id.slice(0, 8)}
                      </Link>
                      <p className="text-[12px] font-medium text-text-secondary">
                        {eventLabel(event.event_type)}
                      </p>
                    </div>
                    <p className="text-[11px] text-text-muted shrink-0">
                      {formatDate(event.created_at)}
                    </p>
                  </div>
                  {event.user_agent && (
                    <p className="mt-1 text-[10px] text-text-muted truncate font-mono">
                      {event.user_agent}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Trusted devices */}
        <div className="rounded-lg border border-border-default bg-surface-card overflow-hidden">
          <div className="border-b border-border-hairline px-5 py-4">
            <h2 className="text-[14px] font-semibold text-text-primary">
              Trusted Devices
              <span className="ml-2 text-[12px] font-normal text-text-muted">
                {devices.length} total
              </span>
            </h2>
          </div>
          {devices.length === 0 ? (
            <p className="py-8 text-center text-[13px] text-text-muted">No trusted devices.</p>
          ) : (
            <div className="divide-y divide-border-hairline overflow-y-auto max-h-[600px]">
              {devices.map((device) => (
                <div key={device.id} className="px-4 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <Link
                        href={`/dashboard/users/${device.user_id}`}
                        className="text-[12px] text-accent-primary hover:brightness-110 truncate block"
                      >
                        {device.user_email ?? device.user_id.slice(0, 8)}
                      </Link>
                      <p className="text-[11px] font-mono text-text-muted truncate">
                        {device.device_id}
                      </p>
                    </div>
                    <p className="text-[11px] text-text-muted shrink-0">
                      {formatDate(device.last_seen_at)}
                    </p>
                  </div>
                  {device.user_agent && (
                    <p className="mt-1 text-[10px] text-text-muted truncate">
                      {device.user_agent}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
