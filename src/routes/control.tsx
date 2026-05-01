import { createFileRoute } from "@tanstack/react-router";
import { ControlPanel } from "@/components/ControlPanel";
import { Recommendation } from "@/components/Recommendation";
import { TankLevels } from "@/components/TankLevels";
import { SystemStatusPanel } from "@/components/SystemStatus";

export const Route = createFileRoute("/control")({
  head: () => ({ meta: [{ title: "Control — HydroSense" }, { name: "description", content: "Manual valve control, transfers, acknowledgements, and emergency stop." }] }),
  component: ControlPage,
});

function ControlPage() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 space-y-5">
      <div>
        <h1 className="font-display text-3xl font-bold">Operations <span className="text-aqua">Control</span></h1>
        <p className="text-sm text-muted-foreground mt-1">Direct hardware control. Use with caution.</p>
      </div>
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-7 space-y-5">
          <ControlPanel />
          <Recommendation />
        </div>
        <div className="col-span-12 lg:col-span-5 space-y-5">
          <TankLevels />
          <SystemStatusPanel />
        </div>
      </div>
    </div>
  );
}
