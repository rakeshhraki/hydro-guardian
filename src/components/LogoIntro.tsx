import { motion } from "framer-motion";
import logo from "@/assets/hydrosen-logo.png";

export function LogoIntro() {
  return (
    <motion.div
      className="fixed inset-0 z-[110] grid place-items-center bg-[#06101f] overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* radial blend backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(56,189,248,0.18) 0%, rgba(6,16,31,0.95) 55%, #06101f 100%)",
        }}
      />

      {/* expanding water rings — triggered on droplet impact */}
      {[0, 1].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-aqua/30"
          initial={{ width: 60, height: 60, opacity: 0 }}
          animate={{ width: 700, height: 700, opacity: [0, 0.55, 0] }}
          transition={{ duration: 1.6, delay: 0.8 + i * 0.4, ease: "easeOut" }}
        />
      ))}

      {/* logo drop — fast, smooth, single motion */}
      <motion.div
        className="relative"
        initial={{ y: -260, opacity: 0, scale: 0.7 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
      >
        {/* splash ripple on impact */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-aqua/50"
          initial={{ width: 0, height: 0, opacity: 0 }}
          animate={{ width: 320, height: 320, opacity: [0, 0.8, 0] }}
          transition={{ duration: 0.9, delay: 0.75, ease: "easeOut" }}
        />

        {/* aqua glow */}
        <div className="absolute inset-0 rounded-full bg-aqua/25 blur-3xl scale-110" />

        {/* logo blended with screen */}
        <motion.img
          src={logo}
          alt="HydroSen"
          className="relative h-56 w-56 sm:h-72 sm:w-72 object-contain"
          style={{
            mixBlendMode: "screen",
            WebkitMaskImage:
              "radial-gradient(circle at center, #000 55%, rgba(0,0,0,0.4) 75%, transparent 100%)",
            maskImage:
              "radial-gradient(circle at center, #000 55%, rgba(0,0,0,0.4) 75%, transparent 100%)",
            filter: "drop-shadow(0 0 40px rgba(56,189,248,0.55)) brightness(1.1) contrast(1.05)",
            willChange: "transform",
          }}
        />
      </motion.div>

      {/* shimmering bottom water line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(56,189,248,0.3), transparent)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      />
    </motion.div>
  );
}
