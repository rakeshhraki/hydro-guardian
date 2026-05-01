import { useHydroStore } from "@/lib/store";
import { ArrowRight, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Recommendation() {
  const rec = useHydroStore(s => s.recommendation);
  const confirm = useHydroStore(s => s.confirmTransfer);
  const cancel = useHydroStore(s => s.cancelTransfer);

  return (
    <div className="panel p-5">
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="font-display text-lg font-semibold">Smart Redistribution</h3>
        <span className="text-xs text-muted-foreground">AI recommendation</span>
      </div>
      <AnimatePresence mode="wait">
        {rec ? (
          <motion.div key="rec" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
            <div className="flex items-center justify-center gap-3 sm:gap-5 py-4">
              <div className="text-center">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">From</div>
                <div className="font-display text-xl font-bold">{rec.from}</div>
              </div>
              <div className="flex-1 max-w-[220px] relative">
                <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2"
                  initial={{ left: "0%" }} animate={{ left: "100%" }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
                >
                  <ArrowRight className="h-4 w-4 text-primary -translate-x-1/2" />
                </motion.div>
                <div className="text-center mt-1.5 text-xs text-aqua font-mono">{rec.liters}L</div>
              </div>
              <div className="text-center">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">To</div>
                <div className="font-display text-xl font-bold">{rec.to}</div>
              </div>
            </div>
            <p className="text-sm text-center text-muted-foreground mb-4">
              Transfer <span className="text-foreground font-medium">{rec.liters} liters</span> from {rec.from} to {rec.to} to restore balance.
            </p>
            <div className="flex gap-2 justify-center">
              <button onClick={confirm} className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium text-sm flex items-center gap-1.5 hover:opacity-90">
                <Check className="h-4 w-4" /> Confirm transfer
              </button>
              <button onClick={cancel} className="px-4 py-2 rounded-md glass text-sm flex items-center gap-1.5 hover:bg-muted/40">
                <X className="h-4 w-4" /> Cancel
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-8 text-center text-sm text-muted-foreground">
            No redistribution needed — network is balanced.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
