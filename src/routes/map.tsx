import { createFileRoute } from "@tanstack/react-router";
import { PipelineMapClient } from "@/components/PipelineMapClient";
import { useHydroStore } from "@/lib/store";
import { statusMeta } from "@/lib/status";

export const Route = createFileRoute("/map")({
  head: () => ({ meta: [{ title: "Pipeline Map — HydroSense" }, { name: "description", content: "Satellite view of the pipeline network with live alerts and flow direction." }] }),
  component: MapPage,
});

function MapPage() {
  const zones = useHydroStore(s => s.zones);
  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 space-y-5">
      <div>
        <h1 className="font-display text-3xl font-bold">Pipeline <span className="text-aqua">Network</span></h1>
        <p className="text-sm text-muted-foreground mt-1">Satellite view with live flow direction and alert markers.</p>
      </div>
      <PipelineMapClient height={600} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {zones.map(z => {
          const m = statusMeta(z.status);
          return (
            <div key={z.zone} className="panel p-4">
              <div className="flex items-center justify-between">
                <div className="font-display font-semibold">{z.zone}</div>
                <span className={`h-2 w-2 rounded-full ${m.dot}`} />
              </div>
              <div className="text-xs text-muted-foreground mt-1">{z.status}</div>
              <div className="mt-2 text-xs font-mono">{z.latitude.toFixed(4)}, {z.longitude.toFixed(4)}</div>
            </div>
          );
        })}
      </div>
      <div className="panel p-4">
        <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Legend</div>
        <div className="flex flex-wrap gap-3 text-xs">
          {[["Normal","var(--normal)"],["Leak Detected","var(--leak)"],["Over Consumption","var(--over)"],["Unequal Distribution","var(--unequal)"]].map(([l,c]) => (
            <span key={l} className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: `var(--${c.replace("var(--","").replace(")","")})` }} />{l}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
