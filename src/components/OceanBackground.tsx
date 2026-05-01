import { motion } from "framer-motion";
import oceanImg from "@/assets/ocean-bg.jpeg";

export function OceanBackground() {
  return (
    <div className="absolute inset-0 -z-0 overflow-hidden pointer-events-none">
      {/* Realistic underwater photo base — independent axes for seamless drift */}
      <motion.div
        className="absolute -inset-[8%] bg-cover bg-center will-change-transform"
        style={{ backgroundImage: `url(${oceanImg})` }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 30, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      >
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${oceanImg})` }}
          animate={{ x: [-12, 12] }}
          transition={{ duration: 28, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        />
      </motion.div>

      {/* Caustic shimmer — long, mirrored, no snap */}
      <motion.div
        className="absolute inset-0 mix-blend-screen will-change-transform"
        style={{
          background:
            "radial-gradient(ellipse 60% 30% at 50% 0%, rgba(186,230,253,0.55), transparent 70%), radial-gradient(ellipse 40% 25% at 30% 5%, rgba(125,211,252,0.4), transparent 70%), radial-gradient(ellipse 35% 25% at 75% 8%, rgba(165,243,252,0.4), transparent 70%)",
          filter: "blur(16px)",
        }}
        animate={{ x: [-25, 25], opacity: [0.32, 0.5] }}
        transition={{ duration: 14, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
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
