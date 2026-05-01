import { motion } from "framer-motion";
import logo from "@/assets/hydrosen-logo.jpeg";

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
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-aqua/20"
          initial={{ width: 80, height: 80, opacity: 0.6 }}
          animate={{ width: 1000, height: 1000, opacity: 0 }}
          transition={{ duration: 2.8, repeat: Infinity, delay: i * 0.55, ease: "easeOut" }}
        />
      ))}

      {/* falling water droplets */}
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.span
          key={`d-${i}`}
          className="absolute h-2 w-2 rounded-full bg-aqua/70 blur-[1px]"
          style={{ left: `${10 + i * 9}%` }}
          initial={{ y: -120, opacity: 0 }}
          animate={{ y: ["-10vh", "55vh"], opacity: [0, 1, 0] }}
          transition={{
            duration: 2.2 + Math.random() * 1.4,
            repeat: Infinity,
            delay: Math.random() * 2.5,
            ease: "easeIn",
          }}
        />
      ))}

      {/* logo as watermark — drop in, then settle */}
      <motion.div
        initial={{ y: -260, opacity: 0, scale: 0.6 }}
        animate={{
          y: [-260, 0, -8, 0],
          opacity: [0, 0.95, 0.85, 0.9],
          scale: [0.6, 1.05, 0.98, 1],
        }}
        transition={{
          duration: 1.8,
          times: [0, 0.55, 0.78, 1],
          ease: ["easeIn", "easeOut", "easeInOut"] as any,
        }}
        className="relative"
      >
        {/* splash ripple on impact */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-aqua/40"
          initial={{ width: 0, height: 0, opacity: 0 }}
          animate={{ width: [0, 380], height: [0, 380], opacity: [0, 0.8, 0] }}
          transition={{ duration: 1.2, delay: 0.95, ease: "easeOut" }}
        />

        {/* soft aqua glow that blends edges */}
        <div className="absolute inset-0 rounded-full bg-aqua/25 blur-3xl scale-110" />

        {/* logo blended with screen using mix-blend + mask for watermark feel */}
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
          }}
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 1.8 }}
        />
      </motion.div>

      {/* shimmering bottom water line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-24"
        style={{
          background:
            "linear-gradient(to top, rgba(56,189,248,0.25), transparent)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.7, 0.5] }}
        transition={{ duration: 1.5, delay: 1 }}
      />
    </div>
  );
}
