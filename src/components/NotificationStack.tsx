import { useHydroStore } from "@/lib/store";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { statusMeta } from "@/lib/status";

export function NotificationStack() {
  const notifications = useHydroStore(s => s.notifications);
  const dismiss = useHydroStore(s => s.dismissNotification);
  const acknowledge = useHydroStore(s => s.acknowledge);

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[min(360px,calc(100vw-2rem))] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {notifications.map(n => {
          const m = statusMeta(n.status);
          return (
            <motion.div
              key={n.id}
              layout
              initial={{ opacity: 0, x: 80, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className={`pointer-events-auto panel p-3 flex gap-3 ring-1 ${m.ring}`}
            >
              <div className={`h-9 w-9 shrink-0 rounded-lg grid place-items-center ${m.bg}`}>
                <AlertTriangle className={`h-4 w-4 ${m.fg}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate">{n.status}</div>
                <div className="text-xs text-muted-foreground line-clamp-2">{n.message}</div>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => acknowledge(n.id)}
                    className="text-xs px-2 py-1 rounded bg-primary text-primary-foreground hover:opacity-90"
                  >Acknowledge</button>
                  <button
                    onClick={() => dismiss(n.id)}
                    className="text-xs px-2 py-1 rounded glass hover:bg-muted/40"
                  >Dismiss</button>
                </div>
              </div>
              <button onClick={() => dismiss(n.id)} className="h-6 w-6 grid place-items-center rounded hover:bg-muted/40 self-start">
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
