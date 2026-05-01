import { createFileRoute } from "@tanstack/react-router";
import { Activity, Bell, History, Map as MapIcon, Sliders } from "lucide-react";
import { useHydroStore } from "@/lib/store";

export const Route = createFileRoute("/mobile")({
  head: () => ({ meta: [{ title: "HydroSense Mobile" }, { name: "description", content: "Mobile water management app preview." }] }),
  component: MobileLayout,
});

function MobileLayout() {
  return (
    <div className="min-h-[calc(100vh-4rem)] grid place-items-center bg-gradient-to-br from-[#0a1628] to-[#0c2340] py-6 px-4">
      <div className="relative w-full max-w-[400px] aspect-[9/19] panel overflow-hidden flex flex-col shadow-2xl">
        <MobileHeader />
        <div className="flex-1 overflow-y-auto">
          <MobileHome />
        </div>
        <MobileTabBar />
      </div>
    </div>
  );
}

function MobileHeader() {
  const sys = useHydroStore(s => s.system);
  return (
    <div className="px-4 pt-4 pb-3 border-b border-border">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">HydroSense</div>
          <div className="font-display font-bold">Operator</div>
        </div>
        <div className="text-[10px] flex items-center gap-1">
          <span className={`h-1.5 w-1.5 rounded-full ${sys.network === "Online" ? "bg-[var(--normal)]" : "bg-[var(--leak)]"}`} />
          {sys.network}
        </div>
      </div>
    </div>
  );
}

function MobileHome() {
  const zones = useHydroStore(s => s.zones);
  const alerts = useHydroStore(s => s.alerts).slice(0, 4);
  const acknowledge = useHydroStore(s => s.acknowledge);
  const setValve = useHydroStore(s => s.setValve);
  const active = zones.filter(z => z.status !== "Normal");

  return (
    <div className="p-3 space-y-3 text-sm">
      <div className="panel p-3">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Network status</div>
        <div className="font-display text-2xl font-bold mt-1">
          {active.length === 0 ? <span className="text-[var(--normal)]">All clear</span> : <span className="text-[var(--over)]">{active.length} active</span>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {zones.map(z => (
          <div key={z.zone} className="panel p-2.5">
            <div className="flex items-center justify-between">
              <span className="font-medium text-xs">{z.zone}</span>
              <span className={`h-1.5 w-1.5 rounded-full ${z.status === "Normal" ? "bg-[var(--normal)]" : z.status === "Leak Detected" ? "bg-[var(--leak)]" : z.status === "Over Consumption" ? "bg-[var(--over)]" : "bg-[var(--unequal)]"}`} />
            </div>
            <div className="text-[10px] text-muted-foreground mt-0.5">{z.current_usage}L · {z.tank_level}%</div>
            <div className="mt-2 h-1 rounded bg-muted/40 overflow-hidden">
              <div className="h-full bg-aqua" style={{ width: `${z.tank_level}%` }} />
            </div>
            <button
              onClick={() => setValve(z.zone, !z.valve_open)}
              className={`mt-2 w-full text-[10px] py-1 rounded ${z.valve_open ? "bg-[var(--normal)]/15 text-[var(--normal)]" : "bg-[var(--leak)]/15 text-[var(--leak)]"}`}>
              {z.valve_open ? "Valve Open" : "Valve Closed"}
            </button>
          </div>
        ))}
      </div>

      <div className="panel p-3">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Recent alerts</div>
        <div className="space-y-1.5">
          {alerts.map(a => (
            <div key={a.id} className="flex items-center gap-2 text-[11px]">
              <span className="font-mono text-muted-foreground">{new Date(a.time).toLocaleTimeString().slice(0,5)}</span>
              <span className="font-medium flex-1 truncate">{a.zone}: {a.status}</span>
              {!a.acknowledged && (
                <button onClick={() => acknowledge(a.id)} className="text-[10px] px-1.5 py-0.5 rounded bg-primary text-primary-foreground">OK</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileTabBar() {
  const tabs = [
    { icon: Activity, label: "Home" },
    { icon: MapIcon, label: "Map" },
    { icon: Bell, label: "Alerts" },
    { icon: History, label: "Log" },
    { icon: Sliders, label: "Ctrl" },
  ];
  return (
    <div className="border-t border-border grid grid-cols-5 bg-surface">
      {tabs.map((t, i) => (
        <button key={t.label} className={`py-2.5 flex flex-col items-center gap-0.5 text-[10px] ${i === 0 ? "text-aqua" : "text-muted-foreground"}`}>
          <t.icon className="h-4 w-4" />
          {t.label}
        </button>
      ))}
    </div>
  );
}
