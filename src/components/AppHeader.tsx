import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { Activity, Droplets, Map as MapIcon, Bell, History, Sliders, Settings, Smartphone, LogOut } from "lucide-react";
import { useHydroStore } from "@/lib/store";
import { useAuth } from "@/lib/authStore";
import { motion } from "framer-motion";

const links = [
  { to: "/", label: "Dashboard", icon: Activity },
  { to: "/map", label: "Map", icon: MapIcon },
  { to: "/alerts", label: "Alerts", icon: Bell },
  { to: "/history", label: "History", icon: History },
  { to: "/control", label: "Control", icon: Sliders },
  { to: "/mobile", label: "Mobile", icon: Smartphone },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function AppHeader() {
  const path = useRouterState({ select: r => r.location.pathname });
  const sim = useHydroStore(s => s.system.simulation);
  const source = useHydroStore(s => s.system.source);
  const notif = useHydroStore(s => s.notifications.length);
  const user = useAuth(s => s.user);
  const logout = useAuth(s => s.logout);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 glass">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2.5">
          <motion.div
            className="relative h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-accent grid place-items-center glow-aqua"
            animate={{ rotate: [0, 3, -3, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
          >
            <Droplets className="h-5 w-5 text-primary-foreground" />
          </motion.div>
          <div className="leading-tight">
            <div className="font-display font-bold text-lg tracking-tight">HydroSense</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Water Intelligence</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1 ml-4">
          {links.map(l => {
            const active = path === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`relative px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {active && (
                  <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-md bg-primary -z-0" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                )}
                <span className="relative z-10 flex items-center gap-1.5"><l.icon className="h-3.5 w-3.5" />{l.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs">
            <span className={`h-2 w-2 rounded-full ${sim ? "bg-[var(--normal)]" : "bg-muted-foreground"} ${sim ? "pulse-ring text-[var(--normal)]" : ""}`} />
            <span className="text-muted-foreground">Source:</span>
            <span className="font-medium">{source}</span>
          </div>
          <Link to="/alerts" className="relative h-9 w-9 grid place-items-center rounded-md glass">
            <Bell className="h-4 w-4" />
            {notif > 0 && (
              <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 grid place-items-center rounded-full bg-[var(--leak)] text-[10px] font-bold text-white">{notif}</span>
            )}
          </Link>
          {user && (
            <button
              onClick={() => { logout(); navigate({ to: "/auth", search: { mode: "login" } }); }}
              title={`Sign out (${user.name})`}
              className="h-9 w-9 grid place-items-center rounded-md glass hover:text-[var(--leak)] transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* mobile nav */}
      <div className="md:hidden flex overflow-x-auto px-3 pb-2 gap-1.5">
        {links.map(l => {
          const active = path === l.to;
          return (
            <Link key={l.to} to={l.to}
              className={`px-2.5 py-1.5 rounded-md text-xs whitespace-nowrap ${active ? "bg-primary text-primary-foreground" : "glass text-muted-foreground"}`}>
              <span className="flex items-center gap-1"><l.icon className="h-3 w-3" />{l.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
