import { createFileRoute } from "@tanstack/react-router";
import { AlertHistory } from "@/components/AlertHistory";
import { UsageChart } from "@/components/UsageChart";

export const Route = createFileRoute("/history")({
  head: () => ({ meta: [{ title: "History — HydroSense" }, { name: "description", content: "Historical alert log and water usage trends." }] }),
  component: HistoryPage,
});

function HistoryPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 space-y-5">
      <div>
        <h1 className="font-display text-3xl font-bold">Alert <span className="text-aqua">History</span></h1>
        <p className="text-sm text-muted-foreground mt-1">Complete log of system events and usage trends.</p>
      </div>
      <UsageChart />
      <AlertHistory />
    </div>
  );
}
