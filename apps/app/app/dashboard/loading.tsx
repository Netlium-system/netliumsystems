import { NeptliumMark } from "../(auth)/components/NeptliumMark";

export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-canvas text-center">
      <NeptliumMark size={36} animated />
      <p className="text-body-sm text-text-muted">Loading your workspace&hellip;</p>
    </div>
  );
}
