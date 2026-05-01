import { useHydroStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCheck } from "lucide-react";
import { statusMeta } from "@/lib/status";

export function AlertBanner() {
  const zones = useHydroStore(s => s.zones);
  const acknowledgeAll = useHydroStore(s => s.acknowledgeAll);
  const active = zones.filter(z => z.status !== "Normal" && !z.acknowledged);
  if (active.length === 0) return null;

  const worst = active.find(z => z.status === "Leak Detected") ?? active.find(z => z.status === "Over Consumption") ?? active[0];
  const m = statusMeta(worst.status);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className={`panel p-3 flex items-center gap-3 ring-1 ${m.ring}`}
      >
        <span className={`h-2.5 w-2.5 rounded-full ${m.dot} pulse-ring ${m.fg}`} />
        <AlertTriangle className={`h-4 w-4 ${m.fg}`} />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold">
            {active.length} active alert{active.length > 1 ? "s" : ""} — latest: {worst.status} in {worst.zone}
          </div>
          <div className="text-xs text-muted-foreground truncate">
            {active.map(a => `${a.zone}: ${a.status}`).join(" • ")}
          </div>
        </div>
        <button onClick={acknowledgeAll} className="px-3 py-1.5 rounded-md text-xs font-medium bg-primary text-primary-foreground hover:opacity-90 flex items-center gap-1.5">
          <CheckCheck className="h-3.5 w-3.5" /> Acknowledge all
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
