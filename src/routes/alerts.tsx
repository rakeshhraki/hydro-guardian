import { createFileRoute } from "@tanstack/react-router";
import { AlertBanner } from "@/components/AlertBanner";
import { AlertHistory } from "@/components/AlertHistory";
import { useHydroStore } from "@/lib/store";

export const Route = createFileRoute("/alerts")({
  head: () => ({ meta: [{ title: "Alerts — HydroSense" }, { name: "description", content: "Active alerts: leak detection, over consumption, and unequal distribution events." }] }),
  component: AlertsPage,
});

function AlertsPage() {
  const zones = useHydroStore(s => s.zones);
  const active = zones.filter(z => z.status !== "Normal");
  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 space-y-5">
      <div>
        <h1 className="font-display text-3xl font-bold">Live <span className="text-aqua">Alerts</span></h1>
        <p className="text-sm text-muted-foreground mt-1">{active.length} active alert{active.length !== 1 ? "s" : ""} requiring attention.</p>
      </div>
      <AlertBanner />
      <AlertHistory />
    </div>
  );
}
