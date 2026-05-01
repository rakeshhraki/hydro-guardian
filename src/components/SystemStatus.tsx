import { useHydroStore } from "@/lib/store";
import { Database, Radio, Wifi, Cpu, Gauge, Activity, Server } from "lucide-react";

export function SystemStatusPanel() {
  const sys = useHydroStore(s => s.system);
  const items = [
    { label: "Database", value: sys.database, icon: Database, ok: sys.database === "Connected" },
    { label: "Sensors", value: sys.sensors, icon: Radio, ok: sys.sensors === "Active" },
    { label: "Network", value: sys.network, icon: Wifi, ok: sys.network === "Online" },
    { label: "Source", value: sys.source, icon: Server, ok: true },
  ];
  const iot = [
    { label: "Flow Sensor", icon: Activity },
    { label: "Pressure", icon: Gauge },
    { label: "Level Sensor", icon: Radio },
    { label: "Solenoid Valve", icon: Cpu },
    { label: "ESP32 MCU", icon: Cpu },
  ];
  return (
    <div className="panel p-5">
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="font-display text-lg font-semibold">System Status</h3>
        <span className="text-xs text-muted-foreground">Live health</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {items.map(it => (
          <div key={it.label} className="glass rounded-md p-3 flex items-center gap-2.5">
            <div className={`h-8 w-8 rounded grid place-items-center ${it.ok ? "bg-[var(--normal)]/15 text-[var(--normal)]" : "bg-[var(--leak)]/15 text-[var(--leak)]"}`}>
              <it.icon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{it.label}</div>
              <div className="text-xs font-medium flex items-center gap-1">
                <span className={`h-1.5 w-1.5 rounded-full ${it.ok ? "bg-[var(--normal)]" : "bg-[var(--leak)]"}`} />
                {it.value}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-3 border-t border-border">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">IoT Devices</div>
        <div className="flex flex-wrap gap-1.5">
          {iot.map(d => (
            <div key={d.label} className="text-[11px] px-2 py-1 rounded glass flex items-center gap-1">
              <d.icon className="h-3 w-3 text-aqua" />
              <span>{d.label}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--normal)] ml-0.5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
