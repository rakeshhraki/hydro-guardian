import { useEffect } from "react";
import { useHydroStore } from "./store";

export function useHydroEngine() {
  const tick = useHydroStore(s => s.tick);
  const source = useHydroStore(s => s.system.source);
  const loadFromFlask = useHydroStore(s => s.loadFromFlask);

  useEffect(() => {
    const id = setInterval(() => {
      if (source === "Flask") loadFromFlask();
      else tick();
    }, 5000);
    // immediate first tick
    if (source === "Flask") loadFromFlask(); else tick();
    return () => clearInterval(id);
  }, [tick, source, loadFromFlask]);
}
