import { useHydroStore } from "@/lib/store";
import { ArrowRightLeft, Power, Lock, Unlock, BellOff, AlertOctagon, Play, Pause, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function ControlPanel() {
  const zones = useHydroStore(s => s.zones);
  const setValve = useHydroStore(s => s.setValve);
  const acknowledgeAll = useHydroStore(s => s.acknowledgeAll);
  const emergencyStop = useHydroStore(s => s.emergencyStop);
  const confirmTransfer = useHydroStore(s => s.confirmTransfer);
  const recommendation = useHydroStore(s => s.recommendation);
  const sim = useHydroStore(s => s.system.simulation);
  const toggleSim = useHydroStore(s => s.toggleSimulation);
  const triggerEvent = useHydroStore(s => s.triggerEvent);
  const [selected, setSelected] = useState(zones[0]?.zone ?? "Zone A");
  const z = zones.find(zo => zo.zone === selected) ?? zones[0];

  return (
    <div className="panel p-5 space-y-4">
      <div className="flex items-baseline justify-between">
        <h3 className="font-display text-lg font-semibold">Control Panel</h3>
        <span className="text-xs text-muted-foreground">Manual operations</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {zones.map(zo => (
          <button key={zo.zone}
            onClick={() => setSelected(zo.zone)}
            className={`px-3 py-1.5 text-xs rounded-md border ${selected === zo.zone ? "bg-primary text-primary-foreground border-primary" : "border-border glass"}`}>
            {zo.zone}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        <button
          onClick={() => { confirmTransfer(); toast.success(recommendation ? "Transfer initiated" : "No transfer pending"); }}
          className="px-3 py-3 rounded-md bg-primary/15 hover:bg-primary/25 text-primary text-sm font-medium flex flex-col items-center gap-1">
          <ArrowRightLeft className="h-4 w-4" /> Transfer Water
        </button>
        <button
          onClick={() => { setValve(z.zone, true); toast.success(`Opened valve at ${z.zone}`); }}
          className="px-3 py-3 rounded-md bg-[var(--normal)]/15 hover:bg-[var(--normal)]/25 text-[var(--normal)] text-sm font-medium flex flex-col items-center gap-1">
          <Unlock className="h-4 w-4" /> Open Valve
        </button>
        <button
          onClick={() => { setValve(z.zone, false); toast.success(`Closed valve at ${z.zone}`); }}
          className="px-3 py-3 rounded-md bg-[var(--over)]/15 hover:bg-[var(--over)]/25 text-[var(--over)] text-sm font-medium flex flex-col items-center gap-1">
          <Lock className="h-4 w-4" /> Close Valve
        </button>
        <button
          onClick={() => { acknowledgeAll(); toast.success("All alerts acknowledged"); }}
          className="px-3 py-3 rounded-md glass hover:bg-muted/40 text-sm font-medium flex flex-col items-center gap-1">
          <BellOff className="h-4 w-4" /> Acknowledge
        </button>
        <button
          onClick={() => { emergencyStop(); toast.error("EMERGENCY STOP triggered"); }}
          className="px-3 py-3 rounded-md bg-[var(--leak)]/20 hover:bg-[var(--leak)]/30 text-[var(--leak)] text-sm font-bold flex flex-col items-center gap-1">
          <AlertOctagon className="h-4 w-4" /> Emergency Stop
        </button>
        <button
          onClick={() => { toggleSim(); toast(sim ? "Simulation stopped" : "Simulation started"); }}
          className="px-3 py-3 rounded-md glass hover:bg-muted/40 text-sm font-medium flex flex-col items-center gap-1">
          {sim ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {sim ? "Stop Sim" : "Start Sim"}
        </button>
      </div>

      <div className="border-t border-border pt-3">
        <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5"><Zap className="h-3 w-3" /> Inject scenario for {z.zone}</div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => triggerEvent("Leak Detected", z.zone)} className="text-xs px-2.5 py-1.5 rounded bg-[var(--leak)]/15 text-[var(--leak)] hover:bg-[var(--leak)]/25">Leak</button>
          <button onClick={() => triggerEvent("Over Consumption", z.zone)} className="text-xs px-2.5 py-1.5 rounded bg-[var(--over)]/15 text-[var(--over)] hover:bg-[var(--over)]/25">Over Consumption</button>
          <button onClick={() => triggerEvent("Unequal Distribution", z.zone)} className="text-xs px-2.5 py-1.5 rounded bg-[var(--unequal)]/15 text-[var(--unequal)] hover:bg-[var(--unequal)]/25">Unequal</button>
        </div>
      </div>
    </div>
  );
}

export function SimulationToggle() {
  const sim = useHydroStore(s => s.system.simulation);
  const toggle = useHydroStore(s => s.toggleSimulation);
  return (
    <button onClick={toggle} className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${sim ? "bg-primary text-primary-foreground" : "glass"}`}>
      {sim ? <><Pause className="h-3.5 w-3.5" /> Stop Simulation</> : <><Play className="h-3.5 w-3.5" /> Start Simulation</>}
      <Power className="h-3.5 w-3.5 opacity-60" />
    </button>
  );
}
