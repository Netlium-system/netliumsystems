export default function Loading() {
  return (
    <div className="space-y-6 py-4">
      <div className="h-6 w-40 animate-pulse rounded-md bg-surface-2" />
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="h-20 animate-pulse rounded-md bg-surface-2" />
        <div className="h-20 animate-pulse rounded-md bg-surface-2" />
        <div className="h-20 animate-pulse rounded-md bg-surface-2" />
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr,380px]">
        <div className="h-64 animate-pulse rounded-md bg-surface-2" />
        <div className="h-64 animate-pulse rounded-md bg-surface-2" />
      </div>
    </div>
  );
}
