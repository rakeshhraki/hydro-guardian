import { motion } from "framer-motion";
import logo from "@/assets/hydrosen-logo.jpeg";

export function LogoIntro() {
  return (
    <div className="fixed inset-0 z-[110] grid place-items-center bg-[#06101f] overflow-hidden">
      {/* animated waves */}
      {[0, 1, 2, 3].map(i => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-aqua/25"
          initial={{ width: 60, height: 60, opacity: 0.7 }}
          animate={{ width: 900, height: 900, opacity: 0 }}
          transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.5, ease: "easeOut" }}
        />
      ))}

      {/* floating particles */}
      {Array.from({ length: 14 }).map((_, i) => (
        <motion.span
          key={`p-${i}`}
          className="absolute h-1.5 w-1.5 rounded-full bg-aqua/60"
          initial={{
            x: (Math.random() - 0.5) * 600,
            y: 300,
            opacity: 0,
          }}
          animate={{
            y: -300,
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeOut",
          }}
        />
      ))}

      <motion.div
        initial={{ scale: 0.6, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 1.2, opacity: 0 }}
        transition={{ type: "spring", stiffness: 140, damping: 16 }}
        className="relative"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          <div className="absolute inset-0 rounded-3xl bg-aqua/30 blur-3xl" />
          <img
            src={logo}
            alt="HydroSen"
            className="relative h-64 w-64 sm:h-80 sm:w-80 object-contain drop-shadow-[0_0_40px_rgba(56,189,248,0.5)]"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
