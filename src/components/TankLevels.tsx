import { useHydroStore } from "@/lib/store";
import { Droplets } from "lucide-react";
import { motion } from "framer-motion";

export function TankLevels() {
  const zones = useHydroStore(s => s.zones);
  const avg = Math.round(zones.reduce((a, z) => a + z.tank_level, 0) / Math.max(1, zones.length));

  return (
    <div className="panel p-5">
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="font-display text-lg font-semibold">Tank Levels</h3>
        <span className="text-xs text-muted-foreground">Avg <span className="text-aqua font-mono">{avg}%</span></span>
      </div>
      <div className="space-y-3">
        {zones.map(z => {
          const color = z.tank_level < 30 ? "var(--leak)" : z.tank_level < 55 ? "var(--over)" : "var(--aqua)";
          return (
            <div key={z.zone}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5"><Droplets className="h-3 w-3 text-aqua" />{z.zone}</span>
                <span className="font-mono">{z.tank_level}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-muted/40 overflow-hidden relative">
                <motion.div
                  initial={false}
                  animate={{ width: `${z.tank_level}%` }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  className="h-full rounded-full relative"
                  style={{ background: `linear-gradient(90deg, ${color}, color-mix(in oklab, ${color} 60%, white))` }}
                >
                  <div className="absolute inset-0 opacity-40" style={{
                    background: "repeating-linear-gradient(45deg, transparent, transparent 6px, rgba(255,255,255,0.15) 6px, rgba(255,255,255,0.15) 12px)"
                  }} />
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
