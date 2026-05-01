import { useHydroStore } from "@/lib/store";
import { statusMeta } from "@/lib/status";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";

export function ZoneTable() {
  const zones = useHydroStore(s => s.zones);
  return (
    <div className="panel overflow-hidden">
      <div className="p-4 flex items-baseline justify-between border-b border-border">
        <h3 className="font-display text-lg font-semibold">Zone Monitoring</h3>
        <span className="text-xs text-muted-foreground">Refreshes every 5s</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-muted/30">
            <tr>
              <th className="text-left px-4 py-2.5">Zone</th>
              <th className="text-right px-4 py-2.5">Normal</th>
              <th className="text-right px-4 py-2.5">Current</th>
              <th className="text-right px-4 py-2.5">Δ</th>
              <th className="text-left px-4 py-2.5">Status</th>
              <th className="text-left px-4 py-2.5">Valve</th>
              <th className="text-right px-4 py-2.5">Updated</th>
            </tr>
          </thead>
          <tbody>
            {zones.map(z => {
              const m = statusMeta(z.status);
              const delta = z.current_usage - z.normal_usage;
              return (
                <motion.tr key={z.zone} layout className="border-t border-border hover:bg-muted/20">
                  <td className="px-4 py-3 font-medium">{z.zone}</td>
                  <td className="px-4 py-3 text-right font-mono text-muted-foreground">{z.normal_usage}L</td>
                  <td className="px-4 py-3 text-right font-mono">
                    <span className={delta > 100 ? "text-[var(--leak)]" : delta < -100 ? "text-[var(--unequal)]" : ""}>
                      {z.current_usage}L
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-right font-mono text-xs ${delta > 0 ? "text-[var(--over)]" : "text-muted-foreground"}`}>
                    {delta > 0 ? "+" : ""}{delta}L
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium ${m.bg} ${m.fg}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${m.dot}`} />
                      {z.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <span className={z.valve_open ? "text-[var(--normal)]" : "text-[var(--leak)]"}>
                      {z.valve_open ? "● Open" : "○ Closed"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(z.last_update), { addSuffix: true })}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
