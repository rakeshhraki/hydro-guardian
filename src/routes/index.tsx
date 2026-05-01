import { createFileRoute } from "@tanstack/react-router";
import { AlertBanner } from "@/components/AlertBanner";
import { ZoneTable } from "@/components/ZoneTable";
import { PipelineMapClient } from "@/components/PipelineMapClient";
import { Recommendation } from "@/components/Recommendation";
import { ControlPanel, SimulationToggle } from "@/components/ControlPanel";
import { UsageChart } from "@/components/UsageChart";
import { AlertHistory } from "@/components/AlertHistory";
import { TankLevels } from "@/components/TankLevels";
import { SystemStatusPanel } from "@/components/SystemStatus";
import { useHydroStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HydroSense — Operations Dashboard" },
      { name: "description", content: "Live water network monitoring with leakage detection, redistribution, and pipeline control." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const zones = useHydroStore(s => s.zones);
  const active = zones.filter(z => z.status !== "Normal").length;
  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 space-y-5">
      {/* Hero strip */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
            Water <span className="text-aqua">Operations</span> Center
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitoring {zones.length} zones · {active === 0 ? "All systems nominal" : `${active} zone${active > 1 ? "s" : ""} need attention`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <SimulationToggle />
        </div>
      </div>

      <AlertBanner />

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPI label="Total Flow" value={`${zones.reduce((a, z) => a + z.current_usage, 0)}L`} sub="current minute" />
        <KPI label="Active Alerts" value={String(active)} sub={active === 0 ? "all clear" : "needs review"} />
        <KPI label="Avg Tank Level" value={`${Math.round(zones.reduce((a, z) => a + z.tank_level, 0) / zones.length)}%`} sub="across network" />
        <KPI label="Valves Open" value={`${zones.filter(z => z.valve_open).length}/${zones.length}`} sub="distribution" />
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-8 space-y-5">
          <ZoneTable />
          <PipelineMapClient height={460} />
          <UsageChart />
        </div>
        <div className="col-span-12 lg:col-span-4 space-y-5">
          <Recommendation />
          <TankLevels />
          <ControlPanel />
          <SystemStatusPanel />
          <AlertHistory limit={8} />
        </div>
      </div>
    </div>
  );
}

function KPI({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="panel p-4">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="font-display text-2xl font-bold mt-1">{value}</div>
      <div className="text-[11px] text-muted-foreground mt-0.5">{sub}</div>
    </div>
  );
}
