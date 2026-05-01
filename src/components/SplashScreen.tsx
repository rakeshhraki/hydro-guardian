import { motion } from "framer-motion";
import { Droplets } from "lucide-react";

export function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-gradient-to-br from-[#0a1628] via-[#0c2340] to-[#0a1f3a] overflow-hidden">
      {/* ripple bg */}
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-aqua/30"
          initial={{ width: 80, height: 80, opacity: 0.6 }}
          animate={{ width: 600, height: 600, opacity: 0 }}
          transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.7, ease: "easeOut" }}
        />
      ))}

      <div className="relative flex flex-col items-center text-center px-6">
        <motion.div
          initial={{ scale: 0.4, opacity: 0, rotate: -20 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 14 }}
          className="h-24 w-24 rounded-3xl bg-gradient-to-br from-primary to-accent grid place-items-center shadow-[0_0_60px_rgba(45,138,158,0.6)]"
        >
          <Droplets className="h-12 w-12 text-primary-foreground" />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="font-display text-4xl sm:text-5xl font-bold tracking-tight mt-6 text-white"
        >
          Hydro<span className="text-aqua">Sense</span>
        </motion.h1>

        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.6 }}
          className="text-sm uppercase tracking-[0.3em] text-aqua/80 mt-3"
        >
          Smart Water Intelligence
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-10 h-0.5 w-48 rounded-full bg-white/10 overflow-hidden"
        >
          <motion.div
            className="h-full bg-gradient-to-r from-aqua to-primary"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.4, ease: "easeInOut" }}
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-[11px] text-muted-foreground mt-3"
        >
          Initializing pipeline network…
        </motion.p>
      </div>
    </div>
  );
}
