import { motion } from "framer-motion";
import logo from "@/assets/hydrosen-logo.png";

export function LogoIntro() {
  return (
    <div className="fixed inset-0 z-[110] grid place-items-center bg-[#06101f] overflow-hidden">
      {/* radial blend backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(56,189,248,0.18) 0%, rgba(6,16,31,0.95) 55%, #06101f 100%)",
        }}
      />

      {/* expanding water rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-aqua/20"
          initial={{ width: 80, height: 80, opacity: 0 }}
          animate={{ width: 900, height: 900, opacity: [0, 0.5, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1.2 + i * 0.7, ease: "easeOut" }}
        />
      ))}

      {/* falling water droplets in background */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.span
          key={`d-${i}`}
          className="absolute h-1.5 w-1.5 rounded-full bg-aqua/60 blur-[1px]"
          style={{ left: `${12 + i * 10}%` }}
          initial={{ y: "-10vh", opacity: 0 }}
          animate={{ y: "60vh", opacity: [0, 1, 0] }}
          transition={{
            duration: 2.4 + Math.random() * 1.2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeIn",
          }}
        />
      ))}

      {/* logo drop sequence — single smooth motion, no conflicting children animations */}
      <motion.div
        className="relative"
        initial={{ y: -300, opacity: 0, scale: 0.7 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{
          duration: 1.2,
          ease: [0.34, 1.56, 0.64, 1], // gentle bounce, no jitter
        }}
      >
        {/* splash ripple on impact */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-aqua/40"
          initial={{ width: 0, height: 0, opacity: 0 }}
          animate={{ width: 360, height: 360, opacity: [0, 0.7, 0] }}
          transition={{ duration: 1.1, delay: 1.1, ease: "easeOut" }}
        />

        {/* soft aqua glow that blends edges */}
        <div className="absolute inset-0 rounded-full bg-aqua/25 blur-3xl scale-110" />

        {/* logo blended with screen — gentle idle float starts AFTER drop completes */}
        <motion.img
          src={logo}
          alt="HydroSen"
          className="relative h-64 w-64 sm:h-80 sm:w-80 object-contain"
          style={{
            mixBlendMode: "screen",
            WebkitMaskImage:
              "radial-gradient(circle at center, #000 55%, rgba(0,0,0,0.4) 75%, transparent 100%)",
            maskImage:
              "radial-gradient(circle at center, #000 55%, rgba(0,0,0,0.4) 75%, transparent 100%)",
            filter: "drop-shadow(0 0 40px rgba(56,189,248,0.55)) brightness(1.1) contrast(1.05)",
            willChange: "transform",
          }}
          animate={{ y: [0, -5, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.4,
          }}
        />
      </motion.div>

      {/* shimmering bottom water line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(56,189,248,0.25), transparent)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 1.2, delay: 0.8 }}
      />
    </div>
  );
}
