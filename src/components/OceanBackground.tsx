import { motion } from "framer-motion";

export function OceanBackground() {
  return (
    <div className="absolute inset-0 -z-0 overflow-hidden pointer-events-none">
      {/* deep ocean gradient base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #03132b 0%, #062a4a 40%, #0a4d6e 75%, #0e6b8a 100%)",
        }}
      />

      {/* god rays from surface */}
      <div
        className="absolute inset-0 opacity-40 mix-blend-screen"
        style={{
          background:
            "radial-gradient(ellipse at 30% -10%, rgba(125,211,252,0.5), transparent 55%), radial-gradient(ellipse at 70% -10%, rgba(56,189,248,0.35), transparent 60%)",
        }}
      />

      {/* moving caustic light */}
      <motion.div
        className="absolute -top-20 left-0 right-0 h-[60%] mix-blend-screen opacity-30"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, rgba(186,230,253,0.6), transparent 40%), radial-gradient(circle at 70% 30%, rgba(125,211,252,0.5), transparent 45%)",
          filter: "blur(20px)",
        }}
        animate={{ x: [0, 40, -20, 0], y: [0, 20, -10, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Animated waves (SVG) */}
      <svg
        className="absolute inset-x-0 top-1/3 w-full h-[55%]"
        viewBox="0 0 1440 600"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="wave1" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#0c4a6e" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="wave2" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#082f49" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="wave3" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#a5f3fc" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#082f49" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        <motion.path
          fill="url(#wave1)"
          animate={{
            d: [
              "M0,160 C240,220 480,80 720,140 C960,200 1200,120 1440,170 L1440,600 L0,600 Z",
              "M0,180 C240,120 480,210 720,160 C960,110 1200,200 1440,140 L1440,600 L0,600 Z",
              "M0,160 C240,220 480,80 720,140 C960,200 1200,120 1440,170 L1440,600 L0,600 Z",
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          fill="url(#wave2)"
          animate={{
            d: [
              "M0,240 C240,300 480,180 720,240 C960,300 1200,200 1440,260 L1440,600 L0,600 Z",
              "M0,260 C240,200 480,300 720,240 C960,180 1200,290 1440,220 L1440,600 L0,600 Z",
              "M0,240 C240,300 480,180 720,240 C960,300 1200,200 1440,260 L1440,600 L0,600 Z",
            ],
          }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          fill="url(#wave3)"
          animate={{
            d: [
              "M0,340 C240,400 480,280 720,340 C960,400 1200,300 1440,360 L1440,600 L0,600 Z",
              "M0,360 C240,300 480,400 720,340 C960,280 1200,390 1440,320 L1440,600 L0,600 Z",
              "M0,340 C240,400 480,280 720,340 C960,400 1200,300 1440,360 L1440,600 L0,600 Z",
            ],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>

      {/* Rising bubbles */}
      {Array.from({ length: 18 }).map((_, i) => {
        const size = 4 + (i % 5) * 3;
        const left = (i * 53) % 100;
        const dur = 6 + (i % 6);
        const delay = (i * 0.6) % 8;
        return (
          <motion.span
            key={i}
            className="absolute rounded-full bg-cyan-200/40 border border-cyan-100/30"
            style={{
              left: `${left}%`,
              bottom: "-20px",
              width: size,
              height: size,
              boxShadow: "inset 0 0 4px rgba(255,255,255,0.6)",
            }}
            initial={{ y: 0, opacity: 0 }}
            animate={{
              y: ["0vh", "-110vh"],
              x: [0, 10, -10, 5, 0],
              opacity: [0, 0.9, 0.9, 0],
            }}
            transition={{
              duration: dur,
              repeat: Infinity,
              delay,
              ease: "easeIn",
            }}
          />
        );
      })}

      {/* Surface shimmer line */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-200/60 to-transparent"
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Soft vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(3,19,43,0.7) 100%)",
        }}
      />
    </div>
  );
}
