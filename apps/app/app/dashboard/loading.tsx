export default function DashboardLoading() {
  return (
    <div className="space-y-5 sm:space-y-6" aria-label="Loading dashboard">
      <div className="space-y-2">
        <div className="h-3 w-32 rounded-full bg-surface-3" />
        <div className="h-7 w-56 rounded-md bg-surface-2" />
        <div className="h-4 w-full max-w-lg rounded-md bg-surface-2" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-28 rounded-lg border border-border-default bg-surface-1 p-4">
            <div className="h-3 w-24 rounded-full bg-surface-3" />
            <div className="mt-4 h-7 w-32 rounded-md bg-surface-2" />
            <div className="mt-3 h-3 w-20 rounded-full bg-surface-3" />
          </div>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-12">
        <div className="h-64 rounded-lg border border-border-default bg-surface-1 xl:col-span-7" />
        <div className="h-64 rounded-lg border border-border-default bg-surface-1 xl:col-span-5" />
        <div className="h-56 rounded-lg border border-border-default bg-surface-1 xl:col-span-5" />
        <div className="h-56 rounded-lg border border-border-default bg-surface-1 xl:col-span-4" />
        <div className="h-56 rounded-lg border border-border-default bg-surface-1 xl:col-span-3" />
      </div>
    </div>
  );
}
