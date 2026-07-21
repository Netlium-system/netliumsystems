export default function Loading() {
  return (
    <div className="space-y-6 py-4">
      <div className="h-6 w-48 animate-pulse rounded-md bg-surface-2" />
      <div className="h-4 w-80 animate-pulse rounded-md bg-surface-2" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="h-32 animate-pulse rounded-md bg-surface-2" />
        <div className="h-32 animate-pulse rounded-md bg-surface-2" />
      </div>
    </div>
  );
}
