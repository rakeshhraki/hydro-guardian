import { motion } from "framer-motion";
import oceanImg from "@/assets/ocean-bg.jpeg";

export function OceanBackground() {
  return (
    <div className="absolute inset-0 -z-0 overflow-hidden pointer-events-none">
      {/* Realistic underwater photo base — slowly drifts for life */}
      <motion.div
        className="absolute -inset-[6%] bg-cover bg-center"
        style={{ backgroundImage: `url(${oceanImg})` }}
        animate={{ scale: [1, 1.06, 1], x: [0, -10, 0], y: [0, 8, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Caustic shimmer — soft moving light overlay on the surface */}
      <motion.div
        className="absolute inset-0 mix-blend-screen opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 60% 30% at 50% 0%, rgba(186,230,253,0.55), transparent 70%), radial-gradient(ellipse 40% 25% at 30% 5%, rgba(125,211,252,0.4), transparent 70%), radial-gradient(ellipse 35% 25% at 75% 8%, rgba(165,243,252,0.4), transparent 70%)",
          filter: "blur(14px)",
        }}
        animate={{ x: [0, 30, -20, 0], opacity: [0.3, 0.55, 0.3] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Light rays sweeping down */}
      <motion.div
        className="absolute inset-0 mix-blend-screen opacity-25"
        style={{
          background:
            "linear-gradient(180deg, rgba(186,230,253,0.55) 0%, rgba(186,230,253,0.15) 35%, transparent 70%)",
          maskImage:
            "repeating-linear-gradient(100deg, transparent 0px, transparent 80px, black 90px, black 110px, transparent 130px, transparent 200px)",
          WebkitMaskImage:
            "repeating-linear-gradient(100deg, transparent 0px, transparent 80px, black 90px, black 110px, transparent 130px, transparent 200px)",
        }}
        animate={{ backgroundPositionX: ["0%", "100%"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />

      {/* Rising bubbles */}
      {Array.from({ length: 22 }).map((_, i) => {
        const size = 3 + (i % 6) * 2.5;
        const left = (i * 47) % 100;
        const dur = 7 + (i % 7);
        const delay = (i * 0.5) % 9;
        return (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${left}%`,
              bottom: "-30px",
              width: size,
              height: size,
              background:
                "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.95), rgba(186,230,253,0.4) 60%, rgba(186,230,253,0.05) 100%)",
              boxShadow: "inset 0 0 3px rgba(255,255,255,0.7), 0 0 4px rgba(186,230,253,0.4)",
            }}
            initial={{ y: 0, opacity: 0 }}
            animate={{
              y: ["0vh", "-115vh"],
              x: [0, 12, -10, 6, 0],
              opacity: [0, 0.95, 0.95, 0],
            }}
            transition={{ duration: dur, repeat: Infinity, delay, ease: "easeIn" }}
          />
        );
      })}

      {/* Depth vignette — pushes focus to the card */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 55%, transparent 30%, rgba(3,19,43,0.55) 80%, rgba(2,12,28,0.85) 100%)",
        }}
      />
    </div>
  );
}
