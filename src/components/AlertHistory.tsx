import { useHydroStore } from "@/lib/store";
import { format } from "date-fns";
import { statusMeta } from "@/lib/status";
import { motion, AnimatePresence } from "framer-motion";

export function AlertHistory({ limit }: { limit?: number }) {
  const alerts = useHydroStore(s => s.alerts);
  const list = limit ? alerts.slice(0, limit) : alerts;
  return (
    <div className="panel overflow-hidden">
      <div className="p-4 border-b border-border flex items-baseline justify-between">
        <h3 className="font-display text-lg font-semibold">Alert History</h3>
        <span className="text-xs text-muted-foreground">{alerts.length} total</span>
      </div>
      <div className="max-h-[400px] overflow-auto">
        <AnimatePresence initial={false}>
          {list.map(a => {
            const m = statusMeta(a.status);
            return (
              <motion.div
                key={a.id}
                layout
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                className="flex items-start gap-3 px-4 py-2.5 border-t border-border first:border-t-0 hover:bg-muted/20"
              >
                <div className="text-[11px] font-mono text-muted-foreground w-16 pt-0.5">
                  {format(new Date(a.time), "HH:mm:ss")}
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${m.bg} ${m.fg}`}>
                  {a.status}
                </span>
                <div className="flex-1 text-xs">
                  <div className="font-medium">{a.zone}</div>
                  <div className="text-muted-foreground">{a.message}</div>
                </div>
                {!a.acknowledged && a.status !== "System" && a.status !== "Valve" && a.status !== "Transfer" && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--over)]/15 text-[var(--over)]">Open</span>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
